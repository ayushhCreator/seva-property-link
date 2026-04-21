import { useEffect, useRef } from 'react';

interface AdSlotProps {
  slot?: string;
  format?: string;
  className?: string;
}

/**
 * Reusable Google AdSense ad slot.
 * Set VITE_ADSENSE_CLIENT (e.g. ca-pub-xxxxxxxxxxxxxxxx) once approved.
 * Until then renders nothing in production and a placeholder in dev.
 */
export default function AdSlot({ slot = '0000000000', format = 'auto', className = '' }: AdSlotProps) {
  const ref = useRef<HTMLModElement>(null);
  const client = import.meta.env.VITE_ADSENSE_CLIENT as string | undefined;

  useEffect(() => {
    if (!client) return;
    try {
      // @ts-expect-error - adsbygoogle is injected by AdSense script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* noop */
    }
  }, [client]);

  if (!client) {
    if (import.meta.env.DEV) {
      return (
        <div
          className={`my-6 flex h-24 items-center justify-center rounded-md border border-dashed border-muted-foreground/40 bg-muted/30 text-xs text-muted-foreground ${className}`}
        >
          Ad slot (AdSense not yet approved)
        </div>
      );
    }
    return null;
  }

  return (
    <ins
      ref={ref}
      className={`adsbygoogle block ${className}`}
      style={{ display: 'block' }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}