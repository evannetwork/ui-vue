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
import EvanComponent from '../../component';
import Vue from 'vue';
import { Prop } from 'vue-property-decorator';

/**
 * Displays a account / contract address and applies generalized interactions like copy, open in
 * explorer, ...
 *
 * @class      AddressComponent @selector      evan-address
 */
@Component({ })
export default class AddressComponent extends mixins(EvanComponent) {
  /**
   * Address that should be displayed
   */
  @Prop() address;

  /**
   * Specific custom classes
   */
  @Prop() class;

  /**
   * Should the interactions are shown?
   */
  hover = false;

  /**
   * Copy the current address to the users clipboard
   */
  copyAddress() {
    // create temporary element
    const $temp: any = document.createElement('input');
    document.body.appendChild($temp);
    // apply copy value
    $temp.value = this.address;
    // trigger copy
    $temp.select();
    document.execCommand('copy');
    // remove element
    document.body.removeChild($temp);
    // show success
    this.$toasted.show(this.$t('_evan.address.copied'));
  }
}
