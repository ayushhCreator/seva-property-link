import { supabase } from '@/integrations/supabase/client';

export interface LeadData {
  name: string;
  phone: string;
  email?: string;
  city: string;
  service_type: string;
  district?: string;
  state?: string;
  khesra_plot_no?: string;
  registration_number?: string;
  office_city?: string;
  copy_type?: string;
  khatiyan_number?: string;
  owner_details?: string;
  landlord_name?: string;
  tenant_name?: string;
  rent_start_date?: string;
  rent_end_date?: string;
  property_details?: string;
  co_owners_count?: number;
  registry_city?: string;
  registry_year?: string;
  area_mohalla?: string;
  message?: string;
  consent: boolean;
}

export async function submitLead(data: LeadData) {
  const { error } = await supabase.from('leads').insert([data as any]);
  if (error) throw error;
}
