
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  city TEXT NOT NULL,
  service_type TEXT NOT NULL,
  district TEXT,
  state TEXT,
  khesra_plot_no TEXT,
  registration_number TEXT,
  office_city TEXT,
  copy_type TEXT,
  khatiyan_number TEXT,
  owner_details TEXT,
  landlord_name TEXT,
  tenant_name TEXT,
  rent_start_date DATE,
  rent_end_date DATE,
  property_details TEXT,
  co_owners_count INTEGER,
  message TEXT,
  consent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert leads" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "No public reads" ON public.leads FOR SELECT USING (false);
