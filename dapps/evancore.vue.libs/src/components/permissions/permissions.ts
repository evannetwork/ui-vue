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

import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';

// evan.network imports
import EvanComponent from '../../component';

import { properties, type } from './dummydata.json';

@Component({ })
class Permissions extends mixins(EvanComponent) {
  permissions = { properties, type }; // TODO: replace by property

  dataset = {
    name: 'Profile Data',
    key: 'asdfghjkl',
    fields: [
      'keine', 'Ahnung'
    ]
  }
}

export default Permissions
