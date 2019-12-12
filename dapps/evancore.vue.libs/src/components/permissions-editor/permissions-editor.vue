<template>
    <div class="wrapper">
        <template v-if="contacts && contacts.length">
          <p>{{ `${i18nScope}.description` | translate }}</p>

          <evan-form-control-v-select
            class="loading"
            id="shareContactSelect"
            v-model="selectedContact"
            :disabled="contacts.length === 0"
            :label="$t('_evan.sharing.selectContact')"
            :options="contacts"
            required="true"
            @input="getPermissionsForContact"
          />

          <template v-if="selectedContact">
            <evan-loading v-if="isLoading"/>
            <template v-else>
              <p v-if="selectedContact" class="mt-6 mb-0">
                {{ $t('_evan.sharing.defineFor', { contactName: selectedUsername }) }}
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
    </div>
  </template>
</template>

<script lang="ts">
  import Component from './permissions-editor';
  export default Component;
</script>

<style lang="scss" scoped>
  @import './permissions-editor.scss';
</style>

