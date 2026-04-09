import { Shield, Lock, Star, Users } from 'lucide-react';

const badges = [
  { icon: Shield, label: 'ISO Certified' },
  { icon: Lock, label: 'SSL Secured' },
  { icon: Star, label: '4.9★ Trustpilot' },
  { icon: Users, label: '500+ Clients' },
];

export default function TrustBar() {
  return (
    <div className="border-y bg-secondary/30">
      <div className="container py-4">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
          {badges.map(b => (
            <div key={b.label} className="flex items-center gap-2 text-sm text-muted-foreground">
              <b.icon className="h-4 w-4 text-primary" />
              <span className="font-medium">{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
