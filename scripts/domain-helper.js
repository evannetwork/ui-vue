const { createDefaultRuntime, Ipfs } = require('@evan.network/api-blockchain-core');
const IpfsApi = require('ipfs-api');
const Web3 = require('web3');

const { accountAndKey, buildKeyConfig } = require('./profiles-helper');
const { runtimeConfig } = require('./config/deployment');


const claimDomain = async (domain, mnemonic) => {
  const runtime = await getRuntime(mnemonic);
  await runtime.nameResolver.claimAddress(domain, runtime.activeAccount);
};

const getRuntime = async (mnemonic) => {
  // setup dependencies
  const web3 = new Web3();
  web3.setProvider(new web3.providers.WebsocketProvider(runtimeConfig.web3Provider));


  // insert mnemonic if unknown
  if (!runtimeConfig.mnemonics[mnemonic]) {
    runtimeConfig.mnemonics[mnemonic] = 'no data interaction, therefore no password';
  }

  // build key config
  await buildKeyConfig(web3, runtimeConfig);
  // keep only relevant accountId
  const { accountId } = accountAndKey(mnemonic, runtimeConfig);
  runtimeConfig.accountMap = { [accountId]: runtimeConfig.accountMap[accountId] };

  const dfs = new Ipfs({
    dfsConfig:runtimeConfig.ipfs,
    web3: web3,
    accountId: accountId,
    privateKey: runtimeConfig.accountMap[accountId]
  })

  return createDefaultRuntime(web3, dfs, runtimeConfig) 
};

module.exports = {
  claimDomain,
  getRuntime
};
