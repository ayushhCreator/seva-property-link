// Analytics placeholders — fill in when IDs are ready.
// Usage:
//   1. Replace TODO values below with your real GA4 Measurement ID and Meta Pixel ID.
//   2. initAnalytics() is called once from main.tsx; the snippets are injected in <head>.
//   3. trackEvent('lead_submit', {...}) reports a custom event to both providers.

export const GA4_MEASUREMENT_ID = "G-XXXXXXXXXX"; // TODO: replace with real GA4 ID
export const META_PIXEL_ID = "XXXXXXXXXXXXXXX"; // TODO: replace with real Meta Pixel ID

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

export function initAnalytics() {
  if (typeof window === "undefined") return;

  // Google Analytics (GA4)
  if (GA4_MEASUREMENT_ID && !GA4_MEASUREMENT_ID.includes("XXX")) {
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer!.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA4_MEASUREMENT_ID);
  }

  // Meta Pixel
  if (META_PIXEL_ID && !META_PIXEL_ID.includes("XXX")) {
    /* eslint-disable */
    (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    /* eslint-enable */
    window.fbq?.("init", META_PIXEL_ID);
    window.fbq?.("track", "PageView");
  }
}

export function trackEvent(name: string, params: Record<string, any> = {}) {
  try {
    window.gtag?.("event", name, params);
    window.fbq?.("trackCustom", name, params);
  } catch {}
}
