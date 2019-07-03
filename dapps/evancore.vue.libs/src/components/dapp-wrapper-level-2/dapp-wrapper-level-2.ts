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

/**
 * The dapp-warpper has the functionality, that a custom second level navigation can be applied.
 * Using this component, this content container does not must be filled directly, it can be filled
 * from every child component, even from nested, fully seperated dapps. The content that will be
 * applied to the dapp-wrapper-level-2 component, will be moved to the highest available
 * dapp-wrapper component. The content will be overwritten, when another DAppWrapperLevel2 component
 * will be started or, if this included dapp was destroyed.
 *
 * @class         DAppWrapperLevel2Component
 * @selector      evan-dapp-wrapper-level-2
 */
@Component({ })
export default class DAppWrapperLevel2Component extends mixins(EvanComponent) {
  /**
   * found dapp-wrapper-sidebar 2 container element, where this element can be applied to
   */
  highestSidebar: Element;

  /**
   * Child element that contains the level 2 content
   */
  contentElement: Element;

  /**
   * Run destoyed method only ones
   */
  isDestroyed = false;

  /**
   * Take the current element and search for an parent wrapper level 2 container, so move the
   * current element to this element.
   */
  mounted() {
    let highestWrapper: any = DAppWrapperUtils.getActiveDAppWrapper(this.$el);

    // if it's not the body, clear the latest wrapper-sidebar-2 element and
    if (highestWrapper) {
      this.highestSidebar = highestWrapper.querySelector('.dapp-wrapper-sidebar-2');
      this.contentElement = (<any>this.$el).firstChild;

      // clear element
      this.highestSidebar.innerHTML = '';

      // append the current element
      this.contentElement && this.highestSidebar.appendChild(this.contentElement);
    } else {
      dappBrowser.utils.log(`dapp-wrapper-sidebar-2 element not included within an evan
        dapp wrapper...`, 'warning');
    }

    if (this.isDestroyed) {
      this.destroy();
    }
  }

  /**
   * Trigger destroy function
   */
  beforeDestroy() {
    this.destroy();
  }

  /**
   * When the element was destroyed, remove this element from the parent dapp-wrapper-2 container,
   * when found.
   */
  destroy() {
    if (this.highestSidebar && !this.isDestroyed) {
      this.isDestroyed = true;

      try {
        this.contentElement && this.highestSidebar.removeChild(this.contentElement);
      } catch (ex) { }
    }
  }

  /**
   * Sends the hide sidebar event.
   */
  hide() {
    window.dispatchEvent(new CustomEvent('dapp-wrapper-sidebar-close'));
  }
}
