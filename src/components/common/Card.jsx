import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * Reusable Card Component
 * Clean, flexible container with optional hover effects
 */
const Card = ({
  children,
  title,
  subtitle,
  hoverable = false,
  padding = 'md',
  className = '',
  ...props
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: hoverable ? { y: -4 } : {},
  };

  const hoverClass = hoverable ? 'hover:shadow-xl' : '';

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-md border border-gray-200 ${paddingClasses[padding]} ${hoverClass} ${className}`}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      transition={{ duration: 0.3 }}
      {...props}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-xl font-bold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </motion.div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  hoverable: PropTypes.bool,
  padding: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

export default Card;
