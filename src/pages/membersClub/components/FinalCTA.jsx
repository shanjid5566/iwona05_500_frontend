import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, ArrowRight, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Final CTA Section - Conversion focused bottom section
 * Different content for visitors vs members
 */
const FinalCTA = ({ isAuthenticated }) => {
  const navigate = useNavigate();

  // if (isAuthenticated) {
  //   // MEMBER VIEW - Action cards
  //   return (
  //     <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-white">
  //       <div className="max-w-7xl mx-auto">
  //         {/* Section Header */}
  //         <motion.div
  //           className="text-center mb-12"
  //           initial={{ opacity: 0, y: 20 }}
  //           whileInView={{ opacity: 1, y: 0 }}
  //           viewport={{ once: true }}
  //           transition={{ duration: 0.6 }}
  //         >
  //           <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
  //             Make the Most of Your Membership
  //           </h2>
  //           <p className="text-xl text-slate-600">
  //             Quick links to your exclusive member benefits
  //           </p>
  //         </motion.div>

  //         {/* Action Cards Grid */}
  //         <motion.div
  //           className="grid md:grid-cols-3 gap-6"
  //           initial={{ opacity: 0, y: 20 }}
  //           whileInView={{ opacity: 1, y: 0 }}
  //           viewport={{ once: true }}
  //           transition={{ delay: 0.2 }}
  //         >
  //           {/* Browse Deals Card */}
  //           <motion.div
  //             whileHover={{ y: -8, scale: 1.02 }}
  //             className="group bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 cursor-pointer border-2 border-emerald-100 hover:border-emerald-300 transition-all duration-300 flex flex-col"
  //             onClick={(e) => {
  //               e.stopPropagation();
  //               navigate('/travel-deals');
  //             }}
  //           >
  //             <div className="w-14 h-14 bg-emerald-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
  //               <TrendingUp className="w-7 h-7 text-white" />
  //             </div>
  //             <h3 className="text-2xl font-bold text-slate-900 mb-3">Browse Deals</h3>
  //             <p className="text-slate-600 mb-6 grow">
  //               View all exclusive travel deals from your airport
  //             </p>
  //             <div className="flex items-center text-emerald-600 font-semibold group-hover:translate-x-2 transition-transform">
  //               See Deals
  //               <ArrowRight className="w-5 h-5 ml-2" />
  //             </div>
  //           </motion.div>

  //           {/* Enter Giveaway Card */}
  //           <motion.div
  //             whileHover={{ y: -8, scale: 1.02 }}
  //             className="group bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 cursor-pointer border-2 border-teal-100 hover:border-teal-300 transition-all duration-300 flex flex-col"
  //             onClick={(e) => {
  //               e.stopPropagation();
  //               navigate('/giveaways');
  //             }}
  //           >
  //             <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
  //               <Sparkles className="w-7 h-7 text-white" />
  //             </div>
  //             <h3 className="text-2xl font-bold text-slate-900 mb-3">Enter Giveaway</h3>
  //             <p className="text-slate-600 mb-6 grow">
  //               Win free trips worth up to €500 every month
  //             </p>
  //             <div className="flex items-center text-teal-600 font-semibold group-hover:translate-x-2 transition-transform">
  //               Enter Now
  //               <ArrowRight className="w-5 h-5 ml-2" />
  //             </div>
  //           </motion.div>

  //           {/* Travel Guides Card */}
  //           <motion.div
  //             whileHover={{ y: -8, scale: 1.02 }}
  //             className="group bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl p-8 cursor-pointer border-2 border-slate-200 hover:border-slate-400 transition-all duration-300 flex flex-col"
  //             onClick={(e) => {
  //               e.stopPropagation();
  //               navigate('/travel-guides');
  //             }}
  //           >
  //             <div className="w-14 h-14 bg-slate-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
  //               <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  //               </svg>
  //             </div>
  //             <h3 className="text-2xl font-bold text-slate-900 mb-3">Travel Guides</h3>
  //             <p className="text-slate-600 mb-6 grow">
  //               Expert tips and destination insights
  //             </p>
  //             <div className="flex items-center text-slate-700 font-semibold group-hover:translate-x-2 transition-transform">
  //               Explore Guides
  //               <ArrowRight className="w-5 h-5 ml-2" />
  //             </div>
  //           </motion.div>
  //         </motion.div>
  //       </div>
  //     </section>
  //   );
  // }
if (isAuthenticated) {
  return (
    <></>
  );
}

  // VISITOR VIEW - Strong conversion CTA
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#0B8659] overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{ duration: 25, repeat: Infinity }}
        />
      </div>

      <motion.div
        className="relative max-w-5xl mx-auto text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Badge */}
        <motion.div
          className="inline-flex items-center px-5 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full mb-8"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <Sparkles className="w-5 h-5 text-white mr-2" />
          <span className="text-white font-semibold">Limited Time - Best Value</span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          Ready to Save Big on Travel?
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          className="text-xl sm:text-2xl text-white mb-12 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          Join Travel in a Click today and unlock a world of exclusive deals, expert guides, and monthly
          giveaways. <span className="font-bold text-white">Start saving immediately!</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate('/signup');
            }}
            className="group px-10 py-5 bg-white text-[#0B8659] font-bold text-lg rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer flex items-center"
          >
            {/* <Gift className="w-6 h-6 mr-2" /> */}
            Start Saving - €9.99/year
            {/* <Sparkles className="w-5 h-5 ml-2" /> */}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate('/login');
            }}
            className="px-10 py-5 bg-[#0B8659] text-white font-bold text-lg rounded-full border-2 border-white hover:bg-[#0a7550] transition-all duration-300 cursor-pointer"
          >
            Already a Member? Sign In
          </button>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 text-white mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-white">5,000+ Happy Members</span>
          </div>

          <div className="flex items-center">
            <svg className="w-5 h-5 text-white mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-white">Instant Access</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

FinalCTA.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

export default FinalCTA;
