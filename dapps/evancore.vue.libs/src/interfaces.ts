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

/******************************************** interfaces ******************************************/
/**
 * Used to map routes to a route name and a specific component.
 */
export interface RouteRegistrationInterface {
  path: string; // `**`
  name: string; // dapp-loader
  component: any; // DAppLoaderComponent
}

/**
 * Used to map routes path including icon and title for dapp-wrapper sidebar
 */
export interface DAppWrapperRouteInterface {
  fullPath?: string; // '/dashboard.evan/favorites.evan'
  icon: string; // 'fas fa-bookmark'
  path: string; // 'favorites.evan'
  title: string; // '_dashboard.routes.favorites'
}

/**
 * Used to map components to it's template names. (ref.: ./components/registry)
 */
export interface ComponentRegistrationInterface {
  name: string; // `evan-dapp-wrapper`
  component: any; // DAppWrapperComponent
}

/**
 * Used to initialize the evan vue core to startup a whole new vue instance including routes, i18n,
 * components, vuex, ...
 */
export interface EvanVueOptionsInterface {
  components: Array<ComponentRegistrationInterface>;
  container: Element;
  dappBaseUrl: string;
  dappEnsOrContract: string;
  dbcpName: string;
  RootComponent: any;
  routes: Array<RouteRegistrationInterface>;
  state: any;
  translations: any;
  Vue: any;
}
