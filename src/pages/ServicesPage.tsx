import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import TrustBar from '@/components/TrustBar';
import { services } from '@/lib/services';

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <TrustBar />
      <main>
        <section className="bg-accent/30 py-16">
          <div className="container text-center">
            <h1 className="text-3xl font-bold md:text-4xl">Our Services</h1>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Complete property documentation services — from Khatiyan extraction to Partition Deeds. All handled online, delivered to your door.
            </p>
          </div>
        </section>

        <section className="container py-16">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map(s => (
              <Card key={s.slug} className="group flex flex-col transition-shadow hover:shadow-md">
                <CardContent className="flex flex-1 flex-col p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent">
                      <s.icon className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <h2 className="font-semibold">{s.name}</h2>
                      <p className="text-xs text-muted-foreground">{s.nameHi}</p>
                    </div>
                  </div>
                  <p className="mb-4 flex-1 text-sm text-muted-foreground">{s.shortDesc}</p>
                  <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
                    <span className="font-medium text-primary">From {s.startingPrice}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{s.sla}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{s.completedCount} done</span>
                  </div>
                  <ul className="mb-5 space-y-1">
                    {s.deliverables.map((d, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="h-1 w-1 rounded-full bg-primary" /> {d}
                      </li>
                    ))}
                  </ul>
                  <Button variant="hero" size="sm" className="w-full" asChild>
                    <Link to={`/services/${s.slug}`}>
                      Learn More & Book <ArrowRight className="ml-1 h-4 w-4" />
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
