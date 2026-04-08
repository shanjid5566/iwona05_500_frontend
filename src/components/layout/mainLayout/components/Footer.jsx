import { Link } from 'react-router-dom';

/**
 * Footer Component
 * Professional, modern footer with four columns
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Quick Links
  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'Members Club', path: '/members-club' },
    { label: 'Travel Deals', path: '/travel-deals' },
    { label: 'Travel Guides', path: '/travel-guides' },
    { label: 'Sign Up', path: '/signup' },
    { label: 'FAQ', path: '/faq' },
  ];

  // Legal Links
  const legalLinks = [
    { label: 'Subscription Agreement', path: '/subscription-agreement' },
    { label: 'Terms & Conditions', path: '/terms' },
    { label: 'Privacy Policy', path: '/privacy' },
  ];

  return (
    <footer className="bg-[#1e293b] text-white mt-auto">
      <div className="container mx-auto px-6 py-16">
        {/* Main Footer Content - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Travel in a Click</h3>
            <div className="mb-4">
              <img
                src="/logo/logo.webp"
                alt="Travel in a Click logo"
                className="w-16 h-16 object-contain"
              />
            </div>
            <p className="text-base text-gray-300 leading-7">
              A members only travel subscription with monthly giveaways, exclusive guides and personalised offers.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-base text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 ease-out block leading-6 inline-flex items-center group"
                  >
                    <span className="border-b border-transparent group-hover:border-white transition-all duration-300 ease-out">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-4">
              {legalLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-base text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 ease-out block leading-6 inline-flex items-center group"
                  >
                    <span className="border-b border-transparent group-hover:border-white transition-all duration-300 ease-out">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <p className="text-sm text-gray-300 mb-6 leading-7">
              Have questions? Get in touch with us.
            </p>
            <Link
              to="/contact"
              className="inline-block px-6 py-3 bg-white text-[#1e293b] rounded-md text-sm font-bold hover:bg-gray-100 hover:scale-105 transition-all duration-300 ease-out"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          {/* Copyright */}
          <p className="text-sm text-gray-400 text-center">
            © {currentYear} Travel in a Click. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
