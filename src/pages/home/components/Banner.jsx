import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser } from '../../../context/context.hooks';

/**
 * Hero Banner Component
 */
const Banner = () => {
  const { isAuthenticated } = useUser();
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

  const arrowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.4,
        ease: 'easeOut',
      },
    }),
  };

  const barVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: '100%',
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const headingVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, 0.01, 0.05, 0.95],
      },
    },
  };

  const descriptionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.3,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.5 + i * 0.15,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  };

  const decorativeArrowVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i) => ({
      opacity: 0.5,
      x: 0,
      transition: {
        delay: 1 + i * 0.06,
        duration: 0.4,
      },
    }),
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
      },
    },
  };

  return (
    <section className="relative h-screen min-h-150 overflow-hidden group">
      {/* Background Image with Zoom Effect */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
        style={{ backgroundImage: 'url(/home/home_banner.jpg)' }}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
      
      {/* Gradient Overlay */}
      <motion.div 
        className="absolute inset-0 bg-black/40"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
      />
      
      {/* Content Container */}
      <div className="relative h-full container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center sm:justify-start">
        <motion.div
          className="max-w-3xl text-center sm:text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Arrow Symbols */}
          {/* COMMENTED OUT - Can be restored if client requests */}
          {/* <motion.div className="flex items-center justify-center sm:justify-start gap-2 mb-8">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={arrowVariants}
                initial="hidden"
                animate="visible"
              >
                <ChevronRight 
                  className="w-5 h-5 text-white/80"
                  strokeWidth={2.5}
                />
              </motion.div>
            ))}
          </motion.div> */}
          
          {/* Heading with Vertical Bar */}
          <div className="flex items-start justify-center sm:justify-start gap-4 mb-6">
            <motion.div 
              className="w-1 h-16 sm:h-20 bg-white shrink-0"
              variants={barVariants}
              initial="hidden"
              animate="visible"
            />
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight"
              variants={headingVariants}
            >
              TRAVEL MORE.<br />SPEND LESS.
            </motion.h1>
          </div>
          
          {/* Description */}
          <motion.p 
            className="text-sm sm:text-base md:text-lg text-white/90 mb-8 sm:mb-10 leading-relaxed tracking-wide font-medium"
            variants={descriptionVariants}
          >
            A MEMBERS ONLY TRAVEL SUBSCRIPTION WITH MONTHLY GIVEAWAYS, EXCLUSIVE GUIDES AND PERSONALISED OFFERS FROM YOUR LOCAL AIRPORT.
          </motion.p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
            <motion.div
              custom={0}
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
            >
              <Link 
                to={isAuthenticated ? '/members-club' : '/signup'}
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base font-bold text-white uppercase tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{ backgroundColor: '#7a7d5a' }}
              >
                {isAuthenticated ? 'Members Club' : 'JOIN MEMBERS CLUB'}
              </Link>
            </motion.div>
            <motion.div
              custom={1}
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
            >
              <Link 
                to="/giveaways"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base font-bold text-white uppercase tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{ backgroundColor: '#BD7706' }}
              >
                Enter Our Monthly Giveaway
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Decorative Arrows - Bottom Right */}
      {/* COMMENTED OUT - Can be restored if client requests */}
      {/* <div className="absolute bottom-8 right-8 flex items-center gap-2">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={decorativeArrowVariants}
            initial="hidden"
            animate="visible"
          >
            <ChevronRight 
              className="w-5 h-5 text-white"
              strokeWidth={2.5}
            />
          </motion.div>
        ))}
      </div> */}
    </section>
  );
};

export default Banner;
