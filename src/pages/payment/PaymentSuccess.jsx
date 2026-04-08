import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, Home } from 'lucide-react';
import { toast } from 'react-toastify';
import { paymentService, giftService } from '../../services/api.services';
import { useUser } from '../../context/context.hooks';

/**
 * PaymentSuccess - Displays after successful Stripe payment
 * Verifies session with backend and redirects to dashboard
 */
const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const isGiftPayment = searchParams.get('gift') === 'true';
  const { login } = useUser();
  
  const [verifying, setVerifying] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [isRenewal, setIsRenewal] = useState(false);
  const hasVerified = useRef(false); // Prevent duplicate API calls

  useEffect(() => {
    // Prevent running twice in React Strict Mode
    if (hasVerified.current) {
      return;
    }

    if (!sessionId) {
      toast.error('Invalid payment session.');
      navigate('/signup');
      return;
    }

    // Mark as verification started
    hasVerified.current = true;

    // Verify payment session with backend
    const verifyPayment = async () => {
      try {
        // Call appropriate backend endpoint based on payment type
        let response;
        
        if (isGiftPayment) {
          // Gift subscription payment
          response = await giftService.verifyGiftPayment(sessionId);
        } else {
          // Regular subscription payment
          response = await paymentService.verifyPayment({
            sessionId: sessionId
          });
        }
        
        if (response.success) {
          setVerifying(false);
          setPaymentVerified(true);
          
          // Check if this is a renewal payment
          if (response.data?.isRenewal) {
            setIsRenewal(true);
          }
          
          // Update UserContext with authenticated user data
          const userData = isGiftPayment ? response.data?.recipient : response.data?.user;
          
          if (userData) {
            const loginData = {
              id: userData._id || userData.id,
              name: userData.fullName || `${userData.firstName} ${userData.lastName}`,
              email: userData.email,
              role: userData.role?.toLowerCase() || 'user',
              status: 'ACTIVE', // Always ACTIVE after payment
              memberSince: userData.createdAt,
              homeAirport: userData.homeAirport,
              isEmailVerified: userData.isEmailVerified,
            };
            
            login(loginData);
          }
          
          // Clear payment banner dismissal flag (if any)
          sessionStorage.removeItem('payment_banner_dismissed');
          
          // Show appropriate success message based on payment type
          let successMessage;
          if (isGiftPayment) {
            successMessage = 'Gift subscription purchased successfully! 🎁';
          } else if (response.data?.isRenewal) {
            successMessage = 'Subscription renewed successfully! Welcome back! 🎉';
          } else {
            successMessage = 'Payment successful! Welcome to Travel in a Click! 🎉';
          }
          toast.success(successMessage);
          
          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            navigate('/dashboard');
          }, 3000);
        } else {
          setVerifying(false);
          toast.error(response.message || 'Payment verification failed.');
        }
        
      } catch (error) {
        console.error('❌ Payment verification error:', error);
        setVerifying(false);
        
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Payment verification failed. Please contact support.');
        }
      }
    };

    verifyPayment();
    
    // Cleanup function
    return () => {
      // Component unmount হলে কিছু করার নেই, already verified
    };
  }, [sessionId, navigate, login]);

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center py-12 px-4">
      <motion.div
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {verifying ? (
          <>
            {/* Verifying Payment */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 mx-auto mb-6"
            >
              <Loader2 className="w-full h-full text-green-600" />
            </motion.div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Verifying Payment...
            </h1>
            
            <p className="text-gray-600 mb-6">
              Please wait while we confirm your payment.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                Session ID: {sessionId?.slice(-20)}...
              </p>
            </div>
          </>
        ) : paymentVerified ? (
          <>
            {/* Payment Successful */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 mx-auto mb-6"
            >
              <CheckCircle className="w-full h-full text-green-600" />
            </motion.div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {isRenewal ? 'Subscription Renewed! 🎉' : 'Payment Successful! 🎉'}
            </h1>
            
            <p className="text-gray-600 mb-6">
              {isRenewal 
                ? 'Your membership has been renewed. Continue enjoying exclusive travel benefits!'
                : 'Your membership has been activated. Welcome to Travel in a Click!'}
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-green-900 mb-2">What&apos;s Next?</h3>
              <ul className="text-sm text-green-700 space-y-1 text-left">
                <li>✅ Access exclusive travel deals</li>
                <li>✅ Join monthly giveaways</li>
                <li>✅ Download personalized travel guides</li>
                <li>✅ Connect with fellow travelers</li>
              </ul>
            </div>
            
            <p className="text-sm text-gray-500 mb-6">
              Redirecting to your dashboard in 3 seconds...
            </p>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Go to Dashboard Now
            </button>
          </>
        ) : (
          <>
            {/* Payment Verification Failed */}
            <div className="w-20 h-20 mx-auto mb-6 text-red-600">
              <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Verification Failed
            </h1>
            
            <p className="text-gray-600 mb-6">
              We couldn&apos;t verify your payment. Please contact support.
            </p>
            
            <button
              onClick={() => navigate('/contact')}
              className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors"
            >
              Contact Support
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
