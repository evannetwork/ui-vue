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
import { deepEqual } from '@evan.network/ui';
import EvanComponent from '../../component';

import { Prop } from 'vue-property-decorator';

interface PermissionsInterface {
  [property: string]: {
    read: boolean,
    readWrite: boolean,
    fields: string[]
  };
}

interface DataSetInterface {
  label: string;
  key: string;
  permissions: PermissionsInterface;
}

interface ContactInterface {
  label: string;
  value: string;
}

const clone = (obj: any) => JSON.parse(JSON.stringify(obj));

@Component({ })
class PermissionsEditor extends mixins(EvanComponent) {
  contacts = null;
  permissionsChanged = false;
  initialPermissions: DataSetInterface[] = null;
  isLoading = false;

  @Prop({
    default: null
  }) dataSets: DataSetInterface[];

  /**
   * Function to write the updated permissions object.
   * Should return a promise resolving a `boolean`.
   *
   * - updatePermissions(permissions: DataSetInterface): Promise<boolean>
   */
  @Prop({
    required: true
  }) updatePermissions: Function;

  /**
   * Function to load the desired permissions object.
   * Should return a promise resolving a `DataSetInterface`.
   *
   * - loadPermissions(userId: string): Promise<DataSetInterface>
   */
  @Prop({
    required: true
  }) loadPermissions: Function;

  /**
   * Initially pre-selected contact object.
   */
  @Prop({
    default: null
  }) selectedContact: ContactInterface;

  async created() {
    this.contacts = await this.loadAddressBook();
    this.getPermissionsForContact();
  }

  /**
   * Receives updated permissions from permissions component and passes it to current datasets.
   * Performs check whether it's different to the initial state.
   *
   * @param updates
   *  - dataSetId: the id of the dataset which was changed
   *  - permissions: the updated permissions object
   */
  updateDataSetPermissions({dataSetId, permissions}) {
    this.dataSets[dataSetId].permissions = permissions;
    this.permissionsChanged = !deepEqual(this.dataSets, this.initialPermissions);
  }

  /**
   * Set initial statet again.
   */
  reset() {
    this.dataSets = clone(this.initialPermissions);
  }

  /**
   * Calls the `loadPermissions` function from properties with current contact id.
   */
  async getPermissionsForContact() {
    if (!this.selectedContact || !this.selectedContact.value) {
      return;
    }

    this.isLoading = true;
    this.dataSets = null;
    this.dataSets = await this.loadPermissions(this.selectedContact.value)
      .catch((e: Error) => {
        console.log('Error loading permissions', e.message);
        this.isLoading = false;
      });

    this.initialPermissions = this.dataSets ? clone(this.dataSets) : this.initialPermissions;
    this.isLoading = false;
  }

  /**
   * Calls the `updatePermissions` function from properties with the updated dataSets object.
   */
  async writePermissions() {
    this.isLoading = true;
    await this.updatePermissions(this.dataSets)
      .catch((e: Error) => {
        console.log('Error writing permissions', e.message);
      });

    this.initialPermissions = clone(this.dataSets);
    this.isLoading = false;
  }

  /**
   * Load the addressbook for the current user.
   */
  async loadAddressBook() {
    const runtime = (<any>this).getRuntime();

    // load the contacts for the current user, so we can display correct contact alias
    delete runtime.profile.trees[runtime.profile.treeLabels.addressBook];
    let addressBook = (await runtime.profile.getAddressBook()).profile;

    return Object.keys(addressBook).map(key => {
      return {
        'label': addressBook[key].alias,
        'value': key
      };
    });
  }
}

export default PermissionsEditor;
