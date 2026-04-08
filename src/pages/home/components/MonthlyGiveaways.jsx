import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useUser } from '../../../context/context.hooks';
import { useState, useEffect } from 'react';
import { giveawaysService } from '../../../services/api.services';
import Spinner from '../../../components/common/Spinner';

/**
 * MonthlyGiveaways Component
 * Monthly travel giveaway section with prize card and entry instructions
 */
const MonthlyGiveaways = () => {
  const { isAuthenticated } = useUser();
  const [giveaway, setGiveaway] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch public active giveaway
  useEffect(() => {
    const fetchGiveaway = async () => {
      try {
        const response = await giveawaysService.getPublicActiveGiveaway();
        if (response.success && response.data?.giveaway) {
          setGiveaway(response.data.giveaway);
        }
      } catch (error) {
        console.error('Failed to fetch giveaway:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGiveaway();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto flex items-center justify-center h-96">
          <Spinner />
        </div>
      </section>
    );
  }

  // Don't show if no giveaway
  if (!giveaway) {
    return null;
  }

  return (
    <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Monthly Giveaways
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Every month, one lucky member wins a free trip on us. Could it be you?
          </p>
        </motion.div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Column - Prize Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Card Image */}
              <div className="relative h-64 sm:h-80">
                <img
                  src={giveaway.giveawayImage}
                  alt="This Month's Prize"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Card Content */}
              <div className="p-6 sm:p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  This Month's Prize
                </h3>
                <h4 className="text-xl font-semibold text-[#7a7d5a] mb-4">
                  {giveaway.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {giveaway.description}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column - How to Enter */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="space-y-8">
              {/* Title */}
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                How to Enter
              </h3>

              {/* Step 1 - Show only for non-authenticated users */}
              {!isAuthenticated && (
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#7a7d5a] text-white flex items-center justify-center font-bold">
                      1
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                      Become a Member
                    </h4>
                    <p className="text-gray-600">
                      Join for ONLY €9.99/year and unlock exclusive benefits
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2 (or 1 if authenticated) */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#7a7d5a] text-white flex items-center justify-center font-bold">
                    {isAuthenticated ? '1' : '2'}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    Enter the Giveaway
                  </h4>
                  <p className="text-gray-600">
                    One simple click to enter each month's amazing prize
                  </p>
                </div>
              </div>

              {/* Step 3 (or 2 if authenticated) */}
              <div className="flex gap-4 mb-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#7a7d5a] text-white flex items-center justify-center font-bold">
                    {isAuthenticated ? '2' : '3'}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    Win & Travel
                  </h4>
                  <p className="text-gray-600">
                    Winner announced monthly - your dream trip awaits!
                  </p>
                </div>
              </div>

              {/* Button */}
              <Link to="/giveaways">
                <motion.button
                  className="px-8 py-4 rounded-full bg-[#BD7706] text-white font-bold hover:bg-[#A86605] transition-colors duration-300 shadow-lg flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Giveaways
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MonthlyGiveaways;
