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

import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { bccUtils, } from '@evan.network/ui';

// vue imports
import Component, { mixins } from 'vue-class-component';
import EvanComponent from '../../../component';
import { Prop, } from 'vue-property-decorator';

/**
 * Shows a animated "check" icon.
 *
 * @class         SuccessComponent
 * @selector      evan-success
 */
@Component({ })
export default class ProfilePreviewComponent extends mixins(EvanComponent) {
  /**
   * Address of the specific account.
   */
  @Prop() address: string;

  /**
   * Directly pass already loaded account details to the component
   */
  @Prop() accountDetails: any;

  /**
   * Directly pass already loaded account details to the component
   */
  @Prop() registration: any;

  /**
   * Applies a specific link to the wallet display
   */
  @Prop() href: any;

  /**
   * Show loading symbol
   */
  loading = true;

  /**
   * Alias of the users address
   */
  alias: string = null;

  /**
   * Currents users eve balances and the timestamp, when the balance was loaded
   */
  balance: { amount: string, timestamp: number } = null;

  /**
   * Original url of the current vue core, so we can access assets via url.
   */
  vueCoreBaseUrl = '';

  /**
   * Link to the openend profile wallet for the passed address
   */
  walletLink = '';

  /**
   * Load user specific information
   */
  async created() {
    const dapp = this.$store.state.dapp;
    this.walletLink = [
      dapp.baseUrl,
      dapp.rootEns,
      `profile.vue.${ dapp.domainName }`,
      `${ this.address }/wallet`,
    ].join('/');

    await Promise.all([
      (async () => {
        const profile = new bcc.Profile({
          profileOwner: this.address,
          accountId: this.$store.state.runtime.activeAccount,
          ...this.$store.state.runtime,
        });
        this.alias = await bccUtils.getUserAlias(profile, this.accountDetails, this.registration);
      })(),
      (async () => {
        // load balance and parse it to 3 decimal places
        const amount = Math.floor(parseFloat(
          await dappBrowser.core.getBalance(this.address)) * 100) / 100;
        this.balance = {
          amount: amount.toFixed(2).toLocaleString(this.$i18n.locale()),
          timestamp: Date.now(),
        };
      })(),
      (async () => {
        // load the vue evan core to get its origin and access the images
        const vueCoreDbcp = await dappBrowser.System
          .import(`evancore.vue.libs.${ dappBrowser.getDomainName() }!ens`);
        this.vueCoreBaseUrl = dappBrowser.dapp.getDAppBaseUrl(vueCoreDbcp,
          `${ vueCoreDbcp.name }.${ dappBrowser.getDomainName() }`);
      })(),
    ]);

    this.loading = false;
  }

  /**
   * Open the qr code modal.
   *
   * @param      {Event}  $event  click event
   */
  showQRCode($event) {
    (this.$refs.qrCodeModal as any).show();
    $event.stopPropagation();

    return false;
  }
}
