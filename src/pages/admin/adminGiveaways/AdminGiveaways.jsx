import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Edit2, Trash2, Users, Upload, Star } from 'lucide-react';
import { toast } from 'react-toastify';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import Pagination from '../../../components/common/Pagination';
import Spinner from '../../../components/common/Spinner';
import { giveawaysService } from '../../../services/api.services';

const ITEMS_PER_PAGE = 6;

const AdminGiveaways = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Giveaways');
  const [currentPage, setCurrentPage] = useState(1);
  const [giveaways, setGiveaways] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingGiveaway, setDeletingGiveaway] = useState(null);
  const [editingGiveaway, setEditingGiveaway] = useState(null);
  const [isEntriesModalOpen, setIsEntriesModalOpen] = useState(false);
  const [viewingGiveaway, setViewingGiveaway] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalGiveaways, setTotalGiveaways] = useState(0);
  const [entries, setEntries] = useState([]);
  const [entriesLoading, setEntriesLoading] = useState(false);

  // Form state for new giveaway
  const [newGiveaway, setNewGiveaway] = useState({
    title: '',
    description: '',
    status: 'Draft',
    startDate: '',
    endDate: '',
    image: '',
    monthlyActive: false
  });

  // Image upload state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState(false);

  // Fetch giveaways from API
  const fetchGiveaways = useCallback(async () => {
    try {
      setLoading(true);
      const statusMap = {
        'All Giveaways': '',
        'Active': 'ACTIVE',
        'Upcoming': 'UPCOMING',
        'Draft': 'DRAFT',
        'Expired': 'EXPIRED',
      };

      const response = await giveawaysService.getAllGiveaways({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchQuery,
        status: statusMap[statusFilter] || '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      if (response.success) {
        // Map API response to component state format
        const mappedGiveaways = response.data.giveaways.map(g => ({
          id: g.id,
          title: g.title,
          description: g.description,
          status: g.status,
          monthlyActive: g.isMonthlyActive,
          startDate: g.startDate.split('T')[0],
          endDate: g.endDate.split('T')[0],
          image: g.giveawayImage || '',
          entries: g._count?.entries || 0,
        }));
        setGiveaways(mappedGiveaways);
        setTotalPages(response.data.pagination.totalPages);
        setTotalGiveaways(response.data.pagination.total);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch giveaways');
      console.error('Error fetching giveaways:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, statusFilter]);

  // Fetch giveaway entries
  const fetchEntries = async (giveawayId) => {
    try {
      setEntriesLoading(true);
      const response = await giveawaysService.getGiveawayEntries(giveawayId, {
        page: 1,
        limit: 50,
      });

      if (response.success) {
        // Map entries to component format
        const mappedEntries = response.data.entries.map(e => ({
          id: e.id,
          name: e.user.fullName,
          email: e.user.email,
          enteredDate: e.enteredAt.split('T')[0],
        }));
        setEntries(mappedEntries);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch entries');
      console.error('Error fetching entries:', error);
    } finally {
      setEntriesLoading(false);
    }
  };

  // Fetch giveaways on mount and when filters change
  useEffect(() => {
    fetchGiveaways();
  }, [fetchGiveaways]);

  // Display current giveaways
  const currentGiveaways = giveaways;

  // Reset to page 1 when filters change
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewGiveaway(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPG, PNG, GIF, or WebP)');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setNewGiveaway(prev => ({
          ...prev,
          image: reader.result // Store the data URL temporarily
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageError(false);
    setNewGiveaway(prev => ({
      ...prev,
      image: ''
    }));
  };

  const handleCreateGiveaway = () => {
    setIsCreateModalOpen(true);
  };

  const handleSaveGiveaway = async () => {
    try {
      const giveawayData = {
        title: newGiveaway.title,
        description: newGiveaway.description,
        status: newGiveaway.status.toUpperCase(),
        startDate: newGiveaway.startDate,
        endDate: newGiveaway.endDate,
        isMonthlyActive: newGiveaway.monthlyActive,
        giveawayImageFile: imageFile,
      };

      if (editingGiveaway) {
        // Update existing giveaway
        const response = await giveawaysService.updateGiveaway(editingGiveaway.id, giveawayData);
        if (response.success) {
          toast.success('Giveaway updated successfully');
          fetchGiveaways();
        }
      } else {
        // Create new giveaway
        const response = await giveawaysService.createGiveaway(giveawayData);
        if (response.success) {
          toast.success('Giveaway created successfully');
          fetchGiveaways();
        }
      }
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${editingGiveaway ? 'update' : 'create'} giveaway`);
      console.error('Error saving giveaway:', error);
    }
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingGiveaway(null);
    setImageFile(null);
    setImagePreview(null);
    setImageError(false);
    setNewGiveaway({
      title: '',
      description: '',
      status: 'Draft',
      startDate: '',
      endDate: '',
      image: '',
      monthlyActive: false
    });
  };

  const handleEdit = (giveaway) => {
    setEditingGiveaway(giveaway);
    setNewGiveaway({
      title: giveaway.title,
      description: giveaway.description,
      status: giveaway.status,
      startDate: giveaway.startDate,
      endDate: giveaway.endDate,
      image: giveaway.image,
      monthlyActive: giveaway.monthlyActive
    });
    setImagePreview(giveaway.image); // Set preview for existing image
    setIsCreateModalOpen(true);
  };

  const handleViewEntries = async (giveaway) => {
    setViewingGiveaway(giveaway);
    setIsEntriesModalOpen(true);
    await fetchEntries(giveaway.id);
  };

  const handleCloseEntriesModal = () => {
    setIsEntriesModalOpen(false);
    setViewingGiveaway(null);
  };

  const handleDelete = (giveaway) => {
    setDeletingGiveaway(giveaway);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingGiveaway) {
      try {
        const response = await giveawaysService.deleteGiveaway(deletingGiveaway.id);
        if (response.success) {
          toast.success('Giveaway deleted successfully');
          fetchGiveaways();
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete giveaway');
        console.error('Error deleting giveaway:', error);
      }
    }
    setIsDeleteModalOpen(false);
    setDeletingGiveaway(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeletingGiveaway(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  const getStatusColor = (status) => {
    const upperStatus = status.toUpperCase();
    switch (upperStatus) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'EXPIRED':
        return 'bg-red-100 text-red-800';
      case 'UPCOMING':
        return 'bg-blue-100 text-blue-800';
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Giveaways Management</h1>
        <button
          onClick={handleCreateGiveaway}
          className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors"
          style={{ backgroundColor: '#7a7d5a' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6a6d4a'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7a7d5a'}
        >
          <Plus className="w-4 h-4" />
          Create New Giveaway
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search giveaways..."
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
          <option>All Giveaways</option>
          <option>Active</option>
          <option>Upcoming</option>
          <option>Past</option>
        </select>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Spinner />
        </div>
      )}

      {/* Table and Pagination Container */}
      {!loading && (
      <div className="space-y-0">
        {/* Desktop/Tablet Table View */}
        <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider w-[350px]">
                Giveaway
              </th>
              <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider w-[120px]">
                Status
              </th>
              <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider w-[180px]">
                Monthly Active
              </th>
              <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider w-[140px]">
                Start Date
              </th>
              <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider w-[140px]">
                End Date
              </th>
              <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider w-[100px]">
                Entries
              </th>
              <th className="px-6 py-3 text-right text-base font-medium text-gray-500 uppercase tracking-wider w-[150px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentGiveaways.map((giveaway) => (
              <tr key={giveaway.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 w-[350px]">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 break-words">{giveaway.title}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap w-[120px]">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(giveaway.status)}`}>
                    {giveaway.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-[180px]">
                  {giveaway.monthlyActive && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <Star className="w-3 h-3 fill-current" />
                      Monthly Active
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-[140px]">
                  {formatDate(giveaway.startDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-[140px]">
                  {formatDate(giveaway.endDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap w-[100px]">
                  <button
                    onClick={() => handleViewEntries(giveaway)}
                    className="inline-flex items-center gap-1.5 text-olive hover:text-olive/80 transition-colors font-medium"
                    title="View Entries"
                  >
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{giveaway.entries}</span>
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium w-[150px]">
                  <button
                    onClick={() => handleEdit(giveaway)}
                    className="text-gray-600 hover:text-olive transition-colors mr-2 p-1 rounded hover:bg-gray-100"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(giveaway)}
                    className="text-red-600 hover:text-red-700 transition-colors p-1 rounded hover:bg-red-50"
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
        {currentGiveaways.map((giveaway) => (
          <div key={giveaway.id} className="bg-white rounded-lg shadow p-4 space-y-3">
            {/* Giveaway Info */}
            <div className="flex items-start gap-3">
              <img 
                src={giveaway.image} 
                alt={giveaway.title}
                className="w-16 h-16 rounded object-cover shrink-0"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/64';
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-base font-medium text-gray-900">{giveaway.title}</div>
                <div className="flex gap-2 mt-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(giveaway.status)}`}>
                    {giveaway.status}
                  </span>
                  {giveaway.monthlyActive && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <Star className="w-3 h-3 fill-current" />
                      Monthly
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase">Start Date</div>
                <div className="text-sm text-gray-900 mt-1">{formatDate(giveaway.startDate)}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase">End Date</div>
                <div className="text-sm text-gray-900 mt-1">{formatDate(giveaway.endDate)}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase">Entries</div>
                <div className="text-sm text-gray-900 mt-1">{giveaway.entries}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t border-gray-200">
              <button
                onClick={() => handleEdit(giveaway)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleViewEntries(giveaway)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-olive/10 text-olive rounded-lg hover:bg-olive/20 transition-colors text-sm"
              >
                <Users className="w-4 h-4" />
                Entries
              </button>
              <button
                onClick={() => handleDelete(giveaway)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
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
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={totalGiveaways}
        itemsPerPage={ITEMS_PER_PAGE}
        itemLabel="giveaways"
        />
      </div>
      )}

      {/* No Results */}
      {currentGiveaways.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No giveaways found</p>
        </div>
      )}

      {/* Create Giveaway Modal */}
      {isCreateModalOpen && (
        <div 
          className="fixed inset-0 bg-black/70 bg-opacity-50 z-50 flex items-center justify-center p-4"
          data-lenis-prevent
          onClick={handleCloseModal}
          style={{ 
            overscrollBehavior: 'contain',
            scrollBehavior: 'smooth'
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-scroll"
            data-lenis-prevent
            onClick={(e) => e.stopPropagation()}
            style={{ 
              overscrollBehavior: 'contain',
              WebkitOverflowScrolling: 'touch',
              scrollBehavior: 'smooth'
            }}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-semibold text-gray-900">{editingGiveaway ? 'Edit Giveaway' : 'Create New Giveaway'}</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newGiveaway.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Win a Trip to Paris"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={newGiveaway.description}
                    onChange={handleInputChange}
                    placeholder="Describe the giveaway..."
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent resize-none"
                    required
                  />
                </div>

                {/* Giveaway Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giveaway Image
                  </label>
                  {!imagePreview ? (
                    <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer block">
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Click to upload image</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF, WebP up to 5MB</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  ) : imageError ? (
                    <div className="border-2 border-red-300 rounded-lg bg-red-50 p-6 flex flex-col items-center justify-center gap-3 min-h-[200px]">
                      <div className="text-red-600">
                        <Upload className="w-10 h-10 mx-auto opacity-50" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-red-600 mt-1">The image URL is broken or inaccessible</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="mt-2 inline-flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Image
                      </button>
                    </div>
                  ) : (
                    <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                        onLoad={() => setImageError(false)}
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg hover:shadow-xl"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={newGiveaway.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent bg-white"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>

                {/* Start Date and End Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      name="startDate"
                      value={newGiveaway.startDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      name="endDate"
                      value={newGiveaway.endDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Monthly Active Checkbox */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="monthlyActive"
                      checked={newGiveaway.monthlyActive}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-olive border-gray-300 rounded focus:ring-olive"
                    />
                    <span className="text-sm font-medium text-gray-700">Mark as Monthly Active</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveGiveaway}
                className="px-6 py-2 text-white rounded-lg transition-colors"
                style={{ backgroundColor: '#7a7d5a' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6a6d4a'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7a7d5a'}
              >
                {editingGiveaway ? 'Update Giveaway' : 'Create Giveaway'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Entries Modal */}
      {isEntriesModalOpen && viewingGiveaway && (
        <div 
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          data-lenis-prevent
          onClick={handleCloseEntriesModal}
          style={{ 
            overscrollBehavior: 'contain',
            scrollBehavior: 'smooth'
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            data-lenis-prevent
            onClick={(e) => e.stopPropagation()}
            style={{ 
              overscrollBehavior: 'contain',
              WebkitOverflowScrolling: 'touch',
              scrollBehavior: 'smooth'
            }}
          >
            {/* Modal Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Entries for &quot;{viewingGiveaway.title}&quot;
              </h2>
              <button
                onClick={handleCloseEntriesModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            {/* Modal Body */}
            <div 
              className="flex-1 overflow-y-scroll p-6"
              data-lenis-prevent
              style={{ 
                overscrollBehavior: 'contain',
                WebkitOverflowScrolling: 'touch',
                scrollBehavior: 'smooth'
              }}
            >
              {entriesLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Spinner />
                </div>
              ) : entries.length > 0 ? (
                <div className="space-y-3">
                  {entries.map((entry) => {
                    return (
                      <div 
                        key={entry.id} 
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div>
                          <div className="font-medium text-gray-900">{entry.name}</div>
                          <div className="text-sm text-gray-500">{entry.email}</div>
                        </div>
                        <div className="text-sm text-gray-500">
                          Entered {new Date(entry.enteredDate).toLocaleDateString('en-US', {
                            month: 'numeric',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No entries yet</p>
                  <p className="text-gray-400 text-sm mt-2">
                    This giveaway hasn&apos;t received any entries yet.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Total Entries: <span className="font-semibold text-gray-900">
                  {entries.length}
                </span>
              </div>
              <button
                onClick={handleCloseEntriesModal}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen && !!deletingGiveaway}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Giveaway"
        message="Are you sure you want to delete this giveaway? This action cannot be undone and will remove all associated entries."
        confirmText="Delete Giveaway"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      >
        {deletingGiveaway && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-sm font-medium text-gray-700 min-w-16">Title:</span>
              <span className="text-sm text-gray-900 font-semibold">{deletingGiveaway.title}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-sm font-medium text-gray-700 min-w-16">Status:</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(deletingGiveaway.status)}`}>
                {deletingGiveaway.status}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-sm font-medium text-gray-700 min-w-16">Entries:</span>
              <span className="text-sm text-gray-900">{deletingGiveaway.entries}</span>
            </div>
          </div>
        )}
      </ConfirmationModal>
    </div>
  );
};

export default AdminGiveaways;
