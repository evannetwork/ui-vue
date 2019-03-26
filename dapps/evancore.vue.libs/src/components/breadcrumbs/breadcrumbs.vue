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
  <div class="evan-breadcrumbs
      bg-level-1 border-bottom
      d-flex p-2 align-items-center">
    <template 
      v-for="(breadcrumb, index) in breadcrumbs">
      <span class="p-2" v-if="index !== 0">/</span>
      <a class="evan-breadcrumb"
        :href="`#${ breadcrumb.path }`"
        :class="{ 'active': $route.path === breadcrumb.path }">
        {{ `${ i18nScope }.${ breadcrumb.name }` | translate }}
      </a>
    </template>
    <span class="mx-auto"></span>
    <slot name="content"></slot>
  </div>
</template>

<script lang="ts">
  import Component from './breadcrumbs.ts';
  export default Component;
</script>
