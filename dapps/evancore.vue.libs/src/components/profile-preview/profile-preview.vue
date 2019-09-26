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
  <div class="d-flex align-items-center text-decoration-none" :class="size">
    <div v-if="loading" class="spinner-border spinner-border-sm" />
    <evan-profile-picture v-else
      :src="userInfo.pictureSrc"
      :accountName="userInfo.accountName"
      :type="userInfo.type"
      :isVerified="userInfo.isVerified"
      :isEditable="address === $store.state.runtime.activeAccount"
      :size="size"
    />
    <template v-if="userInfo !== null">
      <div class="d-flex flex-column justify-content-center ml-3"
        v-if="size === 'default' || size === 'sm'">
        <a :href="`${ dapp.baseUrl }/${ dapp.rootEns }/profile.vue.${ dapp.domainName }/detail/${ address }`">
          <b class="text-dark" style="font-size: 13px; font-weight: 600;">
            {{ userInfo.accountName }}
          </b>
        </a>
        <small style="font-size: 10px; font-weight: 300;">
          {{ `_evan.profile.types.${ userInfo.type }` | translate }}
        </small>
      </div>
      <div v-else-if="size === 'lg'" class="d-flex flex-column justify-content-between p-3">
        <a :href="`${ dapp.baseUrl }/${ dapp.rootEns }/profile.vue.${ dapp.domainName }/detail/${ address }`">
          <h2 class="font-weight-semibold mb-0">
            {{ userInfo.accountName }}
          </h2>
        </a>
        <evan-address v-if="address" :address="address" />
        <b>{{ `_evan.profile.types.${ userInfo.type }` | translate }}</b>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
  import Component from './profile-preview';
  export default Component;
</script>


