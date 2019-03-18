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

// import vue libs
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import vuexI18n from 'vuex-i18n';

// import evan libs
import { dapp, getDomainName, lightwallet,  System, utils } from '@evan.network/ui-dapp-browser';

// import vue core stuff
import evanComponents from './components/registry';
import DAppLoaderComponent from './components/dapp-loader/dapp-loader';
import evanTranslations from './i18n/translations';
import {
  RouteRegistrationInterface,
  ComponentRegistrationInterface,
  EvanVueOptionsInterface
} from './interfaces';

/******************************************** functions *******************************************/
/**
 * Stats an evan vue dapp and wraps all start functinalities.
 *
 * @param      {EvanVueOptions}  options  vue options passed by the dapp
 */
export async function initializeVue(options: EvanVueOptionsInterface) {
  const { Vue } = options;

  // never replace the full container, other elements can be placed within this container directly
  //  => create new child element
  if (options.container === document.body) {
    options.container = document.createElement('div');
    document.body.appendChild(options.container);
  }

  // initialize Vuex and setup vue core components
  registerComponents(Vue, evanComponents);
  // register custom components
  registerComponents(Vue, options.components);

  // setup dapp routing
  const { routeBaseHash, router } = initializeRouting(Vue, options.dbcpName, options.routes);

  // load the vue evan core to get its origin and access the images
  const vueCoreDbcp = await System.import('@evan.network/ui!ens');
  const uiLibBaseUrl = dapp.getDAppBaseUrl(vueCoreDbcp,
    `${ vueCoreDbcp.name }.${ getDomainName() }`);

  // initialze VueX
  Vue.use(Vuex);
  const store = new Vuex.Store({
    state: {
      dappBaseUrl: options.dappBaseUrl,
      routeBaseHash,
      uiLibBaseUrl,
      ...options.state
    },
  });

  // set the i18n values
  Vue.use(vuexI18n.plugin, store);

  // add all i18n definitions
  registerEvanI18N(Vue, evanTranslations);
  registerEvanI18N(Vue, options.translations);

  // use defined or browser language
  Vue.i18n.set(window.localStorage['evan-language'] || navigator.language.split('-')[0]);

  return new Vue({
    el: options.container,
    router,
    store,
    render: render => render(options.RootComponent),
    mounted: function () {
      // add an element id, so the dapp-loader can detect already loaded nested dapps
      this.$el.id = options.dbcpName;
    }
  });
}

/**
 * Registers the components within Vue. If a name is specified, register it also as component, not
 * only for routing.
 *
 * @param      {any}     Vue     vue prototype
 */
export function registerComponents(Vue: any, components: Array<ComponentRegistrationInterface>) {
  // include all components
  components.forEach((def: ComponentRegistrationInterface) => {
    // register the component
    Vue.component(def.name, def.component);
  });
}

/**
 * Start the routing for a vue application.
 *
 * @param      {any}                Vue       vue prototype
 * @param      {string}             dbcpName  current inserted dbcp name to map relative paths to it
 * @param      {ArrayEvanVueRoute}  routes    routes that should be added
 */
export function initializeRouting(Vue: any, dbcpName: string, routes: Array<RouteRegistrationInterface>) {
  Vue.use(VueRouter);

  // get the correct base paths
  const baseDAppName = `${ dbcpName }.${ getDomainName() }`;
  const split = window.location.hash.split(baseDAppName);
  const beforePath = split[0];
  const routeBaseHash = (beforePath + baseDAppName).replace('#', '');
  const rootRoute = `${ routeBaseHash }${ split[1] || '' }`;

  // add initialy provided routes
  [
    // add dynamic dapp
    { path: `${ routeBaseHash }/**`, name: 'dapp-loader', component: DAppLoaderComponent },
  ].forEach((defaultRoute: RouteRegistrationInterface) => routes.push(defaultRoute));

  // initialize vue router using the provided routes
  const router = new VueRouter({ base: routeBaseHash, routes: routes });
  // start up the router!
  router.push({ path: rootRoute });

  return { routeBaseHash, router, };
}

/**
 * Register the current translations within vueJS.
 *
 * @param      {any}  Vue           vue prototype
 * @param      {any}  translations  key value object of languages ({ 'de': { ... } })
 */
export function registerEvanI18N(Vue: any, translations: any) {
  // add all i18n definitions
  Object.keys(translations).forEach(key => Vue.i18n.add(key, translations[key]));
};
