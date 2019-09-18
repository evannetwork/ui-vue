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

// vue imports
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

// evan.network imports
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { EvanFormControl } from '@evan.network/ui-vue-core';

import { getDomainName } from '../../utils';
import EvanComponent from '../../component';

/**
 * Wrapper for profile verifications.
 */
@Component({})
class ProfilePicture extends mixins(EvanComponent) {
  /**
   * Profile type that should be used (unknown, user, company, device)
   */
  @Prop({
    default: 'unknown'
  }) type: string;

  /**
   * Display size that should be used (small, medium, large)
   */
  @Prop({
    default: 'default'
  }) size: string;

  /**
   * Is Profile verified
   */
  @Prop({
    default: false,
  }) verified: boolean;

  /**
   * Is Profile verified
   */
  @Prop({
    required: true,
    default: {
      fileModel: null,
      error: false,
      setDirty: () => {}
    }
  }) fileForm: EvanFormControl; // TODO: check whether this is the correct interface

  /**
   * ui.libs evan dapp base url
   */
  uiBaseUrl = '';

  async created() {
    const domainName = getDomainName();
    const uiCoreDbcp = await dappBrowser.System.import(`ui.libs.${domainName}!ens`);
    this.uiBaseUrl = dappBrowser.dapp.getDAppBaseUrl(uiCoreDbcp,
      `${uiCoreDbcp.name}.${domainName}`);
  }
}

export default ProfilePicture
