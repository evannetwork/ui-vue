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
  <div class="text-center p-5">
    <h3 class="mt-4 font-weight-semibold">
      {{ '_evan.under-development.title' | translate }}
    </h3>
    <h5 class="font-weight-semibold text-muted">
      {{ '_evan.under-development.desc' | translate }}
    </h5>

    <img class="mt-5"
      style="
        opacity: 0.6;
        max-width: 100%;
        width: 400px;
      "
      :src="`${ uiBaseUrl }/assets/under-construction.svg`">
  </div>
</template>

<script lang="ts">
  import Component from './under-development.ts';
  export default Component;
</script>
