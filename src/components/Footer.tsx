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
              {services.map(s => (
                <li key={s.slug}>
                  <Link to={`/services/${s.slug}`} className="text-sm text-muted-foreground hover:text-foreground">{s.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Cities</h4>
            <ul className="space-y-2">
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
              <li>📞 +91 98765 43210</li>
              <li>✉️ info@bhumiseva.co.in</li>
              <li>📍 Patna | Kolkata | Mumbai</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} BhumiSeva. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
