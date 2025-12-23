import { defineConfig } from "vitepress"

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "OnChainTestKit",
  description:
    "End-to-end testing toolkit for blockchain applications, powered by Playwright",

  head: [
    // Vercel Web Analytics will be injected via theme setup
  ],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/guide" },
      { text: "Examples", link: "/examples" },
      { text: "Best Practices", link: "/recommendations" },
    ],

    sidebar: [
      {
        text: "Getting Started",
        items: [
          { text: "Introduction", link: "/guide" },
          { text: "Installation", link: "/installation" },
          { text: "Examples", link: "/examples" },
        ],
      },
      {
        text: "Resources",
        items: [
          { text: "Best Practices", link: "/recommendations" },
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
