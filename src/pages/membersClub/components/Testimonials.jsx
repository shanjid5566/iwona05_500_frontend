import { motion } from 'framer-motion';
import { Star, Lock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Testimonials - Wall of Love Masonry Layout
 * Displays member stories and social proof
 */
const Testimonials = ({ isAuthenticated }) => {
  const navigate = useNavigate();

  const testimonials = [
    {
      name: 'Sarah Murphy',
      location: 'Dublin',
      avatar: 'SM',
      rating: 5,
      text: 'Saved €380 on my family trip to Spain! The deals are incredible and the giveaway competitions are legit. Already won a weekend in Paris!',
      savings: '€380',
      color: 'bg-gradient-to-br from-emerald-400 to-teal-500',
    },
    {
      name: 'Patrick O\'Brien',
      location: 'Cork',
      avatar: 'PO',
      rating: 5,
      text: 'Best €9.99 I ever spent. The expert guides helped me discover hidden gems in Portugal that I never would have found on my own.',
      color: 'bg-gradient-to-br from-blue-400 to-cyan-500',
    },
    {
      name: 'Emma Collins',
      location: 'Galway',
      avatar: 'EC',
      rating: 5,
      text: 'The weekly deals from Shannon Airport are perfect for me. Already booked 3 trips this year and saved over €600!',
      savings: '€600+',
      color: 'bg-gradient-to-br from-purple-400 to-pink-500',
    },
    {
      name: 'Michael Ryan',
      location: 'Limerick',
      avatar: 'MR',
      rating: 5,
      text: 'I was skeptical at first but this membership pays for itself instantly. The community is amazing and support is top-notch.',
      color: 'bg-gradient-to-br from-orange-400 to-red-500',
    },
    {
      name: 'Aoife Walsh',
      location: 'Waterford',
      avatar: 'AW',
      rating: 5,
      text: 'Love getting the weekly email with new deals. Booked a last-minute getaway to Barcelona for half the price. Highly recommend!',
      color: 'bg-gradient-to-br from-green-400 to-emerald-500',
    },
    {
      name: 'James Kelly',
      location: 'Dublin',
      avatar: 'JK',
      rating: 5,
      text: 'The travel guides are worth the membership alone. Detailed, accurate, and full of insider tips. Makes every trip special.',
      color: 'bg-gradient-to-br from-indigo-400 to-blue-500',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
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

  if (!isAuthenticated) {
    // VISITOR VIEW - Locked with teaser
    return (
      <section className="pb-12 sm:pb-16 md:pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            className="text-center mb-8 sm:mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">Member Stories</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              See what our amazing community says about their travel experiences
            </p>
          </motion.div>

          {/* Locked Content Preview */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Blur Overlay */}
            <div className="relative">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 blur-sm select-none pointer-events-none">
                {testimonials.slice(0, 3).map((testimonial, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
                  >
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 ${testimonial.color} rounded-full flex items-center justify-center text-white font-bold mr-3`}>
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{testimonial.name}</div>
                        <div className="text-sm text-slate-500">{testimonial.location}</div>
                      </div>
                    </div>
                    <div className="flex mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-slate-600">{testimonial.text}</p>
                  </div>
                ))}
              </div>

              {/* Lock Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px]">
                <motion.div
                  className="text-center bg-white/95 backdrop-blur-md rounded-3xl p-10 shadow-2xl border border-slate-200 max-w-md mx-4"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-3">Member Stories</h3>
                  <p className="text-lg text-slate-600">
                    See what our amazing community says about their travel experiences
                  </p>
                  <button
                    onClick={() => navigate('/signup')}
                    className="group w-full px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-105 transition-all duration-300"
                  >
                    <span className="flex items-center justify-center">
                      <Users className="w-5 h-5 mr-2" />
                      Join to Read Stories
                    </span>
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  // MEMBER VIEW - Full Wall of Love
  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-8 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-4 py-2 bg-emerald-50 rounded-full mb-6">
            <Users className="w-4 h-4 text-emerald-600 mr-2" />
            <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">
              Wall of Love
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">Member Stories</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Real experiences from our amazing community of 5,000+ travelers
          </p>
        </motion.div>

        {/* Masonry Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-slate-200 hover:border-emerald-200 transition-all duration-300 cursor-pointer"
            >
              {/* Avatar & Name */}
              <div className="flex items-center mb-4">
                <div className={`w-14 h-14 ${testimonial.color} rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 group-hover:scale-110 transition-transform duration-300`}>
                  {testimonial.avatar}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-900 text-lg">{testimonial.name}</div>
                  <div className="text-sm text-slate-500">{testimonial.location}</div>
                </div>
                {testimonial.savings && (
                  <div className="px-3 py-1 bg-emerald-50 rounded-full">
                    <span className="text-emerald-600 font-bold text-sm">{testimonial.savings}</span>
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-slate-700 leading-relaxed">"{testimonial.text}"</p>

              {/* Verified Badge */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center text-xs text-slate-500">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center mr-2">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Verified Member
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Community Stats */}
        <motion.div
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-center p-6 bg-white rounded-2xl shadow-md border border-slate-200">
            <div className="text-4xl font-bold text-emerald-600 mb-2">5,000+</div>
            <div className="text-slate-600">Happy Members</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-md border border-slate-200">
            <div className="text-4xl font-bold text-emerald-600 mb-2">4.9/5</div>
            <div className="text-slate-600">Average Rating</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-md border border-slate-200">
            <div className="text-4xl font-bold text-emerald-600 mb-2">€500+</div>
            <div className="text-slate-600">Avg. Yearly Savings</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

Testimonials.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

export default Testimonials;
