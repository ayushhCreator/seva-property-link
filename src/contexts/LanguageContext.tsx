import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Lang = 'en' | 'hi';

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Lang, string>> = {
  // Nav
  'nav.home': { en: 'Home', hi: 'होम' },
  'nav.services': { en: 'Services', hi: 'सेवाएं' },
  'nav.pricing': { en: 'Pricing', hi: 'मूल्य' },
  'nav.blog': { en: 'Blog', hi: 'ब्लॉग' },
  'nav.about': { en: 'About', hi: 'हमारे बारे में' },
  'nav.contact': { en: 'Contact', hi: 'संपर्क' },
  'nav.whatsapp': { en: 'Chat Now', hi: 'Chat Now' },

  // Khatian page
  'khatian.title': { en: 'Khatian Nikalna Service', hi: 'खतियान निकालने की सेवा' },
  'khatian.subtitle': {
    en: 'Get certified Khatiyan copies of your land records — fast, online, hassle-free.',
    hi: 'अपनी ज़मीन का प्रमाणित खतियान — तेज़, ऑनलाइन, बिना झंझट।',
  },
  'khatian.startingFrom': { en: 'Starting From', hi: 'शुरुआती कीमत' },
  'khatian.delivery': { en: 'Delivery', hi: 'डिलीवरी' },
  'khatian.completed': { en: 'Completed', hi: 'पूरे किए' },
  'khatian.benefits': { en: 'Benefits', hi: 'फायदे' },
  'khatian.deliverables': { en: "What You'll Get", hi: 'आपको क्या मिलेगा' },
  'khatian.formTitle': { en: 'Apply for Khatiyan', hi: 'खतियान के लिए आवेदन करें' },

  // Form steps
  'step.basic': { en: 'Basic Info', hi: 'मूल जानकारी' },
  'step.location': { en: 'Location', hi: 'स्थान' },
  'step.property': { en: 'Property', hi: 'संपत्ति' },
  'step.confirm': { en: 'Confirm', hi: 'पुष्टि' },
  'step.of': { en: 'Step {n} of 4', hi: 'चरण {n} / 4' },

  // Form fields
  'field.name': { en: 'Full Name', hi: 'पूरा नाम' },
  'field.name.ph': { en: 'Aapka pura naam', hi: 'अपना पूरा नाम लिखें' },
  'field.phone': { en: 'Mobile Number', hi: 'मोबाइल नंबर' },
  'field.phone.ph': { en: '10-digit mobile number', hi: '10 अंकों का मोबाइल नंबर' },
  'field.district': { en: 'District', hi: 'ज़िला' },
  'field.district.ph': { en: 'Select your district', hi: 'अपना ज़िला चुनें' },
  'field.block': { en: 'Block', hi: 'ब्लॉक' },
  'field.block.ph': { en: 'Block ka naam', hi: 'ब्लॉक का नाम' },
  'field.thana': { en: 'Thana', hi: 'थाना' },
  'field.thana.ph': { en: 'Thana ka naam', hi: 'थाना का नाम' },
  'field.mouza': { en: 'Mouza', hi: 'मौज़ा' },
  'field.mouza.ph': { en: 'Mouza / village name', hi: 'मौज़ा / गाँव का नाम' },
  'field.khatiyanNo': { en: 'Khatiyan Number (optional)', hi: 'खतियान नंबर (वैकल्पिक)' },
  'field.khatiyanNo.ph': { en: 'Agar pata ho to', hi: 'अगर पता हो तो' },
  'field.ownerName': { en: 'Owner Name (as per record)', hi: 'मालिक का नाम (रिकॉर्ड के अनुसार)' },
  'field.ownerName.ph': { en: 'Zameen malik ka naam', hi: 'ज़मीन मालिक का नाम' },
  'field.consent': {
    en: 'I agree to be contacted on WhatsApp/phone regarding this enquiry.',
    hi: 'मैं इस पूछताछ के संबंध में व्हाट्सएप/फोन पर संपर्क के लिए सहमत हूँ।',
  },

  // Buttons / messages
  'btn.next': { en: 'Next', hi: 'आगे' },
  'btn.back': { en: 'Back', hi: 'पीछे' },
  'btn.submit': { en: 'Submit & Open WhatsApp', hi: 'सबमिट करें और व्हाट्सएप खोलें' },
  'btn.submitting': { en: 'Submitting…', hi: 'सबमिट हो रहा है…' },
  'msg.required': { en: 'Please fill all required fields', hi: 'कृपया सभी आवश्यक फ़ील्ड भरें' },
  'msg.invalidPhone': { en: 'Enter a valid 10-digit mobile number', hi: 'मान्य 10 अंकों का मोबाइल नंबर दर्ज करें' },
  'msg.consent': { en: 'Please accept the consent to continue', hi: 'जारी रखने के लिए सहमति दें' },
  'msg.success': { en: 'Submitted! Opening WhatsApp…', hi: 'सबमिट हो गया! व्हाट्सएप खुल रहा है…' },
  'msg.error': { en: 'Something went wrong. Please try again.', hi: 'कुछ गड़बड़ हुई। पुनः प्रयास करें।' },
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'en';
    return (localStorage.getItem('bhumiseva_lang') as Lang) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('bhumiseva_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);
  const t = (key: string) => translations[key]?.[lang] ?? key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

export const BIHAR_DISTRICTS = [
  'Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur',
  'Buxar', 'Darbhanga', 'East Champaran', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad',
  'Kaimur', 'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura', 'Madhubani',
  'Munger', 'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia', 'Rohtas', 'Saharsa',
  'Samastipur', 'Saran', 'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul',
  'Vaishali', 'West Champaran',
];