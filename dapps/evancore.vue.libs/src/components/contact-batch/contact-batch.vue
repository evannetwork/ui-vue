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
  <div class="rounded-pill text-center"
    :style="{ 
      'background-color': `${ bgColor } !important`,
      'color': `${ textColor } !important`,
    }"
    style="
      width: 30px; height: 30px; line-height: 30px; padding: 0;
      font-size: 12px; font-weight: bold;
      display: inline-block;
    ">
    {{ batch }}
  </div>
</template>

<script lang="ts">
  import Component from './contact-batch';
  export default Component;
</script>


