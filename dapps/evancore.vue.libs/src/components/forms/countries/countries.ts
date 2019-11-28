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
*/

import * as dappBrowser from '@evan.network/ui-dapp-browser';

// vue imports
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import EvanControlComponent from '../control/control';

interface OptionInterface {
  label: string;
  value: any;
}

let countries;

/**
 * Wrapper component for button elements.
 *
 * @class         SelectComponent
 * @selector      evan-form-control-select
 */
@Component({})
export default class CountriesComponent extends mixins(EvanControlComponent) {
  /**
   * Show loading until the countries were fetched.
   */
  loading = true;

  /**
   * Countries that are selectable by the v-select
   */
  countries: Array<OptionInterface> = null;

  /**
   * Load countries, sort and translate them.
   */
  async created() {
    // ensure loaded countries
    if (!countries) {
      const countriesDApp = await dappBrowser.System
        .import(`countries.libs.${ dappBrowser.getDomainName() }!dapp-content`);

      // ensure translations
      Object.keys(countriesDApp.translations).forEach(lang =>
        this.$i18n.add(lang, countriesDApp.translations[lang])
      );
      // set available countries
      countries = countriesDApp.countries;
    }

    // sort and translate countries
    this.countries = countries
      .map(isoCode => {
        return { value: isoCode, label: (this as any).$t(`_countries.${isoCode}`), };
      })
      .sort((a, b) => (a.label > b.label ? 1 : (b.label > a.label ? -1 : 0)));

    this.loading = false;
  }
}
