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
    :id="id"
    :class="{
      'show-sidebar': showSideBar,
      'show-sidebar-2': showSideBar2 && visibleSideBar2,
    }">
    <evan-logout ref="evanLogout" :disableButton="true"></evan-logout>

    <div class="dapp-wrapper-body"
      v-if="!loading">
      <div class="container w-100"
        v-if="!supportedBrowser">
        <div class="white-box border-smooth rounded"
          style="margin-top: 25%; width: 500px; margin-left: auto; margin-right: auto;">
          <div class="header">
            <h3 class="m-0 font-weight-semibold">
              {{ '_evan.browser-not-supported.title' | translate }}
            </h3>
          </div>
          <p class="content mb-0"
            v-html="$t('_evan.browser-not-supported.desc')">
          </p>
        </div>
      </div>
      <template v-else-if="!login">
        <div class="dapp-wrapper-sidebar" v-if="!onboarding && enableSidebar">
          <slot name="sidebar">
            <div class="d-flex flex-column h-100">
              <ul class="nav font-medium in w-100" id="main-menu">
                <li v-for="(route, index) in routes">
                  <a
                    :id="`evan-dapp-${ route.path.split('.')[0] }`"
                    :class="{ active: route.path && $route.path.startsWith(route.fullPath) }"
                    :href="route.path ? `${ dapp.fullUrl }/${ route.path }` : null"
                    @click="routeActivated(route)">
                    <i :class="route.icon" data-icon="v"></i>
                    <evan-tooltip :placement="'right'">
                      {{ route.title | translate }}
                    </evan-tooltip>
                  </a>
                </li>
              </ul>

              <ul class="nav small font-medium in w-100 mb-3 mt-auto" id="main-menu"
                v-if="bottomRoutes">
                <li v-for="(route, index) in bottomRoutes">
                  <a
                    :id="`evan-dapp-${ route.path.split('.')[0] }`"
                    :class="{ active: route.path && $route.path.startsWith(route.fullPath) }"
                    :href="route.path ? `${ dapp.fullUrl }/${ route.path }` : null"
                    @click="routeActivated(route)">
                    <i :class="route.icon" data-icon="v"></i>
                    <evan-tooltip :placement="'right'">
                      {{ route.title | translate }}
                    </evan-tooltip>
                  </a>
                </li>
              </ul>
            </div>
          </slot>
        </div>

        <div class="dapp-wrapper-main">
          <!-- use the breadcrumb slot for fixed breadcrumbs -->
          <div class="dapp-wrapper-content-header">
            <div class="dapp-wrapper-breadcrumbs">
              <!-- will be filled by using the breadcrumbs component and the attachToDAppWrapper
                param -->
            </div>
            <slot name="header"></slot>
          </div>
          <div class="dapp-wrapper-content-wrapper flex-row">
            <template v-if="!onboarding">
              <!-- close side panel on medium screens -->
              <div class="dapp-wrapper-sidebar-background"
                @click="showSideBar = false;">
              </div>

              <div class="dapp-wrapper-sidebar-2">
                <!-- will be filled by using the dapp-wrapper-sidebar-level-2 component -->
              </div>
            </template>

            <div class="dapp-wrapper-content">
              <evan-modal ref="instanceInteraction">
                <template v-slot:header>
                  <h5 class="modal-title">
                    {{ `_evan.dapp-wrapper.instance-${ instanceInteraction.type }.title` | translate }}
                  </h5>
                </template>
                <template v-slot:body>
                  <p class="text-left"
                    v-html="$t(`_evan.dapp-wrapper.instance-${ instanceInteraction.type }.desc`,
                      instanceInteraction.instance)">
                  </p>
                </template>
                <template v-slot:footer>
                  <button type="button" class="btn btn-rounded"
                    :class="{
                      'btn-danger': instanceInteraction.type === 'delete',
                      'btn-primary': instanceInteraction.type === 'accept',
                    }"
                    @click="
                      instanceInteraction.instance[instanceInteraction.type]();
                      $refs.instanceInteraction.hide();
                    ">
                    {{ `_evan.dapp-wrapper.instance-${ instanceInteraction.type }.ok` | translate }}
                  </button>
                </template>
              </evan-modal>
              <slot name="content"></slot>
            </div>
          </div>
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
  import Component from './dapp-wrapper.ts';
  export default Component;
</script>
