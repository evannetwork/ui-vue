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
import AddressComponent from './address/address.vue';
import BreadcrumbsComponent from './breadcrumbs/breadcrumbs.vue';
import ButtonComponent from './button/button.vue';
import CardComponent from './card/card.vue';
import ContactBatchComponent from './contact-batch/contact-batch.vue';
import DAppLoaderComponent from './dapp-loader/dapp-loader.vue';
import DAppLoadingComponent from './loading/loading.vue';
import DAppWrapperComponent from './dapp-wrapper/dapp-wrapper.vue';
import DAppWrapperSidebarLevel2Component from './dapp-wrapper-level-2/dapp-wrapper-level-2.vue';
import DropdownComponent from './dropdown/dropdown.vue';
import EvanComponent from '../component';
import FormComponent from './forms/form/form.vue';
import FormControlComponent from './forms/control/control.vue';
import FormControlFilesComponent from './forms/files/files.vue';
import FormControlInputComponent from './forms/input/input.vue';
import FormControlSelectComponent from './forms/select/select.vue';
import IframeComponent from './iframe/iframe.vue';
import LoginComponent from './login/login.vue';
import LogoutComponent from './logout/logout.vue';
import ModalComponent from './modal/modal.vue';
import NavListComponent from './nav-list/nav-list.vue';
import NavTabsComponent from './nav-tabs/nav-tabs.vue';
import ProfilePreview from './profile-preview/profile-preview.vue';
import ProfilePicture from './profile-picture/profile-picture.vue';
import StepsComponent from './steps/steps.vue';
import SuccessComponent from './success/success.vue';
import SwipePanelComponent from './swipe-panel/swipe-panel.vue';
import TooltipComponent from './tooltip/tooltip.vue';
import UnderDevelopmentComponent from './under-development/under-development.vue';

// export them all, so other applications can access them
export {
  AddressComponent,
  BreadcrumbsComponent,
  ButtonComponent,
  CardComponent,
  ContactBatchComponent,
  DAppLoaderComponent,
  DAppLoadingComponent,
  DAppWrapperComponent,
  DAppWrapperSidebarLevel2Component,
  DropdownComponent,
  EvanComponent,
  FormComponent,
  FormControlComponent,
  FormControlFilesComponent,
  FormControlInputComponent,
  FormControlSelectComponent,
  IframeComponent,
  LoginComponent,
  LogoutComponent,
  ModalComponent,
  NavListComponent,
  NavTabsComponent,
  ProfilePreview,
  ProfilePicture,
  StepsComponent,
  SuccessComponent,
  SwipePanelComponent,
  TooltipComponent,
  UnderDevelopmentComponent,
}

// map them to element names, so they can be used within templates
const componentRegistration: Array<ComponentRegistrationInterface> = [
  { name: 'evan-address', component: AddressComponent },
  { name: 'evan-breadcrumbs', component: BreadcrumbsComponent },
  { name: 'evan-button', component: ButtonComponent },
  { name: 'evan-card', component: CardComponent },
  { name: 'evan-contact-batch', component: ContactBatchComponent },
  { name: 'evan-dapp-loader', component: DAppLoaderComponent },
  { name: 'evan-dapp-wrapper', component: DAppWrapperComponent },
  { name: 'evan-dapp-wrapper-level-2', component: DAppWrapperSidebarLevel2Component },
  { name: 'evan-dropdown', component: DropdownComponent },
  { name: 'evan-file-input', component: FormControlFilesComponent },
  { name: 'evan-form', component: FormComponent },
  { name: 'evan-form-control', component: FormControlComponent },
  { name: 'evan-form-control-files', component: FormControlFilesComponent },
  { name: 'evan-form-control-input', component: FormControlInputComponent },
  { name: 'evan-form-control-select', component: FormControlSelectComponent },
  { name: 'evan-iframe', component: IframeComponent },
  { name: 'evan-loading', component: DAppLoadingComponent },
  { name: 'evan-login', component: LoginComponent },
  { name: 'evan-logout', component: LogoutComponent },
  { name: 'evan-modal', component: ModalComponent },
  { name: 'evan-nav-list', component: NavListComponent },
  { name: 'evan-nav-tabs', component: NavTabsComponent },
  { name: 'evan-profile-preview', component: ProfilePreview },
  { name: 'evan-profile-picture', component: ProfilePicture },
  { name: 'evan-steps', component: StepsComponent },
  { name: 'evan-success', component: SuccessComponent },
  { name: 'evan-swipe-panel', component: SwipePanelComponent },
  { name: 'evan-tooltip', component: TooltipComponent },
  { name: 'evan-under-development', component: UnderDevelopmentComponent },
];

export default componentRegistration;
