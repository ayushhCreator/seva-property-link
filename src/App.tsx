import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import CookieConsent from "@/components/CookieConsent";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import ServicesPage from "./pages/ServicesPage";
import ServiceDetail from "./pages/ServiceDetail";
import KhatianService from "./pages/KhatianService";
import CityPage from "./pages/CityPage";
import PaymentPage from "./pages/PaymentPage";
import AboutPage from "./pages/AboutPage";
import PricingFaqPage from "./pages/PricingFaqPage";
import BlogPage from "./pages/BlogPage";
import BlogPost from "./pages/BlogPost";
import ContactPage from "./pages/ContactPage";
import StudioPage from "./pages/StudioPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import NotFound from "./pages/NotFound";
import AdminAuthPage from "./pages/admin/AuthPage";
import AdminLayout from "./components/admin/AdminLayout";
import DashboardHome from "./pages/admin/DashboardHome";
import LeadsPage from "./pages/admin/LeadsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/khatian-nikalna" element={<KhatianService />} />
            <Route path="/services/khatiyan" element={<KhatianService />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/city/:slug" element={<CityPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/pricing" element={<PricingFaqPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/studio/*" element={<StudioPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/admin/login" element={<AdminAuthPage />} />
          <Route path="/admin" element={<AdminLayout><DashboardHome /></AdminLayout>} />
          <Route path="/admin/leads" element={<AdminLayout><LeadsPage /></AdminLayout>} />
          <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <CookieConsent />
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
