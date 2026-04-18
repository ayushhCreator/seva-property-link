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
