import Banner from './components/Banner';
import VideoSection from './components/VideoSection';
import TravelDeals from './components/TravelDeals';
import TravelGuides from './components/TravelGuides';
import WhyBecomeMember from './components/WhyBecomeMember';
import JoinMembersClub from './components/JoinMembersClub';
import MonthlyGiveaways from './components/MonthlyGiveaways';
import FAQ from './components/FAQ';
import { useUser } from '../../context/context.hooks';

/**
 * Home Page
 * Landing page with hero banner and features
 */
const Home = () => {
  const { isAuthenticated } = useUser();

  return (
    <div className="min-h-screen">
      <Banner />
      
      <VideoSection />

      <TravelDeals />

      <TravelGuides />

      {/* Hide these sections when authenticated */}
      {!isAuthenticated && (
        <>
          <WhyBecomeMember />

          <JoinMembersClub />
        </>
      )}

      <MonthlyGiveaways />

      <FAQ />


    </div>
  );
};

export default Home;
