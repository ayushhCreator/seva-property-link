import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

const articles = [
  {
    slug: 'kaise-khatiyan-nikale',
    title: 'Kaise Khatiyan Nikale? Complete Guide',
    excerpt: 'Bihar mein Khatiyan nikalna ab bahut aasan ho gaya hai. Is guide mein jaaniye online aur offline dono tarike se Khatiyan kaise nikale.',
    date: '2026-03-15',
    category: 'Guide',
  },
  {
    slug: 'dakhil-kharij-process',
    title: 'Dakhil Kharij (Mutation) Process in Bihar',
    excerpt: 'Land mutation ya Dakhil Kharij ka poora process step-by-step samjhiye — documents, fees, aur timeline sab kuch.',
    date: '2026-03-10',
    category: 'Guide',
  },
  {
    slug: 'rent-agreement-tips',
    title: 'Rent Agreement Banwate Waqt Yeh 5 Cheezein Zaroor Check Karein',
    excerpt: 'Rent agreement mein clauses, stamp duty, aur registration ke baare mein important tips jo har tenant aur landlord ko jaanni chahiye.',
    date: '2026-02-28',
    category: 'Tips',
  },
  {
    slug: 'property-fraud-se-bachein',
    title: 'Property Fraud Se Kaise Bachein?',
    excerpt: 'Property kharidne se pehle yeh verification steps zaroor follow karein. Jaaniye common fraud patterns aur unse bachne ke tarike.',
    date: '2026-02-15',
    category: 'Awareness',
  },
  {
    slug: 'online-land-records-bihar',
    title: 'Bihar Land Records Online Kaise Dekhein?',
    excerpt: 'Bhulekh Bihar portal par apni zameen ka record kaise check karein — step-by-step screenshots ke saath.',
    date: '2026-01-20',
    category: 'Guide',
  },
];

export default function BlogPage() {
  return (
    <>
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map(a => (
              <Card key={a.slug} className="group flex flex-col transition-shadow hover:shadow-md">
                <CardContent className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded-full bg-accent px-3 py-0.5 text-xs font-medium text-accent-foreground">{a.category}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(a.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <h2 className="mb-2 text-lg font-semibold leading-snug">{a.title}</h2>
                  <p className="mb-4 flex-1 text-sm text-muted-foreground">{a.excerpt}</p>
                  <Button variant="ghost" size="sm" className="w-fit" asChild>
                    <Link to={`/services/khatiyan`}>
                      Read More <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
