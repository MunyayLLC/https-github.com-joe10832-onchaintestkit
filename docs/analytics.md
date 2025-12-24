# Vercel Web Analytics

This guide will help you get started with using Vercel Web Analytics on your OnChainTestKit project. Learn how to enable analytics, integrate the package, deploy your app to Vercel, and view your data in the dashboard.

## Prerequisites

Before getting started with Vercel Web Analytics, you'll need:

- A Vercel account. If you don't have one, you can [sign up for free](https://vercel.com/signup).
- A Vercel project. If you don't have one, you can [create a new project](https://vercel.com/new).
- The Vercel CLI installed. You can install it using the following command:

```bash
npm install -g vercel
# or
pnpm add -g vercel
# or
yarn global add vercel
# or
bun add -g vercel
```

## Enable Web Analytics in Vercel

To enable Web Analytics for your project:

1. Go to the [Vercel dashboard](https://vercel.com/dashboard)
2. Select your Project
3. Click the **Analytics** tab
4. Click **Enable** from the dialog

> **💡 Note:** Enabling Web Analytics will add new routes (scoped at `/_vercel/insights/*`) after your next deployment.

## Add `@vercel/analytics` to your project

The `@vercel/analytics` package is already included as a dev dependency in this project. If you need to add it to another project, use your package manager:

```bash
npm install @vercel/analytics
# or
pnpm add @vercel/analytics
# or
yarn add @vercel/analytics
# or
bun add @vercel/analytics
```

## Integration Setup

### For VitePress (This Project)

This project uses VitePress for documentation and has Vercel Web Analytics pre-configured. The analytics are injected via the theme setup:

**File: `.vitepress/theme/index.ts`**

```typescript
import { inject } from "@vercel/analytics"
import DefaultTheme from "vitepress/theme"
import type { Theme } from "vitepress"

// Inject Vercel Web Analytics
// Note: inject() runs on the client side and does not include route support
if (typeof window !== "undefined") {
  inject()
}

export default {
  extends: DefaultTheme,
  enhanceApp() {
    // App-level enhancements can go here
  },
} satisfies Theme
```

### For Other Frameworks

If you're using a different framework, follow the instructions below:

#### Next.js (Pages Router)

Add the following code to your main app file:

```tsx
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/next";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}

export default MyApp;
```

#### Next.js (App Router)

Add the following code to the root layout:

```tsx
import { Analytics } from "@vercel/analytics/next";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Next.js</title>
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

#### React (Create React App)

Add the following code to your main app file:

```tsx
import { Analytics } from "@vercel/analytics/react";

export default function App() {
  return (
    <div>
      {/* ... */}
      <Analytics />
    </div>
  );
}
```

> **💡 Note:** When using the plain React implementation, there is no route support.

#### Vue

Add the following code to your main component:

```vue
<script setup lang="ts">
import { Analytics } from '@vercel/analytics/vue';
</script>

<template>
  <Analytics />
  <!-- your content -->
</template>
```

> **💡 Note:** Route support is automatically enabled if you're using `vue-router`.

#### Svelte/SvelteKit

Add the following code to the main layout:

```typescript
import { dev } from "$app/environment";
import { injectAnalytics } from "@vercel/analytics/sveltekit";

injectAnalytics({ mode: dev ? "development" : "production" });
```

#### Nuxt

Add the following code to your main component:

```vue
<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt';
</script>

<template>
  <Analytics />
  <NuxtPage />
</template>
```

#### Remix

Add the following code to your root file:

```tsx
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

#### Astro

Add the following code to your base layout:

```astro
---
import Analytics from '@vercel/analytics/astro';
---

<html lang="en">
	<head>
		<meta charset="utf-8" />
		<!-- ... -->
		<Analytics />
	</head>
	<body>
		<slot />
	</body>
</html>
```

> **💡 Note:** The `Analytics` component is available in version `@vercel/analytics@1.4.0` and later.
> If you are using an earlier version, you must configure the `webAnalytics` property of the Vercel adapter in your `astro.config.mjs` file as shown below.

```javascript
import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/serverless";

export default defineConfig({
  output: "server",
  adapter: vercel({
    webAnalytics: {
      enabled: true, // set to false when using @vercel/analytics@1.4.0
    },
  }),
});
```

#### Plain HTML

For plain HTML sites, add the following script to your `.html` files:

```html
<script>
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
</script>
<script defer src="/_vercel/insights/script.js"></script>
```

> **💡 Note:** When using the HTML implementation, there is no need to install the `@vercel/analytics` package. However, there is no route support.

#### Other Frameworks

Import the `inject` function from the package, which will add the tracking script to your app. **This should only be called once in your app, and must run in the client**.

> **💡 Note:** There is no route support with the `inject` function.

```typescript
import { inject } from "@vercel/analytics";

inject();
```

## Deploy Your App to Vercel

Deploy your app using the following command:

```bash
vercel deploy
```

We also recommend [connecting your project's Git repository](https://vercel.com/docs/git), which will enable Vercel to deploy your latest commits automatically without terminal commands.

Once your app is deployed, it will start tracking visitors and page views.

> **💡 Note:** If everything is set up properly, you should be able to see a Fetch/XHR request in your browser's Network tab from `/_vercel/insights/view` when you visit any page.

## View Your Data in the Dashboard

Once your app is deployed and users have visited your site, you can view your data in the dashboard:

1. Go to your [dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click the **Analytics** tab

After a few days of visitors, you'll be able to start exploring your data by viewing and filtering the panels.

Users on Pro and Enterprise plans can also add custom events to their data to track user interactions such as button clicks, form submissions, or purchases.

Learn more about how Vercel supports [privacy and data compliance standards](https://vercel.com/docs/analytics/privacy-policy) with Vercel Web Analytics.

## Next Steps

Now that you have Vercel Web Analytics set up, you can explore the following topics to learn more:

- [Learn more about the `@vercel/analytics` package](https://www.npmjs.com/package/@vercel/analytics)
- [Learn about privacy and compliance with Vercel](https://vercel.com/docs/analytics/privacy-policy)
- [Explore pricing and limits](https://vercel.com/docs/analytics/limits-and-pricing)
- [Troubleshooting guide](https://vercel.com/docs/analytics/troubleshooting)

## Additional Resources

For more information about Vercel Web Analytics, visit:

- [Official Vercel Analytics Documentation](https://vercel.com/docs/analytics)
- [@vercel/analytics on npm](https://www.npmjs.com/package/@vercel/analytics)
- [GitHub Repository](https://github.com/vercel/analytics)
