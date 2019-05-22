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
import DAppWrapperUtils from '../dapp-wrapper/utils';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

@Component({ })
export default class Breadcrumbs extends mixins(EvanComponent) {
  /**
   * Every route name will be translated using the leading i18nScope. E.g.: digitaltwins.evan =>
   * _evan.digitaltwins
   */
  @Prop({
    type: String,
    default: '_evan'
  }) i18nScope;

  /**
   * Should the reload button be visible?
   */
  @Prop({
    type: Function
  }) enableReload;

  /**
   * Change the route base hash that should be navigated to
   */
  @Prop() baseHash;

  /**
   * Move the breadcrumbs element to the most top level dapp-wrapper
   */
  @Prop() attachToDAppWrapper;

  /**
   * Ignore specific breadcrumbs by applying the url parts that should be ignored
   */
  @Prop({
    default: [ ]
  }) ignored;

  /**
   * active route, splitted by hash and prepared using the following params: name, fallbackName, path
   */
  breadcrumbs: Array<{ name: string, fallbackName: string, path: string }> = [ ];

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
   * found dapp-wrapper breadcrumbs container element, where this element can be applied to
   */
  dappWrapperBreadcrumb: Element;

  /**
   * Bind the hash change watcher to track hash changes and to update the routes
   */
  async created() {
    const domainName = (<any>this).domainName;

    // fill empty base hash
    this._baseHash = this.baseHash || this.dapp.baseHash;

    // bin the hash change watcher within the create to keep the correct function reference
    this.hashChangeWatcher = (() => {
      const breadcrumbHashes = window.location.hash
        // remove the base hash
        .replace(`#${ this._baseHash }`, '')
        .split('/')
        // filter empty breadcrumbs
        .filter(breadcrumb => !!breadcrumb);

      // add root domain as first entry
      breadcrumbHashes.unshift(this.dapp.ens);

      // iterate through all paths and create the correct translation name and path
      this.breadcrumbs = breadcrumbHashes.map((breadcrumb: string, index: number) => {
        // remove the domain name, so we can manage simple i18n files
        let fallbackName = decodeURIComponent(
          breadcrumb.replace(new RegExp(`.${ domainName }`, 'g'), ''));
        let name = `${ this.i18nScope }.${ fallbackName }`;

        return {
          name: name,
          fallbackName: fallbackName,
          // build the path relative to the base hash
          path: index === 0 ? this._baseHash :
            `${ this._baseHash }/${ breadcrumbHashes.slice(1, index + 1).join('/') }`,
          id: breadcrumb,
        }
      });

      // show the go back button, when the navigation is deeper than 0
      this.goBack = this.breadcrumbs.length > 0;
    }).bind(this);

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
   * Take the current element and search for an parent wrapper level 2 container, so move the
   * current element to this element.
   */
  mounted() {
    if (this.attachToDAppWrapper) {
      let highestWrapper: any = DAppWrapperUtils.getActiveDAppWrapper(this.$el);

      // if it's not the body, clear the latest wrapper-sidebar-2 element and
      if (highestWrapper) {
        this.dappWrapperBreadcrumb = highestWrapper.querySelector('.dapp-wrapper-breadcrumbs');

        // clear element
        this.dappWrapperBreadcrumb.innerHTML = '';

        // append the current element
        this.dappWrapperBreadcrumb.appendChild(this.$el);
      } else {
        dappBrowser.utils.log(`dapp-wrapper-sidebar-2 element not included within an evan
          dapp wrapper...`, 'warning');
      }
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

    // check if the breadcrumb was attached to the hihgest dapp-wrapper header
    if (this.attachToDAppWrapper && this.dappWrapperBreadcrumb && !this.wasDestroyed) {
      try {
        this.dappWrapperBreadcrumb.removeChild(this.$el);
      } catch (ex) { }
    }
  }
}
