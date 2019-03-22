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
export default class DAppWrapperLevel2 extends Vue {
  /**
   * found dapp-wrapper-sidebar 2 container element, where this element can be applied to
   */
  highestSidebar: Element;

  /**
   * Child element that contains the level 2 content
   */
  contentElement: Element;

  /**
   * Take the current element and search for an parent wrapper level 2 container, so move the
   * current element to this element.
   */
  mounted() {
    let parent: any = this.$el;
    let wrappers: Array<any> = [ ];

    // search until body or an wrapper body is reached
    do {
      parent = parent.parentElement;

      // collect a list of all parent wrapper bodies, to be able to take the highest one
      if (parent.className.indexOf('dapp-wrapper-body') !== -1) {
        wrappers.push(parent);
      }
    } while (parent !== document.body);

    // if it's not the body, clear the latest wrapper-sidebar-2 element and
    if (wrappers.length > 0) {
      this.highestSidebar = wrappers.pop().querySelector('.dapp-wrapper-sidebar-2');
      this.contentElement = (<any>this.$el).querySelector('.l2-content');

      // clear element
      this.highestSidebar.innerHTML = '';

      // append the current element
      this.highestSidebar.appendChild(this.contentElement);
    } else {
      dappBrowser.utils.log(`dapp-wrapper-sidebar-2 element not included within an evan
        dapp wrapper...`, 'warning');
    }
  }

  /**
   * When the element was destroyed, remove this element from the parent dapp-wrapper-2 container,
   * when found.
   */
  destroyed() {
    console.log('destroyed')
    if (this.highestSidebar) {
      this.highestSidebar.removeChild(this.contentElement);
    }
  }
}
