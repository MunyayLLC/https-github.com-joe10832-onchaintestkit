import { configure, createOnchainTest, BaseActionType } from '../dist/index.js';

// Example configuration
const testConfig = configure()
  .withMetaMask()
  .withSeedPhrase({
    seedPhrase: 'test test test test test test test test test test test junk',
    password: 'testpassword'
  })
  .withNetwork({
    name: 'Local Test Network',
    rpcUrl: 'http://localhost:8545',
    chainId: 1337,
    symbol: 'ETH'
  })
  .build();

console.log('Configuration created successfully!');
console.log('Config:', JSON.stringify(testConfig, null, 2));

// Test creating onchain test
try {
  const test = createOnchainTest(testConfig);
  console.log('Onchain test created successfully!');
} catch (error) {
  console.error('Error creating onchain test:', error);
}