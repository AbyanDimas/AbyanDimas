'use client';

import { motion } from 'framer-motion';
import { Cloud } from 'lucide-react';

const floatingCloudVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function FloatingElements() {
  return (
    <>
      <motion.div 
        className="absolute top-10 left-4 opacity-20 sm:top-20 sm:left-10"
        variants={floatingCloudVariants}
        animate="animate"
      >
        <Cloud className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32" />
      </motion.div>
      <motion.div 
        className="absolute bottom-10 right-4 opacity-20 sm:bottom-20 sm:right-10"
        variants={floatingCloudVariants}
        animate="animate"
        initial={{ y: -5 }}
      >
        <Cloud className="w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40" />
      </motion.div>

      <motion.div
        className="absolute top-1/4 right-1/4 w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full bg-cyan-400/30"
        animate={{
          y: [0, -10, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/3 left-1/3 w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 rounded-full bg-white/20"
        animate={{
          y: [0, 15, 0],
          x: [0, -8, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
    </>
  );
}