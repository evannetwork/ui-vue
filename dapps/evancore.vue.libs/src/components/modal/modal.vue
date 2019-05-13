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

<template>
  <div>
    <template v-if="isRendered">
      <div class="modal fade" tabindex="-1"
        :class="{ 'show': isShown }"
        @click="hide(); $emit('canceled', { backdrop: true });">
        <div class="modal-dialog" role="document"
          :style="{ 'max-width': maxWidth }">
          <div class="modal-content" v-on:click.stop>
            <template v-if="!customModal">
              <div class="modal-header d-flex align-items-center">
                <slot name="header"></slot>
                <button class="btn p-0"
                  @click="hide()">
                  <i class="mdi mdi-close"></i>
                </button>
              </div>
              <div class="modal-body">
                <slot name="body"></slot>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary btn-rounded"
                  id="modal-cancel"
                  @click="hide(); $emit('canceled', { backdrop: false });">
                  {{ '_evan.cancel' | translate }}
                </button>
                <slot name="footer"></slot>
              </div>
            </template>
            <slot name="content" v-if="customModal"></slot>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade"
        :class="{ 'show': isShown }">
      </div>
    </template>
  </div>
</template>

<script lang="ts">
  import ModalComponent from './modal.ts';
  export default ModalComponent;
</script>

