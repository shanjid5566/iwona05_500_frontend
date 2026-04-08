import { useState, useEffect } from "react";
import { useUser } from "../../context/context.hooks";
import { useNavigate } from "react-router-dom";
import { Edit2, Save, X, Gift, Eye, EyeOff, Check, Calendar, AlertCircle, CheckCircle, Loader } from "lucide-react";
import PageTransition from "../../components/common/PageTransition";
import { toast } from "react-toastify";
import { userService, paymentService, giftService } from "../../services/api.services";
import ExpiredSubscriptionBanner from "../../components/common/ExpiredSubscriptionBanner";
import SubscriptionStatusCard from "../../components/common/SubscriptionStatusCard";

/**
 * User Dashboard Page
 * Features: View/Edit user details, manage travel preferences
 */
const DashboardPage = () => {
  const { user, isAuthenticated, updateUser } = useUser();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [editedFirstName, setEditedFirstName] = useState(user?.firstName || "");
  const [editedLastName, setEditedLastName] = useState(user?.lastName || "");
  const [editedPassword, setEditedPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [preferredAirport, setPreferredAirport] = useState(
    user?.homeAirport || "Dublin",
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Subscription State
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [isRenewing, setIsRenewing] = useState(false);

  // Gift Subscription State
  const [showGiftForm, setShowGiftForm] = useState(false);
  const [showGiftPassword, setShowGiftPassword] = useState(false);
  const [giftFormData, setGiftFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [giftPasswordValidation, setGiftPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const [profilePasswordValidation, setProfilePasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const airports = ["Dublin", "Cork", "Shannon", "Knock", "Kerry", "Belfast"];

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Fetch user profile and subscription data on mount
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchProfile = async () => {
      try {
        const response = await userService.getProfile();
        if (response.success && response.data?.user) {
          const userData = response.data.user;
          
          // Extract subscription data
          if (userData.subscription) {
            setSubscriptionData({
              planName: 'Annual Membership',
              status: userData.status || 'ACTIVE',
              startDate: userData.subscription.startDate,
              endDate: userData.subscription.endDate,
              isExpired: userData.status === 'INACTIVE',
              amount: 9.99,
            });
          }
          
          // If firstName/lastName are empty but fullName exists, parse it
          let firstName = userData.firstName || "";
          let lastName = userData.lastName || "";
          
          if ((!firstName || !lastName) && userData.fullName) {
            const nameParts = userData.fullName.trim().split(" ");
            if (!firstName && nameParts.length > 0) {
              firstName = nameParts[0];
            }
            if (!lastName && nameParts.length > 1) {
              lastName = nameParts.slice(1).join(" ");
            }
          }
          
          setEditedFirstName(firstName);
          setEditedLastName(lastName);
          setPreferredAirport(userData.homeAirport || "Dublin");
          updateUser(userData);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        toast.error("Failed to load profile. Please refresh the page.");
      }
    };

    fetchProfile();
  }, [isAuthenticated, updateUser]);

  // Sync form fields with user context whenever user data changes
  useEffect(() => {
    if (user) {
      let firstName = user.firstName || "";
      let lastName = user.lastName || "";
      
      // If firstName/lastName are empty but fullName exists, parse it
      if ((!firstName || !lastName) && user.fullName) {
        const nameParts = user.fullName.trim().split(" ");
        if (!firstName && nameParts.length > 0) {
          firstName = nameParts[0];
        }
        if (!lastName && nameParts.length > 1) {
          lastName = nameParts.slice(1).join(" ");
        }
      }
      
      setEditedFirstName(firstName);
      setEditedLastName(lastName);
      setPreferredAirport(user.homeAirport || "Dublin");
    }
  }, [user]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError("");
    setSuccess("");
    if (!isEditing) {
      setEditedFirstName(user?.firstName || "");
      setEditedLastName(user?.lastName || "");
      setEditedPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
      setProfilePasswordValidation({
        minLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false,
      });
    }
  };

  const handleSaveProfile = async () => {
    setError("");
    setSuccess("");

    // Validate names - required fields
    if (!editedFirstName.trim()) {
      setError("First name is required");
      return;
    }

    if (!editedLastName.trim()) {
      setError("Last name is required");
      return;
    }

    // Validate password if provided
    if (editedPassword) {
      if (!currentPassword) {
        setError("Current password is required to change password");
        return;
      }
      const { minLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar } = profilePasswordValidation;
      if (!(minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar)) {
        setError("Password must meet all requirements");
        return;
      }
      if (editedPassword !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }

    try {
      setSavingProfile(true);

      // Build update payload
      const updatePayload = {
        firstName: editedFirstName.trim(),
        lastName: editedLastName.trim(),
      };

      // Only include password fields if changing password
      if (editedPassword) {
        updatePayload.currentPassword = currentPassword;
        updatePayload.newPassword = editedPassword;
      }

      // Call API to update profile
      const response = await userService.updateProfile(updatePayload);

      if (response.success && response.data) {
        // Update context with new user data
        updateUser(response.data);
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
        setCurrentPassword("");
        setEditedPassword("");
        setConfirmPassword("");
        toast.success("Profile updated successfully!");

        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update profile";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePreferences = async () => {
    try {
      setSavingProfile(true);

      // Call API to update home airport
      const response = await userService.updateHomeAirport(preferredAirport);

      if (response.success && response.data?.user) {
        // Update context with new user data
        updateUser(response.data.user);
        setSuccess("Preferences saved successfully!");
        toast.success("Preferences saved successfully!");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to save preferences";
      toast.error(errorMessage);
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle profile password change with validation
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setEditedPassword(value);
    
    setProfilePasswordValidation({
      minLength: value.length >= 8,
      hasUpperCase: /[A-Z]/.test(value),
      hasLowerCase: /[a-z]/.test(value),
      hasNumber: /[0-9]/.test(value),
      hasSpecialChar: /[@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value),
    });
  };

  // Gift Subscription Handlers
  const handleGiftFormChange = (e) => {
    const { name, value } = e.target;
    setGiftFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Real-time password validation
    if (name === "password") {
      setGiftPasswordValidation({
        minLength: value.length >= 8,
        hasUpperCase: /[A-Z]/.test(value),
        hasLowerCase: /[a-z]/.test(value),
        hasNumber: /[0-9]/.test(value),
        hasSpecialChar: /[@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value),
      });
    }
  };

  const isGiftFormValid = () => {
    const { firstName, lastName, email, password } = giftFormData;
    const { minLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar } = giftPasswordValidation;
    
    return (
      firstName.trim() &&
      lastName.trim() &&
      email.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar
    );
  };

  const handleGiftSubscription = async (e) => {
    e.preventDefault();
    
    if (!isGiftFormValid()) {
      toast.error("Please fill all fields correctly and meet password requirements.");
      return;
    }

    try {
      setSavingProfile(true);
      
      // Call API to create gift subscription checkout session
      const response = await giftService.createCheckoutSession(giftFormData);
      
      if (response.success && response.data?.url) {
        // Redirect to Stripe Checkout
        toast.success("Redirecting to payment...");
        setTimeout(() => {
          window.location.href = response.data.url;
        }, 500);
      } else {
        toast.error("Failed to create checkout session. Please try again.");
      }
    } catch (error) {
      console.error("Error processing gift subscription:", error);
      const errorMessage = 
        error.response?.data?.message || 
        "Failed to process gift subscription. Please try again.";
      toast.error(errorMessage);
    } finally {
      setSavingProfile(false);
    }
  };

  const toggleGiftForm = () => {
    setShowGiftForm(!showGiftForm);
    setError("");
    setSuccess("");
    if (!showGiftForm) {
      setGiftFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });
      setGiftPasswordValidation({
        minLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false,
      });
    }
  };

  // Handle subscription renewal
  const handleRenewSubscription = async () => {
    try {
      setIsRenewing(true);
      const response = await paymentService.createCheckoutSession({ amount: 999 });
      
      if (response.success && response.data?.url) {
        // Redirect to Stripe checkout
        window.location.href = response.data.url;
      } else {
        toast.error(response.message || 'Failed to create checkout session');
        setIsRenewing(false);
      }
    } catch (error) {
      console.error('Renewal error:', error);
      toast.error(error.response?.data?.message || 'Failed to initiate renewal. Please try again.');
      setIsRenewing(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 py-24 px-4 sm:px-6 lg:px-8 mt-4">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Your Dashboard
            </h1>
            <p className="text-lg text-slate-600">
              Welcome back, {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.name || "Member"} !
            </p>
          </div>

          {/* Expired Subscription Banner */}
          {user?.status === 'INACTIVE' && (
            <ExpiredSubscriptionBanner
              onRenew={handleRenewSubscription}
              variant="prominent"
            />
          )}

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 p-5 bg-emerald-50 border-2 border-emerald-300 rounded-xl shadow-md animate-pulse">
              <div className="flex items-center gap-3 text-emerald-700">
                  <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-semibold text-emerald-900">{success}</p>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="mb-6 p-5 bg-red-50 border-2 border-red-300 rounded-xl shadow-md">
              <div className="flex items-center gap-3 text-red-700">
                  <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
                <div>
                  <p className="font-semibold text-red-900">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Account Information Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Account Information
              </h2>
              <button
                onClick={isEditing ? handleEditToggle : handleEditToggle}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                style={{
                  backgroundColor: isEditing ? "#e5e7eb" : "#22c55e",
                  color: isEditing ? "#374151" : "white",
                }}
              >
                {isEditing ? (
                  <>
                    <X className="w-4 h-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </>
                )}
              </button>
            </div>

            <div className="space-y-4">
              {/* Email - Not editable */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Email
                </label>
                <p className="text-base text-slate-900">
                  {user?.email || "N/A"}
                </p>
              </div>

              {/* Name - Show full name when not editing, separate fields when editing */}
              {!isEditing ? (
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Name
                  </label>
                  <p className="text-base text-slate-900">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : user?.name || "N/A"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First Name - Editable */}
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={editedFirstName}
                      onChange={(e) => setEditedFirstName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your first name"
                    />
                  </div>

                  {/* Last Name - Editable */}
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={editedLastName}
                      onChange={(e) => setEditedLastName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
              )}

              {/* Password - Editable only when editing */}
              {isEditing && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={editedPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter new password"
                    />
                    
                    {/* Password Requirements Checklist */}
                    {editedPassword && (
                      <div className="mt-3 space-y-2 bg-gray-50 rounded-lg p-3">
                        <p className="text-xs font-semibold text-gray-700 mb-2">Password must contain:</p>
                        {[
                          { key: 'minLength', label: 'At least 8 characters' },
                          { key: 'hasUpperCase', label: 'One uppercase letter (A-Z)' },
                          { key: 'hasLowerCase', label: 'One lowercase letter (a-z)' },
                          { key: 'hasNumber', label: 'One number (0-9)' },
                          { key: 'hasSpecialChar', label: 'One special character (@#$%...)' },
                        ].map((req) => (
                          <div key={req.key} className="flex items-center gap-2">
                            {profilePasswordValidation[req.key] ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <X className="w-4 h-4 text-gray-400" />
                            )}
                            <span className={`text-xs ${
                              profilePasswordValidation[req.key] ? 'text-green-600' : 'text-gray-600'
                            }`}>
                              {req.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Confirm new password"
                    />
                  </div>
                </>
              )}

              {/* Member Since - Not editable */}
              <div className="bg-linear-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1">
                      Member Since
                    </label>
                    <p className="text-lg font-bold text-slate-900">
                      {formatDate(user?.memberSince)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Save Button when editing */}
              {isEditing && (
                <button
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
                >
                  {savingProfile ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {savingProfile ? "Saving..." : "Save Changes"}
                </button>
              )}
            </div>
          </div>

          {/* Subscription Status Card */}
          {subscriptionData && (
            <div className="mb-8">
              <SubscriptionStatusCard
                subscription={subscriptionData}
                onRenew={handleRenewSubscription}
              />
            </div>
          )}

          {/* Travel Preferences Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Travel Preferences
            </h2>

            <div className="space-y-6">
              {/* Preferred Airport */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Preferred Airport
                </label>
                <select
                  value={preferredAirport}
                  onChange={(e) => setPreferredAirport(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
                >
                  {airports.map((airport) => (
                    <option key={airport} value={airport}>
                      {airport}
                    </option>
                  ))}
                </select>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSavePreferences}
                disabled={savingProfile}
                className="flex items-center gap-2 px-6 py-3 bg-olive text-white rounded-lg font-bold hover:opacity-90 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:opacity-100"
              >
                {savingProfile ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                {savingProfile ? "Saving..." : "Save Preferences"}
              </button>
            </div>
          </div>

          {/* Gift Subscription Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 rounded-xl flex-shrink-0">
                  <Gift className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Gift a Subscription
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Share the joy of travel with someone special
                  </p>
                </div>
              </div>
              <button
                onClick={toggleGiftForm}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap"
                style={{
                  backgroundColor: showGiftForm ? "#e5e7eb" : "#10b981",
                  color: showGiftForm ? "#374151" : "white",
                }}
              >
                {showGiftForm ? (
                  <>
                    <X className="w-4 h-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Gift className="w-4 h-4" />
                    Gift Now
                  </>
                )}
              </button>
            </div>

            {!showGiftForm ? (
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 sm:p-6 border border-emerald-100">
                <p className="text-slate-700 text-center text-sm sm:text-base">
                  Give the gift of incredible travel experiences! Your recipient will get access to exclusive deals, monthly giveaways, and expert travel guides for just €9.99/year.
                </p>
              </div>
            ) : (
              <form onSubmit={handleGiftSubscription} className="space-y-5 sm:space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-xs sm:text-sm text-blue-800">
                    <strong>How it works:</strong> Enter the recipient&apos;s details below. After payment, their account will be created automatically and they&apos;ll receive an email with login credentials.
                  </p>
                </div>

                {/* Recipient's First Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Recipient&apos;s First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={giftFormData.firstName}
                    onChange={handleGiftFormChange}
                    placeholder="Enter first name"
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-colors duration-200 text-gray-900 text-sm sm:text-base"
                  />
                </div>

                {/* Recipient's Last Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Recipient&apos;s Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={giftFormData.lastName}
                    onChange={handleGiftFormChange}
                    placeholder="Enter last name"
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-colors duration-200 text-gray-900 text-sm sm:text-base"
                  />
                </div>

                {/* Recipient's Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Recipient&apos;s Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={giftFormData.email}
                    onChange={handleGiftFormChange}
                    placeholder="recipient@example.com"
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-colors duration-200 text-gray-900 text-sm sm:text-base"
                  />
                </div>

                {/* Set Password for Recipient */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Set Password for Recipient *
                  </label>
                  <div className="relative">
                    <input
                      type={showGiftPassword ? "text" : "password"}
                      name="password"
                      value={giftFormData.password}
                      onChange={handleGiftFormChange}
                      placeholder="Create a secure password"
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-colors duration-200 text-gray-900 text-sm sm:text-base"
                    />
                    <button
                      type="button"
                      onClick={() => setShowGiftPassword(!showGiftPassword)}
                      className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showGiftPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>
                  </div>

                  {/* Password Requirements Checklist */}
                  {giftFormData.password && (
                    <div className="mt-3 sm:mt-4 space-y-2 bg-gray-50 rounded-lg p-3 sm:p-4">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Password must contain:</p>
                      {[
                        { key: 'minLength', label: 'At least 8 characters' },
                        { key: 'hasUpperCase', label: 'One uppercase letter (A-Z)' },
                        { key: 'hasLowerCase', label: 'One lowercase letter (a-z)' },
                        { key: 'hasNumber', label: 'One number (0-9)' },
                        { key: 'hasSpecialChar', label: 'One special character (@#$%...)' },
                      ].map((req) => (
                        <div key={req.key} className="flex items-center gap-2">
                          {giftPasswordValidation[req.key] ? (
                            <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                          ) : (
                            <X className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                          )}
                          <span className={`text-xs ${
                            giftPasswordValidation[req.key] ? 'text-green-600' : 'text-gray-600'
                          }`}>
                            {req.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 sm:gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={!isGiftFormValid() || savingProfile}
                    className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    {savingProfile ? (
                      <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    ) : (
                      <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                    {savingProfile ? "Processing..." : "Proceed to Payment (€9.99)"}
                  </button>
                </div>

                <p className="text-xs text-center text-gray-500">
                  After payment, the recipient will receive an email with their login credentials and subscription details.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default DashboardPage;
