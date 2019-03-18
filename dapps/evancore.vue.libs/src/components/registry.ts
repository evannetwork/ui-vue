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

// import evan libs
import { ComponentRegistrationInterface } from '../interfaces';

// import all components
import DAppLoaderComponent from './dapp-loader/dapp-loader.vue';
import DAppWrapperComponent from './dapp-wrapper/dapp-wrapper.vue';
import DAppWrapperSidebarLevel2Component from './dapp-wrapper-level-2/dapp-wrapper-level-2.vue';
import EvanLoadingComponent from './loading/loading.vue';
import EvanLoginComponent from './login/login.vue';
import SuccessComponent from './success/success.vue';

// export them all, so other applications can access them
export {
  DAppLoaderComponent,
  DAppWrapperComponent,
  DAppWrapperSidebarLevel2Component,
  EvanLoadingComponent,
  EvanLoginComponent,
  SuccessComponent,
}

// map them to element names, so they can be used within templates
const componentRegistration: Array<ComponentRegistrationInterface> = [
  { name: 'evan-dapp-loader', component: DAppLoaderComponent },
  { name: 'evan-dapp-wrapper', component: DAppWrapperComponent },
  { name: 'evan-dapp-wrapper-level-2', component: DAppWrapperSidebarLevel2Component },
  { name: 'evan-loading', component: EvanLoadingComponent },
  { name: 'evan-login', component: EvanLoginComponent },
  { name: 'evan-success', component: SuccessComponent },
];

export default componentRegistration;
