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
import Component, { mixins } from 'vue-class-component';
import Vue from 'vue';
import { Prop } from 'vue-property-decorator';

// evan.network imports
import EvanComponent from '../../component';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

@Component({ })
export default class ModalComponent  extends mixins(EvanComponent) {
  /**
   * Show custom modal content
   */
  @Prop({ }) customModal;

  /**
   * Configurable modal width
   */
  @Prop({
    default: '500px'
  }) maxWidth;

  @Prop({
    default: [
      'modal-header',
      'modal-body',
      'modal-footer',
    ]
  }) modalClasses;

  /**
   * shows the dom elements of the modal
   */
  isRendered = false;

  /**
   * animate them
   */
  isShown = false;

  /**
   * Send component instance to parent.
   */
  created() {
    this.$emit('init', this);
  }

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
  hide() {
    this.isShown = false;
    this.$emit('close');
    this.$nextTick(() => this.isRendered = false);
  }
}
