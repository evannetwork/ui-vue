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

// evan imports
import * as bcc from '@evan.network/api-blockchain-core';
import { cloneDeep } from '@evan.network/ui';

import EvanComponent from '../../../component';
import { EvanForm, EvanFormControl } from '../../../forms';

/**
 * Formular wrapper for handling evan.network specific formulars including an visible scope icon,
 * loading indicators, EvanForm and EvanFormControl support.
 *
 * @class         EvanFormComponent
 * @selector      evan-form
 */
@Component({ })
export default class EvanFormComponent extends mixins(EvanComponent) {
  /**
   * Form title that is displayed at the top of the formular
   */
  @Prop({
    type: String,
    required: true,
  }) title: string;

  /**
   * Is the formular data public or protected? Will switch the top left security indicator icon.
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
   * Display inputs with labels in oneline or stacked.
   */
  @Prop({
    default: false,
  }) stacked: boolean;

  /**
   * Render only the formular without adding the formular wrapper.
   */
  @Prop() onlyForm: boolean;

  /**
   * Hides / shows the cancel button
   */
  @Prop({ default: true }) enableCancel: boolean;

  /**
   * Function called, when share button is clicked.
   */
  @Prop({
    required: true
  }) handleShare: Function;

  /**
   * Makes the formular editable.
   */
  @Prop({ default: true }) editable: boolean;


  /**
   * Show / hide the share button.
   */
  @Prop({ default: true }) shareable: boolean;

  /**
   * Is the formular currently enabled?
   */
  editMode = false;

  /**
   * Latest values of the evan form, when editMode gets enabled.
   */
  formDataBackup: any = null;

  /**
   * Bind event handlers
   */
  created() {
    this.$on('setFocus', () => this.setEditMode(true));

    // activate edit mode directly if only form is specified
    this.onlyForm && this.setEditMode(true);
  }

  /**
   * Remove event handlers
   */
  beforeDestroy() {
    this.$off('setFocus');
  }

  /**
   * Set the current edit mode. If EvanForm was specified, create a form data backup, so the data
   * can be resetted on cancel.
   *
   * @param      {boolean}  active  enable / disable editMode
   */
  setEditMode(active: boolean): void {
    if (this.editable) {
      // save latest data, so we can restore it on cancelation
      if (!this.editMode && active && this.form) {
        // use clone deep to break array references (e.g. in file upload)
        this.formDataBackup = cloneDeep(bcc.lodash, this.form.getFormData());
      }

      this.editMode = active;
    }
  }

  /**
   * Set global UI property to open/close the right swipe panel or execute share handler.
   */
  share() {
    if (typeof this.handleShare === 'function') {
      this.handleShare();
    } else {
      console.warn('handleShare property is not a function.');
    }
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
    // restore old data, when the edit mode is cancled
    if (this.form && this.formDataBackup) {
      Object.keys(this.formDataBackup).forEach(controlKey => {
        this.form[controlKey].value = this.formDataBackup[controlKey];
      });
    }

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
    let returnTranslation = type !== 'hint';
    if (control.uiSpecs &&
        (control.uiSpecs.hasOwnProperty(type) ||
          (control.uiSpecs.attr && control.uiSpecs.attr.hasOwnProperty(type)))
      ) {
      // allow property definition within uiSpecis and within attr (specifing label within attr would be confusing)
      const specOverwrite = control.uiSpecs.attr && control.uiSpecs.attr[type] ?
        control.uiSpecs.attr[type] : control.uiSpecs[type];
      // if the attribute is a dynamic function, execute and return the value
      if (typeof specOverwrite === 'function') {
        return specOverwrite();
      }

      // if it's a hint, check if it's set to true or string
      if (type === 'hint') {
        if (specOverwrite) {
          // if true, enable hint translation
          if (typeof specOverwrite === 'boolean') {
            returnTranslation = true;
          } else {
            // for a string directly return it
            return this.$t(specOverwrite);
          }
        }
        // else, disable the hint
      } else {
        return this.$t(specOverwrite);
      }
    }

    if (returnTranslation) {
      // return default translation
      return this.$t(`${ this.i18nScope }.${ control.name }.${ type }`);
    } else {
      return '';
    }
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

    return `evan-form-control-${ type }`;
  }
}
