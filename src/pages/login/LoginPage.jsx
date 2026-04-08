import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import UserContext from '../../context/UserContext';
import { authService } from '../../services/api.services';

/**
 * Login Page
 * Welcome Back login form with gradient background matching Travel Guides section
 */
const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { email, password } = formData;

      // Real API call
      const response = await authService.login({ email, password });

      if (response.success) {
        // Extract user data from response
        const userData = {
          id: response.data.user.id,
          name: response.data.user.fullName || `${response.data.user.firstName} ${response.data.user.lastName}`,
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          email: response.data.user.email,
          role: response.data.user.role.toLowerCase(), // Convert to lowercase for consistency
          memberSince: response.data.user.createdAt,
          homeAirport: response.data.user.homeAirport,
          status: response.data.user.status,
          isEmailVerified: response.data.user.isEmailVerified,
          subscription: response.data.user.subscription,
        };

        // Login user first (stores user data in localStorage)
        login(userData);

        // Show success message
        toast.success(response.message || 'Welcome back! Login successful.');

        // Redirect based on user status and role
        if (userData.role === 'admin') {
          // Admin can access regardless of subscription
          navigate('/admin');
        } else if (userData.status === 'PENDING') {
          // PENDING: User registered but hasn't paid yet
          toast.warning('Please complete your payment to access member benefits.');
          // Store email for payment flow
          localStorage.setItem('pending_payment_email', userData.email);
          // Redirect to dashboard where they'll see PendingPaymentBanner
          navigate('/dashboard');
        } else if (userData.status === 'INACTIVE') {
          // INACTIVE: Subscription expired
          toast.warning('Your subscription has expired. Please renew to continue.');
          // Redirect to dashboard where they'll see ExpiredSubscriptionBanner
          navigate('/dashboard');
        } else if (userData.status === 'ACTIVE') {
          // ACTIVE: All good, redirect to members club
          navigate('/members-club');
        } else {
          // Unknown status, redirect to dashboard
          navigate('/dashboard');
        }
      } else {
        toast.error(response.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('❌ Login error (full):', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error message:', error.message);
      
      // Handle specific error messages
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (error.message === 'Network Error') {
        toast.error('Unable to connect to server. Please check if backend is running at ' + import.meta.env.VITE_API_BASE_URL);
      } else if (error.code === 'ERR_NETWORK') {
        toast.error('Network error. Please check CORS settings or if backend is running.');
      } else {
        toast.error('Login failed: ' + (error.message || 'Unknown error'));
      }
    } finally {
      setLoading(false);
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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Welcome Back
          </h1>
          <p className="text-base text-gray-600">
            Log in to access your Travel in a Click account
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
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

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors duration-200 text-gray-900"
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors duration-200 text-gray-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end py-1">
            <Link
              to="/forgot-password"
              className="text-sm text-gray-600 hover:text-green-600 transition-colors duration-200 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>

          {/* Sign In Button */}
          <motion.button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-olive text-white font-bold rounded-xl transition-colors duration-300 shadow-md ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-olive/90'
            }`}
            whileHover={loading ? {} : { scale: 1.02 }}
            whileTap={loading ? {} : { scale: 0.98 }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </motion.button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 space-y-4">
          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-green-600 font-bold hover:text-green-700 transition-colors duration-200"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Back to Home Link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
