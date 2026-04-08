import { Link } from 'react-router-dom';
import { MousePointerClick } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser } from '../../../context/context.hooks';

/**
 * Video & Content Section Component
 * New centered design with video player and CTA
 */
const VideoSection = () => {
  const { isAuthenticated } = useUser();
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-[#0B8659] overflow-hidden px-4 sm:px-6 lg:px-8">
      <div className="relative container mx-auto max-w-6xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            See How Travel in a Click Works
          </h2>
          <p className="text-base sm:text-lg text-white/90 max-w-3xl mx-auto">
            Learn how Travel in a Click works and how we find the best travel deals for our members.
          </p>
        </motion.div>

        {/* Video Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 sm:mb-10"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl mx-auto max-w-4xl">
            <div className="relative aspect-video bg-linear-to-br from-green-700 to-green-900">
              <video
                className="w-full h-full object-cover"
                controls
                playsInline
                poster="/home/home_banner.jpg"
              >
                <source src="/home/travel-explainer.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link
            to={isAuthenticated ? '/members-club' : '/signup'}
            className="inline-flex items-center justify-center px-8 sm:px-10 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold text-white bg-[#787c50] hover:bg-[#6a6d4a] transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            {isAuthenticated ? 'Members Club' : 'Join Now for ONLY €9.99/year'}
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoSection;

/* ================================================
 * PREVIOUS VERSION - KEPT FOR REFERENCE
 * ================================================
 * 
 * const VideoSection = () => {
 *   return (
 *     <section className="relative py-20 bg-linear-to-br from-green-200 via-green-100 to-green-50 overflow-hidden px-4 sm:px-6 lg:px-8">
 *       {/* Subtle overlay pattern *\/}
 *       <div className="absolute inset-0 opacity-10 bg-[url('/pattern.svg')] bg-repeat"></div>
 *       
 *       <div className="relative container mx-auto">
 *         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
 *           {/* Left Side - Video *\/}
 *           <motion.div
 *             initial={{ opacity: 0, x: -50 }}
 *             whileInView={{ opacity: 1, x: 0 }}
 *             viewport={{ once: true }}
 *             transition={{ duration: 0.8 }}
 *             className="order-1"
 *           >
 *             <div className="relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-green-900/50 transition-shadow duration-500">
 *               {/* Video Placeholder - Replace with actual video *\/}
 *               <div className="relative aspect-video bg-linear-to-br from-green-600 to-green-800">
 *                 <video
 *                   className="w-full h-full object-cover"
 *                   controls
 *                   autoPlay
 *                   muted
 *                   loop
 *                   playsInline
 *                   poster="/home/home_banner.jpg"
 *                 >
 *                   <source src="/home/travel-explainer.mp4" type="video/mp4" />
 *                   Your browser does not support the video tag.
 *                 </video>
 *               </div>
 *               
 *               {/* Glow effect *\/}
 *               <div className="absolute -inset-1 bg-linear-to-r from-green-300 to-green-400 rounded-3xl blur opacity-20 -z-10"></div>
 *             </div>
 *           </motion.div>
 * 
 *           {/* Right Side - Content *\/}
 *           <motion.div
 *             initial={{ opacity: 0, x: 50 }}
 *             whileInView={{ opacity: 1, x: 0 }}
 *             viewport={{ once: true }}
 *             transition={{ duration: 0.8, delay: 0.2 }}
 *             className="order-2 space-y-6"
 *           >
 *             {/* Icon *\/}
 *             {/* <motion.div
 *               initial={{ scale: 0 }}
 *               whileInView={{ scale: 1 }}
 *               viewport={{ once: true }}
 *               transition={{ duration: 0.5, delay: 0.4 }}
 *               className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg"
 *             >
 *               <MousePointerClick className="w-8 h-8 text-green-600" strokeWidth={2} />
 *             </motion.div> *\/}
 * 
 *             {/* Heading *\/}
 *             <motion.h2
 *               initial={{ opacity: 0, y: 20 }}
 *               whileInView={{ opacity: 1, y: 0 }}
 *               viewport={{ once: true }}
 *               transition={{ duration: 0.6, delay: 0.5 }}
 *               className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-900 uppercase leading-tight"
 *             >
 *               Discover Your Next Adventure
 *             </motion.h2>
 * 
 *             {/* Content *\/}
 *             <motion.div
 *               initial={{ opacity: 0, y: 20 }}
 *               whileInView={{ opacity: 1, y: 0 }}
 *               viewport={{ once: true }}
 *               transition={{ duration: 0.6, delay: 0.6 }}
 *               className="space-y-4 text-gray-800"
 *             >
 *               <p className="text-base sm:text-lg leading-relaxed">
 *                 Unlock exclusive guides to hidden gems around the world. Our members get first access to premium deals and personalized itineraries designed for the modern explorer.
 *               </p>
 *               <p className="text-base sm:text-lg leading-relaxed">
 *                 From breathtaking beaches to cultural capitals, we curate experiences that transform your travel dreams into reality. Join thousands of satisfied travelers who trust us to find the best value for their adventures.
 *               </p>
 *               <p className="text-base sm:text-lg leading-relaxed">
 *                 Every month, our team scours the globe for unbeatable offers, ensuring you never miss out on the trip of a lifetime.
 *               </p>
 *             </motion.div>
 * 
 *             {/* CTA Button *\/}
 *             <motion.div
 *               initial={{ opacity: 0, scale: 0.8 }}
 *               whileInView={{ opacity: 1, scale: 1 }}
 *               viewport={{ once: true }}
 *               transition={{ duration: 0.5, delay: 0.8 }}
 *             >
 *               <Link
 *                 to="/travel-guides"
 *                 className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold text-white uppercase tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-xl"
 *                 style={{ backgroundColor: '#7a7d5a' }}
 *               >
 *                 Explore Destinations
 *               </Link>
 *             </motion.div>
 *           </motion.div>
 *         </div>
 *       </div>
 *     </section>
 *   );
 * };
 * 
 * ================================================ */
