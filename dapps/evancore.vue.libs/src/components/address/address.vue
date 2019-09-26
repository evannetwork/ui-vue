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
  <span
    class="evan-address"
    :class="this.class"
    @mouseenter="hover = true;"
    @mouseleave="hover = false;">
    {{ address }}
    <div class="interactions">
      <button class="btn btn-sm btn-icon"
        @click="copyAddress();">
        <i class="mdi mdi-content-copy"></i>
        <evan-tooltip>{{ '_evan.address.copy' | translate }}</evan-tooltip>
      </button>
      <a class="btn btn-sm btn-icon"
        target="_blank"
        :href="`https://testexplorer.evan.network/address/${ address }/transactions`">
        <i class="mdi mdi-map-marker-path"></i>
        <evan-tooltip>{{ '_evan.address.open-in-explorer' | translate }}</evan-tooltip>
      </a>
    </div>
  </span>
</template>

<script lang="ts">
  import Component from './address.ts';
  export default Component;
</script>

<style lang="scss" scoped>
  @import './address.scss';
</style>

