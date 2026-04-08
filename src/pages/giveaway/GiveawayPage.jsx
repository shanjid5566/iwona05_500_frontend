import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Clock, CheckCircle, UserPlus, Calendar, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUser } from '../../context/context.hooks';
import { giveawaysService, paymentService } from '../../services/api.services';
import Spinner from '../../components/common/Spinner';
import ConfirmationModal from '../../components/common/ConfirmationModal';

/**
 * Monthly Giveaway Page
 * Displays active giveaways fetched from API or empty state
 */

const GiveawayPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useUser();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
  const [giveaway, setGiveaway] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [entering, setEntering] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [isRenewing, setIsRenewing] = useState(false);

  // Redirect INACTIVE/PENDING users to dashboard
  useEffect(() => {
    if (isAuthenticated && (user?.status === 'INACTIVE' || user?.status === 'PENDING')) {
      toast.warning('Please renew your subscription to enter giveaways.');
      navigate('/dashboard');
    }
  }, [isAuthenticated, user?.status, navigate]);

  // Fetch active giveaway (public for visitors, authenticated for members)
  useEffect(() => {
    const fetchActiveGiveaway = async () => {
      try {
        setLoading(true);
        
        // Check if user is ACTIVE - only ACTIVE users get premium features
        const isActiveUser = isAuthenticated && user?.status === 'ACTIVE';
        
        if (isActiveUser) {
          // ACTIVE users - fetch with entry status using giveawaysService
          const response = await giveawaysService.checkEntryStatus();
          
          if (response.success && response.data) {
            setGiveaway(response.data.giveaway);
            setHasEntered(response.data.hasEntered || false);
          } else {
            setGiveaway(null);
            setHasEntered(false);
            setError(response.message || 'Failed to load giveaway');
          }
        } else {
          // Visitors and INACTIVE/PENDING users - fetch public giveaway
          const response = await giveawaysService.getPublicActiveGiveaway();
          
          if (response.success && response.data && response.data.giveaway) {
            setGiveaway(response.data.giveaway);
          } else {
            setGiveaway(null);
          }
        }
      } catch (error) {
        console.error('Error fetching active giveaway:', error);
        setError('Failed to load giveaway');
      } finally {
        setLoading(false);
      }
    };

    fetchActiveGiveaway();
  }, [isAuthenticated, user?.status]);

  // Countdown timer logic
  useEffect(() => {
    if (!giveaway || !giveaway.endDate) return;

    const calculateTimeLeft = () => {
      const difference = new Date(giveaway.endDate) - new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [giveaway]);

  const handleEnterGiveaway = async () => {
    // Check if user subscription is expired
    if (user?.status === 'INACTIVE') {
      setShowRenewalModal(true);
      return;
    }
    
    if (!giveaway || !giveaway.id) return;
    
    // Prevent multiple entries
    if (hasEntered) {
      toast.info('You have already entered this giveaway!');
      return;
    }
    
    try {
      setEntering(true);
      
      // Use giveawaysService for consistent API calls with automatic auth
      const response = await giveawaysService.enterGiveaway(giveaway.id);
      
      if (response.success) {
        toast.success('Good luck! You have successfully entered the giveaway.');
        // Update state after successful entry
        setHasEntered(response.data.hasEntered || true);
      } else {
        toast.error(response.message || 'Failed to enter giveaway');
      }
    } catch (error) {
      console.error('Error entering giveaway:', error);
      
      // Check if error is due to expired subscription
      if (error.response?.status === 403) {
        setShowRenewalModal(true);
      } else {
        toast.error(error.response?.data?.message || 'Failed to enter giveaway. Please try again.');
      }
    } finally {
      setEntering(false);
    }
  };

  // Handle subscription renewal from modal
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

  // INACTIVE/PENDING USERS - Will be redirected to dashboard (handled in useEffect above)
  // This section won't render as they'll be redirected

  // VISITOR VIEW - Not logged in (real guests)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8" style={{
          background: 'linear-gradient(145deg, #7a7d5a 0%, #8B7355 50%, #BD7706 100%)'
        }}>
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-black/20 rounded-full blur-3xl" />
          </div>
          
          <div className="relative container mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-8">
                <Gift className="w-4 h-4 text-white mr-2" />
                <span className="text-sm font-medium text-white">Monthly Giveaways</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                YOUR NEXT TRIP COULD BE<br />FREE
              </h1>
              
              <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                Every month, one lucky member wins a free trip on us. Could it be you?
              </p>
              
              <motion.button
                onClick={() => navigate('/signup')}
                className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-bold rounded-full shadow-xl hover:bg-gray-100 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Join Now - ONLY €9.99/year
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* This Month's Prize */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                This Month&apos;s Prize
              </h2>
            </motion.div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Spinner />
              </div>
            ) : giveaway ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                {/* Prize Image */}
                <div className="relative">
                  <img
                    src={giveaway.giveawayImage}
                    alt={giveaway.title}
                    className="w-full h-64 sm:h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                      {giveaway.title}
                    </h3>
                    <p className="text-white/90">
                      Ends: {new Date(giveaway.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* What's Included */}
                <div className="p-8 border-t border-gray-200">
                  <h4 className="text-2xl font-bold text-gray-900 mb-6">
                    What&apos;s Included:
                  </h4>
                  <div className="space-y-4 text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {giveaway.description}
                  </div>

                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <h4 className="text-2xl font-bold text-gray-900 mb-6">
                      How to Enter:
                    </h4>
                    <ol className="space-y-4 text-gray-700">
                      <li className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm">1</span>
                        <span>Be a registered Travel in a Click member with an active subscription.</span>
                      </li>
                      <li className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm">2</span>
                        <span>Click the &quot;Enter Now&quot; button on this page to submit your entry.</span>
                      </li>
                      <li className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm">3</span>
                        <span>Cross your fingers! The winner will be announced on the 1st of next month via email and on our website.</span>
                      </li>
                    </ol>
                    <div className="mt-6 space-y-2 text-sm text-gray-500">
                      <p>* One entry per person. Terms & Conditions apply.</p>
                      <p>* Winner will be randomly selected on the 1st of next month.</p>
                    </div>
                  </div>

                  {/* CTA for non-members */}
                  <div className="mt-8 p-6 bg-gray-50 rounded-xl text-center">
                    <p className="text-gray-700 mb-4">
                      To enter this giveaway, you need to be a member
                    </p>
                    <button
                      onClick={() => navigate('/signup')}
                      className="px-8 py-3 rounded-full font-bold text-white transition-all duration-300 hover:scale-105"
                      style={{ backgroundColor: '#7a7d5a' }}
                    >
                      Become a Member - ONLY €9.99/year
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  number: '1',
                  title: 'Join as Member',
                  description: 'Sign up for ONLY €9.99/year and get access to exclusive travel deals',
                  icon: UserPlus,
                },
                {
                  number: '2',
                  title: 'Enter the Giveaway',
                  description: 'One click to enter each month\'s giveaway - it\'s that simple!',
                  icon: Calendar,
                },
                {
                  number: '3',
                  title: 'Win & Travel',
                  description: 'Winner announced monthly - could be YOU!',
                  icon: Trophy,
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 text-white rounded-full text-2xl font-bold mb-6">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8" style={{
          background: 'linear-gradient(135deg, #7a7d5a 0%, #8B7355 50%, #BD7706 100%)'
        }}>
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/30 rounded-full blur-3xl" />
          </div>
          
          <div className="relative container mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                READY TO WIN YOUR DREAM TRIP?
              </h2>
              
              <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of members who are already enjoying exclusive deals and entering monthly giveaways
              </p>
              
              <motion.button
                onClick={() => navigate('/signup')}
                className="inline-flex items-center px-10 py-4 bg-white text-gray-900 font-bold rounded-full shadow-xl hover:bg-gray-100 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* <Gift className="w-5 h-5 mr-2" /> */}
                Start Winning - ONLY €9.99/year
              </motion.button>
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  // LOGGED-IN ACTIVE USER VIEW - Only for users with ACTIVE subscription
  if (isAuthenticated && user?.status === 'ACTIVE') {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <Spinner />
        </div>
      );
    }

    if (error) {
      return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
          <p className="text-gray-700 text-lg mb-4">{error}</p>
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
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-6 py-24">
          {/* Page Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Monthly Giveaways
            </h1>
          </motion.div>

          <AnimatePresence mode="wait">
            {giveaway ? (
              // Active Giveaway State
              <motion.div
                key="active"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {/* Left Column - Prize Image */}
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                      <img
                        src={giveaway.giveawayImage}
                        alt={giveaway.title}
                        className="w-full h-96 lg:h-[500px] object-cover"
                      />
                      {/* Active Badge */}
                      <div className="absolute top-6 left-6">
                        <span className="px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-2">
                          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          ACTIVE NOW
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Right Column - Details & Entry */}
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    {/* Prize Title */}
                    <div>
                      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        {giveaway.title}
                      </h2>
                      <p className="text-lg text-gray-600 leading-relaxed">
                        {giveaway.description}
                      </p>
                    </div>

                    {/* Countdown Timer */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-8">
                      <div className="flex items-center gap-2 mb-8">
                        <Clock className="w-5 h-5 text-orange-600" />
                        <h3 className="text-lg font-bold text-gray-900">Time Remaining</h3>
                      </div>
                      <div className="grid grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
                        {[
                          { label: 'Days', value: timeLeft.days },
                          { label: 'Hours', value: timeLeft.hours },
                          { label: 'Minutes', value: timeLeft.minutes },
                        ].map((item) => (
                          <div key={item.label} className="text-center">
                            <div className="text-3xl sm:text-4xl font-bold text-gray-900">
                              {item.value}
                            </div>
                            <div className="text-sm text-gray-600 mt-2">{item.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* How to Enter */}
                    <div className="bg-gray-50 rounded-xl p-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-8">
                        How to Enter
                      </h3>
                      <div className="space-y-0">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm">
                            1
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 mb-1">Click Enter</h4>
                            <p className="text-gray-600 text-sm">
                              One simple click to enter this month&apos;s amazing prize
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm">
                            2
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 mb-1">Win & Travel</h4>
                            <p className="text-gray-600 text-sm">
                              Winner announced at the end of the month - your dream trip awaits!
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enter Button - Disabled if already entered */}
                    <motion.button
                      onClick={handleEnterGiveaway}
                      disabled={entering || hasEntered}
                      className={`w-full sm:w-auto px-12 py-4 rounded-full text-white text-lg font-bold shadow-xl flex items-center justify-center gap-2 transition-colors duration-300 ${
                        hasEntered
                          ? 'bg-gray-400 cursor-not-allowed hover:bg-gray-400'
                          : 'bg-[#0B8659] hover:bg-[#096d47]'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      whileHover={!hasEntered ? { scale: 1.05 } : {}}
                      whileTap={!hasEntered ? { scale: 0.95 } : {}}
                    >
                      <CheckCircle className="w-5 h-5" />
                      {entering ? 'Entering...' : hasEntered ? 'Already Entered' : 'Enter Now'}
                    </motion.button>

                    {/* Already Entered Message */}
                    {hasEntered && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-green-50 border border-green-200 rounded-lg text-center"
                      >
                        <p className="text-green-800 font-semibold flex items-center justify-center gap-2">
                          You have already entered this giveaway. Good luck!
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              // Empty State
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto"
              >
                <div className="border-2 border-gray-200 rounded-2xl p-12 text-center">
                  {/* Gift Icon with Pulse Animation */}
                  <motion.div
                    className="inline-block mb-6"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <Gift className="w-12 h-12 text-[#0B8659]" />
                    </div>
                  </motion.div>

                  {/* Heading */}
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                    No Active Giveaway
                  </h2>

                  {/* Description */}
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    There&apos;s no active monthly giveaway at the moment. Check back soon for our next amazing prize!
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Renewal Modal for Expired Users */}
        <ConfirmationModal
          isOpen={showRenewalModal}
          onClose={() => setShowRenewalModal(false)}
          onConfirm={handleRenewSubscription}
          title="Subscription Required"
          message="Your subscription has expired. Please renew to enter the giveaway and access exclusive content."
          confirmText={isRenewing ? "Renewing..." : "Renew Now - €9.99/year"}
          cancelText="Maybe Later"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
        />
      </div>
    );
  }
};

export default GiveawayPage;
