import { defineConfig, defineType, defineField } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { SANITY_PROJECT_ID, SANITY_DATASET } from '@/lib/sanity';
import { GenerateWithAIAction, AutofillSeoAction } from './actions';

const author = defineType({
  name: 'author',
  type: 'document',
  title: 'Author',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'image', type: 'image', title: 'Photo', options: { hotspot: true } }),
    defineField({ name: 'bio', type: 'text', title: 'Short bio' }),
  ],
});

const post = defineType({
  name: 'post',
  type: 'document',
  title: 'Blog Post',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (R) => R.required().max(120) }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'coverImage',
      type: 'image',
      title: 'Cover Image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
    }),
    defineField({ name: 'excerpt', type: 'text', title: 'Excerpt / SEO description', rows: 3, validation: (R) => R.max(200) }),
    defineField({
      name: 'body',
      type: 'array',
      title: 'Body',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
        },
      ],
    }),
    defineField({ name: 'author', type: 'reference', to: [{ type: 'author' }] }),
    defineField({ name: 'publishedAt', type: 'datetime', validation: (R) => R.required() }),
    defineField({ name: 'tags', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } }),
    defineField({
      name: 'language',
      type: 'string',
      title: 'Language',
      options: {
        list: [
          { title: 'Hinglish (Roman)', value: 'hinglish' },
          { title: 'English', value: 'en' },
          { title: 'Hindi (Devanagari)', value: 'hi' },
        ],
        layout: 'radio',
      },
      initialValue: 'hinglish',
    }),
    defineField({
      name: 'relatedLanguageVersions',
      type: 'array',
      title: 'Other language versions of this post',
      of: [{ type: 'reference', to: [{ type: 'post' }] }],
    }),
  ],
  preview: { select: { title: 'title', media: 'coverImage', subtitle: 'publishedAt' } },
});

export const sanityConfig = defineConfig({
  name: 'default',
  title: 'BhumiSeva Blog',
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  basePath: '/studio',
  plugins: [deskTool(), visionTool()],
  schema: { types: [post, author] },
  document: {
    actions: (prev, context) => {
      if (context.schemaType !== 'post') return prev;
      return [GenerateWithAIAction, AutofillSeoAction, ...prev];
    },
  },
});
