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
          <button class="btn btn-sm">
            <img class="mr-2" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgV1cokAhUc_f0ljJt88_Jf4K9RaRgZSvGuUCBV6Up4SS9wo--">
            User XYZ
            <i class="fas fa-chevron-down ml-2"></i>
          </button>
          <button class="btn btn-sm">
            <i class="far fa-envelope"></i>
          </button>
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
                      :href="`#${ route.fullPath }`"
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
                      :href="`#${ route.fullPath }`"
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
