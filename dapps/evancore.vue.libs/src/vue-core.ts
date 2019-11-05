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

// import vue libs
import VueMoment from 'vue-moment';
import VueRouter from 'vue-router';
import VueToasted from 'vue-toasted';
import Vuex from 'vuex';
import vuexI18n from 'vuex-i18n';

// setup moment locales
const moment = require('moment').default;

// import evan libs
import * as dappBrowser from '@evan.network/ui-dapp-browser';

// import vue core stuff
import evanComponents from './components/registry';
import evanTranslations from './i18n/translations';
import { ComponentRegistrationInterface, EvanVueOptionsInterface } from './interfaces';
import { getDomainName } from './utils';
import { initializeRouting } from './routing';

/******************************************** functions *******************************************/
/**
 * Starts an evan vue dapp and wraps all start functionallities.
 *
 * @param      {EvanVueOptions}  options  vue options passed by the dapp
 */
export async function initializeVue(options: EvanVueOptionsInterface) {
  const { Vue } = options;

  // disable dev tools on prod
  if (!dappBrowser.utils.devMode) {
    Vue.config.devtools = false;
    Vue.config.debug = false;
    Vue.config.silent = true;
  }

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
  const { dappToLoad, router } = await initializeRouting(options);

  // load the vue evan core to get its origin and access the images
  const vueCoreDbcp = await dappBrowser.System
    .import(`ui.libs.${ getDomainName() }!ens`);
  const uiLibBaseUrl = dappBrowser.dapp.getDAppBaseUrl(vueCoreDbcp,
    `${ vueCoreDbcp.name }.${ getDomainName() }`);

  // initialze VueX
  Vue.use(Vuex);
  const store = new Vuex.Store({
    state: {
      options,
      uiLibBaseUrl,
      dapp: dappToLoad,
      uiState: {
        profile: {
          selectedSharedContacts: [],
        },
        swipePanel: ''
      },
      isLoggedin: false,
      ...options.state,
    },
    mutations: {
      setSelectedSharedContacts (state, contacts = []) {
        state.uiState.profile.selectedSharedContacts = contacts;
      },
      toggleSidePanel (state, type = 'left') {
        // open the desired one
        state.uiState.swipePanel = state.uiState.swipePanel && state.uiState.swipePanel === type ?
          '' : type;
      },
      setLoginState(state, isLoggedin: boolean) {
        state.isLoggedin = isLoggedin;
      }
    }
  });

  // use defined or browser language
  const language = window.localStorage['evan-language'] || navigator.language.split('-')[0];

  // set correct moment language
  const momentLanguages = [ 'en', 'de' ];
  moment.locale(momentLanguages.indexOf(language) === -1 ? 'en' : language);

  // set the i18n values and moment js
  Vue.use(VueMoment, { moment });
  Vue.use(vuexI18n.plugin, store);

  // add all i18n definitions
  registerEvanI18N(Vue, evanTranslations);
  registerEvanI18N(Vue, options.translations);

  // set vuex i18n locale
  Vue.i18n.fallback('en');
  Vue.i18n.set(language);

  // hide the initial loading screen
  dappBrowser.loading.finishDAppLoading();

  // add vue toaster
  Vue.use(VueToasted, {
    duration: 3000,
    position: 'bottom-right',
  });

  const vue = new Vue({
    el: options.container,
    router,
    store,
    render: render => render(options.RootComponent),
    mounted: function () {
      // disable dev tools on prod
      if (!dappBrowser.utils.devMode) {
        delete this.$el.__vue__;
      }

      // add an element id, so the dapp-loader can detect already loaded nested dapps
      this.$el.id = options.dappEnsOrContract;
      this.$el.className += ' evan-vue-dapp';
      // apply the contract address as the id, so the dapp will not be loaded duplicated, when the
      // contract address is opened under a dapp ens
      if (dappToLoad.contractAddress) {
        const contractAddressEl = document.createElement('div');
        contractAddressEl.id = `${ dappToLoad.contractAddress }`;
        contractAddressEl.style.display = 'none';
        this.$el.appendChild(contractAddressEl);
      }

      // move toast container
      this.$el.appendChild(this.$toasted.container);
    }
  });

  // register event handlers, so multiple vue instance and removed dom elements will be destroyed
  // correctly
  registerEventHandlers(vue);

  return vue;
}

/**
 * Registers the components within Vue. If a name is specified, register it also as component, not
 * only for routing.
 *
 * @param      {any}                                  Vue         vue prototype
 * @param      {ArrayComponentRegistrationInterface}  components  components that should be registered
 */
export function registerComponents(Vue: any, components: Array<ComponentRegistrationInterface>) {
  // include all components
  components.forEach((def: ComponentRegistrationInterface) => {
    // Vue.options.components[def.name] !== def.component
    // do not overwrite the existing componet, only register the new component if it has changed
    if (!Vue.options.components[def.name]) {
      // register the component
      Vue.component(def.name, def.component);
    }
  });
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
}

/**
 * Vue does not trigger correct destroy events when a vue application is removed from the dom or
 * when the browser is freshed. This will cause uncleared watchers and memory leaks. This function
 * binds window unload event handlers and a vue base element MutationObserver, so we can trigger
 * correct vue destroy events when DApps are removed from the dom.
 *
 * @param      {Vue}  vueInstance  initialized vue instance
 */
export function registerEventHandlers(vueInstance: any) {
  const beforeUnload = () => {
    window.localStorage['evan-recovery-url'] = window.location.href;
    vueInstance.$destroy();
  };

  window.addEventListener('beforeunload', beforeUnload);

  // Create an observer instance to watch parentElements changes
  const elementObserver = new MutationObserver(() => {
    let parent = vueInstance.$el;

    // check if the current element is attached to the dom, else, destroy the vue instance
    do {
      parent = parent.parentElement;

      if (!parent) {
        // clear window.localStorage['evan-recovery-url'] when a new dapp was opened, so recovery
        // will expire
        delete window.localStorage['evan-recovery-url'];

        // clear listeners
        vueInstance.$destroy();
        elementObserver.disconnect();
        setTimeout(() => window.removeEventListener('beforeunload', beforeUnload));
      }
    } while (parent && parent !== document.body);
  });

  // Start observing the target node for configured mutations
  elementObserver.observe(vueInstance.$el.parentElement, { childList: true, subtree: true });
}

