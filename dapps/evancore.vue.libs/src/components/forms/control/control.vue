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
  <div class="form-group"
    :class="{ 'inline': !stacked, }"
    :style="{ 'width': size === 12 ? '100%' : `${ 100 * (size / 12) }%`, }">
    <label class="col-form-label"
      :for="id"
      v-if="label">
      {{ label }}
      <small class="text-muted" v-if="!isRequired()">
        ({{ '_evan.optional' | translate }})
      </small>
    </label>
    <div class="input-wrapper"
      :style="{ 'min-width': label ? '300px' : '0px' }">
      <slot></slot>
      <div class="invalid-feedback" v-if="error">
        {{ error | translate }}
      </div>
    </div>
    <small class="form-text text-muted" v-if="hint">
      {{ hint | translate }}
    </small>
  </div>
</template>

<script lang="ts">
  import FormDataInput from './control'
  export default FormDataInput
</script>

<style lang="scss" scoped>
  @import './control.scss'
</style>

