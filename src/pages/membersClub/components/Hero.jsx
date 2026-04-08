import { motion } from 'framer-motion';
import { Users, TrendingUp, Calendar, ArrowRight, Sparkles, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Dynamic Hero Section
 * Shows different content for visitors vs logged-in members
 */
const Hero = ({ isAuthenticated, userName }) => {
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const floatAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  };

  if (isAuthenticated) {
    // MEMBER VIEW
    return (
      <section className="relative overflow-hidden pt-24 pb-24 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-emerald-600 via-emerald-700 to-teal-800">
        {/* Background Image - Commented out as requested */}
        {/* <div className="absolute inset-0">
          <img 
            src="/members/banner_image.jpg" 
            alt="Travel background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-br from-black/60 via-black/50 to-black/60" />
        </div> */}
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-72 h-72 bg-teal-400/15 rounded-full blur-3xl"
            animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
            transition={{ duration: 12, repeat: Infinity }}
          />
        </div>

        <motion.div
          className="relative container mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Member Badge */}
          <motion.div variants={itemVariants} className="flex justify-center mb-6 mt-10">
            <div className="inline-flex items-center px-4 py-4 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
              <span className="text-sm font-medium text-white">Active Member</span>
            </div>
          </motion.div>

          {/* Welcome Message */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white text-center mb-6"
          >
            Welcome Back, {userName || 'Member'}!
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-white/90 text-center max-w-3xl mx-auto mb-12"
          >
            Explore exclusive deals, enter monthly giveaways, and discover expert travel guides curated just for you.
          </motion.p>

          {/* Member Stats Bar */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 text-center">
              <div className="flex flex-col items-center justify-center mb-2 gap-1">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white/80" />
                <span className="text-xs sm:text-sm font-medium text-white uppercase leading-tight">Member Since</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-white">Jan 2026</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 text-center">
              <div className="flex flex-col items-center justify-center mb-2 gap-1">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white/80" />
                <span className="text-xs sm:text-sm font-medium text-white uppercase leading-tight">Community</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-white">5,000+ Members</p>
            </div>
          </motion.div>
        </motion.div>
      </section>
    );
  }

  // VISITOR VIEW
  return (
    <section className="relative overflow-hidden pt-20 pb-20 px-4 sm:px-6 lg:px-8 bg-[#0B8659]">
      {/* Animated Background Patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
      </div>

      <motion.div
        className="relative max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Value Proposition */}
          <div className="text-center lg:text-left">
            <motion.div variants={itemVariants} className="mb-6 flex justify-center lg:justify-start">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mt-10">
                <Sparkles className="w-4 h-4 text-white mr-2" />
                <span className="text-sm font-medium text-white">Exclusive Member Preview</span>
              </div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Travel in a Click
              <span className="block text-white mt-2">
                Members Club
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl lg:text-2xl text-white mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              Join thousands of smart travelers saving up to 60% on incredible journeys.{' '}
              <span className="font-bold text-white">All for just €9.99/year.</span>
            </motion.p>

            {/* Stats Grid */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:flex-wrap justify-center lg:justify-start gap-4 mb-8 items-center sm:items-start">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center w-full max-w-[280px] sm:w-auto">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">5,000+</div>
                <div className="text-sm text-white/90">Happy Members</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center w-full max-w-[280px] sm:w-auto">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">€500+</div>
                <div className="text-sm text-white/90">Average Savings</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center w-full max-w-[280px] sm:w-auto">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">60+</div>
                <div className="text-sm text-white/90">Deals Monthly</div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto lg:mx-0">
              <button
                onClick={() => navigate('/signup')}
                className="group px-8 py-4 bg-white text-[#0B8659] font-bold rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center whitespace-nowrap"
              >
                {/* <Gift className="w-5 h-5 mr-2" /> */}
                Join Now - €9.99/year
                {/* <Sparkles className="w-4 h-4 ml-2" /> */}
              </button>

              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-[#0B8659] text-white font-bold rounded-full border-2 border-white hover:bg-[#0a7550] transition-all duration-300 whitespace-nowrap"
              >
                Already a member? Sign In
              </button>
            </motion.div>
          </div>

          {/* Right Side - Floating Membership Card (Hidden on mobile) */}
          <motion.div variants={itemVariants} className="relative hidden lg:block">
            <motion.div
              animate={floatAnimation}
              className="relative mx-auto max-w-md"
            >
              {/* Membership Card */}
              <div className="relative bg-linear-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="absolute inset-0 bg-linear-to-br from-emerald-500/20 to-teal-500/20 rounded-3xl" />
                
                <div className="relative z-10">
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-white/80 font-medium">Premium Member</div>
                    <Sparkles className="w-6 h-6 text-emerald-400" />
                  </div>

                  {/* Card Title */}
                  <h3 className="text-2xl font-bold text-white mb-2">Travel in a Click</h3>
                  <p className="text-white/70 mb-8">Exclusive Access Pass</p>

                  {/* Features List */}
                  <div className="space-y-4">
                    <div className="flex items-center text-white">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3" />
                      <span className="text-sm">60+ exclusive travel deals monthly</span>
                    </div>
                    <div className="flex items-center text-white">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3" />
                      <span className="text-sm">Monthly free trip giveaway</span>
                    </div>
                    <div className="flex items-center text-white">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3" />
                      <span className="text-sm">100+ expert travel guides</span>
                    </div>
                  </div>

                  {/* Price Tag */}
                  <div className="mt-8 pt-6 border-t border-white/20">
                    <div className="flex items-baseline justify-between">
                      <span className="text-white/70 text-sm">Annual Membership</span>
                      <div>
                        <span className="text-3xl font-bold text-white">€9.99</span>
                        <span className="text-white/70 text-sm">/year</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -z-10 -top-4 -right-4 w-full h-full bg-linear-to-br from-emerald-500/30 to-teal-500/30 rounded-3xl blur-xl" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

Hero.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  userName: PropTypes.string,
};

export default Hero;
