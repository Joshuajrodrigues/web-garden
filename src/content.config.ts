// src/content/config.ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const garden = defineCollection({
  // REMOVE type: "content"
  loader: glob({ base: "./src/content/garden", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(), // Made optional for easier notes
      pubDate: z.coerce.date().optional(),
      updatedDate: z.coerce.date().optional(),
      heroImage: image().optional(),
      tags: z.array(z.string()).optional(),
    }),
});

export const collections = { garden };
