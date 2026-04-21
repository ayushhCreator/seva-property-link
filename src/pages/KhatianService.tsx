import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { ArrowLeft, ArrowRight, CheckCircle, Clock, IndianRupee, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import TrustBar from '@/components/TrustBar';
import Seo from '@/components/Seo';
import { useLanguage, BIHAR_DISTRICTS } from '@/contexts/LanguageContext';
import { submitLead } from '@/lib/supabase';
import { getServiceBySlug } from '@/lib/services';

const WHATSAPP_NUMBER = '917464026177';

const phoneSchema = z.string().trim().regex(/^[6-9]\d{9}$/);
const nameSchema = z.string().trim().min(2).max(80);

interface FormState {
  name: string;
  phone: string;
  district: string;
  block: string;
  thana: string;
  mouza: string;
  khatiyanNo: string;
  ownerName: string;
  consent: boolean;
}

const INITIAL: FormState = {
  name: '', phone: '', district: '', block: '', thana: '', mouza: '',
  khatiyanNo: '', ownerName: '', consent: false,
};

export default function KhatianService() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);

  const service = getServiceBySlug('khatiyan')!;
  const update = <K extends keyof FormState>(k: K, v: FormState[K]) => setData(d => ({ ...d, [k]: v }));

  const validateStep = (s: number): boolean => {
    if (s === 1) {
      if (!nameSchema.safeParse(data.name).success) { toast.error(t('msg.required')); return false; }
      if (!phoneSchema.safeParse(data.phone).success) { toast.error(t('msg.invalidPhone')); return false; }
      return true;
    }
    if (s === 2) {
      if (!data.district || !data.block.trim() || !data.thana.trim() || !data.mouza.trim()) {
        toast.error(t('msg.required')); return false;
      }
      return true;
    }
    if (s === 3) {
      if (!data.ownerName.trim()) { toast.error(t('msg.required')); return false; }
      return true;
    }
    return true;
  };

  const next = () => { if (validateStep(step)) setStep(s => Math.min(4, s + 1)); };
  const back = () => setStep(s => Math.max(1, s - 1));

  const submit = async () => {
    if (!data.consent) { toast.error(t('msg.consent')); return; }
    setSubmitting(true);
    try {
      await submitLead({
        name: data.name.trim(),
        phone: data.phone.trim(),
        city: data.district,
        district: data.district,
        state: 'Bihar',
        service_type: 'Khatiyan Nikalna',
        block: data.block.trim(),
        thana: data.thana.trim(),
        mouza: data.mouza.trim(),
        khatiyan_number: data.khatiyanNo.trim() || undefined,
        owner_name: data.ownerName.trim(),
        consent: true,
      });

      const msg =
        `Namaste! Main ${data.name} bol raha hoon\n` +
        `Mujhe ${data.district} mein Khatiyan chahiye\n` +
        `Block: ${data.block}\nThana: ${data.thana}\nMouza: ${data.mouza}\n` +
        `Owner: ${data.ownerName}\n` +
        `Khatiyan No: ${data.khatiyanNo || 'Pata nahi'}\n` +
        `Mobile: ${data.phone}`;

      toast.success(t('msg.success'));
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      setData(INITIAL);
      setStep(1);
    } catch (err) {
      console.error(err);
      toast.error(t('msg.error'));
    } finally {
      setSubmitting(false);
    }
  };

  const stepLabels = [t('step.basic'), t('step.location'), t('step.property'), t('step.confirm')];

  return (
    <>
      <Seo
        title="Khatiyan Nikalna Online in Bihar | Land Records | BhumiSeva"
        description="Apply online for certified Khatiyan / Bihar land records (Jamabandi, Khatian copy). Fast 3-5 day delivery, expert verification, doorstep service in Patna & all Bihar districts."
        canonical="https://bhumiseva.co.in/services/khatiyan"
        keywords="khatiyan nikalna, khatiyan online bihar, bihar land records, jamabandi bihar, khatian copy, khasra khatauni bihar, land record patna, bhumi jankari bihar, online khatiyan apply, certified land record bihar, BhumiSeva khatiyan"
      />
      <Navbar />
      <TrustBar />
      <main className="container py-6 md:py-10">
        <Link to="/" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> {t('nav.home')}
        </Link>

        <div className="grid gap-6 lg:grid-cols-5 lg:gap-10">
          {/* Info column */}
          <section className="lg:col-span-3">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                <FileText className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold md:text-3xl">{t('khatian.title')}</h1>
                <p className="text-sm text-muted-foreground">{lang === 'hi' ? service.nameHi : service.shortDesc}</p>
              </div>
            </div>
            <p className="mb-6 text-muted-foreground">{t('khatian.subtitle')}</p>

            <div className="mb-6 grid gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-2 rounded-lg bg-accent/50 p-3">
                <IndianRupee className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">{t('khatian.startingFrom')}</p>
                  <p className="font-semibold">{service.startingPrice}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-accent/50 p-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">{t('khatian.delivery')}</p>
                  <p className="font-semibold">{service.sla}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-accent/50 p-3">
                <CheckCircle className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">{t('khatian.completed')}</p>
                  <p className="font-semibold">{service.completedCount}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="mb-3 text-lg font-semibold">{t('khatian.benefits')}</h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {service.benefits.map(b => (
                  <li key={b} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="mb-3 text-lg font-semibold">{t('khatian.deliverables')}</h2>
              <ul className="space-y-2">
                {service.deliverables.map(d => (
                  <li key={d} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Form column */}
          <section className="lg:col-span-2">
            <Card className="sticky top-20">
              <CardContent className="p-5 md:p-6">
                <h2 className="mb-1 text-lg font-bold">{t('khatian.formTitle')}</h2>
                <p className="mb-4 text-xs text-muted-foreground">
                  {t('step.of').replace('{n}', String(step))} — {stepLabels[step - 1]}
                </p>

                {/* Progress */}
                <div className="mb-5 flex gap-1.5">
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        i <= step ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>

                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">{t('field.name')} *</Label>
                      <Input id="name" value={data.name} onChange={e => update('name', e.target.value)} placeholder={t('field.name.ph')} maxLength={80} autoFocus />
                    </div>
                    <div>
                      <Label htmlFor="phone">{t('field.phone')} *</Label>
                      <Input id="phone" type="tel" inputMode="numeric" value={data.phone} onChange={e => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder={t('field.phone.ph')} />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <Label>{t('field.district')} *</Label>
                      <Select value={data.district} onValueChange={v => update('district', v)}>
                        <SelectTrigger><SelectValue placeholder={t('field.district.ph')} /></SelectTrigger>
                        <SelectContent className="max-h-72">
                          {BIHAR_DISTRICTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="block">{t('field.block')} *</Label>
                      <Input id="block" value={data.block} onChange={e => update('block', e.target.value)} placeholder={t('field.block.ph')} maxLength={60} />
                    </div>
                    <div>
                      <Label htmlFor="thana">{t('field.thana')} *</Label>
                      <Input id="thana" value={data.thana} onChange={e => update('thana', e.target.value)} placeholder={t('field.thana.ph')} maxLength={60} />
                    </div>
                    <div>
                      <Label htmlFor="mouza">{t('field.mouza')} *</Label>
                      <Input id="mouza" value={data.mouza} onChange={e => update('mouza', e.target.value)} placeholder={t('field.mouza.ph')} maxLength={60} />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="khatiyanNo">{t('field.khatiyanNo')}</Label>
                      <Input id="khatiyanNo" value={data.khatiyanNo} onChange={e => update('khatiyanNo', e.target.value)} placeholder={t('field.khatiyanNo.ph')} maxLength={50} />
                    </div>
                    <div>
                      <Label htmlFor="ownerName">{t('field.ownerName')} *</Label>
                      <Input id="ownerName" value={data.ownerName} onChange={e => update('ownerName', e.target.value)} placeholder={t('field.ownerName.ph')} maxLength={80} />
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-4">
                    <div className="rounded-lg border bg-muted/30 p-3 text-sm">
                      <p><strong>{t('field.name')}:</strong> {data.name}</p>
                      <p><strong>{t('field.phone')}:</strong> {data.phone}</p>
                      <p><strong>{t('field.district')}:</strong> {data.district}</p>
                      <p><strong>{t('field.block')}:</strong> {data.block}</p>
                      <p><strong>{t('field.thana')}:</strong> {data.thana}</p>
                      <p><strong>{t('field.mouza')}:</strong> {data.mouza}</p>
                      <p><strong>{t('field.ownerName')}:</strong> {data.ownerName}</p>
                      {data.khatiyanNo && <p><strong>{t('field.khatiyanNo')}:</strong> {data.khatiyanNo}</p>}
                    </div>
                    <label className="flex items-start gap-2 text-sm">
                      <Checkbox checked={data.consent} onCheckedChange={v => update('consent', !!v)} className="mt-0.5" />
                      <span>{t('field.consent')}</span>
                    </label>
                  </div>
                )}

                <div className="mt-6 flex gap-2">
                  {step > 1 && (
                    <Button variant="outline" onClick={back} disabled={submitting} className="flex-1">
                      <ArrowLeft className="h-4 w-4" /> {t('btn.back')}
                    </Button>
                  )}
                  {step < 4 ? (
                    <Button onClick={next} variant="hero" className="flex-1">
                      {t('btn.next')} <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={submit} variant="hero" className="flex-1" disabled={submitting || !data.consent}>
                      {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> {t('btn.submitting')}</> : t('btn.submit')}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}