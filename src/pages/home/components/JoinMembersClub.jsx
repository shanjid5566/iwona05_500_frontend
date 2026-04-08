import { motion } from 'framer-motion';
import { Tag, Gift, BookOpen, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * JoinMembersClub Component
 * CTA section encouraging users to join the members club
 */
const JoinMembersClub = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Tag,
      title: 'Exclusive Deals',
      description: 'Get access to over 60 handpicked deals every month that regular travelers never see.',
      iconBg: 'bg-[#0B8659]',
    },
    {
      icon: Gift,
      title: 'Monthly Giveaways',
      description: 'Every month, one lucky member wins a free trip on us. Could it be you?',
      iconBg: 'bg-[#0B8659]',
    },
    {
      icon: BookOpen,
      title: 'Expert Guides',
      description: 'Access 100+ in-depth travel guides with insider tips for destinations worldwide.',
      iconBg: 'bg-[#0B8659]',
    },
  ];

  const handleJoinClick = () => {
    navigate('/signup');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section className="py-20 bg-gradient-to-r from-[#0B8659] via-[#117953] to-[#DB7706] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Content */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Join Our Members Club
          </h2>
          <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto">
            Unlock exclusive travel benefits and save hundreds on your next adventure. All for ONLY{' '}
            <span className="font-bold text-white">€9.99</span> per year.
          </p>
        </motion.div>

        {/* Features Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                {/* Icon */}
                <div className={`${feature.iconBg} w-16 h-16 rounded-full flex items-center justify-center mb-6`}>
                  <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.button
            onClick={handleJoinClick}
            className="inline-flex items-center gap-3 px-10 py-4 bg-[#0B8659] hover:bg-[#096d47] text-white text-lg font-bold rounded-full shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Become a Member Now
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default JoinMembersClub;
