import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, ArrowLeft, Check, Eye, EyeOff, X, Lock, Shield, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import PageTransition from '../../components/common/PageTransition';
import { authService } from '../../services/api.services';

/**
 * Forgot Password Page - Multi-step password reset flow
 * 
 * Step 1: Enter Email
 * Step 2: Enter 4-digit OTP (Verify)
 * Step 3: Enter New Password (then redirect to login)
 */
const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetToken, setResetToken] = useState(''); // Store reset token from step 2
  const [error, setError] = useState(''); // Error message state
  const otpInputRefs = useRef([]);

  // Password validation state
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    passwordsMatch: false,
  });

  // Scroll to top when step changes
  useEffect(() => {
    const scrollToTop = () => {
      if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: true, duration: 0, force: true });
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    };

    scrollToTop();
    
    // Also retry after a small delay to catch any layout shifts
    const timer = setTimeout(scrollToTop, 10);
    return () => clearTimeout(timer);
  }, [currentStep]);

  // Handle password change with validation
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error when user starts typing
    if (error) setError('');
    
    if (name === 'newPassword') {
      setNewPassword(value);
    } else {
      setConfirmPassword(value);
    }

    const pwd = name === 'newPassword' ? value : newPassword;
    const confirmPwd = name === 'confirmPassword' ? value : confirmPassword;

    setPasswordValidation({
      minLength: pwd.length >= 8,
      hasUpperCase: /[A-Z]/.test(pwd),
      hasLowerCase: /[a-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecialChar: /[@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
      passwordsMatch: pwd === confirmPwd && pwd.length > 0,
    });
  };

  // Calculate password strength
  const getPasswordStrength = () => {
    const { minLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar } = passwordValidation;
    const validCount = [minLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean).length;
    
    if (validCount <= 2) return { label: 'Weak', color: 'bg-red-500', width: '33%' };
    if (validCount <= 4) return { label: 'Medium', color: 'bg-yellow-500', width: '66%' };
    return { label: 'Strong', color: 'bg-green-500', width: '100%' };
  };

  const passwordStrength = getPasswordStrength();

  // OTP input handlers
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits
    
    // Clear error when user starts typing
    if (error) setError('');
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take last character
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };
  
  const handleOtpKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };
  
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 4);
    if (!/^\d+$/.test(pastedData)) return; // Only allow digits
    
    const newOtp = pastedData.split('');
    setOtp([...newOtp, ...Array(4 - newOtp.length).fill('')].slice(0, 4));
    
    // Focus last filled input or next empty
    const nextIndex = Math.min(pastedData.length, 3);
    otpInputRefs.current[nextIndex]?.focus();
  };

  // Step 1: Send OTP to email
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // Call API to send OTP
      const response = await authService.forgotPassword({ email });
      
      if (response.success) {
        toast.success(response.message || 'Password reset code has been sent to your email.');
        setError(''); // Clear errors on success
        setCurrentStep(2);
        
        // Focus first OTP input
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 100);
      } else {
        setError(response.message || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error sending OTP:', error);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message === 'Network Error') {
        setError('Unable to connect to server. Please check your connection.');
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP Only
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // Validate OTP
    if (otp.some(digit => !digit)) {
      setError('Please enter all 4 digits of the OTP');
      return;
    }

    setIsLoading(true);

    try {
      const otpCode = otp.join('');
      
      // Call API to verify OTP and get reset token
      const response = await authService.verifyResetOtp({ 
        email, 
        code: otpCode 
      });
      
      if (response.success && response.data?.resetToken) {
        // Store reset token for step 3
        setResetToken(response.data.resetToken);
        
        toast.success(response.message || 'Verification code is valid. You can now reset your password.');
        setError(''); // Clear errors on success
        setCurrentStep(3);
      } else {
        setError(response.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error verifying OTP:', error);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message === 'Network Error') {
        setError('Unable to connect to server. Please check your connection.');
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // Validate password
    const { minLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar, passwordsMatch } = passwordValidation;
    if (!minLength || !hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      setError('Password does not meet requirements');
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }

    if (!resetToken) {
      setError('Reset token is missing. Please verify OTP again.');
      setCurrentStep(2);
      return;
    }

    setIsLoading(true);

    try {
      // Call API to reset password
      const response = await authService.resetPassword({
        resetToken,
        newPassword
      });
      
      if (response.success) {
        toast.success(response.message || 'Password has been reset successfully. You can now login with your new password.');
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.message || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error resetting password:', error);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message === 'Network Error') {
        setError('Unable to connect to server. Please check your connection.');
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
              <Lock className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Forgot Password?
            </h1>
            <p className="text-gray-600">
              {currentStep === 1 && "Enter your email to receive a reset code"}
              {currentStep === 2 && "Verify the OTP sent to your email"}
              {currentStep === 3 && "Create your new password"}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                  currentStep >= step 
                    ? 'bg-emerald-600 border-emerald-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step}</span>
                  )}
                </div>
                {step < 3 && (
                  <div className={`w-12 h-1 mx-2 transition-colors ${
                    currentStep > step ? 'bg-emerald-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <AnimatePresence mode="wait">
              {/* Step 1: Email Input */}
              {currentStep === 1 && (
                <motion.form
                  key="step1"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onSubmit={handleSendOTP}
                  className="space-y-6"
                >
                  {/* Error Message */}
                  {error && (
                    <motion.div
                      className="p-4 bg-red-50 border border-red-200 rounded-xl"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <p className="text-sm text-red-600 text-center">{error}</p>
                    </motion.div>
                  )}

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (error) setError(''); // Clear error when user starts typing
                        }}
                        placeholder="your@email.com"
                        required
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-gray-900"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        Send OTP
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <Link 
                      to="/login" 
                      className="text-sm text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Login
                    </Link>
                  </div>
                </motion.form>
              )}

              {/* Step 2: OTP Verification Only */}
              {currentStep === 2 && (
                <motion.form
                  key="step2"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onSubmit={handleVerifyOTP}
                  className="space-y-6"
                >
                  {/* Error Message */}
                  {error && (
                    <motion.div
                      className="p-4 bg-red-50 border border-red-200 rounded-xl"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <p className="text-sm text-red-600 text-center">{error}</p>
                    </motion.div>
                  )}

                  {/* Email Display */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <p className="text-sm text-emerald-800">
                      OTP sent to: <strong>{email}</strong>
                    </p>
                  </div>

                  {/* OTP Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Enter 4-Digit OTP
                    </label>
                    <div className="flex gap-3 justify-center">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => (otpInputRefs.current[index] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          onPaste={index === 0 ? handleOtpPaste : undefined}
                          className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Verifying OTP...
                      </>
                    ) : (
                      <>
                        Verify OTP
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentStep(1);
                        setOtp(['', '', '', '']);
                      }}
                      className="text-sm text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Email
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Step 3: New Password */}
              {currentStep === 3 && (
                <motion.form
                  key="step3"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onSubmit={handleResetPassword}
                  className="space-y-6"
                >
                  {/* Error Message */}
                  {error && (
                    <motion.div
                      className="p-4 bg-red-50 border border-red-200 rounded-xl"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <p className="text-sm text-red-600 text-center">{error}</p>
                    </motion.div>
                  )}

                  {/* Success Message */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>OTP verified! Now create your new password.</span>
                    </p>
                  </div>

                  {/* New Password */}
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-900 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="newPassword"
                        name="newPassword"
                        value={newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter new password"
                        required
                        className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-gray-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* Password Strength Meter */}
                    {newPassword && (
                      <div className="mt-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-600">Password Strength</span>
                          <span className={`text-xs font-semibold ${
                            passwordStrength.label === 'Weak' ? 'text-red-500' :
                            passwordStrength.label === 'Medium' ? 'text-yellow-500' :
                            'text-green-500'
                          }`}>
                            {passwordStrength.label}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${passwordStrength.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: passwordStrength.width }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Password Requirements */}
                    {newPassword && (
                      <div className="mt-4 space-y-2 bg-gray-50 rounded-lg p-4">
                        <p className="text-xs font-semibold text-gray-700 mb-2">Password must contain:</p>
                        {[
                          { key: 'minLength', label: 'At least 8 characters' },
                          { key: 'hasUpperCase', label: 'One uppercase letter (A-Z)' },
                          { key: 'hasLowerCase', label: 'One lowercase letter (a-z)' },
                          { key: 'hasNumber', label: 'One number (0-9)' },
                          { key: 'hasSpecialChar', label: 'One special character (@#$%...)' },
                        ].map((req) => (
                          <div key={req.key} className="flex items-center gap-2">
                            {passwordValidation[req.key] ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <X className="w-4 h-4 text-gray-400" />
                            )}
                            <span className={`text-xs ${
                              passwordValidation[req.key] ? 'text-green-600' : 'text-gray-600'
                            }`}>
                              {req.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm new password"
                        required
                        className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-gray-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* Password Match Indicator */}
                    {confirmPassword && (
                      <div className="mt-2">
                        {passwordValidation.passwordsMatch ? (
                          <div className="flex items-center gap-2 text-green-600">
                            <Check className="w-4 h-4" />
                            <span className="text-xs font-medium">Passwords match</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-red-600">
                            <X className="w-4 h-4" />
                            <span className="text-xs font-medium">Passwords do not match</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Resetting Password...
                      </>
                    ) : (
                      <>
                        Reset Password
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentStep(2);
                        setNewPassword('');
                        setConfirmPassword('');
                      }}
                      className="text-sm text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to OTP
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Help Text */}
          {currentStep === 1 && (
            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{' '}
              <Link to="/signup" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Sign up now
              </Link>
            </p>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default ForgotPasswordPage;
