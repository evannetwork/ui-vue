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

import Vue from 'vue'
import Component, { mixins } from 'vue-class-component'

// evan.network imports
import { deepEqual } from '@evan.network/ui';
import EvanComponent from '../../component'

import * as dataSetExamples from './dummydata.json'
import { Prop } from 'vue-property-decorator'

interface PermissionsInterface {
  [property: string]: {
    read: boolean,
    readWrite: boolean,
    fields: string[]
  }
}

interface DataSetInterface {
  label: string,
  key: string,
  permissions: PermissionsInterface
}

const clone = (obj: any) => JSON.parse(JSON.stringify(obj));

@Component({ })
class PermissionsEditor extends mixins(EvanComponent) {
  contacts = null;
  permissionsChanged = false;
  initialPermissions: DataSetInterface[] = null;

  @Prop({
    default: ''
  }) selectedContact: string;

  @Prop({
    default: dataSetExamples['0x933F8B2C639e82109468Fca14695435A1Ff62457'] // TODO: pull from bcc in HOC
  }) dataSets: DataSetInterface[]

  async created() {
    this.contacts = await this.loadAddressBook();
    this.initialPermissions = clone(this.dataSets)
  }

  /**
   * Receives updated permissions from permissions component and passes it to current datasets.
   * Performs check whether it's different to the initial state.
   *
   * @param updates
   *  - dataSetId: the id of the dataset which was changed
   *  - permissions: the updated permissions object
   */
  updatePermissions({dataSetId, permissions}) {
    this.dataSets[dataSetId].permissions = permissions;
    this.permissionsChanged = deepEqual(this.dataSets, this.initialPermissions) === false;
  }

  /**
   * Set initial statet again.
   */
  reset() {
    this.dataSets = clone(this.initialPermissions);
  }

  /**
   * load the addressbook for the current user
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
      }
    })
  }
}

export default PermissionsEditor
