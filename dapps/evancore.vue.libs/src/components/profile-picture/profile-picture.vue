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

<template>
  <div>
    <div class="profile-picture" :class="size">
      <div class="mask" :class="type">
        <img
          v-if="src && src.length > 0"
          v-bind="$attrs"
          :src="src"
        />
        <div v-else class="image-placeholder">
          {{ getInitials(accountName) }}
        </div>
      </div>
      <img
        v-if="isVerified"
        class="verification-icon"
        :src="`${ $store.state.uiLibBaseUrl }/assets/verification.svg`"
        alt="verification icon"
      />
      <evan-button
        v-if="isEditable"
        @click="$refs.pictureUploadModal.show()"
        class="m-auto"
        type="icon"
        icon="mdi mdi-camera"
      />
    </div>
    <!-- File upload modal -->
    <evan-modal ref="pictureUploadModal" :maxWidth="'600px'">
      <template v-slot:header>
        <h5 class="modal-title">{{ '_evan.profile-picture.upload' | translate }}</h5>
      </template>
      <template v-slot:body>
        <evan-file-input
          stacked="true"
          v-model="fileForm.value"
          :class="{ 'is-invalid' : fileForm.error }"
          :accept="'image/x-png,image/png,image/gif,image/jpeg'"
          @input="pictureChanged"
          :placeholder="$t('_evan.profile-picture.upload-dnd')"
        />
        <div class="profile-picture m-auto lg" >
          <div class="mask" :class="type">
            <img
              v-if="changedPicture && changedPicture.blobUri && changedPicture.blobUri.length > 0"
              :src="changedPicture.blobUri"
            />
            <div v-else class="image-placeholder">
              {{ getInitials(accountName) }}
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <evan-button
          :disabled="!changedPicture"
          @click="usePicture"
          :label="$t('_evan.profile-picture.use-picture')"
        />
      </template>
    </evan-modal>
  </div>
</template>

<script lang="ts">
  import Component from "./profile-picture";
  export default Component;
</script>

<style lang="scss" scoped>
  @import "./profile-picture.scss";
</style>
