// src/content.config.ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const garden = defineCollection({
  loader: glob({ base: "./src/content/garden", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    tags: z.array(z.string()).optional(),
    title: z.string().min(1).max(100),
    description: z.string().min(1).max(200),
    hero: z.string().url().optional(),
    attrib: z.string().optional(),
  }),
});

export const collections = { garden };
