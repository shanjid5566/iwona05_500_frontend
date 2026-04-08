import { api } from './api';

/**
 * Authentication API service
 * Handles all authentication-related API calls
 */
export const authService = {
  /**
   * Login user with email and password
   * @param {Object} credentials - User credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise} API response with token and user data
   */
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    
    // Store token in localStorage
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('app_token', response.data.data.token);
    }
    
    return response.data;
  },

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @param {string} userData.firstName - First name
   * @param {string} userData.lastName - Last name
   * @param {string} userData.email - Email
   * @param {string} userData.password - Password
   * @returns {Promise} API response
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    
    // Save email for OTP verification
    if (response.data.success) {
      localStorage.setItem('registration_email', userData.email);
    }
    
    return response.data;
  },

  /**
   * Verify OTP and get payment URL
   * @param {Object} otpData - OTP verification data
   * @param {string} otpData.email - User email
   * @param {string} otpData.code - 4-digit OTP code
   * @param {number} otpData.amount - Optional amount in cents (default 999 = €9.99)
   * @returns {Promise} API response with token, user data, and paymentUrl
   */
  verifyOtp: async (otpData) => {
    const response = await api.post('/auth/verify-otp', otpData);
    
    // SAVE TOKEN after OTP verification  
    // Security: PENDING users still can't login (blocked in LoginPage)
    if (response.data.success && response.data.data?.token) {
      const token = response.data.data.token;
      
      // Save to BOTH localStorage AND sessionStorage for redundancy
      localStorage.setItem('app_token', token);
      sessionStorage.setItem('app_token_backup', token);
    }
    
    // Store email for payment tracking
    if (response.data.success && response.data.data?.user?.email) {
      localStorage.setItem('pending_payment_email', response.data.data.user.email);
    }
    
    return response.data;
  },

  /**
   * Resend OTP
   * @param {Object} data - Email data
   * @param {string} data.email - User email
   * @returns {Promise} API response
   */
  resendOtp: async (data) => {
    const response = await api.post('/auth/resend-otp', data);
    return response.data;
  },

  /**
   * Forgot password - Step 1: Send reset code to email
   * @param {Object} data - Email data
   * @param {string} data.email - User email
   * @returns {Promise} API response
   */
  forgotPassword: async (data) => {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  },

  /**
   * Verify reset OTP - Step 2: Verify OTP and get reset token
   * @param {Object} data - OTP verification data
   * @param {string} data.email - User email
   * @param {string} data.code - 4-digit OTP code
   * @returns {Promise} API response with resetToken
   */
  verifyResetOtp: async (data) => {
    const response = await api.post('/auth/verify-reset-otp', data);
    return response.data;
  },

  /**
   * Reset password - Step 3: Set new password
   * @param {Object} data - Reset password data
   * @param {string} data.resetToken - Token from verify reset OTP
   * @param {string} data.newPassword - New password
   * @returns {Promise} API response
   */
  resetPassword: async (data) => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  /**
   * Logout user
   * @returns {Promise} API response
   */
  logout: async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('app_token');
    localStorage.removeItem('app_user');
    return response.data;
  },
};

/**
 * User-related API service
 * Demonstrates clean service layer pattern
 */
export const userService = {
  /**
   * Get all users
   */
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  /**
   * Get user by ID
   */
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  /**
   * Create new user
   */
  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  /**
   * Update user
   */
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  /**
   * Delete user
   */
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  /**
   * Get current user profile
   * @returns {Promise} API response with user data
   */
  getProfile: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  /**
   * Update user profile
   * @param {Object} profileData - User profile data
   * @param {string} profileData.firstName - First name
   * @param {string} profileData.lastName - Last name
   * @param {string} profileData.currentPassword - Current password (required if changing password)
   * @param {string} profileData.newPassword - New password (optional)
   * @returns {Promise} API response with updated user data
   */
  updateProfile: async (profileData) => {
    const response = await api.put('/users/me', profileData);
    return response.data;
  },

  /**
   * Update user home airport preference
   * @param {string} homeAirport - Home airport code (e.g., "LAX", "JFK")
   * @returns {Promise} API response with updated user data
   */
  updateHomeAirport: async (homeAirport) => {
    const response = await api.put('/users/me/home-airport', { homeAirport });
    return response.data;
  },
};

/**
 * Posts-related API service
 */
export const postService = {
  /**
   * Get all posts
   */
  getPosts: async (params = {}) => {
    const response = await api.get('/posts', { params });
    return response.data;
  },

  /**
   * Get post by ID
   */
  getPostById: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  /**
   * Create new post
   */
  createPost: async (postData) => {
    const response = await api.post('/posts', postData);
    return response.data;
  },
};

/**
 * Payment API service
 * Handles payment verification and subscription management
 */
export const paymentService = {
  /**
   * Verify Stripe payment session
   * @param {Object} data - Payment verification data
   * @param {string} data.sessionId - Stripe checkout session ID
   * @returns {Promise} API response with payment status
   */
  verifyPayment: async (data) => {
    const response = await api.post('/payment/verify', data);
    
    // Store token and user data ONLY after successful payment
    if (response.data.success && response.data.data) {
      // Store token
      if (response.data.data.token) {
        localStorage.setItem('app_token', response.data.data.token);
      }
      
      // Store user data with ACTIVE status
      if (response.data.data.user) {
        response.data.data.user.status = 'ACTIVE';
        localStorage.setItem('app_user', JSON.stringify(response.data.data.user));
      }
      
      // Clear pending payment email
      localStorage.removeItem('pending_payment_email');
    }
    
    return response.data;
  },

  /**
   * Create checkout session for authenticated user
   * Requires user to be logged in with auth token
   * @param {Object} data - Payment data
   * @param {number} data.amount - Optional amount in cents (default 999)
   * @returns {Promise} API response with Stripe checkout URL
   */
  createCheckoutSession: async (data = { amount: 999 }) => {
    // This endpoint requires authentication (token in header)
    // The api client already adds Authorization header from localStorage
    const response = await api.post('/payment/create-checkout-session', data);
    return response.data;
  },
};

/**
 * Admin API service
 * Handles admin-related API calls
 */
export const adminService = {
  /**
   * Get dashboard statistics
   * @returns {Promise} API response with dashboard data
   */
  getDashboard: async () => {
    const response = await api.get('/dashboard');
    return response.data;
  },

  /**
   * Get all users with pagination, search, and filtering
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 10)
   * @param {string} params.search - Search query (optional)
   * @param {string} params.status - Status filter (ACTIVE/INACTIVE) (optional)
   * @param {string} params.sortBy - Sort field (default: createdAt)
   * @param {string} params.sortOrder - Sort order (asc/desc) (default: desc)
   * @returns {Promise} API response with users data and pagination
   */
  getAllUsers: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  /**
   * Get user by ID
   * @param {string} id - User ID
   * @returns {Promise} API response with user data
   */
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  /**
   * Update user
   * @param {string} id - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise} API response with updated user data
   */
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  /**
   * Delete user
   * @param {string} id - User ID
   * @returns {Promise} API response
   */
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  /**
   * Export members as PDF
   * @returns {Promise} Blob response (PDF file)
   */
  exportMembersPdf: async () => {
    const response = await api.get('/users/export/pdf', { responseType: 'blob' });
    return response;
  },
};

/**
 * Travel guides API service
 */
export const travelGuideService = {
  /**
   * Create travel guide (multipart/form-data)
   * @param {Object} guide - Guide payload
   * @param {string} guide.title - Guide title
   * @param {string} guide.description - Guide description
   * @param {string} guide.category - Guide category
   * @param {string} guide.location - Guide location
   * @param {string} guide.readTime - Estimated read time
   * @param {Array} guide.content - Structured content array
   * @param {File|null} guide.heroImageFile - Optional hero image file
   * @returns {Promise} API response
   */
  createGuide: async ({
    title,
    description,
    category,
    location,
    readTime,
    content,
    heroImageFile,
  }) => {
    const formData = new FormData();
    formData.append('title', title ?? '');
    formData.append('description', description ?? '');
    formData.append('category', category ?? '');
    formData.append('location', location ?? '');
    formData.append('readTime', readTime || '');
    formData.append('content', JSON.stringify(content || []));

    if (heroImageFile) {
      formData.append('heroImage', heroImageFile);
    }

    const response = await api.post('/travel-guides', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  },

  /**
   * Get paginated travel guides
   */
  getGuides: async (params = {}) => {
    const response = await api.get('/travel-guides', {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        search: params.search ?? '',
        category: params.category ?? '',
        sortBy: params.sortBy ?? 'title',
        sortOrder: params.sortOrder ?? 'asc',
      },
    });
    return response.data;
  },

  /**
   * Get single travel guide by id
   */
  getGuideById: async (id) => {
    const response = await api.get(`/travel-guides/${id}`);
    return response.data;
  },

  /**
   * Update travel guide (multipart/form-data)
   */
  updateGuide: async (id, {
    title,
    description,
    category,
    location,
    readTime,
    content,
    heroImageFile,
  }) => {
    const formData = new FormData();
    formData.append('title', title ?? '');
    formData.append('description', description ?? '');
    formData.append('category', category ?? '');
    formData.append('location', location ?? '');
    formData.append('readTime', readTime || '');
    formData.append('content', JSON.stringify(content || []));

    if (heroImageFile) {
      formData.append('heroImage', heroImageFile);
    }

    const response = await api.put(`/travel-guides/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * Delete travel guide
   */
  deleteGuide: async (id) => {
    const response = await api.delete(`/travel-guides/${id}`);
    return response.data;
  },
};

/**
 * Giveaways API service
 */
export const giveawaysService = {
  /**
   * Get paginated giveaways with optional filters
   */
  getAllGiveaways: async (params = {}) => {
    const response = await api.get('/giveaways', {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        search: params.search ?? '',
        status: params.status ?? '',
        sortBy: params.sortBy ?? 'createdAt',
        sortOrder: params.sortOrder ?? 'desc',
      },
    });
    return response.data;
  },

  /**
   * Get single giveaway by ID
   */
  getGiveawayById: async (id) => {
    const response = await api.get(`/giveaways/${id}`);
    return response.data;
  },

  /**
   * Get active giveaway (authenticated)
   */
  getActiveGiveaway: async (params = {}) => {
    const response = await api.get('/giveaways/active', {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
      },
    });
    return response.data;
  },

  /**
   * Get public active giveaway (no auth required)
   */
  getPublicActiveGiveaway: async () => {
    const response = await api.get('/giveaways/public/active');
    return response.data;
  },

  /**
   * Check entry status for authenticated user
   * Returns active giveaway with hasEntered flag
   */
  checkEntryStatus: async () => {
    const response = await api.get('/giveaways/check-status');
    return response.data;
  },

  /**
   * Enter giveaway (POST)
   */
  enterGiveaway: async (id) => {
    const response = await api.post(`/giveaways/${id}/enter`);
    return response.data;
  },

  /**
   * Create giveaway (multipart/form-data)
   */
  createGiveaway: async (data) => {
    const formData = new FormData();
    formData.append('title', data.title ?? '');
    formData.append('description', data.description ?? '');
    formData.append('status', data.status ?? 'DRAFT');
    formData.append('startDate', data.startDate ?? '');
    formData.append('endDate', data.endDate ?? '');
    formData.append('isMonthlyActive', data.isMonthlyActive ?? false);

    if (data.giveawayImageFile) {
      formData.append('giveawayImage', data.giveawayImageFile);
    }

    const response = await api.post('/giveaways', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * Update giveaway (multipart/form-data)
   */
  updateGiveaway: async (id, data) => {
    const formData = new FormData();
    formData.append('title', data.title ?? '');
    formData.append('description', data.description ?? '');
    formData.append('status', data.status ?? 'DRAFT');
    formData.append('startDate', data.startDate ?? '');
    formData.append('endDate', data.endDate ?? '');
    formData.append('isMonthlyActive', data.isMonthlyActive ?? false);

    if (data.giveawayImageFile) {
      formData.append('giveawayImage', data.giveawayImageFile);
    }

    const response = await api.put(`/giveaways/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * Delete giveaway
   */
  deleteGiveaway: async (id) => {
    const response = await api.delete(`/giveaways/${id}`);
    return response.data;
  },

  /**
   * Get entries for a giveaway
   */
  getGiveawayEntries: async (id, params = {}) => {
    const response = await api.get(`/giveaways/${id}/entries`, {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 50,
      },
    });
    return response.data;
  },

  /**
   * Mark/unmark giveaway as monthly active
   */
  toggleMonthlyActive: async (id) => {
    const response = await api.patch(`/giveaways/${id}/toggle-monthly-active`);
    return response.data;
  },
};

/**
 * Settings API service
 */
export const settingsService = {
  /**
   * Get global settings
   */
  getSettings: async () => {
    const response = await api.get('/settings');
    return response.data;
  },

  /**
   * Update global settings
   */
  updateSettings: async (data) => {
    const payload = {
      websiteName: data.websiteName ?? '',
      contactEmail: data.contactEmail ?? '',
      defaultHomeAirport: data.defaultHomeAirport ?? '',
      aboutUsText: data.aboutUsText ?? '',
      requireEmailConfirm: data.requireEmailConfirm ?? false,
      allowPublicReg: data.allowPublicReg ?? false,
    };
    const response = await api.put('/settings', payload);
    return response.data;
  },
};

/**
 * Travel deals API service
 */
export const travelDealsService = {
  /**
   * Get featured travel deals
   * @param {Object} params
   * @param {number} [params.page=1]
   * @param {number} [params.limit=10]
   */
  getFeaturedDeals: async (params = {}) => {
    const response = await api.get('/travel-deals/featured', {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
      },
    });
    return response.data;
  },

  /**
   * Get paginated travel deals with optional filters
   * @param {Object} params
   * @param {number} [params.page=1]
   * @param {number} [params.limit=10]
   * @param {string} [params.search='']
   * @param {string} [params.status=''] - e.g., ACTIVE/INACTIVE
   * @param {string} [params.sortBy='createdAt']
   * @param {string} [params.sortOrder='desc']
   */
  getAllDeals: async (params = {}) => {
    const response = await api.get('/travel-deals', {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        search: params.search ?? '',
        status: params.status ?? '',
        airport: params.airport ?? '',
        sortBy: params.sortBy ?? 'createdAt',
        sortOrder: params.sortOrder ?? 'desc',
      },
    });
    return response.data;
  },

  /**
   * Get single travel deal by ID
   */
  getDealById: async (id) => {
    const response = await api.get(`/travel-deals/${id}`);
    return response.data;
  },

  /**
   * Create travel deal (multipart/form-data)
   */
  createDeal: async (dealData) => {
    const formData = new FormData();
    formData.append('title', dealData.title ?? '');
    formData.append('description', dealData.description ?? '');
    formData.append('destination', dealData.destination ?? '');
    formData.append('airport', dealData.airport ?? '');
    formData.append('price', dealData.price ?? 0);
    formData.append('discount', dealData.discount ?? 0);
    formData.append('travelStartDate', dealData.travelStartDate ?? '');
    formData.append('travelEndDate', dealData.travelEndDate ?? '');
    formData.append('flightBookingLink', dealData.flightBookingLink ?? '');
    formData.append('hotelBookingLink', dealData.hotelBookingLink ?? '');
    formData.append('status', dealData.status ?? 'ACTIVE');
    formData.append('isFeatured', dealData.isFeatured ?? false);

    if (dealData.dealImageFile) {
      formData.append('image', dealData.dealImageFile);
    }

    const response = await api.post('/travel-deals', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * Update travel deal (multipart/form-data)
   */
  updateDeal: async (id, dealData) => {
    const formData = new FormData();
    formData.append('title', dealData.title ?? '');
    formData.append('description', dealData.description ?? '');
    formData.append('destination', dealData.destination ?? '');
    formData.append('airport', dealData.airport ?? '');
    formData.append('price', dealData.price ?? 0);
    formData.append('discount', dealData.discount ?? 0);
    formData.append('travelStartDate', dealData.travelStartDate ?? '');
    formData.append('travelEndDate', dealData.travelEndDate ?? '');
    formData.append('flightBookingLink', dealData.flightBookingLink ?? '');
    formData.append('hotelBookingLink', dealData.hotelBookingLink ?? '');
    formData.append('status', dealData.status ?? 'ACTIVE');
    formData.append('isFeatured', dealData.isFeatured ?? false);

    if (dealData.dealImageFile) {
      formData.append('image', dealData.dealImageFile);
    }

    const response = await api.put(`/travel-deals/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * Delete travel deal
   */
  deleteDeal: async (id) => {
    const response = await api.delete(`/travel-deals/${id}`);
    return response.data;
  },

  /**
   * Toggle featured flag
   */
  toggleFeatured: async (id) => {
    const response = await api.patch(`/travel-deals/${id}/featured`);
    return response.data;
  },
};

/**
 * Contact API service
 * Handles contact form submissions
 */
export const contactService = {
  /**
   * Submit contact form
   * @param {Object} formData - Contact form data
   * @param {string} formData.fullName - Full name
   * @param {string} formData.email - Email address
   * @param {string} formData.message - Message content
   * @returns {Promise} API response
   */
  submitContact: async (formData) => {
    const response = await api.post('/contact/submit', formData);
    return response.data;
  },
};

/**
 * Gift Subscription API service
 * Handles gift subscription checkout and verification
 */
export const giftService = {
  /**
   * Create gift subscription checkout session
   * @param {Object} giftData - Gift subscription data
   * @param {string} giftData.recipientEmail - Recipient's email
   * @param {string} giftData.recipientPassword - Temporary password for recipient (min 8 chars)
   * @param {string} giftData.recipientFirstName - Recipient's first name
   * @param {string} giftData.recipientLastName - Recipient's last name
   * @param {number} giftData.amount - Amount in cents (optional, defaults to 999 = €9.99)
   * @returns {Promise} API response with sessionId, url, publishableKey, etc.
   */
  createCheckoutSession: async (giftData) => {
    const response = await api.post(
      '/payment/gift/create-checkout-session',
      {
        recipientEmail: giftData.email,
        recipientPassword: giftData.password,
        recipientFirstName: giftData.firstName,
        recipientLastName: giftData.lastName,
        amount: giftData.amount || 999, // Default €9.99
      }
    );
    return response.data;
  },

  /**
   * Verify gift payment and create recipient user
   * Called after successful Stripe checkout
   * @param {string} sessionId - Stripe session ID from redirect
   * @returns {Promise} API response with recipient and subscription info
   */
  verifyGiftPayment: async (sessionId) => {
    const response = await api.post(
      '/payment/gift/verify',
      { sessionId }
    );
    return response.data;
  },
};
