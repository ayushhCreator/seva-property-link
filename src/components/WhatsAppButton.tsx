import WhatsAppIcon from './icons/WhatsAppIcon';

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/917464026177?text=Hi%20BhumiSeva%2C%20I%20need%20help%20with%20property%20documents."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-primary-foreground shadow-lg transition-transform hover:scale-110 md:bottom-8 md:right-8"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
