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
import * as dappBrowser from '@evan.network/ui-dapp-browser';

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
  get $ref(): any {
    return this.vueInstance.$refs[this.name];
  }

  /**
   * Original value, without custom setter amd getter
   */
  _value: any;

  /**
   * overwrite the value getter, so we automatically check for errors, when an validate was
   * applied.
   */
  set value(value) {
    this._value = value;

    this.validate();
  }
  get value() {
    return this._value;
  }

  /**
   * validate function that will be runned when the value was changed
   */
  _validate: Function|undefined;

  /**
   * The vue instance of for validation etc..
   */
  vueInstance: Vue;

  /**
   * Parent evan form, so the form is valid flag can be set automatically
   */
  form: EvanForm | undefined;

  /**
   * True, when an asynchronious validate function was applied and this validation is running
   */
  validating: boolean;

  /**
   * Create the new forms instance.
   */
  constructor(name: string, value: any, vueInstance: Vue, validate?: Function, form?: EvanForm) {
    this.form = form;
    this.name = name;
    this._validate = validate;
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

  /**
   * Runs the validate function for this control
   */
  async validate() {
    if (this._validate) {
      let valid = this._validate(this.vueInstance, this.form, this);

      // if the _validate was a promise, resolve it asynchroniously
      if (valid && valid.then) {
        this.validating = true;
        valid = await valid;
        this.validating = false;
      }

      // validate function will return true if valid, else it can return an error or an false
      // boolean, so we must to invert the value for the error
      this.error = valid === true ? false : (valid ? valid : true);
      /**
       * even better readable and just funny:
       *   let truue = this._validate(this.vueInstance, this.form, this);
       *   let truee = false;
       *   this.error = truue === true ? truee : (truue ? truue : true)
       */

      // set parent form validity
      if (this.form) {
        this.form.validateControls();
      }
    }
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

  /**
   * Checks for an valid email address.
   *
   * @param      {string}   email   email address to checkl
   * @return     {boolean}  true / false
   */
  static validateEmail(email: string): boolean {
    /* tslint:disable */
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      .test(String(email).toLowerCase());
    /* tslint:enable */
  }

  /**
   * Checks for an valid ethereum accoung id.
   *
   * @param      {string}   email   email address to checkl
   * @return     {boolean}  true / false
   */
  static validEthAddress(address: string): boolean {
    return dappBrowser.bccHelper.getCoreRuntime().web3.utils.isAddress(address);
  }

  constructor(vueInstance: any, controls: { [s: string]: EvanFormControlOptions }) {
    this.controls = Object.keys(controls);
    this.vueInstance = vueInstance;

    // setup form controls
    // do not apply values initialy, set the control key first, so the validator can access the
    // controls
    this.controls.forEach(controlKey => {
      controls[controlKey].name = controlKey;

      this[controlKey] = new EvanFormControl(
        controlKey,
        undefined,
        this.vueInstance,
        controls[controlKey].validate,
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

  /**
   * Adds a single control to the current form
   *
   * @param      {string}                  name     name of the control
   * @param      {EvanFormControlOptions}  control  control options
   */
  addControl(controlKey: string, control: EvanFormControlOptions) {
    // remober the control list for validation purposes
    this.controls.push(controlKey);

    // create the form control
    control.name = controlKey;
    this[controlKey] = new EvanFormControl(
      controlKey,
      undefined,
      this.vueInstance,
      control.validate,
      this
    );

    // set the value
    this[controlKey].value = control.value;

    // trigger control validation
    this.validateControls();
  }

  /**
   * Remove a control from the form.
   *
   * @param      {string}  controlKey    controlKey of the control
   */
  removeControl(controlKey: string) {
    this.controls.splice(this.controls.indexOf(controlKey), 1);
    delete this[controlKey];

    this.validateControls();
  }
}
