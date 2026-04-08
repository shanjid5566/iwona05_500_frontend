import { motion } from 'framer-motion';
import { MapPin, Search, Gift, BookOpen, Wallet } from 'lucide-react';

/**
 * WhyBecomeMember Component
 * Displays membership benefits in a clean card layout
 */
const WhyBecomeMember = () => {
  const benefits = [
    {
      icon: MapPin,
      title: 'Travel Deals',
      description: 'Get over 60 hand-picked deals sent to your email every single month.',
      iconBg: 'bg-[#c9d4c0]',
    },
    {
      icon: Search,
      title: 'Tailored to You',
      description: 'Deals based on your local airport: Dublin, Cork, Shannon, Knock, Kerry, Belfast.',
      iconBg: 'bg-[#c9d4c0]',
    },
    {
      icon: Gift,
      title: 'Monthly Giveaways',
      description: 'Chance to win a fully paid trip every month – members only.',
      iconBg: 'bg-[#c9d4c0]',
    },
    {
      icon: BookOpen,
      title: 'Travel Guides',
      description: 'Access to 100+ exclusive guides for stress-free travel.',
      iconBg: 'bg-[#c9d4c0]',
    },
    {
      icon: Wallet,
      title: 'Huge Savings',
      description: 'All this for only €9.99 a year.',
      iconBg: 'bg-[#c9d4c0]',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why Become a Member
          </h2>
        </motion.div>

        {/* Benefits Cards Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                {/* Icon Container */}
                <div className={`${benefit.iconBg} w-14 h-14 rounded-xl flex items-center justify-center mb-6`}>
                  <Icon className="w-7 h-7 text-gray-700" strokeWidth={2} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyBecomeMember;
