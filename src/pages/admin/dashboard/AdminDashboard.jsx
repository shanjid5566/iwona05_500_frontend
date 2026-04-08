import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Tag, Gift, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../../../context/context.hooks';
import { adminService } from '../../../services/api.services';
import { toast } from 'react-toastify';

/**
 * Admin Dashboard Overview
 * Features: Stats cards, recent sign-ups, quick actions
 */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useUser();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await adminService.getDashboard();
        if (response.success) {
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.role === 'admin') {
      fetchDashboardData();
    }
  }, [isAuthenticated, user]);

  // Calculate days since joining
  const getDaysAgo = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get initials from name
  const getInitials = (fullName) => {
    const names = fullName.trim().split(' ');
    if (names.length >= 2) {
      return names[0][0] + names[names.length - 1][0];
    }
    return names[0][0];
  };

  // Stats configuration
  const stats = [
    {
      label: 'TOTAL MEMBERS',
      value: dashboardData?.totalMembers || 0,
      changeType: 'positive',
      icon: Users,
      iconBg: 'bg-olive/10',
      iconColor: 'text-olive',
    },
    {
      label: 'ACTIVE DEALS',
      value: dashboardData?.activeDeals || 0,
      change: 'Updated just now',
      changeType: 'neutral',
      icon: Tag,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      label: 'CURRENT GIVEAWAYS',
      value: dashboardData?.currentGiveaways || 0,
      change: 'View active giveaways',
      changeType: 'link',
      icon: Gift,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      linkTo: '/admin/giveaways',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    {stat.label}
                  </p>
                  <h3 className="text-4xl font-bold text-gray-900">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${stat.iconBg}`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
              {stat.changeType === 'link' ? (
                <Link
                  to={stat.linkTo}
                  className="text-sm text-olive hover:text-olive/80 font-medium flex items-center gap-1"
                >
                  {stat.change}
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              ) : (
                <p
                  className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-gray-600'
                  }`}
                >
                  {stat.change}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Recent Sign-ups */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Sign-ups</h2>
          <Link
            to="/admin/members"
            className="text-sm text-olive hover:text-olive/80 font-medium"
          >
            View all members →
          </Link>
        </div>

        <div className="space-y-4">
          {dashboardData?.recentSignups?.length > 0 ? (
            dashboardData.recentSignups.map((signup) => (
              <div
                key={signup.id}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-olive flex items-center justify-center text-white font-semibold shrink-0">
                  {getInitials(signup.fullName)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-gray-900 truncate">{signup.fullName}</p>
                  <p className="text-sm text-gray-500">Joined {getDaysAgo(signup.createdAt)} days ago</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No recent signups</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
