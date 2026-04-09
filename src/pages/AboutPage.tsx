import { Shield, Users, Clock, Award, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import TrustBar from '@/components/TrustBar';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <TrustBar />
      <main>
        <section className="bg-accent/30 py-16">
          <div className="container text-center">
            <h1 className="text-3xl font-bold md:text-4xl">About BhumiSeva</h1>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Trusted property documentation partner since 2018. We simplify land records and legal paperwork for thousands of families across Bihar.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="container py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-4 text-2xl font-bold">Our Mission</h2>
            <p className="text-muted-foreground">
              BhumiSeva ka mission hai ki har property owner ko unke documents easily aur transparently mile — bina kisi office ke chakkar lagaye. Hum technology aur local expertise ko combine karke fast, secure, and affordable documentation services provide karte hain.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-secondary/30 py-16">
          <div className="container">
            <div className="grid gap-8 text-center md:grid-cols-4">
              {[
                { icon: Users, stat: '500+', label: 'Happy Clients' },
                { icon: Clock, stat: '5000+', label: 'Documents Delivered' },
                { icon: Award, stat: '6+', label: 'Years Experience' },
                { icon: Shield, stat: '4.9★', label: 'Trustpilot Rating' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                    <item.icon className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <p className="text-3xl font-bold text-primary">{item.stat}</p>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="container py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-4 text-2xl font-bold">Our Team</h2>
            <p className="mb-6 text-muted-foreground">
              BhumiSeva mein experienced property consultants, legal advisors aur tech professionals kaam karte hain. Har team member ka ek hi goal hai — aapke documents jaldi aur sahi tarike se deliver karna.
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { name: 'Ayush Raj', role: 'Founder & CEO', desc: 'Property documentation expert with 8+ years of experience in Bihar land records.' },
                { name: 'Priya Singh', role: 'Operations Head', desc: 'Manages day-to-day service delivery and client communications.' },
                { name: 'Vikash Kumar', role: 'Legal Advisor', desc: 'Ensures all documents comply with current regulations and legal requirements.' },
              ].map((m, i) => (
                <div key={i} className="rounded-xl bg-secondary/50 p-6 text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-accent">
                    <span className="text-lg font-bold text-accent-foreground">{m.name[0]}</span>
                  </div>
                  <h3 className="font-semibold">{m.name}</h3>
                  <p className="text-xs text-primary">{m.role}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-accent/30 py-16 text-center">
          <div className="container">
            <h2 className="text-2xl font-bold">Schedule a Call</h2>
            <p className="mt-2 text-muted-foreground">Koi bhi sawal ho, hamare expert se baat karein.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Button variant="hero" size="lg" asChild>
                <a href="https://wa.me/917464026177" target="_blank" rel="noopener noreferrer">
                  <Phone className="mr-2 h-4 w-4" /> Schedule a Call
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
