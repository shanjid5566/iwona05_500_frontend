import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, Plane, Hotel, ExternalLink, Sparkles, Tag, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import { useUser } from '../../../context/context.hooks';
import { travelDealsService, paymentService } from '../../../services/api.services';
import Spinner from '../../../components/common/Spinner';
import ConfirmationModal from '../../../components/common/ConfirmationModal';

/**
 * TravelDealDetail - Individual deal page with detailed information
 * Fetches deal data from API based on dealSlug (deal ID)
 */
const TravelDealDetail = () => {
  const { dealSlug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useUser();
  const hasShownToast = useRef(false);
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [isRenewing, setIsRenewing] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !hasShownToast.current) {
      hasShownToast.current = true;
      toast.info('Please login to access Travel Deals.');
      navigate('/login', { state: { from: `/travel-deals/${dealSlug}` } });
    }
  }, [isAuthenticated, navigate, dealSlug]);

  // Redirect INACTIVE/PENDING users to dashboard with renewal prompt
  useEffect(() => {
    if (isAuthenticated && (user?.status === 'INACTIVE' || user?.status === 'PENDING')) {
      toast.warning('Please renew your subscription to access Travel Deals.');
      navigate('/dashboard');
    }
  }, [isAuthenticated, user?.status, navigate]);

  // Fetch deal from API
  useEffect(() => {
    const fetchDeal = async () => {
      try {
        setLoading(true);
        const response = await travelDealsService.getDealById(dealSlug);
        if (response.success && response.data && response.data.deal) {
          setDeal(response.data.deal);
        }
      } catch (error) {
        console.error('Error fetching deal:', error);
        setError('Failed to load travel deal');
      } finally {
        setLoading(false);
      }
    };

    if (dealSlug && isAuthenticated) {
      fetchDeal();
    }
  }, [dealSlug, isAuthenticated]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner />
      </div>
    );
  }

  // Show error state
  if (error || !deal) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-gray-700 text-lg mb-4">{error || 'Deal not found'}</p>
        <button
          onClick={() => navigate('/travel-deals')}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Back to Deals
        </button>
      </div>
    );
  }

  // Calculate discounted price
  const calculateDiscountedPrice = (price, discount) => {
    if (discount > 0) {
      return (price - (price * discount / 100)).toFixed(2);
    }
    return price.toFixed(2);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Calculate nights
  const calculateNights = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return nights;
  };

  // Handle booking - check if user is expired
  const handleBooking = (e, bookingLink) => {
    if (user?.status === 'INACTIVE') {
      e.preventDefault();
      setShowRenewalModal(true);
      return;
    }
    // If active, allow normal booking (link will open)
  };

  // Handle subscription renewal
  const handleRenewSubscription = async () => {
    try {
      setIsRenewing(true);
      const response = await paymentService.createCheckoutSession({ amount: 999 });
      
      if (response.success && response.data?.url) {
        // Redirect to Stripe checkout
        window.location.href = response.data.url;
      } else {
        toast.error(response.message || 'Failed to create checkout session');
        setIsRenewing(false);
      }
    } catch (error) {
      console.error('Renewal error:', error);
      toast.error(error.response?.data?.message || 'Failed to initiate renewal. Please try again.');
      setIsRenewing(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-emerald-50/20">
      {/* Hero Section with Image */}
      <div className="relative h-[60vh] overflow-hidden">
        <img
          src={deal.dealImage}
          alt={deal.destination}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Featured Badge */}
        {deal.isFeatured && (
          <div className="absolute top-8 right-8 px-4 py-2 bg-amber-500 text-white font-bold rounded-full shadow-2xl flex items-center gap-2 z-20">
            <Sparkles className="w-4 h-4" />
            Featured Deal
          </div>
        )}


        {/* Deal Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-emerald-400" />
                <span className="text-lg text-white font-semibold">{deal.destination}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white mb-6">
                {deal.title}
              </h1>
              <div className="flex items-baseline gap-4">
                {deal.discount > 0 ? (
                  <>
                    <span className="text-3xl text-white/60 line-through">€{deal.price.toFixed(2)}</span>
                    <span className="text-5xl font-bold text-emerald-400">€{calculateDiscountedPrice(deal.price, deal.discount)}</span>
                    <span className="px-3 py-1 bg-amber-500 text-white text-sm font-bold rounded-full">
                      {deal.discount}% OFF
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-5xl font-bold text-emerald-400">€{deal.price.toFixed(2)}</span>
                    <span className="text-xl text-white/80">per person</span>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column - Deal Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div
              className="bg-white rounded-2xl p-8 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-4">About This Deal</h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                {deal.description}
              </p>
            </motion.div>

            {/* Travel Dates & Airport */}
            <motion.div
              className="bg-white rounded-2xl p-8 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Travel Information</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Calendar className="w-6 h-6 text-emerald-600 mt-1" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Travel Dates</h3>
                    <p className="text-slate-600">
                      {formatDate(deal.travelStartDate)} - {formatDate(deal.travelEndDate)}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      {calculateNights(deal.travelStartDate, deal.travelEndDate) === 0 
                        ? '1-Day Trip' 
                        : `${calculateNights(deal.travelStartDate, deal.travelEndDate)} night${calculateNights(deal.travelStartDate, deal.travelEndDate) > 1 ? 's' : ''}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-emerald-600 mt-1" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Departure Airport</h3>
                    <p className="text-slate-600">{deal.airport || deal.destination}</p>
                  </div>
                </div>

                {deal.discount > 0 && (
                  <div className="flex items-start gap-4">
                    <Tag className="w-6 h-6 text-amber-600 mt-1" />
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">Special Discount</h3>
                      <p className="text-slate-600">Save {deal.discount}% on this deal</p>
                      <p className="text-sm text-slate-500 mt-1">
                        Original Price: €{deal.price.toFixed(2)} | Discounted: €{calculateDiscountedPrice(deal.price, deal.discount)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-2xl sticky top-8 border-2 border-emerald-100"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Premium Badge */}
              <div className="flex items-center justify-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4">
                <span className="text-base font-semibold text-emerald-700">Exclusive Member Deal</span>
              </div>

              {/* Price */}
              <div className="text-center mb-5 pb-5 border-b border-slate-200">
                {deal.discount > 0 ? (
                  <>
                    <div className="text-xl text-slate-400 line-through mb-1">€{deal.price.toFixed(2)}</div>
                    <div className="text-4xl font-bold text-slate-900 mb-2">€{calculateDiscountedPrice(deal.price, deal.discount)}</div>
                    <div className="inline-block px-2.5 py-1 bg-amber-500 text-white text-xs font-bold rounded-full mb-1">
                      Save {deal.discount}%
                    </div>
                    <div className="text-sm text-slate-600">per person</div>
                  </>
                ) : (
                  <>
                    <div className="text-4xl font-bold text-slate-900 mb-1">€{deal.price.toFixed(2)}</div>
                    <div className="text-sm text-slate-600">per person</div>
                  </>
                )}
              </div>

              {/* Quick Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-slate-700">
                  <Calendar className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-semibold text-base">
                      {calculateNights(deal.travelStartDate, deal.travelEndDate) === 0 
                        ? '1-Day Trip' 
                        : `${calculateNights(deal.travelStartDate, deal.travelEndDate)} night${calculateNights(deal.travelStartDate, deal.travelEndDate) > 1 ? 's' : ''}`}
                    </div>
                    <div className="text-sm text-slate-500">
                      {new Date(deal.travelStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(deal.travelEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <MapPin className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-semibold text-base">{deal.airport || deal.destination}</div>
                    <div className="text-sm text-slate-500">Departure Airport</div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-4">
                {deal.flightBookingLink && (
                  <a
                    href={deal.flightBookingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleBooking(e, deal.flightBookingLink)}
                    className={`w-full flex items-center justify-center gap-2 px-5 py-3 font-bold rounded-xl shadow-lg transition-all duration-300 ${
                      user?.status === 'INACTIVE'
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-linear-to-r from-emerald-600 to-teal-600 text-white hover:shadow-xl hover:from-emerald-700 hover:to-teal-700'
                    }`}
                  >
                    {user?.status === 'INACTIVE' ? (
                      <>
                        <Lock className="w-4 h-4" />
                        Subscription Required
                      </>
                    ) : (
                      <>
                        <Plane className="w-4 h-4" />
                        Book Flights
                      </>
                    )}
                  </a>
                )}

                {deal.hotelBookingLink && (
                  <a
                    href={deal.hotelBookingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleBooking(e, deal.hotelBookingLink)}
                    className={`w-full flex items-center justify-center gap-2 px-5 py-3 font-bold rounded-xl shadow-lg transition-all duration-300 ${
                      user?.status === 'INACTIVE'
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-white text-emerald-700 border-2 border-emerald-600 hover:shadow-xl hover:bg-emerald-50'
                    }`}
                  >
                    {user?.status === 'INACTIVE' ? (
                      <>
                        <Lock className="w-4 h-4" />
                        Subscription Required
                      </>
                    ) : (
                      <>
                        <Hotel className="w-4 h-4" />
                        Book Hotel
                      </>
                    )}
                  </a>
                )}
              </div>

              <p className="text-sm md:text-base text-slate-500 text-center mt-4">
                You will be redirected to the travel provider’s website to complete your booking.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      {/* Renewal Modal for Expired Users */}
      <ConfirmationModal
        isOpen={showRenewalModal}
        onClose={() => setShowRenewalModal(false)}
        onConfirm={handleRenewSubscription}
        title="Subscription Required"
        message="Your subscription has expired. Please renew to book this deal and access exclusive travel content."
        confirmText={isRenewing ? "Renewing..." : "Renew Now - €9.99/year"}
        cancelText="Maybe Later"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />    </div>
  );
};

export default TravelDealDetail;
