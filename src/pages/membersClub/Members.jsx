import PageTransition from '../../components/common/PageTransition';
import { useUser } from '../../context/context.hooks';
import { Hero, MemberQuickLinks, PerksGrid, FinalCTA, StickyCTA } from './components';
import MonthlyGiveaways from '../home/components/MonthlyGiveaways';
import TravelDeals from '../home/components/TravelDeals';
import TravelGuides from '../home/components/TravelGuides';

/**
 * Members Club Page
 * Luxurious, modern design with dynamic visitor/member views
 * Features: Bento Grid, Glassmorphism, Framer Motion animations
 */
const Members = () => {
  const { isAuthenticated, user } = useUser();

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        {/* Hero Section - Dynamic based on auth status */}
        <Hero
          isAuthenticated={isAuthenticated}
          userName={user?.firstName || user?.name || user?.username}
        />

        {/* Quick Links - Only for authenticated members */}
        {isAuthenticated && <MemberQuickLinks />}

        {/* Monthly Giveaways - Only for authenticated members */}
        {isAuthenticated && <MonthlyGiveaways />}


        {/* Perks & Benefits - Interactive Bento Grid */}
        <PerksGrid isAuthenticated={isAuthenticated} />

        {/* Testimonials - Wall of Love Masonry */}
        {/* <Testimonials isAuthenticated={isAuthenticated} /> */}

        {/* Final CTA Section */}
        <FinalCTA isAuthenticated={isAuthenticated} />

        {/* Sticky Bottom Bar */}
        <StickyCTA isAuthenticated={isAuthenticated} />
      </div>
    </PageTransition>
  );
};

export default Members;
