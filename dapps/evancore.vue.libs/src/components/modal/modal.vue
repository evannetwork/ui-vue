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
    <template v-if="render">
      <div class="modal fade" tabindex="-1" role="dialog"
        :class="{ 'show': show }"
        @click="hideModal()">
        <div class="modal-dialog" role="document">
          <div class="modal-content" v-on:click.stop>
            <div class="modal-header">
              <slot name="header"></slot>
              <button type="button" class="close" aria-label="Close"
                @click="hideModal()">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <slot name="body"></slot>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary btn-rounded" data-dismiss="modal"
                @click="hideModal()">
                {{ '_evan.cancel' | translate }}
              </button>
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade"
        :class="{ 'show': show }">
      </div>
    </template>
  </div>
</template>

<script lang="ts">
  import ModalComponent from './modal.ts';
  export default ModalComponent;
</script>

