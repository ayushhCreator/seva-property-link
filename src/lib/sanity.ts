import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

type SanityImageSource = Parameters<ReturnType<typeof imageUrlBuilder>['image']>[0];

export const SANITY_PROJECT_ID = 'ajhhf96y';
export const SANITY_DATASET = 'production';

export const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: true,
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export interface PostListItem {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  publishedAt: string;
  coverImage?: SanityImageSource & { alt?: string };
  tags?: string[];
  author?: { name: string };
}

export interface PostDetail extends PostListItem {
  body: unknown[];
  author?: { name: string; image?: SanityImageSource; bio?: string };
}

export const POSTS_QUERY = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  coverImage,
  tags,
  "author": author->{ name }
}`;

export const POST_BY_SLUG_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  coverImage,
  tags,
  body,
  "author": author->{ name, image, bio }
}`;
