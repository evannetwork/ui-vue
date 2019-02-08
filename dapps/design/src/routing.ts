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
import VueRouter from 'vue-router';
import { getDomainName } from 'dapp-browser';

import overviewComponent from './components/overview.vue';
import TestComponent from './components/test.vue';

/**
 * export them, so they can be used everywhere
 */
export let router: any;
export let basePath: any;

function getRoutes() {
  return [
    { path: `${ basePath }`, name: 'overview', component: overviewComponent },
    { path: `${ basePath }/favorites`, name: 'favorites', component: TestComponent },
    { path: `${ basePath }/contacts`, name: 'contacts', component: TestComponent },
    { path: `${ basePath }/mailbox`, name: 'mailbox', component: TestComponent },
    { path: `${ basePath }/profile`, name: 'profile', component: TestComponent },
  ];
}

/**
 * Start the routing for the current application.
 *
 * @param      {string}  dbcpName  current inserted dbcp name to map relative paths to it
 */
export function initializeRouting(dbcpName: string) {
  Vue.use(VueRouter);

  // get the correct base paths
  const baseDAppName = `${ dbcpName }.${ getDomainName() }`;
  const split = window.location.hash.split(baseDAppName);
  const beforePath = split[0];
  basePath = (beforePath + baseDAppName).replace('#', '');

  

console.log(`${ basePath }/favorites`)

  // initialize vue router using the provided routes
  router = new VueRouter({ base: basePath, routes: getRoutes() });

  // start up the router!
  router.push({ path: `${ basePath }${ split[1] || '' }` });
}
