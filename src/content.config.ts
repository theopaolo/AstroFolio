import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const card = {
  title: z.string(),
  url: z.url(),
  summary: z.string(),
  background: z.string(),
  foreground: z.string(),
};

const home = defineCollection({
  loader: glob({ pattern: 'home.md', base: './src/content' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    lead: z.string(),
    practice: z.object({ title: z.string(), lead: z.string() }),
    projects: z.object({ title: z.string() }),
    ongoing: z.object({
      title: z.string(),
      intro: z.string(),
      items: z.array(z.object({ ...card, image: image(), status: z.string() })),
    }),
    sidequests: z.object({
      title: z.string(),
      intro: z.string(),
      items: z.array(z.object({
        ...card,
        image: z.string(),
        label: z.string().optional(),
        embed: z.boolean().default(true),
      })),
    }),
    friends: z.object({
      title: z.string(),
      intro: z.string(),
      items: z.array(z.object({ name: z.string(), url: z.url() })),
    }),
  }),
});

export const collections = { home };
