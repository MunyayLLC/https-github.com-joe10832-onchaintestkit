# Vercel Web Analytics Integration Guide

This document explains how the OnChain Test Kit example frontend integrates with Vercel Web Analytics and provides instructions for deploying and using it in your own projects.

## Overview

Vercel Web Analytics is a privacy-first analytics service that provides insights into your application's performance and user interactions. This example demonstrates a complete integration with a Vite-based React application.

## Current Integration

### Setup in This Project

The Vercel Web Analytics integration is configured in the main application entry point:

**File: `src/main.tsx`**

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>,
)
```

The `<Analytics />` component is placed as a sibling to your main app component, ensuring it initializes after your application mounts.

### Package Installation

The `@vercel/analytics` package is included in the project dependencies:

```json
{
  "dependencies": {
    "@vercel/analytics": "^1.4.0"
  }
}
```

## Prerequisites for Deployment

Before deploying this application to Vercel with Web Analytics, you'll need:

1. **A Vercel account** - [Sign up for free](https://vercel.com/signup)
2. **A Vercel project** - [Create a new project](https://vercel.com/new)
3. **The Vercel CLI** (optional) - Install with:
   ```bash
   npm install -g vercel
   # or
   pnpm add -g vercel
   # or
   yarn global add vercel
   # or
   bun add -g vercel
   ```

## Deployment Instructions

### Step 1: Enable Web Analytics in Vercel

1. Go to your [Vercel dashboard](https://vercel.com/dashboard)
2. Select your project
3. Navigate to the **Analytics** tab
4. Click **Enable** to enable Web Analytics

> **Note:** Enabling Web Analytics will add new routes (scoped at `/_vercel/insights/*`) after your next deployment.

### Step 2: Deploy Your Application

#### Option A: Using Vercel CLI

```bash
vercel deploy
```

Follow the prompts to deploy your application. The first deployment will enable the analytics routes.

#### Option B: Git Integration

1. Connect your Git repository to Vercel:
   ```bash
   vercel link
   ```
2. Push your code to your repository:
   ```bash
   git push
   ```
3. Vercel will automatically deploy your changes

#### Option C: Manual Deployment

Deploy directly from the Vercel dashboard by connecting your GitHub, GitLab, or Bitbucket repository.

### Step 3: Verify Analytics is Working

After your app is deployed:

1. Visit your deployed application in a browser
2. Open the browser's Developer Tools (F12 or right-click → Inspect)
3. Go to the **Network** tab
4. Reload the page
5. Look for a request to `/_vercel/insights/view` - this confirms analytics is tracking

Expected response will be a successful `POST` request to that endpoint.

## Using Analytics in Your Application

### Automatic Tracking

The Analytics component automatically tracks:
- Page views and navigation
- Core Web Vitals (LCP, FID, CLS)
- Custom events (when configured)

### Custom Events (Requires Vercel Pro/Enterprise)

To track custom events like button clicks or form submissions, use the `track` function:

```tsx
import { track } from '@vercel/analytics'

export function MyComponent() {
  return (
    <button onClick={() => {
      track('button_click', {
        location: 'header',
        button_name: 'subscribe'
      })
    }}>
      Subscribe
    </button>
  )
}
```

### Accessing Analytics Data

Once your app has been deployed for a few days and has users:

1. Go to your [Vercel dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click the **Analytics** tab
4. Explore:
   - **Real-time visitors**
   - **Page views and routes**
   - **Core Web Vitals**
   - **Custom events** (if configured)
   - **Filtering and segmentation**

## Privacy and Compliance

Vercel Web Analytics is designed with privacy in mind:

- **No cookies** - Uses privacy-first tracking
- **GDPR compliant** - No explicit consent required for standard tracking
- **User-friendly** - Focuses on aggregated data, not individual tracking

Learn more about [privacy and compliance standards](https://vercel.com/docs/analytics/privacy-policy).

## Framework-Specific Implementation Examples

### React (Current Implementation)

```tsx
import { Analytics } from '@vercel/analytics/react'

export default function App() {
  return (
    <div>
      {/* ... */}
      <Analytics />
    </div>
  )
}
```

### Next.js (Pages Router)

```tsx
import { Analytics } from '@vercel/analytics/next'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}
```

### Next.js (App Router)

```tsx
import { Analytics } from '@vercel/analytics/next'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### SvelteKit

```ts
import { dev } from '$app/environment'
import { injectAnalytics } from '@vercel/analytics/sveltekit'

injectAnalytics({ mode: dev ? 'development' : 'production' })
```

### Astro

```astro
---
import Analytics from '@vercel/analytics/astro'
---

<html lang="en">
  <head>
    <Analytics />
  </head>
  <body>
    <slot />
  </body>
</html>
```

### Remix

```tsx
import { Analytics } from '@vercel/analytics/remix'

export default function App() {
  return (
    <html>
      <body>
        <Analytics />
        <Outlet />
      </body>
    </html>
  )
}
```

### Nuxt

```vue
<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt'
</script>

<template>
  <Analytics />
  <NuxtPage />
</template>
```

### Vue

```vue
<script setup lang="ts">
import { Analytics } from '@vercel/analytics/vue'
</script>

<template>
  <Analytics />
  <!-- your content -->
</template>
```

### Plain HTML

```html
<script>
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments) }
</script>
<script defer src="/_vercel/insights/script.js"></script>
```

### Other Frameworks

```ts
import { inject } from '@vercel/analytics'

inject()
```

## Troubleshooting

### Analytics Not Appearing in Dashboard

1. **Wait for data collection** - It may take a few hours for data to appear
2. **Verify deployment** - Ensure you've deployed after enabling Web Analytics
3. **Check network requests** - Verify `/_vercel/insights/view` requests are being made (see Step 3 above)
4. **Rebuild and redeploy** - The analytics routes need to be created during deployment

### High Bounce Rate or Missing Data

- Ensure the `<Analytics />` component is placed in a high-level component that renders on every page
- Verify there are no JavaScript errors preventing the analytics script from loading
- Check that you've allowed sufficient time for data collection

### Development vs Production

- Analytics tracking is disabled in development mode by default
- To test analytics locally before deployment, use `npm run build && npm run preview`

## Next Steps

1. **Deploy to Vercel** - Follow the deployment instructions above
2. **Monitor your analytics** - View data in the Vercel dashboard after a few hours
3. **Implement custom events** - Add tracking for important user interactions (Pro/Enterprise plans)
4. **Optimize performance** - Use Core Web Vitals data to improve your application

## Additional Resources

- [Vercel Web Analytics Documentation](https://vercel.com/docs/analytics)
- [@vercel/analytics Package](https://www.npmjs.com/package/@vercel/analytics)
- [Vercel Deployment Guide](https://vercel.com/docs/deployments/overview)
- [Core Web Vitals Guide](https://web.dev/vitals/)
- [OnChain Test Kit Repository](https://github.com/MunyayLLC/https-github.com-joe10832-onchaintestkit)

## Support

For issues or questions about:

- **Vercel Web Analytics** - See [Vercel Docs](https://vercel.com/docs/analytics)
- **This example** - Check the [OnChain Test Kit repository](https://github.com/MunyayLLC/https-github.com-joe10832-onchaintestkit)
- **React/Vite** - See [React](https://react.dev/) and [Vite](https://vitejs.dev/) documentation
