<template>
  <div>
    <h3>Update Permissions</h3>
    <p>
      {{ description }}
    </p>

    <template v-if="contacts && contacts.length">
      <evan-form-control-v-select
        class="loading"
        id="shareContactSelect"
        :label="$t('_evan.sharing.selectContact')"
        v-model="selectedContact"
        :options="contacts"
        :disabled="contacts.length === 0"
        @input="getPermissionsForContact"
      />

      <template v-if="isLoading">
        <evan-loading />
      </template>
      <template v-else>
         <p v-if="selectedContact" class="mt-6 mb-0">
            {{ $t('_evan.sharing.defineFor', { contactName: selectedContact.label }) }}
          </p>

          <div v-for="(val, dataSetId) in dataSets" :key="dataSetId">
            <evan-permissions
              :label="val.label"
              :permissions="val.permissions"
              :dataSetId="dataSetId"
              :updatePermissions="updateDataSetPermissions"
            />
          </div>

          <div class="panel-footer" v-if="selectedContact">
            <evan-button type="secondary" :label="$t('_evan.cancel')" @click="reset" />
            <evan-button
              type="primary"
              :label="$t('_evan.sharing.update')"
              :disabled="!permissionsChanged"
              @click="writePermissions"
            />
          </div>
      </template>
    </template>
    <div v-else>
      <p class="text-warning">
        {{ '_evan.sharing.noContacts' | translate}}
      </p>
    </div>

  </div>
</template>

<script lang="ts">
  import Component from './permissions-editor';
  export default Component;
</script>

<style lang="scss" scoped>
  @import './permissions-editor.scss'
</style>

