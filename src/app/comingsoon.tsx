'use client';

import { motion } from 'framer-motion';
import { Cloud, FileText, Clock, Download, User, Briefcase, Award, Mail } from 'lucide-react';

export default function ComingSoonSection() {
  const cvFeatures = [
    { icon: <User className="w-5 h-5" />, name: 'Professional Profile' },
    { icon: <Briefcase className="w-5 h-5" />, name: 'Work Experience' },
    { icon: <Award className="w-5 h-5" />, name: 'Skills & Certifications' },
    { icon: <Mail className="w-5 h-5" />, name: 'Contact Info' },
  ];

  const floatingVariants = {
    float: {
      y: [0, -15, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="relative">
      {/* Gradient Transition */}
      <div className="h-32 w-full bg-gradient-to-b from-cyan-800 to-blue-900"></div>
      
      {/* Main Content */}
      <div className="bg-blue-900 pb-32">
        <div className="container mx-auto px-6 relative -mt-20 z-10">
          <motion.div
            className="max-w-4xl mx-auto bg-gradient-to-br from-blue-800/80 to-blue-900/90 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-600/30 to-blue-600/30 p-6 border-b border-white/10">
              <motion.div 
                className="flex items-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="p-3 bg-cyan-500/10 rounded-lg">
                  <FileText className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Curriculum Vitae</h2>
                  <p className="text-sm text-cyan-200">Professional Summary</p>
                </div>
              </motion.div>
            </div>

            {/* Coming Soon Content */}
            <div className="p-8 sm:p-12">
              <motion.div
                className="text-center"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <motion.div 
                  className="inline-flex items-center gap-2 bg-cyan-600/30 backdrop-blur-sm border border-cyan-400/30 px-4 py-2 rounded-full mb-8"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">CV Coming Soon</span>
                </motion.div>

                <motion.h2 
                  className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-white"
                  variants={itemVariants}
                >
                  My Professional Journey
                </motion.h2>

                <motion.p 
                  className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto"
                  variants={itemVariants}
                >
                  I'm currently preparing a detailed CV that highlights my cloud computing expertise and professional achievements.
                </motion.p>

                {/* CV Features */}
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
                  variants={containerVariants}
                >
                  {cvFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 flex flex-col items-center text-center"
                      variants={itemVariants}
                      whileHover={{ y: -5, backgroundColor: 'rgba(6, 182, 212, 0.1)' }}
                    >
                      <div className="bg-cyan-500/10 p-3 rounded-full mb-3">
                        {feature.icon}
                      </div>
                      <h3 className="font-medium">{feature.name}</h3>
                    </motion.div>
                  ))}
                </motion.div>

                {/* CTA */}
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium px-6 py-3 rounded-full transition-colors duration-300">
                    <Download className="w-5 h-5" />
                    Notify Me When Ready
                  </button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Floating Clouds */}
        <motion.div 
          className="absolute top-32 left-10 opacity-20"
          variants={floatingVariants}
          animate="float"
        >
          <Cloud className="w-24 h-24" />
        </motion.div>
        
        <motion.div 
          className="absolute bottom-32 right-10 opacity-20"
          variants={floatingVariants}
          animate="float"
          initial={{ y: -10 }}
        >
          <Cloud className="w-32 h-32" />
        </motion.div>

        {/* Floating dots */}
        <motion.div
          className="absolute top-1/3 left-1/4 w-3 h-3 rounded-full bg-cyan-400/30"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-2 h-2 rounded-full bg-white/30"
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
      </div>
    </div>
  );
}