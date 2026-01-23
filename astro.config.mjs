// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import wikiLinkPlugin from "remark-wiki-link";

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [
      [
        wikiLinkPlugin,
        {
          aliasDivider: "|",
          pageResolver: (/** @type {string} */ name) => [
            name.replace(/ /g, "-").toLowerCase(),
          ],
          hrefTemplate: (/** @type {string} */ permalink) =>
            `/garden/${permalink}`.toLowerCase(),
        },
      ],
    ],
  },
  site: "https://beta.joshuarodrigues.dev",
  integrations: [mdx(), sitemap()],
});
