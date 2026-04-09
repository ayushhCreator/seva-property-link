import { FileText, Search, ArrowRightLeft, Home, Users, Scale } from 'lucide-react';

export interface ServiceInfo {
  slug: string;
  name: string;
  nameHi: string;
  icon: typeof FileText;
  shortDesc: string;
  fullDesc: string;
  benefits: string[];
  deliverables: string[];
  sla: string;
  startingPrice: string;
  completedCount: string;
  fields: ServiceField[];
}

export interface ServiceField {
  name: string;
  label: string;
  placeholder: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea';
  required?: boolean;
  options?: string[];
}

export const services: ServiceInfo[] = [
  {
    slug: 'khatiyan',
    name: 'Khatiyan Nikalna',
    nameHi: 'खतियान निकालना',
    icon: FileText,
    shortDesc: 'Get certified Khatiyan copies of your land records from government offices.',
    fullDesc: 'BhumiSeva provides fast, reliable Khatiyan extraction services. We handle the entire process — from filing to delivery — so you get your certified land record documents without any hassle.',
    benefits: ['Certified government copies', 'Fast turnaround (3-5 days)', 'No need to visit offices', 'Expert verification included'],
    deliverables: ['Certified Khatiyan Copy', 'Land Record Summary', 'Verification Report'],
    sla: '3-5 Business Days',
    startingPrice: '₹500',
    completedCount: '1200+',
    fields: [
      { name: 'state', label: 'State', placeholder: 'e.g. Bihar', type: 'text', required: true },
      { name: 'district', label: 'District', placeholder: 'e.g. Patna', type: 'text', required: true },
      { name: 'khesra_plot_no', label: 'Khesra / Plot Number', placeholder: 'Enter Khesra or Plot number', type: 'text', required: true },
    ],
  },
  {
    slug: 'deed-search',
    name: 'Certified Deed Copy',
    nameHi: 'प्रमाणित दस्तावेज',
    icon: Search,
    shortDesc: 'Search and obtain certified copies of registered deeds from Sub-Registrar offices.',
    fullDesc: 'We locate and procure certified deed copies from any Sub-Registrar office in Patna, Kolkata, or Mumbai. Whether it\'s a sale deed, gift deed, or partition deed — we handle it all.',
    benefits: ['Search across multiple offices', 'Authenticated copies', 'Legal validity guaranteed', 'Pan-India coverage'],
    deliverables: ['Certified Deed Copy', 'Registration Details', 'Chain of Title Summary'],
    sla: '5-7 Business Days',
    startingPrice: '₹800',
    completedCount: '800+',
    fields: [
      { name: 'registration_number', label: 'Registration Number', placeholder: 'Enter deed registration number', type: 'text', required: true },
      { name: 'office_city', label: 'Registrar Office City', placeholder: 'Select city', type: 'select', options: ['Patna', 'Kolkata', 'Mumbai'], required: true },
      { name: 'copy_type', label: 'Copy Type Needed', placeholder: 'Select type', type: 'select', options: ['Sale Deed', 'Gift Deed', 'Partition Deed', 'Lease Deed', 'Other'], required: true },
    ],
  },
  {
    slug: 'mutation',
    name: 'Dakhil Kharij (Mutation)',
    nameHi: 'दाखिल खारिज',
    icon: ArrowRightLeft,
    shortDesc: 'Transfer land ownership records through the mutation (Dakhil Kharij) process.',
    fullDesc: 'Mutation / Dakhil Kharij is essential to update land ownership records. Our experts handle the full application, follow-up, and delivery so your records reflect the correct ownership.',
    benefits: ['End-to-end processing', 'Government liaison included', 'Status tracking', 'Document preparation'],
    deliverables: ['Mutation Certificate', 'Updated Khatiyan', 'Process Completion Report'],
    sla: '7-15 Business Days',
    startingPrice: '₹1,500',
    completedCount: '500+',
    fields: [
      { name: 'khatiyan_number', label: 'Current Khatiyan Number', placeholder: 'Enter current Khatiyan number', type: 'text', required: true },
      { name: 'owner_details', label: 'Owner Details', placeholder: 'Enter current and new owner details', type: 'textarea', required: true },
    ],
  },
  {
    slug: 'rent-agreement',
    name: 'Rent Agreement',
    nameHi: 'किराया अनुबंध',
    icon: Home,
    shortDesc: 'Get legally valid rent agreements drafted and registered.',
    fullDesc: 'We draft legally compliant rent agreements with all necessary clauses. Our service includes e-stamping, notarization, and optional registration at the Sub-Registrar office.',
    benefits: ['Legally compliant drafting', 'E-stamp included', 'Doorstep service', 'Both Hindi & English'],
    deliverables: ['Drafted Rent Agreement', 'E-Stamp Paper', 'Notarized Copy'],
    sla: '2-3 Business Days',
    startingPrice: '₹700',
    completedCount: '2000+',
    fields: [
      { name: 'landlord_name', label: 'Landlord Name', placeholder: 'Aapka Naam (Makan Malik)', type: 'text', required: true },
      { name: 'tenant_name', label: 'Tenant Name', placeholder: 'Kirayedar ka Naam', type: 'text', required: true },
      { name: 'rent_start_date', label: 'Rent Start Date', placeholder: '', type: 'date', required: true },
      { name: 'rent_end_date', label: 'Rent End Date', placeholder: '', type: 'date', required: true },
    ],
  },
  {
    slug: 'partition',
    name: 'Partition Deed',
    nameHi: 'बँटवारा',
    icon: Users,
    shortDesc: 'Legal partition of jointly-owned property among co-owners.',
    fullDesc: 'Our partition deed service helps families and co-owners divide joint property legally. We handle documentation, valuation coordination, and registration.',
    benefits: ['Expert legal drafting', 'Fair division assistance', 'Registration support', 'Dispute-free process'],
    deliverables: ['Partition Deed', 'Property Valuation Summary', 'Registration Receipt'],
    sla: '10-15 Business Days',
    startingPrice: '₹2,000',
    completedCount: '300+',
    fields: [
      { name: 'property_details', label: 'Property Details', placeholder: 'Property address, area, etc.', type: 'textarea', required: true },
      { name: 'co_owners_count', label: 'Number of Co-Owners', placeholder: 'e.g. 3', type: 'number', required: true },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceInfo | undefined {
  return services.find(s => s.slug === slug);
}

export const cities = [
  {
    slug: 'patna',
    name: 'Patna',
    state: 'Bihar',
    tagline: 'Trusted Property Documentation Services in Patna',
    description: 'BhumiSeva is Patna\'s leading property documentation service. From Khatiyan extraction to Rent Agreements, we handle all your land record needs across Bihar.',
    address: 'Sector 5, Boring Road, Patna, Bihar - 800001',
    phone: '+91 74640 26177',
    testimonial: { name: 'Ajeet Kumar', text: 'BhumiSeva ne meri Khatiyan sirf 3 din mein nikal di. Bahut fast service!', rating: 5 },
    keywords: 'property services Patna, Khatiyan Patna, land records Bihar, Dakhil Kharij Patna',
  },
];

export function getCityBySlug(slug: string) {
  return cities.find(c => c.slug === slug);
}
