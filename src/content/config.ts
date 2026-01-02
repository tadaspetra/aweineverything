import { defineCollection, z } from "astro:content";

const essays = defineCollection({
  type: "content",
  schema: z.object({
    pubDatetime: z.date(),
    title: z.string(),
    draft: z.boolean().optional(),
    description: z.string(),
    sources: z
      .array(
        z.object({
          title: z.string(),
          url: z.string().url(),
        })
      )
      .optional(),
  }),
});

export const collections = { essays };
