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
    <evan-modal ref="logoutModal">
      <template v-slot:header>
        <h5 class="modal-title">
          {{ '_evan.logout' | translate }}
        </h5>
      </template>
      <template v-slot:body>
        <p>{{ '_evan.logout-desc' | translate }}</p>
      </template>
      <template v-slot:footer>
        <button type="button" class="btn btn-rounded btn-primary font-weight-normal"
          @click="logout()">
          {{ '_evan.logout' | translate }}
        </button>
      </template>
    </evan-modal>

    <button type="submit" class="btn btn-outline-secondary btn-rounded"
      @click="$refs.logoutModal.showModal()">
      <span>{{ '_evan.logout' | translate }}</span>
    </button>
  </div>
</template>

<script lang="ts">
  import EvanLogoutComponent from './logout.ts';
  export default EvanLogoutComponent;
</script>

