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
  <div class="evan-file-input">
    <evan-modal
      id="file-input-remove-modal"
      ref="removeFileModal"
      @canceled="fileRemove = -1;">
      <template v-slot:header>
        <h5 class="modal-title">
          {{ `_evan.file-input.remove-modal.title` | translate }}
        </h5>
      </template>
      <template v-slot:body>
        <p class="text-left m-0"
          v-html="$t(`_evan.file-input.remove-modal.desc`, modalParams)">
        </p>
      </template>
      <template v-slot:footer>
        <button
          id="file-input-remove-accept"
          type="button" class="btn btn-primary btn-rounded font-weight-normal"
          @click="removeFile(value[fileRemove], fileRemove)">
          {{ `_evan.file-input.remove-modal.action` | translate }}
          <i class="mdi mdi-arrow-right label ml-3"></i>
        </button>
      </template>
    </evan-modal>

    <div class="batch-label"
      v-for="(file, index) in value">
      <span>{{ file.name }}</span>

      <a class="btn p-0 ml-3"
        :id="`file-input-download-${ index }`"
        :href="file.blobUri"
        :download="file.name">
        <i class="mdi mdi-download-outline"></i>
      </a>
      <button
        id="file-input-remove"
        class="btn p-0 ml-1 delete"
        v-if="!disabled"
        @click="removeFile(file, index)">
        <i class="mdi mdi-delete-outline"></i>
      </button>
    </div>

    <div class="dropzone" v-if="!disabled">
      <input
        id="file-input-upload"
        type="file" multiple
        :accept="accept"
        :name="name"
        @change="filesChanged($event.target.files)">

      <div class="centered"
        v-html="$t(placeholder)">
      </div>
    </div>
    <div class="centered"
      v-else-if="value.length === 0"
      v-html="$t(emptyText)">
    </div>
  </div>
</template>

<script lang="ts">
  import EvanFilesInput from './files.ts';
  export default EvanFilesInput;
</script>

<style lang="scss" scoped>
  @import './files';
</style>
