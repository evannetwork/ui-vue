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
import vuexI18n from 'vuex-i18n';
import { Prop } from 'vue-property-decorator';

// evan.network imports
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { getDomainName } from './utils';

@Component({ })
export default class EvanComponent extends Vue {
  /**
   * active dapp that was detected by the routing lib (getNextDApp)
   */
  dapp: any;

  /**
   * Active dapp browser domain name
   */
  domainName: string;

  /**
   * Declare vue stuff
   */
  $i18n: vuexI18n;
  $router: VueRouter;
  $store: any;
  $t: any;

  constructor() {
    super();

    this.dapp = this.activeDApp();
    this.domainName = getDomainName();
  }

  /**
   * Specify a custom navigation method for evan vue projects.
   */
  evanNavigate(path: string, baseHash: string = this.activeDApp().baseHash) {
    window.location.hash = `${ baseHash }/${ path }`;
  }

  /**
   * Returns the active dapp object, including the current contract address, route base hash and
   * ens address
   *
   * @return     {any}  routing.getNextDApp result
   */
  activeDApp() {
    return this.$store.state.dapp;
  }

  /**
   * Returns the current runtime from the state or returns an dappBrowser core runtime.
   *
   * @return     {any}  bcc runtime
   */
  getRuntime() {
    return this.$store.state.runtime || dappBrowser.bccHelper.getCoreRuntime();
  }
}
