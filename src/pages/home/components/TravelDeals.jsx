import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../../../context/context.hooks";
import { travelDealsService } from "../../../services/api.services";
import Spinner from "../../../components/common/Spinner";

/**
 * TravelDeals Component
 * Premium Travel Deals Section with responsive carousel
 */
const TravelDeals = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();

  // Fetch deals from API based on authentication status
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        let response;

        if (isAuthenticated) {
          // Authenticated users: fetch all deals
          response = await travelDealsService.getAllDeals({
            page: 1,
            limit: 10,
            search: '',
            sortBy: 'createdAt',
            sortOrder: 'desc',
          });
        } else {
          // Non-authenticated users: fetch featured deals only
          response = await travelDealsService.getFeaturedDeals({
            page: 1,
            limit: 10,
          });
        }

        if (response.success && response.data.deals) {
          // Transform API response to match component structure
          let dealsToDisplay = response.data.deals;
          
          // For authenticated users, show only last 3 deals
          if (isAuthenticated && dealsToDisplay.length > 3) {
            dealsToDisplay = dealsToDisplay.slice(-3);
          }

          const transformedDeals = dealsToDisplay.map((deal) => ({
            id: deal.id,
            image: deal.dealImage,
            title: deal.title,
            subtitle: deal.destination,
            description: deal.description.split("\r\n")[0] || deal.description,
            price: `€${deal.price}`,
          }));
          setDeals(transformedDeals);
        }
      } catch (error) {
        console.error("Error fetching deals:", error);
        setDeals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [isAuthenticated]);

  // Responsive cards per view
  useEffect(() => {
    const updateCardsPerView = () => {
      const newCardsPerView =
        window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
      setCardsPerView((prev) => {
        if (prev !== newCardsPerView) {
          setCurrentIndex(0); // Reset index when cards per view changes
        }
        return newCardsPerView;
      });
    };

    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  const maxIndex = deals.length - cardsPerView;

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const handleCardClick = (dealId) => {
    if (isAuthenticated) {
      // Navigate to deal details page if authenticated
      navigate(`/travel-deals/${dealId}`);
    } else {
      // Show alert at top-right and redirect to login if not authenticated
      toast.info("Please login to view deal details", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/login", { state: { from: `/travel-deals/${dealId}` } });
    }
  };

  return (
    <section className="py-20  bg-white px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0f172a] mb-4">
            Explore Our Latest Travel Deals
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            These are actual travel deals our members have access to. Join today
            to book these and hundreds more.
          </p>
        </motion.div>
        {/* Carousel Container */}
        {!loading && deals.length > 0 ? (
          <div className="relative">
            {/* Left Arrow - Outside container */}
            {currentIndex > 0 && (
              <motion.button
                onClick={handlePrev}
                className="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors z-20"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Previous deal"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </motion.button>
            )}

            {/* Right Arrow - Outside container */}
            {currentIndex < maxIndex && (
              <motion.button
                onClick={handleNext}
                className="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors z-20"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Next deal"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </motion.button>
            )}

            {/* Cards Container with Overflow */}
            <div className="overflow-hidden">
              <motion.div
                className="flex gap-8"
                animate={{
                  x: `calc(-${currentIndex * (100 / cardsPerView)}% - ${currentIndex * 2}rem)`,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              >
                {deals.map((deal) => (
                  <motion.div
                    key={deal.id}
                    onClick={() => handleCardClick(deal.id)}
                    className="shrink-0 bg-white border border-gray-200 rounded-xl shadow-sm transition-all duration-300 overflow-hidden group cursor-pointer"
                    style={{
                      width: `calc(${100 / cardsPerView}% - ${(cardsPerView - 1) * 2}rem / ${cardsPerView})`,
                    }}
                    whileHover={{
                      y: -8,
                      boxShadow:
                        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {/* Image Container */}
                    <div className="aspect-4/3 overflow-hidden">
                      <img
                        src={deal.image}
                        alt={deal.title}
                        className="w-full h-full object-cover rounded-t-xl transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      {/* Title */}
                      <h3 className="text-xl font-bold text-[#0f172a] mb-2">
                        {deal.subtitle}
                      </h3>

                      {/* Subtitle */}
                      <p className="text-sm text-gray-600 mb-3">
                        {deal.title}
                      </p>

                      {/* Description */}
                      <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
                        {deal.description}
                      </p>

                      {/* Price */}
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-olive">
                          {deal.price}
                        </span>
                        <span className="text-sm text-gray-600">
                          per person
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <Spinner />
          </div>
        )}
        {/* CTA Section */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {isAuthenticated ? (
            /* View All Travel Deals Button - for authenticated users */
            <motion.button
              onClick={() => navigate("/travel-deals")}
              className="px-10 py-4 rounded-full bg-orange text-white font-bold hover:bg-[#A86605] transition-colors duration-300 shadow-lg text-base sm:text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Travel Deals
            </motion.button>
          ) : (
            /* Join Button - for non-authenticated users */
            <>
              <motion.button
                onClick={() => navigate("/signup")}
                className="px-10 py-4 rounded-full bg-olive text-white font-bold hover:bg-[#6a6d4a] transition-colors duration-300 shadow-lg text-base sm:text-lg mb-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                JOIN NOW FOR ONLY €9.99 / YEAR
              </motion.button>

              {/* Details Text */}
              <p className="text-sm text-gray-600">
                Only €9.99/year • Cancel anytime • New deals added weekly
              </p>
            </>
          )}
        </motion.div>{" "}
      </div>
    </section>
  );
};

export default TravelDeals;
