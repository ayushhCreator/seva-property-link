import { useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import TrustBar from '@/components/TrustBar';
import { submitLead } from '@/lib/supabase';
import { services } from '@/lib/services';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', service: '', message: '' });

  const set = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast.error('Kripya naam aur phone number dein.');
      return;
    }
    setLoading(true);
    try {
      await submitLead({
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        city: 'Patna',
        service_type: form.service || 'general-enquiry',
        message: form.message || undefined,
        consent: true,
      });
      toast.success('Dhanyavaad! Hamare expert jald call karenge.');
      setForm({ name: '', phone: '', email: '', service: '', message: '' });
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <TrustBar />
      <main>
        <section className="bg-accent/30 py-16">
          <div className="container text-center">
            <h1 className="text-3xl font-bold md:text-4xl">Contact Us</h1>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Koi sawal ho ya service book karna ho — form fill karein ya WhatsApp karein!
            </p>
          </div>
        </section>

        <section className="container py-16">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Form */}
            <div>
              <h2 className="mb-6 text-2xl font-bold">Send Enquiry</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="c-name">Aapka Naam *</Label>
                  <Input id="c-name" placeholder="Full Name" value={form.name} onChange={e => set('name', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="c-phone">Phone Number *</Label>
                  <Input id="c-phone" type="tel" placeholder="10-digit number" value={form.phone} onChange={e => set('phone', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="c-email">Email (Optional)</Label>
                  <Input id="c-email" type="email" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
                </div>
                <div>
                  <Label>Service</Label>
                  <Select value={form.service} onValueChange={v => set('service', v)}>
                    <SelectTrigger><SelectValue placeholder="Select Service" /></SelectTrigger>
                    <SelectContent>
                      {services.map(s => <SelectItem key={s.slug} value={s.slug}>{s.name}</SelectItem>)}
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="c-msg">Message</Label>
                  <Textarea id="c-msg" placeholder="Aapka sawal ya requirement..." value={form.message} onChange={e => set('message', e.target.value)} />
                </div>
                <div className="flex items-start gap-2">
                  <Checkbox id="c-consent" checked disabled className="mt-0.5" />
                  <Label htmlFor="c-consent" className="text-xs text-muted-foreground">I agree to processing my data for this enquiry.</Label>
                </div>
                <Button variant="hero" className="w-full" type="submit" disabled={loading}>
                  {loading ? 'Sending...' : 'Enquiry Bhejo'}
                </Button>
              </form>
            </div>

            {/* Info + Map */}
            <div>
              <h2 className="mb-6 text-2xl font-bold">Get in Touch</h2>
              <div className="mb-8 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">Office Address</p>
                    <p className="text-sm text-muted-foreground">Sector 5, Boring Road, Patna, Bihar - 800001</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">+91 74640 26177</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">info@bhumiseva.co.in</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MessageCircle className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <a href="https://wa.me/917464026177" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                      wa.me/917464026177
                    </a>
                  </div>
                </div>
              </div>

              {/* Google Map */}
              <div className="overflow-hidden rounded-xl border">
                <iframe
                  title="BhumiSeva Patna Office"
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
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
