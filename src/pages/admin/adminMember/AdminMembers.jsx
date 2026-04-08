import { useState, useEffect, useCallback } from 'react';
import { Search, Download, Edit2, Trash2, X } from 'lucide-react';
import { toast } from 'react-toastify';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import Pagination from '../../../components/common/Pagination';
import Spinner from '../../../components/common/Spinner';
import { adminService } from '../../../services/api.services';

const ITEMS_PER_PAGE = 6;

const AdminMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Members');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    homeAirport: ''
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingMember, setDeletingMember] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch members from API
  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      const statusParam = statusFilter === 'All Members' ? '' : statusFilter.toUpperCase();
      
      const response = await adminService.getAllUsers({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchQuery,
        status: statusParam,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });

      if (response.success) {
        // Filter out admin users, only show regular users
        const regularUsers = response.data.users.filter(user => user.role !== 'ADMIN');
        setMembers(regularUsers);
        
        // Update pagination to reflect filtered count
        const filteredPagination = {
          ...response.data.pagination,
          total: regularUsers.length,
          totalPages: Math.ceil(regularUsers.length / ITEMS_PER_PAGE)
        };
        setPagination(filteredPagination);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, statusFilter]);

  // Fetch members when filters change
  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  // Reset to page 1 when filters change
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleExport = async () => {
    try {
      toast.info('Preparing PDF export...');
      const response = await adminService.exportMembersPdf();
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `members-export-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Members exported successfully!');
    } catch (error) {
      console.error('Error exporting members:', error);
      toast.error(error.response?.data?.message || 'Failed to export members');
    }
  };

  const handleEdit = async (member) => {
    try {
      // Fetch fresh user data from API
      const response = await adminService.getUserById(member.id);
      
      if (response.success) {
        const userData = response.data.user;
        setEditingMember(userData);
        setEditFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          homeAirport: userData.homeAirport || ''
        });
        setIsEditModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Failed to load user details');
    }
  };

  const handleEditFormChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveEdit = async () => {
    try {
      setIsSaving(true);
      
      const updateData = {
        firstName: editFormData.firstName,
        lastName: editFormData.lastName,
        homeAirport: editFormData.homeAirport
      };

      const response = await adminService.updateUser(editingMember.id, updateData);
      
      if (response.success) {
        toast.success('Member updated successfully');
        setIsEditModalOpen(false);
        // Refresh the members list
        fetchMembers();
      }
    } catch (error) {
      console.error('Error updating member:', error);
      toast.error(error.response?.data?.message || 'Failed to update member');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingMember(null);
    setEditFormData({
      firstName: '',
      lastName: '',
      email: '',
      homeAirport: ''
    });
  };

  const handleDelete = (member) => {
    setDeletingMember(member);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await adminService.deleteUser(deletingMember.id);
      
      if (response.success) {
        toast.success('Member deleted successfully');
        setIsDeleteModalOpen(false);
        setDeletingMember(null);
        // Refresh the members list
        fetchMembers();
      }
    } catch (error) {
      console.error('Error deleting member:', error);
      toast.error(error.response?.data?.message || 'Failed to delete member');
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeletingMember(null);
  };

  const getInitials = (fullName) => {
    if (!fullName) return '??';
    return fullName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (id) => {
    const colors = [
      'bg-yellow-700',
      'bg-orange-600',
      'bg-olive',
      'bg-green-600',
      'bg-purple-600',
      'bg-pink-600',
      'bg-orange',
    ];
    // Use hash of ID string for consistent colors
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  // Loading state
  if (loading && members.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Members Management</h1>
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
          style={{ backgroundColor: '#7a7d5a' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6a6d4a'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7a7d5a'}
        >
          <Download className="w-4 h-4" />
          Export Members
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent bg-white"
        >
          <option>All Members</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* Table and Pagination Container */}
      <div className="space-y-0">
        {/* Desktop/Tablet Table View */}
        <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider w-[350px]">
                Member
              </th>
              <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider w-[150px]">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider w-[120px]">
                Airport
              </th>
              <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider w-[120px]">
                Status
              </th>
              <th className="px-6 py-3 text-right text-base font-medium text-gray-500 uppercase tracking-wider w-[160px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 w-[350px]">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${getAvatarColor(member.id)} flex items-center justify-center text-white font-semibold text-base flex-shrink-0`}>
                      {getInitials(member.fullName)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 break-words">{member.email}</div>
                      <div className="text-sm text-gray-500 break-words">{member.fullName}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-[150px]">
                  {formatDate(member.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-[120px]">
                  {member.homeAirport || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap w-[120px]">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    member.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium w-[160px]">
                  <button
                    onClick={() => handleEdit(member)}
                    className="text-gray-600 hover:text-olive transition-colors mr-3 p-1 rounded hover:bg-gray-100 cursor-pointer"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(member)}
                    className="text-red-600 hover:text-red-700 transition-colors p-1 rounded hover:bg-red-50 cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
        {members.map((member) => (
          <div key={member.id} className="bg-white rounded-lg shadow p-4 space-y-3">
            {/* Member Info */}
            <div className="flex items-start gap-3">
              <div className={`w-12 h-12 rounded-full ${getAvatarColor(member.id)} flex items-center justify-center text-white font-semibold text-base shrink-0`}>
                {getInitials(member.fullName)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-base font-medium text-gray-900 wrap-break-word">{member.email}</div>
                <div className="text-base text-gray-500">{member.fullName}</div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase">Joined</div>
                <div className="text-base text-gray-900 mt-1">{formatDate(member.createdAt)}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase">Airport</div>
                <div className="text-base text-gray-900 mt-1">{member.homeAirport || 'N/A'}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase">Status</div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                  member.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {member.status}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t border-gray-200">
              <button
                onClick={() => handleEdit(member)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(member)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={pagination.totalPages}
        onPageChange={setCurrentPage}
        totalItems={pagination.total}
        itemsPerPage={ITEMS_PER_PAGE}
        itemLabel="members"
        />
      </div> {/* End Table and Pagination Container */}

      {/* No Results */}
      {members.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No members found</p>
        </div>
      )}

      {/* Edit Member Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/70 bg-opacity-50 transition-opacity"
            onClick={handleCancelEdit}
          ></div>

          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Edit Member</h2>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-4">
                {/* First Name & Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={editFormData.firstName}
                      onChange={(e) => handleEditFormChange('firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={editFormData.lastName}
                      onChange={(e) => handleEditFormChange('lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => handleEditFormChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent bg-gray-50"
                    readOnly
                  />
                </div>

                {/* Preferred Airport */}
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-1">
                    Preferred Airport
                  </label>
                  <input
                    type="text"
                    value={editFormData.homeAirport}
                    onChange={(e) => handleEditFormChange('homeAirport', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent"
                    placeholder="e.g., DUB, LAX, JFK"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#7a7d5a' }}
                  onMouseEnter={(e) => !isSaving && (e.currentTarget.style.backgroundColor = '#6a6d4a')}
                  onMouseLeave={(e) => !isSaving && (e.currentTarget.style.backgroundColor = '#7a7d5a')}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen && !!deletingMember}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Member"
        message="Are you sure you want to delete this member? This action cannot be undone."
        confirmText="Delete Member"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      >
        {deletingMember && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-base font-medium text-gray-700">Name:</span>
              <span className="text-base text-gray-900">{deletingMember.fullName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-medium text-gray-700">Email:</span>
              <span className="text-base text-gray-900">{deletingMember.email}</span>
            </div>
          </div>
        )}
      </ConfirmationModal>
    </div>
  );
};

export default AdminMembers;
