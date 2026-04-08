import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Shield,
  BookOpen,
  Tag,
  Gift,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { useUser } from '../../../../context/context.hooks';

const SIDEBAR_LINKS = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, section: 'Main' },
  { label: 'Members', path: '/admin/members', icon: Users, section: 'Main' },
  { label: 'User Roles', path: '/admin/user-roles', icon: Shield, section: 'Main' },
  { label: 'Travel Guides', path: '/admin/travel-guides', icon: BookOpen, section: 'Content' },
  { label: 'Travel Deals', path: '/admin/travel-deals', icon: Tag, section: 'Content' },
  { label: 'Giveaways', path: '/admin/giveaways', icon: Gift, section: 'Content' },
  { label: 'Settings', path: '/admin/settings', icon: Settings, section: 'System' },
];

/**
 * Admin Sidebar - Navigation menu for admin dashboard
 * Features: Responsive, slide-in mobile menu, section groups
 */
const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useUser();

  const isActiveLink = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const groupedLinks = SIDEBAR_LINKS.reduce((acc, link) => {
    if (!acc[link.section]) {
      acc[link.section] = [];
    }
    acc[link.section].push(link);
    return acc;
  }, {});

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:flex lg:w-64 lg:flex-col bg-slate-900 text-white z-50">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-800">
            <img
              src="/logo/logo.webp"
              alt="Logo"
              className="w-10 h-10 object-contain"
            />
            <div>
              <h1 className="text-lg font-bold text-white">Admin Dashboard</h1>
              <p className="text-xs text-gray-400">Travel in a Click</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
            {Object.entries(groupedLinks).map(([section, links]) => (
              <div key={section}>
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {section}
                </p>
                <ul className="space-y-1">
                  {links.map((link) => {
                    const Icon = link.icon;
                    const active = isActiveLink(link.path);
                    return (
                      <li key={link.path}>
                        <Link
                          to={link.path}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-colors duration-150 ${
                            active
                              ? 'bg-slate-800 text-white'
                              : 'text-gray-300 hover:bg-slate-800/50 hover:text-white'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* Logout */}
          <div className="border-t border-slate-800 p-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-bold text-gray-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-white z-50 lg:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <img
                    src="/logo/logo.webp"
                    alt="Logo"
                    className="w-8 h-8 object-contain"
                  />
                  <div>
                    <h1 className="text-base font-bold">Admin Dashboard</h1>
                    <p className="text-xs text-gray-400">Travel in a Click</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
                {Object.entries(groupedLinks).map(([section, links]) => (
                  <div key={section}>
                    <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      {section}
                    </p>
                    <ul className="space-y-1">
                      {links.map((link) => {
                        const Icon = link.icon;
                        const active = isActiveLink(link.path);
                        return (
                          <li key={link.path}>
                            <Link
                              to={link.path}
                              onClick={onClose}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-colors duration-150 ${
                                active
                                  ? 'bg-slate-800 text-white'
                                  : 'text-gray-300 hover:bg-slate-800/50 hover:text-white'
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                              {link.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </nav>

              {/* Logout */}
              <div className="border-t border-slate-800 p-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-bold text-gray-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;
