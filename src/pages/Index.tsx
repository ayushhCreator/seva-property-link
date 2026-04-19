import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import TrustBar from '@/components/TrustBar';
import ReviewsSection from '@/components/ReviewsSection';
import BlogPreview from '@/components/BlogPreview';
import { services } from '@/lib/services';

export default function Index() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="bg-accent/30 py-16 md:py-24">
        <div className="container text-center">
          <h1 className="text-balance text-3xl font-extrabold leading-tight md:text-5xl">
            Expert Property Documentation Services
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-muted-foreground md:text-lg">
            Khatiyan, Deed Copies, Rent Agreements — sab online. Fast, secure, and trusted by 500+ clients in Patna.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button variant="hero" size="lg" asChild>
              <a href="https://wa.me/917464026177?text=Hi%20BhumiSeva" target="_blank" rel="noopener noreferrer">
                Abhi Book Karo
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/services/khatiyan">View Services <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <TrustBar />

      {/* Why BhumiSeva */}
      <section className="container py-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">Why BhumiSeva?</h2>
          <p className="mt-2 text-muted-foreground">The simplest way to get your property documents</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Clock, title: 'Fast Turnaround', desc: 'Most documents delivered within 3-7 business days.' },
            { icon: Shield, title: 'Secure & Certified', desc: 'All documents are government-certified and verified.' },
            { icon: CheckCircle, title: 'Hassle-Free', desc: 'No office visits needed. We handle everything online.' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center rounded-xl bg-secondary/50 p-8 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                <item.icon className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="mb-2 font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="bg-secondary/30 py-16">
        <div className="container">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold md:text-3xl">Our Services</h2>
            <p className="mt-2 text-muted-foreground">Complete property documentation, simplified.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(s => (
              <Card key={s.slug} className="group transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                    <s.icon className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <h3 className="mb-1 font-semibold">{s.name}</h3>
                  {s.slug === 'difference-money' && (
                    <p className="mb-1 text-xs font-medium text-primary">Inter-State Registry Case</p>
                  )}
                  <p className="mb-3 text-sm text-muted-foreground">{s.shortDesc}</p>
                  {s.slug === 'difference-money' && (
                    <span className="mb-3 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                      Eligibility: Registry 1991–2001
                    </span>
                  )}
                  <div className="mb-4 flex items-center gap-3 text-sm">
                    <span className="font-medium text-primary">From {s.startingPrice}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{s.completedCount} done</span>
                  </div>
                  <Button variant="hero" size="sm" className="w-full" asChild>
                    <Link to={`/services/${s.slug}`}>
                      {s.slug === 'difference-money' ? 'Check Eligibility' : 'Learn More'} <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <BlogPreview />

      {/* Reviews */}
      <ReviewsSection />

      {/* CTA */}
      <section className="py-16">
        <div className="container text-center">
          <h2 className="text-2xl font-bold md:text-3xl">Ready to Get Started?</h2>
          <p className="mt-2 text-muted-foreground">Form bhar kar ya WhatsApp kar sakte ho — your choice!</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button variant="hero" size="lg" asChild>
              <a href="https://wa.me/917464026177" target="_blank" rel="noopener noreferrer">WhatsApp Karo</a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/payment">Payment Process <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
