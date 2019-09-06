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
  <a class="d-flex align-items-center p-4"
    style="height: auto;"
    :href="`${ dapp.baseUrl }/${ dapp.rootEns }/profile.vue.${ dapp.domainName }`">
    <b class="text-dark d-flex mr-3 align-items-center justify-content-center"
      style="height: 30px; width: 30px; background-color: var(--evan-gray-400)">
      ?
    </b>
    <div class="d-flex flex-column justify-content-center">
      <template v-if="loading">
        <b class="text-dark">...</b>
        <small class="text-muted">...</small>
      </template>
      <template v-else>
        <b class="text-dark">{{ userInfo.alias }}</b>
        <small class="text-muted">{{ `_evan.profile.types.${ userInfo.type }` | translate }}</small>
      </template>
    </div>
  </a>
</template>

<script lang="ts">
  import Component from './profile-preview.ts';
  export default Component;
</script>


