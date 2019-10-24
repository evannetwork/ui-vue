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

import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';

// evan.network imports
import EvanComponent from '../../component';
import { PermissionsInterface } from '../../interfaces';

import { Prop } from 'vue-property-decorator';

@Component({ })
class Permissions extends mixins(EvanComponent) {
  readAll = false;
  readWriteAll = false;

  /**
   * The dataset name to be displayed.
   */
  @Prop({
    default: '',
    required: true
  }) label: string;

  /**
   * The dataset id.
   */
  @Prop({
    default: '',
    required: true
  }) dataSetId: string;

  /**
   * The permissions object.
   */
  @Prop({
    default: null,
    required: true
  }) permissions: PermissionsInterface;

  /**
   * The dataset id.
   */
  @Prop({
    default: '_evan'
  }) i18nScope: string;

  @Prop({}) updatePermissions: Function;

  created() {
    this.readAll = this.allPermissions('read');
    this.readWriteAll = this.allPermissions('readWrite');
  }

  updated() {
    this.readAll = this.allPermissions('read');
    this.readWriteAll = this.allPermissions('readWrite');
    this.updatePermissions({ dataSetId: this.dataSetId, permissions: this.permissions });
  }

  /**
   * Set all permissions in a dataset at once.
   *
   * @param mode: 'read'|'readWrite'
   * @param flag: boolean
   */
  updateAll(mode: 'read'|'readWrite', flag: boolean) {
    Object.keys(this.permissions).forEach( property =>  {
      this.permissions[property][mode] = flag;

      if (mode === 'readWrite' && flag) {
        this.permissions[property].read = flag;
      }
    });
  }

  /**
   * Set read property and remove write property if read permission is removed.
   *
   * @param property: string - the name of the property within the dataset
   * @param val: boolean - define wether the permission is given or not
   */
  setRead(property: string, val: boolean) {
    this.permissions[property].read = val;

    if (!val) {
      this.permissions[property].readWrite = val;
    }
  }

  /**
   * Set write property and add read property if write permission is given.
   *
   * @param property: string - the name of the property within the dataset
   * @param val: boolean - define wether the permission is given or not
   */
  setReadWrite(property: string, val: boolean) {
    this.permissions[property].readWrite = val;

    if (val) {
      this.permissions[property].read = val;
    }
  }

  /**
   * Returns whether all permissions in a dataset where checked for a certain access mode.
   *
   * @param mode: 'read'|'readWrite' - for which access mode
   * @param access: PermissionsInterface - The permissions object to check, default `this.permissions`
   */
  allPermissions(mode: 'read'|'readWrite', access = this.permissions): boolean {
    return Object.keys(access).every(key => access[key][mode] === true);
  }

  getTranslation(key: string): string {
    const translated = this.$t(`${this.i18nScope}.${key}`);

    return translated !== `${this.i18nScope}.${key}` ? translated : key;
  }
}

export default Permissions;
