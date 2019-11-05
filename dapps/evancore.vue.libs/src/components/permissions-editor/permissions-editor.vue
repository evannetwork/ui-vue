<template>
  <div class="wrapper">
    <h3>{{ `${i18nScope}.permissionsTitle` | translate }}</h3>

    <template v-if="contacts && contacts.length">
      <p>{{ `${i18nScope}.description` | translate }}</p>

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
          {{ $t('_evan.sharing.defineFor', { contactName: getContactLabel(selectedContact) }) }}
        </p>

        <div v-for="(val, contractId) in containersPermissions" :key="contractId">
          <evan-permissions
            :label="val.label"
            :permissions="val.permissions"
            :contractId="contractId"
            :updatePermissions="updateContractPermissions"
            :i18nScope="i18nScope"
            :sortFilter="getSortFilter(contractId)"
          />
        </div>
      </template>
    </template>
    <div v-else>
      <p>{{ `${i18nScope}.description-no-contacts` | translate }}</p>
      <div class="text-center my-5">
        <evan-button
          type="primary"
          :href="`#/${ dapp.rootEns }/profile.vue.${ dapp.domainName }/${ $store.state.runtime.activeAccount }/addressbook.vue.${ dapp.domainName }`">
          {{ '_evan.sharing.add-contact' | translate }}
        </evan-button>
      </div>
    </div>

    <div class="panel-footer" :class="{'relative': this.relative}">
      <evan-button type="secondary" :label="$t('_evan.cancel')" @click="reset" />
      <evan-button
        type="primary"
        :label="$t('_evan.sharing.update')"
        :disabled="!permissionsChanged"
        @click="writePermissions"
      />
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

