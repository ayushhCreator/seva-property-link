import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import Seo from '@/components/Seo';
import { sanityClient, POSTS_QUERY, urlFor, type PostListItem } from '@/lib/sanity';

export default function BlogPage() {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: () => sanityClient.fetch<PostListItem[]>(POSTS_QUERY),
  });

  return (
    <>
      <Seo
        title="BhumiSeva Blog — Property Documentation Guides"
        description="Property documentation tips, guides aur latest updates — Khatiyan, Mutation, Rent Agreement aur Difference Money par expert advice."
      />
      <Navbar />
      <main>
        <section className="bg-accent/30 py-16">
          <div className="container text-center">
            <h1 className="text-3xl font-bold md:text-4xl">Blog & Resources</h1>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Property documentation tips, guides, aur latest updates — sab kuch Hindi mein.
            </p>
          </div>
        </section>

        <section className="container py-16">
          {isLoading && <p className="text-center text-muted-foreground">Loading posts…</p>}
          {error && (
            <p className="text-center text-destructive">
              Couldn't load posts. Add your first post in Sanity Studio.
            </p>
          )}
          {posts && posts.length === 0 && (
            <div className="rounded-lg border border-dashed bg-accent/20 p-10 text-center">
              <h2 className="mb-2 text-lg font-semibold">No posts yet</h2>
              <p className="text-sm text-muted-foreground">
                Open your Sanity Studio and publish your first blog post — it will appear here automatically.
              </p>
            </div>
          )}
          {posts && posts.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map(p => (
                <Card key={p._id} className="group flex flex-col overflow-hidden transition-shadow hover:shadow-md">
                  {p.coverImage && (
                    <Link to={`/blog/${p.slug.current}`} className="block aspect-[16/9] overflow-hidden bg-muted">
                      <img
                        src={urlFor(p.coverImage).width(640).height(360).fit('crop').auto('format').url()}
                        alt={p.coverImage.alt || p.title}
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
                    <h2 className="mb-2 text-lg font-semibold leading-snug">
                      <Link to={`/blog/${p.slug.current}`} className="hover:text-primary">{p.title}</Link>
                    </h2>
                    {p.excerpt && <p className="mb-4 flex-1 text-sm text-muted-foreground">{p.excerpt}</p>}
                    <Button variant="ghost" size="sm" className="w-fit" asChild>
                      <Link to={`/blog/${p.slug.current}`}>
                        Read More <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
