<template>
  <div class="helloworld-vue">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import * as bcc from 'bcc';
import {
  loading,
  bccHelper,
} from 'dapp-browser';

export default Vue.extend({
  data () {
    return { }
  },
  async created () {
    loading.finishDAppLoading();

    // if the bcc wasn't initialized for the current account, do it!
    if (!bcc.ProfileRuntime) {
      await bccHelper.startBCC(bcc);
    }
  }
});
</script>
