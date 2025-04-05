'use client';

import { motion } from 'framer-motion';
import { Cloud, Server, AlertTriangle, Home, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  const floatingCloudVariants = {
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      },
    },
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-sky-900 to-cyan-800 text-white overflow-hidden relative">
      {/* Background cloud elements */}
      <motion.div 
        className="absolute top-1/4 left-10 opacity-10"
        variants={floatingCloudVariants}
        animate="animate"
      >
        <Cloud className="w-32 h-32" />
      </motion.div>
      
      <motion.div 
        className="absolute bottom-1/3 right-20 opacity-10"
        variants={floatingCloudVariants}
        animate="animate"
        initial={{ y: -10 }}
      >
        <Server className="w-40 h-40" />
      </motion.div>

      <div className="container mx-auto px-6 py-12 h-screen flex flex-col justify-center items-center relative z-10">
        <motion.div
          className="max-w-2xl w-full text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Error icon */}
          <motion.div
            className="mb-8 flex justify-center"
            variants={itemVariants}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <div className="relative bg-red-500/20 backdrop-blur-sm p-6 rounded-full border border-red-400/30">
                <AlertTriangle className="w-16 h-16 text-red-400" />
              </div>
            </div>
          </motion.div>

          {/* Error code */}
          <motion.h1
            className="text-8xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-white"
            variants={itemVariants}
          >
            404
          </motion.h1>

          {/* Error message */}
          <motion.h2
            className="text-3xl sm:text-4xl font-bold mb-6 text-cyan-100"
            variants={itemVariants}
          >
            Page Not Found
          </motion.h2>

          <motion.p
            className="text-lg text-gray-300 mb-8 max-w-lg mx-auto"
            variants={itemVariants}
          >
            The page you're looking for seems to have vanished into the cloud.
            Maybe it's been migrated or deleted.
          </motion.p>

          {/* Home button */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium px-6 py-3 rounded-full transition-colors duration-300"
            >
              <Home className="w-5 h-5" />
              Return to Homepage
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Cloud status */}
          <motion.div
            className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4 text-sm text-gray-400"
            variants={itemVariants}
          >
            <motion.div
              className="flex items-center gap-2"
              animate="pulse"
              variants={pulseVariants}
            >
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span>Cloud Services Operational</span>
            </motion.div>
            <span className="hidden sm:block">•</span>
            <span>Last checked: {new Date().toLocaleTimeString()}</span>
          </motion.div>
        </motion.div>

        {/* Floating elements */}
        <motion.div
          className="absolute bottom-20 left-10 w-6 h-6 rounded-full bg-cyan-400/30"
          animate={{
            y: [0, -20, 0],
            x: [0, 15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-20 right-10 w-4 h-4 rounded-full bg-white/30"
          animate={{
            y: [0, 20, 0],
            x: [0, -10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </div>
    </div>
  );
}