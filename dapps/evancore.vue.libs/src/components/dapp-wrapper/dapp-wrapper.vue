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
            <ul class="nav">
              <li v-for="(route, index) in routes">
                <a
                  :id="`evan-dapp-${ (route.path || route.id).split('.')[0] }`"
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
            <span class="my-md-auto"></span>
            <ul class="nav mb-2"
              v-if="bottomRoutes">
              <li
                v-for="(route, index) in bottomRoutes"
                :style="{ order: index * 10 }">
                <a
                  :id="`evan-dapp-${ (route.path || route.id).split('.')[0] }`"
                  :class="{ active: route.path && $route.path.startsWith(route.fullPath) }"
                  :href="route.path ? `${ dapp.fullUrl }/${ route.path }` : null"
                  @click="routeActivated(route)">
                  <i class="position-relative" :class="route.icon">
                    <span class="notification-dot"
                      v-if="route.path.startsWith('mailbox.vue') && userInfo.newMailCount !== 0">
                    </span>
                  </i>
                  <evan-tooltip :placement="'right'">
                    {{ route.title | translate }}
                  </evan-tooltip>
                </a>
              </li>

              <li style="order: 5">
                <a
                  :id="`evan-dapp-synchronisation`"
                  :class="{ active: $refs.queueDropdown && $refs.queueDropdown.isShown }"
                  @click="$refs.queueDropdown.show()">
                  <div class="spinner-border spinner-border-sm"
                    v-if="queueLoading || queueCount">
                  </div>
                  <template v-else>
                    <i class="mdi mdi-alert text-secondary"
                      v-if="queueErrorCount">
                    </i>
                    <i class="mdi mdi-sync"
                      v-else>
                    </i>
                  </template>
                  <evan-tooltip :placement="'right'">
                    {{ '_evan._routes.synchronisation' | translate }}
                  </evan-tooltip>
                </a>
                <evan-dropdown ref="queueDropdown"
                  class="queue-dropdown">
                  <template v-slot:content>
                    <div class="p-3 d-flex align-items-center">
                      <h6 class="m-0 text-truncate">
                        {{ '_evan.dapp-wrapper.queue' | translate }}
                      </h6>
                      <span class="mx-auto"></span>
                      <div>
                        <button class="btn p-0">
                          <i class="mdi mdi-close"
                            @click="$refs.queueDropdown.hide()">
                          </i>
                        </button>
                      </div>
                    </div>
                    <span class="p-3 d-block" 
                      v-if="queueCount === 0 && queueErrorCount === 0">
                      {{ '_evan.dapp-wrapper.empty-queue' | translate }}
                    </span>
                    <div class="p-3"
                      v-for="(instance, index) in queueInstances"
                      :id="`evan-dropdown-queue-${ index }`"
                      @click="">
                      <template v-if="instance.dispatcher">
                        <div class="d-flex">
                          <strong class="d-block mb-2">
                            {{ instance.dispatcher.title | translate }}
                          </strong>
                          <span class="mx-auto"></span>
                          <span>
                            {{ `${ (instance.stepIndex / instance.dispatcher.steps.length) * 100 }%` }}
                          </span>
                        </div>

                        <div class="d-flex align-items-end">
                          <div class="w-100 d-flex align-items-center" v-if="instance.dispatcher">
                            <div class="progress w-100" style="height: 1.3em">
                              <div class="progress-bar bg-primary"
                                :class="{ 'progress-bar-animated progress-bar-striped': instance.running }"
                                :style="{ 'width': `${ (instance.stepIndex / instance.dispatcher.steps.length) * 100 }%` }">
                              </div>
                            </div>
                            <i class="mdi mdi-pause ml-3 text-muted clickable"
                              style="font-size: 1.5em"
                              v-if="instance.status === 'running' && instance.stepIndex < instance.dispatcher.steps.length - 1"
                              @click="instance.stop()">
                            </i>
                            <div class="spinner-grow spinner-grow-sm ml-3"
                              v-if="instance.status === 'running' || instance.status === 'stopping'">
                            </div>
                            <template v-if="instance.status !== 'running' && instance.status !== 'stopping'">
                              <i class="mdi mdi-play ml-3 text-primary clickable"
                                style="font-size: 1.5em"
                                @click="startDispatcherInstance(instance);">
                              </i>
                              <i class="mdi mdi-close-circle ml-3 text-light clickable"
                                style="font-size: 1.5em"
                                @click="
                                  instanceInteraction = { type: 'delete', instance: instance };
                                  $refs.instanceInteraction.show();
                                ">
                              </i>
                            </template>
                          </div>
                        </div>
                        <span class="text-secondary mt-3 text-wrap" v-if="instance.error">
                          {{ '_evan.dapp-wrapper.queue-error' | translate }}
                        </span>
                      </template>
                      <div v-else>
                        <strong class="m-0 font-weight-bold mb-2">
                          {{ '_evan.dispatcher-not-found' | translate }}
                        </strong>
                      </div>
                    </div>
                  </template>
                </evan-dropdown>
              </li>
            </ul>
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
