import { motion } from 'framer-motion';
import { Calendar, CheckCircle, XCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * Subscription Status Card
 * Displays user's subscription details, status, and renewal options
 */
const SubscriptionStatusCard = ({ subscription, onRenew }) => {
  // Calculate days remaining
  const calculateDaysRemaining = () => {
    if (!subscription?.endDate) return 0;
    const today = new Date();
    const endDate = new Date(subscription.endDate);
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysRemaining = calculateDaysRemaining();
  const isExpired = subscription?.status === 'INACTIVE' || subscription?.isExpired;
  const isExpiringSoon = daysRemaining > 0 && daysRemaining <= 30;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IE', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // Get status badge
  const getStatusBadge = () => {
    if (isExpired) {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
          <XCircle className="w-4 h-4" />
          Expired
        </div>
      );
    }
    if (isExpiringSoon) {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
          <AlertTriangle className="w-4 h-4" />
          Expiring Soon
        </div>
      );
    }
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
        <CheckCircle className="w-4 h-4" />
        Active
      </div>
    );
  };

  // Progress bar percentage
  const getProgressPercentage = () => {
    if (isExpired || !subscription?.startDate || !subscription?.endDate) return 0;
    
    const start = new Date(subscription.startDate);
    const end = new Date(subscription.endDate);
    const today = new Date();
    
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const daysPassed = Math.ceil((today - start) / (1000 * 60 * 60 * 24));
    
    const percentage = Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));
    return percentage;
  };

  const progressPercentage = getProgressPercentage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className={`p-6 ${isExpired ? 'bg-red-50' : isExpiringSoon ? 'bg-amber-50' : 'bg-emerald-50'}`}>
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {subscription?.planName || 'Annual Membership'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Travel in a Click Members Club
            </p>
          </div>
          {getStatusBadge()}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Calendar className="w-4 h-4" />
              Start Date
            </div>
            <p className="text-sm font-semibold text-gray-900">
              {formatDate(subscription?.startDate)}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Calendar className="w-4 h-4" />
              End Date
            </div>
            <p className="text-sm font-semibold text-gray-900">
              {formatDate(subscription?.endDate)}
            </p>
          </div>
        </div>

        {/* Days Remaining */}
        {!isExpired && daysRemaining > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Days Remaining</span>
              <span className={`text-lg font-bold ${isExpiringSoon ? 'text-amber-600' : 'text-emerald-600'}`}>
                {daysRemaining} days
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full ${isExpiringSoon ? 'bg-amber-500' : 'bg-emerald-500'}`}
              />
            </div>
          </div>
        )}

        {/* Price */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Annual Fee</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-gray-900">€9.99</span>
              <span className="text-sm text-gray-500">/year</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          {isExpired ? (
            <button
              onClick={onRenew}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all duration-300 hover:scale-[1.02] shadow-lg"
            >
              Renew Now
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : isExpiringSoon ? (
            <button
              onClick={onRenew}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 transition-all duration-300 hover:scale-[1.02] shadow-lg"
            >
              Renew Early
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
              disabled
            >
              Active Subscription
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

SubscriptionStatusCard.propTypes = {
  subscription: PropTypes.shape({
    planName: PropTypes.string,
    status: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    isExpired: PropTypes.bool,
    amount: PropTypes.number,
  }),
  onRenew: PropTypes.func.isRequired,
};

export default SubscriptionStatusCard;
