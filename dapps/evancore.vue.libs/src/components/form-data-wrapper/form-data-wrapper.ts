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

import { EvanForm, EvanFormControl } from '../../forms';

/**
 * Wrapper component for button elements.
 *
 * @class         ComponentsOverview
 * @selector      evan-components-overview
 */
@Component({ })
class FormDataWrapper extends mixins(EvanComponent) {
  /**
   * Form title
   */
  @Prop({
    type: String,
    required: true,
  }) title: string;

  /**
   * Sets editmode to active or inactive.
   */
  @Prop({
    type: Boolean,
    default: false,
  }) isPublic: boolean;

  /**
   * Show the loading symbol and disable the accept button.
   */
  @Prop({
    type: Boolean,
    default: false,
  }) isLoading: boolean;

  /**
   * Disable the save button
   */
  @Prop({
    type: Boolean,
    default: false,
  }) disabled: boolean;

  /**
   * Optional evan formular, that will automatically generate slot content formular. For custom
   * forms just overwrite the full content slot, or each generated field slot.
   */
  @Prop() form: EvanForm;

  /**
   * If the evan form is used to generate automatic inputs, all the input titles, descriptions and
   * errors will be translated using this i18n scope.
   */
  @Prop({
    default: '_evan',
  }) i18nScope: string;

  /**
   * Is the formular currently enabled?
   */
  editMode = false;

  /**
   * Bind event handlers
   */
  created() {
    this.$on('setFocus', () => {
      this.setEditMode(true)
    })
  }

  /**
   * Remove event handlers
   */
  beforeDestroy() {
    this.$off('setFocus')
  }

  /**
   * Set the current edit mode.
   *
   * @param      {boolean}  active  true / false
   */
  setEditMode(active: boolean): void {
    this.editMode = active;
  }

  /**
   * Trigger the save function and wait for resolve.
   *
   * @param      {Event}  ev      save event args
   */
  async save(ev: Event) {
    await this.$emit('save', ev);
    this.editMode = false;
  }

  /**
   * Cancel edit and send the corresponding event
   *
   * @param      {Event}  ev      event args to send
   */
  cancel(ev: Event) {
    this.$emit('cancel', ev);
    this.editMode = false;
  }

  /**
   * Return the translation for a control specific text (label, placeholder, error)
   *
   * @param      {EvanFormControl}  control  control that should be translated
   * @param      {string}           type     text that should be translated (label, placeholder, error)
   */
  getTranslation(control: EvanFormControl, type: string) {
    // if manual error text was specified, translate it and return it directly
    if (type === 'error') {
      if (typeof control.error !== 'boolean') {
        return this.$t(control.error);
      } else if (!control.error) {
        return control.error;
      }
    }

    // return directly specified translation
    if (control.uiSpecs && control.uiSpecs.attr && control.uiSpecs.attr[type]) {
      return this.$t(control.uiSpecs.attr[type]);
    }

    // return default translation
    return this.$t(`${ this.i18nScope }.${ control.name }.${ type }`);
  }

  /**
   * Get the form-data type component string for a control.
   *
   * @param      {EvanFormControl}  control  control that should be translated
   */
  getControlComponentName(control: EvanFormControl) {
    let type = 'input';

    if (control.uiSpecs) {
      type = control.uiSpecs.type || 'input';
    }

    return `evan-form-data-${ type }`;
  }
}

export default FormDataWrapper
