import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="container py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-3xl font-bold">Terms & Conditions</h1>
          <p className="mb-4 text-sm text-muted-foreground">Last updated: April 2026</p>

          <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">1. Services</h2>
              <p>BhumiSeva provides property documentation services including but not limited to: Khatiyan extraction, certified deed copies, Dakhil Kharij (mutation), rent agreements, and partition deed services. All services are subject to government office availability and processing timelines.</p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">2. Payment Terms</h2>
              <ul className="list-disc space-y-1 pl-6">
                <li>A 10% advance payment is required to initiate any service</li>
                <li>Remaining balance is due upon document delivery</li>
                <li>Payments are processed securely via Razorpay (UPI, cards, net banking accepted)</li>
                <li>All prices are exclusive of applicable government fees and stamp duty</li>
                <li>GST will be charged as applicable. GSTIN can be provided for B2B invoices</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">3. Delivery & SLA</h2>
              <p>Estimated delivery timelines are provided for each service. These are indicative and may vary based on government office processing speeds. BhumiSeva will keep you informed of any delays.</p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">4. Refund Policy</h2>
              <ul className="list-disc space-y-1 pl-6">
                <li>Full refund if BhumiSeva is unable to procure the requested document due to genuine reasons</li>
                <li>No refund if the document request is invalid or based on incorrect information provided by the client</li>
                <li>Refunds are processed within 7-10 business days to the original payment method</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">5. Client Responsibilities</h2>
              <ul className="list-disc space-y-1 pl-6">
                <li>Provide accurate and complete information in all forms</li>
                <li>Respond to verification calls and messages promptly</li>
                <li>Pay the agreed fees within the specified timeline</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">6. Limitation of Liability</h2>
              <p>BhumiSeva acts as a facilitator for property documentation services. We are not liable for errors in government records, delays caused by government offices, or disputes arising from property ownership matters.</p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">7. GST & Invoicing</h2>
              <p>All invoices will include applicable GST charges. For B2B clients, please provide your GSTIN at the time of booking for proper GST invoicing. BhumiSeva maintains GST compliance as per current Indian tax regulations.</p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">8. Governing Law</h2>
              <p>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Patna, Bihar.</p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">9. Contact</h2>
              <p>For questions about these terms:<br />
                📧 info@bhumiseva.co.in<br />
                📞 +91 74640 26177
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
