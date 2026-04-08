import { useState, useEffect, useCallback } from "react";
import {
  Search,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from 'react-toastify';
import Pagination from "../../../components/common/Pagination";
import Spinner from '../../../components/common/Spinner';
import { adminService } from '../../../services/api.services';

const ITEMS_PER_PAGE = 6;

const AdminUserRoles = () => {
  // State
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  });
  const [updatingUserId, setUpdatingUserId] = useState(null);

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await adminService.getAllUsers({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchQuery,
        status: 'ACTIVE',
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });

      if (response.success) {
        setUsers(response.data.users);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery]);

  // Fetch users when filters change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  // Reset to first page when search changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Loading state
  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Spinner />
      </div>
    );
  }

  // Handle Make Admin
  const handleMakeAdmin = async (user) => {
    try {
      setUpdatingUserId(user.id);
      
      const response = await adminService.updateUser(user.id, {
        role: 'ADMIN'
      });
      
      if (response.success) {
        toast.success(`${user.email} is now an admin`);
        // Refresh the users list
        fetchUsers();
      }
    } catch (error) {
      console.error('Error making user admin:', error);
      toast.error(error.response?.data?.message || 'Failed to update user role');
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Handle Remove Admin
  const handleRemoveAdmin = async (user) => {
    try {
      setUpdatingUserId(user.id);
      
      const response = await adminService.updateUser(user.id, {
        role: 'USER'
      });
      
      if (response.success) {
        toast.success(`${user.email} is now a regular user`);
        // Refresh the users list
        fetchUsers();
      }
    } catch (error) {
      console.error('Error removing admin role:', error);
      toast.error(error.response?.data?.message || 'Failed to update user role');
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <div className="">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          User Management
        </h1>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by email..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent outline-none"
        />
      </div>

      {/* Table and Pagination Container */}
      <div className="space-y-0">
        {/* Desktop/Tablet Table View */}
        <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-base font-semibold text-gray-700 uppercase tracking-wider">
                    User Email
                  </th>
                  <th className="text-left py-3 px-4 text-base font-semibold text-gray-700 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="text-left py-3 px-4 text-base font-semibold text-gray-700 uppercase tracking-wider">
                    Admin Status
                  </th>
                  <th className="text-right py-3 px-4 text-base font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.email}
                        </div>
                        <div className="text-xs text-gray-500">{user.id}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">{formatDate(user.createdAt)}</td>
                    <td className="py-4 px-4">
                      {user.role === 'ADMIN' ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">Admin</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-500">
                          <XCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">User</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      {user.role === 'ADMIN' ? (
                        <button
                          onClick={() => handleRemoveAdmin(user)}
                          disabled={updatingUserId === user.id}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {updatingUserId === user.id ? 'Updating...' : 'Remove Admin'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleMakeAdmin(user)}
                          disabled={updatingUserId === user.id}
                          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {updatingUserId === user.id ? 'Updating...' : 'Make Admin'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No users found</p>
              </div>
            )}
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                {/* Email and ID */}
                <div className="mb-3">
                  <div className="font-medium text-gray-900 break-all">
                    {user.email}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{user.id}</div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Joined</div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatDate(user.createdAt)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">
                      Admin Status
                    </div>
                    {user.role === 'ADMIN' ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Admin</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-gray-500">
                        <XCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">User</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                {user.role === 'ADMIN' ? (
                  <button
                    onClick={() => handleRemoveAdmin(user)}
                    disabled={updatingUserId === user.id}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updatingUserId === user.id ? 'Updating...' : 'Remove Admin'}
                  </button>
                ) : (
                  <button
                    onClick={() => handleMakeAdmin(user)}
                    disabled={updatingUserId === user.id}
                    className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updatingUserId === user.id ? 'Updating...' : 'Make Admin'}
                  </button>
                )}
              </div>
            ))}

            {users.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500">No users found</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            totalItems={pagination.total}
            itemsPerPage={ITEMS_PER_PAGE}
            itemLabel="users"
          />
        </div> {/* End Table and Pagination Container */}
      </div>
    );
  };

export default AdminUserRoles;
