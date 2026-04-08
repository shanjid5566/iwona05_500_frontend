import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  MapPin,
  ExternalLink,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Lock,
  UserPlus,
  Gift,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/context.hooks";
import { travelDealsService } from "../../services/api.services";
import Spinner from "../../components/common/Spinner";
import Pagination from "../../components/common/Pagination";

/**
 * TravelDealsPage - Premium Travel Deals with Modern Design
 * Features: Dynamic filtering, masonry grid, floating price badges, and premium aesthetics
 */
const TravelDealsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useUser();
  const ITEMS_PER_PAGE = 6;

  const [activeAirport, setActiveAirport] = useState("Dublin");
  const [currentPage, setCurrentPage] = useState(1);
  const [scrollTrigger, setScrollTrigger] = useState(0);
  const tabsContainerRef = useRef(null);
  const gridSectionRef = useRef(null);

  // Scroll to grid after page change (after render)
  useEffect(() => {
    if (scrollTrigger === 0) return;
    const top = (gridSectionRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  }, [scrollTrigger]);

  // Carousel state for visitor sample deals
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState(0);
  const [featuredDeals, setFeaturedDeals] = useState([]);
  const [loadingFeaturedDeals, setLoadingFeaturedDeals] = useState(true);
  const [featuredDealsError, setFeaturedDealsError] = useState(null);

  // State for authenticated user - all deals from API
  const [allDeals, setAllDeals] = useState([]);
  const [loadingAllDeals, setLoadingAllDeals] = useState(true);
  const [errorAllDeals, setErrorAllDeals] = useState(null);
  const [totalDealPages, setTotalDealPages] = useState(1);
  const [totalDeals, setTotalDeals] = useState(0);

  // Scroll tabs left/right
  const scrollTabs = (direction) => {
    if (tabsContainerRef.current) {
      const scrollAmount = 200;
      tabsContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Airport filter options (matching admin form Airport Category)
  const airports = [
    "Hotel Deals",
    "Dublin",
    "Cork",
    "Shannon",
    "Knock",
    "Kerry",
    "Belfast",
  ];

  // Travel deals data structure matching admin form
  const deals = [
    {
      id: 1,
      title: "Extreme Day Trip to Edinburgh",
      
      destination: "Edinburgh, Scotland",
      description:
        "1-Day Adventure Thrills, historic sights, and cliffside views all packed into a single unforgettable day in Scotland's capital.",
      price: 44,
      discount: 0,
      image:
        "https://images.unsplash.com/photo-1531572753322-ad063cecc140?q=80&w=800",
      airportCategory: "Dublin",
      travelStartDate: "2026-03-15",
      travelEndDate: "2026-03-15",
      flightBookingLink: "https://example.com/edinburgh-flight",
      hotelBookingLink: "",
      featured: false,
    },
    {
      id: 2,
      title: "4-night Marrakech Escape",
      destination: "Marrakech, Morocco",
      description:
        "Enjoy 4 nights' accommodation with breakfast, plus return flights. Baggage not included. Experience the vibrant culture, markets, and sights of Morocco's enchanting city.",
      price: 256,
      discount: 15,
      image:
        "https://images.unsplash.com/photo-1597212618440-806262de4f6b?q=80&w=800",
      airportCategory: "Dublin",
      travelStartDate: "2026-04-10",
      travelEndDate: "2026-04-14",
      flightBookingLink: "https://example.com/marrakech-flight",
      hotelBookingLink: "https://example.com/marrakech-hotel",
      featured: true,
    },
    {
      id: 3,
      title: "2-night Gdansk Getaway",
      destination: "Gdansk, Poland",
      description:
        "Two night getaway with flights (baggage excluded) and a two-night hotel stay, based on 2 people sharing.",
      price: 129,
      discount: 0,
      image:
        "https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?q=80&w=800",
      airportCategory: "Dublin",
      travelStartDate: "2026-05-20",
      travelEndDate: "2026-05-22",
      flightBookingLink: "https://example.com/gdansk-booking",
      hotelBookingLink: "",
      featured: false,
    },
    {
      id: 4,
      title: "Rome City Break",
      destination: "Rome, Italy",
      description:
        "Enjoy 2 nights accommodation in Rome with return flights and checked baggage included. Perfect for a short city getaway to explore the Eternal City's iconic sights.",
      price: 256,
      discount: 10,
      image:
        "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800",
      airportCategory: "Dublin",
      travelStartDate: "2026-06-05",
      travelEndDate: "2026-06-07",
      flightBookingLink: "https://example.com/rome-flight",
      hotelBookingLink: "https://example.com/rome-hotel",
      featured: false,
    },
    {
      id: 5,
      title: "Lake Como Romantic Escape",
      destination: "Lake Como, Italy",
      description:
        "3 Nights Lake Como Break. Three nights' accommodation in Lecco with stunning lake views, return flights excl. baggage.",
      price: 227,
      discount: 20,
      image:
        "https://images.unsplash.com/photo-1527489377706-5bf97e608852?q=80&w=800",
      airportCategory: "Dublin",
      travelStartDate: "2026-07-12",
      travelEndDate: "2026-07-15",
      flightBookingLink: "https://example.com/como-booking",
      hotelBookingLink: "https://example.com/como-hotel",
      featured: true,
    },
    {
      id: 6,
      title: "Valentine's Weekend in Paris",
      destination: "Paris, France",
      description:
        "Valentine's Weekend in Paris — from €230.50 per person. Price based on two adults sharing. Includes return flights with bags and a 2-night hotel stay.",
      price: 230.5,
      discount: 0,
      image:
        "https://images.unsplash.com/photo-1502581827181-9cf3c3ee0106?q=80&w=800",
      airportCategory: "Dublin",
      travelStartDate: "2026-02-13",
      travelEndDate: "2026-02-15",
      flightBookingLink: "https://example.com/paris-flight",
      hotelBookingLink: "https://example.com/paris-hotel",
      featured: false,
    },
    {
      id: 7,
      title: "Barcelona City Adventure",
      destination: "Barcelona, Spain",
      description:
        "Experience the vibrant energy of Barcelona with 3 nights accommodation, return flights, and city center location. Perfect for exploring Gaudi's masterpieces.",
      price: 189,
      discount: 5,
      image:
        "https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=800",
      airportCategory: "Cork",
      travelStartDate: "2026-08-01",
      travelEndDate: "2026-08-04",
      flightBookingLink: "https://example.com/barcelona-flight",
      hotelBookingLink: "",
      featured: false,
    },
    {
      id: 8,
      title: "Santorini Dream Vacation",
      destination: "Santorini, Greece",
      description:
        "Live the Greek island dream with stunning sunsets, white-washed buildings, and blue-domed churches. Includes flights and accommodation for 5 magical nights.",
      price: 445,
      discount: 25,
      image:
        "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=800",
      airportCategory: "Shannon",
      travelStartDate: "2026-09-10",
      travelEndDate: "2026-09-15",
      flightBookingLink: "https://example.com/santorini-booking",
      hotelBookingLink: "https://example.com/santorini-hotel",
      featured: true,
    },
    {
      id: 9,
      title: "Luxury Spa Weekend",
      destination: "Dunboyne Castle & Spa, Ireland",
      description:
        "Unwind with a 2-night luxury spa experience featuring state-of-the-art facilities, saunas, pool, and relaxation areas. Includes breakfast and one spa treatment.",
      price: 299,
      discount: 15,
      image:
        "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=800",
      airportCategory: "Hotel Deals",
      travelStartDate: "2026-03-20",
      travelEndDate: "2026-03-22",
      flightBookingLink: "",
      hotelBookingLink: "https://example.com/dunboyne-spa",
      featured: false,
    },
    {
      id: 10,
      title: "Valentine's Weekend in Paris",
      destination: "Paris, France",
      description:
        "Valentine's Weekend in Paris — from €230.50 per person. Price based on two adults sharing. Includes return flights with bags and a 2-night hotel stay.",
      price: 230.5,
      discount: 0,
      image:
        "https://images.unsplash.com/photo-1502581827181-9cf3c3ee0106?q=80&w=800",
      airportCategory: "Dublin",
      travelStartDate: "2026-02-13",
      travelEndDate: "2026-02-15",
      flightBookingLink: "https://example.com/paris-flight",
      hotelBookingLink: "https://example.com/paris-hotel",
      featured: false,
    },
  ];

  // Filter deals by airport - use API data for authenticated users, fallback to hardcoded
  const filteredDeals = isAuthenticated ? allDeals : deals
    .filter((deal) => deal.airportCategory === activeAirport)
    .slice(0, ITEMS_PER_PAGE);

  // Calculate discounted price
  const calculateDiscountedPrice = (price, discount) => {
    if (discount > 0) {
      return (price - (price * discount) / 100).toFixed(2);
    }
    return price;
  };

  // Format date range
  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (nights === 0) return "1-Day Trip";
    if (nights === 1) return "1 night";
    return `${nights} nights`;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  // Fetch featured deals for the Sample Deals Preview carousel
  useEffect(() => {
    const fetchFeaturedDeals = async () => {
      try {
        setLoadingFeaturedDeals(true);
        const response = await travelDealsService.getFeaturedDeals({
          page: 1,
          limit: 10,
        });

        if (response.data && response.data.deals) {
          // Transform API response to match carousel structure
          const transformedDeals = response.data.deals.map((deal) => ({
            id: deal.id,
            title: deal.title,
            description: deal.description.split('\r\n')[0],
            price: deal.price,
            discount: deal.discount || 0,
            destination: deal.destination,
            airport: deal.airport,
            image: deal.dealImage,
            featured: deal.isFeatured,
            travelStartDate: deal.travelStartDate,
            travelEndDate: deal.travelEndDate,
            flightBookingLink: deal.flightBookingLink,
            hotelBookingLink: deal.hotelBookingLink,
          }));
          setFeaturedDeals(transformedDeals);
        }
      } catch (error) {
        console.error('Error fetching featured deals:', error);
        setFeaturedDealsError('Failed to load featured deals');
      } finally {
        setLoadingFeaturedDeals(false);
      }
    };

    fetchFeaturedDeals();
  }, []);

  // Fetch deals for authenticated users (server-side paginated by airport)
  useEffect(() => {
    const fetchAllDeals = async () => {
      if (!isAuthenticated) return;
      try {
        setLoadingAllDeals(true);
        const response = await travelDealsService.getAllDeals({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          airport: activeAirport,
          sortBy: 'createdAt',
          sortOrder: 'desc',
        });
        if (response.success && response.data && response.data.deals) {
          setAllDeals(response.data.deals);
          setTotalDealPages(response.data.pagination.totalPages);
          setTotalDeals(response.data.pagination.total);
        }
      } catch (error) {
        console.error('Error fetching all deals:', error);
        setErrorAllDeals('Failed to load deals');
      } finally {
        setLoadingAllDeals(false);
      }
    };
    fetchAllDeals();
  }, [isAuthenticated, currentPage, activeAirport]);

  // Use featured deals from API, fallback to hardcoded deals if not available
  const sampleDeals =
    featuredDeals.length > 0
      ? featuredDeals
      : deals.filter((deal) => deal.airportCategory === "Dublin").slice(0, 3);

  // Carousel navigation functions
  const nextSlide = () => {
    setSlideDirection(1);
    setCurrentSlide((prev) => (prev + 1) % sampleDeals.length);
  };

  const prevSlide = () => {
    setSlideDirection(-1);
    setCurrentSlide(
      (prev) => (prev - 1 + sampleDeals.length) % sampleDeals.length,
    );
  };

  const goToSlide = (index) => {
    setSlideDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  // Auto-play carousel for sample deals
  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setInterval(() => {
        setSlideDirection(1);
        setCurrentSlide((prev) => (prev + 1) % sampleDeals.length);
      }, 5000); // Change slide every 5 seconds
      return () => clearInterval(timer);
    }
  }, [currentSlide, isAuthenticated, sampleDeals.length]);

  // ==================== VISITOR VIEW (Not Authenticated) ====================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white pt-32 pb-12 sm:pt-36 sm:pb-16 overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute inset-0 bg-black/10"></div>

          {/* Decorative Blobs */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 right-16 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-white/10 rounded-full blur-xl transform -translate-x-1/2 -translate-y-1/2"></div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-5xl mx-auto text-center"
            >
              {/* Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center bg-white/20 backdrop-blur-sm px-6 py-2.5 rounded-full text-white font-semibold mb-8 border border-white/30"
              >
                <Lock className="w-5 h-5 mr-2" />
                Exclusive Member Deals
              </motion.div>

              {/* Heading */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
                Travel More,
                <span className="block text-green-200">Spend Less!</span>
              </h1>

              {/* Subheading */}
              <p className="text-lg md:text-xl lg:text-2xl text-green-100 max-w-4xl mx-auto mb-10 leading-relaxed">
                Save up to 70% on flights and hotels from Irish airports. 60+
                exclusive deals added monthly.
              </p>

              {/* Stats Boxes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10 max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                >
                  <div className="text-4xl font-bold text-white mb-2">60+</div>
                  <div className="text-green-200">New Deals Monthly</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                >
                  <div className="text-4xl font-bold text-white mb-2">70%</div>
                  <div className="text-green-200">Maximum Savings</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                >
                  <div className="text-4xl font-bold text-white mb-2">6</div>
                  <div className="text-green-200">Irish Airports</div>
                </motion.div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  onClick={() => navigate("/signup")}
                  className="group bg-white text-green-700 px-8 py-4 rounded-xl hover:bg-green-50 transition-all duration-300 font-semibold text-base shadow-xl transform hover:scale-105 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Access All Deals - ONLY €9.99/year
                </motion.button>

                <motion.button
                  onClick={() => navigate("/login")}
                  className="bg-green-500 text-white px-8 py-4 rounded-xl hover:bg-green-600 transition-all duration-300 font-semibold text-base flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Already a Member? Sign In
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Sample Deals Preview Section */}
        <section className="py-10 sm:py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 sm:mb-12"
            >
              {/* Badge */}
              <div className="inline-block bg-green-100 text-green-700 px-5 py-2 rounded-full font-semibold mb-4 sm:mb-6 text-sm">
                Sample Deals Preview
              </div>

              <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto mb-4 sm:mb-6">
                Here&apos;s a taste of the incredible deals our members get
                access to every month
              </p>
            </motion.div>

            {/* Carousel Container */}
            {loadingFeaturedDeals ? (
              <div className="max-w-4xl mx-auto mb-8 sm:mb-12 flex items-center justify-center" style={{ height: "550px" }}>
                <Spinner />
              </div>
            ) : featuredDealsError ? (
              <div className="max-w-4xl mx-auto mb-8 sm:mb-12 flex items-center justify-center" style={{ height: "550px" }}>
                <p className="text-gray-500 text-lg">{featuredDealsError}</p>
              </div>
            ) : (
            <div className="relative max-w-4xl mx-auto mb-8 sm:mb-12">
              {/* ✅ FIX: fixed height instead of minHeight so card never jumps */}
              <button
                onClick={prevSlide}
                className="absolute -left-6 md:-left-6 top-[275px] -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all z-10 group"
                aria-label="Previous deal"
              >
                <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute -right-6 md:-right-6 top-[275px] -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all z-10 group"
                aria-label="Next deal"
              >
                <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>

              <div
                className="relative overflow-hidden rounded-2xl"
                style={{ height: "550px" }}
              >
                <AnimatePresence
                  initial={false}
                  custom={slideDirection}
                  mode="wait"
                >
                  <motion.div
                    key={currentSlide}
                    custom={slideDirection}
                    initial={{ opacity: 0, x: slideDirection > 0 ? 300 : -300 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: slideDirection > 0 ? -300 : 300 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="w-full h-full"
                  >
                    {/* Deal Card */}
                    <div className="bg-gray-50 rounded-2xl shadow-xl overflow-hidden h-full">
                      <div className="grid md:grid-cols-2 gap-0 h-full">
                        {/* Image Section */}
                        <div className="relative h-64 md:h-[550px]">
                          <img
                            src={sampleDeals[currentSlide].image}
                            alt={sampleDeals[currentSlide].title}
                            className="w-full h-full object-cover"
                          />
                          {/* Featured Badge */}
                          {sampleDeals[currentSlide].featured && (
                            <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center shadow-lg">
                              <Star className="w-4 h-4 mr-1 fill-white" />
                              Featured
                            </div>
                          )}
                          {/* Discount Badge */}
                          {sampleDeals[currentSlide].discount > 0 && (
                            <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                              -{sampleDeals[currentSlide].discount}% OFF
                            </div>
                          )}
                          {/* Price Badge */}
                          <div className="absolute bottom-4 right-4 bg-green-600 text-white px-5 py-3 rounded-xl font-bold text-2xl shadow-lg">
                            €
                            {sampleDeals[currentSlide].discount > 0
                              ? calculateDiscountedPrice(
                                  sampleDeals[currentSlide].price,
                                  sampleDeals[currentSlide].discount,
                                )
                              : sampleDeals[currentSlide].price}
                            {sampleDeals[currentSlide].discount > 0 && (
                              <span className="block text-xs line-through opacity-80">
                                €{sampleDeals[currentSlide].price}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* ✅ FIX: h-full + overflow-hidden instead of min-h-[500px] */}
                        <div className="p-6 sm:p-8 flex flex-col justify-between h-full overflow-hidden">
                          {/* ✅ FIX: overflow-hidden on flex-1 so long text never pushes height */}
                          <div className="flex-1 overflow-hidden">
                            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                              {sampleDeals[currentSlide].title}
                            </h3>
                            <div className="flex items-center text-green-600 mb-4">
                              <MapPin className="w-5 h-5 mr-2" />
                              <span className="font-semibold">
                                {sampleDeals[currentSlide].destination}
                              </span>
                            </div>
                            <p className="text-gray-600 leading-relaxed mb-6 line-clamp-4 hidden md:block">
                              {sampleDeals[currentSlide].description}
                            </p>
                            <div className="bg-green-50 rounded-xl p-4 mb-6 hidden md:block">
                              <div className="text-sm text-gray-600 mb-1">
                                Travel Dates
                              </div>
                              <div className="font-semibold text-gray-900">
                                {formatDateRange(
                                  sampleDeals[currentSlide].travelStartDate,
                                  sampleDeals[currentSlide].travelEndDate,
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Locked CTA */}
                          <div className="space-y-3 flex-shrink-0">
                            <button
                              className="w-full bg-gray-300 text-gray-500 px-6 py-4 rounded-xl font-semibold text-base flex items-center justify-center cursor-not-allowed"
                              disabled
                            >
                              <Lock className="w-5 h-5 mr-2" />
                              Members Only
                            </button>
                            <button
                              onClick={() => navigate("/signup")}
                              className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl font-semibold text-base flex items-center justify-center transform hover:scale-105 transition-all shadow-lg"
                            >
                              <UserPlus className="w-5 h-5 mr-2" />
                              Join to Book - €9.99/year
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Carousel Indicators */}
              <div className="flex justify-center gap-3 mt-6">
                {sampleDeals.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentSlide
                        ? "bg-green-600 w-8 h-3"
                        : "bg-gray-300 hover:bg-gray-400 w-3 h-3"
                    }`}
                    aria-label={`Go to deal ${index + 1}`}
                  />
                ))}
              </div>

              {/* Deal Counter */}
              <div className="text-center mt-4 text-gray-600 font-medium">
                Deal {currentSlide + 1} of {sampleDeals.length}
              </div>
            </div>
            )}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 sm:py-16 md:py-24 bg-linear-to-br from-green-50 to-green-100">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10 sm:mb-14 md:mb-20"
            >
              {/* Badge */}
              <div className="inline-block bg-green-100 text-green-700 px-6 py-2 rounded-full font-semibold mb-6">
                Member Benefits
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-gray-900">
                Why Choose Our Deals?
              </h2>
              <div className="w-24 h-1 bg-linear-to-r from-green-500 to-green-700 mx-auto mb-6 sm:mb-8"></div>
            </motion.div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-0">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-center group"
              >
                <div className="w-20 h-20 bg-linear-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">
                  Verified Deals
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Only deals from reputable airlines and booking sites
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-center group"
              >
                <div className="w-20 h-20 bg-linear-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <span className="text-white font-bold text-lg">0€</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">
                  No Hidden Fees
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Transparent pricing with no booking fees
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-center group"
              >
                <div className="w-20 h-20 bg-linear-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <MapPin className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">
                  All Irish Airports
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Deals from Dublin, Cork, Shannon, and more
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-center group"
              >
                <div className="w-20 h-20 bg-linear-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Gift className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">
                  Monthly Giveaways
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  A chance to win a free trip every month
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-12 sm:py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10 sm:mb-14 md:mb-20"
            >
              {/* Badge */}
              <div className="inline-block bg-green-100 text-green-700 px-6 py-2 rounded-full font-semibold mb-6">
                Member Reviews
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-gray-900">
                What Our Members Say
              </h2>
              <div className="w-24 h-1 bg-linear-to-r from-green-500 to-green-700 mx-auto mb-6 sm:mb-8"></div>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Join thousands of satisfied travelers saving money on their
                holidays
              </p>
            </motion.div>

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto mb-10 sm:mb-12 md:mb-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 hover:scale-105 duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-emerald-700 font-bold text-lg">
                      M
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Mary K.</h4>
                    <p className="text-sm text-gray-500">Dublin Member</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed">
                  "Saved €300 on our Rome trip! The deals are incredible and
                  always legitimate."
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 hover:scale-105 duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-teal-700 font-bold text-lg">J</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">James O.</h4>
                    <p className="text-sm text-gray-500">Cork Member</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed">
                  "Best €9.99 I've ever spent! Already saved more than 10x the
                  membership cost."
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 hover:scale-105 duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-purple-700 font-bold text-lg">S</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Sarah L.</h4>
                    <p className="text-sm text-gray-500">Galway Member</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed">
                  "Honestly, I was skeptical at first. But within two weeks, I
                  got an insane deal on flights to Lisbon—cheaper than anything
                  I found elsewhere. The guides are super handy too, and
                  everything feels tailored to me (even the offers are from my
                  nearest airport!) If you're mad for travel and a good bargain,
                  this is the place. Oh, and I'm manifesting that free trip this
                  month 🤞"
                </p>
              </motion.div>
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <motion.button
                onClick={() => navigate("/signup")}
                className="group inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-100"
                whileHover={{ scale: 1.0 }}
                whileTap={{ scale: 0.95 }}
              >
                <UserPlus className="w-6 h-6 mr-3 group-hover:bounce" />
                Join Our Happy Members
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="relative bg-linear-to-br from-green-800 via-green-700 to-green-600 text-white py-12 sm:py-16 md:py-24 overflow-hidden">
          {/* Decorative Background Blobs */}
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-16 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-1/2 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              {/* Badge */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center bg-white/20 backdrop-blur-sm px-8 py-3 rounded-full text-white font-semibold mb-8 border border-white/30"
              >
                Start Saving Today
              </motion.div>

              {/* Heading */}
              <h2 className="text-5xl md:text-6xl font-bold mb-8 text-white leading-tight">
                Ready to Save Big?
              </h2>

              {/* Description */}
              <p className="text-xl md:text-2xl text-green-100 mb-12 leading-relaxed max-w-3xl mx-auto">
                Join thousands of smart travelers who are saving money on every
                trip.
                <span className="block mt-2 font-bold text-white">
                  Your next adventure awaits!
                </span>
              </p>

              {/* CTA Button */}
              <motion.button
                onClick={() => navigate("/signup")}
                className="group inline-flex items-center bg-white text-green-700 px-12 py-6 rounded-2xl hover:bg-green-50 transition-all duration-300 font-bold text-xl shadow-2xl transform hover:scale-101"
                whileHover={{ scale: 1.01, y: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Your Membership ONLY €9.99/year
              </motion.button>
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  // ==================== MEMBER VIEW (Authenticated) ====================
  
  // Show error state
  if (isAuthenticated && errorAllDeals && allDeals.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
        <p className="text-gray-700 text-lg mb-4">{errorAllDeals}</p>
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
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-emerald-50/20 relative overflow-hidden px-4 sm:px-6 lg:px-8 py-24 sm:py-24">
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto  relative z-10">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-full mb-6 mt-10"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <span className="text-sm font-semibold text-emerald-700">
              Exclusive Member Deals
            </span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-slate-900 mb-4 leading-tight">
            Travel Deals from Irish Airports
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
            Save More, Travel Smarter
          </p>
        </motion.div>

        {/* Info Card */}
        <motion.div
          className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/60 p-8 sm:p-10 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <p className="text-slate-700 leading-relaxed mb-6 text-center sm:text-left">
            We get it — you want a break without breaking the bank. At Travel in
            a Click, we believe everyone deserves a holiday, even when times are
            tight. That's why we work hard to find the best-value travel deals
            flying out of Irish airports every single month.
          </p>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mt-0.5">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">
                  Only the Best Offers
                </h3>
                <p className="text-sm text-slate-600">
                  We only share offers from reputable booking sites or airlines.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="shrink-0 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mt-0.5">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">
                  No Hidden Fees
                </h3>
                <p className="text-sm text-slate-600">
                  No hidden fees or gimmicks – just great value.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="shrink-0 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mt-0.5">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Book Directly</h3>
                <p className="text-sm text-slate-600">
                  You book directly — we simply show you where the savings are.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Airport Filter Pills - Scrollable with Arrows */}
        <motion.div
          ref={gridSectionRef}
          className="relative mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {/* Left Arrow */}
          <button
            onClick={() => scrollTabs("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors lg:hidden"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Scrollable Tabs Container */}
          <div
            ref={tabsContainerRef}
            className="flex items-center gap-3 overflow-x-auto scrollbar-hide px-12 lg:px-0 lg:flex-wrap lg:justify-center lg:overflow-visible"
          >
            {airports.map((airport) => (
              <motion.button
                key={airport}
                onClick={() => {
                  setActiveAirport(airport);
                  setCurrentPage(1);
                }}
                className={`px-6 py-3 rounded-full font-bold text-sm sm:text-base transition-all duration-300 whitespace-nowrap shrink-0 ${
                  activeAirport === airport
                    ? "bg-slate-900 text-white shadow-lg scale-105"
                    : "bg-white text-slate-700 hover:bg-slate-100 shadow-md hover:shadow-lg"
                }`}
                whileHover={{ scale: activeAirport === airport ? 1.05 : 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                {airport}
              </motion.button>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scrollTabs("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors lg:hidden"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Deals Grid - Masonry Style */}
        {loadingAllDeals ? (
          <div className="flex items-center justify-center py-24">
            <Spinner />
          </div>
        ) : !loadingAllDeals && allDeals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No Deals Available</h3>
            <p className="text-slate-500">There are currently no deals for <span className="font-semibold">{activeAirport}</span>. Check back soon!</p>
          </div>
        ) : (
        <AnimatePresence mode="sync">
          <motion.div
            key={activeAirport}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredDeals.map((deal) => (
              <motion.div
                key={deal.id}
                variants={cardVariants}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col"
                whileHover={{ y: -12, scale: 1.02 }}
                onClick={() => navigate(`/travel-deals/${deal.id}`)}
              >
                {/* Featured Badge */}
                {(deal.isFeatured || deal.featured) && (
                  <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Featured
                  </div>
                )}

                {/* Floating Price Badge */}
                <div className="absolute top-4 right-4 z-20 px-4 py-2 bg-emerald-600 text-white rounded-2xl shadow-2xl backdrop-blur-sm">
                  {deal.discount > 0 ? (
                    <>
                      <div className="text-sm line-through opacity-75">
                        €{deal.price}
                      </div>
                      <div className="text-2xl font-bold">
                        €{calculateDiscountedPrice(deal.price, deal.discount)}
                      </div>
                      <div className="text-xs opacity-90">
                        {deal.discount}% OFF
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-2xl font-bold">€{deal.price}</div>
                      <div className="text-xs opacity-90">per person</div>
                    </>
                  )}
                </div>

                {/* Image with Overlay */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={deal.dealImage || deal.image}
                    alt={deal.destination}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Destination Badge */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                    <MapPin className="w-5 h-5" />
                    <span className="text-lg font-bold">
                      {deal.destination}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col grow">
                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                    {deal.title}
                  </h3>

                  {/* Duration */}
                  <div className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full mb-3">
                    {formatDateRange(deal.travelStartDate, deal.travelEndDate)}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 leading-relaxed mb-6 line-clamp-3 grow">
                    {deal.description}
                  </p>

                  {/* CTA Button */}
                  <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group-hover:from-emerald-700 group-hover:to-teal-700 mt-auto">
                    View Deal Details
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        )}

        {/* Pagination */}
        {totalDeals > 0 && (
          <motion.div
            className="mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Pagination
              currentPage={currentPage}
              totalPages={totalDealPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                setScrollTrigger(t => t + 1);
              }}
              totalItems={totalDeals}
              itemsPerPage={ITEMS_PER_PAGE}
              itemLabel="deals"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TravelDealsPage;
