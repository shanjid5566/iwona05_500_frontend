import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Gift, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { giveawaysService } from '../../../services/api.services';

/**
 * Sticky CTA - Bottom Action Bar
 * Different content for visitors vs members
 */
const StickyCTA = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [giveaway, setGiveaway] = useState(null);

  // Fetch active giveaway for authenticated users
  useEffect(() => {
    const fetchGiveaway = async () => {
      if (!isAuthenticated) return;
      
      try {
        const response = await giveawaysService.getActiveGiveaway({ page: 1, limit: 10 });
        if (response.success && response.data?.giveaway) {
          setGiveaway(response.data.giveaway);
        }
      } catch (error) {
        console.error('Failed to fetch giveaway:', error);
      }
    };

    fetchGiveaway();
  }, [isAuthenticated]);

  // Show bar after scrolling 300px
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300 && !isDismissed) {
        setIsVisible(true);
      } else if (window.scrollY <= 300) {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  if (!isAuthenticated) {
    // VISITOR VIEW - Join Now CTA
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 sm:pb-6"
          >
            <div className="max-w-7xl mx-auto">
              <div className="relative bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 rounded-2xl shadow-2xl border border-emerald-400/50 overflow-hidden">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />
                </div>

                <div className="relative px-6 py-4 sm:px-8 sm:py-5">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Left Side - Message */}
                    <div className="flex items-center text-center sm:text-left">
                      <motion.div
                        animate={{ rotate: [0, 14, -14, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        className="hidden sm:block mr-4"
                      >
                        {/* <Sparkles className="w-8 h-8 text-white" /> */}
                      </motion.div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                          Ready to Save? Join for €9.99/year
                        </h3>
                        <p className="text-sm text-white/90">
                          Amazing deals. Free trips. Expert guides. Upgrade your travel.
                        </p>
                      </div>
                    </div>

                    {/* Right Side - CTA Button */}
                    <div className="flex items-center gap-3 relative z-10">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/signup');
                        }}
                        className="group px-8 py-3 bg-white text-emerald-600 font-bold rounded-xl hover:bg-slate-50 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer"
                      >
                        <span className="flex items-center">
                          Join Now
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </button>

                      {/* Dismiss Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDismiss();
                        }}
                        className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                        aria-label="Dismiss"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <motion.div
                  className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -bottom-10 -right-10 w-32 h-32 bg-teal-300/20 rounded-full blur-2xl"
                  animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.6, 0.4] }}
                  transition={{ duration: 5, repeat: Infinity }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // MEMBER VIEW - Giveaway Active Alert
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 sm:pb-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-2xl shadow-2xl border border-amber-400/50 overflow-hidden">
              {/* Animated Background */}
              <div className="absolute inset-0">
                <motion.div
                  className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)] "
                  animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>

              <div className="relative px-6 py-4 sm:px-8 sm:py-5">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Left Side - Alert Message */}
                  <div className="flex items-center text-center sm:text-left">
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 10, 0],
                        scale: [1, 1.1, 1, 1.1, 1],
                      }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                      className="hidden sm:block mr-4"
                    >
                      {/* <Gift className="w-8 h-8 text-white" /> */}
                    </motion.div>
                    <div>
                      <div className="flex items-center justify-center sm:justify-start mb-1">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold text-white uppercase tracking-wide mr-2">
                          New
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold text-white">
                          Giveaway Active!
                        </h3>
                      </div>
                      <p className="text-sm text-white/95">
                        {giveaway ? (
                          <>
                            {giveaway.title} • Ends {new Date(giveaway.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </>
                        ) : (
                          'Check out our monthly giveaway and enter to win!'
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Right Side - CTA Button */}
                  <div className="flex items-center gap-3 relative z-10">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/giveaways');
                      }}
                      className="group px-8 py-3 bg-white text-orange-600 font-bold rounded-xl hover:bg-slate-50 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer"
                    >
                      <span className="flex items-center">
                        {/* <Gift className="w-5 h-5 mr-2" /> */}
                        Enter Now
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </button>

                    {/* Dismiss Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDismiss();
                      }}
                      className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                      aria-label="Dismiss"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Decorative Glow */}
              <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-white/20 to-transparent blur-xl"
                animate={{ opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

StickyCTA.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

export default StickyCTA;
