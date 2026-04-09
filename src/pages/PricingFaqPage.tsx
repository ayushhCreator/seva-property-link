import { ChevronDown } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import TrustBar from '@/components/TrustBar';
import { services } from '@/lib/services';

const faqs = [
  { q: 'Khatiyan nikalne mein kitna time lagta hai?', a: 'Usually 3-5 business days. Urgent cases mein 2 din mein bhi ho sakta hai (extra charges applicable).' },
  { q: 'Kya mujhe kisi office jaana padega?', a: 'Nahi! BhumiSeva sab online handle karta hai. Aapko sirf form fill karna hai, baaki hum karenge.' },
  { q: 'Payment kaise karna hoga?', a: 'Hum Razorpay ke through payment accept karte hain — UPI, cards, net banking sab chalega. 10% advance payment se kaam shuru hota hai, baaki delivery par.' },
  { q: 'Kya documents certified hote hain?', a: 'Haan, sabhi documents government-certified hote hain aur legally valid hain.' },
  { q: 'Kya refund milta hai agar document nahi mila?', a: 'Agar kisi genuine reason se document nahi mil paata, toh full refund policy hai. Terms & Conditions page par details hain.' },
  { q: 'Mutation/Dakhil Kharij mein kitna time lagta hai?', a: 'Dakhil Kharij usually 7-15 business days mein complete hota hai, depending on government office processing.' },
  { q: 'Rent Agreement kitne din mein ban jaata hai?', a: '2-3 business days mein draft + e-stamp + notarized copy ready ho jaati hai.' },
  { q: 'Kya aap Mumbai ya Kolkata mein bhi service dete hain?', a: 'Filhaal hamara primary focus Patna, Bihar hai. Jaldi hi hum dusre cities mein bhi expand karenge.' },
];

export default function PricingFaqPage() {
  return (
    <>
      <Navbar />
      <TrustBar />
      <main>
        <section className="bg-accent/30 py-16">
          <div className="container text-center">
            <h1 className="text-3xl font-bold md:text-4xl">Pricing & FAQ</h1>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Transparent pricing with no hidden charges. Find answers to common questions below.
            </p>
          </div>
        </section>

        {/* Pricing */}
        <section className="container py-16">
          <h2 className="mb-8 text-center text-2xl font-bold">Service Pricing</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map(s => (
              <Card key={s.slug} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
                      <s.icon className="h-4 w-4 text-accent-foreground" />
                    </div>
                    <h3 className="font-semibold">{s.name}</h3>
                  </div>
                  <p className="mb-3 text-2xl font-bold text-primary">{s.startingPrice} <span className="text-sm font-normal text-muted-foreground">onwards</span></p>
                  <p className="mb-2 text-xs text-muted-foreground">Delivery: {s.sla}</p>
                  <ul className="space-y-1">
                    {s.deliverables.map((d, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="h-1 w-1 rounded-full bg-primary" /> {d}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            * Prices are starting rates. Final quote depends on document complexity and urgency. 10% advance required to start.
          </p>
        </section>

        {/* FAQ */}
        <section className="bg-secondary/30 py-16">
          <div className="container">
            <h2 className="mb-8 text-center text-2xl font-bold">Frequently Asked Questions</h2>
            <div className="mx-auto max-w-2xl">
              <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="rounded-lg border bg-background px-4">
                    <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      </main>

      {/* FAQ Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(f => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a }
        }))
      })}} />

      <Footer />
      <WhatsAppButton />
    </>
  );
}
