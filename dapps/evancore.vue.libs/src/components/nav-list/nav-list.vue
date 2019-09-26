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
  <div class="evan-nav-list">
    <evan-logout ref="logoutComp"
      disableButton="true"
      v-if="showLogout">
    </evan-logout>
    <slot name="header">
      <evan-profile-preview
        class="p-4"
        :address="$store.state.runtime.activeAccount">
      </evan-profile-preview>
    </slot>
    <div class="nav-entries">
      <template
        v-for="(entry, index) in entries">
        <span v-if="!entry" class="my-auto"></span>
        <a
          v-else
          :id="entry.id"
          :class="[
            { 'active': activeEntry === index },
            `entry-${ index + 1 }`
          ]"
          :href="entry.href"
          @click="entry.action && entry.action();">
          <i class="mr-3" :class="entry.icon"></i>
          {{ entry.text | translate }}
        </a>
      </template>
    </div>

    <div class="nav-entries" style="flex: 0">
      <a id="evan-logout"
        @click="$refs.logoutComp.logout();">
        <i class="mr-3 mdi mdi-logout"></i>
        {{ '_evan.logout' | translate }}
      </a>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './nav-list.ts';
  export default Component;
</script>

