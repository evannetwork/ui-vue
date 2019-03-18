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
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

// evan.network imports
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

@Component({ })
export default class DAppLoader extends Vue {
  /**
   * no valid dapp could be found for this route
   */
  dappNotFound: boolean;

  async mounted() {
    // get runtime from axios store (initialized by the parent dapp-wrapper)
    const runtime = this.$store.state.runtime;

    // parse current route by replacing all #/ and /# to handle incorrect navigations
    const currentHash = decodeURIComponent(window.location.hash);

    // get module id
    let dappToStart;
    const moduleIds = currentHash.split('/');
    for (let moduleId of moduleIds) {
      try {
        // only start the dapp if a dbcp exists!
        if (!document.getElementById(moduleId)) {
          try {
            const defintion = await runtime.definitions.getDescription(moduleId);
            if (defintion && defintion.public && !document.getElementById(defintion.name)) {
              dappToStart = moduleId;

              break;
            }
          } catch (ex) { }
        }
      } catch (ex) { }
    }

    // if no dapp to start is found with the url (e.g. when opening an contract
    // id), load the last url path
    if (!dappToStart && moduleIds.length > 0) {
      dappToStart = moduleIds[moduleIds.length - 1];
    }

    if (dappToStart) {
      await dappBrowser.dapp.startDApp(dappToStart, this.$el);
    } else {
      this.dappNotFound = true;
    }
  }
}
