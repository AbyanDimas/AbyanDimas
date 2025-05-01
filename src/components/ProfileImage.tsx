'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function ProfileImage() {
  return (
    <motion.div
      className="flex justify-center lg:justify-end order-1 lg:order-2"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
    >
      <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
        <motion.div
          className="absolute inset-0 rounded-full bg-cyan-500/20 blur-lg sm:blur-xl"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        <div className="relative rounded-full overflow-hidden border-2 sm:border-4 border-white/20 w-full h-full bg-sky-900 flex items-center justify-center">
          <Image
            src="/profile.webp"
            alt="Profile Picture"
            layout="fill"
            objectFit="cover"
            className="transition-all duration-500"
            priority 
          />
          <span className="text-5xl sm:text-7xl md:text-9xl font-bold text-cyan-300">AB</span>
        </div>
        
        <motion.div
          className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 md:-bottom-5 md:-right-5 bg-cyan-600 rounded-md sm:rounded-lg px-2 py-1 sm:px-4 sm:py-2 shadow-lg text-xs sm:text-sm md:text-base"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <span className="font-bold">Available</span>
        </motion.div>
      </div>
    </motion.div>
  );
}