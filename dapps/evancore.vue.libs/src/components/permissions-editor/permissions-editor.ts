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

import Component, { mixins } from 'vue-class-component';

// evan.network imports
import { deepEqual, bccUtils } from '@evan.network/ui/src';
import * as bcc from '@evan.network/api-blockchain-core';
import { ContactInterface, ContainerPermissionsInterface } from '../../interfaces';
import EvanComponent from '../../component';

import { Prop, Watch } from 'vue-property-decorator';

const clone = (obj: any) => JSON.parse(JSON.stringify(obj)); // TODO: import from common utils

interface SortFiltersInterface {
  [key: string]: string[];
}

@Component({ })
class PermissionsEditor extends mixins(EvanComponent) {
  permissionsChanged = false;
  initialPermissions: ContainerPermissionsInterface[] = null;
  isLoading = false;

  /**
   * initial contacts from current user
   */
  @Prop({
    default: null
  }) contacts: ContactInterface[];

  @Prop({
    default: null
  }) containersPermissions: ContainerPermissionsInterface[];

  /**
   * Function to write the updated permissions object.
   * Should return a promise resolving a `boolean`.
   *
   * - updatePermissions(permissions: ContainerPermissionsInterface): Promise<boolean>
   */
  @Prop({
    required: true
  }) updatePermissions: Function;

  /**
   * Function to load the desired permissions object.
   * Should return a promise resolving a `ContainerPermissionsInterface`.
   *
   * - loadPermissions(userId: string): Promise<ContainerPermissionsInterface>
   */
  @Prop({
    required: true
  }) loadPermissions: Function;

  /**
   * Initially pre-selected contact id.
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
   * Callback function when contact was selected.
   */
  @Prop({
    type: Function
  }) onSelect: Function;

  /**
   * Use component in relative context.
   */
  @Prop({
    default: false
  }) relative: boolean;

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

  /**
   * Current users runtime.
   */
  runtime: bcc.Runtime;

  /**
   * Name of the selected account adress
   */
  selectedUsername = '';

  /**
   *  Update shown permissions according to selected contact.
   *
   * @param val
   * @param oldVal
   */
  @Watch('selectedContact')
  onSelectedContactChanged(val: string, oldVal: string) {
    if (val !== oldVal) {
      this.getPermissionsForContact();

      if (typeof this.onSelect === 'function') {
        this.onSelect(val);
      }
    }
  }

  async created() {
    this.runtime = (this as any).getRuntime();
    this.getPermissionsForContact();
  }

  /**
   * Receives updated permissions from permissions component and passes it to current contract.
   * Performs check whether it's different to the initial state.
   *
   * @param updates
   *  - contractId: the id of the contract which was changed
   *  - permissions: the updated permissions object
   */
  updateContractPermissions({contractId, permissions}) {
    this.containersPermissions[contractId].permissions = permissions;
    this.permissionsChanged = !deepEqual(this.containersPermissions, this.initialPermissions);
  }

  /**
   * set editor to null and close the panel if neccessary
   */
  cancel() {
    this.selectedContact = null;
    this.containersPermissions = null;
    this.initialPermissions = null;
    if (typeof this.onSelect === 'function') {
      this.onSelect();
    }
    this.$store.commit('toggleSidePanel', ''); // TODO: replace "right" by new panel id
  }

  /**
   * Calls the `loadPermissions` function from properties with current contact id.
   */
  async getPermissionsForContact() {
    if (!this.selectedContact || typeof this.selectedContact !== 'string') {
      this.containersPermissions = null;

      return;
    }

    this.isLoading = true;
    this.setUserNameWithAddress();
    this.containersPermissions = null;
    this.containersPermissions = await this.loadPermissions(this.selectedContact)
      .catch((e: Error) => {
        console.log('Error loading permissions', e.message);
        this.isLoading = false;
      });

    this.initialPermissions = this.containersPermissions ? clone(this.containersPermissions) : this.initialPermissions;

    this.isLoading = false;
  }

  /**
   * Calls the `updatePermissions` function from properties with the updated containersPermissions object.
   */
  async writePermissions() {
    this.isLoading = true;

    try {
      await this.updatePermissions(this.runtime, this.selectedContact, this.containersPermissions, this.initialPermissions);
      this.initialPermissions = clone(this.containersPermissions);
    } catch (ex) {
      return console.error('Error writing permissions', ex.message);
    }

    this.cancel();
    this.isLoading = false;
  }

  /**
   * Return the sort & filter array for the correct contract id.
   *
   * @param contractId
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

  /**
   * writes specific string in selectedUsername variable used in permission text
   */
  async setUserNameWithAddress() {
    const profile = new bcc.Profile({
      accountId: this.runtime.activeAccount,
      profileOwner: this.selectedContact,
      ...this.runtime,
    } as any);

    this.selectedUsername = await bccUtils.getUserAlias(profile);
  }
}

export default PermissionsEditor;
