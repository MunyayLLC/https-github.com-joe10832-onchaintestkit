# Examples

## Basic Usage

Here are some examples of using OnChainTestKit in your tests.

### Creating a Test

```typescript
import { createOnchainTest } from '@coinbase/onchaintestkit';

// Create your test configuration
const test = createOnchainTest({
  wallet: 'metamask',
  network: 'sepolia'
});

test('should connect wallet', async ({ page, wallet }) => {
  await page.goto('http://localhost:3000');
  await wallet.connect();
});
```

## More Examples

Check the [example directory](https://github.com/MunyayLLC/https-github.com-joe10832-onchaintestkit/tree/main/example) in the repository for more usage examples.
