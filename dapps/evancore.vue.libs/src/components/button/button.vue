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
  <div class="wrapper">
    <button
      type="button"
      @click="$emit('click', $event)"
      :class="[{[`btn-${type}`]: type}, 'btn']"
      :disabled="disabled"
    >
      <template v-if="icon && !label">
        <i :class="['mdi', icon, 'centered']"></i>
      </template>
      <template v-else>
        <i v-if="icon && iconPosition === 'left'" :class="['mdi', icon, 'label', 'left']"></i>
        <span>{{label}}</span>
        <i v-if="icon && iconPosition === 'right'" :class="['mdi', icon, 'label', 'right']"></i>
      </template>
    </button>
  </div>
</template>

<script lang="ts">
  import Button from './button';
  export default Button;
</script>

<style lang="scss" scoped>
  @import './button.scss';
</style>
