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
import * as dappBrowser from '@evan.network/ui-dapp-browser';

// import vue core stuff
import DAppLoaderComponent from './components/dapp-loader/dapp-loader';
import { RouteRegistrationInterface, EvanVueOptionsInterface } from './interfaces';
import { getDomainName } from './utils';

/**
 * Uses the dapps.basehash and appends the given path.
 *
 * @param      {string}  path    route path
 * @param      {any}     dapp    getNextDApp result
 * @return     {string}  The route with correct application base.
 */
export function getRouteWithDAppBase(path: string, dapp: any) {
  // apply the correct absolute nested dapp hash origin
  return `${ dapp.baseHash }/${ path }`;
}

/**
 * Start the routing for a vue application. Clones the original routes and sets the base routing (=
 * current dapp that should be opened).
 *
 * @param      {EvanVueOptionsInterface}  options  Evan vue options
 */
export async function initializeRouting(options: EvanVueOptionsInterface) {
  // apply the router to vue
  options.Vue.use(VueRouter);

  // do not use the original routes array, clone it!
  const routes: Array<RouteRegistrationInterface> = [ ];

  // get the correct base paths
  const dappToLoad = await getNextDApp(options.dappEnsOrContract);

  // prefill routes with base hash
  options.routes.forEach((route) => {
    // clone the route, so we can adjust standalone route objects (without this, dapp.baseHash was
    // applied multiples times to rout.path)
    const clonedRoute = Object.assign({ }, route);

    // apply correct nested dapp path
    clonedRoute.path = getRouteWithDAppBase(clonedRoute.path, dappToLoad);

    // apply correct nested dapp path
    if (clonedRoute.redirect && clonedRoute.redirect.path) {
      clonedRoute.redirect = Object.assign({ }, clonedRoute.redirect);
      clonedRoute.redirect.path = getRouteWithDAppBase(clonedRoute.redirect.path, dappToLoad);
    }

    // apply it to the routes
    routes.push(clonedRoute);
  });

  // add dynamic dapp-loader route
  routes.push({
    path: `${ dappToLoad.baseHash }/**`,
    name: 'dapp-loader-' + (Math.random() + Date.now()),
    component: DAppLoaderComponent
  });

  // initialize vue router using the provided routes
  const router = new VueRouter({
    // base: `${ dappToLoad.baseHash }/`,
    mode: 'hash',
    routes: <any>routes,
  });

  // overwrite origin router.push, to handle correct base hash handling
  const originPush = router.push;
  router.push = (location, onComplete, onAbort) => {
    let newPath = typeof location === 'string' ? location : location.path;

    if (newPath) {
      if (!newPath.startsWith(dappToLoad.baseHash)) {
        newPath = `${ dappToLoad.baseHash }/${ newPath }`;
      }

      window.location.hash = newPath;
    } else {
      return originPush.call(router, location, onComplete, onAbort);
    }
  };

  // start up the router!
  const windowHash = decodeURIComponent(window.location.hash);
  router.push({ path: windowHash.slice(1, windowHash.length) });

  return { dappToLoad, router, };
}

/**
 * Retrieves the url hash path for the next dapp, that should be loaded, by checking the
 * dappEnsOrContract address or by tracing every url hash part and checks, if an element with the
 * dom id exists.
 *
 * Returns ens:
 *   - ens: ens address of the loaded dapp
 *   - contractAddess: optional detected contract address
 *   - baseHash: base of the dapp
 *
 * E.g.: opened url #/dashboard.evan/onboarding.evan
 *
 *   1. dashboard.evan element was not found, start it
 *   2. dashboard.evan/** will be triggered and loads the dapp-loader compoment
 *   3. dapp-loader tracks the url hashes and detects the dashboard.evan/onboarding.evan route and
 *      will start this dapp in the dapp-loader
 *   4. when navigating to /dashboard.evan/digitaltwins.evan, the dapp-loader trackts the url change
 *      and 3. will be started with the new url hash
 *
 * @param      {string}   dappEnsOrContract     The dapp ens or contract (e.g.
 *                                              /dashboard.evan/onboarding.evan)
 */
export async function getNextDApp(dappEnsOrContract?: string) {
  // parse current route by replacing all #/ and /# to handle incorrect navigations
  const currentHash = decodeURIComponent(window.location.hash).split('?')[0];
  // all hash paths in the url
  const ensParts = currentHash.split('/');

  // calculated domain name for quick usage
  const domainName = getDomainName();

  // get module id
  let dappIndex;
  // optional detected contract address, opened dapp can directly be loaded or, in case of an dapp
  // that loads an contract, return it optionally
  let contractAddress;

  // full base hash of the current dapp
  let baseHash;

  if (dappEnsOrContract) {
    // start at index 1 to skip initial hash
    for (let i = 1; i < ensParts.length; i++) {
      // check if the module id machtes the route one
      if (ensParts[i] === dappEnsOrContract) {
        dappIndex = i;
      }
    }
  }

  // if no dappEnsOrContract was applied or this one wasn't found, try to track it dynamically
  if (!dappIndex) {
    // start at index 1 to skip initial hash
    for (let i = 1; i < ensParts.length; i++) {
      // if an dapp ens was applied, only check these module id's
      // if the module id should be checked, try to resolve the dbcp
      if (!document.getElementById(ensParts[i])) {
        try {
          // only load dapps with an valid description
          const description = await dappBrowser.System.import(`${ ensParts[i] }!ens`);
          // ensure, that the dapp wasn't loaded before
          if (description && !document.getElementById(`${ description.name }.${ domainName }`)) {
            dappIndex = i;

            break;
          }
        } catch (ex) {
          // console.log(ex);
        }
      }
    }
  }

  // if no dapp to start is found with the url (e.g. when opening an contract
  // id), load the last url path
  if (typeof dappIndex === 'undefined' && ensParts.length > 0) {
    dappIndex = ensParts.length - 1;
  }

  baseHash = `/${ ensParts.slice(1, dappIndex + 1).join('/') }`;

  // check for loading an contract
  //   => dappIndex loads an contract directly
  //   => it's not the last ens index of the hash, but the next element starts with 0x, so we
  //      assumes to load an contract
  if (ensParts[dappIndex].startsWith('0x')) {
    contractAddress = ensParts[dappIndex];
  } else if (dappIndex < ensParts.length - 1 && ensParts[dappIndex + 1].startsWith('0x')) {
    contractAddress = ensParts[dappIndex + 1];
  }

  return {
    baseHash,
    baseUrl: window.location.href.replace(window.location.hash, '#'),
    contractAddress,
    domainName: getDomainName(),
    ens: ensParts[dappIndex],
    fullUrl: window.location.href.replace(window.location.hash, `#${ baseHash }`),
    rootEns: ensParts[1],
  };
}
