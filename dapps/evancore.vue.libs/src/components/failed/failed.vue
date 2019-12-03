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
  <svg class="failed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
    <circle class="failed__circle" cx="26" cy="26" r="25" fill="none"/>
    <path class="failed__x" fill="none" d="M36 16L16 36M16 16L36 36"/>
  </svg>
</template>

<script lang="ts">
  import Component from './failed';
  export default Component;
</script>

<style lang="scss" scoped>
  @import './failed.scss';
</style>

