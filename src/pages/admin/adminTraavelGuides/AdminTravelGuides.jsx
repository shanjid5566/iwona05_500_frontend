import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Edit2, Trash2 } from 'lucide-react';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import DynamicTravelGuideForm from '../adminGiveaways/components/DynamicTravelGuideForm';
import Pagination from '../../../components/common/Pagination';
import { toast } from 'react-toastify';
import { travelGuideService } from '../../../services/api.services';
import Spinner from '../../../components/common/Spinner';

const ITEMS_PER_PAGE = 10;

const DEFAULT_SECTIONS = {
  airportTransport: { mainTitle: '', items: [] },
  thingsToDo: { mainTitle: '', items: [] },
  whereToEat: { mainTitle: '', items: [] },
  proTips: { mainTitle: '', items: [] },
};

const SECTION_LABEL_TO_ID = {
  'Airport Transport': 'airportTransport',
  'Things to Do': 'thingsToDo',
  'Where to Eat': 'whereToEat',
  'Pro Tips': 'proTips',
};

const mapGuideForTable = (guide) => ({
  id: guide.id,
  title: guide.title,
  description: guide.description,
  category: guide.category,
  layout: guide.layout || '-',
  created: guide.createdAt
    ? new Date(guide.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '-',
  location: guide.location,
  readTime: guide.readTime,
  image: guide.heroImage || '',
  author: guide.author || 'Admin',
  content: guide.content || [],
});

const mapGuideToFormInitial = (guide) => {
  const sections = Object.fromEntries(
    Object.entries(DEFAULT_SECTIONS).map(([key, value]) => [key, { ...value, items: [...value.items] }])
  );
  (guide.content || []).forEach((section) => {
    const key = SECTION_LABEL_TO_ID[section.tabName] || null;
    if (!key) return;

    sections[key] = {
      mainTitle: section.mainTitle || '',
      items: (section.sections || []).map((item, index) => ({
        id: `${key}-${index}-${Date.now()}`,
        heading: item.subHeading || '',
        description: item.description || '',
      })),
    };
  });

  return {
    id: guide.id,
    title: guide.title || '',
    description: guide.description || '',
    location: guide.location || '',
    category: guide.category ? guide.category.toLowerCase() : 'adventure',
    readTime: guide.readTime || '',
    image: guide.heroImage || '',
    sections,
  };
};

const AdminTravelGuides = () => {
  // Hooks
  const navigate = useNavigate();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [guides, setGuides] = useState([]);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGuide, setIsLoadingGuide] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingGuide, setDeletingGuide] = useState(null);
  const [editingGuide, setEditingGuide] = useState(null);

  // Pagination
  const totalPages = pagination.totalPages || 1;
  const currentGuides = guides;

  // Reset to first page when search changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchGuides = async () => {
    try {
      setIsLoading(true);
      const response = await travelGuideService.getGuides({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchQuery,
        sortBy: 'title',
        sortOrder: 'asc',
      });

      const list = response?.data?.guides || [];
      const meta = response?.data?.pagination || {};

      setGuides(list.map(mapGuideForTable));
      setPagination(meta);
    } catch (error) {
      console.error('Failed to fetch travel guides', error);
      const message = error?.response?.data?.message || error?.message || 'Failed to fetch travel guides';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchQuery]);

  // Handle create guide
  const handleCreateGuide = () => {
    setEditingGuide(null);
    setIsCreateModalOpen(true);
  };

  // Handle save guide (from dynamic form)
  const handleSaveGuide = async (guideData) => {
    if (editingGuide) {
      try {
        await travelGuideService.updateGuide(editingGuide.id, guideData);
        toast.success('Travel guide updated successfully!');
        handleCloseModal();
        fetchGuides();
        return;
      } catch (error) {
        console.error('Failed to update guide', error);
        const message = error?.response?.data?.message || error?.message || 'Failed to update guide';
        toast.error(message);
        throw error;
      }
    }

    try {
      const response = await travelGuideService.createGuide(guideData);
      const createdGuide = response?.data?.guide || response?.guide || {};

      const newGuide = mapGuideForTable(createdGuide.title ? createdGuide : guideData);

      setGuides(prev => [newGuide, ...prev]);
      toast.success('Travel guide created successfully!');
      handleCloseModal();
      fetchGuides();
    } catch (error) {
      console.error('Failed to create guide', error);
      const message = error?.response?.data?.message || error?.message || 'Failed to create guide';
      toast.error(message);
      throw error;
    }
  };

  // Handle close modal
  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingGuide(null);
  };

  // Handle view guide
  const handleView = (guide) => {
    navigate(`/travel-guides/${guide.id}`);
  };

  // Handle edit guide
  const handleEdit = async (guide) => {
    setIsLoadingGuide(true);
    try {
      const response = await travelGuideService.getGuideById(guide.id);
      const fullGuide = response?.data?.guide || guide;
      setEditingGuide(mapGuideToFormInitial(fullGuide));
      setIsCreateModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch guide', error);
      const message = error?.response?.data?.message || error?.message || 'Failed to fetch guide details';
      toast.error(message);
    } finally {
      setIsLoadingGuide(false);
    }
  };

  // Handle delete guide
  const handleDelete = (guide) => {
    setDeletingGuide(guide);
    setIsDeleteModalOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!deletingGuide) return;
    try {
      await travelGuideService.deleteGuide(deletingGuide.id);
      toast.success('Travel guide deleted successfully');
      fetchGuides();
    } catch (error) {
      console.error('Failed to delete guide', error);
      const message = error?.response?.data?.message || error?.message || 'Failed to delete guide';
      toast.error(message);
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingGuide(null);
    }
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeletingGuide(null);
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isCreateModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCreateModalOpen]);

  if ((isLoading || isLoadingGuide) && guides.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Travel Guides Management</h1>
        <button
          onClick={handleCreateGuide}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-olive text-white rounded-lg hover:bg-opacity-90 transition-colors font-bold self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" />
          Create New Guide
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search travel guides..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent outline-none"
        />
      </div>

      {/* Table and Pagination Container */}
      <div className="space-y-0">
        {/* Desktop/Tablet Table View */}
        <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-base font-semibold text-gray-700 uppercase tracking-wider w-[400px]">
                  Title
                </th>
                <th className="text-left py-3 px-4 text-base font-semibold text-gray-700 uppercase tracking-wider w-[150px]">
                  Category
                </th>
                <th className="text-left py-3 px-4 text-base font-semibold text-gray-700 uppercase tracking-wider w-[150px]">
                  Read Time
                </th>
                <th className="text-left py-3 px-4 text-base font-semibold text-gray-700 uppercase tracking-wider w-[150px]">
                  Created
                </th>
                <th className="text-right py-3 px-4 text-base font-semibold text-gray-700 uppercase tracking-wider w-[150px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentGuides.map((guide) => (
                <tr key={guide.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 w-[400px]">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-gray-900 mb-1 break-words">{guide.title}</div>
                      <div className="text-sm text-gray-600 line-clamp-2 break-words">{guide.description}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4 w-[150px]">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-olive/10 text-olive rounded">
                      {guide.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 w-[150px]">
                    <div className="text-sm text-gray-700">{guide.readTime || '-'}</div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-700 w-[150px]">{guide.created}</td>
                  <td className="py-4 px-4 w-[150px]">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleView(guide)}
                        className="p-2 text-olive hover:bg-olive/10 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(guide)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(guide)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {currentGuides.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No travel guides found</p>
            </div>
          )}
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
          {currentGuides.map((guide) => (
            <div key={guide.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              {/* Title and Description */}
              <div className="mb-3">
                <h3 className="font-semibold text-gray-900 mb-1">{guide.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{guide.description}</p>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Category</div>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-olive/10 text-olive rounded">
                    {guide.category}
                  </span>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Read Time</div>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                    {guide.readTime || '-'}
                  </span>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Author</div>
                  <div className="text-sm font-medium text-gray-900">{guide.author}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Created</div>
                  <div className="text-sm font-medium text-gray-900">{guide.created}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleView(guide)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-olive border border-olive rounded-lg hover:bg-olive/10 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() => handleEdit(guide)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(guide)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}

        {currentGuides.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No travel guides found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={pagination.total || guides.length}
        itemsPerPage={ITEMS_PER_PAGE}
        itemLabel="guides"
        />
      </div> {/* End Table and Pagination Container */}

      {/* Dynamic Travel Guide Form Modal */}
      <DynamicTravelGuideForm
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveGuide}
        initialData={editingGuide}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen && !!deletingGuide}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Travel Guide"
        message="Are you sure you want to delete this travel guide? This action cannot be undone."
        confirmText="Delete Guide"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      >
        {deletingGuide && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-sm font-medium text-gray-700 min-w-[60px]">Title:</span>
              <span className="text-sm text-gray-900 font-semibold">{deletingGuide.title}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-sm font-medium text-gray-700 min-w-[60px]">Location:</span>
              <span className="text-sm text-gray-900">{deletingGuide.location}</span>
            </div>
          </div>
        )}
      </ConfirmationModal>
    </div>
  );
};

export default AdminTravelGuides;
