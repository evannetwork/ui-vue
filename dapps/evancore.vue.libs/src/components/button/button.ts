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
import { Prop } from 'vue-property-decorator';

/**
 * Wrapper component for button elements.
 *
 * @class         ComponentsOverview
 * @selector      evan-components-overview
 */
@Component({ })
export default class Button extends mixins(EvanComponent) {
  /**
   * disabled option, passed to html button element
   */
  @Prop({
    type: Boolean,
    default: false,
  }) disabled: boolean;

  /**
   * size of the button (lg, normal, sm)
   */
  @Prop({
    type: String,
    default: 'normal',
  }) size: string;

  /**
   * Evan specific button type (have a look at known types) + bootstrap definitions
   */
  @Prop({
    type: String,
    default: 'secondary',
  }) type: string;

  /**
   * Href property for link button
   */
  @Prop({
    default: null,
  }) href: string;

  /**
   * Button Label.
   */
  @Prop({ type: String }) label: string;

  /**
   * The class name for the material design icon, without prefixed 'mdi'.
   *
   * @see: https://materialdesignicons.com/cdn/2.0.46/
   */
  @Prop({
    type: String,
    validator: value => value.slice(0, 3) === 'mdi' // TODO: validator seems not to be called
  }) icon: string;

  /**
   * Defines whether the icon is shown before or after the label.
   */
  @Prop({
    type: String,
    default: 'right',
    validator: (value: string) => {
      return ['left', 'right'].indexOf(value) !== -1; // TODO: validator seems not to be called
    }
  }) iconPosition;

  /**
   * Loading state of the component.
   */
  @Prop({ type: Boolean, default: false }) isLoading: boolean;

  /**
   * Button Label.
   */
  @Prop({ type: String, default: 'button' }) nativeType: string;

  /**
   * Evan specific button definitions mapped to it's classes. By applying other types, they will be
   * added as usual bootstrap buttons.
   */
  knownTypes = {
    'icon': 'btn-icon-secondary',
    'icon-primary': 'btn-icon-primary',
    'icon-secondary': 'btn-icon-secondary',
    'link': 'btn-link',
    'primary': 'btn-primary',
    'secondary': 'btn-outline-primary',
    'text': 'btn-text-primary',
    'text-primary': 'btn-text-primary',
    'text-secondary': 'btn-text-secondary',
  };
}
