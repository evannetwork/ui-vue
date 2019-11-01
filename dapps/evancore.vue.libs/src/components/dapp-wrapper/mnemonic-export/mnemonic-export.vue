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
  <div class="notification-bar">
    <div class="mnemonic" v-if="isShown">
      <p>{{ mnemonic }}</p>
      <button @click="copyToClipboard(mnemonic)">Copy</button>
      <button @click="downloadTextfile('Mnemonics', mnemonic)">Download</button>
    </div>
    <a
      class="hint-banner bg-primary bg-text-primary text-center"
      @click="toggleVisibility"
    >{{ '_evan.mnemonic-export.print-recovery' | translate }}</a>
  </div>
</template>

<script lang="ts">
import Component from "./mnemonic-export";
export default Component;
</script>

<style lang="scss" scoped>
@import "./mnemonic-export.scss";
</style>
