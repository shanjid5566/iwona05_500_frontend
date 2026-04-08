import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Shield,
  UserCheck,
  BadgeEuro,
  Link2,
  Gift,
  Scale,
  Handshake,
  Gavel,
} from 'lucide-react';

/**
 * Terms & Conditions Page - Legal terms document
 * Updated terms and conditions for Travel in a Click website usage
 */
const TermsConditions = () => {
  const navigate = useNavigate();

  const sectionStyle =
    'rounded-2xl border border-green-100 bg-white/90 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow';

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dcfce7_0%,#bbf7d0_38%,#f0fdf4_100%)] py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-gray-900 hover:bg-white font-semibold my-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="overflow-hidden rounded-3xl border border-green-200 shadow-2xl bg-white/85 backdrop-blur-sm">
          <div className="bg-linear-to-r from-green-700 via-green-600 to-emerald-600 px-8 py-10 sm:px-12 sm:py-12 text-white">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3">
              Travel in a Click - Terms and Conditions
            </h1>
            <p className="text-green-100 text-lg font-medium">Effective Date: 15/03/2026</p>
          </div>

          <div className="p-8 sm:p-12 lg:p-14 space-y-8">
            <div className="rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4">
              <p className="text-amber-900 font-bold uppercase text-sm tracking-wide">
                Please read these terms carefully before using the site or subscribing.
              </p>
            </div>

            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                These Terms and Conditions (&quot;Terms&quot;) govern your access to and use of www.travelinaclick.ie (the
                &quot;Site&quot;), owned and operated by Travel in a Click (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
              </p>
              <p>
                The Site provides a subscription-based service offering exclusive travel content, personalized deals,
                monthly giveaways, and related services. By accessing or using the Site, subscribing, or participating in
                any service, you agree to these Terms. If you do not agree, you must not use the Site or its services.
              </p>
            </div>

            {/* <div className="rounded-2xl border border-green-200 bg-green-50/80 p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Sections</h2>
              <ol className="grid gap-2 text-gray-700 sm:grid-cols-2">
                <li>1. Intellectual Property</li>
                <li>2. Accounts, Memberships, and Gifting</li>
                <li>3. Subscription Terms and Fees</li>
                <li>4. Third-Party Services and Offers</li>
                <li>5. External Links</li>
                <li>6. Monthly Giveaways</li>
                <li>7. Limitation of Liability</li>
                <li>8. Indemnification</li>
                <li>9. Subscriber Obligations</li>
                <li>10. Governing Law</li>
                <li>11. Severability</li>
                <li>12. Changes to Terms</li>
                <li>13. Contact Information</li>
              </ol>
            </div> */}

            <section className={sectionStyle}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Shield className="w-6 h-6 text-green-700" />
                1. Intellectual Property
              </h2>
              <p className="text-gray-700 mb-3 leading-relaxed">
                All content on the Site, including text, images, logos, graphics, guides, downloadable files, and overall
                design, is the property of Travel in a Click or its licensors.
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>You may use content for personal, non-commercial purposes only.</li>
                <li>Unauthorized copying, distribution, or public sharing of content is strictly prohibited.</li>
              </ul>
            </section>

            <section className={sectionStyle}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <UserCheck className="w-6 h-6 text-green-700" />
                2. Accounts, Memberships, and Gifting
              </h2>

              <h3 className="text-lg font-bold text-gray-900 mb-2">Account Requirements</h3>
              <ul className="list-disc pl-6 mb-5 text-gray-700 space-y-1">
                <li>You must provide accurate, up-to-date information when creating an account.</li>
                <li>Keep your login credentials confidential. You are responsible for all activity under your account.</li>
              </ul>

              <h3 className="text-lg font-bold text-gray-900 mb-2">Membership</h3>
              <ul className="list-disc pl-6 mb-5 text-gray-700 space-y-1">
                <li>Membership costs EUR 9.99 per year and renews automatically unless canceled before the renewal date.</li>
                <li>Cancellation requests must be sent to info@travelinaclick.ie.</li>
                <li>No refunds will be provided for partial periods.</li>
              </ul>

              <h3 className="text-lg font-bold text-gray-900 mb-2">Gift Memberships</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Subscribers may purchase Gift Memberships for others.</li>
                <li>Gift Memberships are valid for one year from activation.</li>
                <li>Recipients are responsible for activating their membership.</li>
                <li>Gift Memberships cannot be exchanged for cash, refunded, or extended.</li>
                <li>Travel in a Click is not responsible if a Gift Membership is not redeemed.</li>
              </ul>
            </section>

            <section className={sectionStyle}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <BadgeEuro className="w-6 h-6 text-green-700" />
                3. Subscription Terms and Fees
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>By subscribing, you agree to pay the annual subscription fee and authorize automatic renewal.</li>
                <li>We may change subscription fees, with notice provided at least 30 days prior to renewal.</li>
                <li>Membership provides access to content and giveaways; we do not book travel on your behalf.</li>
              </ul>
            </section>

            <section className={sectionStyle}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Third-Party Services and Offers</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>We may link to or display offers from third-party providers (airlines, hotels, tour operators, etc.).</li>
                <li>We do not guarantee availability, accuracy, or quality of these offers.</li>
                <li>All transactions with third parties are solely between you and the third party.</li>
                <li>
                  Prices and availability are controlled by third-party providers and may change after publication. We
                  accept no liability for these changes.
                </li>
              </ul>
            </section>

            <section className={sectionStyle}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Link2 className="w-6 h-6 text-green-700" />
                5. External Links
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>The Site may contain links to third-party websites.</li>
                <li>
                  These are provided for convenience only; we do not control or endorse their content, policies, or
                  practices.
                </li>
                <li>You should review their terms and privacy policies before use.</li>
              </ul>
            </section>

            <section className={sectionStyle}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Gift className="w-6 h-6 text-green-700" />
                6. Monthly Giveaways
              </h2>

              <h3 className="text-lg font-bold text-gray-900 mb-2">Eligibility and Participation</h3>
              <ul className="list-disc pl-6 mb-5 text-gray-700 space-y-1">
                <li>Only active subscribers aged 18+ may participate.</li>
                <li>Giveaways may be subject to additional rules posted at the time of the promotion.</li>
              </ul>

              <h3 className="text-lg font-bold text-gray-900 mb-2">Disclaimers</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>
                  Travel in a Click is not responsible for any issues, delays, cancellations, or losses with third-party
                  providers.
                </li>
                <li>Winners must obtain all necessary travel documents, visas, and insurance.</li>
                <li>Prizes are non-transferable and cannot be exchanged for cash unless otherwise stated.</li>
                <li>
                  Participation is at your own risk; you release Travel in a Click from all liability after the prize is
                  issued.
                </li>
              </ul>
            </section>

            <section className={sectionStyle}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Scale className="w-6 h-6 text-green-700" />
                7. Limitation of Liability
              </h2>
              <p className="text-gray-700 mb-2 leading-relaxed">To the maximum extent permitted by law:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>
                  Travel in a Click is not liable for indirect, incidental, special, or consequential damages, including
                  lost profits, data, or opportunity.
                </li>
                <li>We are not responsible for any travel bookings, services, or products offered by third parties.</li>
                <li>
                  Our total liability for any claim relating to the Site or Membership is limited to the amount you paid
                  for Membership in the 12 months preceding the claim.
                </li>
              </ul>
            </section>

            <section className={sectionStyle}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Handshake className="w-6 h-6 text-green-700" />
                8. Indemnification
              </h2>
              <p className="text-gray-700 mb-2 leading-relaxed">
                You agree to indemnify and hold harmless Travel in a Click and its representatives from any claims,
                damages, liabilities, or expenses (including legal fees) arising from:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Your use of the Site or Membership.</li>
                <li>Breach of these Terms.</li>
                <li>Violation of any applicable law.</li>
              </ul>
            </section>

            <section className={sectionStyle}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Subscriber Obligations</h2>
              <p className="text-gray-700 mb-2 leading-relaxed">You must use the Site and Membership lawfully.</p>
              <p className="text-gray-700 mb-2 leading-relaxed">You are solely responsible for:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Ensuring the safety, suitability, and legality of any travel you book.</li>
                <li>Obtaining travel insurance, visas, or other documentation.</li>
                <li>Complying with all laws and regulations for travel and participation in giveaways.</li>
              </ul>
            </section>

            <section className={sectionStyle}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Gavel className="w-6 h-6 text-green-700" />
                10. Governing Law
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>These Terms are governed by the laws of Ireland.</li>
                <li>Any disputes will be subject to the exclusive jurisdiction of the courts of Ireland.</li>
              </ul>
            </section>

            <section className={sectionStyle}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Severability</h2>
              <p className="text-gray-700 leading-relaxed">
                If any provision of these Terms is invalid or unenforceable, the remainder of the Terms remain in full
                effect.
              </p>
            </section>

            <section className={sectionStyle}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to Terms</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>
                  We may update or modify these Terms to reflect changes in services, legal requirements, or business
                  practices.
                </li>
                <li>Updated Terms will be posted on the Site with the effective date.</li>
                <li>Continued use of the Site after changes constitutes acceptance of the revised Terms.</li>
              </ul>
            </section>

            <section className={sectionStyle}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
              <p className="text-gray-700 mb-5 leading-relaxed">
                For questions about these Terms, cancellations, gifting, or giveaways:
              </p>
              <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-2xl p-5 flex items-center gap-3 border border-green-200">
                <Mail className="w-5 h-5 text-green-700" />
                <div className="text-gray-900">
                  <span className="font-semibold">Email: </span>
                  <a href="mailto:info@travelinaclick.ie" className="text-green-700 hover:text-green-800 font-bold">
                    info@travelinaclick.ie
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
