import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Spinner from '../components/common/Spinner';
import ScrollToTop from '../components/common/ScrollToTop';
import AdminMembers from '../pages/admin/adminMember/AdminMembers';
import AdminDashboard from '../pages/admin/dashboard/AdminDashboard';
import AdminUserRoles from '../pages/admin/adminRoles/AdminUserRoles';
import AdminTravelGuides from '../pages/admin/adminTraavelGuides/AdminTravelGuides';
import AdminTravelDeals from '../pages/admin/adminTravelDeals/AdminTravelDeals';
import AdminGiveaways from '../pages/admin/adminGiveaways/AdminGiveaways';
import AdminSettings from '../pages/admin/adminSettings/AdminSettings';

// Lazy load layouts
const MainLayout = lazy(() => import('../components/layout/mainLayout/MainLayout'));
const AdminLayout = lazy(() => import('../components/layout/adminLayout/AdminLayout'));

// Lazy load pages
const Home = lazy(() => import('../pages/home/Home'));
const FAQPage = lazy(() => import('../pages/faq/FAQPage'));
const GiveawayPage = lazy(() => import('../pages/giveaway/GiveawayPage'));
const ContactPage = lazy(() => import('../pages/contact/ContactPage'));
const LoginPage = lazy(() => import('../pages/login/LoginPage'));
const SignupPage = lazy(() => import('../pages/signup/SignupPage'));
const VerifyOtpPage = lazy(() => import('../pages/verifyOtp/VerifyOtpPage'));
const ForgotPasswordPage = lazy(() => import('../pages/forgotPassword/ForgotPasswordPage'));
const SubscriptionAgreement = lazy(() => import('../pages/subscriptionAgreement/SubscriptionAgreement'));
const TermsConditions = lazy(() => import('../pages/terms/TermsConditions'));
const PrivacyPolicy = lazy(() => import('../pages/privacy/PrivacyPolicy'));
const NotFound = lazy(() => import('../pages/notFound/NotFound'));
const Members = lazy(() => import('../pages/membersClub/Members'));
const TravelDealsPage = lazy(() => import('../pages/travelDeals/TravelDealsPage'));
const TravelDealDetail = lazy(() => import('../pages/travelDeals/components/TravelDealDetail'));
const TravelGuidesPage = lazy(() => import('../pages/travelGuides/TravelGuidesPage'));
const TravelGuideDetail = lazy(() => import('../pages/travelGuides/components/TravelGuideDetail'));
const DashboardPage = lazy(() => import('../pages/Dashboard/DashboardPage'));

// Lazy load payment pages
const PaymentSuccess = lazy(() => import('../pages/payment/PaymentSuccess'));
const PaymentCancel = lazy(() => import('../pages/payment/PaymentCancel'));

// Lazy load admin pages


// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary-50 to-accent-50">
    <Spinner />
  </div>
);


/**
 * Declarative router using BrowserRouter + Routes
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            {/* <Route path="about" element={<About />} /> */}
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="members-club" element={<Members />} />
            <Route path="travel-deals" element={<TravelDealsPage />} />
            <Route path="travel-deals/:dealSlug" element={<TravelDealDetail />} />
            <Route path="travel-guides" element={<TravelGuidesPage />} />
            <Route path="travel-guides/:guideSlug" element={<TravelGuideDetail />} />
            <Route path="faq" element={<FAQPage />} />
            <Route path="giveaways" element={<GiveawayPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="verify-otp" element={<VerifyOtpPage />} />
            <Route path="payment/success" element={<PaymentSuccess />} />
            <Route path="payment/cancel" element={<PaymentCancel />} />
            <Route path="subscription-agreement" element={<SubscriptionAgreement />} />
            <Route path="terms" element={<TermsConditions />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="members" element={<AdminMembers />} />
            <Route path="user-roles" element={<AdminUserRoles />} />
            <Route path="travel-guides" element={<AdminTravelGuides />} />
            <Route path="travel-deals" element={<AdminTravelDeals />} />
            <Route path="giveaways" element={<AdminGiveaways />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Fallback in case layout route doesn't match */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
