import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { sanityClient, urlFor, type PostListItem } from '@/lib/sanity';

const HOME_POSTS_QUERY = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...3] {
  _id, title, slug, excerpt, publishedAt, coverImage, tags
}`;

export default function BlogPreview() {
  const { data: posts } = useQuery({
    queryKey: ['home-posts'],
    queryFn: () => sanityClient.fetch<PostListItem[]>(HOME_POSTS_QUERY),
  });

  if (!posts || posts.length === 0) return null;

  return (
    <section className="bg-secondary/30 py-16">
      <div className="container">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Latest from the Blog</h2>
            <p className="mt-2 text-muted-foreground">Property documentation guides aur tips — Hindi mein.</p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/blog">View All Posts <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map(p => (
            <Card key={p._id} className="group flex flex-col overflow-hidden transition-shadow hover:shadow-md">
              {p.coverImage && (
                <Link to={`/blog/${p.slug.current}`} className="block aspect-[16/9] overflow-hidden bg-muted">
                  <img
                    src={urlFor(p.coverImage).width(640).height(360).fit('crop').auto('format').url()}
                    alt={(p.coverImage as { alt?: string }).alt || p.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                </Link>
              )}
              <CardContent className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  {p.tags?.[0] && (
                    <span className="rounded-full bg-accent px-3 py-0.5 text-xs font-medium text-accent-foreground">
                      {p.tags[0]}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(p.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold leading-snug">
                  <Link to={`/blog/${p.slug.current}`} className="hover:text-primary">{p.title}</Link>
                </h3>
                {p.excerpt && <p className="flex-1 text-sm text-muted-foreground">{p.excerpt}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
