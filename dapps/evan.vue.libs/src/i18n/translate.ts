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

import de from './de';
import en from './en';
import Vuex from 'vuex';
import vuexI18n from 'vuex-i18n';

// map all langugage
const translations = { de, en };

/**
 * Register the current translations within vueJS.
 *
 * @param      {any}     Vue     vue prototype
 * @param      {any}     store   the vuex store
 */
let registerEvanI18N = (Vue: any, store: any) => {
  // add all i18n definitions
  Object.keys(translations).forEach(key => Vue.i18n.add(key, translations[key]));
};

/**
 * Setup vuexi18n plugin and register all i18n.
 *
 * @param      {any}     Vue     vue prototype
 * @param      {any}     store   the vuex store
 */
const useI18N = (Vue: any, store: any) => {
  Vue.use(vuexI18n.plugin, store);

  // add all i18n definitions
  registerEvanI18N(Vue, store);

  // use defined or browser language
  Vue.i18n.set(window.localStorage['evan-language'] || navigator.language.split('-')[0]);
};

export { translations, registerEvanI18N, useI18N }
