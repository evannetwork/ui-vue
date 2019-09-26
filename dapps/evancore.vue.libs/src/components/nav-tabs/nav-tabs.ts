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
import Vue from 'vue';
import { Prop } from 'vue-property-decorator';

// evan.network imports
import EvanComponent from '../../component';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

/**
 * Describes each tab that can be provided to the NavTabsComponent
 */
interface TabInterface {
  /**
   * Custom color code
   */
  color?: string;

  /**
   * Optional id that is added as tab id selector
   */
  id?: string;

  /**
   * i18n translation key
   */
  text: string;

  /**
   * Url that should be opened
   */
  href: string;
}

/**
 * Displays tabs in evan.network design using vue router integration for checking active and
 * activating tabs.
 *
 * @class         NavTabsComponent
 * @selector      evan-nav-tabs
 */
@Component({ })
export default class NavTabsComponent extends mixins(EvanComponent) {
  /**
   * List of tabs that should be displayed
   *
   * @class      Prop (name)
   */
  @Prop() tabs: Array<TabInterface>;

  /**
   * Current as active marked tab
   */
  activeTab = 0;

  /**
   * Watch for hash updates and load digitaltwin detail, if a digitaltwin was laod
   */
  hashChangeWatcher: any;

  /**
   * Check for opened tab
   */
  created() {
    this.hashChangeWatcher = (async () => this.setTabStatus()).bind(this);
    this.hashChangeWatcher();

    // add the hash change listener
    window.addEventListener('hashchange', this.hashChangeWatcher);
    this.$emit('init', this);
  }

  /**
   * Clear the hash change watcher
   */
  beforeDestroy() {
    // clear listeners
    this.hashChangeWatcher && window.removeEventListener('hashchange', this.hashChangeWatcher);
  }

    /**
   * Check the active route and set the active tab status.
   */
  setTabStatus() {
    for (let i = 0; i < this.tabs.length; i++) {
      if (window.location.href.indexOf(this.tabs[i].href) !== -1) {
        this.activeTab = i;
        break;
      }
    }
  }
}
