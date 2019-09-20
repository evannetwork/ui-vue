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
  <a class="d-flex align-items-center text-decoration-none"
    style="height: auto;"
    :href="`${ dapp.baseUrl }/${ dapp.rootEns }/profile.vue.${ dapp.domainName }/detail/${ address }`">

    <div v-if="loading" class="spinner-border spinner-border-sm" />
    <evan-profile-picture v-else
      :src="userInfo.pictureSrc"
      :accountName="userInfo.accountName"
      :type="userInfo.type"
      :isVerified="userInfo.isVerified"
      :isEditable="address === $store.state.runtime.activeAccount"
      :size="size"
    />
    <template>
      <div class="d-flex flex-column justify-content-center"
        v-if="size === 'default' || size === 'sm'">
        <b class="text-dark" style="font-size: 13px; font-weight: 600;">
          {{ userInfo.accountName }}
        </b>
        <small style="font-size: 10px; font-weight: 300;">
          {{ `_evan.profile.types.${ userInfo.type }` | translate }}
        </small>
      </div>
      <div class="d-flex flex-column justify-content-between p-3"
        v-else-if="size === 'lg'"
        style="height: 8.75em;">
        <h2 class="font-weight-semibold mb-0">
          {{ userInfo.accountName }}
        </h2>
        <evan-address :address="address"></evan-address>
        <b class="text-primary"
          v-if="address === $store.state.runtime.activeAccount"
          @click="$emit('typeClick')">
          {{ `_evan.profile.types.${ userInfo.type === 'unspecified' ? 'choose' : userInfo.type }` | translate }}
        </b>
         <b v-else>
          {{ `_evan.profile.types.${ userInfo.type }` | translate }}
        </b>
      </div>
    </template>
  </a>
</template>

<script lang="ts">
  import Component from './profile-preview';
  export default Component;
</script>


