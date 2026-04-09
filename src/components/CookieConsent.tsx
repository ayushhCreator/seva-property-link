import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('bhumiseva-cookie-consent');
    if (!consent) setShow(true);
  }, []);

  const accept = () => {
    localStorage.setItem('bhumiseva-cookie-consent', 'accepted');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 mx-auto max-w-lg animate-fade-in rounded-xl border bg-background p-4 shadow-lg md:bottom-8 md:left-8 md:right-auto">
      <p className="mb-3 text-sm text-muted-foreground">
        We use cookies to improve your experience. By continuing, you agree to our{' '}
        <a href="/privacy" className="text-primary underline">Privacy Policy</a>.
      </p>
      <div className="flex gap-2">
        <Button variant="hero" size="sm" onClick={accept}>I Agree</Button>
        <Button variant="ghost" size="sm" onClick={accept}>Dismiss</Button>
      </div>
    </div>
  );
}
