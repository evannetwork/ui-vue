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
  <b-table
    v-bind="$attrs"
    v-on="$listeners"
    class="evan-table-wrapper"
    :class="{ 'show-scrollbar': showScrollbar }"
    :tbody-tr-class="'evan-table-body-row'"
    :thead-tr-class="'evan-table-head-row'"
    :thead-class="'evan-table-head'"
  >
    <!-- Pass on all named slots -->
    <slot v-for="slot in Object.keys($slots)" :name="slot" :slot="slot" />

    <!-- Pass on all scoped slots -->
    <template v-for="slot in Object.keys($scopedSlots)" :slot="slot" slot-scope="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </b-table>
</template>

<script lang="ts">
import Component from './table';
export default Component;
</script>

<style lang="scss" scoped>
@import '~@evan.network/ui/src/style/utils';

.evan-table-wrapper {
  width: 100%;

  &.show-scrollbar {
    overflow-y: scroll;
    // This is needed for webkit browsers
    // https://stackoverflow.com/a/31278448
    &::-webkit-scrollbar {
      -webkit-appearance: none;
      width: 7px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: rgba(0, 0, 0, 0.5);
      -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
    }
  }

  /deep/ table.table.b-table {
    margin: 0;
    margin-left: auto;
    margin-right: auto;
    // Fix janky offset in sticky header
    padding-top: 1px;

    & > thead.evan-table-head > tr.evan-table-head-row > th {
      background-color: cssVar('bg-level-3');
      border: none;
      color: cssVar('gray-600');

      &[aria-sort='ascending'],
      &[aria-sort='descending'] {
        color: cssVar('primary');
      }
    }

    & > tbody > tr.evan-table-body-row {
      height: 64px;
      background-color: white;
      cursor: pointer;
      // create spacing between rows without using border-collapse
      // because it causes janky behavior with sticky header
      border-bottom: 4px solid cssVar('bg-level-3');

      & > td {
        vertical-align: middle;
        border: none;
      }

      &.b-table-empty-row {
        cursor: inherit;
      }
    }

    i.table-icon {
      font-size: 1.75em;
      margin-left: 0.25em;
    }
  }
}
</style>
