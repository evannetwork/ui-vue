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
  <div class="shared-contact">
    <evan-profile-preview :address="item.accountId" :accountName="item.alias" size="sm" />
    <div class="permissions">{{ `_profile.sharings.permission.type.${item.permissionType}` | translate }}</div>
    <div class="actions">
      <div class="remove">
        <i class="mdi mdi-close-circle" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
    @import "./shared-contact.scss";
</style>

<script lang="ts">
    import Component from "./shared-contact";
    export default Component;
</script>
