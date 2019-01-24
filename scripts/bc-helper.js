const { runtimeConfig, bcConfig } = require('./config/deployment');
const { Logger, } = require('@evan.network/dbcp');

const createBusinessCenter = async function(runtime, accountId, ensDomain, joinSchema = 0, oldBusinessCenterContractId, bcOwner) {
  const log = (new Logger()).logFunction;

  log('retrieving admin factory');
  var getOptions = () => ({from: accountId, gas: 4000000});
  const adminFactoryContractAddress = await runtime.nameResolver.getAddress(runtime.nameResolver.getDomainName(bcConfig.nameResolver.domains.adminFactory));

  const adminFactory = runtime.contractLoader.loadContract('BusinessCenterFactory', adminFactoryContractAddress);
  log('creating customer business center');

  console.log(bcConfig.nameResolver.labels.ensRoot);
  console.log(bcConfig.nameResolver.ensAddress);

  const address = await runtime.executor.executeContractTransaction(
    adminFactory,
    'createContract',
    {
      from: accountId,
      gas: 5000000,
      event: { target: 'BusinessCenterFactory', eventName: 'ContractCreated', },
      getEventResult: event => event.returnValues.newAddress,
    },
    runtime.nameResolver.namehash(bcConfig.nameResolver.labels.ensRoot),
    bcConfig.nameResolver.ensAddress
  );

  const businessCenter = runtime.contractLoader.loadContract('BusinessCenter', address);
  log('initializing business center');

  let storageAddress = '0x0000000000000000000000000000000000000000';
  if (oldBusinessCenterContractId) {
    const oldBusinessCenter = runtime.contractLoader.loadContract(
      'BusinessCenterContractus', oldBusinessCenterContractId);
    storageAddress = await runtime.executor.executeContractCall(
      oldBusinessCenter, 'getStorage');
    runtime.executor.executeContractTransaction(
      oldBusinessCenter, 'migrateTo', {from: accountId, gas: 4000000}, businessCenter.options.address);
  }
  
  await runtime.executor.executeContractTransaction(
    businessCenter,
    'init',
    { from: accountId, gas: 5000000, },
    storageAddress,
    joinSchema,
  );

  if (joinSchema !== 0) {
    await runtime.executor.executeContractTransaction(
      businessCenter,
      'invite',
      { from: accountId, gas: 5000000, },
      accountId,
    );
  } else {
    await runtime.executor.executeContractTransaction(
      businessCenter,
      'join',
      { from: accountId, gas: 5000000, },
    );
  }

  await runtime.nameResolver.setAddress(ensDomain, businessCenter.options.address, accountId);
  await createContractFactory(runtime, accountId, ensDomain, businessCenter, 'TestDataContractFactory', 'testdatacontract')
  await createContractFactory(runtime, accountId, ensDomain, businessCenter, 'ServiceContractFactory', 'servicecontract')

  if (bcOwner) {
    // if bc was created for another account, hand over roles and bc to this account
    log(`transferring bc ownership to ${bcOwner}`)
    const authority = await runtime.executor.executeContractCall(businessCenter, 'authority');
    const authContract = runtime.contractLoader.loadContract('DSRolesPerContract', authority);
    await Promise.all([
      // add to owner role
      runtime.rightsAndRoles.addAccountToRole(businessCenter, accountId, bcOwner, 0),
      // add to member role
      runtime.rightsAndRoles.addAccountToRole(businessCenter, accountId, bcOwner, 1),
    ])
    await Promise.all([
      // hand over auth
      runtime.executor.executeContractTransaction(
        authContract, 'setOwner', { from: accountId }, bcOwner),
      // hand over contract itself
      runtime.executor.executeContractTransaction(
        businessCenter, 'transferOwnership', { from: accountId }, bcOwner),
    ]);
  }

  return businessCenter;
}

const createContractFactory = async function(runtime, accountId, ensDomain, businessCenter, factoryContract, factoryName) {
  const log = (new Logger()).logFunction;
  let factory = await runtime.executor.createContract(factoryContract, [], {from: accountId, gas: 7000000});
  let factoryPath = `factory.${ ensDomain }`;
  let specifcFactoryPath = `${ factoryName }.${ factoryPath }`;

  log(`--> ${factoryContract}`, 'debug');
  if (businessCenter) {
    await runtime.executor.executeContractTransaction(businessCenter, 'registerFactory', {from: accountId, gas: 1000000}, factory.options.address);
  }
  await runtime.nameResolver.setAddress(factoryPath, '0x000000000000000000000000000000000f4c7041', accountId);    
  await runtime.nameResolver.setAddress(specifcFactoryPath, factory.options.address, accountId);
  log(`<-- ${factoryContract}`, 'debug');
  return factory;
}

module.exports = {
  createBusinessCenter,
};
