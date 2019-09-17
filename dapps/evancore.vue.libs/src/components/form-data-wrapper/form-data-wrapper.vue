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
  <div class="form-data-wrapper mt-2 mb-8" :class="{'edit-mode': editMode}">
    <div class="d-flex justify-content-between align-items-center pb-1">
      <h5 class="my-0 py-0 text-uppercase font-weight-bold">
        <i class="mdi mr-2" :class="[ {'mdi-lock': !isPublic}, {'mdi-web': isPublic} ]" />
        {{ title }}
      </h5>
      <!-- TODO: add share action to button: -->
      <evan-button v-if="!editMode" type="secondary" size="sm">{{ '_evan.share' | translate}}</evan-button>
    </div>
    <div class="pt-4">
      <slot v-bind:setEditMode="setEditMode">
        <form v-if="form">
          <template v-for="(controlName) in form.controls">
            <slot :name="`control-${ controlName }`">
              <component
                :disabled="isLoading"
                :error="getTranslation(form[controlName], 'error')"
                :is="getControlComponentName(form[controlName])"
                :label="getTranslation(form[controlName], 'label')"
                :placeholder="getTranslation(form[controlName], 'placeholder')"
                :value="form[controlName].value"
                v-bind="form[controlName].uiSpecs && form[controlName].uiSpecs.attr ? form[controlName].uiSpecs.attr : { }"
                @input="form[controlName].value = $event;"
              />
            </slot>
          </template>
        </form>
      </slot>
    </div>
    <template v-if="editMode">
      <a
        class="text-muted mt-4 mb-3 d-inline-block"
        href="https://evannetwork.github.io/docs/other/glossary.html#e"
        target="_blank"
        rel="noopener noreferrer">
        <i class="mdi mdi-information-outline mr-2" />
        {{ '_evan.transaction_costs_hint' | translate }}
      </a>
      <br />
      <evan-button type="primary" class="mr-3"
        :disabled="isLoading || disabled || (form && !form.isValid)"
        :isLoading="isLoading"
        :label="'_evan.save' | translate"
        @click="save"
      />
      <evan-button type="secondary"
        v-if="!isLoading"
        @click="cancel"
        :label="'_evan.cancel' | translate"
      />
    </template>
  </div>
</template>

<script lang="ts">
  import FormDataWrapper from './form-data-wrapper'
  export default FormDataWrapper
</script>

<style lang="scss" scoped>
  @import './form-data-wrapper.scss'
</style>

