import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, CreditCard, Mail } from 'lucide-react';
import { toast } from 'react-toastify';
import { useUser } from '../../context/context.hooks';
import { paymentService } from '../../services/api.services';

/**
 * PaymentCancel - Displays when user cancels Stripe payment
 */
const PaymentCancel = () => {
  const navigate = useNavigate();
  const { logout } = useUser();
  const hasProcessedCancel = useRef(false); // Prevent React Strict Mode duplicate execution
  
  // Get pending payment email from localStorage during initialization
  const [userEmail] = useState(() => {
    return localStorage.getItem('pending_payment_email') || '';
  });
  
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Prevent React Strict Mode duplicate execution
    if (hasProcessedCancel.current) return;
    hasProcessedCancel.current = true;
    
    // Save token before logout
    const savedToken = localStorage.getItem('app_token') || sessionStorage.getItem('app_token_backup');
    
    if (savedToken) {
      sessionStorage.setItem('app_token_backup', savedToken);
    }
    
    // Clear user state
    logout();
    
    // Restore token after logout
    if (savedToken) {
      localStorage.setItem('app_token', savedToken);
      sessionStorage.setItem('app_token_backup', savedToken);
    }
    
    // Clear banner dismissal
    sessionStorage.removeItem('payment_banner_dismissed');
    
    toast.warning('Payment cancelled. You must complete payment to access your account.');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center py-12 px-4">
      <motion.div
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Cancel Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-20 h-20 mx-auto mb-6"
        >
          <XCircle className="w-full h-full text-orange-500" />
        </motion.div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Payment Cancelled
        </h1>

        <p className="text-gray-600 mb-6">
          Your payment was not completed. No charges were made to your account.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-yellow-900 mb-2">What happened?</h3>
          <p className="text-sm text-yellow-700 mb-3">
            You cancelled the payment process or closed the payment window before completing the transaction.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
            <p className="text-sm text-red-700 font-semibold">⚠️ Important:</p>
            <p className="text-sm text-red-700">
              You cannot login until you complete the payment. Your account is pending activation.
            </p>
          </div>
        </div>

        {userEmail && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2">
              <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-1">To Complete Payment:</h3>
                <p className="text-sm text-blue-700">
                  Click below to continue with your payment of €9.99. You&apos;ll be redirected directly to the secure payment page.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {/* Resume Payment Button */}
          <button
            onClick={async () => {
              if (!userEmail) {
                navigate('/signup');
                return;
              }
              
              setIsProcessing(true);
              
              const token = localStorage.getItem('app_token');
              
              if (token) {
                try {
                  const response = await paymentService.createCheckoutSession({
                    amount: 999
                  });
                  
                  const paymentUrl = response.data?.url || response.url;
                  
                  if (response.success && paymentUrl) {
                    toast.success('Redirecting to payment...');
                    setTimeout(() => {
                      window.location.href = paymentUrl;
                    }, 500);
                  } else {
                    throw new Error(response.message || 'No payment URL');
                  }
                } catch (error) {
                  const errorMessage = error.response?.data?.message || error.message;
                  
                  if (errorMessage.includes('verify your email') || errorMessage.includes('Unauthorized')) {
                    toast.info('Please verify your email to continue.');
                    navigate(`/verify-otp?email=${encodeURIComponent(userEmail)}&retry=true`);
                  } else if (errorMessage.includes('already active')) {
                    toast.success('Your subscription is already active!');
                    setTimeout(() => navigate('/dashboard'), 2000);
                  } else {
                    toast.error(errorMessage || 'Failed to create payment session.');
                  }
                } finally {
                  setIsProcessing(false);
                }
              } else {
                toast.info('Please verify your email to continue.');
                navigate(`/verify-otp?email=${encodeURIComponent(userEmail)}&retry=true`);
                setIsProcessing(false);
              }
            }}
            disabled={isProcessing}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CreditCard className="w-5 h-5" />
            {isProcessing ? 'Processing...' : (userEmail ? 'Resume Payment' : 'Try Payment Again')}
          </button>

          {/* Back to Home Button */}
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help? <Link to="/contact" className="text-green-600 hover:text-green-700 font-semibold">Contact Support</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentCancel;
