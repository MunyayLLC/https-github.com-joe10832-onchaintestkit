import { defineConfig } from "vitepress"

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "OnChainTestKit",
  description:
    "End-to-end testing toolkit for blockchain applications, powered by Playwright",

  ignoreDeadLinks: true,

  head: [
    // Vercel Web Analytics will be injected via theme setup
  ],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/guide" },
      { text: "Examples", link: "/examples" },
      { text: "Vercel Web Analytics", link: "/vercel-web-analytics" },
    ],

    sidebar: [
      {
        text: "Getting Started",
        items: [
          { text: "Introduction", link: "/guide" },
          { text: "Installation", link: "/installation" },
          { text: "Vercel Web Analytics", link: "/vercel-web-analytics" },
        ],
      },
    ],

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/MunyayLLC/https-github.com-joe10832-onchaintestkit",
      },
    ],
  },
})
