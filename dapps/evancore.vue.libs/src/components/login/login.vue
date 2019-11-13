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
  <div class="bg-level-3 w-100 h-100 d-flex align-items-center justify-content-center flex-column">
    <h4
      class="text-center mt-4 mb-3 text-uppercase font-weight-bold"
    >{{ '_evan.log-in' | translate }}</h4>
    <div class="form-container">
      <form class="p-4" @submit.prevent="login">
        <div class="form-group">
          <label for="alias">{{ '_evan.alias' | translate }}</label>
          <input class="form-control" id="alias" type="text" :value="alias" disabled />

          <evan-logout ref="evanLogout">
            <template v-slot:button>
              <div class="d-flex">
                <div class="flex-grow-1"></div>
                <a
                  class="not-your-account mt-2"
                  @click="$refs.evanLogout.logout()"
                >{{ '_evan.not-your-account' | translate }}</a>
              </div>
            </template>
          </evan-logout>
          <label for="password">{{ '_evan.password' | translate }}</label>
          <input
            class="form-control"
            type="password"
            required
            id="password"
            ref="password"
            :placeholder="'_evan.password-placeholder' | translate"
            v-model="form.password.value"
            v-bind:class="{ 'is-invalid' : form.password.dirty && !form.password.valid }"
          />
          <div class="invalid-feedback">{{ '_evan.invalid-password' | translate }}</div>
        </div>

        <div class="text-center mt-6">
          <button
            type="submit"
            class="btn btn-block btn-primary"
            :disabled="form.password.value.length < 8 || checkingPassword"
          >
            <span
              class="spinner-border spinner-border-sm mr-3"
              role="status"
              aria-hidden="true"
              v-if="checkingPassword"
            ></span>
            <span>{{ '_evan.log-in' | translate }}</span>
          </button>
        </div>
        <div class="text-center mt-3" v-if="showSignup">
          <p v-html="$t('_evan.need-an-account')"></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import Component from "./login";
export default Component;
</script>

<style lang="scss" scoped>
@import "./login";
</style>
