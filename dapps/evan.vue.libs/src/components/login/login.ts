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

// vue imports
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

// evan.network imports
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

@Component({ })
export default class EvanLoginComponent extends Vue {
  /**
   * preload accountId
   */
  accountId = dappBrowser.core.activeAccount();

  // is the current mnemonic / password is currently checking?
  checkingPassword = false;

  /**
   * formular specific variables
   */
  form: any = {
    /**
     * current password input
     */
    password: window.localStorage['evan-test-password'] || '',

    valid: {
      // check if the inserted password is wrong
      password: false
    },

    refs: {
      password: null
    }
  };

  /**
   * Focus the password element.
   */
  mounted() {
    this.form.refs.password = this.$refs['password'];
    this.form.refs.password.focus();

    // automatically login when user has specified a dev password
    if (this.form.password) {
      this.login();
    }
  }

  /**
   * Check the current password input and send the logged in event to the parent component.
   *
   * @param      {any}  event   form submit event
   */
  async login() {
    if (this.form.password.length > 7) {
      this.checkingPassword = true;

      // get the current account id
      try {
        this.form.valid.password = await dappBrowser.bccHelper.isAccountPasswordValid(bcc,
          this.accountId, this.form.password);
      } catch (ex) {
        this.form.valid.password = false;
      }

      // if the password is correct, create the correct active vault in dapp-browser, so other
      // applications can access it
      if (this.form.valid.password) {
        this.$emit('logged-in', this.form.password);
      }

      this.checkingPassword = false;
    }
  }
}
