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
import Component, { mixins } from 'vue-class-component';
import EvanComponent from '../../component';
import Vue from 'vue';
import { Prop, Watch } from 'vue-property-decorator';
import { watch } from 'fs';

interface UserInfoInterface {
  accountName: string,
  type: string,
  isVerified: boolean,
  pictureSrc: string
}

/**
 * Shows a animated "check" icon.
 *
 * @class         SuccessComponent
 * @selector      evan-success
 */
@Component({ })
export default class ProfilePreviewComponent extends mixins(EvanComponent) {
  /**
   * Address of the specific account.
   */
  @Prop() address: string;

  /**
   * Size of the profile preview (sm, lg)
   */
  @Prop({
    default: 'sm'
  }) size: string;

  /**
   * Show loading symbol
   */
  loading = true;

  /**
   * user information (alias, type, verification, ...)
   */
  userInfo: UserInfoInterface = null;

  @Watch('$attrs')
    onChildChanged(val: UserInfoInterface, oldVal: UserInfoInterface) {
      Object.assign(this.userInfo, this.$attrs, { pictureSrc: this.$attrs.src });
    }
  /**
   * Load user specific information
   */
  async created() {
    const runtime = this.getRuntime();

    // load addressbook info
    const addressBook = await runtime.profile.getAddressBook();
    const contact = addressBook.profile[this.address];
    const accountName = contact && contact.alias ? contact.alias : this.address;

    this.userInfo = {
      accountName, // TODO: use the company / user name instead of alias
      type: 'unspecified', // TODO: load from account
      pictureSrc: null, // TODO: load from account
      isVerified: false
    };

    Object.assign(this.userInfo, this.$attrs, { pictureSrc: this.$attrs.src }); // merge attributes when set from parent

    this.loading = false;
  }
}
