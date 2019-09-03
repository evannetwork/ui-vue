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

/**
 * Bootstrap dropdown menu wrapper in evan.network style.
 *
 * @class         DropdownComponent
 * @selector      evan-dropdown
 */
@Component({ })
export default class DropdownComponent extends mixins(EvanComponent) {
  /**
   * Where should the popup should been attached?
   */
  @Prop({ default: 'left' }) alignment: string;

  /**
   * Dropdown width specification (e.g. 100px)
   */
  @Prop({ default: 'auto' }) width: string;

  /**
   * Custom position left position (e.g. 80px)
   */
  @Prop({ }) left: string;

  /**
   * Custom position right position (e.g. 80px)
   */
  @Prop({ }) right: string;

  /**
   * Disables the dropdown functionality (used to handle dropdowns and single buttons within the
   * same component)
   */
  @Prop() renderOnlyContent;

  /**
   * shows the dom elements of the modal
   */
  isRendered = false;

  /**
   * animate them
   */
  isShown = false;

  /**
   * Renders the modal element and shows it animated.
   */
  show() {
    this.isRendered = true;
    this.$nextTick(() => this.isShown = true);
  }

  /**
   * Remove the modal element and hide it animated.
   */
  hide($event) {
    this.isShown = false;
    this.$nextTick(() => this.isRendered = false);

    if ($event) {
      $event.stopPropagation();
    }
  }
}
