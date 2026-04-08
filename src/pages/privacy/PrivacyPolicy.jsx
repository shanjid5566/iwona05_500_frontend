import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';

/**
 * Privacy Policy Page - Legal Policy Document
 * Privacy policy for Travel in a Click website
 */
const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-green-200 via-green-100 to-green-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-black hover:text-primary-700 font-bold mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back 
        </button>
        
        {/* Main Content Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 lg:p-16">
          {/* Header */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>

          {/* Introduction */}
          <div className="mb-8 text-gray-700 leading-relaxed">
            <p>
              Travel in a Click ("we", "us", or "our") is committed to safeguarding your privacy. This Privacy Policy
              explains how we collect, use, share, and protect your personal data when you access our website,
              become a member, or use any of our services.
            </p>
          </div>

          {/* Section 1 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              1. Information We Collect
            </h2>

            <h3 className="text-lg font-bold text-gray-900 mb-3">a. Personal Information</h3>
            <p className="text-gray-700 mb-3 leading-relaxed">
              When you interact with our website or become a member, we may collect personal details you provide, such
              as:
            </p>
            <ul className="list-disc ml-6 pl-5 mb-6 text-gray-700 space-y-2">
              <li>Name</li>
              <li>Email address</li>
              <li>Billing address</li>
              <li>Phone number</li>
              <li>Payment information (processed securely by third-party providers)</li>
            </ul>

            <h3 className="text-lg font-bold text-gray-900 mb-3">b. Technical and Usage Data</h3>
            <p className="text-gray-700 mb-3 leading-relaxed">
              We automatically gather data about how you use our site, such as:
            </p>
            <ul className="list-disc ml-6 pl-5 mb-4 text-gray-700 space-y-2">
              <li>IP address</li>
              <li>Device type and browser</li>
              <li>Pages visited and links clicked</li>
              <li>Time and date of access</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              This helps us understand how users interact with our content and services.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700 mb-3 leading-relaxed">
              We may use your personal information for the following purposes:
            </p>
            <ul className="list-disc ml-6 pl-5 text-gray-700 space-y-2">
              <li>To provide access to membership benefits, content, and exclusive offers</li>
              <li>To manage bookings, subscriptions, and account details</li>
              <li>To communicate with you about your membership, services, or support inquiries</li>
              <li>To send updates, promotional offers, and travel-related content (with your consent)</li>
              <li>To enhance and personalize your user experience on our platform</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              3. Sharing Your Information
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We do not sell your personal data. However, we may share your information in the following circumstances:
            </p>
            <ul className="list-disc ml-6 pl-5 mb-4 text-gray-700 space-y-2">
              <li>
                With third-party service providers (such as payment processors or email platforms) who support our
                website and services
              </li>
              <li>When legally required, such as in response to lawful requests from authorities</li>
              <li>
                If necessary to enforce our terms or protect the rights, safety, or property of Travel in a Click or our
                users
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              4. Data Retention
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal data only for as long as necessary to provide our services and for legitimate legal or
              business purposes. When it is no longer needed, we securely delete or anonymize the data.
            </p>
          </section>

          {/* Section 5 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              5. Your Rights
            </h2>
            <p className="text-gray-700 mb-3 leading-relaxed">
              Under applicable data protection laws, including the GDPR, you may have the right to:
            </p>
            <ul className="list-disc ml-6 pl-5 mb-4 text-gray-700 space-y-2">
              <li>Access the personal data we hold about you</li>
              <li>Correct inaccuracies in your data</li>
              <li>Request deletion of your information</li>
              <li>Object to or restrict certain types of data processing</li>
              <li>Withdraw consent for marketing communications at any time</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              You can make a request regarding your data by contacting us at the email below.
            </p>
          </section>

          {/* Section 6 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              6. Security of Your Data
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We use appropriate technical and organizational security measures to protect your data from unauthorized
              access, loss, misuse, or disclosure. However, no online system is 100% secure, and we encourage you to use
              strong passwords and keep your login credentials confidential.
            </p>
          </section>

          {/* Section 7 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              7. Children's Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our website and services are not intended for users under the age of 18. We do not knowingly collect
              personal information from children. If you believe a child has provided us with personal information, please
              contact us immediately so we can remove it.
            </p>
          </section>

          {/* Section 8 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              8. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in the law, our services, or how we
              manage data. When we make changes, we'll update the "Effective Date" at the top and may notify you by
              email or on our website.
            </p>
          </section>

          {/* Section 9 - Contact */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              9. Contact Us
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              If you have any questions about this Privacy Policy or how we handle your data, please reach out to us at:
            </p>

            {/* Contact Box */}
            <div className="bg-blue-50 rounded-2xl p-6 flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary-600" />
              <div>
                <span className="font-semibold text-gray-900">Email: </span>
                <a
                  href="mailto:info@travelinaclick.ie"
                  className="text-primary-600 hover:text-primary-700 font-bold"
                >
                  info@travelinaclick.ie
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
