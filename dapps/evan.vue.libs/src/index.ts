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

// map the original vue path to vue.libs
import { System, getDomainName, utils, lightwallet } from '@evan.network/ui-dapp-browser';
System.map['@evan.network/vue-core'] = `evan.vue.libs.${ getDomainName() }!dapp-content`;

import Vue from 'vue';
import Vuex from 'vuex';

// import styles
import './style/index.scss';
import { translations, registerEvanI18N } from './i18n/translate';
import { registerComponents } from './registration';

let VueCoreEvan = (Vue) => {
  Vue.use(Vuex);

  // register evan vue stuff
  registerComponents(Vue);
}

export { VueCoreEvan, translations, registerEvanI18N };
