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

import Vue from 'vue';
import Vuex from 'vuex';
import vuexI18n from 'vuex-i18n';
import { getDomainName, lightwallet, utils, System, dapp } from 'dapp-browser';
import { initializeRouting, router, basePath } from './routing';
import { VueCoreEvan } from '@evan.network/vue-core';

import Main from './components/main.vue';
import { registerComponents } from './registration';
import { useI18N } from './i18n/translate';

import './style/core.scss';

/**
 * StartDapp function that is called by the ui-dapp-browser, including an container and the current
 * dbcp. So startup, it's evan time!
 *
 * @param      {any}     container    container element
 * @param      {string}  dbcpName     dbcp name of the dapp
 * @param      {string}  dappEns      original ens / contract address that were loaded
 * @param      {string}  dappBaseUrl  origin of the dapp
 */
export async function startDApp(container: any, dbcpName: any, dappEns: any, dappBaseUrl: any) {
  if (container === document.body) {
    container = document.createElement('div');
    document.body.appendChild(container);
  }

  // start routing
  registerComponents(Vue);
  initializeRouting(dbcpName);

  // use evan-core components
  Vue.use(Vuex);
  Vue.use(VueCoreEvan);

  // initialize vuex & i18n
  const store = new Vuex.Store({
    state: {
      dappBaseUrl,
      urlBasePath: basePath,
    },
  });
  useI18N(Vue, store);

  // initialize vue
  const vue = new Vue({
    el: container,
    render: h => h(Main),
    router,
    store,
  });

  // configure material evan style
  (<any>vue).$material.theming.theme = 'evan'; // tslint:disable-line
}
