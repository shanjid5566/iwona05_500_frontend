import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Plane,
  Hotel,
  Star,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import ConfirmationModal from "../../../components/common/ConfirmationModal";
import Pagination from "../../../components/common/Pagination";
import Spinner from "../../../components/common/Spinner";
import { travelDealsService } from "../../../services/api.services";

const ITEMS_PER_PAGE = 6;

const AdminTravelDeals = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Deals");
  const [currentPage, setCurrentPage] = useState(1);
  const [deals, setDeals] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingDeal, setDeletingDeal] = useState(null);
  const [editingDeal, setEditingDeal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDeals, setTotalDeals] = useState(0);

  // Form state for new deal
  const [newDeal, setNewDeal] = useState({
    title: "",
    description: "",
    destination: "",
    airport: "Dublin",
    price: "",
    discount: "",
    travelStartDate: "",
    travelEndDate: "",
    image: "",
    flightBookingLink: "",
    hotelBookingLink: "",
    isFeatured: false,
  });

  // Image upload state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState(false);

  // Fetch deals from API
  const fetchDeals = async () => {
    try {
      setLoading(true);
      const response = await travelDealsService.getAllDeals({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchQuery,
        status: statusFilter === "All Deals" ? "" : statusFilter.toUpperCase(),
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      if (response.success) {
        setDeals(response.data.deals);
        setTotalPages(response.data.pagination.totalPages);
        setTotalDeals(response.data.pagination.total);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch deals");
      console.error("Error fetching deals:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch deals on mount and when filters change
  useEffect(() => {
    fetchDeals();
  }, [currentPage, searchQuery, statusFilter]);

  // Display counts
  const filteredDeals = deals;
  const currentDeals = deals;

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Toggle featured status
  const handleToggleFeatured = async (deal) => {
    if (togglingId) return;
    try {
      setTogglingId(deal.id);
      const response = await travelDealsService.toggleFeatured(deal.id);
      if (response.success) {
        toast.success(
          response.data.deal.isFeatured
            ? "Deal marked as featured"
            : "Deal unmarked as featured"
        );
        fetchDeals();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to toggle featured status");
      console.error("Error toggling featured:", error);
    } finally {
      setTogglingId(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewDeal((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
        setNewDeal(prev => ({
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
    setNewDeal(prev => ({
      ...prev,
      image: ''
    }));
  };

  const handleCreateDeal = () => {
    setIsCreateModalOpen(true);
  };

  const handleSaveDeal = async () => {
    try {
      setLoading(true);
      
      const dealData = {
        title: newDeal.title,
        description: newDeal.description,
        destination: newDeal.destination,
        airport: newDeal.airport,
        price: parseFloat(newDeal.price) || 0,
        discount: parseInt(newDeal.discount) || 0,
        travelStartDate: newDeal.travelStartDate,
        travelEndDate: newDeal.travelEndDate,
        flightBookingLink: newDeal.flightBookingLink,
        hotelBookingLink: newDeal.hotelBookingLink,
        status: "ACTIVE",
        isFeatured: newDeal.isFeatured,
        dealImageFile: imageFile,
      };

      if (editingDeal) {
        // Update existing deal
        const response = await travelDealsService.updateDeal(editingDeal.id, dealData);
        if (response.success) {
          toast.success("Deal updated successfully");
          fetchDeals(); // Refresh the list
        }
      } else {
        // Create new deal
        const response = await travelDealsService.createDeal(dealData);
        if (response.success) {
          toast.success("Deal created successfully");
          fetchDeals(); // Refresh the list
        }
      }
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save deal");
      console.error("Error saving deal:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingDeal(null);
    setImageFile(null);
    setImagePreview(null);
    setImageError(false);
    setNewDeal({
      title: "",
      description: "",
      destination: "",
      airport: "Dublin",
      price: "",
      discount: "",
      travelStartDate: "",
      travelEndDate: "",
      image: "",
      flightBookingLink: "",
      hotelBookingLink: "",
      isFeatured: false,
    });
  };

  const handleEdit = (deal) => {
    setEditingDeal(deal);
    const startDate = deal.travelStartDate ? new Date(deal.travelStartDate).toISOString().split('T')[0] : '';
    const endDate = deal.travelEndDate ? new Date(deal.travelEndDate).toISOString().split('T')[0] : '';
    
    setNewDeal({
      title: deal.title,
      description: deal.description,
      destination: deal.destination,
      airport: deal.airport,
      price: deal.price.toString(),
      discount: deal.discount.toString(),
      travelStartDate: startDate,
      travelEndDate: endDate,
      image: deal.dealImage || '',
      flightBookingLink: deal.flightBookingLink || "",
      hotelBookingLink: deal.hotelBookingLink || "",
      isFeatured: deal.isFeatured || false,
    });
    // Set image preview if deal has an image
    if (deal.dealImage) {
      setImagePreview(deal.dealImage);
    }
    setIsCreateModalOpen(true);
  };

  const handleDelete = (deal) => {
    setDeletingDeal(deal);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingDeal) {
      try {
        setLoading(true);
        const response = await travelDealsService.deleteDeal(deletingDeal.id);
        if (response.success) {
          toast.success("Deal deleted successfully");
          fetchDeals(); // Refresh the list
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete deal");
        console.error("Error deleting deal:", error);
      } finally {
        setLoading(false);
      }
    }
    setIsDeleteModalOpen(false);
    setDeletingDeal(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeletingDeal(null);
  };

  return (
    <div className="">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Travel Deals Management
        </h1>
        <button
          onClick={handleCreateDeal}
          className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors"
          style={{ backgroundColor: "#7a7d5a" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#6a6d4a")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#7a7d5a")
          }
        >
          <Plus className="w-4 h-4" />
          Add New Deal
        </button>
      </div>
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search deals..."
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
          <option>All Deals</option>
          <option>Featured</option>
          <option>Active</option>
          <option>Expired</option>
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
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider w-[300px]">
                  Deal
                </th>
                <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider w-[120px]">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider w-[180px]">
                  Destination
                </th>
                <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider w-[150px]">
                  Airport
                </th>
                <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider w-[120px]">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-base font-medium text-gray-500 uppercase tracking-wider w-[130px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentDeals.map((deal) => (
                <tr
                  key={deal.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 w-[300px]">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 break-words">
                        {deal.title}
                      </div>
                      {deal.isFeatured && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-[120px]">
                    €{deal.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-[180px]">
                    {deal.destination}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-[150px]">
                    {deal.airport}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap w-[120px]">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        deal.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {deal.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium w-[130px]">
                    <button
                      onClick={() => handleToggleFeatured(deal)}
                      disabled={!!togglingId}
                      className={`${
                        deal.isFeatured
                          ? "text-yellow-500 hover:text-yellow-600"
                          : "text-gray-400 hover:text-yellow-500"
                      } transition-colors mr-3 p-1 rounded hover:bg-yellow-50 disabled:opacity-60 disabled:cursor-not-allowed`}
                      title={deal.isFeatured ? "Unmark as Featured" : "Mark as Featured"}
                    >
                      {togglingId === deal.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Star className={`w-4 h-4 ${deal.isFeatured ? "fill-yellow-500" : ""}`} />
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(deal)}
                      className="text-gray-600 hover:text-olive transition-colors mr-3 p-1 rounded hover:bg-gray-100"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(deal)}
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
          {currentDeals.map((deal) => (
            <div
              key={deal.id}
              className="bg-white rounded-lg shadow p-4 space-y-3"
            >
              {/*  Deal Info */}
              <div className="flex-1 min-w-0">
                <div className="text-base font-medium text-gray-900">
                  {deal.title}
                </div>
                {deal.isFeatured && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                    Featured
                  </span>
                )}
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase">
                    Price
                  </div>
                  <div className="text-base text-gray-900 mt-1">
                    €{deal.price.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase">
                    Status
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                      deal.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {deal.status}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase">
                    Destination
                  </div>
                  <div className="text-sm font-medium text-gray-900 mt-1">
                    {deal.destination}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase">
                    Airport
                  </div>
                  <div className="text-sm font-medium text-gray-900 mt-1">
                    {deal.airport}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-gray-200">
                <button
                  onClick={() => handleToggleFeatured(deal)}
                  disabled={!!togglingId}
                  className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                    deal.isFeatured
                      ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                      : "bg-gray-100 text-gray-400 hover:bg-yellow-50 hover:text-yellow-500"
                  }`}
                  title={deal.isFeatured ? "Unmark as Featured" : "Mark as Featured"}
                >
                  {togglingId === deal.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Star className={`w-4 h-4 ${deal.isFeatured ? "fill-yellow-500" : ""}`} />
                  )}
                </button>
                <button
                  onClick={() => handleEdit(deal)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(deal)}
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
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={totalDeals}
          itemsPerPage={ITEMS_PER_PAGE}
          itemLabel="deals"
        />
      </div>
      )}
      {/* End Table and Pagination Container */}
      {/* No Results */}
      {!loading && currentDeals.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No deals found</p>
        </div>
      )}

      {/* Create Deal Modal */}
      {isCreateModalOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-scroll"
          data-lenis-prevent
          onClick={handleCloseModal}
          style={{ 
            overscrollBehavior: 'contain',
            scrollBehavior: 'smooth'
          }}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-3xl my-8"
            data-lenis-prevent
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingDeal ? "Edit Travel Deal" : "Create New Travel Deal"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            {/* Modal Body */}
            <div 
              className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-scroll"
              data-lenis-prevent
              style={{ 
                overscrollBehavior: 'contain',
                WebkitOverflowScrolling: 'touch',
                scrollBehavior: 'smooth'
              }}
            >
              {/* Row 1: Title, Destination, Airport */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newDeal.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Weekend in Paris"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destination<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="destination"
                    value={newDeal.destination}
                    onChange={handleInputChange}
                    placeholder="e.g., Paris, France"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Airport Category<span className="text-red-500">*</span>
                  </label>
                  <select
                    name="airport"
                    value={newDeal.airport}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent"
                  >
                    <option value="Hotel Deals">Hotel Deals</option>
                    <option value="Dublin">Dublin</option>
                    <option value="Cork">Cork</option>
                    <option value="Shannon">Shannon</option>
                    <option value="Knock">Knock</option>
                    <option value="Kerry">Kerry</option>
                    <option value="Belfast">Belfast</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description<span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={newDeal.description}
                  onChange={handleInputChange}
                  placeholder="Describe the travel deal..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent resize-none"
                />
              </div>

              {/* Row 3: Price and Discount */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={newDeal.price}
                    onChange={handleInputChange}
                    placeholder="e.g., 299.99"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={newDeal.discount}
                    onChange={handleInputChange}
                    placeholder="e.g., 15"
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent"
                  />
                </div>
              </div>

              {/* Row 4: Travel Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Travel Start Date
                  </label>
                  <input
                    type="date"
                    name="travelStartDate"
                    value={newDeal.travelStartDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Travel End Date
                  </label>
                  <input
                    type="date"
                    name="travelEndDate"
                    value={newDeal.travelEndDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent"
                  />
                </div>
              </div>

              {/* Row 5: Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Upload className="w-4 h-4 inline-block mr-1" />
                  Deal Image<span className="text-red-500">*</span>
                </label>
                {!imagePreview ? (
                  <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-olive transition-colors cursor-pointer block">
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Click to upload image
                      </span>
                      <span className="text-xs text-gray-500">
                        PNG, JPG, GIF, WebP up to 5MB
                      </span>
                    </div>
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
                <p className="text-xs text-gray-500 mt-2">
                  Use high-quality landscape images for best results
                </p>
              </div>

              {/* Row 6: Booking Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Plane className="w-4 h-4 inline-block mr-1" />
                    Flight Booking Link
                  </label>
                  <input
                    type="url"
                    name="flightBookingLink"
                    value={newDeal.flightBookingLink}
                    onChange={handleInputChange}
                    placeholder="https://example.com/flight-booking"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Hotel className="w-4 h-4 inline-block mr-1" />
                    Hotel Booking Link
                  </label>
                  <input
                    type="url"
                    name="hotelBookingLink"
                    value={newDeal.hotelBookingLink}
                    onChange={handleInputChange}
                    placeholder="https://example.com/hotel-booking"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent"
                  />
                </div>
              </div>

              {/* Row 7: Featured Deal */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isFeatured"
                  id="isFeatured"
                  checked={newDeal.isFeatured}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-olive border-gray-300 rounded focus:ring-olive"
                />
                <label
                  htmlFor="isFeatured"
                  className="text-sm font-medium text-gray-700"
                >
                  Featured Deal
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 rounded-b-lg">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDeal}
                className="px-4 py-2 text-white rounded-lg transition-colors"
                style={{ backgroundColor: "#7a7d5a" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#6a6d4a")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#7a7d5a")
                }
              >
                {editingDeal ? "Update Deal" : "Create Deal"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen && !!deletingDeal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Travel Deal"
        message="Are you sure you want to delete this travel deal? This action cannot be undone."
        confirmText="Delete Deal"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      >
        {deletingDeal && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-sm font-medium text-gray-700 min-w-20">
                Title:
              </span>
              <span className="text-sm text-gray-900 font-semibold">
                {deletingDeal.title}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-sm font-medium text-gray-700 min-w-20">
                Destination:
              </span>
              <span className="text-sm text-gray-900">
                {deletingDeal.destination}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-sm font-medium text-gray-700 min-w-20">
                Price:
              </span>
              <span className="text-sm text-gray-900">
                €{deletingDeal.price.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </ConfirmationModal>
    </div>
  );
};

export default AdminTravelDeals;
