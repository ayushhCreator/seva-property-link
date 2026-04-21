import { useParams, Navigate, Link } from 'react-router-dom';
import { MapPin, Phone, ArrowRight } from 'lucide-react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import TrustBar from '@/components/TrustBar';
import { getCityBySlug, services } from '@/lib/services';

export default function CityPage() {
  const { slug } = useParams<{ slug: string }>();
  const city = slug ? getCityBySlug(slug) : undefined;

  if (!city) return <Navigate to="/" />;

  return (
    <>
      <Navbar />
      <TrustBar />
      <main>
        {/* Hero */}
        <section className="bg-accent/30 py-16">
          <div className="container text-center">
            <h1 className="text-3xl font-bold md:text-4xl">{city.tagline}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{city.description}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Button variant="hero" size="lg" asChild>
                <a href="https://wa.me/917464026177" target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="h-5 w-5" /> Chat Now
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to={`/services/khatiyan`}>View Services <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Services in this city */}
        <section className="container py-16">
          <h2 className="mb-8 text-center text-2xl font-bold">Our Services in {city.name}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {services.slice(0, 3).map(s => (
              <Card key={s.slug} className="transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                    <s.icon className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <h3 className="mb-1 font-semibold">{s.name}</h3>
                  <p className="mb-3 text-sm text-muted-foreground">{s.shortDesc}</p>
                  <p className="mb-3 text-sm font-medium text-primary">From {s.startingPrice}</p>
                  <Button variant="hero" size="sm" asChild>
                    <Link to={`/services/${s.slug}`}>Book Now</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Testimonial */}
        <section className="bg-secondary/30 py-16">
          <div className="container text-center">
            <h2 className="mb-6 text-2xl font-bold">What {city.name} Clients Say</h2>
            <Card className="mx-auto max-w-lg border-0 shadow-sm">
              <CardContent className="p-8">
                <div className="mb-3 flex justify-center gap-0.5">
                  {Array.from({ length: city.testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="mb-4 text-muted-foreground">"{city.testimonial.text}"</p>
                <p className="font-semibold">{city.testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{city.name}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact info + Map */}
        <section className="container py-16">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-6 text-center text-2xl font-bold">BhumiSeva {city.name} Office</h2>
            <div className="mb-6 space-y-3 text-center text-muted-foreground">
              <p className="flex items-center justify-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {city.address}</p>
              <p className="flex items-center justify-center gap-2"><Phone className="h-4 w-4 text-primary" /> {city.phone}</p>
            </div>
            <div className="overflow-hidden rounded-xl border">
              <iframe
                title={`BhumiSeva ${city.name} Office`}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.6!2d85.12!3d25.61!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDM2JzM2LjAiTiA4NcKwMDcnMTIuMCJF!5e0!3m2!1sen!2sin!4v1600000000000"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
