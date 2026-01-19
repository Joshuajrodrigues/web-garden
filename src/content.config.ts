// src/content.config.ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const garden = defineCollection({
  loader: glob({ base: "./src/content/garden", pattern: "**/*.{md,mdx}" }),
 
  schema: z.object({
    title: z.string(),
    url: z.string().optional(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(), 
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { garden };
