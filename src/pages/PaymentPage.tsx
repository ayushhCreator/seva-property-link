import { CheckCircle, CreditCard, FileCheck, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

const steps = [
  { icon: Phone, title: 'Submit Enquiry', desc: 'Fill the form or WhatsApp us with your service requirement.' },
  { icon: FileCheck, title: 'Get Quote', desc: 'Our expert reviews your request and shares an exact quote.' },
  { icon: CreditCard, title: 'Pay Advance (10%)', desc: 'Pay a small advance via Razorpay to start the process.' },
  { icon: CheckCircle, title: 'Receive Documents', desc: 'We deliver certified documents. Pay remaining on delivery.' },
];

export default function PaymentPage() {
  return (
    <>
      <Navbar />
      <main className="container py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold">How Payment Works</h1>
          <p className="mt-2 text-muted-foreground">Simple, transparent, and secure.</p>
        </div>
        <div className="mx-auto mt-12 max-w-2xl space-y-6">
          {steps.map((s, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mx-auto mt-10 max-w-md text-center">
          <Button variant="hero" size="lg" asChild>
            <a href="https://razorpay.me/bhumiseva" target="_blank" rel="noopener noreferrer">
              <CreditCard className="mr-2 h-5 w-5" />
              Pay via Razorpay
            </a>
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">Secure payment powered by Razorpay. UPI, Cards, Net Banking accepted.</p>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
