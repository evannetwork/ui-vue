/*
  Copyright (c) 2018-present evan GmbH.
 
  Licensed under the Apache License, Version 2.0 (the 'License');
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
 
      http://www.apache.org/licenses/LICENSE-2.0
 
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an 'AS IS' BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

let bcc = null  // only initialize it if needed, since it takes a while
let busy = 0
const Transform = require('stream').Transform
const IpfsApi = require('ipfs-api')
const BCC = require('@evan.network/api-blockchain-core')
const { Ipfs, createDefaultRuntime, PropertyType, ModificationType } = BCC
const Web3 = require('web3')
const path = require('path')
const fs = require('fs')
const pfy = require('util').promisify

const  options = require('./config/deployment.js').options

const defaultWeb3 = 'wss://testcore.evan.network/ws'
const defaultDFS = {host: 'ipfs.evan.network', port: '443', protocol: 'https'}

let accessProfiles = {}
let createProfiles = {}
let createdProfiles = {} 

// the account sources to add
try{ accessProfiles = require('./config/externalAccounts.js') }
catch(e) { if (e.code !== "MODULE_NOT_FOUND") throw e }
try{ createProfiles = require('./config/managedProfiles.js') }
catch(e) { if (e.code !== "MODULE_NOT_FOUND") throw e }

// createdProfiles can change doring execution, and is written back then
try{ createdProfiles = require('./config/createdProfiles.json') }
catch(e) { if (e.code !== "MODULE_NOT_FOUND") throw e }

const sha3 = Web3.utils.soliditySha3
function sha9(a, b) { return sha3.apply(sha3, [sha3(a), sha3(b)].sort()) }

/*
function example_gulp_plugin() {
  const transformStream = new Transform({objectMode: true})
  
  transformStream._transform = async (file, encoding, callback) => {
  }
  return transformStream;
}
*/

function findAccount(key, runtimeConfig) {
  if(key.startsWith('0x')) return key
  if(runtimeConfig.accountMap[key]) return runtimeConfig.accountMap[key]
  return undefined
}

/*
  It is almost always a bad idea to have account data in repositories,
  especially public repositories.
  This is not just a security problem, it would also prevent developers to have own accounts configured.
  For this reason account data configuration is by default separated into own files in the config/ directory:
  
  externalAccounts.js  - precreated profiles that are used in development and deployment tasks
  managedAccounts.js   - profiles that are automatically created if they don't exist already
  createdProfiles.js   - the profiles that have already been created - generated when profiles are created

  From those files a config object that can actually be used by blockchain-core is created and returned.
  The returned config object can be further edited or used immediately with default values.
  The runtimeConfig expected by the blockchain creation tools can use mnemonics or accountIds as lookup keys
  maybe shortened IDs in the future, but not aliases

  evanCfg    - an optional and reduced blockchain-core to overwrite default config values
               actual account fields are filled in from account config files and accountCfg
  accountCfg - you can provide accessProfiles via argument that will be merged with what is read from the file
*/

function getAccountConfig(evanConfig = {}, accountConfig = {}, createConfig = {} ) {

  // default runtime config
  const config = {
    ensureProfiles: false,
    accounts: [], accountMap: {}, keyConfig: {},
    mnemonics: {} , aliases: {}, contactConfig: {},
    ipfs: defaultDFS,
    web3Provider: defaultWeb3,
    contractsLoadPath: [ 'build/contracts', 'contracts' ]
  }

  Object.assign(config, evanConfig)
  
  function mapAccount(a, c) {
    if(!c.id || !c.privateKey || !c.profileKey) return console.log('skipped loading account ', a)

    config.accounts.push(c.id)
    config.accountMap[c.id] = c.privateKey
    config.keyConfig[sha3(c.id)] = c.profileKey
    config.keyConfig[sha9(c.id, c.id)] = c.profileKey
  }

  Object.assign(accessProfiles, accountConfig)
  Object.assign(createProfiles, createConfig)

  
  for(const a in accessProfiles)
    mapAccount(a, accessProfiles[a])

  // first fetch the accounts to create from the original runtime config
  for(let mn in config.aliases) {
    const alias = config.aliases[mn]
    const cc = createdProfiles.accounts[alias]
    if(cc) {
      mapAccount(a,cc)
      console.log('Already created, loading ', alias)
    }
  }
 
  let create = {}
  for(const a in createProfiles) {
    const c = createProfiles[a]
    const cc = createdProfiles[a]

    if(cc) mapAccount(a,cc)
    else if(!c.mnemonic || !c.password || !c.alias) console.log('skipped creating account ', a)
    else {
      config.ensureProfiles = true
      // set up profile creation fields in config
      create[a] = c

      config.mnemonics[c.mnemonic] = c.password
      config.aliases[c.mnemonic] = c.alias
      if(c.contacts && c.contacts.length) {
        const key = c.id || c.mnemonic
        config.contactConfig[key] = []
        for(let contactName of c.contacts) {
          const contact = accessProfiles[contactName] || createProfiles[contactName]
          config.contactConfig[key].push(contact.id || contact.mnemonic)
        }
      }
    }
  }

  config.activeAccount = config.activeAccount || config.accounts[0]

  return config
}

// creating profiles, is done by profiles-helper
// in this file we only load profiles and parse/edit configs

async function cacheProfiles(config) {

  const createRTCache = {}
  for(let mn in config.mnemonic2account) {
    const a = config.mnemonic2account[mn]

    let addToCache = true

    for(let cp in createdProfiles) if(cp.id === a) { addToCache = false; break }

    if (addToCache) {
      
      console.log('caching ', config.aliases[mn],'/',a)
      createRTCache[config.aliases[mn]] = {
        id: a,
        alias: config.aliases[mn],
        mnemonic: mn,
        password: config.mnemonics[mn],
        privateKey: config.accountMap[a],
        profileKey: config.keyConfig[sha3(a)],
        contacts: [],
      }
    }
  }
  
  if(Object.keys(createRTCache).length) {
    Object.assign(createdProfiles, createRTCache)

    return pfy(fs.writeFile)( __dirname + '/config/createdProfiles.json', JSON.stringify(createdProfiles,null,2))
  }
}


// this just loads existing accounts, cached or preconfigured
// if you want to create profiles, don't use this, it never loads the profile-helpers

async function init(cfg = {}) {
  // if we really want to support mulitple different blockchain cores with different cfg at the same time,
  // we need a real stack to manage this
  ++busy
  if (bcc) return bcc
  cfg = Object.assign(options, cfg)
  cfg = getAccountConfig(cfg)
  
  // important!
  cfg.keyConfig[sha3('mailboxKeyExchange')] =
    '346c22768f84f3050f5c94cec98349b3c5cbfa0b7315304e13647a4918ffff22'     // accX <--> mailbox edge key

  const web3 = new Web3()
  web3.setProvider(new web3.providers.WebsocketProvider(cfg.web3Provider))
  const dfs = new Ipfs({
    dfsConfig:cfg.ipfs,
    web3: web3,
    accountId:
    cfg.accounts[0],
    privateKey:cfg.accountMap[cfg.accounts[0]]
  })

  return createDefaultRuntime(web3, dfs, cfg)
    .then(v => {
      v.accounts = cfg.accounts
      bcc = v;
      console.log('Connected to evan.network as ', v.accounts[0]);
      return v})
    .catch(e => { throw e })
}

function close() {
  if( --busy && !bcc) return
  bcc.web3.currentProvider.connection.close()
  bcc.dfs.stop().then(() => process.exit(0))
}

function upload(files) {
  const live = 'live/'
  files = Array.isArray(files) ? files : [files]
  return  async () => {
    const ei = init()
    // TODO: check file dates to only upload if new
    //const ifiles = await Promise.all(files.map( v => pfy(fs.stat)(v) ))
    //const lfiles = await Promise.all(files.map( v => pfy(fs.stat)(live+v) ))

    //const ffiles
    const pfiles = await Promise.all(files.map(f => pfy(fs.readFile)(f)))

    const args = []
    for(let i in files) 
      args.push({ path: files[i], content: pfiles[i] })

    await ei
    const hashes = await bcc.dfs.addMultiple(args)
    const map = {}
    for(let i in hashes) map[files[i]] = hashes[i]
    await Promise.all(hashes.map((v,i) => pfy(fs.appendFile)(live + files[i], Ipfs.bytes32ToIpfsHash(hashes[i])+'\n', 'utf-8')))
    close()

    return map
  }
}

function download() {

  return async () => {
    //const ei = await init()
    //const cfg = getAcccountConfig(options)
    
    //close()
  }
}

module.exports = { bcc, init, close, upload, download, getAccountConfig, cacheProfiles }
