import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useApp } from "../../../context/context.hooks";
import Spinner from "../../common/Spinner";
import PageTransition from "../../common/PageTransition";
import PendingPaymentBanner from "../../common/PendingPaymentBanner";

/**
 * Main Layout Component
 * Wraps all pages with Header and Footer
 * Shows global loading state and pending payment banner
 */
const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <PendingPaymentBanner />

      {/* Main Content */}
      <main className="flex-1 ">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
