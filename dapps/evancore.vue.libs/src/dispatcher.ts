/*
  Copyright (C) 2018-present evan GmbH.

  This program is free software: you can redistribute it and/or modify it
  under the terms of the GNU Affero General Public License, version 3,
  as published by the Free Software Foundation.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  See the GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program. If not, see http://www.gnu.org/licenses/ or
  write to the Free Software Foundation, Inc., 51 Franklin Street,
  Fifth Floor, Boston, MA, 02110-1301 USA, or download the license from
  the following URL: https://evan.network/license/

  You can be released from the requirements of the GNU Affero General Public
  License by purchasing a commercial license.
  Buying such a license is mandatory as soon as you use this software or parts
  of it on other blockchains than evan.network.

  For more information, please contact evan GmbH at this address:
  https://evan.network/license/
*/

// vue imports
import Component, { mixins } from 'vue-class-component';
import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import any from 'vuex-i18n';
import { Prop } from 'vue-property-decorator';

// evan.network imports
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { EvanQueue, Dispatcher, DispatcherInstance } from '@evan.network/ui';
import { getDomainName } from './utils';

/**
 * evan.network vue handler for dispatchers. Adds dispatcher status information to the vuex store.
 *
 * @class      EvanVueDispatcher
 */
export default class EvanVueDispatcherHandler {
  /**
   * Vue instance to access vuex store, ...
   */
  vue: Vue;

  /**
   * Clear active dispatcher watcher.
   */
  dispatcherWatcher: any;

  /**
   * Currents dapp information
   */
  dapp: any;

  /**
   * Currents dapp name
   */
  dappName: string;

  /**
   * List of loaded dispatchers, so dispatcher updates, that were not registered before within this
   * dispatcher, will be loaded.
   */
  loadedDispatchers: Array<string> = [ ];

  /**
   * Current bcc runtime in user context
   */
  runtime: bcc.Runtime;

  /**
   * All dispatcher instances that are currently in error state, mapped from it's full ens address to a bool flag.
   */
  error: any = { };

  /**
   * All dispatcher instances that are currently running, mapped from it's full ens address to a bool flag.
   */
  running: any = { };

  /**
   * All dispatcher instances, mapped from it's full ens address to a array of dispatcher payload objects
   */
  data: any = { };

  /**
   * Includes only dispatcher instances that are running for the active dapp, mapped to the error,
   * running and data scope.
   */
  curr: any = {
    data: { },
    error: { },
    running: { },
  };

  /**
   * Initialize a new vue dispatcher handler
   *
   * @param      {<type>}  this    The object
   */
  constructor(vue: Vue) {
    this.vue = vue;
    this.runtime = vue.$store.state.runtime;
    this.dapp = vue.$store.state.dapp;
    this.dappName = this.dapp.ens;

    vue.$store.state.dispatcher = this;
  }

  /**
   * Load latest dispatcher information.
   */
  async initialize() {
    const queue = await new EvanQueue(this.runtime.activeAccount);
    const dispatchers = await queue.load('*');

    // load all dispatcher instances for this user
    await Promise.all(dispatchers.map(async (dispatcherObj: any) => {
      try {
        const dispatcher = await this.loadDispatcher(dispatcherObj.dispatcherId);
        await Promise.all(Object.keys(dispatcherObj.entries).map(async (instanceId: string) => {
          const entry = dispatcherObj.entries[instanceId];
          const instance = new DispatcherInstance({
            queue,
            dispatcher,
            runtime: this.runtime,
            data: entry.data,
            stepIndex: entry.stepIndex,
            id: instanceId,
            error: entry.error,
            customPrice: entry.customPrice,
          });

          this.handleDispatcherEvent(dispatcher, instance);
        }));
      } catch (ex) {
        console.error(ex.message);
      }
    }));

    // start dispatcher watching
    this.dispatcherWatcher = Dispatcher.watch(
      ($event: any) => this.handleDispatcherEvent($event.detail.dispatcher, $event.detail.instance),
    );
  }

  /**
   * Remove the dispatcher watcher.
   */
  destroy() {
    this.dispatcherWatcher && this.dispatcherWatcher();
  }

  /**
   * Load dispatcher from an ens address or return thee cached one.
   */
  async loadDispatcher(dispatcherId: string) {
    const [ dappEns, dispatcherName ] = dispatcherId.split('|||');
    // load dependencies and dapp content
    await dappBrowser.dapp.loadDAppDependencies(dappEns, false);
    const dapp = await dappBrowser.System.import(`${ dappEns }!dapp-content`);
    const dispatcher = dapp[dispatcherName];

    // add translation to correctly display instance dispatcher titles
    if (dapp.translations) {
      Object
        .keys(dapp.translations)
        .forEach(key => this.vue.$i18n.add(key, dapp.translations[key]));
    }

    // push dispatcher id into the list of already loaded, so we only need to load translations once
    if (this.loadedDispatchers.indexOf(dispatcherId) === -1) {
      this.loadedDispatchers.push(dispatcherId);
    }

    return dispatcher;
  }

  /**
   * Handle dispatcher instance updates and write them to instance
   */
  handleDispatcherEvent(
    dispatcher: Dispatcher,
    instance: DispatcherInstance,
    scope: EvanVueDispatcherHandler = this
  ) {
    const [ dappEns, dispatcherName ] = dispatcher.id.split('|||');
    const isCurr = dappEns === this.dappName;
    const id = scope === this ? dispatcher.id : dispatcherName

    // fill empty data
    scope.data[id] = scope.data[id] || [ ];

    // search for existing dispatcher data
    const found = scope.data[id]
      .find(dataEntry => dataEntry.id === instance.id);
    const foundIndex = found ? scope.data[id].indexOf(found) : -1;

    // if instance has finished it's work, clear it
    if (instance.status === 'finished' || instance.status === 'deleted') {
      found && scope.data[id].splice(foundIndex, 1);
    } else {
      // update the data
      if (foundIndex === -1) {
        scope.data[id].push(instance);
      } else {
        scope.data[id][foundIndex] = instance;
      }
    }

    // clear old data from scope (this, curr)
    if (scope.data[id].length === 0) {
      delete scope.error[id];
      delete scope.running[id];
      delete scope.data[id];
    } else {
      scope.running[id] = true;
      scope.error[id] = scope.data[id]
        .filter((data) => data.status === 'error').length !== 0;
    }

    // allow to handle nested curr object with same logic
    if (scope === this && dappEns === this.dappName) {
      this.handleDispatcherEvent(dispatcher, instance, this.curr);
    } else {
      // send events, so components can easily watch using $on
      this.vue.$emit('dispatcher-update', { dispatcher, instance, status: instance.status, });
    }
  }
}
