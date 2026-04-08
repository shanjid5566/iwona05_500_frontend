import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import { Menu } from 'lucide-react';
import { useUser } from '../../../context/context.hooks';

/**
 * Admin Layout - Main wrapper for admin pages
 * Features: Persistent sidebar, responsive mobile menu, header with breadcrumbs
 * Uses URL query parameters for sidebar state to support browser back button
 */
const AdminLayout = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useUser();

  // Read sidebar state from URL
  const isSidebarOpen = searchParams.get('sidebar') === 'open';

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  const toggleSidebar = () => {
    if (isSidebarOpen) {
      searchParams.delete('sidebar');
      setSearchParams(searchParams, { replace: true });
    } else {
      searchParams.set('sidebar', 'open');
      setSearchParams(searchParams);
    }
  };

  const closeSidebar = () => {
    searchParams.delete('sidebar');
    setSearchParams(searchParams, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Main Content Area */}
      <div className="min-h-screen lg:ml-64">
        {/* Header - Only visible on mobile */}
        <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;