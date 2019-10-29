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
import { Prop, Watch } from 'vue-property-decorator';

// evan.network imports
import { UIContainerFile, FileHandler, } from '@evan.network/ui';

import EvanComponent from '../../component';

/**
 * Wrapper for profile verifications.
 */
@Component({})
class ProfilePicture extends mixins(EvanComponent) {
  /**
   * Profile type that should be used (user, company, device)
   */
  @Prop({
    default: 'user'
  }) type: string;

  /**
   * Display size that should be used (small, medium, large)
   */
  @Prop({
    default: 'default'
  }) size: string;

  /**
   * The image src. Can be an http resource or a blob object from browser files API.
   */
  @Prop({
    default: null
  }) src: UIContainerFile | string;

  /**
   * The name of the user, company or IOT device. Initials will be used if no picture is uploaded.
   */
  @Prop({
    default: ''
  }) accountName: string;

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
   * The file form handler for uploading a new image.
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

  /**
   * Src that should be used for displaying the img.
   */
  srcString = '';

  @Watch('src', { immediate: true, deep: true })
  async onChildChanged(src: UIContainerFile | string) {
    this.srcString = null;

    // fore rerendering, when src is set
    if (this.src) {
      this.$nextTick(async () => {
        if (typeof src === 'string') {
          this.srcString = src;
        } else {
          // ensure, that blobUri is set
          this.srcString = src.blobUri ?
            src.blobUri :
            (await FileHandler.fileToContainerFile(src)).blobUri;
        }
      });
    }
  }

  /**
   * Handles changing picture without propagating it to the form.
   *  - truncate multiple uploads
   *  - store picture temporary from form
   *  - set form to empty again
   */
  pictureChanged() {
    this.changedPicture = null;
    // force rerender
    this.$nextTick(() => {
      this.changedPicture = this.fileForm.value[0];
      this.fileForm.value = [];
    });
  }

  /**
   * Propagate picture change using file temporary stored before.
   */
  usePicture() {
    this.$emit('changed', this.changedPicture);
    (<any>this).$refs.pictureUploadModal.hide();
  }

  getInitials(accountName: string): string {
    if (!accountName) {
      return '#';
    }

    return accountName.split(/\s/).splice(0, 2).map(word => word.charAt(0)).join('');
  }
}

export default ProfilePicture;
