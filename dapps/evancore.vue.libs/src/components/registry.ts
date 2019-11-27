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

// import evan libs
import { ComponentRegistrationInterface } from '../interfaces';

// import all components
import AddressComponent from './address/address.vue';
import BaseList from './lists/base-list/base-list.vue';
import BreadcrumbsComponent from './breadcrumbs/breadcrumbs.vue';
import ButtonComponent from './button/button.vue';
import CardComponent from './card/card.vue';
import ContactBatchComponent from './contact-batch/contact-batch.vue';
import DAppLoaderComponent from './dapp-loader/dapp-loader.vue';
import DAppLoadingComponent from './loading/loading.vue';
import DAppWrapperComponent from './dapp-wrapper/dapp-wrapper.vue';
import DAppWrapperSidebarLevel2Component from './dapp-wrapper-level-2/dapp-wrapper-level-2.vue';
import DropdownComponent from './dropdown/dropdown.vue';
import EvanCheckboxComponent from './forms/checkbox/checkbox.vue';
import EvanComponent from '../component';
import FailedComponent from './failed/failed.vue';
import FormComponent from './forms/form/form.vue';
import FormControlCheckboxComponent from './forms/checkbox/checkbox-control.vue';
import FormControlComponent from './forms/control/control.vue';
import FormControlFilesComponent from './forms/files/files.vue';
import FormControlInputComponent from './forms/input/input.vue';
import FormControlSelectComponent from './forms/select/select.vue';
import FormControlTextareaComponent from './forms/textarea/textarea.vue';
import FormControlVSelectComponent from './forms/v-select/v-select.vue';
import IframeComponent from './iframe/iframe.vue';
import LoginComponent from './login/login.vue';
import LogoutComponent from './logout/logout.vue';
import MnemonicExport from './dapp-wrapper/mnemonic-export/mnemonic-export.vue';
import ModalComponent from './modal/modal.vue';
import NavListComponent from './nav-list/nav-list.vue';
import NavTabsComponent from './nav-tabs/nav-tabs.vue';
import PermissionsComponent from './permissions/permissions.vue';
import PermissionsEditorComponent from './permissions-editor/permissions-editor.vue';
import ProfilePicture from './profile/profile-picture/profile-picture.vue';
import ProfilePreview from './profile/profile-preview/profile-preview.vue';
import QRCodeComponent from './qr-code/qr-code.vue';
import SharedContact from './lists/shared-contact/shared-contact.vue';
import StepsComponent from './steps/steps.vue';
import SuccessComponent from './success/success.vue';
import SwipePanelComponent from './swipe-panel/swipe-panel.vue';
import TooltipComponent from './tooltip/tooltip.vue';
import UnderDevelopmentComponent from './under-development/under-development.vue';
import vSelect from 'vue-select';
import WalletCardComponent from './profile/wallet-card/wallet-card.vue';

// export them all, so other applications can access them
export {
  AddressComponent,
  BaseList,
  BreadcrumbsComponent,
  ButtonComponent,
  CardComponent,
  ContactBatchComponent,
  DAppLoaderComponent,
  DAppLoadingComponent,
  DAppWrapperComponent,
  DAppWrapperSidebarLevel2Component,
  DropdownComponent,
  EvanCheckboxComponent,
  EvanComponent,
  FailedComponent,
  FormComponent,
  FormControlCheckboxComponent,
  FormControlComponent,
  FormControlFilesComponent,
  FormControlInputComponent,
  FormControlSelectComponent,
  FormControlTextareaComponent,
  FormControlVSelectComponent,
  IframeComponent,
  LoginComponent,
  LogoutComponent,
  ModalComponent,
  NavListComponent,
  NavTabsComponent,
  PermissionsComponent,
  PermissionsEditorComponent,
  ProfilePicture,
  ProfilePreview,
  QRCodeComponent,
  SharedContact,
  StepsComponent,
  SuccessComponent,
  SwipePanelComponent,
  TooltipComponent,
  UnderDevelopmentComponent,
  WalletCardComponent,
};

// map them to element names, so they can be used within templates
const componentRegistration: Array<ComponentRegistrationInterface> = [
  { name: 'evan-address', component: AddressComponent },
  { name: 'evan-base-list', component: BaseList },
  { name: 'evan-breadcrumbs', component: BreadcrumbsComponent },
  { name: 'evan-button', component: ButtonComponent },
  { name: 'evan-card', component: CardComponent },
  { name: 'evan-checkbox', component: EvanCheckboxComponent },
  { name: 'evan-contact-batch', component: ContactBatchComponent },
  { name: 'evan-dapp-loader', component: DAppLoaderComponent },
  { name: 'evan-dapp-wrapper-level-2', component: DAppWrapperSidebarLevel2Component },
  { name: 'evan-dapp-wrapper', component: DAppWrapperComponent },
  { name: 'evan-dropdown', component: DropdownComponent },
  { name: 'evan-failed', component: FailedComponent },
  { name: 'evan-file-input', component: FormControlFilesComponent },
  { name: 'evan-form-control-checkbox', component: FormControlCheckboxComponent },
  { name: 'evan-form-control-files', component: FormControlFilesComponent },
  { name: 'evan-form-control-input', component: FormControlInputComponent },
  { name: 'evan-form-control-select', component: FormControlSelectComponent },
  { name: 'evan-form-control-textarea', component: FormControlTextareaComponent },
  { name: 'evan-form-control-v-select', component: FormControlVSelectComponent },
  { name: 'evan-form-control', component: FormControlComponent },
  { name: 'evan-form', component: FormComponent },
  { name: 'evan-iframe', component: IframeComponent },
  { name: 'evan-loading', component: DAppLoadingComponent },
  { name: 'evan-login', component: LoginComponent },
  { name: 'evan-logout', component: LogoutComponent },
  { name: 'evan-mnemonic-export', component: MnemonicExport },
  { name: 'evan-modal', component: ModalComponent },
  { name: 'evan-nav-list', component: NavListComponent },
  { name: 'evan-nav-tabs', component: NavTabsComponent },
  { name: 'evan-permissions-editor', component: PermissionsEditorComponent },
  { name: 'evan-permissions', component: PermissionsComponent },
  { name: 'evan-profile-picture', component: ProfilePicture },
  { name: 'evan-profile-preview', component: ProfilePreview },
  { name: 'evan-qr-code', component: QRCodeComponent },
  { name: 'evan-shared-contact', component: SharedContact },
  { name: 'evan-steps', component: StepsComponent },
  { name: 'evan-success', component: SuccessComponent },
  { name: 'evan-swipe-panel', component: SwipePanelComponent },
  { name: 'evan-tooltip', component: TooltipComponent },
  { name: 'evan-under-development', component: UnderDevelopmentComponent },
  { name: 'evan-v-select', component: vSelect },
  { name: 'evan-wallet-card', component: WalletCardComponent },
];

export default componentRegistration;
