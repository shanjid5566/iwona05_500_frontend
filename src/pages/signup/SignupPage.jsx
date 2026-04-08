import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Check,
  X,
  CreditCard,
  Calendar,
  Lock,
  Shield,
  CheckCircle,
  ArrowRight,
  Home,
  Mail,
  Clock,
  AlertCircle,
  Plane,
  Gift,
  BookOpen,
  Users,
  MapPin,
} from "lucide-react";
import { toast } from "react-toastify";
import { authService } from "../../services/api.services";

/**
 * Signup Page - Multi-step registration and checkout flow
 *
 * STRIPE INTEGRATION SETUP:
 *
 * 1. Backend Endpoint: Create POST /api/create-checkout-session
 *    - Accept user data (firstName, lastName, email)
 *    - Create Stripe checkout session
 *    - Return { url: 'stripe_checkout_url' }
 *
 * 2. Stripe Success Redirect: Configure Stripe to redirect to:
 *    - Success URL: https://yourdomain.com/signup?success=true
 *    - Cancel URL: https://yourdomain.com/signup?canceled=true
 *
 * 3. After successful payment, Stripe redirects back with ?success=true
 *    - useEffect detects this and shows Step 5 (success page)
 *
 * Step 1: Login Flow Check - Already a member? / Create new account
 * Step 2: Account Creation with Password Validation
 * Step 3: Email Verification (OTP)
 * Step 4: Payment & Security
 * Step 5: Success & Confirmation
 */
const SignupPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP verification state
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const otpInputRefs = useRef([]);

  // Form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    homeAirport: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    acceptTerms: false,
    weeklyEmails: true,
  });

  // Password validation state
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    passwordsMatch: false,
  });

  // Handle Stripe redirect back (when payment succeeds or is canceled)
  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");

    if (success === "true") {
      setCurrentStep(5); // Show success page (was step 4, now step 5)
    } else if (canceled === "true") {
      // User canceled payment, go back to step 1
      setCurrentStep(1);
      // Optional: Show a message to the user
      // alert('Payment was canceled. Please try again.');
    }
  }, [searchParams]);

  // OTP countdown timer
  useEffect(() => {
    if (currentStep === 3 && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [currentStep, countdown]);

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Real-time password validation
    if (name === "password" || name === "confirmPassword") {
      const pwd = name === "password" ? value : formData.password;
      const confirmPwd =
        name === "confirmPassword" ? value : formData.confirmPassword;

      setPasswordValidation({
        minLength: pwd.length >= 8,
        hasUpperCase: /[A-Z]/.test(pwd),
        hasLowerCase: /[a-z]/.test(pwd),
        hasNumber: /[0-9]/.test(pwd),
        hasSpecialChar: /[@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
        passwordsMatch: pwd === confirmPwd && pwd.length > 0,
      });
    }
  };

  // Calculate password strength
  const getPasswordStrength = () => {
    const { minLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar } =
      passwordValidation;
    const validCount = [
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
    ].filter(Boolean).length;

    if (validCount <= 2)
      return { label: "Weak", color: "bg-red-500", width: "33%" };
    if (validCount <= 4)
      return { label: "Medium", color: "bg-yellow-500", width: "66%" };
    return { label: "Strong", color: "bg-green-500", width: "100%" };
  };

  // OTP input handlers
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

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
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 4);
    if (!/^\d+$/.test(pastedData)) return; // Only allow digits

    const newOtp = pastedData.split("");
    setOtp([...newOtp, ...Array(4 - newOtp.length).fill("")].slice(0, 4));

    // Focus last filled input or next empty
    const nextIndex = Math.min(pastedData.length, 3);
    otpInputRefs.current[nextIndex]?.focus();
  };

  // Check if step 1 is valid
  const isStep1Valid = () => {
    const {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
      passwordsMatch,
    } = passwordValidation;
    return (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.homeAirport &&
      minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar &&
      passwordsMatch
    );
  };

  // Check if OTP step is valid
  const isOtpValid = () => {
    return otp.every((digit) => digit !== "");
  };

  // Check if payment step is valid
  const isStep3Valid = () => {
    return (
      formData.cardNumber &&
      formData.expiry &&
      formData.cvc &&
      formData.acceptTerms
    );
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();

    if (!isStep1Valid()) {
      toast.error("Password does not meet requirements.");
      return;
    }

    setIsRegistering(true);

    try {
      // Call real register API
      const response = await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        homeAirport: formData.homeAirport,
      });

      if (response.success) {
        toast.success(
          response.message ||
            "Registration successful! Check your email for verification code.",
        );

        // Move to OTP verification step (step 3)
        setCurrentStep(3);
        setCountdown(60);
        setCanResend(false);
        setOtp(["", "", "", ""]);

        // Focus first OTP input
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 100);
      } else {
        toast.error(
          response.message || "Registration failed. Please try again.",
        );
      }
    } catch (error) {
      console.error("❌ Registration error:", error);

      // Check if email already exists
      const errorMessage = error.response?.data?.message?.toLowerCase() || "";
      const isEmailExists =
        errorMessage.includes("email") &&
        (errorMessage.includes("already") ||
          errorMessage.includes("exist") ||
          errorMessage.includes("registered"));

      if (isEmailExists) {
        // Email already registered - show error and stay on signup page
        toast.error(
          "Email already registered. Please login to your account.",
        );
        // Don't navigate, keep user on signup page so they can try different email
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message === "Network Error") {
        toast.error(
          "Unable to connect to server. Please check your connection.",
        );
      } else {
        toast.error("Failed to create account. Please try again.");
      }
    } finally {
      setIsRegistering(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (!isOtpValid()) {
      toast.error("Please enter all 4 digits.");
      return;
    }

    setIsVerifying(true);

    try {
      const otpCode = otp.join("");

      // Call verify OTP API (4-digit OTP)
      const response = await authService.verifyOtp({
        email: formData.email,
        code: otpCode.slice(0, 4), // Only send first 4 digits
        amount: 999, // €9.99 in cents
      });

      // Handle successful response
      if (response.success) {
        // Save token if provided (payment retry scenario)
        if (response.data?.token) {
          localStorage.setItem("app_token", response.data.token);
        }

        // Save user data temporarily if provided
        if (response.data?.user) {
          localStorage.setItem("temp_user", JSON.stringify(response.data.user));
        }

        // Check for payment URL in multiple possible locations
        const paymentUrl =
          response.data?.payment?.url || // Primary location
          response.data?.paymentUrl || // Alternative
          response.data?.payment?.sessionUrl || // Legacy
          response.data?.data?.payment?.url || // Nested
          response.data?.data?.paymentUrl; // Nested alternative

        if (paymentUrl) {
          // Determine message based on user status
          const isRetry = response.data?.user?.isEmailVerified === true;
          const message = isRetry
            ? response.message || "Resuming payment..."
            : response.message || "Email verified! Redirecting to payment...";

          toast.success(message);

          // Redirect to Stripe payment page
          setTimeout(() => {
            window.location.href = paymentUrl;
          }, 1500);
        } else {
          toast.error("Payment session creation failed. Please try again.");
          setOtp(["", "", "", ""]);
          otpInputRefs.current[0]?.focus();
        }
      } else {
        // Handle error responses
        console.error("❌ Verification failed:", response.message);

        // Check if user already completed payment
        if (
          response.message?.includes("login") ||
          response.message?.includes("completed")
        ) {
          toast.info("Account already active! Redirecting to login...");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          toast.error(
            response.message || "Verification failed. Please try again.",
          );
          setOtp(["", "", "", ""]);
          otpInputRefs.current[0]?.focus();
        }
      }
    } catch (error) {
      console.error("❌ OTP verification error:", error);

      // Handle backend error responses
      if (error.response?.data?.message) {
        const errorMessage = error.response.data.message;

        // Check if user already completed payment
        if (
          errorMessage.includes("login") ||
          errorMessage.includes("completed") ||
          errorMessage.includes("active")
        ) {
          toast.info("Account already active! Redirecting to login...");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else if (errorMessage.includes("expired")) {
          toast.error("OTP has expired. Please request a new one.");
          setCanResend(true);
          setOtp(["", "", "", ""]);
          otpInputRefs.current[0]?.focus();
        } else {
          toast.error(errorMessage);
          setOtp(["", "", "", ""]);
          otpInputRefs.current[0]?.focus();
        }
      } else if (error.message === "Network Error") {
        toast.error(
          "Unable to connect to server. Please check your connection.",
        );
      } else {
        toast.error("Invalid OTP code. Please try again.");
        setOtp(["", "", "", ""]);
        otpInputRefs.current[0]?.focus();
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    setIsResending(true);

    try {
      // Call real resend OTP API
      const response = await authService.resendOtp({
        email: formData.email,
      });

      if (response.success) {
        toast.success(
          response.message ||
            "Verification code has been resent to your email.",
        );
        setCountdown(60);
        setCanResend(false);
        setOtp(["", "", "", ""]);
        otpInputRefs.current[0]?.focus();
      } else {
        toast.error(
          response.message || "Failed to resend OTP. Please try again.",
        );
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message === "Network Error") {
        toast.error(
          "Unable to connect to server. Please check your connection.",
        );
      } else {
        toast.error("Failed to resend OTP. Please try again.");
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleStep3Submit = (e) => {
    e.preventDefault();
    if (isStep3Valid()) {
      // Process payment (mock)
      // In production, this would be handled by Stripe
      setTimeout(() => {
        // Simulate 90% success rate for demo
        const isSuccess = Math.random() > 0.1;

        if (isSuccess) {
          toast.success("Payment successful! Welcome to the Club.");
          setCurrentStep(5); // Move to success page (now step 5)
        } else {
          toast.error("Payment failed. Please check your card details.");
        }
      }, 1000);
    } else {
      toast.error("Please fill in all required fields.");
    }
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  const passwordStrength = formData.password ? getPasswordStrength() : null;

  return (
    <div className="min-h-screen bg-slate-50 py-24 px-4 sm:px-6 lg:px-8 mt-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 text-center">
          Join Travel in a Click
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Unlock exclusive travel deals and experiences
        </p>

        {/* Pricing Highlight */}
        <div className="text-center mb-8">
          <span className="text-4xl font-bold text-primary-600">
            ONLY €9.99
          </span>
          <span className="text-gray-600 text-lg">/year</span>
        </div>

        {/* Premium Membership Section */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            {/* Premium Benefits Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="bg-green-600 text-white text-center py-6 rounded-xl mb-8">
                <h3 className="text-xl md:text-2xl font-bold mb-2">
                  PREMIUM MEMBERSHIP
                </h3>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <Plane className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium text-sm md:text-base">
                      Travel for Less – Top Travel Deals Abroad & Across the
                      Nation!
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <Gift className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium text-sm md:text-base">
                      Monthly Getaway Giveaways – Your Next Trip Could Be Free!
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium text-sm md:text-base">
                      Unlock 100+ Expert Travel Guides!
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium text-sm md:text-base">
                      Offers for Couples, Families & Friends
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium text-sm md:text-base">
                      Exclusive Hotel Offers in Ireland
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium text-sm md:text-base">
                      Travel Deals sent weekly straight into your inbox
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium text-sm md:text-base">
                      Choice of your airport
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Join Us Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
                Why Join Us?
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    Community Access
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Join thousands of travel enthusiasts
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    Exclusive Deals
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Members-only discounts and offers
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    Local Insights
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Expert travel guides and tips
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Progress Indicator */}
        {currentStep > 1 && currentStep < 5 && (
          <div className="mb-8 mt-4">
            <div className="flex items-center max-w-2xl mx-auto">
              {/* Step 2 - Account */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    currentStep >= 2
                      ? "bg-primary-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  1
                </div>
                <span className="text-xs text-gray-600 mt-2">Account</span>
              </div>

              {/* Connecting Line */}
              <div
                className={`flex-1 h-1 mx-4 ${
                  currentStep > 2 ? "bg-primary-600" : "bg-gray-300"
                }`}
              />

              {/* Step 3 - Verify */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    currentStep >= 3
                      ? "bg-primary-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  2
                </div>
                <span className="text-xs text-gray-600 mt-2">Verify</span>
              </div>

              {/* Connecting Line */}
              <div
                className={`flex-1 h-1 mx-4 ${
                  currentStep > 3 ? "bg-primary-600" : "bg-gray-300"
                }`}
              />

              {/* Step 4 - Payment */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    currentStep >= 4
                      ? "bg-primary-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  3
                </div>
                <span className="text-xs text-gray-600 mt-2">Payment</span>
              </div>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Step 1: Login Flow Check */}
          {currentStep === 1 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                Ready to Start Your Journey?
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Join thousands of travelers saving money on every trip
              </p>

              <div className="space-y-4 max-w-md mx-auto">
                <motion.button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="w-full bg-primary-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-primary-700 transition-all duration-300 text-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Create New Account
                </motion.button>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">
                      Already a member?
                    </span>
                  </div>
                </div>

                <Link to="/login">
                  <motion.button
                    type="button"
                    className="w-full bg-white text-primary-600 border-2 border-primary-600 px-8 py-4 rounded-xl font-bold hover:bg-primary-50 transition-all duration-300 text-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign In to Your Account
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          )}

          {/* Step 2: Account Creation (was Step 1) */}
          {currentStep === 2 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl shadow-xl p-8 sm:p-12"
            >
              <form onSubmit={handleStep1Submit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-colors duration-200 text-gray-900"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-colors duration-200 text-gray-900"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-colors duration-200 text-gray-900"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      required
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-colors duration-200 text-gray-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Password Strength Meter */}
                  {formData.password && (
                    <div className="mt-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-600">
                          Password Strength
                        </span>
                        <span
                          className={`text-xs font-semibold ${
                            passwordStrength.label === "Weak"
                              ? "text-red-500"
                              : passwordStrength.label === "Medium"
                                ? "text-yellow-500"
                                : "text-green-500"
                          }`}
                        >
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

                  {/* Password Requirements Checklist */}
                  {formData.password && (
                    <div className="mt-4 space-y-2">
                      <p className="text-xs font-semibold text-gray-700 mb-2">
                        Password must contain:
                      </p>
                      {[
                        { key: "minLength", label: "At least 8 characters" },
                        {
                          key: "hasUpperCase",
                          label: "One uppercase letter (A-Z)",
                        },
                        {
                          key: "hasLowerCase",
                          label: "One lowercase letter (a-z)",
                        },
                        { key: "hasNumber", label: "One number (0-9)" },
                        {
                          key: "hasSpecialChar",
                          label: "One special character (@#$%...)",
                        },
                      ].map((req) => (
                        <div key={req.key} className="flex items-center gap-2">
                          {passwordValidation[req.key] ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <X className="w-4 h-4 text-gray-400" />
                          )}
                          <span
                            className={`text-xs ${
                              passwordValidation[req.key]
                                ? "text-green-600"
                                : "text-gray-600"
                            }`}
                          >
                            {req.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter your password"
                      required
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-colors duration-200 text-gray-900"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Password Match Indicator */}
                  {formData.confirmPassword && (
                    <div className="mt-2">
                      {passwordValidation.passwordsMatch ? (
                        <div className="flex items-center gap-2 text-green-600 text-sm">
                          <Check className="w-4 h-4" />
                          <span>Passwords match</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-600 text-sm">
                          <X className="w-4 h-4" />
                          <span>Passwords do not match</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Home Airport */}
                <div>
                  <label
                    htmlFor="homeAirport"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Preferred Airport
                  </label>
                  <select
                    id="homeAirport"
                    name="homeAirport"
                    value={formData.homeAirport}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-colors duration-200 text-gray-900 bg-white"
                  >
                    <option value="">Select your airport</option>
                    <option value="Dublin">Dublin</option>
                    <option value="Cork">Cork</option>
                    <option value="Shannon">Shannon</option>
                    <option value="Knock">Knock</option>
                    <option value="Kerry">Kerry</option>
                    <option value="Belfast">Belfast</option>
                  </select>
                </div>
                {/* What to Expect Section */}
                <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <div className="flex items-start gap-3 mb-4">
                    <Mail className="w-6 h-6 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-2">
                        What to Expect
                      </h3>
                      <p className="text-gray-700 text-sm leading-relaxed mb-3">
                        Your welcome email will arrive within{" "}
                        <span className="font-semibold">48 hours</span> of
                        signing up. After that, you&apos;ll start receiving our
                        exclusive deals{" "}
                        <span className="font-semibold">twice a week</span> —
                        straight to your inbox!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={!isStep1Valid() || isRegistering}
                  className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                    isStep1Valid() && !isRegistering
                      ? "bg-primary-600 hover:bg-primary-700"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                  whileHover={
                    isStep1Valid() && !isRegistering ? { scale: 1.02 } : {}
                  }
                  whileTap={
                    isStep1Valid() && !isRegistering ? { scale: 0.98 } : {}
                  }
                >
                  {isRegistering ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      Continue to Verify Email
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>

                {/* Login Link */}
                <div className="text-center text-sm text-gray-600 mt-4">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-primary-600 font-bold hover:text-primary-700"
                  >
                    Sign in here
                  </Link>
                </div>
              </form>
            </motion.div>
          )}

          {/* Step 3: Email Verification (OTP) */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl shadow-xl p-8 sm:p-12"
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <Mail className="w-8 h-8 text-primary-600" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  Verify Your Email
                </h1>
                <p className="text-gray-600">
                  We sent a 4-digit code to{" "}
                  <span className="font-semibold text-gray-900">
                    {formData.email}
                  </span>
                </p>
              </div>

              <form onSubmit={handleOtpSubmit} className="space-y-6">
                {/* OTP Input Fields */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-4 text-center">
                    Enter Verification Code
                  </label>
                  <div className="flex justify-center gap-3 mb-6">
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
                        className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-200"
                      />
                    ))}
                  </div>
                </div>

                {/* Countdown Timer */}
                <div className="text-center">
                  {!canResend ? (
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">
                        Resend code in{" "}
                        <span className="font-semibold text-primary-600">
                          {countdown}s
                        </span>
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isResending}
                      className={`text-primary-600 hover:text-primary-700 font-bold text-sm transition-colors inline-flex items-center gap-2 ${
                        isResending ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isResending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Resend Verification Code"
                      )}
                    </button>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={!isOtpValid() || isVerifying}
                  className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                    isOtpValid() && !isVerifying
                      ? "bg-primary-600 hover:bg-primary-700"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                  whileHover={
                    isOtpValid() && !isVerifying ? { scale: 1.02 } : {}
                  }
                  whileTap={isOtpValid() && !isVerifying ? { scale: 0.98 } : {}}
                >
                  {isVerifying ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify & Continue
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>

                {/* Back Button */}
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="w-full py-3 text-gray-600 hover:text-gray-900 font-bold transition-colors"
                >
                  ← Back to Account Details
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
                    <p className="font-semibold mb-2">
                      Didn't receive the email?
                    </p>
                    <p className="mb-3 text-blue-800">
                      Please check your{" "}
                      <span className="font-semibold">spam or junk folder</span>{" "}
                      and mark it as 'Not Spam' to ensure you receive future
                      emails.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-blue-800">
                      <li>Make sure the email address is correct</li>
                      <li>
                        Wait for the countdown before requesting a new code
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Step 4: Payment (FALLBACK - This will be replaced by Stripe redirect) */}
          {/* TODO: Remove this step once Stripe integration is complete */}
          {/* After Stripe payment succeeds, user should be redirected back to /signup?success=true */}
          {/* or directly to Step 5 success page */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl shadow-xl p-8 sm:p-12"
            >
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 text-center">
                Complete Your Order
              </h1>
              <p className="text-gray-600 text-center mb-8">
                Start with your email to secure your membership
              </p>

              {/* Order Summary */}
              <div className="bg-primary-50 rounded-xl p-6 mb-8">
                <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Premium Membership</span>
                  <span className="text-2xl font-bold text-primary-600">
                    €9.99/year
                  </span>
                </div>
              </div>

              <form onSubmit={handleStep3Submit} className="space-y-6">
                {/* Email (Read-only) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    readOnly
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-700"
                  />
                </div>

                {/* Card Number */}
                <div>
                  <label
                    htmlFor="cardNumber"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Card Number
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      required
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-colors duration-200 text-gray-900"
                    />
                  </div>
                </div>

                {/* Expiry & CVC */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="expiry"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Expiry Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="expiry"
                        name="expiry"
                        value={formData.expiry}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        maxLength="5"
                        required
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-colors duration-200 text-gray-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="cvc"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      CVC
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="cvc"
                        name="cvc"
                        value={formData.cvc}
                        onChange={handleChange}
                        placeholder="123"
                        maxLength="4"
                        required
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-colors duration-200 text-gray-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-6 py-4 border-y border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="font-semibold">SSL Secure</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Lock className="w-5 h-5 text-green-600" />
                    <span className="font-semibold">PCI Compliant</span>
                  </div>
                </div>

                {/* Weekly Emails Checkbox */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="weeklyEmails"
                    name="weeklyEmails"
                    checked={formData.weeklyEmails}
                    onChange={handleChange}
                    className="w-5 h-5 mt-0.5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label
                    htmlFor="weeklyEmails"
                    className="text-sm text-gray-700"
                  >
                    Send me weekly deal emails and updates
                  </label>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    required
                    className="w-5 h-5 mt-0.5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label
                    htmlFor="acceptTerms"
                    className="text-sm text-gray-700"
                  >
                    By signing up, you agree to our{" "}
                    <Link
                      to="/subscription-agreement"
                      className="text-primary-600 font-bold hover:underline"
                    >
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-primary-600 font-bold hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={!isStep3Valid()}
                  className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                    isStep3Valid()
                      ? "bg-primary-600 hover:bg-primary-700"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                  whileHover={isStep3Valid() ? { scale: 1.02 } : {}}
                  whileTap={isStep3Valid() ? { scale: 0.98 } : {}}
                >
                  <Lock className="w-5 h-5" />
                  Pay & Secure Membership — €9.99/year
                </motion.button>

                {/* Back Button */}
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="w-full py-3 text-gray-600 hover:text-gray-900 font-bold transition-colors"
                >
                  ← Back to Email Verification
                </button>
              </form>
            </motion.div>
          )}

          {/* Step 5: Success */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center"
            >
              {/* Success Animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6"
              >
                <CheckCircle className="w-16 h-16 text-green-600" />
              </motion.div>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Welcome to the Club!
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Your membership is now active. A welcome email will arrive
                within 48 hours with your first set of exclusive deals.
              </p>

              {/* Success Details */}
              <div className="bg-green-50 rounded-xl p-6 mb-8 max-w-md mx-auto">
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 shrink-0" />
                    <span className="text-gray-700">
                      Account created successfully
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 shrink-0" />
                    <span className="text-gray-700">
                      Payment processed securely
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 shrink-0" />
                    <span className="text-gray-700">
                      Welcome email on its way
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <motion.button
                  onClick={handleGoToDashboard}
                  className="w-full sm:w-auto px-8 py-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors inline-flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Go to My Dashboard
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                <div>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  >
                    <Home className="w-4 h-4" />
                    Back to Home
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SignupPage;
