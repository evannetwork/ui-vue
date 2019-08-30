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
import EvanComponent from '../../component';
import Vue from 'vue';
import { Prop, Watch } from 'vue-property-decorator';

/**
 * Wrapper component for button elements.
 *
 * @class         ComponentsOverview
 * @selector      evan-components-overview
 */
@Component({ })
export default class Button extends mixins(EvanComponent) {
  /**
   * Button Label.
   */
  @Prop({ type: String }) label : String;

  /**
   * disabled option, passed to html button element
   */
  @Prop({ type: Boolean, default: false }) disabled : Boolean;

  /**
   * The class name for the material design icon, without prefixed 'mdi'.
   *
   * @see: https://materialdesignicons.com/cdn/2.0.46/
   */
  @Prop({
    type: String,
    validator: value => value.slice(0,3) === 'mdi' // TODO: validator seems not to be called
  }) icon: String;

  /**
   * Button type. Currently 'primary', 'secondary' and 'danger' are supported.
   * TODO: 'icon', 'text', 'link'
   */
  @Prop({
    type: String,
    default: 'secondary',
    validator: (value: string) => {
      return ['primary', 'secondary'].indexOf(value) !== -1 // TODO: validator seems not to be called
    }
  }) type: String

  /**
   * Defines whether the icon is shown before or after the label.
   */
  @Prop({
    type: String,
    default: 'right',
    validator: (value: string) => {
      return ['left', 'right'].indexOf(value) !== -1 // TODO: validator seems not to be called
    }
  }) iconPosition;
}
