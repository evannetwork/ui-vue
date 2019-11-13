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
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

// evan.network imports
import EvanComponent from '../../component';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { getDomainName } from '../../utils';

/**
 * Handles the password input of a user and checks, if it's correct and it's profile can be
 * encrypted with that password. Used by the dapp-wrapper to login the current user if needed. Will
 * send an `logged-in` event including the users provided password.
 *
 * TODO: Rethink the naming. We have sign-in, sign-up, signed-in and login (this)
 *
 * @class         LoginComponent
 * @selector      evan-login
 */
@Component
export default class LoginComponent extends mixins(EvanComponent) {
  /**
   * preload accountId
   */
  // accountId = dappBrowser.core.activeAccount();
  @Prop() accountId: string;
  @Prop({ required: false }) mnemonic: string;
  @Prop({ default: false }) showSignup: boolean;

  alias: string | null;

  checkingPassword = false;

  /**
   * form specific variables
   */
  form = {
    /**
     * current password input
     */
    password: {
      value: window.localStorage['evan-test-password'] || '',
      valid: false,
      dirty: false,
      ref: null
    }
  };

  created() {
    this.alias = window.localStorage.getItem('evan-alias');

    // fill alias, when it wasn't cached before and we are not within the onboarding
    if (!this.alias && this.$route.hash.indexOf(`onboarding.vue.${ getDomainName() }`) === -1) {
      this.alias = this.$t('_evan.login-missing-alias');
    }
  }

  mounted() {
    // Focus the password input.
    this.form.password.ref = this.$refs['password'];
    this.form.password.ref.focus();

    // automatically login when user has specified a dev password
    if (this.form.password.value) {
      this.login();
    }
  }

  /**
   * Check the current password input and send the logged in event to the parent component.
   */
  async login() {
    if (this.form.password.value.length > 7) {
      this.checkingPassword = true;

      // get the current account id
      try {
        this.form.password.valid = await dappBrowser.bccHelper.isAccountPasswordValid(
          bcc,
          this.accountId,
          this.form.password.value
        );
      } catch (ex) {
        this.form.password.value = false;
      }

      // if the password is correct, create the correct active vault in dapp-browser, so other
      // applications can access it
      if (this.form.password.valid) {
        this.$emit('logged-in', this.form.password.value);
        // mnemonic available during onboarding
        if (this.mnemonic) {
          await dappBrowser.lightwallet.createVaultAndSetActive(
            this.mnemonic,
            this.form.password.value
          );
        }

        if (this.dapp.baseHash.endsWith(`onboardin.vue.${ getDomainName() }`)) {
          dappBrowser.core.setCurrentProvider('internal');
          window.location.hash = `/${this.$route.query.origin ||
            `dashboard.vue.${ getDomainName() }`}`;
        }
      } else {
        // only enable button when password is invalid
        this.checkingPassword = false;
      }

      this.form.password.dirty = true;
    }
  }
}
