import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import WhatsAppIcon from './icons/WhatsAppIcon';
import { Button } from '@/components/ui/button';
import { services } from '@/lib/services';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  const LangToggle = ({ className = '' }: { className?: string }) => (
    <div className={`inline-flex items-center rounded-md border bg-background p-0.5 text-xs font-semibold ${className}`}>
      <button
        onClick={() => setLang('en')}
        className={`rounded px-2 py-1 transition-colors ${lang === 'en' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
        aria-pressed={lang === 'en'}
      >EN</button>
      <button
        onClick={() => setLang('hi')}
        className={`rounded px-2 py-1 transition-colors ${lang === 'hi' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
        aria-pressed={lang === 'hi'}
      >HI</button>
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">B</span>
          </div>
          <span className="text-xl font-bold text-foreground">BhumiSeva</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm font-medium text-foreground/80 hover:text-foreground">{t('nav.home')}</Link>
          <div className="group relative">
            <button className="flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-foreground">
              {t('nav.services')} <ChevronDown className="h-3 w-3" />
            </button>
            <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
              <div className="w-56 rounded-lg border bg-background p-2 shadow-lg">
                {services.filter(s => s.slug === 'khatiyan').map(s => (
                  <Link key={s.slug} to={`/services/${s.slug}`} className="block rounded-md px-3 py-2 text-sm hover:bg-accent">
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link to="/pricing" className="text-sm font-medium text-foreground/80 hover:text-foreground">{t('nav.pricing')}</Link>
          <Link to="/blog" className="text-sm font-medium text-foreground/80 hover:text-foreground">{t('nav.blog')}</Link>
          <Link to="/about" className="text-sm font-medium text-foreground/80 hover:text-foreground">{t('nav.about')}</Link>
          <Link to="/contact" className="text-sm font-medium text-foreground/80 hover:text-foreground">{t('nav.contact')}</Link>
          <LangToggle />
          <Button variant="hero" size="sm" asChild>
            <a href="https://wa.me/917464026177?text=Hi%20BhumiSeva" target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="h-4 w-4" /> Chat Now
            </a>
          </Button>
        </div>

        {/* Mobile right cluster */}
        <div className="flex items-center gap-2 md:hidden">
          <LangToggle />
          <button onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t bg-background px-4 pb-4 md:hidden">
          <Link to="/" onClick={() => setOpen(false)} className="block py-3 text-sm font-medium">{t('nav.home')}</Link>
          <button onClick={() => setServicesOpen(!servicesOpen)} className="flex w-full items-center justify-between py-3 text-sm font-medium">
            {t('nav.services')} <ChevronDown className={`h-4 w-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
          </button>
          {servicesOpen && (
            <div className="pl-4">
              {services.filter(s => s.slug === 'khatiyan').map(s => (
                <Link key={s.slug} to={`/services/${s.slug}`} onClick={() => setOpen(false)} className="block py-2 text-sm text-muted-foreground">
                  {s.name}
                </Link>
              ))}
            </div>
          )}
          <Link to="/pricing" onClick={() => setOpen(false)} className="block py-3 text-sm font-medium">{t('nav.pricing')}</Link>
          <Link to="/about" onClick={() => setOpen(false)} className="block py-3 text-sm font-medium">{t('nav.about')}</Link>
          <Link to="/blog" onClick={() => setOpen(false)} className="block py-3 text-sm font-medium">{t('nav.blog')}</Link>
          <Link to="/contact" onClick={() => setOpen(false)} className="block py-3 text-sm font-medium">{t('nav.contact')}</Link>
          <Button variant="hero" className="mt-2 w-full" asChild>
            <a href="https://wa.me/917464026177?text=Hi%20BhumiSeva" target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="h-4 w-4" /> Chat Now
            </a>
          </Button>
        </div>
      )}
    </nav>
  );
}
