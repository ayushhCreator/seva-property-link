import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="container py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-3xl font-bold">Privacy Policy</h1>
          <p className="mb-4 text-sm text-muted-foreground">Last updated: April 2026</p>

          <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">1. Information We Collect</h2>
              <p>When you use BhumiSeva services, we collect:</p>
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li><strong>Personal Information:</strong> Name, phone number, email address, city</li>
                <li><strong>Service Information:</strong> Property details, document types, Khesra/Plot numbers, owner details as required for your specific service</li>
                <li><strong>Usage Data:</strong> Pages visited, time spent, device information</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">2. How We Use Your Information</h2>
              <ul className="list-disc space-y-1 pl-6">
                <li>To process and deliver your requested documentation services</li>
                <li>To communicate with you about your orders and enquiries</li>
                <li>To improve our services and website experience</li>
                <li>To comply with legal and regulatory requirements</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">3. Data Storage & Security</h2>
              <p>Your data is stored securely using industry-standard encryption (SSL/TLS). We use secure cloud-hosted databases with access controls. We retain your data for 5-7 years as required for GST and business records.</p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">4. Data Sharing</h2>
              <p>We do not sell your personal information. We may share data with:</p>
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li>Government offices (as required for document processing)</li>
                <li>Payment processors (Razorpay) for transaction processing</li>
                <li>Analytics providers (for website improvement)</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">5. Cookies</h2>
              <p>We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and understand usage patterns. You can manage cookie preferences through your browser settings.</p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">6. Your Rights</h2>
              <p>You have the right to access, correct, or delete your personal data. Contact us at info@bhumiseva.co.in for any data-related requests.</p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">7. Contact</h2>
              <p>For privacy concerns, reach us at:<br />
                📧 info@bhumiseva.co.in<br />
                📞 +91 74640 26177<br />
                📍 Sector 5, Boring Road, Patna, Bihar - 800001
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
