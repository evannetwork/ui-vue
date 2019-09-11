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
import Component, { mixins } from 'vue-class-component'
import EvanComponent from '../../component'
import Vue from 'vue'
import { Prop, Watch } from 'vue-property-decorator'

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
  }) title: string

  /**
   * Sets editmode to active or inactive.
   */
  @Prop({
    type: Boolean,
    default: false,
  }) isPublic: boolean

  /**
   * Function performed, when save button is clicked.
   */
  @Prop({
    type: Function,
    required: true,
  }) handleSave: (event: Event) => any

  /**
   * Function performed, when cancel button is clicked.
   */
  @Prop({
    type: Function,
    required: true,
  }) handleCancel: (event: Event) => any

  editMode = false
  isLoading = false

  setEditMode(active: boolean): void {
    this.editMode = active
  }

  async save (ev: Event) {
    this.isLoading = true

    await this.handleSave(ev)
    this.isLoading = false
    this.editMode = false
  }

  cancel(ev: Event) {
    if (typeof this.handleCancel === 'function') {
      this.handleCancel(ev)
    }

    this.editMode = false
  }
}

export default FormDataWrapper
