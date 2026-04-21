import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { CheckCircle, Clock, IndianRupee, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';
import TrustBar from '@/components/TrustBar';
import MarqueeBanner from '@/components/MarqueeBanner';
import { getServiceBySlug, type ServiceField } from '@/lib/services';
import { submitLead } from '@/lib/supabase';

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? getServiceBySlug(slug) : undefined;

  if (!service) return <Navigate to="/" />;

  return (
    <>
      <Navbar />
      <TrustBar />
      <main className="container py-10">
        <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="grid gap-10 lg:grid-cols-5">
          {/* Info */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                <service.icon className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold md:text-3xl">{service.name}</h1>
                <p className="text-sm text-muted-foreground">{service.nameHi}</p>
              </div>
            </div>
            <p className="mb-6 text-muted-foreground">{service.fullDesc}</p>

            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-2 rounded-lg bg-accent/50 p-3">
                <IndianRupee className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Starting From</p>
                  <p className="font-semibold">{service.startingPrice}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-accent/50 p-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Delivery</p>
                  <p className="font-semibold">{service.sla}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-accent/50 p-3">
                <CheckCircle className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Completed</p>
                  <p className="font-semibold">{service.completedCount}</p>
                </div>
              </div>
            </div>

            <h3 className="mb-3 font-semibold">Benefits</h3>
            <ul className="mb-6 space-y-2">
              {service.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {b}
                </li>
              ))}
            </ul>

            <h3 className="mb-3 font-semibold">Deliverables</h3>
            <ul className="space-y-2">
              {service.deliverables.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {d}
                </li>
              ))}
            </ul>

            <ServiceExtras slug={service.slug} />
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <EnquiryForm service={service} />
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

function EnquiryForm({ service }: { service: { slug: string; name: string; fields: ServiceField[] } }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({
    name: '', phone: '', email: '', city: '', message: '',
  });

  const totalSteps = 2;

  const set = (key: string, value: string) => setFormData(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || !formData.city) {
      toast.error('Kripya naam, phone aur city dein.');
      return;
    }
    setLoading(true);
    try {
      await submitLead({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        city: formData.city,
        service_type: service.slug,
        state: formData.state || undefined,
        district: formData.district || undefined,
        khesra_plot_no: formData.khesra_plot_no || undefined,
        registration_number: formData.registration_number || undefined,
        office_city: formData.office_city || undefined,
        copy_type: formData.copy_type || undefined,
        khatiyan_number: formData.khatiyan_number || undefined,
        owner_details: formData.owner_details || undefined,
        landlord_name: formData.landlord_name || undefined,
        tenant_name: formData.tenant_name || undefined,
        rent_start_date: formData.rent_start_date || undefined,
        rent_end_date: formData.rent_end_date || undefined,
        property_details: formData.property_details || undefined,
        co_owners_count: formData.co_owners_count ? parseInt(formData.co_owners_count) : undefined,
        registry_city: formData.registry_city || undefined,
        registry_year: formData.registry_year || undefined,
        area_mohalla: formData.area_mohalla || undefined,
        message: formData.message || undefined,
        consent: true,
      });
      toast.success('Dhanyavaad! Hum aapko jald contact karenge.');
      setFormData({ name: '', phone: '', email: '', city: '', message: '' });
      setStep(1);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="sticky top-20 shadow-lg">
      <CardHeader className="bg-primary/5">
        <CardTitle className="text-lg">Enquiry Form — {service.name}</CardTitle>
        <p className="text-xs text-muted-foreground">Step {step} of {totalSteps}</p>
        <div className="mt-2 flex gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i < step ? 'bg-primary' : 'bg-border'}`} />
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Aapka Naam *</Label>
              <Input id="name" placeholder="Full Name" value={formData.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input id="phone" type="tel" placeholder="10-digit mobile number" value={formData.phone} onChange={e => set('phone', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="email">Email (Optional)</Label>
              <Input id="email" type="email" placeholder="your@email.com" value={formData.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="city">City *</Label>
              <Select value={formData.city} onValueChange={v => set('city', v)}>
                <SelectTrigger><SelectValue placeholder="Select City" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Patna">Patna</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="hero" className="w-full" onClick={() => {
              if (!formData.name || !formData.phone || !formData.city) {
                toast.error('Kripya naam, phone aur city dein.');
                return;
              }
              setStep(2);
            }}>
              Next <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            {service.fields.map(field => (
              <div key={field.name}>
                <Label htmlFor={field.name}>{field.label} {field.required && '*'}</Label>
                {field.type === 'select' ? (
                  <Select value={formData[field.name] || ''} onValueChange={v => set(field.name, v)}>
                    <SelectTrigger><SelectValue placeholder={field.placeholder} /></SelectTrigger>
                    <SelectContent>
                      {field.options?.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                ) : field.type === 'textarea' ? (
                  <Textarea id={field.name} placeholder={field.placeholder} value={formData[field.name] || ''} onChange={e => set(field.name, e.target.value)} />
                ) : (
                  <Input id={field.name} type={field.type} placeholder={field.placeholder} value={formData[field.name] || ''} onChange={e => set(field.name, e.target.value)} />
                )}
              </div>
            ))}
            <div>
              <Label htmlFor="message">Additional Message</Label>
              <Textarea id="message" placeholder="Koi aur detail..." value={formData.message} onChange={e => set('message', e.target.value)} />
            </div>
            <div className="flex items-start gap-2">
              <Checkbox id="consent" checked className="mt-0.5" disabled />
              <Label htmlFor="consent" className="text-xs text-muted-foreground">I agree to processing my data for this enquiry.</Label>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                <ArrowLeft className="mr-1 h-4 w-4" /> Back
              </Button>
              <Button variant="hero" className="flex-1" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Submitting...' : 'Enquiry Bhejo'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ServiceExtras({ slug }: { slug: string }) {
  if (slug === 'partition') {
    return (
      <div className="mt-8">
        <h3 className="mb-3 font-semibold">Service Type</h3>
        <Card className="border-primary/30">
          <CardContent className="p-5">
            <h4 className="mb-2 font-semibold">1. Drafting Only (Without Stamp)</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Legally drafted partition deed</li>
              <li className="flex gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Mutual agreement (aapsi batwara) format</li>
              <li className="flex gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Delivered digitally for your use</li>
            </ul>
          </CardContent>
        </Card>
        <div className="mt-6 rounded-md border border-amber-400 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>Important Note:</strong> This is a mutual agreement (aapsi batwara) between co-owners. BhumiSeva provides online drafting and documentation services only. Stamp duty, notary, and court-related charges — if required — are to be handled by the client independently.
        </div>
      </div>
    );
  }

  if (slug === 'mutation') {
    return (
      <div className="mt-8">
        <MarqueeBanner
          texts={[
            '⚠️  Dakhil Kharij (Mutation) is a Government process. BhumiSeva charges only for documentation & process assistance. Estimated service fee: ₹7,000 – ₹15,000. Timeline: approx. 3–6 months depending on Government processing.  •••  ',
            '⚠️  दाखिल खारिज (म्युटेशन) एक सरकारी प्रक्रिया है। BhumiSeva केवल दस्तावेज़ीकरण और सहायता के लिए शुल्क लेता है। अनुमानित शुल्क: ₹7,000 – ₹15,000। समय: लगभग 3–6 महीने।  •••  ',
          ]}
        />
        <div className="mt-4 rounded-md border border-amber-400 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>Important Note:</strong> Dakhil Kharij is a Government process. BhumiSeva only charges for documentation and process assistance. Final timeline depends on Government processing and may vary case-to-case.
        </div>
      </div>
    );
  }

  if (slug === 'khatiyan') {
    return (
      <div className="mt-8 space-y-6">
        <div>
          <h3 className="mb-3 font-semibold">🌾 Khatiyan (Land Record Document)</h3>
          <p className="text-sm text-muted-foreground">
            Khatiyan ek important land record document hota hai jisme kisi zameen ke malik (owner), khata number, aur land details mention hoti hain. Ye document land ownership verify karne, property check karne aur future transaction (buy/sell) se pehle confirmation ke liye use hota hai.
          </p>
        </div>
        <div>
          <h4 className="mb-2 font-semibold">Ye Document Kis Kaam Aata Hai</h4>
          <ul className="space-y-1 text-sm">
            <li className="flex gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Zameen ka ownership check karne ke liye / Verify land ownership</li>
            <li className="flex gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Property kharidne se pehle verification / Pre-purchase property verification</li>
            <li className="flex gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Land dispute avoid karne ke liye / Avoid land disputes</li>
            <li className="flex gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Government record se details confirm karne ke liye / Confirm from official government records</li>
          </ul>
        </div>
        <Card className="border-primary/30">
          <CardContent className="p-5">
            <h4 className="mb-2 font-semibold">📄 Service Type: Only Online Digital Copy</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Fast & simple process</li>
              <li className="flex gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Verified government record access</li>
              <li className="flex gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Delivered digitally — no physical copy</li>
            </ul>
          </CardContent>
        </Card>
        <Button variant="hero" asChild>
          <a href="https://wa.me/917464026177?text=Khatiyan%20nikalwana%20hai" target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon className="h-4 w-4" /> Chat Now
          </a>
        </Button>
      </div>
    );
  }

  if (slug === 'difference-money') {
    return (
      <div className="mt-8 space-y-6">
        <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-5">
          <h3 className="mb-3 font-semibold text-emerald-900">📌 Ye Service Kin Logon Ke Liye Hai? / Who Is This For?</h3>
          <ul className="space-y-2 text-sm text-emerald-900">
            <li className="flex gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0" /> Jinki property Bihar (kisi bhi district) mein hai / Property is located in Bihar</li>
            <li className="flex gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0" /> Lekin registry Mumbai, Kolkata ya kisi aur state mein hui thi / But registration was done in Mumbai, Kolkata or another state</li>
            <li className="flex gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0" /> Registry ki date 25 March 1991 se 2001 ke beech hai / Registration date between 25/03/1991 and 2001</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-semibold">🧾 BhumiSeva Kya Help Karta Hai?</h3>
          <ul className="space-y-1 text-sm">
            <li className="flex gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Case verification & eligibility check</li>
            <li className="flex gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Required document guidance</li>
            <li className="flex gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Application & submission support</li>
            <li className="flex gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Process tracking assistance</li>
          </ul>
        </div>

        <MarqueeBanner
          texts={[
            '⚠️  Difference Money ek government-related tax/penalty process hai jo Bihar sarkar ke rules ke according apply hota hai. BhumiSeva ek independent service provider ke roop mein documentation aur case handling ke liye charges leta hai. Final amount aur process timeline har case ke hisaab se vary karta hai.  •••  ',
          ]}
        />

        <div className="rounded-md border border-amber-400 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>Important Note:</strong> Difference Money ek government-related tax/penalty process hai. BhumiSeva ek independent service provider ke roop mein documentation, case handling aur process assistance ke liye service charges leta hai. Final amount aur process timeline har case ke hisaab se vary karta hai.
        </div>

        <div className="rounded-lg bg-accent/40 p-5 text-center">
          <p className="mb-3 font-medium">👉 Apna case verify karne ke liye WhatsApp par details share karein</p>
          <Button variant="hero" asChild>
            <a href="https://wa.me/917464026177?text=Difference%20Money%20case%20verify%20karna%20hai" target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="h-4 w-4" /> Chat Now
            </a>
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
