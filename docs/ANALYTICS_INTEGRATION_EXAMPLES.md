# Vercel Web Analytics Integration Examples

This document provides practical examples of how to integrate Vercel Web Analytics into applications built with the OnChain Test Kit.

## Example 1: React Testing Application with Analytics

For a React application that uses the OnChain Test Kit for E2E testing:

```tsx
// src/App.tsx
import { Analytics } from "@vercel/analytics/react";
import { createOnchainTest } from "@coinbase/onchaintestkit";
import { CoinbaseWallet } from "@coinbase/onchaintestkit";

export default function App() {
  return (
    <div>
      <h1>Blockchain Testing Application</h1>
      {/* Your application components */}
      <Analytics />
    </div>
  );
}
```

## Example 2: Next.js Application with Analytics and Wallet Testing

For a Next.js application using the App Router with wallet testing:

```tsx
// app/layout.tsx
import { Analytics } from "@vercel/analytics/next";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Web3 Testing Dashboard</title>
        <meta name="description" content="OnChain Test Kit Dashboard" />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

```tsx
// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Welcome to OnChain Test Kit</h1>
      <p>End-to-end testing for blockchain applications</p>
      <Link href="/test-cases">View Test Cases</Link>
    </main>
  );
}
```

## Example 3: Testing Dashboard with Analytics

A practical example of a test dashboard that tracks user interactions:

```tsx
// src/components/TestDashboard.tsx
import { Analytics } from "@vercel/analytics/react";
import { createOnchainTest, configure } from "@coinbase/onchaintestkit";
import { useState } from "react";

export default function TestDashboard() {
  const [testResults, setTestResults] = useState([]);

  const runTest = async () => {
    // Track custom event
    if (window.va) {
      window.va('event', { name: 'test_run_started' });
    }

    try {
      const testConfig = await configure({
        // Your test configuration
      });
      
      const test = await createOnchainTest(testConfig);
      // Run your tests
      
      if (window.va) {
        window.va('event', { name: 'test_run_completed' });
      }
    } catch (error) {
      if (window.va) {
        window.va('event', { name: 'test_run_failed', error: String(error) });
      }
    }
  };

  return (
    <div>
      <h2>Test Dashboard</h2>
      <button onClick={runTest}>Run Tests</button>
      <div>
        {testResults.map((result, idx) => (
          <div key={idx}>{result}</div>
        ))}
      </div>
      <Analytics />
    </div>
  );
}
```

## Example 4: Remix Application with Wallet Support

For a Remix application with real-time wallet testing:

```tsx
// app/root.tsx
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { Analytics } from "@vercel/analytics/remix";

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Analytics />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
```

```tsx
// app/routes/wallets._index.tsx
import { MetaMask } from "@coinbase/onchaintestkit";
import { Link } from "@remix-run/react";

export default function WalletsPage() {
  return (
    <div>
      <h1>Wallet Testing Tools</h1>
      <ul>
        <li><Link to="/wallets/metamask">MetaMask Testing</Link></li>
        <li><Link to="/wallets/coinbase">Coinbase Wallet Testing</Link></li>
        <li><Link to="/wallets/phantom">Phantom Wallet Testing</Link></li>
      </ul>
    </div>
  );
}
```

## Example 5: Sending Custom Events

You can track specific testing events using the `va()` function:

```typescript
// Track wallet connection
window.va?.('event', {
  name: 'wallet_connected',
  wallet_type: 'metamask',
});

// Track test completion
window.va?.('event', {
  name: 'test_completed',
  duration_ms: 1234,
  status: 'passed',
});

// Track error events
window.va?.('event', {
  name: 'test_error',
  error_type: 'connection_failed',
  error_message: error.message,
});
```

## TypeScript Types for Custom Events

Create a type-safe wrapper for analytics events:

```typescript
// src/utils/analytics.ts
export type AnalyticsEvent =
  | { name: 'wallet_connected'; wallet_type: string }
  | { name: 'test_started'; test_id: string }
  | { name: 'test_completed'; duration_ms: number; status: 'passed' | 'failed' }
  | { name: 'transaction_sent'; chain_id: number }
  | { name: 'error_occurred'; error_type: string };

export function trackEvent(event: AnalyticsEvent) {
  if (typeof window !== 'undefined' && window.va) {
    window.va('event', event);
  }
}
```

## Monitoring Analytics in Development

During development, you can see analytics events in your browser's console:

1. Open your browser's Developer Tools (F12)
2. Go to the Network tab
3. Look for requests to `/_vercel/insights/view` or `/_vercel/insights/script.js`
4. These requests confirm that analytics is working properly

## Troubleshooting

### Analytics not tracking

- Ensure the `Analytics` component is placed at the root level of your application
- Verify that your app is deployed to Vercel (analytics won't work on localhost)
- Check the browser's Network tab for requests to `/_vercel/insights/*`
- Make sure Web Analytics is enabled in the Vercel dashboard

### Missing route information

- Ensure you're using a framework with built-in route support (Next.js, Remix, Nuxt, etc.)
- For other frameworks, use the `inject()` function instead
- Note that the `inject()` function does not have automatic route detection

## Best Practices

1. **Minimize tracking overhead**: Only track important events
2. **Use meaningful event names**: Use clear, descriptive names for custom events
3. **Avoid sensitive data**: Don't track personal information or secrets
4. **Test in production**: Analytics only work on deployed Vercel projects
5. **Monitor performance**: Excessive analytics calls can impact performance
6. **Document custom events**: Keep a record of all custom events you're tracking
