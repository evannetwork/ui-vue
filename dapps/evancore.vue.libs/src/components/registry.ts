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
import DAppLoader from './dapp-loader/dapp-loader.vue';
import DAppLoading from './loading/loading.vue';
import DAppWrapper from './dapp-wrapper/dapp-wrapper.vue';
import DAppWrapperSidebarLevel2 from './dapp-wrapper-level-2/dapp-wrapper-level-2.vue';
import Login from './login/login.vue';
import Logout from './logout/logout.vue';
import Modal from './modal/modal.vue';
import Success from './success/success.vue';
import EvanIframe from './iframe/iframe.vue';

// export them all, so other applications can access them
export {
  DAppLoader,
  DAppLoading,
  DAppWrapper,
  DAppWrapperSidebarLevel2,
  EvanIframe,
  Login,
  Logout,
  Modal,
  Success,
}

// map them to element names, so they can be used within templates
const componentRegistration: Array<ComponentRegistrationInterface> = [
  { name: 'evan-dapp-loader', component: DAppLoader },
  { name: 'evan-dapp-wrapper', component: DAppWrapper },
  { name: 'evan-dapp-wrapper-level-2', component: DAppWrapperSidebarLevel2 },
  { name: 'evan-iframe', component: EvanIframe },
  { name: 'evan-loading', component: DAppLoading },
  { name: 'evan-login', component: Login },
  { name: 'evan-logout', component: Logout },
  { name: 'evan-modal', component: Modal },
  { name: 'evan-success', component: Success },
];

export default componentRegistration;
