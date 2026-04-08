import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Clock, Calendar, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/context.hooks';
import { travelGuideService } from '../../../services/api.services';
import Spinner from '../../../components/common/Spinner';

/**
 * TravelGuides Component
 * Premium travel guides section with carousel-style presentation
 */
const TravelGuides = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [guides, setGuides] = useState([]);
  const [loadingGuides, setLoadingGuides] = useState(true);
  const [guidesError, setGuidesError] = useState(null);

  // Fetch guides from API - only for authenticated users
  useEffect(() => {
    const fetchGuides = async () => {
      try {
        setLoadingGuides(true);
        const response = await travelGuideService.getGuides({
          page: 1,
          limit: 10,
          search: '',
          sortBy: 'title',
          sortOrder: 'asc',
        });

        if (response.data && response.data.guides) {
          // Transform API response to match card structure
          const transformedGuides = response.data.guides.map((guide) => ({
            id: guide.id,
            title: guide.title,
            category: guide.category,
            image: guide.heroImage,
            description: guide.description,
            readTime: guide.readTime,
            location: guide.location,
            level: 'intermediate',
            availability: 'year-round',
          }));
          setGuides(transformedGuides);
        }
      } catch (error) {
        console.error('Error fetching guides:', error);
        setGuidesError('Failed to load travel guides');
      } finally {
        setLoadingGuides(false);
      }
    };

    // Only fetch API data if user is authenticated
    if (isAuthenticated) {
      fetchGuides();
    } else {
      // For non-authenticated users, show demo data immediately
      setLoadingGuides(false);
    }
  }, [isAuthenticated]);

  const hardcodedGuides = [
    {
      id: 1,
      category: 'Adventure',
      title: 'Mountain Trekking',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800',
      description: 'Experience breathtaking mountain trails and scenic landscapes perfect for adventure seekers worldwide.',
      readTime: '8 min read',
      level: 'intermediate',
      availability: 'seasonal',
    },
    {
      id: 2,
      category: 'Luxury',
      title: 'Premium Travel',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800',
      description: 'Unlock exclusive travel guides and insider tips for destinations around the world.',
      readTime: '15 min read',
      level: 'beginner',
      availability: 'year-round',
    },
    {
      id: 3,
      category: 'Cultural',
      title: 'Abu Dhabi',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800',
      description: 'Abu Dhabi, the capital of the UAE, is known for its luxurious skyscrapers, cultural landmarks, and desert experiences.',
      readTime: '10 min read',
      level: 'beginner',
      availability: 'year-round',
    },
  ];

  // Use API guides if available, otherwise use hardcoded
  const displayedGuides = guides.length > 0 ? guides : hardcodedGuides;

  // Responsive cards per view - mobile: 1, tablet: 2, desktop: 3
  useEffect(() => {
    const updateCardsPerView = () => {
      const newCardsPerView = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
      setCardsPerView(prev => {
        if (prev !== newCardsPerView) {
          setCurrentIndex(0); // Reset index when cards per view changes
        }
        return newCardsPerView;
      });
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  const maxIndex = displayedGuides.length - cardsPerView;

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  return (
    <section className="py-20 bg-linear-to-r from-[#0B8659] via-[#117953] to-[#DB7706] overflow-hidden px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Header Content */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Travel Guides
          </h2>

          {/* Sub-heading */}
          <p className="text-lg sm:text-xl text-white/90 mb-6 max-w-3xl mx-auto">
            Discover the world through our expertly crafted destination guides
          </p>

          {/* Tagline Button */}
          <motion.button
            className="px-8 py-3 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white font-bold hover:bg-white/20 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Plan Smarter, Travel Better
          </motion.button>
        </motion.div>

        {/* Carousel-Style Cards - Desktop */}
        <div className="hidden lg:block relative mt-16">
          {/* All 3 Cards */}
          {loadingGuides ? (
            <div className="flex items-center justify-center py-24">
              <Spinner />
            </div>
          ) : guidesError ? (
            <div className="flex items-center justify-center py-24">
              <p className="text-white text-lg">{guidesError}</p>
            </div>
          ) : (
          <div className="grid grid-cols-3 gap-6">
            {displayedGuides.map((guide) => (
              <motion.div
                key={guide.id}
                className={`bg-white rounded-2xl overflow-hidden shadow-xl ${isAuthenticated ? 'cursor-pointer hover:shadow-2xl transition-shadow duration-300' : ''}`}
                onClick={() => isAuthenticated && navigate(`/travel-guides/${guide.id}`)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: guide.id * 0.1 }}
                whileHover={isAuthenticated ? { scale: 1.02 } : {}}
              >
                {/* Card Image with Category Badge */}
                <div className="relative h-84">
                  <img
                    src={guide.image}
                    alt={guide.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Category Badge */}
                  <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium rounded-full">
                    {guide.category}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {guide.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {guide.description}
                  </p>

                  {/* Metadata Row */}
                  <div className="flex items-center justify-between text-sm">
                    {/* Reading Time */}
                    <span className="flex items-center gap-1 text-gray-500">
                      <Clock className="w-4 h-4" />
                      {guide.readTime}
                    </span>

                    {/* Tags */}
                    <div className="flex items-center gap-2">
                      {/* Level Badge */}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        guide.level === 'beginner' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {/* <TrendingUp className="w-3 h-3 inline mr-1" /> */}
                        {guide.level}
                      </span>

                      {/* Availability */}
                      <span className="flex items-center gap-1 text-gray-500">
                        {/* <Calendar className="w-4 h-4" /> */}
                        {guide.availability}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          )}

          {/* Single Transparent Lock Overlay Covering All 3 Cards - Show when not authenticated */}
          {!isAuthenticated && !loadingGuides && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center rounded-2xl">
              {/* Lock Icon */}
              <motion.div
                className="w-20 h-20 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center mb-6"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              >
                <Lock className="w-10 h-10 text-white" />
              </motion.div>

              {/* Title */}
              <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Exclusive to Members
              </h3>

              {/* Description */}
              <p className="text-white/95 text-base sm:text-lg mb-2 max-w-2xl">
                Travel guides for over 100 destinations including Paris, Bali, Tokyo, New York, and many more.
              </p>

              {/* Call to Action Text */}
              <p className="text-white/90 text-base mb-8">
                Explore the full collection of travel guides!
              </p>

              {/* Members Club Button */}
              <motion.button
                onClick={() => navigate('/members-club')}
                className="px-10 py-4 rounded-full bg-orange text-white font-bold hover:bg-orange/90 transition-colors duration-300 shadow-xl text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Members Club
              </motion.button>
            </div>
          )}

          {/* View All Guides Button - Show when authenticated */}
          {isAuthenticated && (
            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.button
                onClick={() => navigate('/travel-guides')}
                className="px-10 py-4 rounded-full bg-orange text-white font-bold hover:bg-orange/90 transition-colors duration-300 shadow-xl text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All Guides
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* Mobile/Tablet View - Carousel */}
        <div className="lg:hidden relative mt-16">
          {loadingGuides ? (
            <div className="flex items-center justify-center py-24">
              <Spinner />
            </div>
          ) : guidesError ? (
            <div className="flex items-center justify-center py-24">
              <p className="text-white text-lg">{guidesError}</p>
            </div>
          ) : (
          <>
          {/* Left Arrow */}
          {currentIndex > 0 && (
            <motion.button
              onClick={handlePrev}
              className="absolute -left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors z-20"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Previous guide"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </motion.button>
          )}

          {/* Right Arrow */}
          {currentIndex < maxIndex && (
            <motion.button
              onClick={handleNext}
              className="absolute -right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors z-20"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Next guide"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </motion.button>
          )}

          {/* Cards Container with Overflow */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{
                x: `calc(-${currentIndex * (100 / cardsPerView)}% - ${currentIndex * 1.5}rem)`
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              {displayedGuides.map((guide, index) => (
                <div
                  key={guide.id}
                  className="relative shrink-0"
                  style={{
                    width: `calc(${100 / cardsPerView}% - ${(cardsPerView - 1) * 1.5}rem / ${cardsPerView})`
                  }}
                >
                  <motion.div
                    className={`bg-white rounded-2xl overflow-hidden shadow-xl ${isAuthenticated ? 'cursor-pointer hover:shadow-2xl transition-shadow duration-300' : ''}`}
                    onClick={() => isAuthenticated && navigate(`/travel-guides/${guide.id}`)}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={isAuthenticated ? { scale: 1.02 } : {}}
                  >
                    {/* Card Image with Category Badge */}
                    <div className="relative h-64">
                      <img
                        src={guide.image}
                        alt={guide.title}
                        className="w-full h-full object-cover"
                      />
                      {/* Category Badge */}
                      <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium rounded-full">
                        {guide.category}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {guide.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4">
                        {guide.description}
                      </p>

                      {/* Metadata Row */}
                      <div className="flex items-center justify-between text-sm">
                        {/* Reading Time */}
                        <span className="flex items-center gap-1 text-gray-500">
                          <Clock className="w-4 h-4" />
                          {guide.readTime}
                        </span>

                        {/* Tags */}
                        <div className="flex items-center gap-2">
                          {/* Level Badge */}
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            guide.level === 'beginner' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            <TrendingUp className="w-3 h-3 inline mr-1" />
                            {guide.level}
                          </span>

                          {/* Availability */}
                          <span className="flex items-center gap-1 text-gray-500">
                            <Calendar className="w-4 h-4" />
                            {guide.availability}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Single Transparent Lock Overlay on Current Card - Show when not authenticated */}
                  {!isAuthenticated && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center rounded-2xl">
                      {/* Lock Icon */}
                      <motion.div
                        className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center mb-6"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                      >
                        <Lock className="w-8 h-8 text-white" />
                      </motion.div>

                      {/* Title */}
                      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                        Exclusive to Members
                      </h3>

                      {/* Description */}
                      <p className="text-white/95 text-sm sm:text-base mb-2 max-w-md">
                        Travel guides for over 100 destinations including Paris, Bali, Tokyo, New York, and many more.
                      </p>

                      {/* Call to Action Text */}
                      <p className="text-white/90 text-sm mb-6">
                        Explore the full collection of travel guides!
                      </p>

                      {/* Members Club Button */}
                      <motion.button
                        onClick={() => navigate('/members-club')}
                        className="px-8 py-3 rounded-full bg-orange text-white font-bold hover:bg-orange/90 transition-colors duration-300 shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Members Club
                      </motion.button>
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          </div>
          </>
          )}

          {/* View All Guides Button - Show when authenticated (Mobile) */}
          {isAuthenticated && (
            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.button
                onClick={() => navigate('/travel-guides')}
                className="px-10 py-4 rounded-full bg-white text-[#0B8659] font-bold hover:bg-white/90 transition-colors duration-300 shadow-xl text-lg border-2 border-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All Guides
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TravelGuides;
