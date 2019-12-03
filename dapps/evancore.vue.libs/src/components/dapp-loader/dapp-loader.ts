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
*/

// vue imports
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

// evan.network imports
import { getNextDApp } from '../../routing';
import EvanComponent from '../../component';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

/**
 * Dynamic component that loads the next not loaded dapp within the window location hash.
 *
 * @class         DAppLoaderComponent
 * @selector      evan-dapp-loader
 */
@Component({ })
export default class DAppLoaderComponent extends mixins(EvanComponent) {
  /**
   * save the latest dapp path that was started, so we can check on an hash change, if the dapp for
   * this dapp loader has been changed.
   */
  startedDApp: any;

  /**
   * Watch for hash updates and start a new dapp, when the corresponding hash for this dapp-loader
   * has been changed
   */
  hashChangeWatcher: any;

  /**
   * no valid dapp could be found for this route
   */
  dappNotFound: boolean;

  /**
   * Was the component destroyed, before the hash change event was bind?
   */
  wasDestroyed: boolean;

  /**
   * Start the dapp directly and create an hash change watcher, so we can react on hash changes to
   * reload the dapp or to start another one.
   */
  async mounted() {
    await this.startDApp();

    // set the hash change watcher, so we can remove it on component destroy
    const dappLoader = this;
    this.hashChangeWatcher = function() {
      // if the startedDapp for this hash level has been changed, load the new dapp
      if (!window.location.hash.startsWith(`#${ dappLoader.startedDApp.baseHash }`)) {
        dappLoader.startDApp();
      }
    };

    // add the hash change listener
    window.addEventListener('hashchange', this.hashChangeWatcher);

    // clear the watcher if the component was already destroyed
    if (this.wasDestroyed) {
      this.beforeDestroy();
    }
  }

  /**
   * Clear the hash change watcher
   */
  beforeDestroy() {
    this.wasDestroyed = true;

    // only remove the hashChangeWatcher, when it was already bind (asynchronious call can take
    // longer and the dapp was switched before)
    if (this.hashChangeWatcher) {
      // remove the hash change listener
      window.removeEventListener('hashchange', this.hashChangeWatcher);
    }
  }

  /**
   * Searches for the next dapp in the url that should be started and run it
   */
  async startDApp() {
    // clear everything, that was loaded before
    // !IMPORTANT: clear the inner html before running getNextDApp
    //   => it will check for elements dapp names as id's, to check which dapp was already loaded
    //   => by forcing dapp loading under an other domain, will cause false domain loading
    this.$el.innerHTML = `
      <div class="evan-loading w-100 h-100 pt-5 pb-5 text-center">
        <div class="spinner-border text-primary"></div>
      </div>
    `;
    // save loading el, so it can be removed after the dapp was started
    const loadingEl = this.$el.children[0];

    // get module id
    this.startedDApp = await getNextDApp();

    // create a new container el, vue will replace this element
    const containerEl = document.createElement('div');
    this.$el.appendChild(containerEl);

    // startup the dapp
    await dappBrowser.dapp.startDApp(this.startedDApp.ens, containerEl);

    // remove loading element
    if (loadingEl.parentElement) {
      loadingEl.parentElement.removeChild(loadingEl);
    }
  }
}
