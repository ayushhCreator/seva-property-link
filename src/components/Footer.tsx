import { Link } from 'react-router-dom';
import { services, cities } from '@/lib/services';

export default function Footer() {
  return (
    <footer className="border-t bg-secondary/50">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">B</span>
              </div>
              <span className="text-lg font-bold">BhumiSeva</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Expert Property Documentation Services across India. Fast, secure, and reliable.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Services</h4>
            <ul className="space-y-2">
              {services.filter(s => s.slug === 'khatiyan').map(s => (
                <li key={s.slug}>
                  <Link to={`/services/${s.slug}`} className="text-sm text-muted-foreground hover:text-foreground">{s.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">About Us</Link></li>
              <li><Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing & FAQ</Link></li>
              <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground">Blog</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link></li>
              {cities.map(c => (
                <li key={c.slug}>
                  <Link to={`/city/${c.slug}`} className="text-sm text-muted-foreground hover:text-foreground">{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>📞 +91 74640 26177</li>
              <li>✉️ info@bhumiseva.co.in</li>
              <li>📍 Patna, Bihar</li>
            </ul>
            <div className="mt-4">
              <a href="https://g.page/bhumiseva" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                📌 Google Business Profile
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center gap-2 border-t pt-6 text-xs text-muted-foreground md:flex-row md:justify-between">
          <span>© {new Date().getFullYear()} BhumiSeva. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-foreground">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
