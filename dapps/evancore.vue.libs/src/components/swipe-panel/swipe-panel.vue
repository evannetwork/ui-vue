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
  <div :style="`--evan-swipe-panel-size: ${ width }`">
    <template v-if="isRendered">
      <div class="evan-swipe-panel"
        :class="{
          'fixed': !mountId,
          'show': isShown,
          [`alignment-${alignment}`]: !mountId,
        }"
        :style="customStyle">
        <header v-if="!hideCloseButton || !!title">
          <slot name="header">
            <h3 class="title">
              {{ title }}
            </h3>
          </slot>
          <span class="mx-auto" />
          <evan-button
            @click="hide($event)"
            class="btn-close"
            icon="mdi mdi-close"
            type="icon-secondary"
            v-if="!hideCloseButton"
          />
        </header>
        
        <main>
          <slot></slot>
        </main>
        
        <footer>
          <slot name="footer"></slot>
        </footer>
      </div>
      <div v-if="showBackdrop" class="fullscreen"
        @click="hide($event)">
      </div>
    </template>
  </div>
</template>

<script lang="ts">
  import Component from './swipe-panel';
  export default Component;
</script>

<style lang="scss" scoped>
  @import './swipe-panel.scss';
</style>
