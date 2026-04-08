import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, CreditCard } from 'lucide-react';
import { toast } from 'react-toastify';
import { paymentService } from '../../services/api.services';

/**
 * PendingPaymentBanner - Shows a banner when user has pending payment
 * Displays at the top of the page after Header
 */
const PendingPaymentBanner = () => {
  const navigate = useNavigate();
  
  // Initialize state from localStorage during component mount
  const [pendingEmail, setPendingEmail] = useState(() => {
    const email = localStorage.getItem('pending_payment_email');
    return email || '';
  });
  
  const [showBanner, setShowBanner] = useState(() => {
    const email = localStorage.getItem('pending_payment_email');
    const dismissed = sessionStorage.getItem('payment_banner_dismissed');
    return !!(email && !dismissed);
  });
  
  const [isProcessing, setIsProcessing] = useState(false);

  // No need for useEffect here - removed for cleaner code
  
  // Listen for localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const email = localStorage.getItem('pending_payment_email');
      const dismissed = sessionStorage.getItem('payment_banner_dismissed');
      
      setPendingEmail(prevEmail => email !== prevEmail ? (email || '') : prevEmail);
      setShowBanner(prevShow => {
        const shouldShow = !!(email && !dismissed);
        return shouldShow !== prevShow ? shouldShow : prevShow;
      });
    };
    
    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 5000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleCompletePayment = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    // Check for auth token, restore from backup if needed
    let token = localStorage.getItem('app_token');
    
    if (!token) {
      const backupToken = sessionStorage.getItem('app_token_backup');
      if (backupToken) {
        localStorage.setItem('app_token', backupToken);
        token = backupToken;
      }
    }
    
    if (token) {
      // User has token - use authenticated endpoint
      
      try {
        const response = await paymentService.createCheckoutSession({ amount: 999 });
        const paymentUrl = response.data?.url || response.url;
        
        if (response.success && paymentUrl) {
          toast.success('Redirecting to payment...');
          setTimeout(() => window.location.href = paymentUrl, 500);
        } else {
          throw new Error(response.message || 'No payment URL in response');
        }
        
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        
        if (errorMessage.includes('verify your email') || errorMessage.includes('Unauthorized') || errorMessage.includes('not verified')) {
          toast.info('Please verify your email to continue.');
          navigate(`/verify-otp?email=${encodeURIComponent(pendingEmail)}&retry=true`);
        } else if (errorMessage.includes('already active') || errorMessage.includes('Subscription already')) {
          toast.success('Your subscription is already active!');
          setTimeout(() => navigate('/dashboard'), 2000);
        } else {
          toast.error(errorMessage || 'Failed to create payment session.');
        }
      } finally {
        setIsProcessing(false);
      }
      
    } else {
      // No token - redirect to OTP verification
      toast.info('Please verify your email first.');
      navigate(`/verify-otp?email=${encodeURIComponent(pendingEmail)}&retry=true`);
      setIsProcessing(false);
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem('payment_banner_dismissed', 'true');
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-20 left-0 right-0 z-40 overflow-hidden"
        >
          <div className="bg-linear-to-r from-orange-500 via-orange-600 to-red-500 text-white shadow-lg">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between py-3 gap-4">
                {/* Icon + Message */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <AlertCircle className="w-6 h-6 shrink-0 animate-pulse" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-semibold">
                      Payment Pending - Complete your membership registration
                    </p>
                    <p className="text-xs sm:text-sm opacity-90 truncate">
                      You have an incomplete payment for {pendingEmail}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleCompletePayment}
                    disabled={isProcessing}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-orange-600 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="hidden sm:inline">{isProcessing ? 'Processing...' : 'Complete Payment'}</span>
                    <span className="sm:hidden">{isProcessing ? '...' : 'Pay'}</span>
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    aria-label="Dismiss banner"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PendingPaymentBanner;
