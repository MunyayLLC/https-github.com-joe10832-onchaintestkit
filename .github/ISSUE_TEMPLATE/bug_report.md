---
name: Bug Report
about: Create a report to help us improve
title: '[BUG] '
labels: 'bug'
assignees: ''
---

## Bug Description
A clear and concise description of what the bug is.

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
A clear and concise description of what you expected to happen.

## Actual Behavior
A clear and concise description of what actually happened.

## Environment Information
- **Onchain Test Kit Version**: [e.g., 1.2.0]
- **Node.js Version**: [e.g., 18.17.0]
- **Operating System**: [e.g., macOS 13.4, Windows 11, Ubuntu 20.04]
- **Browser**: [e.g., Chrome 115, Firefox 116]
- **Wallet**: [e.g., MetaMask, Coinbase Wallet, Phantom]

## Configuration Used
```typescript
// Paste your configuration code here
const config = configure()
  .withMetaMask()
  // ... other configuration
  .build();
```

## Error Logs
```
Paste any error messages, stack traces, or relevant logs here
```

## Code Sample
```typescript
// Minimal code example that reproduces the issue
import { createOnchainTest, configure } from '@coinbase/onchaintestkit';

const test = createOnchainTest(/* your config */);

test('failing test', async ({ page, metamask }) => {
  // Steps that cause the bug
});
```

## Screenshots
If applicable, add screenshots to help explain your problem.

## Additional Context
Add any other context about the problem here.

## Possible Solution
If you have suggestions on how to fix the bug, please describe them here.

## Checklist
- [ ] I have searched for existing issues that describe this bug
- [ ] I have included all the required environment information
- [ ] I have provided a minimal code example that reproduces the issue
- [ ] I have included relevant error messages and logs