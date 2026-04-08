import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { authService } from '../../services/api.services';

/**
 * VerifyOtpPage - Email verification with OTP
 * Features: 4-digit OTP input, auto-focus, resend functionality, countdown timer
 */
const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const isRetry = searchParams.get('retry') === 'true';
  
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const autoResendTriggered = useRef(false); // Use ref to prevent React Strict Mode duplicate calls
  const inputRefs = useRef([]);

  // Countdown timer for resend button
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      toast.error('Email is required for verification.');
      navigate('/signup');
    }
  }, [email, navigate]);

  // Auto-resend OTP if coming from payment cancel (retry=true) - REMOVED
  // Users can manually click "Resend OTP" if needed
  // This prevents errors when backend rejects resending to already-verified emails

  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 4);
    
    if (!/^\d+$/.test(pastedData)) {
      toast.error('Please paste only numbers.');
      return;
    }

    const newOtp = pastedData.split('');
    setOtp([...newOtp, ...Array(4 - newOtp.length).fill('')]);
    
    // Focus last filled input
    const lastIndex = Math.min(newOtp.length, 3);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    
    if (otpCode.length !== 4) {
      toast.error('Please enter all 4 digits.');
      return;
    }

    setLoading(true);

    try {
      // Call verify OTP API (4-digit code)
      const response = await authService.verifyOtp({
        email,
        code: otpCode,
        amount: 999, // €9.99 in cents
      });
      
      // Handle successful response
      if (response.success) {
        // Save token if provided (payment retry scenario)
        if (response.data?.token) {
          localStorage.setItem('app_token', response.data.token);
        }
        
        // Save user data temporarily if provided
        if (response.data?.user) {
          localStorage.setItem('temp_user', JSON.stringify(response.data.user));
        }
        
        // Check for payment URL in multiple possible locations
        const paymentUrl = response.data?.payment?.url ||        // Primary location
                           response.data?.paymentUrl ||           // Alternative
                           response.data?.payment?.sessionUrl ||  // Legacy
                           response.data?.data?.payment?.url ||   // Nested
                           response.data?.data?.paymentUrl;       // Nested alternative
        
        if (paymentUrl) {
          // Determine message based on user status
          const isRetry = response.data?.user?.isEmailVerified === true;
          const message = isRetry 
            ? response.message || 'Resuming payment...' 
            : response.message || 'Email verified! Redirecting to payment...';
          
          toast.success(message);
          
          // Redirect to Stripe payment page
          setTimeout(() => {
            window.location.href = paymentUrl;
          }, 1500);
        } else {
          toast.error('Payment session creation failed. Please try again.');
          setOtp(['', '', '', '']);
          inputRefs.current[0]?.focus();
        }
      } else {
        // Handle error responses
        
        // Check if user already completed payment
        if (response.message?.includes('login') || response.message?.includes('completed')) {
          toast.info('Account already active! Redirecting to login...');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          toast.error(response.message || 'Verification failed. Please try again.');
          setOtp(['', '', '', '']);
          inputRefs.current[0]?.focus();
        }
      }
      
    } catch (error) {
      console.error('❌ OTP verification failed:', error);
      
      // Handle backend error responses
      if (error.response?.data?.message) {
        const errorMessage = error.response.data.message;
        
        // Check if user already completed payment
        if (errorMessage.includes('login') || errorMessage.includes('completed') || errorMessage.includes('active')) {
          toast.info('Account already active! Redirecting to login...');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else if (errorMessage.includes('expired')) {
          toast.error('OTP has expired. Please request a new one.');
          setCanResend(true);
          setOtp(['', '', '', '']);
          inputRefs.current[0]?.focus();
        } else {
          toast.error(errorMessage);
          setOtp(['', '', '', '']);
          inputRefs.current[0]?.focus();
        }
      } else if (error.message === 'Network Error') {
        toast.error('Unable to connect to server. Please check your connection.');
      } else {
        toast.error('Verification failed. Please try again.');
        setOtp(['', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    setResendLoading(true);

    try {
      // Call real resend OTP API
      const response = await authService.resendOtp({ email });
      
      if (response.success) {
        toast.success(response.message || 'A new OTP has been sent to your email.');
        setResendTimer(60);
        setCanResend(false);
        setOtp(['', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        toast.error(response.message || 'Failed to resend OTP. Please try again.');
      }
      
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message === 'Network Error') {
        toast.error('Unable to connect to server. Please check your connection.');
      } else {
        toast.error('Failed to resend OTP. Please try again.');
      }
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-200 via-green-100 to-green-50 flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 sm:p-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Back Button */}
        <button
          onClick={() => navigate('/signup')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-bold">Back to Signup</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <Mail className="w-8 h-8 text-green-600" />
          </motion.div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Verify Your Email
          </h1>
          <p className="text-base text-gray-600 mb-2">
            We've sent a 4-digit code to
          </p>
          <p className="text-base font-semibold text-gray-900">
            {email}
          </p>
        </div>

        {/* Retry Payment Banner */}
        {isRetry && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Resuming Payment</h4>
                <p className="text-sm text-blue-700">
                  Enter your OTP below to complete your payment of €9.99. If you need a new code, click "Resend OTP".
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* OTP Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Input Fields */}
          <div className="flex justify-center gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                disabled={loading}
              />
            ))}
          </div>

          {/* Resend OTP */}
          <div className="text-center">
            {canResend ? (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendLoading}
                className={`text-green-600 font-bold hover:text-green-700 transition-colors inline-flex items-center gap-2 ${
                  resendLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {resendLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Resend OTP'
                )}
              </button>
            ) : (
              <p className="text-sm text-gray-600">
                Resend OTP in <span className="font-semibold text-gray-900">{resendTimer}s</span>
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || otp.join('').length !== 4}
            className="w-full px-6 py-4 bg-green-600 text-white text-lg font-bold rounded-xl hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Verify Email
              </>
            )}
          </button>
        </form>

        {/* Help Text */}
        <motion.div
          className="mt-6 p-4 bg-blue-50 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-2">Didn't receive the email?</p>
              <p className="mb-3 text-blue-800">
                Please check your <span className="font-semibold">spam or junk folder</span> and mark it as 'Not Spam' to ensure you receive future emails.
              </p>
              <ul className="list-disc list-inside space-y-1 text-blue-800">
                <li>Make sure the email address is correct</li>
                <li>Wait for {resendTimer}s before requesting a new code</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VerifyOtpPage;
