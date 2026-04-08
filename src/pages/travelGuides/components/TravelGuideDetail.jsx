import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Calendar,
  MapPin,
  Car,
  Compass,
  UtensilsCrossed,
  Lightbulb,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useUser } from '../../../context/context.hooks';
import { travelGuideService } from '../../../services/api.services';
import Spinner from '../../../components/common/Spinner';

/**
 * TravelGuideDetail - Individual destination guide page
 * Features: Hero section, tabbed/accordion content, icons, responsive design
 */
const TravelGuideDetail = () => {
  const { guideSlug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useUser();
  const [activeTab, setActiveTab] = useState('');
  const [openAccordion, setOpenAccordion] = useState('');
  const [guide, setGuide] = useState(null);
  const [loadingGuide, setLoadingGuide] = useState(true);
  const [guideError, setGuideError] = useState(null);
  const hasShownToast = useRef(false);

  // Redirect to members club if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !hasShownToast.current) {
      hasShownToast.current = true;
      toast.info('Please login to access Travel Guides.');
      navigate('/members-club');
    }
  }, [isAuthenticated, navigate]);

  // Redirect INACTIVE/PENDING users to dashboard with renewal prompt
  useEffect(() => {
    if (isAuthenticated && (user?.status === 'INACTIVE' || user?.status === 'PENDING')) {
      toast.warning('Please renew your subscription to access Travel Guides.');
      navigate('/dashboard');
    }
  }, [isAuthenticated, user?.status, navigate]);

  // Fetch guide by ID from API
  useEffect(() => {
    const fetchGuide = async () => {
      try {
        setLoadingGuide(true);
        const response = await travelGuideService.getGuideById(guideSlug);

        if (response.data && response.data.guide) {
          setGuide(response.data.guide);
          // Set active tab to first tab name from content
          if (response.data.guide.content && response.data.guide.content.length > 0) {
            setActiveTab(response.data.guide.content[0].tabName);
            setOpenAccordion(response.data.guide.content[0].tabName);
          }
        }
      } catch (error) {
        console.error('Error fetching guide:', error);
        setGuideError('Failed to load travel guide');
      } finally {
        setLoadingGuide(false);
      }
    };

    if (guideSlug && isAuthenticated) {
      fetchGuide();
    }
  }, [guideSlug, isAuthenticated]);

  if (loadingGuide) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner />
      </div>
    );
  }

  if (guideError || !guide) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-gray-700 text-lg mb-4">{guideError || 'Guide not found'}</p>
        <button
          onClick={() => navigate('/travel-guides')}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Back to Guides
        </button>
      </div>
    );
  }

  const sections = guide.content.map((tab) => {
    // Map tab names to icons
    let Icon = Car;
    if (tab.tabName.toLowerCase().includes('things') || tab.tabName.toLowerCase().includes('activity')) {
      Icon = Compass;
    } else if (tab.tabName.toLowerCase().includes('eat') || tab.tabName.toLowerCase().includes('food')) {
      Icon = UtensilsCrossed;
    } else if (tab.tabName.toLowerCase().includes('tip') || tab.tabName.toLowerCase().includes('pro')) {
      Icon = Lightbulb;
    }
    return {
      key: tab.tabName.toLowerCase().replace(/\s+/g, '-'),
      label: tab.tabName,
      mainTitle: tab.mainTitle,
      icon: Icon,
    };
  });

  // Helper function to get active tab content
  const getActiveTabContent = () => {
    return guide.content.find((tab) => tab.tabName === activeTab);
  };

  // Helper function to format description with bold text before colons
  const formatDescriptionWithBoldColons = (text) => {
    if (!text) return text;
    
    // Regex to find text before colon at the start of a line
    const regex = /^([^:\n]*?):/gm;
    
    const parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      // Add text before match
      if (match.index > lastIndex) {
        parts.push({type: 'text', value: text.substring(lastIndex, match.index)});
      }
      
      // Add bold part with colon
      parts.push({type: 'bold', value: match[1]});
      parts.push({type: 'text', value: ':'});
      
      lastIndex = regex.lastIndex;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({type: 'text', value: text.substring(lastIndex)});
    }
    
    // Convert to JSX
    return parts.length > 0 ? parts.map((part, idx) => {
      if (part.type === 'bold') {
        return <strong key={idx}>{part.value}</strong>;
      }
      return part.value;
    }) : text;
  };


  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-slate-100 to-slate-200">
      {/* Hero Section with Full-Width Image */}
      <div className="relative h-[60vh] sm:h-[70vh] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={guide.heroImage}
            alt={guide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/70"></div>
        </div>

        {/* Back Button */}
        {/* <motion.button
          onClick={() => navigate('/travel-guides')}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-all"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Guides</span>
        </motion.button> */}

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {/* Category Badge */}
              <div className="inline-block mb-4">
                <span className="px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-full shadow-lg">
                  DESTINATION GUIDE
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white mb-4 leading-tight">
                {guide.title}
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-white/95 mb-6 max-w-3xl leading-relaxed">
                {guide.description}
              </p>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm sm:text-base">{guide.readTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span className="text-sm sm:text-base">{guide.location}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Desktop: Tabs */}
        <div className="hidden lg:block">
          {/* Tab Navigation */}
          <motion.div
            className="flex items-center justify-center gap-2 mb-12 bg-white rounded-2xl p-2 shadow-lg max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {sections.map((section) => {
              const IconComponent = section.icon;
              return (
                <button
                  key={section.key}
                  onClick={() => setActiveTab(section.label)}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all duration-300 ${
                    activeTab === section.label
                      ? 'bg-slate-900 text-white shadow-lg'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="hidden xl:inline">{section.label}</span>
                </button>
              );
            })}
          </motion.div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8">
                  {getActiveTabContent()?.mainTitle || 'Guide'}
                </h2>
                
                <div className="space-y-8">
                  {getActiveTabContent()?.sections.map((item, index) => (
                    <div key={index}>
                      {item.subHeading && (
                        <h3 className="text-xl font-bold text-slate-800 mb-3">
                          {item.subHeading}
                        </h3>
                      )}
                      <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                        {formatDescriptionWithBoldColons(item.description)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile/Tablet: Accordions */}
        <div className="lg:hidden max-w-4xl mx-auto space-y-4">
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            const isOpen = openAccordion === section.label;
            
            return (
              <motion.div
                key={section.key}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                {/* Accordion Header */}
                <button
                  onClick={() => setOpenAccordion(isOpen ? null : section.label)}
                  className={`w-full flex items-center justify-between p-6 text-left transition-colors ${
                    isOpen ? 'bg-slate-900 text-white' : 'bg-white text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className="w-6 h-6" />
                    <span className="font-bold text-lg">{section.label}</span>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </button>

                {/* Accordion Content */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 space-y-6 border-t border-slate-100">
                        {guide.content.find((tab) => tab.tabName === section.label)?.sections.map((item, idx) => (
                          <div key={idx}>
                            {item.subHeading && (
                              <h4 className="text-lg font-bold text-slate-800 mb-2">
                                {item.subHeading}
                              </h4>
                            )}
                            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                              {formatDescriptionWithBoldColons(item.description)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TravelGuideDetail;
