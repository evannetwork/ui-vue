<!-- src/components/Hello.vue -->
<template>
  <div>
    <md-content>Background</md-content>
    <md-content class="md-primary">Primary</md-content>
    <md-content class="md-accent">Accent</md-content>
  </div>
</template>

<script lang="ts">
import * as bcc from 'bcc';
import Vue from "vue";
import { System, core, } from 'dapp-browser';
  
export default Vue.extend({
  data: function () {
    return {

    }
  },
  methods: {

  }
});
</script>
