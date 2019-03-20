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

import Vue from 'vue';
import { EvanFormControlOptions, } from './interfaces';

/**
 * One input control representation.
 *
 * @class      EvanFormControl (name)
 */
export class EvanFormControl {
  /**
   * Is the current element dirty? Error will be only returned, if an error is available.
   */
  dirty = false;

  /**
   * Internal error without custom getter
   */
  _error: any = false;

  /**
   * overwrite the error getter, so we only return an error, when the element is dirty
   */
  set error(value) {
    this._error = value;
  }
  get error() {
    return this.dirty ? this._error : false;
  }

  /**
   * Form control name.
   */
  name: string;

  /**
   * form control reference
   */
  get $ref() {
    return this.vueInstance.$refs[this.name];
  }

  /**
   * Original value, without custom setter amd getter
   */
  _value: any;

  /**
   * overwrite the value getter, so we automatically check for errors, when an validator was
   * applied.
   */
  set value(value) {
    this._value = value;

    if (this.validator) {
      this.error = this.validator(this.vueInstance, this);

      // if the validator was a promise, resolve it asynchroniously
      if (this.error && this.error.then) {
        Promise.resolve(async () => {
          this.error = await this.error;

          // set parent form validity
          if (this.form) {
            this.form.validateControls();
          }
        });
      } else {
        // set parent form validity
        if (this.form) {
          this.form.validateControls();
        }
      }
    }
  }
  get value() {
    return this._value;
  }

  /**
   * Validator function that will be runned when the value was changed
   */
  validator: Function|undefined;

  /**
   * The vue instance of for validation etc..
   */
  vueInstance: Vue;

  /**
   * Parent evan form, so the form is valid flag can be set automatically
   */
  form: EvanForm | undefined;

  /**
   * Create the new forms instance.
   */
  constructor(name: string, value: any, vueInstance: Vue, validator?: Function, form?: EvanForm) {
    this.form = form;
    this.name = name;
    this.validator = validator;
    this.vueInstance = vueInstance;

    if (typeof value !== 'undefined') {
      this.value = value;
    }
  }

  /**
   * Sets the control into dirty mode.
   */
  setDirty() {
    this.dirty = true;
  }
}

/**
 * Generalized data representation for a formular.
 *
 * @class      EvanForm
 */
export class EvanForm {
  /**
   * list of control names that were applied to the form
   */
  controls: Array<string>;

  /**
   * The vue instance of for validation etc..
   */
  vueInstance: Vue;

  /**
   * Is everything valid within the form?
   */
  isValid: boolean;

  constructor(vueInstance: Vue, controls: { [s: string]: EvanFormControl }) {
    this.controls = Object.keys(controls);

    // setup form controls
    // do not apply values initialy, set the control key first, so the validator can access the
    // controls
    this.controls.forEach(controlKey => {
      controls[controlKey].name = controlKey;

      this[controlKey] = new EvanFormControl(
        controlKey,
        undefined,
        vueInstance,
        controls[controlKey].validator,
        this
      );
    });

    // set values!
    this.controls.forEach(controlKey => this[controlKey].value = controls[controlKey].value);
  }

  /**
   * Check all controls if they are valid.
   */
  validateControls() {
    this.isValid = this.controls
      .filter(controlKey => this[controlKey]._error)
      .length === 0;
  }
}
