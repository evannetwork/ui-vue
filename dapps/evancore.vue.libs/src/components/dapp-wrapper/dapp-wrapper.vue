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
      'small-toolbar': smallToolbar,
    }">
    <evan-logout ref="evanLogout" :disableButton="true"></evan-logout>
    <nav class="navbar" v-if="enableNav">
      <a class="navbar-brand"
        id="dapp-home"
        :class="{ 'clickable': !onboarding }"
        :href="onboarding ? null : `${ dapp.fullUrl }`">
        <img class="brand-large" :src="$props.brandLarge">
        <img class="brand-small" :src="$props.brandSmall">
      </a>
      <div class="nav flex-nowrap" v-if="!login && !onboarding">
        <div>
          <button class="btn"
            id="toggle-sidebar"
            @click="toggleSmallToolbar()">
            <i class="mdi mdi-menu h2"></i>
          </button>
        </div>

        <div class="mr-md-3 d-flex">
          <div class="spinner-border spinner-border-sm bg-text-inverted mr-3"
            v-if="userInfo.loading">
          </div>
          <button class="btn position-relative gray-500 px-3"
            id="dropdown-mailbox"
            v-if="!userInfo.loading"
            @click="openMailDropdown()">
            <i class="mdi mdi-email-outline position-relative">
              <span class="notification-dot" v-if="userInfo.newMailCount > 0"></span>
            </i>
            <evan-dropdown ref="mailDropdown"
              :alignment="'right'"
              :width="'280px'">
              <template v-slot:content>
                <div class="p-3 d-flex align-items-center">
                  <h6 class="m-0 text-truncate font-weight-semibold">
                    <template v-if="userInfo.newMailCount !== 0">
                      {{ $t('_evan.dapp-wrapper.new-mails', userInfo) | translate }}
                    </template>
                    <template v-else>
                      {{ '_evan.dapp-wrapper.my-mailbox' | translate }}
                    </template>
                  </h6>
                  <span class="mx-auto"></span>
                  <div class="spinner-border spinner-border-sm"
                    v-if="userInfo.mailsLoading">
                  </div>
                </div>
                <a class="dropdown-item border-top border-sm py-2 px-3"
                  v-for="(mail, index) in userInfo.mails"
                  :id="`evan-dropdown-mailbox-${ index }`"
                  :href="`${ dapp.fullUrl }/mailbox.vue.${ domainName }/received/detail/${ mail.address }`"
                  @click="openMail(mail, $event)">
                  <div class="d-flex">
                    <div style="width: 50px; min-width: 50px;">
                      <evan-contact-batch
                        v-model="userInfo.addressBook.profile[mail.from] ? userInfo.addressBook.profile[mail.from].alias : mail.from">
                      </evan-contact-batch>
                    </div>
                    <div>
                      <p class="m-0 text-truncate"
                        :class="{ 'text-primary': userInfo.readMails.indexOf(mail.address) === -1 }">
                        {{ userInfo.addressBook.profile[mail.from] ? userInfo.addressBook.profile[mail.from].alias : mail.from }}
                      </p>
                      <small class="d-block mt-1 text-truncate">{{ mail.title }}</small>
                    </div>
                  </div>
                  <span class="d-block font-size-70 text-truncate mt-2">
                    {{ mail.sent | moment('from') }}
                  </span>
                </a>
                <a class="
                  dropdown-item text-center
                  border-top border-sm p-3
                  font-weight-bold"
                  id="dapp-mailbox"
                  :href="`${ dapp.fullUrl }/mailbox.vue.${ domainName }`"
                  @click="$refs.mailDropdown.hide($event)">
                  {{ '_evan.dapp-wrapper.all-messages' | translate }}
                </a>
              </template>
            </evan-dropdown>
          </button>

          <button class="btn position-relative gray-500 px-3"
            id="dropdown-queue"
            :class="{
              'running': queueCount !== 0,
              'error': queueErrorCount !== 0,
              'finished': queueErrorCount === 0 && queueCount === 0,
            }"
            @click="$refs.queueDropdown.show();"
            :disabled="queueLoading">
            <div class="spinner-border spinner-border-sm bg-text-inverted"
              v-if="queueLoading || queueCount">
            </div>
            <template v-else>
              <i class="mdi mdi-alert-outline text-warning position-relative"
                v-if="queueErrorCount">
              </i>
              <i class="mdi mdi-rotate-3d position-relative"
                v-else>
              </i>
            </template>
            <evan-dropdown ref="queueDropdown"
              :alignment="'right'"
              :width="'310px'">
              <template v-slot:content>
                <div class="p-3">
                  <h6 class="m-0 text-truncate">
                    {{ '_evan.dapp-wrapper.queue' | translate }}
                  </h6>
                </div>
                <span class="p-3 d-block border-top" 
                  v-if="queueCount === 0 && queueErrorCount === 0">
                  {{ '_evan.dapp-wrapper.empty-queue' | translate }}
                </span>
                <div class="border-top p-3"
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
                          <div class="progress-bar bg-secondary"
                            :class="{ 'progress-bar-animated progress-bar-striped': instance.running }"
                            :style="{ 'width': `${ (instance.stepIndex / instance.dispatcher.steps.length) * 100 }%` }">
                          </div>
                        </div>
                        <i class="mdi mdi-pause ml-3 text-muted clickable"
                          style="font-size: 1.5em"
                          v-if="instance.status === 'running' && instance.stepIndex < instance.dispatcher.steps.length - 1"
                          @click="instance.stop()">
                        </i>
                        <div class="spinner-grow spinner-grow-sm ml-3 text-muted"
                          v-if="instance.status === 'running' || instance.status === 'stopping'">
                        </div>
                        <template v-if="instance.status !== 'running' && instance.status !== 'stopping'">
                          <i class="mdi mdi-play ml-3 text-secondary clickable"
                            style="font-size: 1.5em"
                            @click="startDispatcherInstance(instance);">
                          </i>
                          <i class="mdi mdi-close-circle ml-3 text-danger clickable"
                            style="font-size: 1.5em"
                            @click="
                              instanceInteraction = { type: 'delete', instance: instance };
                              $refs.instanceInteraction.show();
                            ">
                          </i>
                        </template>
                      </div>
                    </div>
                    <span class="text-danger mt-3 text-wrap" v-if="instance.error">
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
          </button>

          <button class="btn position-relative gray-500"
            id="dropdown-profile"
            v-if="!userInfo.loading"
            @click="$refs.userDropdown.show()">
           <img class="rounded-circle"
              style="width: 36px; height: 36px;"
              v-if="userInfo.img"
              :src="userInfo.img">
            <i class="mdi mdi-account rounded-circle bg-secondary d-inline-block"
              style="width: 36px; height: 36px; line-height: 36px;"
              v-else>
            </i>
            <div class="d-none d-sm-inline-block ml-2">
              {{ userInfo.alias }}
              <i class="mdi mdi-chevron-down ml-2"></i>
            </div>
            <evan-dropdown ref="userDropdown"
              :alignment="'right'"
              :width="'300px'">
              <template v-slot:content>
                <div class="p-4 d-flex flex-row align-items-center">
                  <div class="flex-shrink-0">
                    <img class="mr-2 rounded"
                      style="width: 80px; height: 80px;"
                      v-if="userInfo.img"
                      :src="userInfo.img">
                    <i class="mdi mdi-account rounded mr-2 bg-secondary d-inline-block"
                      style="
                        width: 80px; height: 80px; line-height: 80px;
                        text-align: center; font-size: 40px;"
                      v-else>
                    </i>
                  </div>
                  <div class="pl-1">
                    <p class="text-muted text-truncate mb-2">{{ userInfo.address }}</p>
                    <a class="btn btn-rounded btn-primary bg-primary px-3 py-2 small"
                      id="dapp-profile"
                      :href="`${ dapp.fullUrl }/profile.vue.${ domainName }`"
                      @click="$refs.userDropdown.hide($event)">
                      <small>{{ '_evan.view-profile' | translate }}</small>
                    </a>
                  </div>
                </div>
                <div class="border-top border-sm py-2">
                  <template
                    v-for="(coreRoute, index) in coreRoutes">
                    <div class="border-top border-sm pb-2 mt-2"
                      v-if="coreRoute.seperator">
                    </div>
                    <a class="dropdown-item py-2"
                      v-if="!coreRoute.seperator"
                      :id="`evan-dapp-${ coreRoute.path.split('.')[0] }`"
                      :href="`${ dapp.fullUrl }/${ coreRoute.path }`"
                      @click="$refs.userDropdown.hide($event)">
                      {{ `_evan._routes.${ coreRoute.title }` | translate }}
                    </a>
                  </template>
                </div>
                <div class="border-top border-sm py-2">
                  <a class="dropdown-item py-2"
                    if="evan-logout"
                    @click="$refs.evanLogout.logout()">
                    {{ '_evan.logout' | translate }}
                  </a>
                </div>
              </template>
            </evan-dropdown>
          </button>
        </div>
      </div>
    </nav>

    <div class="dapp-wrapper-body"
      v-if="!loading">
      <template v-if="!login">
        <div class="dapp-wrapper-sidebar" v-if="!onboarding && enableSidebar">
          <div class="sidebar-header"
            :class="{
              'border-bottom border-sm bg-level-3': showSideBar && showSideBar2
            }">
            <div class="clickable">
              <h5
                class="m-0"
                v-if="showSideBar && showSideBar2"
                @click="visibleSideBar2 = !visibleSideBar2;">
                <i class="mdi mdi-chevron-left mr-2" v-if="visibleSideBar2"></i>
                <i class="mdi mdi-chevron-right mr-2" v-if="!visibleSideBar2"></i>
                {{ activeRouteTitle | translate }}
              </h5>
            </div>
            <h3 class="m-0" @click="showSideBar = false;">
              <i class="mdi mdi-close close"></i>
            </h3>
          </div>
          <slot name="sidebar">
            <div class="d-flex flex-column h-100">
              <ul class="nav font-medium in w-100" id="main-menu">
                <li v-for="(route, index) in routes">
                  <a
                    :id="`evan-dapp-${ route.path.split('.')[0] }`"
                    :class="{ active: $route.path.startsWith(route.fullPath) }"
                    :href="`${ dapp.fullUrl }/${ route.path }`"
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
                    :id="`evan-dapp-${ route.path.split('.')[0] }`"
                    :class="{ active: $route.path.startsWith(route.fullPath) }"
                    :href="`${ dapp.fullUrl }/${ route.path }`"
                    @click="routeActivated(route)">
                    <i :class="route.icon" data-icon="v"></i>
                    <span class="hide-menu">{{ route.title | translate }}</span>
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
  import DAppWrapper from './dapp-wrapper.ts';
  export default DAppWrapper;
</script>
