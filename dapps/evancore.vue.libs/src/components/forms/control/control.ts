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
import { Prop, Watch } from 'vue-property-decorator';

import EvanComponent from '../../../component';

/**
 * Base component for input element.
 *
 * @class         FormDataInput
 * @selector      evan-form-control-input
 */
@Component({})
export default class ControlComponent extends mixins(EvanComponent) {
  /**
   * The value for the input field.
   */
  @Prop() value: Array<any> | string;

  /**
   *  The label for the input field.
   */
  @Prop({
    type: String
  }) label: string;

  /**
   * Placeholder text if the input field
   */
  @Prop({
    type: String
  }) placeholder: string;

  /**
   * The id for the input field.
   */
  @Prop({
    type: String,
    required: true
  }) id: string;

  /**
   * Mark the input invalid
   */
  @Prop({
    type: String,
  }) error: string;

  /**
   * Disable the input field
   */
  @Prop() disabled: boolean;

  /**
   * Enable stacked to show labels and inputs not on oneline.
   */
  @Prop({
    default: false,
  }) stacked: boolean;

  /**
   * Bootstrap grid size
   */
  @Prop({
    default: 12,
  }) size: boolean;

  /**
   * Is the current field is required? If not, a optional hint will be displayed
   */
  @Prop() required: boolean|Function;

  /**
   * Determines if the current field is required. If not, show a optional hint.
   */
  isRequired() {
    if (this.required && typeof this.required === 'function') {
      return this.required();
    } else {
      return this.required;
    }
  }
}
