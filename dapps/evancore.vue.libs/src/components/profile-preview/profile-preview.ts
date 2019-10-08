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

import { Dispatcher, cloneDeep, FileHandler, } from '@evan.network/ui';
import * as bcc from '@evan.network/api-blockchain-core';

// vue imports
import Component, { mixins } from 'vue-class-component';
import EvanComponent from '../../component';
import Vue from 'vue';
import { Prop, Watch } from 'vue-property-decorator';
import { watch } from 'fs';

interface UserInfoInterface {
  accountName: string,
  profileType: string,
  isVerified: boolean,
  picture: any;
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
   * Enable edit mode for the picture and the account name.
   */
  @Prop() editable: string;

  /**
   * Show loading symbol
   */
  loading = true;

  /**
   * user information (alias, type, verification, ...)
   */
  userInfo: UserInfoInterface = null;
  originUserInfo: UserInfoInterface = null;

  /**
   * Watch for dispatcher updates
   */
  listeners: Array<any> = [ ];

  /**
   * Show a save button when everything has changed
   */
  showSave = false;

  /**
   * Replace the current Account name with an edit box and show save buttons
   */
  isEditMode = false;

  @Watch('$attrs')
    onChildChanged(val: UserInfoInterface, oldVal: UserInfoInterface) {
      Object.assign(this.userInfo, this.$attrs, { pictureSrc: this.$attrs.src });
    }
  /**
   * Load user specific information
   */
  async created() {
    await this.loadUserInfo();

    // watch for save updates
    this.listeners.push(Dispatcher.watch(($event: any) => {
      if ($event.detail.status === 'finished' || $event.detail.status === 'deleted') {
        this.loadUserInfo();
      }
    }, `profile.vue.${ this.domainName }`, 'updateProfileDispatcher'));
  }

  /**
   * Load the latest user information.
   */
  async loadUserInfo() {
    const runtime = (<any>this).getRuntime();
    let accountDetails: any = { profileType: 'unspecified' };
    try {
      accountDetails = (await runtime.profile.getProfileProperties([ 'accountDetails' ]))
        .accountDetails || accountDetails;
    } catch (ex) { }
    this.userInfo = accountDetails;
    // use old alias logic
    if (!this.userInfo.accountName) {
      // load addressbook info
      const addressBook = await runtime.profile.getAddressBook();
      const contact = addressBook.profile[this.address];

      this.userInfo.accountName = contact ? contact.alias : this.address;
    }
    // fill empty picture
    if (!this.userInfo.picture) {
      this.userInfo.picture = { files: [ ] };
    }

    // transform to correct format
    this.userInfo.picture.files = await Promise.all(this.userInfo.picture.files.map(async file =>
      FileHandler.fileToContainerFile(file)
    ));

    // backup user info, so we can revert last changes
    this.originUserInfo = cloneDeep(bcc.lodash, this.userInfo);

    this.$emit('update', this.userInfo);
    this.loading = false;
  }

  /**
   * Can the edit modee be used?
   */
  canEdit() {
    return this.editable && this.size === 'lg' && this.address === this.$store.state.runtime.activeAccount;
  }

  /**
   * Restore lastest user information.
   */
  cancelEditMode() {
    this.userInfo = cloneDeep(bcc.lodash, this.originUserInfo);
    this.isEditMode = false;
  }

  /**
   * Send save event for the current userInfo
   */
  async saveEditMode() {
    this.originUserInfo = cloneDeep(bcc.lodash, this.userInfo);
    this.isEditMode = false;

    // transform img to correct size
    if (this.userInfo.picture.files[0]) {
      this.userInfo.picture.files[0] = await FileHandler.fileToContainerFile(
        await FileHandler.resizeImage(
          this.userInfo.picture.files[0].blobUri,
          // definitely match the height
          { max_width: 1000, max_height: 160 }
        )
      );
    }

    this.$emit('save', this.userInfo);
  }

  /**
   * Start the edit mode for the account name.
   */
  startEditing() {
    if (this.canEdit()) {
      this.isEditMode = true;
    }
  }
}
