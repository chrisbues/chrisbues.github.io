import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

/* ------------------------------------------------------------------
   ONE collection. Not "blog" and "docs".

   The old Hugo site split content into /blog (dated) and /docs
   (undated tree) — a split imposed by the theme, not by the writing.
   The same Purview walkthrough landed in either bin depending on mood,
   and docs pages ended up with no date at all.

   Here a note is a note. Two axes replace the folders:
     topics    — what it's about (how people browse)
     maturity  — how finished it is (what the blog/docs split was
                 really gesturing at)
------------------------------------------------------------------ */

const notes = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/notes" }),
  schema: z.object({
    title: z.string(),
    summary: z.string().optional(),
    /** first published */
    planted: z.coerce.date(),
    /** last meaningfully revised — the headline date in a garden */
    tended: z.coerce.date().optional(),
    maturity: z.enum(["seedling", "growing", "evergreen"]).default("seedling"),
    topics: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { notes };
