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
import Component, { mixins } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

// evan.network imports
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { EvanFormControl } from '@evan.network/ui-vue-core';

import { getDomainName } from '../../utils';
import EvanComponent from '../../component';

/**
 * Wrapper for profile verifications.
 */
@Component({})
class ProfilePicture extends mixins(EvanComponent) {
  /**
   * Profile type that should be used (unknown, user, company, device)
   */
  @Prop({
    default: 'unknown'
  }) type: string;

  /**
   * Display size that should be used (small, medium, large)
   */
  @Prop({
    default: 'default'
  }) size: string;

  /**
   * Display size that should be used (small, medium, large)
   */
  @Prop({
    default: null
  }) src: any;

  /**
   * The name of the user, company or IOT device. Initials will be used if no picture is uploaded.
   */
  @Prop({
    default: ''
  }) name: string;

  /**
   * Is Profile verified
   */
  @Prop({
    default: false,
  }) isVerified: boolean;

  /**
   * Is picture editable
   */
  @Prop({
    default: false,
  }) isEditable: boolean;

  /**
   * Is Profile verified
   */
  @Prop({
    required: true,
    default: {
      value: []
    }
  }) fileForm: any;

  /**
   * Handle newly uploaded image.
   */
  changedPicture: any = null;

  @Watch('src')
  onChildChanged(src: any) {
    this.src = typeof src === 'string' ? src : src.blobUri;
  }

  pictureChanged(ev) {
    this.fileForm.value = this.fileForm.value.slice(0, 1); // skip multiple uploads // TODO: configure component
    this.changedPicture = this.fileForm.value[0];
  }

  usePicture() {
    this.$emit('changed', this.changedPicture);
    (<any>this).$refs.pictureUploadModal.hide();
  }

  getInitials(name: string): string {
    if (!name) {
      return '#';
    }

    return name.split(/\s/).splice(0, 2).map(word => word.charAt(0)).join('');
  };
}

export default ProfilePicture
