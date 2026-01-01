// @ts-check
import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import astroExpressiveCode from "astro-expressive-code";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";

// https://astro.build/config
export default defineConfig({
  site: "https://aweineverything.com",
  integrations: [
    astroExpressiveCode({
      themes: ["catppuccin-mocha", "catppuccin-latte"],
      plugins: [pluginLineNumbers()],
      defaultProps: {
        showLineNumbers: true,
      },
      styleOverrides: {
        codeBackground: "transparent",
        borderWidth: "0px",
        borderColor: "transparent",
        frames: {
          shadowColor: "transparent",
          editorActiveTabBackground: "transparent",
          editorActiveTabForeground: "#737373",
          editorTabBarBackground: "transparent",
        },
        lineNumbers: {
          foreground: "#737373",
        },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      external: ["@resvg/resvg-js"],
    },
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
    maxDuration: 60,
  }),
});
