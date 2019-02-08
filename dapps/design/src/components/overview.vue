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
  <div class="overview">
    <div class="main" v-bind:style="{ 'background-image': 'url(' + $store.state.dappBaseUrl + '/assets/evan-background.jpg)' }">
      <div class="evan-responsive-container">
        <h1 class="super-large">
          overview back to evan.network<br>
        </h1>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import * as bcc from 'bcc';
  import * as dappBrowser from 'dapp-browser';

  export default Vue.extend({
    data () {
      return {
        transitionName: ''
      }
    },
    async created() {


      dappBrowser.loading.finishDAppLoading();
    },
    // beforeRouteUpdate (to, from, next) {
    //   const toDepth = to.path.split('/').length;
    //   const fromDepth = from.path.split('/').length;
    //   this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left';
    //   next();
    // },
    mounted: function () {
    }
  });
</script>

<style lang="scss" scoped>
  .overview {
    height: 100%;
    background-color: #fff;
  }

  .main {
    background-size: cover;
    height: 800px;
    background-position: center;
    background-repeat: no-repeat;
  }

  .evan-responsive-container {
    width: 80%;
    max-width: 1400px;
    margin: auto;
    left: 0;
    right: 0;

    padding-top: 150px;
  }

  .super-large {
    font-size: 55px;
    font-weight: 500;
    letter-spacing: -0.01em;
    line-height: 77px;
    max-width: 1400px;
  }
</style>

