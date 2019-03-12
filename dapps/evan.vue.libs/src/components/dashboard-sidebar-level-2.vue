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
  <div>
    <slot name="content"></slot>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import * as dappBrowser from '@evan.network/ui-dapp-browser';

  export default Vue.extend({
    /**
     * Take the current element and search for an parent dashboard level 2 container, so move the
     * current element to this element.
     */
    mounted() {
      let parent: any = this.$el;
      let dashboards: Array<any> = [ ];

      // search until body or an dashboard body is reached
      do {
        parent = parent.parentElement;

        // collect a list of all parent dashboard bodies, to be able to take the highest one 
        if (parent.className.indexOf('dashboard-body') !== -1) {
          dashboards.push(parent);
        }
      } while (parent !== document.body);

      // if it's not the body, clear the latest dashboard-sidebar-2 element and 
      if (dashboards.length > 0) {
        dashboards.pop()
          .querySelector('.dashboard-sidebar-2')
          .appendChild(this.$el);
      } else {
        dappBrowser.utils.log(`dashboard-sidebar-level-2 element not included within an evan
          dashboard...`, 'warning');
      }
    },
  });
</script>

<style lang="scss" scoped>

</style>

