/*
  Copyright (c) 2018-present evan GmbH.
 
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
 
      http://www.apache.org/licenses/LICENSE-2.0
 
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

const externalAccounts = require('./externalAccounts');
const managedAccounts = require('./managedAccounts');


/*
 The configuration data needed to interact with evan.network during development,
 i.e. for creating and interacting with contracts, for uploading files to the dfs,
 to create profiles etc.
 
*/
const bcConfig = {
  nameResolver: {
    ensAddress: process.env.ENS_ADDRESS || '0x937bbC1d3874961CA38726E9cD07317ba81eD2e1',
    ensResolver: process.env.ENS_RESOLVER || '0xDC18774FA2E472D26aB91deCC4CDd20D9E82047e',
    labels: {
      businessCenterRoot: process.env.BC_ROOT || '' || 'testbc.evan',
      ensRoot: process.env.ENS_ROOT || 'evan',
      factory: 'factory',
      admin: 'admin',
      eventhub: 'eventhub',
      profile: 'profile',
      mailbox: 'mailbox'
    },
    domains: {
      root: ['ensRoot'],
      factory: ['factory', 'businessCenterRoot'],
      adminFactory: ['admin', 'factory', 'ensRoot'],
      businessCenter: ['businessCenterRoot'],
      eventhub: process.env.ENS_EVENTS || ['eventhub', 'ensRoot'],
      profile: process.env.ENS_PROFILES || ['profile', 'ensRoot'],
      profileFactory: ['profile', 'factory', 'ensRoot'],
      mailbox: process.env.ENS_MAILBOX || ['mailbox', 'ensRoot'],
      bcDomain: '',
      dappsDomain: '',
      joinSchema: '',
    },
  },
  alwaysAutoGasLimit: 1.1
}

const runtimeConfig = {
  // web3Provider: 'wss://testcore.evan.network/ws',                       // default value
  // ipfs: {host: 'ipfs.evan.network', port: '443', protocol: 'https'},    // default value
  minBalance: 1000000000000000000,
  bookmarkDefinitions: {
    // bookmarks as ENS domain and DBCP for bookmark
    // "sample.evan": {
    //   "name": "sample",
    //   "description": "evan.network sample bookmark",
    //   "i18n": {
    //     "description": {
    //       "en": "evan.network sample"
    //     },
    //     "name": {
    //       "en": "sample"
    //     }
    //   },
    //   // ...
    // }
  },
  bookmarks: {
    // accounts and their bookmarks as ENS domain names
    // 'race game grant legal illegal spring stable banana walk quiz vanish middle': ['sample.evan'],
  },
  businessCenters: {
    // 'sample.evan': {
    //   owner: '0x0000000000000000000000000000000000000001',
    //   members: [
    //     'race game grant legal illegal spring stable banana walk quiz vanish middle',
    //     'recycle web high fan relax ignore chalk require main about casual near',
    //   ],
    // },
  },
  contracts: {
    // // contract id or ens name
    // '0xc0274ac700000000000000000000000000000000': {
    //   // mnemonic or account id
    //   owner: 'race game grant legal illegal spring stable banana walk quiz vanish middle',
    //   members: [{
    //     // mnemonic or account id
    //     account: 'recycle web high fan relax ignore chalk require main about casual near',
    //     sharings: ['*']
    //   }],
    // }
  },
  registrar: {
    // // subdomains of this are claimable
    // domain: 'certificates.sartorius.evan',
    // // parent domain for registrar, has to be owned by 'domainParentOwner'
    // domainParent: 'sartorius.evan',
    // // owner of 'domainParent', registers and assigns 'domain' to new registrar
    // domainParentOwner: process.env.ENS_OWNER,
    // // Ethereum private key of 'domainParentOwner'
    // domainParentOwnerKey: process.env.ENS_OWNER_KEY,
  },
}

// circular dependency between this and evan.access.js
// this is just to pass along the flat options to init when evan.access is included,
// and still enable the prexisting scripts that include deployment.js to have the accounts filled in and cached

module.exports = {
  bcConfig,
  options: runtimeConfig
}

try {
  const evan = require('../evan.access.js')

  module.exports['runtimeConfig'] = evan.getAccountConfig(runtimeConfig, externalAccounts, managedAccounts)
} catch(e) {
  // silent
}


