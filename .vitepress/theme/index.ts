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
