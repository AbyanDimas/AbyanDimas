'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Twitter, Cloud, Server, Cpu, Database } from 'lucide-react';
import Image from 'next/image';
// import ComingSoonSection from './comingsoon';


export default function Home() {
  const socialLinks = [
    {
      icon: <Github className="w-4 h-4 sm:w-5 sm:h-5" />,
      url: 'https://github.com',
      name: 'GitHub',
    },
    {
      icon: <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />,
      url: 'https://linkedin.com',
      name: 'LinkedIn',
    },
    {
      icon: <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />,
      url: 'https://twitter.com',
      name: 'Twitter',
    },
    {
      icon: <Mail className="w-4 h-4 sm:w-5 sm:h-5" />,
      url: 'mailto:abyan.dimas@icloud.com',
      name: 'Email',
    },
  ];

  const techIcons = [
    { icon: <Cloud className="w-4 h-4 sm:w-6 sm:h-6" />, name: 'Cloud' },
    { icon: <Server className="w-4 h-4 sm:w-6 sm:h-6" />, name: 'Server' },
    { icon: <Cpu className="w-4 h-4 sm:w-6 sm:h-6" />, name: 'Compute' },
    { icon: <Database className="w-4 h-4 sm:w-6 sm:h-6" />, name: 'Database' },
  ];

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
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-sky-900 to-cyan-800 text-white overflow-hidden">
      {/* Floating cloud elements - smaller on mobile */}
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

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 h-screen flex flex-col justify-center relative z-10 overflow-y-auto">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Left Column - Text Content */}
          <motion.div variants={itemVariants} className="order-2 lg:order-1 mt-8 sm:mt-0">
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Hi, I'm <span className="text-cyan-400">Abyan</span>
            </motion.h1>

            <motion.h2
              className="text-xl sm:text-2xl md:text-3xl text-sky-200 mb-4 sm:mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {`< Hello there 👋 />`}
            </motion.h2>

            <motion.p
              className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              "It's nice to be able to make something that looks great and is so easy to use!"
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              {techIcons.map((tech, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-1 sm:gap-2 bg-white/10 px-3 py-1 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base"
                  whileHover={{ scale: 1.05 }}
                >
                  {tech.icon}
                  <span>{tech.name}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-3 sm:gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-cyan-500/20 backdrop-blur-sm p-2 sm:p-3 rounded-full transition-all duration-300"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {link.icon}
                  <span className="sr-only">{link.name}</span>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Image or Initials */}
          <motion.div
            className="flex justify-center lg:justify-end order-1 lg:order-2"
            variants={itemVariants}
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
              
              {/* Profile image or initials fallback */}
              <div className="relative rounded-full overflow-hidden border-2 sm:border-4 border-white/20 w-full h-full bg-sky-900 flex items-center justify-center">
              <Image
              src="/profile.webp"
                  alt="Profile Picture"
                  layout="fill"
                  objectFit="cover"
                  className="transition-all duration-500"
                  priority />
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
        </motion.div>

        {/* Animated floating elements - smaller on mobile */}
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

        {/* Scroll indicator - smaller on mobile */}
        <motion.div
          className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{
            y: [0, 8, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="flex flex-col items-center">
            <span className="text-xs sm:text-sm mb-1 sm:mb-2">Explore more</span>
            <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/50 rounded-full flex justify-center">
              <motion.div
                className="w-1 h-1 sm:h-2 bg-white rounded-full mt-1 sm:mt-2"
                animate={{
                  y: [0, 4, 0],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
      {/* <ComingSoonSection /> */}
    </div>
  );
}