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
import BreadcrumbsComponent from './breadcrumbs/breadcrumbs.vue';
import ButtonComponent from './button/button.vue';
import ContactBatchComponent from './contact-batch/contact-batch.vue';
import ComponentsOverview from './components-overview/components-overview.vue';
import DAppLoaderComponent from './dapp-loader/dapp-loader.vue';
import DAppLoadingComponent from './loading/loading.vue';
import DAppWrapperComponent from './dapp-wrapper/dapp-wrapper.vue';
import DAppWrapperSidebarLevel2Component from './dapp-wrapper-level-2/dapp-wrapper-level-2.vue';
import DropdownComponent from './dropdown/dropdown.vue';
import EvanComponent from '../component';
import FileInputComponent from './files/files.vue';
import IframeComponent from './iframe/iframe.vue';
import UnderDevelopmentComponent from './under-development/under-development.vue';
import LoginComponent from './login/login.vue';
import LogoutComponent from './logout/logout.vue';
import ModalComponent from './modal/modal.vue';
import NavTabsComponent from './nav-tabs/nav-tabs.vue';
import SuccessComponent from './success/success.vue';
import TooltipComponent from './tooltip/tooltip.vue';

// export them all, so other applications can access them
export {
  BreadcrumbsComponent,
  ButtonComponent,
  ContactBatchComponent,
  ComponentsOverview,
  DAppLoaderComponent,
  DAppLoadingComponent,
  DAppWrapperComponent,
  DAppWrapperSidebarLevel2Component,
  DropdownComponent,
  EvanComponent,
  FileInputComponent,
  IframeComponent,
  LoginComponent,
  LogoutComponent,
  ModalComponent,
  NavTabsComponent,
  SuccessComponent,
  TooltipComponent,
  UnderDevelopmentComponent,
}

// map them to element names, so they can be used within templates
const componentRegistration: Array<ComponentRegistrationInterface> = [
  { name: 'evan-breadcrumbs', component: BreadcrumbsComponent },
  { name: 'evan-button', component: ButtonComponent },
  { name: 'evan-contact-batch', component: ContactBatchComponent },
  { name: 'evan-components-overview', component: ComponentsOverview },
  { name: 'evan-dapp-loader', component: DAppLoaderComponent },
  { name: 'evan-dapp-wrapper', component: DAppWrapperComponent },
  { name: 'evan-dapp-wrapper-level-2', component: DAppWrapperSidebarLevel2Component },
  { name: 'evan-dropdown', component: DropdownComponent },
  { name: 'evan-file-input', component: FileInputComponent },
  { name: 'evan-iframe', component: IframeComponent },
  { name: 'evan-loading', component: DAppLoadingComponent },
  { name: 'evan-login', component: LoginComponent },
  { name: 'evan-logout', component: LogoutComponent },
  { name: 'evan-modal', component: ModalComponent },
  { name: 'evan-success', component: SuccessComponent },
  { name: 'evan-tooltip', component: TooltipComponent },
  { name: 'evan-nav-tabs', component: NavTabsComponent },
  { name: 'evan-under-development', component: UnderDevelopmentComponent },
];

export default componentRegistration;
