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
 * Bootstrap modal wrapper in evan custom design.
 *
 * @class         EvanModal
 * @selector      evan-modal
 */
@Component({ })
export default class EvanModal extends mixins(EvanComponent) {
  /**
   * Removes the normal content containers and enables the ``<slot name="content" v-if="customModal"></slot>`` slot.
   */
  @Prop({ }) customModal;

  /**
   * Set true, to hide the default cancel button in footer.
   */
  @Prop({
    default: false
  }) hideFooterButton;

  /**
   * Set true, to disable hide() function on modal backdrop click.
   */
  @Prop({
    default: false
  }) disableBackdrop;

  /**
   * Configurable modal width
   */
  @Prop({
    default: '500px'
  }) maxWidth;

  /**
   * Enable or disable evna specific modal part classes. E.g. by removing the modal-header class,
   * the header will loose it's style, so you can use usal html & css withou evan design.
   */
  @Prop({
    default: [
      'modal-header',
      'modal-body',
      'modal-footer',
    ]
  }) modalClasses;

  /**
   * Overwrite the original close function.
   */
  @Prop() closeAction: Function;

  /**
   * shows the dom elements of the modal
   */
  isRendered = false;

  /**
   * animate them
   */
  isShown = false;

  /**
   * Set true, to prevent hiding when click started inside modal, e.g. during text selection
   */
  preventHide = false;

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
    if (this.preventHide) {
      this.preventHide = false;

      return;
    }

    this.isShown = false;
    this.$emit('close');
    this.$nextTick(() => this.isRendered = false);
  }
}
