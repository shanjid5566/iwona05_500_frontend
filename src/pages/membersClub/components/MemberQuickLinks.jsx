import { motion } from "framer-motion";
import { Compass, Gift, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * Quick Links Section for Members
 * Three cards: Browse Deals, Enter Giveaway, Travel Guides
 */
const MemberQuickLinks = () => {
  const navigate = useNavigate();

  const quickLinks = [
    {
      id: 1,
      icon: Gift,
      title: "Enter Giveaway",
      description: "Monthly free trip giveaway - could it be you? ",
      path: "/giveaways",
      color: "#0B8659",
    },
    {
      id: 2,
      icon: Compass,
      title: "Browse Deals",
      description: "View all exclusive travel deals from your airport",
      path: "/travel-deals",
      color: "#0B8659",
    },
    {
      id: 3,
      icon: MapPin,
      title: "Travel Guides",
      description: "Expert tips and destination insights",
      path: "/travel-guides",
      color: "#0B8659",
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
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <motion.div
                key={link.id}
                variants={cardVariants}
                whileHover={{ scale: 1.02, y: -4 }}
                onClick={() => navigate(link.path)}
                className="bg-green-50 rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:shadow-lg border border-green-100"
              >
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: link.color }}
                  >
                    <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 text-center mb-3">
                  {link.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-center text-sm leading-relaxed">
                  {link.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default MemberQuickLinks;
