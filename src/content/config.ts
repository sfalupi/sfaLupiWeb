import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

// May also need to update /src/types/index.d.ts when updating this file
// When updating the set of searchable collections, update collectionList in /src/pages/search.astro

const searchable = z.object({
  title: z.string(),
  description: z.string().optional(),
  autodescription: z.boolean().default(true),
  draft: z.boolean().default(false),
});

const social = z.object({
  discord: z.string().optional(),
  email: z.string().optional(),
  facebook: z.string().optional(),
  github: z.string().optional(),
  instagram: z.string().optional(),
  linkedIn: z.string().optional(),
  pinterest: z.string().optional(),
  tiktok: z.string().optional(),
  twitter: z.string().optional(),
  website: z.string().optional(),
  youtube: z.string().optional(),
});

const about = defineCollection({
  loader: glob({ pattern: "-index.{md,mdx}", base: "./src/content/about" }),
  schema: ({ image }) =>
    searchable.extend({
      image: image().optional(),
      imageAlt: z.string().default(""),
    }),
});

const contacts = defineCollection({
  loader: glob({
    pattern: "**\/[^_]*.{md,mdx}",
    base: "./src/content/contacts",
  }),
  schema: ({ image }) =>
    searchable.extend({
      email: z.string().optional(),
      order: z.number().optional(),
      image: image().optional(),
      imageAlt: z.string().default(""),
      social: social.optional(),
    }),
});

const home = defineCollection({
  loader: glob({ pattern: "-index.{md,mdx}", base: "./src/content/home" }),
  schema: ({ image }) =>
    z.object({
      image: image().optional(),
      imageDark: image().optional(),
      imageAlt: z.string().default(""),
      title: z.string(),
      content: z.string(),
      button: z
        .object({
          label: z.string(),
          link: z.string().optional(),
        })
        .optional(),
    }),
});

const texturepacks = defineCollection({
  loader: glob({
    pattern: "**\/[^_]*.{md,mdx}",
    base: "./src/content/texturepacks",
  }),
  schema: ({ image }) =>
    searchable.extend({
      date: z.date().optional(),
      image: image().optional(),
      imageAlt: z.string().default(""),
      author: reference("contact").optional(),
      downloadLink: z.string().url().optional(), // Add this new field
      prepTime: z.number().optional(),
      servings: z.number().optional(),
      diet: z.string().optional(),
      ingredients: z
        .object({
          list: z.array(z.string()),
          qty: z.array(z.string()),
        })
        .optional(),
      instructions: z.array(z.string()).optional(),
      notes: z.array(z.string()).optional(),
    }),
});

const pixelart = defineCollection({
  loader: glob({
    pattern: "**\/[^_]*.{md,mdx}",
    base: "./src/content/pixelart",
  }),
  schema: ({ image }) =>
    searchable.extend({
      date: z.date().optional(),
      order: z.number().optional(),
      image: image().optional(),
      imageAlt: z.string().default(""),
      author: reference("contact").optional(),
      prepTime: z.number().optional(),
      servings: z.number().optional(),
      diet: z.string().optional(),
      ingredients: z
        .object({
          list: z.array(z.string()),
          qty: z.array(z.string()),
        })
        .optional(),
      instructions: z.array(z.string()).optional(),
      notes: z.array(z.string()).optional(),
    }),
});

const commissions = defineCollection({
  loader: glob({
    pattern: "**\/[^_]*.{md,mdx}",
    base: "./src/content/commissions",
  }),
  schema: ({ image }) =>
    searchable.extend({
      date: z.date().optional(),
      order: z.number().optional(),
      image: image().optional(),
      imageAlt: z.string().default(""),
      author: reference("contact").optional(),
      downloadLink: z.string().url().optional(), // Add this new field
      ducksabervn: z.string().url().optional(),
      maximus: z.string().url().optional(),
      prepTime: z.number().optional(),
      servings: z.number().optional(),
      diet: z.string().optional(),
      ingredients: z
        .object({
          list: z.array(z.string()),
          qty: z.array(z.string()),
        })
        .optional(),
      instructions: z.array(z.string()).optional(),
      notes: z.array(z.string()).optional(),
    }),
});

const models3d = defineCollection({
  loader: glob({
    pattern: "**\/[^_]*.{md,mdx}",
    base: "./src/content/3dmodels",
  }),
  schema: ({ image }) =>
    searchable.extend({
      date: z.date().optional(),
      order: z.number().optional(),
      image: image().optional(), // Main image
      images: z.array(image()).optional(), // Gallery images
      imageAlt: z.string().default(""),
      author: reference("contact").optional(),
      downloadLink: z.string().url().optional(),
      modelType: z.string().optional(), // Type of 3D model (character, environment, prop, etc.)
      software: z.string().optional(), // Software used (Blender, Maya, etc.)
      polyCount: z.number().optional(), // Polygon count
      textures: z.boolean().default(false), // Whether textures are included
      rigged: z.boolean().default(false), // Whether model is rigged
      animated: z.boolean().default(false), // Whether animations are included
      formats: z.array(z.string()).optional(), // File formats available (fbx, obj, blend, etc.)
      tags: z.array(z.string()).optional(), // Tags for categorization
    }),
});

const terms = defineCollection({
  loader: glob({ pattern: "-index.{md,mdx}", base: "./src/content/terms" }),
  schema: searchable,
});

// Export collections
export const collections = {
  about,
  contacts,
  home,
  texturepacks,
  terms,
  pixelart,
  commissions,
  "3dmodels": models3d
};