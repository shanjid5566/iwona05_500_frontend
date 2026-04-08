import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, ShieldCheck, CreditCard, Gift, Scale, Gavel } from 'lucide-react';

/**
 * Subscription Agreement Page - Legal policy document
 * Updated terms and conditions for Travel in a Click membership
 */
const SubscriptionAgreement = () => {
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
              Travel in a Click - Subscription Agreement
            </h1>
            <p className="text-green-100 text-lg font-medium">Effective Date: 15/03/2026</p>
          </div>

          <div className="p-8 sm:p-12 lg:p-14 space-y-8">
            <div className="rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4">
              <p className="text-amber-900 font-bold uppercase text-sm tracking-wide">
                Please read this agreement carefully before subscribing.
              </p>
            </div>

            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Welcome to Travel in a Click (&quot;Travel in a Click&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). This Subscription Agreement
                (&quot;Agreement&quot;) sets out the terms under which we offer access to our members-only travel subscription,
                including exclusive travel guides, curated travel deals, monthly giveaways, and related services available
                through www.travelinaclick.ie (the &quot;Site&quot;).
              </p>
              <p>
                By subscribing, accessing, or using the Travel in a Click membership (&quot;Membership&quot;), you confirm that you
                agree to this Agreement. If you do not accept these terms, do not subscribe or use the Membership.
              </p>
            </div>

            <div className="rounded-2xl border border-green-200 bg-green-50/80 p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Sections</h2>
              <ol className="grid gap-2 text-gray-700 sm:grid-cols-2">
                <li>1. User Eligibility and Account Registration</li>
                <li>2. Subscription Terms and Payments</li>
                <li>3. Giveaways and Gift Memberships</li>
                <li>4. Copyright and Content Use</li>
                <li>5. Member Conduct and Usage Restrictions</li>
                <li>6. Giveaways and Promotions</li>
                <li>7. Limitation of Liability</li>
                <li>8. Data Use and Privacy</li>
                <li>9. Modifications to Service or Terms</li>
                <li>10. Governing Law</li>
                <li>11. Contact Information</li>
              </ol>
            </div>

            <section className={sectionStyle}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-green-700" />
                1. User Eligibility and Account Registration
              </h2>

              <h3 className="text-lg font-bold text-gray-900 mb-2">Eligibility</h3>
              <ul className="list-disc pl-6 mb-5 text-gray-700 space-y-1">
                <li>Membership is available only to individuals aged 18 years or older.</li>
                <li>Membership is open to residents in areas where our service is available.</li>
              </ul>

              <h3 className="text-lg font-bold text-gray-900 mb-2">Account Registration</h3>
              <ul className="list-disc pl-6 mb-5 text-gray-700 space-y-1">
                <li>Users must register with accurate personal information (email, name, etc.).</li>
                <li>Users must create a secure password and maintain confidentiality.</li>
                <li>
                  You are responsible for all activity under your account. Notify us immediately if you suspect
                  unauthorized access.
                </li>
              </ul>

              <h3 className="text-lg font-bold text-gray-900 mb-2">Notices</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>We may contact you via email linked to your account or via announcements on the Site.</li>
                <li>You agree to keep your contact details up to date.</li>
              </ul>
            </section>

            <section className={sectionStyle}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-green-700" />
                2. Subscription Terms and Payments
              </h2>

              <h3 className="text-lg font-bold text-gray-900 mb-2">Annual Membership and Renewal</h3>
              <ul className="list-disc pl-6 mb-5 text-gray-700 space-y-1">
                <li>Membership costs EUR 9.99 per year, billed automatically on a recurring annual basis.</li>
                <li>Subscriptions renew automatically unless canceled before the renewal date.</li>
                <li>
                  You authorize us to charge your chosen payment method at the beginning of each renewal cycle.
                </li>
              </ul>

              <h3 className="text-lg font-bold text-gray-900 mb-2">Price Changes</h3>
              <ul className="list-disc pl-6 mb-5 text-gray-700 space-y-1">
                <li>Any subscription price changes will be communicated at least 30 days before taking effect.</li>
                <li>If you do not wish to continue at the new price, you must cancel before renewal.</li>
              </ul>

              <h3 className="text-lg font-bold text-gray-900 mb-2">Cancellation and Refunds</h3>
              <ul className="list-disc pl-6 mb-5 text-gray-700 space-y-1">
                <li>You may cancel at any time by emailing info@travelinaclick.ie.</li>
                <li>Cancellation takes effect at the end of the current billing period. No refunds are issued for unused portions.</li>
                <li>
                  By accessing digital content immediately upon signup, you waive your right to the 14-day statutory
                  withdrawal period under EU law.
                </li>
              </ul>

              <h3 className="text-lg font-bold text-gray-900 mb-2">Payment Details</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>You must maintain valid payment information.</li>
                <li>Failed payments may lead to suspension or cancellation of Membership.</li>
              </ul>
            </section>

            <section className={sectionStyle}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Gift className="w-6 h-6 text-green-700" />
                3. Giveaways and Gift Memberships
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Participation in giveaways is at your own risk. Travel in a Click is not responsible for delays,
                cancellations, or issues with airlines, hotels, or other third-party providers. Prizes are non-transferable
                and cannot be exchanged for cash. Winners are responsible for all travel documentation, visas, insurance,
                and other requirements.
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Subscribers may purchase a Gift Membership for another individual.</li>
                <li>Gift Memberships are valid for one year from activation.</li>
                <li>The recipient is responsible for activating the membership.</li>
                <li>Gift Memberships cannot be exchanged for cash, refunded, or extended.</li>
                <li>Travel in a Click is not responsible if the recipient does not activate the Gift Membership.</li>
              </ul>
            </section>

            <section className={sectionStyle}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Copyright and Content Use</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                All content, including travel guides, logos, images, designs, and downloadable materials, is the
                intellectual property of Travel in a Click.
              </p>
              <p className="text-gray-700 mb-2 leading-relaxed">Members may access content for personal use only. You may not:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
                <li>Reproduce, distribute, or publicly share content without permission.</li>
                <li>Use content for commercial purposes.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Any unauthorized use may result in account termination and potential legal action.
              </p>
            </section>

            <section className={sectionStyle}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Member Conduct and Usage Restrictions</h2>
              <p className="text-gray-700 mb-2 leading-relaxed">By subscribing, you agree not to:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
                <li>Misrepresent your identity or affiliation.</li>
                <li>Share access with others or impersonate another person.</li>
                <li>Attempt to access accounts or data that do not belong to you.</li>
                <li>Interfere with the operation, security, or availability of the Site.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Violation may result in immediate suspension or cancellation of Membership without refund.
              </p>
            </section>

            <section className={sectionStyle}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Giveaways and Promotions</h2>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Eligibility and Entry</h3>
              <ul className="list-disc pl-6 mb-5 text-gray-700 space-y-1">
                <li>Monthly giveaways are open only to active subscribers aged 18 or older.</li>
                <li>Participation is subject to any rules posted at the time of the giveaway.</li>
              </ul>

              <h3 className="text-lg font-bold text-gray-900 mb-2">Winner Selection and Notification</h3>
              <ul className="list-disc pl-6 mb-5 text-gray-700 space-y-1">
                <li>
                  Winners will be selected according to the stated rules and notified via email and posted on our social
                  media pages.
                </li>
                <li>Travel in a Click may modify or cancel giveaways at any time without prior notice.</li>
              </ul>

              <h3 className="text-lg font-bold text-gray-900 mb-2">Disclaimers</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>
                  Travel in a Click is not responsible for any delays, cancellations, or issues with third-party providers
                  (airlines, hotels, etc.).
                </li>
                <li>Prizes are non-transferable and cannot be exchanged for cash.</li>
                <li>
                  Winners are responsible for obtaining all necessary travel documents, insurance, and complying with
                  any regulations.
                </li>
              </ul>
            </section>

            <section className={sectionStyle}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Scale className="w-6 h-6 text-green-700" />
                7. Limitation of Liability
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Travel in a Click and its owner provides travel information and access to deals but does not book or
                manage travel.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                You acknowledge that all travel bookings are made directly with third-party providers, and we are not
                responsible for the quality, safety, or suitability of these services.
              </p>
              <p className="text-gray-700 mb-2 leading-relaxed">
                Travel in a Click and its owner is not liable for any loss, damage, delay, injury, or costs arising from:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
                <li>Travel booked through third parties.</li>
                <li>Participation in giveaways.</li>
                <li>Technical issues with the Site.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                To the maximum extent permitted by law, our total liability for any claim shall not exceed the amount paid
                by you for the Membership in the 12 months preceding the claim. We are not liable for indirect,
                incidental, or consequential damages.
              </p>
            </section>

            <section className={sectionStyle}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data Use and Privacy</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Personal data is collected and processed in accordance with our Privacy Policy.</li>
                <li>Data may be used to provide Membership services, send offers, and administer giveaways.</li>
                <li>We may disclose personal data to comply with law or protect rights and property.</li>
              </ul>
            </section>

            <section className={sectionStyle}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Modifications to Service or Terms</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>We may modify or discontinue any part of the Membership, including features or pricing.</li>
                <li>Significant changes will be communicated in advance where required by law.</li>
              </ul>
            </section>

            <section className={sectionStyle}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Gavel className="w-6 h-6 text-green-700" />
                10. Governing Law
              </h2>
              <p className="text-gray-700 mb-3 leading-relaxed">
                This Agreement is governed by the laws of the Republic of Ireland.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Any disputes arising under this Agreement will be subject to the exclusive jurisdiction of Irish courts,
                unless otherwise protected by applicable consumer law.
              </p>
            </section>

            <section className={sectionStyle}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Information</h2>
              <p className="text-gray-700 mb-5 leading-relaxed">For questions or concerns:</p>
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

export default SubscriptionAgreement;
