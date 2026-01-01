import { defineCollection, z } from "astro:content";

const essays = defineCollection({
  type: "content",
  schema: z.object({
    pubDatetime: z.date(),
    title: z.string(),
    draft: z.boolean().optional(),
    description: z.string(),
  }),
});

export const collections = { essays };
