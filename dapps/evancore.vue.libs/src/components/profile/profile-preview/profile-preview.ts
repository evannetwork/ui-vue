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

import { Dispatcher, cloneDeep, FileHandler, bccUtils, } from '@evan.network/ui';
import * as bcc from '@evan.network/api-blockchain-core';

// vue imports
import Component, { mixins } from 'vue-class-component';
import EvanComponent from '../../../component';
import { Prop, Watch } from 'vue-property-decorator';

interface UserInfoInterface {
  accountName: string;
  profileType: string;
  isVerified: boolean;
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
   * Size of the profile preview (default, sm, lg)
   */
  @Prop({
    default: 'default'
  }) size: string;

  /**
   * Enable edit mode for the picture and the account name.
   */
  @Prop() editable: string;

  /**
   * Directly pass already loaded account details to the component
   */
  @Prop() accountDetails: any; // TODO: needs proper type/interface

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

  /**
   * Blockchain-core profile instance for the provided address
   */
  profile: bcc.Profile = null;

  @Watch('$attrs')
    onChildChanged(val: UserInfoInterface, oldVal: UserInfoInterface) {
      Object.assign(this.userInfo, this.$attrs, { pictureSrc: this.$attrs.src });
    }
  /**
   * Load user specific information
   */
  async created() {
    // skip initial data loading if parent data was passed into the component
    if (this.accountDetails) {
      this.userInfo = this.accountDetails;
      // transform to correct format
      await this.fillEmptyProfileData();
      // setup reset value for edit mode cancel
      this.backupUserInfo();
    } else {
      await this.loadUserInfo();
    }

    // watch for save updates
    this.listeners.push(Dispatcher.watch(($event: any) => {
      if ($event.detail.status === 'finished' || $event.detail.status === 'deleted') {
        this.loadUserInfo();
      }
    }, `profile.vue.${ this.domainName }`, 'updateProfileDispatcher'));

    this.loading = false;
  }

  /**
   * Load the latest user information.
   */
  async loadUserInfo() {
    const runtime = (<any>this).getRuntime();
    const profile = new bcc.Profile({
      accountId: runtime.activeAccount,
      profileOwner: this.address,
      ...runtime,
    });

    let accountDetails: any = { profileType: 'user' };
    try {
      accountDetails = (await profile.getProfileProperty('accountDetails')) || accountDetails;
    } catch (ex) {
      runtime.logger.log(`Could not load profile data for ${ this.address }: ${ ex.message }`, 'error');
    }

    this.userInfo = accountDetails;

    // ensure profile picture is set and transformed to ui file
    await this.fillEmptyProfileData();

    // setup reset value for edit mode cancel
    this.backupUserInfo();

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

  /**
   * Ensure picture is set on profile
   */
  async fillEmptyProfileData() {
    const runtime = (<any>this).getRuntime();

    if (!this.userInfo.profileType) {
      this.userInfo.profileType = 'user';
    }

    // use old alias logic
    this.userInfo.accountName = this.userInfo.accountName ||
      await bccUtils.getUserAlias(runtime.profile, this.userInfo);

    // fill empty picture
    if (!this.userInfo.picture) {
      this.userInfo.picture = { files: [ ] };
    }

    // transform to correct format
    this.userInfo.picture.files = await Promise.all(this.userInfo.picture.files.map(async file =>
      FileHandler.fileToContainerFile(file)
    ));
  }

  /**
   * Backups the current user info, so we can revert last changes.
   */
  backupUserInfo() {
    this.originUserInfo = cloneDeep(bcc.lodash, this.userInfo);
  }
}
