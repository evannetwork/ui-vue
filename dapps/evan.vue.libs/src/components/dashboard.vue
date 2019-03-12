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
  <div class="evan-dashboard">
    <nav class="navbar">
      <div class="navbar-brand" href="#">
        <img class="brand-large" :src="$props.brandLarge">
        <img class="brand-small" :src="$props.brandSmall">
      </div>
      <div class="nav">
        <div>
          <button class="btn btn-lg">
            <i class="fas fa-bars"></i>
          </button>
        </div>

        <div class="mr-3">
          <button class="btn btn-sm">
            <img class="mr-2" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgV1cokAhUc_f0ljJt88_Jf4K9RaRgZSvGuUCBV6Up4SS9wo--">
            User XYZ
            <i class="fas fa-chevron-down ml-2"></i>
          </button>
          <button class="btn btn-sm">
            <i class="far fa-envelope"></i>
          </button>
          <button class="btn btn-sm">
            <i class="fas fa-tasks"></i>
          </button>
        </div>
      </div>
    </nav>

    <div class="dashboard-body">
      <div class="dashboard-sidebar">
        <slot name="sidebar"></slot>
      </div>

      <div class="dashboard-sidebar-2">
        <!-- will be filled by using the dashboard-sidebar-level-2 component -->
      </div>

      <div class="dashboard-content bg-gray-300">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import * as bcc from '@evan.network/api-blockchain-core';
  import * as dappBrowser from '@evan.network/ui-dapp-browser';

  export default Vue.extend({
    props: {
      brandLarge: String,
      brandSmall: String,
    },
    data () {
      return {
        
      }
    },
    async created() {

    }
  });
</script>

<style lang="scss" scoped>

</style>

