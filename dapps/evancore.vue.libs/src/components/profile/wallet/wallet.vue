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
    <div class="position-relative evan-highlight">
      <a class="evan-wallet"
        :href="walletLink"
        :style="{
          'background-image': `url(${ $store.state.uiLibBaseUrl }/assets/wallet-background.png)`
        }">
        <evan-loading v-if="loading"></evan-loading>
        <template v-else>
          <h1 class="text-primary">{{ balance.amount }} EVE</h1>
          <small class="text-light font-weight-semibold">
            {{ '_evan.profile.wallet.current-balance' | translate }}
            {{ balance.timestamp | moment('LLL') }}
          </small>
          <div class="account-info">
            <small>{{ alias === address ? $t('_evan.profile.no-alias') : alias }}</small>
            <small>{{ address }}</small>
          </div>
        </template>
      </a>
      <div class="qr-code-open evan-highlight"
        @click="showQRCode($event)">
        <i class="mdi mdi-qrcode-scan"></i>
      </div>
    </div>
    <evan-modal
      class="qrcode-modal"
      ref="qrCodeModal"
      :maxWidth="'600px'">
      <template v-slot:header>
        <div></div>
      </template>
      <template v-slot:body>
        <evan-qr-code
          :text="walletLink"
          height="400"
          width="400"
        />
      </template>
    </evan-modal>
  </div>
</template>

<script lang="ts">
  import Component from './wallet';
  export default Component;
</script>

<style lang="scss" scoped>
  @import "./wallet.scss";
</style>