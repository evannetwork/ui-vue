<template>
  <div>
    <h3>Update Permissions</h3>
    <p>
      To share your profile information with another contact, fill out the form below and click on
      “Share Profile Data”
    </p>

    <div v-if="contacts && contacts.length">
      <evan-form-control-v-select
        id="shareContactSelect"
        :label="$t('_evan.sharing.selectContact')"
        v-model="selectedContact"
        :options="contacts"
        :disabled="contacts.length === 0"
      />

      <div v-for="(val, dataSetId) in dataSets" :key="dataSetId">
        <evan-permissions
          :label="val.label"
          :permissions="val.permissions"
          :dataSetId="dataSetId"
          :updatePermissions="updatePermissions"
        />
      </div>

      <evan-button type="secondary" :label="$t('_evan.cancel')" @click="reset" />
      <evan-button type="primary" :label="$t('_evan.sharing.update')" :disabled="!permissionsChanged" />
    </div>

    <div v-else>
      <p>
        You have no contacts in your address book.
        Please add a contact first  to share with.
      </p>
    </div>

  </div>
</template>

<script lang="ts">
  import Component from './permissions-editor';
  export default Component;
</script>
