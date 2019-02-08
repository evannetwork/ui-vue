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

  You can be released from the requirements of the GNU Affero General Public
  License by purchasing a commercial license.
  Buying such a license is mandatory as soon as you use this software or parts
  of it on other blockchains than evan.network.

  For more information, please contact evan GmbH at this address:
  https://evan.network/license/
*/

<template>
  <div class="evan-background evan-theme-evan">
    <md-toolbar
      :md-elevation="activeTab === 'overview' ? 0 : 1" 
      :class="activeTab === 'overview' ? 'md-transparent evan-responsive-container' : ''">
      <img :src="$store.state.dappBaseUrl + '/assets/evan-logo.svg'">
      <md-tabs md-alignment="right"
      :class="'md-transparent ' + (activeTab === 'overview' ? 'disable-active' : '')"
        :md-active-tab="activeTab">
        <md-tab id="overview" md-label="Overview" v-on:click="activateTab('overview')"></md-tab>
        <md-tab id="favorites" md-label="Favorites" v-on:click="activateTab('favorites')"></md-tab>
        <md-tab id="contacts" md-label="Contacts" v-on:click="activateTab('contacts')"></md-tab>
        <md-tab id="mailbox" md-label="Mailbox" v-on:click="activateTab('mailbox')"></md-tab>
        <md-tab id="profile" md-label="Profile" v-on:click="activateTab('profile')"></md-tab>
      </md-tabs>
    </md-toolbar>
    <transition name="fade" mode="out-in">
      <router-view class="child-view"></router-view>
    </transition>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import * as bcc from 'bcc';
  import * as dappBrowser from 'dapp-browser';

  export default Vue.extend({
    data () {
      return {
        transitionName: '',
        activeTab: 'overview'
      }
    },
    async created() {
      dappBrowser.loading.finishDAppLoading();
    },
    methods: {
      activateTab(tabName) {
        this.activeTab = tabName;
        this.$router.push({ name: tabName, query: this.$route.query });
      }
    }
  });
</script>

<style lang="scss" scoped>

</style>

