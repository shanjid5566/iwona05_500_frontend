import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Clock, MapPin, Calendar, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUser } from '../../context/context.hooks';
import { travelGuideService } from '../../services/api.services';
import Spinner from '../../components/common/Spinner';
import Pagination from '../../components/common/Pagination';

/**
 * TravelGuidesPage - Main listing page for travel guides
 * Features: Search, category filtering, clean card layout, premium aesthetics
 */
const TravelGuidesPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();
  const ITEMS_PER_PAGE = 12;
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [currentPage, setCurrentPage] = useState(1);
  const [scrollTrigger, setScrollTrigger] = useState(0);
  const [apiGuides, setApiGuides] = useState([]);
  const [loadingGuides, setLoadingGuides] = useState(true);
  const [guidesError, setGuidesError] = useState(null);
  const [totalGuidePages, setTotalGuidePages] = useState(1);
  const [totalGuides, setTotalGuides] = useState(0);
  const hasShownToast = useRef(false);
  const gridSectionRef = useRef(null);

  // Scroll to grid after page change (after render)
  useEffect(() => {
    if (scrollTrigger === 0) return;
    const top = (gridSectionRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  }, [scrollTrigger]);

  // Redirect to members club if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !hasShownToast.current) {
      hasShownToast.current = true;
      toast.info('Please login to access Travel Guides.');
      navigate('/members-club');
    }
  }, [isAuthenticated, navigate]);

  // Debounce search input to avoid API call on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch guides from API
  useEffect(() => {
    const fetchGuides = async () => {
      if (!isAuthenticated) {
        setLoadingGuides(false);
        return;
      }
      try {
        setLoadingGuides(true);
        const response = await travelGuideService.getGuides({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          search: debouncedSearch,
          category: selectedCategory === 'All Categories' ? '' : selectedCategory,
          sortBy: 'title',
          sortOrder: 'asc',
        });
        if (response.success && response.data && response.data.guides) {
          setApiGuides(response.data.guides);
          setTotalGuidePages(response.data.pagination.totalPages);
          setTotalGuides(response.data.pagination.total);
        }
      } catch (error) {
        console.error('Error fetching guides:', error);
        setGuidesError('Failed to load travel guides');
      } finally {
        setLoadingGuides(false);
      }
    };
    fetchGuides();
  }, [isAuthenticated, currentPage, debouncedSearch, selectedCategory]);

  // Categories for filtering
  const categories = ['All Categories', 'Adventure', 'Cultural', 'Wildlife', 'Luxury', 'Budget', 'Family'];

  // Travel guides data - expanded from home component
  const guides = [
    {
      id: 1,
      slug: 'abu-dhabi',
      category: 'Cultural',
      title: 'Abu Dhabi',
      destination: 'Abu Dhabi, UAE',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200',
      description: 'Abu Dhabi, the capital of the UAE, is known for its luxurious skyscrapers, cultural landmarks, and desert experiences.',
      readTime: '10 min read',
      level: 'beginner',
      season: 'year-round',
    },
    {
      id: 2,
      slug: 'agadir',
      category: 'Beach & Coastal',
      title: 'Agadir',
      destination: 'Agadir, Morocco',
      image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=1200',
      description: 'From golden beaches and vibrant souks to desert adventures and coastal day trips, Agadir offers a perfect mix of relaxation and exploration.',
      readTime: '10 min read',
      level: 'beginner',
      season: 'autumn',
    },
    {
      id: 3,
      slug: 'albufeira',
      category: 'Beach & Coastal',
      title: 'Albufeira',
      destination: 'Albufeira, Portugal',
      image: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?q=80&w=1200',
      description: 'Sun-soaked beaches, cliffside caves, thrilling adventures, and cocktails with a view—this Algarve gem is basically a no-brainer.',
      readTime: '5 min read',
      level: 'beginner',
      season: 'summer',
    },
    {
      id: 4,
      slug: 'alghero',
      category: 'Beach & Coastal',
      title: 'Alghero',
      destination: 'Alghero, Italy',
      image: 'https://images.unsplash.com/photo-1566993293895-65575c4b94ca?q=80&w=1200',
      description: 'With its lively harbor, charming old town, and fresh seafood, Alghero delights every traveler.',
      readTime: '10 min read',
      level: 'beginner',
      season: 'year-round',
    },
    {
      id: 5,
      slug: 'alicante',
      category: 'Beach & Coastal',
      title: 'Alicante',
      destination: 'Alicante, Spain',
      image: 'https://images.unsplash.com/photo-1590073844006-33379778ae09?q=80&w=1200',
      description: 'Discover the best of Alicante with this travel guide, covering must-see landmarks, local eats, travel tips, and essential information.',
      readTime: '10 min read',
      level: 'beginner',
      season: 'year-round',
    },
    {
      id: 6,
      slug: 'amalfi-coast',
      category: 'Beach & Coastal',
      title: 'Amalfi Coast',
      destination: 'Amalfi Coast, Italy',
      image: 'https://images.unsplash.com/photo-1534445867742-43195f401b6c?q=80&w=1200',
      description: 'Discover the stunning Amalfi Coast with tips on getting there, top towns, must-do activities, and practical advice for an unforgettable trip.',
      readTime: '10 min read',
      level: 'beginner',
      season: 'summer',
    },
    {
      id: 7,
      slug: 'amsterdam',
      category: 'City Breaks',
      title: 'Amsterdam',
      destination: 'Amsterdam, Netherlands',
      image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?q=80&w=1200',
      description: 'Explore Amsterdam with ease using this compact guide packed with practical tips and essential local info.',
      readTime: '10 min read',
      level: 'beginner',
      season: 'year-round',
    },
    {
      id: 8,
      slug: 'antalya',
      category: 'Beach & Coastal',
      title: 'Antalya',
      destination: 'Antalya, Turkey',
      image: 'https://images.unsplash.com/photo-1564859228273-274232fdb516?q=80&w=1200',
      description: 'Planning to Antalya? This guide has all the good stuff—how to get from the airport to the city and beyond.',
      readTime: '10 min read',
      level: 'beginner',
      season: 'summer',
    },
    {
      id: 9,
      slug: 'barcelona',
      category: 'City Breaks',
      title: 'Barcelona',
      destination: 'Barcelona, Spain',
      image: 'https://images.unsplash.com/photo-1562883676-8c7feb83f09b?q=80&w=1200',
      description: 'Barcelona: a laid-back city full of culture, cool food, and little surprises around every corner.',
      readTime: '10 min read',
      level: 'beginner',
      season: 'year-round',
    },
    {
      id: 10,
      slug: 'brussels',
      category: 'City Breaks',
      title: 'Brussels',
      destination: 'Brussels, Belgium',
      image: 'https://images.unsplash.com/photo-1559113202-c916b8e44373?q=80&w=1200',
      description: 'Discover the best of Brussels with this travel guide, covering must-see landmarks, local eats, travel tips, and essential info.',
      readTime: '10 min read',
      level: 'beginner',
      season: 'year-round',
    },
    {
      id: 11,
      slug: 'bucharest',
      category: 'City Breaks',
      title: 'Bucharest',
      destination: 'Bucharest, Romania',
      image: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?q=80&w=1200',
      description: 'Bucharest: a laid-back city full of culture, cool food, and little surprises around every corner.',
      readTime: '10 min read',
      level: 'beginner',
      season: 'year-round',
    },
    {
      id: 12,
      slug: 'budapest',
      category: 'City Breaks',
      title: 'Budapest',
      destination: 'Budapest, Hungary',
      image: 'https://images.unsplash.com/photo-1541449121264-7d4b2a28c1c2?q=80&w=1200',
      description: 'Budapest, Hungary\'s capital, is a city of rich history, stunning architecture, and vibrant culture.',
      readTime: '5 min read',
      level: 'beginner',
      season: 'year-round',
    },
    {
      id: 13,
      slug: 'cannes',
      category: 'Beach & Coastal',
      title: 'Cannes',
      destination: 'Cannes, France',
      image: 'https://images.unsplash.com/photo-1605608999819-3c9e0c69f0f8?q=80&w=1200',
      description: 'Discover everything you need to enjoy Cannes — from getting around and beach spots to top dining and easy day trips.',
      readTime: '10 min read',
      level: 'beginner',
      season: 'summer',
    },
  ];

  const handleGuideClick = (id) => {
    navigate(`/travel-guides/${id}`);
  };

  // Show error state
  if (isAuthenticated && guidesError && apiGuides.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
        <p className="text-gray-700 text-lg mb-4">{guidesError}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-slate-100 to-slate-200">
      {/* Hero Section */}
      <motion.div
        className="relative text-white py-32 sm:py-40 lg:py-40 px-4 sm:px-6 lg:px-8 overflow-hidden bg-linear-to-br from-emerald-600 via-emerald-700 to-teal-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background Image - Commented out as requested */}
        {/* <div className="absolute inset-0">
          <img 
            src="/travel_guides/banner_image.jpg" 
            alt="Travel guides background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/70 to-slate-900/80" />
        </div> */}

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-slate-600/20 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl"
            animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
            transition={{ duration: 12, repeat: Infinity }}
          />
        </div>

        <div className="container mx-auto text-center relative z-10">
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Travel Guides
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Discover expertly crafted travel guides to help you plan your perfect adventure. From hidden gems to must-see destinations, our guides provide insider tips and practical advice for every type of traveler.
          </motion.p>
          
          {/* Feature Pills */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-6 text-sm sm:text-base"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span>Expert Reviews</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span>Local Insights</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span>Updated Regularly</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Search and Filter Section */}
      <div ref={gridSectionRef} className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="container mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search guides, destinations, or tips..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
              />
            </div>

            {/* Category Dropdown */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full lg:w-auto pl-12 pr-8 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent appearance-none bg-white cursor-pointer transition-all"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        {/* <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <p className="text-slate-600 text-lg">
            {filteredGuides.length} {filteredGuides.length === 1 ? 'guide' : 'guides'} found
          </p>
        </motion.div> */}

        {/* Guides Grid */}
        {loadingGuides ? (
          <div className="flex items-center justify-center py-24">
            <Spinner />
          </div>
        ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          {apiGuides.map((guide, index) => (
            <motion.div
              key={guide.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              whileHover={{ y: -8 }}
              onClick={() => handleGuideClick(guide.id)}
            >
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={isAuthenticated ? guide.heroImage : guide.image}
                  alt={guide.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-2 bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-semibold rounded-full shadow-md">
                    {isAuthenticated ? guide.category.charAt(0).toUpperCase() + guide.category.slice(1) : guide.category}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-slate-700 transition-colors">
                  {guide.title}
                </h3>

                {/* Destination/Location */}
                <div className="flex items-center gap-2 text-slate-600 mb-3">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span className="text-sm">{isAuthenticated ? guide.location : guide.destination}</span>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
                  {guide.description}
                </p>

                {/* Metadata Row */}
                <div className="flex items-center justify-between text-sm pt-4 border-t border-slate-100">
                  {/* Reading Time */}
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="w-4 h-4" />
                    {guide.readTime}
                  </span>

                  {/* Level Badge - Only for hardcoded guides */}
                  {!isAuthenticated && guide.level && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      guide.level === 'beginner'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      <TrendingUp className="w-3 h-3 inline mr-1" />
                      {guide.level}
                    </span>
                  )}
                </div>

                {/* Season Info - Only for hardcoded guides */}
                {!isAuthenticated && guide.season && (
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-3">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Best: {guide.season}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
        )}

        {/* Pagination */}
        {totalGuides > 0 && (
          <motion.div
            className="mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Pagination
              currentPage={currentPage}
              totalPages={totalGuidePages}
              onPageChange={(page) => {
                setCurrentPage(page);
                setScrollTrigger(t => t + 1);
              }}
              totalItems={totalGuides}
              itemsPerPage={ITEMS_PER_PAGE}
              itemLabel="guides"
            />
          </motion.div>
        )}

        {/* No Results Message */}
        {apiGuides.length === 0 && !loadingGuides && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">No guides found</h3>
              <p className="text-slate-600 mb-6">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All Categories');
                  setCurrentPage(1);
                }}
                className="px-6 py-3 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TravelGuidesPage;
