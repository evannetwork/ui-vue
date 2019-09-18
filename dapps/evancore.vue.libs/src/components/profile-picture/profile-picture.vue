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
    <div class="profile-picture" :class="size" @click="$refs.pictureUploadModal.show()">
      <div class="mask" :class="type">
        <img v-bind="$attrs" />
      </div>
      <img
        class="verification-icon"
        :src="`${ uiBaseUrl }/assets/notary-verification.svg`"
        alt="notary verification icon"
      />
    </div>
    <img
      class="verification-icon"
      :src="`${ uiBaseUrl }/assets/verification.svg`"
      alt="verification icon"
    />

    <!-- File upload modal -->
    <evan-modal ref="pictureUploadModal" :maxWidth="'600px'">
      <template v-slot:header>
        <h5 class="modal-title">{{'Upload your profile picture here' || translate}}</h5>
        <!-- TODO: no H5 ? */ -->
      </template>
      <template v-slot:body>
        <evan-file-input
          v-model="fileForm.uploadModel"
          :class="{ 'is-invalid' : fileForm.error }"
          :accept="'image/x-png,image/png,image/gif,image/jpeg'"
          @input="fileForm.setDirty();"
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
