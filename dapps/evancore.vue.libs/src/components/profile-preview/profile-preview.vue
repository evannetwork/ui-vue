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
    <div class="d-flex mr-3 align-items-center justify-content-center bg-gray-300 text-dark"
      :style="size === 'sm' ?
        'height: 1.875em; width: 1.875em;' :
        'height: 8.75em; width: 8.75em;'
      ">
      <div class="spinner-border spinner-border-sm" v-if="loading"></div>
      <b v-else-if="size === 'sm'">?</b>
      <h1 v-else-if="size === 'lg'">?</h1>
    </div>
    <template v-if="!loading">
      <div class="d-flex flex-column justify-content-center"
        v-if="size === 'sm'">
        <b class="text-dark" style="font-size: 13px; font-weight: 600;">
          {{ userInfo.alias }}
        </b>
        <small style="font-size: 10px; font-weight: 300;">
          {{ `_evan.profile.types.${ userInfo.type }` | translate }}
        </small>
      </div>
      <div class="d-flex flex-column justify-content-between p-3"
        v-else-if="size === 'lg'"
        style="height: 8.75em;">
        <h2 class="font-weight-semibold mb-0">
          {{ userInfo.alias }}
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
  import Component from './profile-preview.ts';
  export default Component;
</script>


