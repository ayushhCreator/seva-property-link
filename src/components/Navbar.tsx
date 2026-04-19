import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { services } from '@/lib/services';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

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
          <Link to="/" className="text-sm font-medium text-foreground/80 hover:text-foreground">Home</Link>
          <div className="group relative">
            <button className="flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-foreground">
              Services <ChevronDown className="h-3 w-3" />
            </button>
            <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
              <div className="w-56 rounded-lg border bg-background p-2 shadow-lg">
                <Link to="/services" className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">All Services</Link>
                {services.map(s => (
                  <Link key={s.slug} to={`/services/${s.slug}`} className="block rounded-md px-3 py-2 text-sm hover:bg-accent">
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link to="/pricing" className="text-sm font-medium text-foreground/80 hover:text-foreground">Pricing</Link>
          <Link to="/blog" className="text-sm font-medium text-foreground/80 hover:text-foreground">Blog</Link>
          <Link to="/about" className="text-sm font-medium text-foreground/80 hover:text-foreground">About</Link>
          <Link to="/contact" className="text-sm font-medium text-foreground/80 hover:text-foreground">Contact</Link>
          <Button variant="hero" size="sm" asChild>
            <a href="https://wa.me/917464026177?text=Hi%20BhumiSeva" target="_blank" rel="noopener noreferrer">
              WhatsApp Karo
            </a>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t bg-background px-4 pb-4 md:hidden">
          <Link to="/" onClick={() => setOpen(false)} className="block py-3 text-sm font-medium">Home</Link>
          <button onClick={() => setServicesOpen(!servicesOpen)} className="flex w-full items-center justify-between py-3 text-sm font-medium">
            Services <ChevronDown className={`h-4 w-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
          </button>
          {servicesOpen && (
            <div className="pl-4">
              <Link to="/services" onClick={() => setOpen(false)} className="block py-2 text-sm font-medium text-primary">All Services</Link>
              {services.map(s => (
                <Link key={s.slug} to={`/services/${s.slug}`} onClick={() => setOpen(false)} className="block py-2 text-sm text-muted-foreground">
                  {s.name}
                </Link>
              ))}
            </div>
          )}
          <Link to="/pricing" onClick={() => setOpen(false)} className="block py-3 text-sm font-medium">Pricing & FAQ</Link>
          <Link to="/about" onClick={() => setOpen(false)} className="block py-3 text-sm font-medium">About</Link>
          <Link to="/blog" onClick={() => setOpen(false)} className="block py-3 text-sm font-medium">Blog</Link>
          <Link to="/contact" onClick={() => setOpen(false)} className="block py-3 text-sm font-medium">Contact</Link>
          <Button variant="hero" className="mt-2 w-full" asChild>
            <a href="https://wa.me/917464026177?text=Hi%20BhumiSeva" target="_blank" rel="noopener noreferrer">
              WhatsApp Karo
            </a>
          </Button>
        </div>
      )}
    </nav>
  );
}
