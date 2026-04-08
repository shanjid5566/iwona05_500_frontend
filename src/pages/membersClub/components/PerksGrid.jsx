import { motion } from 'framer-motion';
import { Clock, Gift, MapPin, Lock, TrendingUp, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Interactive Bento Grid for Membership Perks
 * Modern asymmetric layout with glassmorphism effects
 */
const PerksGrid = ({ isAuthenticated }) => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-8 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full mb-6">
            <span className="text-sm font-semibold text-[#0B8659] uppercase tracking-wide">
              What You Get
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {isAuthenticated ? 'Your Membership Benefits' : 'Membership Benefits'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock exclusive access to hand-picked deals, expert guides, and amazing giveaways
          </p>
        </motion.div>

        {/* 3-Column Card Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Card 1 - Weekly Travel Deals */}
          <motion.div
            variants={itemVariants}
            className="group relative bg-green-50 rounded-2xl p-8 border border-green-100 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col"
            onClick={() => navigate(isAuthenticated ? '/members-club' : '/signup')}
          >
            {/* Icon */}
            <div className="w-16 h-16 bg-[#0B8659] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Clock className="w-8 h-8 text-white" />
            </div>

            {/* Content */}
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Weekly Travel Deals</h3>
            <p className="text-base text-gray-600 mb-6 leading-relaxed grow">
              Access 60+ hand-picked travel deals every month, all from your chosen Irish airport
            </p>

            {/* Stats Badge */}
            <div className="flex items-center justify-center px-5 py-4 bg-[#0B8659] rounded-full">
              <span className="text-white text-base font-extrabold">60+</span>
              <span className="text-white text-base ml-2 font-extrabold">deals monthly</span>
            </div>

            {/* Lock Icon for Visitors */}
            {!isAuthenticated && (
              <div className="absolute top-6 right-6 w-10 h-10 bg-gray-700/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
            )}
          </motion.div>

          {/* Card 2 - Monthly Giveaways */}
          <motion.div
            variants={itemVariants}
            className="group relative bg-green-50 rounded-2xl p-8 border border-green-100 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col"
            onClick={() => navigate(isAuthenticated ? '/giveaways' : '/signup')}
          >
            {/* Icon */}
            <div className="w-16 h-16 bg-[#0B8659] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Gift className="w-8 h-8 text-white" />
            </div>

            {/* Content */}
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Monthly Giveaways</h3>
            <p className="text-base text-gray-600 mb-6 leading-relaxed grow">
              Be in a chance of winning a free trip every month
            </p>

            {/* Stats Badge */}
            <div className="flex items-center justify-center px-5  py-4 bg-[#0B8659] rounded-full">
              <span className="text-white text-base font-extrabold">Travel for free</span>
            </div>

            {/* Lock Icon for Visitors */}
            {!isAuthenticated && (
              <div className="absolute top-6 right-6 w-10 h-10 bg-gray-700/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
            )}
          </motion.div>

          {/* Card 3 - Expert Travel Guides */}
          <motion.div
            variants={itemVariants}
            className="group relative bg-green-50 rounded-2xl p-8 border border-green-100 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col"
            onClick={() => navigate(isAuthenticated ? '/members-club' : '/signup')}
          >
            {/* Icon */}
            <div className="w-16 h-16 bg-[#0B8659] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <MapPin className="w-8 h-8 text-white" />
            </div>

            {/* Content */}
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Expert Travel Guides</h3>
            <p className="text-base text-gray-600 mb-6 leading-relaxed grow">
              100+ exclusive guides with insider tips to make your travels unforgettable
            </p>

            {/* Stats Badge */}
            <div className="flex items-center justify-center px-5  py-4 bg-[#0B8659] rounded-full">
              <span className="text-white text-base font-extrabold">100+</span>
              <span className="text-white text-base ml-2 font-extrabold">expert guides</span>
            </div>

            {/* Lock Icon for Visitors */}
            {!isAuthenticated && (
              <div className="absolute top-6 right-6 w-10 h-10 bg-gray-700/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Bottom CTA for Visitors */}
        {!isAuthenticated && (
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <button
              onClick={() => navigate('/signup')}
              className="group px-10 py-5 bg-[#0B8659] text-white font-bold text-lg rounded-full hover:bg-[#0a7550] hover:shadow-xl transition-all duration-300 flex items-center justify-center mx-auto"
            >
              {/* <TrendingUp className="w-5 h-5 mr-2" /> */}
              Unlock All Benefits - Join Now
              {/* <Sparkles className="w-5 h-5 ml-2" /> */}
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

PerksGrid.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

export default PerksGrid;
