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

// vue imports
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

// evan.network imports
import EvanComponent from '../../component';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

/**
 * Handles user logout. Directly provides a button, that triggers a logout accept modal. Logs out
 * the user, if modal gets accepted. Optionally, the button can be disabled and the modal can be
 * triggered using vue refs.
 *
 * @class         EvanLogout
 * @selector      evan-logout
 */
@Component({ })
export default class EvanLogout extends mixins(EvanComponent) {
  /**
   * Dont show any button
   */
  @Prop({ default: false }) disableButton;

  /**
   * Show the logout modal
   */
  logout() {
    (<any>this.$refs.logoutModal).show();
  }

  /**
   * Logout the user.
   */
  runLogout() {
    dappBrowser.core.logout();
  }
}
