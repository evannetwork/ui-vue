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
  <div class="evan-steps" v-if="steps && steps.length !== 0">
    <div :class="`evan-step-header${ minimal ? '-sm' : '' }`">
      <button class="btn"
        v-for="(step, index) of steps"
        :class="[
          `evan-step-${ index }`,
          { 'active': activeStep === index, }
        ]"
        :disabled="isDisabled(index)"
        @click="gotoStep(index)">
        <span class="stepper-circle">
          <template v-if="!minimal">{{ index + 1 }}</template>
        </span>
        <component
          :is="minimal ? 'evan-tooltip' : 'span'">
          {{ step.title | translate }}
        </component>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './steps';
  export default Component;
</script>


