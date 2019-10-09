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
  <div
    class="evan-form mt-2 mb-8"
    :class="{
      'edit-mode': editMode && !onlyForm,
      'form-data-wrapper': !onlyForm,
      'transparent': !editMode && !onlyForm,
    }"
  >
    <div class="d-flex justify-content-between align-items-center pb-1" v-if="!onlyForm">
      <h5 class="my-0 py-0 text-uppercase font-weight-bold">
        <i class="mdi mr-2" :class="[ {'mdi-lock': !isPublic}, {'mdi-web': isPublic} ]" />
        {{ title }}
      </h5>
      <!-- TODO: add share action to button: -->
      <evan-button v-if="!editMode" type="secondary" size="sm">{{ '_evan.share' | translate }}</evan-button>
    </div>
    <div class="px-0 pt-4" :class="{ 'container': stacked }">
      <form class="d-flex flex-wrap flex-row justify-content-between" @submit="save">
        <slot v-bind:setEditMode="setEditMode"></slot>
        <slot name="form" v-if="form">
          <template v-for="(controlName) in form.controls">
            <slot :name="`form-control-${ controlName }`">
              <component
                :disabled="isLoading"
                :error="(onlyForm || editMode && !onlyForm) ? getTranslation(form[controlName], 'error') : false"
                :is="getControlComponentName(form[controlName])"
                :label="getTranslation(form[controlName], 'label')"
                :placeholder="getTranslation(form[controlName], 'placeholder')"
                :stacked="stacked"
                v-model="form[controlName].value"
                v-bind="form[controlName].uiSpecs && form[controlName].uiSpecs.attr ? form[controlName].uiSpecs.attr : { }"
                @blur="form[controlName].setDirty()"
              />
            </slot>
          </template>
        </slot>
      </form>
    </div>
    <template v-if="(editMode || isLoading) && !onlyForm">
      <div class="d-flex justify-content-end">
        <div>
          <a
            class="text-muted mb-3 d-block text-right"
            href="https://evannetwork.github.io/docs/other/glossary.html#e"
            target="_blank"
            rel="noopener noreferrer"
            v-if="!isLoading"
          >
            <i class="mdi mdi-information-outline mr-2" />
            {{ '_evan.transaction_costs_hint' | translate }}
          </a>
          <div>
            <evan-button
              class="mr-3"
              type="secondary"
              v-if="!isLoading"
              @click="cancel"
              :label="'_evan.cancel' | translate"
            />
            <evan-button
              type="primary"
              :disabled="isLoading || disabled || (form && !form.isValid)"
              :isLoading="isLoading"
              :label="'_evan.save' | translate"
              @click="save"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import FormDataWrapper from "./form";
export default FormDataWrapper;
</script>

