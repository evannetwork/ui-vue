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

import { PermissionsInterface } from './components/permissions/permissions';

/******************************************** interfaces ******************************************/
/**
 * Used to map routes to a route name and a specific component.
 */
export interface RouteRegistrationInterface {
  beforeEnter?: Function; // optional before enter function
  children?: any;
  component?: any; // DAppLoaderComponent
  name?: string; // dapp-loader
  path: string; // `**`
  redirect?: any;
}

/**
 * Used to map routes path including icon and title for dapp-wrapper sidebar
 */
export interface DAppWrapperRouteInterface {
  fullPath?: string; // '/dashboard.evan/favorites.evan'
  icon: string; // 'mdi mdi-bookmark'
  id?: string; // 'synchronization'
  path?: string; // 'favorites.evan'
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

/**
 * Used to describe the evan form control automatic rendering.
 */
export interface EvanFormControlUISpecs {
  attr?: {
    placeholder?: string;
    error?: string;
    label?: string;
    options?: Array<{ label: string, value: any }>;
    size?: number;
  };
  type: string;
}

/**
 * Represents one generalized form control within an vue form.
 */
export interface EvanFormControlOptions {
  name: string;
  uiSpecs?: EvanFormControlUISpecs;
  validate?: Function;
  value?: any;
}

/**
 * used for contacts in vue select component.
 */
export interface ContactInterface {
  label: string;
  value: string;
}

/**
 * Interface for multiple dataset permissions object.
 */
export interface PermissionsInterface {
  [property: string]: {
    read: boolean,
    readWrite: boolean,
    fields?: string[]
  };
}

/**
 * Defines an object of permission interfaces representing all permission attributes of a data set.
 */
export interface DataSetPermissionsInterface {
  label: string;
  key: string;
  permissions: PermissionsInterface;
}
