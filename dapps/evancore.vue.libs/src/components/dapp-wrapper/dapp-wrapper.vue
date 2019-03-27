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
  <div class="evan-dapp-wrapper"
    :class="{ 'small-toolbar': smallToolbar }">
    <evan-logout ref="evanLogout" :disableButton="true"></evan-logout>
    <nav class="navbar" v-if="enableNav">
      <div class="navbar-brand"
        :class="{ 'clickable': !onboarding }"
        @click="openRouteBaseHash()">
        <img class="brand-large" :src="$props.brandLarge">
        <img class="brand-small" :src="$props.brandSmall">
      </div>
      <div class="nav" v-if="!login && !onboarding">
        <div>
          <button class="btn btn-lg" @click="toggleSmallToolbar()">
            <i class="fas fa-bars"></i>
          </button>
        </div>

        <div class="mr-3">
          <div class="spinner-border spinner-border-sm bg-text-inverted mr-3"
            v-if="userInfo.loading">
          </div>
          <template v-if="!userInfo.loading">
            <button class="btn btn-sm position-relative"
              @click="$refs.userDropdown.show()">
             <img class="mr-2 rounded-circle"
                v-if="userInfo.img"
                :src="userInfo.img">
              <i class="fas fa-user rounded-circle p-3 mr-2 bg-secondary bg-text-secondary"
                v-else>
              </i>
              {{ userInfo.alias }}
              <i class="fas fa-chevron-down ml-2"></i>

              <evan-dropdown ref="userDropdown"
                :alignment="'right'"
                :width="'300px'">
                <template v-slot:content>
                  <div class="dropdown-item p-3 d-flex flex-row align-items-center"
                    @click="evanNavigate(`profile.${ domainName }`); $refs.userDropdown.hide($event)">
                    <div class="flex-shrink-0">
                      <img class="mr-2 rounded-circle"
                        v-if="userInfo.img"
                        :src="userInfo.img">
                      <i class="fas fa-user rounded-circle p-3 mr-2 bg-secondary bg-text-secondary"
                        v-else>
                      </i>
                    </div>
                    <div class="pl-1 d-flex flex-column justify-content-center">
                      <h4 class="m-0 text-truncate">{{ userInfo.alias }}</h4>
                      <small class="text-muted text-truncate">{{ userInfo.address }}</small>
                    </div>
                    <i class="fas fa-chevron-right pl-3 flex-shrink-0"></i>
                  </div>
                  <div class="border-top pb-3 pt-3">
                    <a class="dropdown-item pt-2 pb-2 pl-3 pr-3"
                      v-for="(coreRoute, index) in coreRoutes"
                      @click="evanNavigate(`${ coreRoute.name }.${ domainName }`); $refs.userDropdown.hide($event)">
                      <i :class="`${ coreRoute.icon } mr-3`" style="width: 16px;"></i>
                      {{ `_evan._routes.${ coreRoute.name }` | translate }}
                    </a>
                  </div>
                  <a class="dropdown-item pt-2 pb-2 pl-3 pr-3 border-top"
                    @click="$refs.evanLogout.logout()">
                    <i class="fas fa-sign-out-alt mr-3"></i>
                    {{ '_evan.logout' | translate }}
                  </a>
                </template>
              </evan-dropdown>
            </button>
            <button class="btn btn-sm position-relative"
              @click="$refs.mailDropdown.show()"
              :disabled="userInfo.mailsLoading">
              <i class="far fa-envelope position-relative"
                v-if="!userInfo.mailsLoading">
                <span class="notification-dot" v-if="userInfo.newMailCount > 0"></span>
              </i>
              <div class="spinner-border spinner-border-sm bg-text-inverted"
                v-if="userInfo.mailsLoading">
              </div>
              <evan-dropdown ref="mailDropdown"
                :alignment="'right'"
                :width="'300px'">
                <template v-slot:content>
                  <div class="p-3">
                    <h4 class="m-0 text-truncate" v-if="userInfo.newMailCount !== 0">
                      {{ $t('_evan.dapp-wrapper.new-mails', userInfo) | translate }}
                    </h4>
                    <h4 class="m-0 text-truncate" v-if="userInfo.newMailCount === 0">
                      {{ '_evan.dapp-wrapper.my-mailbox' | translate }}
                    </h4>
                  </div>
                  <a class="dropdown-item border-top pt-2 pb-2 pl-3 pr-3 font-size-85"
                    v-for="(mail, index) in userInfo.mails"
                    :class="{ 'opacity-60': userInfo.readMails.indexOf(mail.address) !== -1 }"
                    @click="openMail(mail, $event)">
                    <h5 class="m-0 font-weight-bold text-truncate"
                      :class="{ 'text-primary': userInfo.readMails.indexOf(mail.address) === -1 }">
                      {{ userInfo.addressBook.profile[mail.from] ? userInfo.addressBook.profile[mail.from].alias : mail.from }}
                    </h5>
                    <span class="d-block mt-1 text-truncate">{{ mail.title }}</span>
                    <small class="font-italic d-block text-truncate">{{ mail.sent | moment('from') }}</small>
                  </a>
                  <a class="dropdown-item clickable border-top pt-2 pb-2 pl-3 pr-3 d-flex justify-content-center"
                    @click="evanNavigate(`mailbox.${ domainName }`); $refs.userDropdown.hide($event)">
                    {{ '_evan.dapp-wrapper.all-messages' | translate }}
                    <span class="mx-auto"></span>
                    <i class="fas fa-chevron-right"></i>
                  </a>
                </template>
              </evan-dropdown>
            </button>
          </template>

          <button class="btn btn-sm">
            <i class="fas fa-tasks"></i>
          </button>
        </div>
      </div>
    </nav>

    <div class="dapp-wrapper-body"
      v-if="!loading"
      :class="{
        'show-sidebar': showSideBar,
        'show-sidebar-2': showSideBar2
      }">
      <template v-if="!login">
        <template v-if="!onboarding">
          <div class="dapp-wrapper-sidebar" v-if="enableSidebar">
            <div class="sidebar-header">
              <div class="clickable">
                <h5
                  v-if="showSideBar && showSideBar2"
                  @click="showSideBar2 = false;">
                  <i class="fas fa-chevron-left mr-2"></i>
                  {{ activeRouteTitle | translate }}
                </h5>
              </div>
              <h3 class="mr-2" @click="showSideBar = false;">
                <i class="fas fa-times close"></i>
              </h3>
            </div>
            <slot name="sidebar">
              <div class="d-flex flex-column h-100">
                <ul class="nav font-medium in w-100" id="main-menu">
                  <li v-for="(route, index) in routes">
                    <a
                      :class="{ active: $route.path.startsWith(route.fullPath) }"
                      @click="routeActivated(route)">
                      <i :class="route.icon" data-icon="v"></i>
                      <span class="hide-menu">{{ route.title | translate }}</span>
                    </a>
                  </li>
                </ul>

                <ul class="nav small font-medium in w-100 mb-3 mt-auto" id="main-menu"
                  v-if="bottomRoutes">
                  <li v-for="(route, index) in bottomRoutes">
                    <a
                      :class="{ active: $route.path.startsWith(route.fullPath) }"
                      @click="routeActivated(route)">
                      <i :class="route.icon" data-icon="v"></i>
                      <span class="hide-menu">{{ route.title | translate }}</span>
                    </a>
                  </li>
                </ul>
              </div>
            </slot>
          </div>

          <!-- close side panel on medium screens -->
          <div class="dapp-wrapper-sidebar-background"
            @click="showSideBar = false;">
          </div>

          <div class="dapp-wrapper-sidebar-2">
            <!-- will be filled by using the dapp-wrapper-sidebar-level-2 component -->
          </div>
        </template>

        <div class="dapp-wrapper-content">
          <slot name="content"></slot>
        </div>
      </template>

      <evan-login v-else
        v-on:logged-in="login">
      </evan-login>
    </div>
    <div class="dapp-wrapper-body" v-else>
      <div class="w-100 h-100 mt-5 text-center">
        <div class="spinner-border text-secondary" role="status"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import DAppWrapper from './dapp-wrapper.ts';
  export default DAppWrapper;
</script>
