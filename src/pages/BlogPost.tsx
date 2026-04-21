import { useQuery } from '@tanstack/react-query';
import { Link, useParams, Navigate } from 'react-router-dom';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import AdSlot from '@/components/AdSlot';
import { ArrowLeft, Calendar } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import Seo from '@/components/Seo';
import { sanityClient, POST_BY_SLUG_QUERY, urlFor, type PostDetail } from '@/lib/sanity';

const portableComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => (
      <img
        src={urlFor(value).width(1200).auto('format').url()}
        alt={value?.alt || ''}
        className="my-6 rounded-lg"
        loading="lazy"
      />
    ),
  },
  block: {
    h2: ({ children }) => <h2 className="mt-8 mb-3 text-2xl font-bold">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-6 mb-2 text-xl font-semibold">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="my-4 border-l-4 border-primary bg-accent/30 p-4 italic">{children}</blockquote>
    ),
    normal: ({ children }) => <p className="my-3 leading-relaxed text-foreground/90">{children}</p>,
  },
  marks: {
    link: ({ value, children }) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer" className="text-primary underline">
        {children}
      </a>
    ),
  },
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => sanityClient.fetch<PostDetail | null>(POST_BY_SLUG_QUERY, { slug }),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="container py-20 text-center text-muted-foreground">Loading…</main>
        <Footer />
      </>
    );
  }

  if (error || !post) return <Navigate to="/blog" replace />;

  const coverUrl = post.coverImage ? urlFor(post.coverImage).width(1600).auto('format').url() : undefined;

  return (
    <>
      <Seo
        title={post.title}
        description={post.excerpt}
        image={coverUrl}
        type="article"
      />
      <Navbar />
      <main className="container max-w-3xl py-10">
        <Link to="/blog" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        <article>
          <header className="mb-6">
            <h1 className="mb-3 text-3xl font-bold leading-tight md:text-4xl">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              {post.author?.name && <span>• By {post.author.name}</span>}
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags.map(t => (
                  <span key={t} className="rounded-full bg-accent px-3 py-0.5 text-xs font-medium text-accent-foreground">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </header>

          {coverUrl && (
            <img
              src={coverUrl}
              alt={(post.coverImage as { alt?: string })?.alt || post.title}
              className="mb-8 aspect-[16/9] w-full rounded-lg object-cover"
            />
          )}

          <div className="prose prose-neutral max-w-none">
            {post.body && <PortableText value={post.body as never} components={portableComponents} />}
          </div>

          <AdSlot className="mt-8" />
        </article>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
