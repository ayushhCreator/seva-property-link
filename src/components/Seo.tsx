import { useEffect } from 'react';

interface SeoProps {
  title: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article';
  keywords?: string;
}

export default function Seo({ title, description, canonical, image, type = 'website', keywords }: SeoProps) {
  useEffect(() => {
    document.title = title.length > 60 ? title.slice(0, 57) + '…' : title;

    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement('meta');
        const [key, val] = selector.replace(/[\[\]"]/g, '').split('=');
        el.setAttribute(key, val);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    if (description) {
      setMeta('meta[name="description"]', 'content', description.slice(0, 160));
      setMeta('meta[property="og:description"]', 'content', description.slice(0, 160));
    }
    if (keywords) {
      setMeta('meta[name="keywords"]', 'content', keywords);
    }
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:type"]', 'content', type);
    if (image) setMeta('meta[property="og:image"]', 'content', image);

    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = canonical || window.location.href;
  }, [title, description, canonical, image, type, keywords]);

  return null;
}
