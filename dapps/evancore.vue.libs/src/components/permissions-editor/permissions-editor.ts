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
import { ContactInterface, DataSetPermissionsInterface } from '../../interfaces';
import EvanComponent from '../../component';

import { Prop, Watch } from 'vue-property-decorator';

const clone = (obj: any) => JSON.parse(JSON.stringify(obj));

interface SortFiltersInterface {
  [key: string]: string[];
}

@Component({ })
class PermissionsEditor extends mixins(EvanComponent) {
  contacts = null;
  permissionsChanged = false;
  initialPermissions: DataSetPermissionsInterface[] = null;
  isLoading = false;

  @Prop({
    default: null
  }) dataSets: DataSetPermissionsInterface[];

  /**
   * Function to write the updated permissions object.
   * Should return a promise resolving a `boolean`.
   *
   * - updatePermissions(permissions: DataSetPermissionsInterface): Promise<boolean>
   */
  @Prop({
    required: true
  }) updatePermissions: Function;

  /**
   * Function to load the desired permissions object.
   * Should return a promise resolving a `DataSetPermissionsInterface`.
   *
   * - loadPermissions(userId: string): Promise<DataSetPermissionsInterface>
   */
  @Prop({
    required: true
  }) loadPermissions: Function;

  /**
   * Initially pre-selected contact object.
   */
  @Prop({
    default: null
  }) selectedContact: string;

  /**
   * General translation scope.
   */
  @Prop({
    default: '_evan.sharing'
  }) i18nScope: string;

  /**
   * An object with arrays of sorted keys for each contract id,
   * which may be used to sort and filter the visible permissions.
   *
   * `{ '0xd65D17035bE5964E9842004458B2F90e0B7B6604': ['accountDetails', 'registration', 'contact'], ... };`
   *
   * Or a simple array of keys for convenience if only one datacontract is used.
   *  `['accountDetails', 'registration', 'contact']`
   */
  @Prop({
    default: null
  }) sortFilters: SortFiltersInterface | string[];

  @Watch('selectedContact')
    onSelectedContactChanged(val: string, oldVal: string) {
      if (val !== oldVal) {
        this.getPermissionsForContact();
      }
    }

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
   * Set initial statet again and close the panel.
   */
  reset() {
    this.dataSets = clone(this.initialPermissions);

    this.$store.commit('toggleSidePanel', 'right'); // TODO: replace "right" by new panel id
  }

  /**
   * Calls the `loadPermissions` function from properties with current contact id.
   */
  async getPermissionsForContact() {
    if (!this.selectedContact || typeof this.selectedContact !== 'string') {
      return;
    }

    this.isLoading = true;
    this.dataSets = null;
    this.dataSets = await this.loadPermissions(this.selectedContact)
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

    const runtime = (<any>this).getRuntime();

    await this.updatePermissions(runtime, this.selectedContact, this.dataSets, this.initialPermissions)
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
    }).filter(entry => entry.value !== runtime.activeAccount);
  }

  getContactLabel(contactId: string): string {
    const { label } = this.contacts.find(item => item.value === contactId);

    return label;
  }

  /**
   * Return the sort & filter array for the correct contract id.
   * @param dataSetId
   */
  getSortFilter(contractId: string) {
    if (!this.sortFilters) {
      return null;
    }

    if (Array.isArray(this.sortFilters)) {
      return this.sortFilters;
    }

    if (this.sortFilters[contractId] || this.sortFilters[contractId] === null) {
      return this.sortFilters[contractId];
    }

    console.warn(`getSortFilter function can not determine the desired filter array for ${contractId}`);

    return null;
  }
}

export default PermissionsEditor;
