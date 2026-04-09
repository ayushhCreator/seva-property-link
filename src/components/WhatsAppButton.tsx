import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/917464026177?text=Hi%20BhumiSeva%2C%20I%20need%20help%20with%20property%20documents."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-whatsapp px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-105 md:bottom-8 md:right-8"
    >
      <MessageCircle className="h-5 w-5" />
      WhatsApp Karo
    </a>
  );
}
