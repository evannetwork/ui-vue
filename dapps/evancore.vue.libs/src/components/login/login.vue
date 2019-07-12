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
  <div class="bg-level-3 w-100 h-100 d-flex align-items-center flex-column">
    <div class="mt-3 mb-3 text-center">
      <br>
      <h1 class="mt-4 font-weight-semibold">{{ '_evan.welcome-to-evan' | translate }}</h1>
      <h3 class="mt-4 font-weight-semibold text-muted">{{ '_evan.please-login' | translate }}</h3>
      <div class="bg-secondary d-inline-block" style="width: 70px; height: 5px;"></div>
      <br>
    </div>
    <div class="bg-level-1 mx-auto border password-dialog mt-3 mt-md-5">
      <div class="d-flex p-2 align-items-center justify-content-between border-bottom">
        <h4 class="m-0 ml-3">{{ '_evan.login' | translate }}</h4>
        <evan-logout ref="evanLogout">
          <template v-slot:button>
            <button type="button" class="btn"
              @click="$refs.evanLogout.logout()">
              <i class="mdi mdi-logout"></i>
            </button>
          </template>
        </evan-logout>
      </div>
      <form class="p-4" v-on:submit.prevent="login">
        <div class="form-group">
          <label for="password">{{ '_evan.password' | translate }}</label>
          <input class="form-control" type="password" required
            id="password" ref="password"
            :placeholder="'_evan.password-placeholder' | translate"
            v-model="form.password.value"
            v-bind:class="{ 'is-invalid' : form.password.dirty && !form.password.valid }">
          <div class="invalid-feedback">
            {{ '_evan.invalid-password' | translate }}
          </div>
        </div>

        <div class="text-center">
          <button type="submit" class="btn btn-rounded btn-primary font-weight-normal"
            :disabled="form.password.value.length < 8 || checkingPassword">
            <span class="spinner-border spinner-border-sm mr-3" role="status" aria-hidden="true"
              v-if="checkingPassword">
            </span>
            <span>{{ '_evan.use-password' | translate }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './login.ts';
  export default Component;
</script>

<style lang="scss" scoped>
  @import './login';
</style>
