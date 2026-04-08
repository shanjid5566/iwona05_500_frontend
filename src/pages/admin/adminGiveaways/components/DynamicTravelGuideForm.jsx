import { useEffect, useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  X, Plus, Trash2, GripVertical, MapPin, Plane, 
  MapPinned, UtensilsCrossed, Lightbulb, Save, ChevronDown, ChevronUp,
  ChevronLeft, ChevronRight, Upload 
} from 'lucide-react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

/**
 * Dynamic Travel Guide Form Component
 * 
 * Features:
 * - Tab-based section navigation
 * - Dynamic repeater fields for sub-items
 * - Drag & drop reordering
 * - Form validation
 * - Clean JSON output structure
 */

// Section configuration with icons and descriptions
const GUIDE_SECTIONS = [
  {
    id: 'airportTransport',
    label: 'Airport Transport',
    icon: Plane,
    description: 'How to get from the airport to the city',
    placeholder: 'e.g., Taxi, Bus, Metro options and costs'
  },
  {
    id: 'thingsToDo',
    label: 'Things to Do',
    icon: MapPinned,
    description: 'Main attractions and activities',
    placeholder: 'e.g., Sheikh Zayed Grand Mosque, Ferrari World, Desert Safari'
  },
  {
    id: 'whereToEat',
    label: 'Where to Eat',
    icon: UtensilsCrossed,
    description: 'Best restaurants and local food spots',
    placeholder: 'e.g., Li Beirut, Catch, Al Fanar Restaurant'
  },
  {
    id: 'proTips',
    label: 'Pro Tips',
    icon: Lightbulb,
    description: 'Travel tips and local insights',
    placeholder: 'e.g., Best time to visit, dress code, currency tips'
  }
];

const DynamicTravelGuideForm = ({ isOpen, onClose, onSave, initialData = null }) => {
  // Active tab state
  const [activeTab, setActiveTab] = useState('airportTransport');
  
  // Mobile basic info visibility
  const [showBasicInfo, setShowBasicInfo] = useState(false);

  // Basic information state
  const [basicInfo, setBasicInfo] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    location: initialData?.location || '',
    category: initialData?.category || 'adventure',
    readTime: initialData?.readTime || '',
    image: initialData?.image || ''
  });

  // Dynamic sections state - structured for easy backend mapping
  const [sections, setSections] = useState(
    initialData?.sections || {
      airportTransport: { mainTitle: '', items: [] },
      thingsToDo: { mainTitle: '', items: [] },
      whereToEat: { mainTitle: '', items: [] },
      proTips: { mainTitle: '', items: [] }
    }
  );

  // Image upload state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData?.image || null);
  const [imageError, setImageError] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync form state when opening with new initial data
  useEffect(() => {
    if (!isOpen) return;

    setBasicInfo({
      title: initialData?.title || '',
      description: initialData?.description || '',
      location: initialData?.location || '',
      category: initialData?.category || 'adventure',
      readTime: initialData?.readTime || '',
      image: initialData?.image || ''
    });

    const nextSections = initialData?.sections
      ? JSON.parse(JSON.stringify(initialData.sections))
      : {
          airportTransport: { mainTitle: '', items: [] },
          thingsToDo: { mainTitle: '', items: [] },
          whereToEat: { mainTitle: '', items: [] },
          proTips: { mainTitle: '', items: [] }
        };

    setSections(nextSections);

    // Pick first tab that has items, otherwise default to airportTransport
    const firstWithItems = Object.keys(nextSections).find(
      (key) => nextSections[key]?.items?.length > 0
    );
    setActiveTab(firstWithItems || 'airportTransport');

    setImageFile(null);
    setImagePreview(initialData?.image || null);
    setErrors({});
    setShowBasicInfo(false);
  }, [isOpen, initialData]);

  // Navigate to previous/next tab
  const handlePreviousTab = () => {
    const currentIndex = GUIDE_SECTIONS.findIndex(s => s.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(GUIDE_SECTIONS[currentIndex - 1].id);
    }
  };

  const handleNextTab = () => {
    const currentIndex = GUIDE_SECTIONS.findIndex(s => s.id === activeTab);
    if (currentIndex < GUIDE_SECTIONS.length - 1) {
      setActiveTab(GUIDE_SECTIONS[currentIndex + 1].id);
    }
  };

  // Handle basic info changes
  const handleBasicInfoChange = (field, value) => {
    setBasicInfo(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid image file (JPG, PNG, GIF, or WebP)');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setBasicInfo(prev => ({
          ...prev,
          image: reader.result // Store the data URL temporarily
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove uploaded image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageError(false);
    setBasicInfo(prev => ({
      ...prev,
      image: ''
    }));
  };

  // Update main title for a section
  const handleUpdateMainTitle = (sectionId, value) => {
    setSections(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        mainTitle: value
      }
    }));
    // Clear error for this field
    if (errors[`${sectionId}_mainTitle`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${sectionId}_mainTitle`];
        return newErrors;
      });
    }
  };

  // Add new sub-item to a section
  const handleAddSubItem = (sectionId) => {
    setSections(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        items: [
          ...(prev[sectionId]?.items || []),
          {
            id: Date.now().toString(), // Unique ID for React keys
            heading: '',
            description: ''
          }
        ]
      }
    }));
  };

  // Update sub-item field
  const handleUpdateSubItem = (sectionId, itemId, field, value) => {
    setSections(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        items: (prev[sectionId]?.items || []).map(item =>
          item.id === itemId ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  // Delete sub-item
  const handleDeleteSubItem = (sectionId, itemId) => {
    setSections(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        items: (prev[sectionId]?.items || []).filter(item => item.id !== itemId)
      }
    }));
  };

  // Reorder sub-items (for drag & drop)
  const handleReorderSubItems = (sectionId, newOrder) => {
    setSections(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        items: newOrder
      }
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Validate basic info
    if (!basicInfo.title.trim()) newErrors.title = 'Title is required';
    if (!basicInfo.description.trim()) newErrors.description = 'Description is required';
    if (!basicInfo.location.trim()) newErrors.location = 'Location is required';

    // Validate sections - ensure main title and no empty headings/descriptions
    Object.keys(sections).forEach(sectionId => {
      const section = sections[sectionId];
      // Validate main title if section has items
      if (section?.items && section.items.length > 0 && !section.mainTitle?.trim()) {
        newErrors[`${sectionId}_mainTitle`] = 'Main heading is required';
      }
      // Validate each item
      (section?.items || []).forEach((item) => {
        if (!item.heading.trim()) {
          newErrors[`${sectionId}_${item.id}_heading`] = 'Heading is required';
        }
        if (!item.description.trim()) {
          newErrors[`${sectionId}_${item.id}_description`] = 'Description is required';
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const content = GUIDE_SECTIONS
      .map((section) => {
        const sectionData = sections[section.id];

        if (!sectionData?.items || sectionData.items.length === 0) {
          return null;
        }

        return {
          tabName: section.label,
          mainTitle: sectionData.mainTitle || '',
          sections: sectionData.items.map((item) => ({
            subHeading: item.heading,
            description: item.description,
          })),
        };
      })
      .filter(Boolean);

    const guideData = {
      title: basicInfo.title.trim(),
      description: basicInfo.description.trim(),
      location: basicInfo.location.trim(),
      category: (basicInfo.category || '').toLowerCase(),
      readTime: basicInfo.readTime,
      content,
      heroImageFile: imageFile,
    };

    try {
      setIsSubmitting(true);
      await onSave(guideData);
    } catch (error) {
      console.error('Failed to create guide', error);
      const message = error?.response?.data?.message || error?.message || 'Failed to create guide';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get current section config
  const currentSection = GUIDE_SECTIONS.find(s => s.id === activeTab);
  const currentItems = sections[activeTab]?.items || [];
  const currentMainTitle = sections[activeTab]?.mainTitle || '';

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-2 sm:p-4 overflow-hidden"
      data-lenis-prevent
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg sm:rounded-xl shadow-2xl w-full h-full sm:h-auto sm:max-w-6xl sm:max-h-[90vh] overflow-hidden flex flex-col"
        data-lenis-prevent
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-olive px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            <h2 className="text-base sm:text-xl font-bold text-white">
              {initialData ? 'Edit Guide' : 'Create Guide'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* MOBILE: Basic Info Collapsible Section */}
          <div className="md:hidden border-b border-gray-200 bg-white">
            <button
              onClick={() => setShowBasicInfo(!showBasicInfo)}
              className="w-full px-4 py-3 flex items-center justify-between text-left bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm font-semibold text-gray-700">Basic Information</span>
              {showBasicInfo ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            
            <AnimatePresence>
              {showBasicInfo && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Title *</label>
                      <input
                        type="text"
                        value={basicInfo.title}
                        onChange={(e) => handleBasicInfoChange('title', e.target.value)}
                        placeholder="e.g., Abu Dhabi"
                        className={`w-full px-3 py-2.5 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-olive ${
                          errors.title ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Location *</label>
                      <input
                        type="text"
                        value={basicInfo.location}
                        onChange={(e) => handleBasicInfoChange('location', e.target.value)}
                        placeholder="e.g., Abu Dhabi, UAE"
                        className={`w-full px-3 py-2.5 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-olive ${
                          errors.location ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Description *</label>
                      <textarea
                        value={basicInfo.description}
                        onChange={(e) => handleBasicInfoChange('description', e.target.value)}
                        placeholder="Brief description..."
                        rows="3"
                        className={`w-full px-3 py-2.5 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-olive resize-none ${
                          errors.description ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                        <select
                          value={basicInfo.category}
                          onChange={(e) => handleBasicInfoChange('category', e.target.value)}
                          className="w-full px-2 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-olive"
                        >
                          <option value="adventure">Adventure</option>
                          <option value="cultural">Cultural</option>
                          <option value="wildlife">Wildlife</option>
                          <option value="luxury">Luxury</option>
                          <option value="budget">Budget</option>
                          <option value="family">Family</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Read Time</label>
                        <input
                          type="text"
                          value={basicInfo.readTime}
                          onChange={(e) => handleBasicInfoChange('readTime', e.target.value)}
                          placeholder="10 min"
                          className="w-full px-2 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-olive"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        <Upload className="w-3 h-3 inline-block mr-1" />
                        Cover Image
                      </label>
                      {!imagePreview ? (
                        <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-olive transition-colors cursor-pointer block">
                          <div className="flex flex-col items-center gap-1">
                            <Upload className="w-6 h-6 text-gray-400" />
                            <span className="text-xs text-gray-600">Click to upload</span>
                            <span className="text-[10px] text-gray-500">PNG, JPG up to 5MB</span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      ) : imageError ? (
                        <div className="border-2 border-red-300 rounded-lg bg-red-50 p-4 flex flex-col items-center justify-center gap-2 min-h-[140px]">
                          <div className="text-red-600">
                            <Upload className="w-8 h-8 mx-auto opacity-50" />
                          </div>
                          <p className="text-xs font-medium text-red-700">Image Failed to Load</p>
                          <p className="text-[10px] text-red-600">The image URL is broken</p>
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
                            title="Remove image"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </div>
                      ) : (
                        <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-32 object-cover"
                            onError={() => setImageError(true)}
                            onLoad={() => setImageError(false)}
                          />
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-md"
                            title="Remove image"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* MOBILE: Horizontal Tab Navigation */}
          <div className="md:hidden border-b border-gray-200 bg-white">
            <div className="flex items-center">
              {/* Left Arrow */}
              <button
                onClick={handlePreviousTab}
                disabled={GUIDE_SECTIONS.findIndex(s => s.id === activeTab) === 0}
                className={`p-3 shrink-0 ${
                  GUIDE_SECTIONS.findIndex(s => s.id === activeTab) === 0
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Scrollable Tabs */}
              <div className="flex-1 overflow-x-auto scrollbar-hide">
                <div className="flex gap-2 p-3 min-w-max">
                  {GUIDE_SECTIONS.map((section) => {
                    const Icon = section.icon;
                    const itemCount = sections[section.id]?.length || 0;
                    
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveTab(section.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all whitespace-nowrap ${
                          activeTab === section.id
                            ? 'bg-olive text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="text-sm font-medium">{section.label}</span>
                        <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                          activeTab === section.id ? 'bg-white/20' : 'bg-white'
                        }`}>
                          {itemCount}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Arrow */}
              <button
                onClick={handleNextTab}
                disabled={GUIDE_SECTIONS.findIndex(s => s.id === activeTab) === GUIDE_SECTIONS.length - 1}
                className={`p-3 shrink-0 ${
                  GUIDE_SECTIONS.findIndex(s => s.id === activeTab) === GUIDE_SECTIONS.length - 1
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* DESKTOP: Sidebar Navigation */}
          <div 
            className="hidden md:block w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-scroll shrink-0"
            data-lenis-prevent
            style={{ 
              overscrollBehavior: 'contain',
              WebkitOverflowScrolling: 'touch',
              scrollBehavior: 'smooth'
            }}
          >
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Basic Info
              </h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    value={basicInfo.title}
                    onChange={(e) => handleBasicInfoChange('title', e.target.value)}
                    placeholder="e.g., Abu Dhabi"
                    className={`w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-olive ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Location *</label>
                  <input
                    type="text"
                    value={basicInfo.location}
                    onChange={(e) => handleBasicInfoChange('location', e.target.value)}
                    placeholder="e.g., Abu Dhabi, UAE"
                    className={`w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-olive ${
                      errors.location ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    value={basicInfo.description}
                    onChange={(e) => handleBasicInfoChange('description', e.target.value)}
                    placeholder="Brief description..."
                    rows="3"
                    className={`w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-olive resize-none ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={basicInfo.category}
                      onChange={(e) => handleBasicInfoChange('category', e.target.value)}
                      className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-olive"
                    >
                      <option value="adventure">Adventure</option>
                      <option value="cultural">Cultural</option>
                      <option value="wildlife">Wildlife</option>
                      <option value="luxury">Luxury</option>
                      <option value="budget">Budget</option>
                      <option value="family">Family</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Read Time</label>
                    <input
                      type="text"
                      value={basicInfo.readTime}
                      onChange={(e) => handleBasicInfoChange('readTime', e.target.value)}
                      placeholder="10 min"
                      className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-olive"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    <Upload className="w-3 h-3 inline-block mr-1" />
                    Cover Image
                  </label>
                  {!imagePreview ? (
                    <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-olive transition-colors cursor-pointer block">
                      <div className="flex flex-col items-center gap-1">
                        <Upload className="w-6 h-6 text-gray-400" />
                        <span className="text-xs text-gray-600">Click to upload</span>
                        <span className="text-[10px] text-gray-500">PNG, JPG up to 5MB</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  ) : imageError ? (
                    <div className="border-2 border-red-300 rounded-lg bg-red-50 p-4 flex flex-col items-center justify-center gap-2 min-h-[140px]">
                      <div className="text-red-600">
                        <Upload className="w-8 h-8 mx-auto opacity-50" />
                      </div>
                      <p className="text-[10px] text-red-600">The image URL is broken</p>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
                        title="Remove image"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  ) : (
                    <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-32 object-cover"
                        onError={() => setImageError(true)}
                        onLoad={() => setImageError(false)}
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-md"
                        title="Remove image"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Content Sections
              </h3>
              <div className="space-y-1">
                {GUIDE_SECTIONS.map((section) => {
                  const Icon = section.icon;
                  const itemCount = sections[section.id]?.items?.length || 0;
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveTab(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                        activeTab === section.id
                          ? 'bg-olive text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium">{section.label}</div>
                        <div className={`text-xs ${
                          activeTab === section.id ? 'text-white/80' : 'text-gray-500'
                        }`}>
                          {itemCount} {itemCount === 1 ? 'item' : 'items'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Section Header */}
            <div className="bg-gray-50 border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 shrink-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2 sm:gap-3">
                  {currentSection && (
                    <>
                      <div className="p-1.5 sm:p-2 bg-olive/10 rounded-lg shrink-0">
                        <currentSection.icon className="w-4 h-4 sm:w-5 sm:h-5 text-olive" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                          {currentSection.label}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-0.5 hidden sm:block">
                          {currentSection.description}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <button
                  onClick={() => handleAddSubItem(activeTab)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-olive text-white rounded-lg hover:bg-olive/90 transition-colors text-xs sm:text-sm font-bold whitespace-nowrap w-full sm:w-auto justify-center"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>
            </div>

            {/* Scrollable Items Area */}
            <div 
              className="flex-1 overflow-y-scroll p-3 sm:p-6" 
              data-lenis-prevent
              style={{ 
                overscrollBehavior: 'contain',
                WebkitOverflowScrolling: 'touch',
                scrollBehavior: 'smooth'
              }}
            >
              {/* Main Heading for Section */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Heading for {currentSection?.label} *
                </label>
                <input
                  type="text"
                  value={currentMainTitle}
                  onChange={(e) => handleUpdateMainTitle(activeTab, e.target.value)}
                  placeholder={currentSection?.placeholder}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg outline-none focus:ring-2 focus:ring-olive text-sm sm:text-base ${
                    errors[`${activeTab}_mainTitle`] ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors[`${activeTab}_mainTitle`] && (
                  <p className="text-red-500 text-xs mt-1">{errors[`${activeTab}_mainTitle`]}</p>
                )}
                <p className="text-xs text-gray-500 mt-1.5">
                  This will be the main title displayed for this section
                </p>
              </div>

              <AnimatePresence mode="popLayout">
                {currentItems.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-8 sm:py-12 text-center"
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                      {currentSection && <currentSection.icon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />}
                    </div>
                    <p className="text-sm sm:text-base text-gray-500 mb-3 sm:mb-4">No items yet</p>
                    <button
                      onClick={() => handleAddSubItem(activeTab)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-olive/10 text-olive rounded-lg hover:bg-olive/20 transition-colors text-sm font-bold"
                    >
                      <Plus className="w-4 h-4" />
                      Add First Item
                    </button>
                  </motion.div>
                ) : (
                  <Reorder.Group
                    axis="y"
                    values={currentItems}
                    onReorder={(newOrder) => handleReorderSubItems(activeTab, newOrder)}
                    className="space-y-3 sm:space-y-4"
                    style={{ pointerEvents: 'auto' }}
                  >
                    {currentItems.map((item, index) => (
                      <Reorder.Item
                        key={item.id}
                        value={item}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:border-olive/50 transition-colors">
                          {/* Item Header */}
                          <div className="flex items-center gap-2 sm:gap-3 mb-3">
                            <button
                              className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-gray-100 rounded touch-manipulation"
                              title="Drag to reorder"
                            >
                              <GripVertical className="w-5 h-5 text-gray-400" />
                            </button>
                            <span className="px-2 py-1 bg-olive/10 text-olive text-xs font-semibold rounded">
                              #{index + 1}
                            </span>
                            <div className="flex-1"></div>
                            <button
                              onClick={() => handleDeleteSubItem(activeTab, item.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors touch-manipulation"
                              title="Delete item"
                            >
                              <Trash2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                            </button>
                          </div>

                          {/* Heading Input */}
                          <div className="mb-3">
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                              Sub-heading *
                            </label>
                            <input
                              type="text"
                              value={item.heading}
                              onChange={(e) => handleUpdateSubItem(activeTab, item.id, 'heading', e.target.value)}
                              placeholder={currentSection?.placeholder || 'Enter heading...'}
                              className={`w-full px-3 sm:px-4 py-2.5 text-sm sm:text-base border rounded-lg outline-none focus:ring-2 focus:ring-olive font-medium ${
                                errors[`${activeTab}_${item.id}_heading`]
                                  ? 'border-red-500'
                                  : 'border-gray-300'
                              }`}
                            />
                            {errors[`${activeTab}_${item.id}_heading`] && (
                              <p className="text-xs text-red-600 mt-1">
                                {errors[`${activeTab}_${item.id}_heading`]}
                              </p>
                            )}
                          </div>

                          {/* Description Textarea */}
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                              Description *
                            </label>
                            <textarea
                              value={item.description}
                              onChange={(e) => handleUpdateSubItem(activeTab, item.id, 'description', e.target.value)}
                              placeholder="Detailed information, tips, or instructions..."
                              rows="4"
                              className={`w-full px-3 sm:px-4 py-2.5 text-sm sm:text-base border rounded-lg outline-none focus:ring-2 focus:ring-olive resize-none ${
                                errors[`${activeTab}_${item.id}_description`]
                                  ? 'border-red-500'
                                  : 'border-gray-300'
                              }`}
                            />
                            {errors[`${activeTab}_${item.id}_description`] && (
                              <p className="text-xs text-red-600 mt-1">
                                {errors[`${activeTab}_${item.id}_description`]}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              You can use markdown formatting here
                            </p>
                          </div>
                        </div>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
            Total items: {Object.values(sections).reduce((sum, section) => sum + (section?.items?.length || 0), 0)}
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto order-1 sm:order-2">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 text-sm sm:text-base text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 text-sm sm:text-base bg-olive text-white rounded-lg hover:bg-olive/90 transition-colors font-bold"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Saving...' : initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

DynamicTravelGuideForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    location: PropTypes.string,
    category: PropTypes.string,
    readTime: PropTypes.string,
    image: PropTypes.string,
    sections: PropTypes.object
  })
};

export default DynamicTravelGuideForm;
