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
import { Prop } from 'vue-property-decorator';

// evan.network imports
import EvanComponent from '../../component';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

@Component({ })
export default class Breadcrumbs extends mixins(EvanComponent) {
  @Prop({
    type: String,
    default: '_evan'
  }) i18nScope;

  @Prop({
    type: Function
  }) enableReload;

  @Prop() baseHash;

  // route stack
  breadcrumbs = [ ];

  /**
   * Watch for hash updates
   */
  hashChangeWatcher: any;

  /**
   * Was the component destroyed, before the hash change event was bind?
   */
  wasDestroyed: boolean;

  /**
   * Show the go back button
   */
  goBack = false;

  /**
   * Correctly used base hash (props should not be overwritten, so we copy the value to the
   * _baseHash prop)
   */
  _baseHash = '';

  /**
   * Bind the hash change watcher to track hash changes and to update the routes
   */
  async created() {
    const that = this;
    const domainName = (<any>this).domainName;

    // fill empty base hash
    this._baseHash = this.baseHash || this.dapp.baseHash;

    // bin the hash change watcher within the create to keep the correct function reference
    this.hashChangeWatcher = function() {
      that.breadcrumbs = window.location.hash
        // remove the base hash
        .replace(`#${ that._baseHash }`, '')
        .split('/')
        // filter empty breadcrumbs
        .filter(breadcrumb => !!breadcrumb);

      // add root domain as first entry
      that.breadcrumbs.unshift(that.dapp.ens.replace(new RegExp(`.${ domainName }`, 'g'), ''));

      // iterate through all paths and create the correct translation name and path
      that.breadcrumbs = that.breadcrumbs.map((breadcrumb: string, index: number) => {
        // remove the domain name, so we can manage simple i18n files
        let fallbackName = breadcrumb.replace(new RegExp(`.${ domainName }`, 'g'), '');
        let name = fallbackName;

        // if the name does not starts with 0x, apply the i18nScope
        if (name.indexOf('0x') !== 0) {
          name = `${ that.i18nScope }.${ name }`;
        }

        return {
          name: name,
          fallbackName: fallbackName,
          // build the path relative to the base hash
          path: index === 0 ? that._baseHash :
            `${ that._baseHash }/${ that.breadcrumbs.slice(1, index + 1).join('/') }`
        }
      });

      // show the go back button, when the navigation is deeper than 0
      that.goBack = that.breadcrumbs.length > 0;
    };

    // set them initially
    this.hashChangeWatcher();

    // add the hash change listener
    window.addEventListener('hashchange', this.hashChangeWatcher);

    // clear the watcher if the component was already destroyed
    if (this.wasDestroyed) {
      this.beforeDestroy();
    }
  }

  /**
   * Clear the hash change watcher
   */
  beforeDestroy() {
    this.wasDestroyed = true;

    // only remove the hashChangeWatcher, when it was already bind (asynchronious call can take
    // longer and the dapp was switched before)
    if (this.hashChangeWatcher) {
      // remove the hash change listener
      window.removeEventListener('hashchange', this.hashChangeWatcher);
    }
  }
}
