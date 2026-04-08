import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../../../../context/context.hooks";

// App name from env (fallback kept)

// ============================================================
// PREVIOUS NAV_LINKS STRUCTURE (COMMENTED FOR EASY ROLLBACK)
// ============================================================
// const NAV_LINKS = [
//   { label: "Home", path: "/" },
//   { label: "Members Club", path: "/members-club" },
//   { label: "Travel Deals", path: "/travel-deals" },
//   { label: "Travel Guides", path: "/travel-guides" },
//   { label: "Giveaways", path: "/giveaways" },
//   { label: "FAQ", path: "/faq" },
//   { label: "Contact", path: "/contact" },
// ];

// ============================================================
// NEW NAV_LINKS STRUCTURE - MEMBERS CLUB WITH DROPDOWN
// ============================================================
const NAV_LINKS = [
  { label: "Home", path: "/" },
  { 
    label: "Members Club", 
    path: "/members-club", 
    hasDropdown: true, 
    children: [
      { label: "Members Giveaway", path: "/giveaways" },
      { label: "Travel Deals", path: "/travel-deals" },
      { label: "Travel Guides", path: "/travel-guides" },
    ]
  },
  { label: "FAQ", path: "/faq" },
  { label: "Contact", path: "/contact" },
];

/**
 * Header Component
 * Responsive navigation with mobile menu
 * Uses URL query parameters for menu state to support browser back button
 */
const Header = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isNarrowScreen, setIsNarrowScreen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useUser();

  // Read menu state from URL
  const isMobileMenuOpen = searchParams.get('menu') === 'open';

  // Get dashboard path based on user role
  const getDashboardPath = () => {
    return user?.role === 'admin' ? '/admin' : '/dashboard';
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    if (isMobileMenuOpen) {
      // Close menu by removing query parameter - triggers back button
      searchParams.delete('menu');
      setSearchParams(searchParams, { replace: true });
    } else {
      // Open menu by adding query parameter - adds to history
      searchParams.set('menu', 'open');
      setSearchParams(searchParams);
    }
  };

  const closeMobileMenu = () => {
    // Close menu by removing query parameter
    searchParams.delete('menu');
    setSearchParams(searchParams, { replace: true });
  };

  // Close mobile menu when route changes (except for query param changes)
  useEffect(() => {
    // Close menu when pathname changes
    return () => {
      if (isMobileMenuOpen) {
        searchParams.delete('menu');
        setSearchParams(searchParams, { replace: true });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // track very narrow screens to adjust panel positioning
  useEffect(() => {
    const check = () => setIsNarrowScreen(window.innerWidth <= 360);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    navigate("/");
  };

  // lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      <div className="w-full bg-[#0B8659] backdrop-blur-md shadow-md">
        {/* bg-white/90 */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-20 py-2">
          {/* Left: Logo */}
          <div className="flex items-center mr-4 shrink-0">
            <Link to="/" className="flex items-center space-x-3 py-1">
              <img
                src="/logo/logo.webp"
                alt="logo"
                className="w-16 h-16 object-contain"
              />
              <span className="text-lg font-semibold text-white">
                TRAVEL IN A CLICK
              </span>
            </Link>
          </div>

          {/* Center: Nav (show on xl and above; mobile behavior active at lg/1024) */}
          <nav className="hidden xl:flex flex-1 justify-center overflow-visible">
            <ul className="flex items-center gap-4">
              {NAV_LINKS.map((link) => (
                <li key={link.path} className="relative group">
                  {!link.hasDropdown ? (
                    <Link
                      to={link.path}
                      className={`px-1 text-base font-medium transition-colors duration-200 ${
                        isActiveLink(link.path)
                          ? "text-white border-b-2 border-white pb-1"
                          : "text-white hover:text-gray-200"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <div className="relative group flex items-center space-x-1 text-base font-medium text-white hover:text-gray-200">
                      <Link
                        to={link.path}
                        className="flex items-center text-white hover:text-gray-200"
                      >
                        {link.label}
                      </Link>
                      <ChevronDown className="w-4 h-4 text-white transform transition-transform duration-150 group-hover:rotate-180 group-hover:text-gray-200" />

                      {/* Simple hover dropdown */}
                      <div className="absolute left-0 top-full mt-1 w-48 translate-x-0 -translate-y-1 bg-green-50 border rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-150 z-50">
                        <ul className="py-1">
                          {link.children.map((child) => (
                            <li key={child.path}>
                              <Link
                                to={child.path}
                                className="block px-4 py-2 text-sm text-green-900 hover:bg-green-100"
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Right: Auth actions (Login or Dashboard + Logout) + Mobile menu button */}
          <div className="ml-auto flex items-center space-x-4">
            <div className="hidden xl:flex items-center space-x-3 text-sm text-white">
              {isAuthenticated ? (
                <>
                  <Link
                    to={getDashboardPath()}
                    className={`px-3 py-2 text-sm font-bold rounded-md transition-colors ${
                      isActiveLink(getDashboardPath())
                        ? 'bg-white text-[#0B8659]'
                        : 'text-white hover:bg-white/20'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 bg-red-600 text-white rounded-md text-sm font-bold hover:bg-red-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center px-6 py-3 bg-white text-[#0B8659] rounded-md text-base font-bold hover:bg-gray-100 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="inline-flex items-center px-6 py-3 bg-[#BD7706] text-white rounded-md text-base font-bold hover:bg-[#A86605] transition-colors animate-breathe"
                  >
                    Join Now
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="xl:hidden">
              <button
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
                className="p-2 rounded-md text-white hover:text-gray-200 focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay (slides from right) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={closeMobileMenu}
            />

            {/* Slide-in panel */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.36 }}
              className={`fixed top-4 bottom-4 ${isNarrowScreen ? "left-2 right-2 w-auto" : "right-4 w-80"} bg-[#e4e7ed] shadow-2xl rounded-lg border border-gray-200 z-50 xl:hidden overflow-hidden`}
            >
              <div className="flex items-center justify-between px-4 h-20 py-2 border-b border-gray-200 bg-[#e4e7ed]">
                <Link to="/" className="flex items-center space-x-2 py-1">
                  <img
                    src="/logo/logo.webp"
                    alt="logo"
                    className="w-12 h-12 object-contain"
                  />
                  <span className="text-sm font-semibold text-[#0B8659]">
                    TRAVEL IN A CLICK
                  </span>
                </Link>
                <button
                  onClick={closeMobileMenu}
                  aria-label="Close menu"
                  className="p-2"
                >
                  <X className="w-6 h-6 text-gray-700" />
                </button>
              </div>

              <div className="px-6 py-6 flex flex-col h-full justify-between">
                {/* Staggered nav links */}
                <motion.ul
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.08,
                        delayChildren: 0.06,
                      },
                    },
                  }}
                  className="space-y-4 overflow-auto flex-grow pb-20"
                >
                  {NAV_LINKS.map((link) => (
                    <motion.li
                      key={link.path}
                      variants={{
                        hidden: { x: 40, opacity: 0 },
                        visible: { x: 0, opacity: 1 },
                      }}
                    >
                      {!link.hasDropdown ? (
                        <Link
                          onClick={closeMobileMenu}
                          to={link.path}
                          className="block text-lg font-medium text-gray-800 hover:text-[#0B8659]"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <div>
                          <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() =>
                              setOpenMobileDropdown(
                                openMobileDropdown === link.path
                                  ? null
                                  : link.path,
                              )
                            }
                          >
                            <Link
                              onClick={closeMobileMenu}
                              to={link.path}
                              className="text-lg font-medium text-gray-800 hover:text-[#0B8659]"
                            >
                              {link.label}
                            </Link>
                            <ChevronDown
                              className={`w-5 h-5 text-gray-700 transform transition-transform ${openMobileDropdown === link.path ? "rotate-180" : ""}`}
                            />
                          </div>
                          {openMobileDropdown === link.path && (
                            <ul className="mt-1 space-y-2 pl-4">
                              {link.children.map((child) => (
                                <li key={child.path}>
                                  <Link
                                    onClick={closeMobileMenu}
                                    to={child.path}
                                    className="block text-base text-gray-700 hover:text-[#0B8659]"
                                  >
                                    {child.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </motion.li>
                  ))}

                  {/* Auth Buttons - Show after navigation links */}
                  {!isAuthenticated ? (
                    <>
                      <motion.li
                        variants={{
                          hidden: { x: 40, opacity: 0 },
                          visible: { x: 0, opacity: 1 },
                        }}
                      >
                        <Link
                          onClick={closeMobileMenu}
                          to="/login"
                          className="block w-full text-center px-4 py-3 bg-[#0B8659] text-white rounded-md text-base font-bold hover:bg-[#0a6f4b]"
                        >
                          Login
                        </Link>
                      </motion.li>
                      <motion.li
                        variants={{
                          hidden: { x: 40, opacity: 0 },
                          visible: { x: 0, opacity: 1 },
                        }}
                      >
                        <Link
                          onClick={closeMobileMenu}
                          to="/signup"
                          className="block w-full text-center px-4 py-3 bg-[#BD7706] text-white rounded-md text-base font-bold hover:bg-[#A86605]"
                        >
                          Join Now
                        </Link>
                      </motion.li>
                    </>
                  ) : (
                    <>
                      <motion.li
                        variants={{
                          hidden: { x: 40, opacity: 0 },
                          visible: { x: 0, opacity: 1 },
                        }}
                      >
                        <Link
                          onClick={closeMobileMenu}
                          to={getDashboardPath()}
                          className={`block w-full text-center px-4 py-3 rounded-md text-base font-bold ${
                            isActiveLink(getDashboardPath())
                              ? 'bg-[#0B8659] text-white'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          Dashboard
                        </Link>
                      </motion.li>
                      <motion.li
                        variants={{
                          hidden: { x: 40, opacity: 0 },
                          visible: { x: 0, opacity: 1 },
                        }}
                      >
                        <button
                          onClick={handleLogout}
                          className="block w-full text-center px-4 py-3 bg-red-600 text-white rounded-md text-base font-bold hover:bg-red-700"
                        >
                          Logout
                        </button>
                      </motion.li>
                    </>
                  )}
                </motion.ul>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
