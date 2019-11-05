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
 * Describes each tab that can be provided to the NaveComponent
 */
interface NavEntryInterface {
  /**
   * Optional id that is added as tab id selector
   */
  id?: string;

  /**
   * icon that should be displayed before the text
   */
  icon: string;

  /**
   * i18n translation key
   */
  text: string;

  /**
   * Url that should be opened
   */
  href?: string;

  /**
   * specify a custom action
   */
  action?: Function;
}

/**
 * Displays navigation list in evan.network design using vue router integration for checking active
 * and activating tabs (optimized for evan-dapp-wrapper-level-2)
 *
 * @class      NavListComponent @selector      evan-nav-list
 */
@Component({ })
export default class NavListComponent extends mixins(EvanComponent) {
  /**
   * Navigation entries that should be displayed (NavEntry can also be null to display a my-auto
   * seperator)
   */
  @Prop() entries: Array<NavEntryInterface|null>;

  /**
   * Shows the profile display in the top of the nav-list
   */
  @Prop({ default: true }) showProfile: boolean;

  /**
   * Shows the logout button at the bottom of the nav list
   */
  @Prop({ default: true }) showLogout: boolean;

  /**
   * Current as active marked tab
   */
  activeEntry = 0;

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
    for (let i = 0; i < this.entries.length; i++) {
      if (this.entries[i] && window.location.href.indexOf(this.entries[i].href) !== -1) {
        this.activeEntry = i;
        break;
      }
    }
  }

  /**
   * Sends the hide sidebar event.
   */
  hideSidebar2() {
    window.dispatchEvent(new CustomEvent('dapp-wrapper-sidebar-close'));
  }
}
