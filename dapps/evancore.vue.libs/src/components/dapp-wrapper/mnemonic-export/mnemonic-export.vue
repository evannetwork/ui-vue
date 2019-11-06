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
    <div @click="showModal" role="button" class="hint-banner bg-primary bg-text-primary col-md-8 offset-md-2 p-3 text-center">
      {{ '_evan.mnemonic-export.notification' | translate }}
    </div>

    <evan-modal ref="modal" :hideFooterButton="true" :maxWidth="'1000px'" class="mnemonic-modal">
      <template v-slot:header>
        <h5 class="modal-title">{{ '_evan.mnemonic-export.title' | translate }}</h5>
      </template>
      <template v-slot:body>
        <div class="print-view">
          <div class="row">
            <div class="col-md-6 info-box">
              <i class="mdi mdi-shield-alert-outline header-icon" />
              <p class="pre-wrap">{{ '_evan.mnemonic-export.description' | translate }}</p>
              <p class="pre-wrap bold">{{ '_evan.mnemonic-export.print-or-store' | translate }}</p>
            </div>
            <div class="col-md-6">
              <div class="row my-2">
                <div class="col-md-3">
                  <span class="bold">{{ '_evan.mnemonic-export.account-id' | translate }}</span>
                </div>
                <div class="col-md-9">
                  <span>{{ address }}</span>
                </div>
              </div>
              <div class="row my-2">
                <div class="col-md-3">
                  <span class="bold">{{ '_evan.mnemonic-export.alias' | translate }}</span>
                </div>
                <div class="col-md-9">
                  <span>{{ alias }}</span>
                </div>
              </div>
              <div class="row my-2">
                <div class="col-12">
                  <span class="bold">{{ '_evan.mnemonic-export.recovery-key' | translate }}</span>
                </div>
              </div>
              <div class="row mnemonics">
                <div class="col-md-6 col-lg-4"
                  v-for="(word, index) of mnemonic"
                  :key="word" >
                  <div class="word">
                    <span class="order">{{index}}:</span>
                    <span>{{word}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <!-- <evan-button type="secondary" @click="copyToClipboard(mnemonic.join(' '))">
          {{ '_evan.mnemonic-export.copy' | translate}}
        </evan-button> -->
        <evan-button type="secondary" @click="downloadTextfile('Mnemonics', mnemonic.join(' '))">
          {{ '_evan.mnemonic-export.download' | translate}}
        </evan-button>
        <evan-button type="primary" id="print" @click="print">
          {{ '_evan.mnemonic-export.print' | translate }}
        </evan-button>
      </template>
    </evan-modal>
  </div>
</template>

<script lang="ts">
import Component from "./mnemonic-export";
export default Component;
</script>

<style lang="scss" scoped>
@import "./mnemonic-export.scss";
</style>
