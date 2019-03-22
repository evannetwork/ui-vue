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
import { getNextDApp } from '../../routing';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

@Component({ })
export default class DAppLoader extends Vue {
  /**
   * save the latest dapp path that was started, so we can check on an hash change, if the dapp for
   * this dapp loader has been changed.
   */
  startedDApp: any;

  /**
   * Watch for hash updates and start a new dapp, when the corresponding hash for this dapp-loader
   * has been changed
   */
  hashChangeWatcher: any;

  /**
   * no valid dapp could be found for this route
   */
  dappNotFound: boolean;

  /**
   * Was the component destroyed, before the hash change event was bind?
   */
  wasDestroyed: boolean;

  /**
   * Start the dapp directly and create an hash change watcher, so we can react on hash changes to
   * reload the dapp or to start another one.
   */
  async mounted() {
    await this.startDApp();

    // set the hash change watcher, so we can remove it on component destroy
    const dappLoader = this;
    this.hashChangeWatcher = function() {
      // if the startedDapp for this hash level has been changed, load the new dapp
      if (!window.location.hash.startsWith(`#${ dappLoader.startedDApp.baseHash }`)) {
        dappLoader.startDApp();
      }
    };

    // add the hash change listener
    window.addEventListener('hashchange', this.hashChangeWatcher);

    // clear the watcher if the component was already destroyed
    if (this.wasDestroyed) {
      this.destroyed();
    }
  }

  /**
   * Clear the hash change watcher
   */
  destroyed() {
    this.wasDestroyed = true;

    // only remove the hashChangeWatcher, when it was already bind (asynchronious call can take
    // longer and the dapp was switched before)
    if (this.hashChangeWatcher) {
      // remove the hash change listener
      window.removeEventListener('hashchange', this.hashChangeWatcher);
    }
  }

  /**
   * Searches for the next dapp in the url that should be started and run it
   */
  async startDApp() {
    // get module id
    this.startedDApp = await getNextDApp();

    // clear everything, that was loaded before
    this.$el.innerHTML = '';

    // create a new container el, vue will replace this element
    const containerEl = document.createElement('div');
    this.$el.appendChild(containerEl);

    // startup the dapp
    await dappBrowser.dapp.startDApp(this.startedDApp.ens, containerEl);
  }
}
