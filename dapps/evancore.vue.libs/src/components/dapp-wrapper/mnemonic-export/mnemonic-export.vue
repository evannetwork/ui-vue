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
  <div class="notification-bar" v-if="mnemonic">
    <div class="hint-banner bg-primary bg-text-primary col-md-8 offset-md-2 p-3 text-center">
      <a @click="showModal">{{ '_evan.mnemonic-export.print-recovery' | translate }}</a>
    </div>
    <evan-modal ref="modal" :hideFooterButton="true" :maxWidth="'800px'" disableBackdrop="true" class="mnemonic-modal">
      <template v-slot:header>
        <h5 class="modal-title">{{ '_onboarding.sign-up.get-mnemonic' | translate }}</h5>
      </template>
      <template v-slot:body>
        <div>
          <p v-html="$t('_onboarding.sign-up.get-mnemonic-desc-long')"></p>
          <div class="row mnemonics">
            <div class="col-12 col-md-6" v-for="word of mnemonic" :key="word">
              <span>{{word}}</span>
            </div>
          </div>

          <button @click="copyToClipboard(mnemonic.join(' '))">Copy</button>
          <button @click="downloadTextfile('Mnemonics', mnemonic.join(' '))">Download</button>
        </div>
      </template>
      <template v-slot:footer>
        <evan-button type="primary" id="modal-cancel">{{ '_evan.view-profile' | translate }}</evan-button>
      </template>
    </evan-modal>
    <div class="print-view">
      <div class="mnemonics">
        <ol>
          <li v-for="word of mnemonic" :key="word">{{word}}</li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Component from "./mnemonic-export";
export default Component;
</script>

<style lang="scss" scoped>
@import "./mnemonic-export.scss";
</style>
