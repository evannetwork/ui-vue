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
  <div class="shared-contact" @mouseleave="($event) => handleCancelRemove($event)">
    <evan-profile-preview :address="item.accountId" size="sm" />
    <div  v-if="isLoading" class="spinner-border spinner-border-sm spinner" />
    <template v-else>
      <div v-if="!willRemove" class="permissions">{{ `_evan.permission.type.${item.permissionType}` | translate }}</div>
      <div v-else class="permissions hint">{{ `_evan.permission.hint`| translate }}</div>
      <div v-if="!willRemove" class="remove" @click="$event => handleWillRemove($event)">
        <i class="mdi mdi-close-circle" />
      </div>
      <div v-if="willRemove" class="d-flex align-items-center">
        <evan-button size="sm" type="secondary" class="mr-1" @click="$event => handleCancelRemove($event)">
          {{'_evan.no' | translate }}
        </evan-button>
        <evan-button size="sm" type="primary" class="mr-1" @click="$event => handleRemove($event)">
          {{'_evan.yes' | translate }}
        </evan-button>
      </div>
    </template>
  </div>  
</template>

<style lang="scss" scoped>
@import "./shared-contact.scss";
</style>

<script lang="ts">
import Component from "./shared-contact";
export default Component;
</script>
