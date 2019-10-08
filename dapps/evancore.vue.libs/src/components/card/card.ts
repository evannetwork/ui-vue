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

// vue imports
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

// evan.network imports
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import EvanComponent from '../../component';

/**
 * Wrapper for profile verifications.
 */
@Component({ })
export default class CardComponent extends mixins(EvanComponent) {
  /**
   * Card type that should be used (transparent, outline, filled)
   */
  @Prop({
    default: 'filled'
  }) type: string;

  /**
   * Optional href, to transform the card into a link element.
   */
  @Prop() href: string;

  /**
   * Add hover shadow and size effect
   */
  @Prop() highlight: boolean;

  /**
   * Card icon
   */
  @Prop() icon: string;

  /**
   * Card title
   */
  @Prop() title: string;

  /**
   * Card title
   */
  @Prop() subTitle: string;


  /**
   * Card small text
   */
  @Prop() description: string;
}
