import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight, X } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * Expired Subscription Banner
 * Shows when user's subscription has expired
 * Only shows on Dashboard/Premium pages, NOT on public pages
 */
const ExpiredSubscriptionBanner = ({ onRenew, onDismiss, variant = 'prominent' }) => {
  if (variant === 'subtle') {
    // Subtle warning for expiring soon (30 days)
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-lg shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-amber-800 font-medium">
                Your subscription will expire soon
              </p>
              <p className="text-xs text-amber-700 mt-1">
                Renew now to avoid interruption to your benefits
              </p>
            </div>
          </div>
          <button
            onClick={onRenew}
            className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors whitespace-nowrap ml-4"
          >
            Renew Early
          </button>
        </div>
      </motion.div>
    );
  }

  // Prominent banner for expired subscription
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 mb-6 rounded-xl shadow-lg relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }} />
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="bg-white/20 p-2 rounded-lg flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1">
                Your Subscription Has Expired
              </h3>
              <p className="text-white/90 text-sm mb-4">
                Please renew to access your dashboard and exclusive content. Enjoy 60+ travel deals, monthly giveaways, and expert guides.
              </p>
              <button
                onClick={onRenew}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-red-600 font-bold rounded-full hover:bg-red-50 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Renew Now - €9.99/year
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-white/80 hover:text-white transition-colors flex-shrink-0"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

ExpiredSubscriptionBanner.propTypes = {
  onRenew: PropTypes.func.isRequired,
  onDismiss: PropTypes.func,
  variant: PropTypes.oneOf(['prominent', 'subtle']),
};

export default ExpiredSubscriptionBanner;
