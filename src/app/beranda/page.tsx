'use client';

import { motion } from 'framer-motion';
import SocialLinks from '../../components/SocialLinks';
import TechIcons from '../../components/TechIcons';
import ProfileImage from '../../components/ProfileImage';
import FloatingElements from '../../components/FloatingElements';
import { containerVariants, itemVariants } from '../../type/animations';
import StatsSection from './StatsSection';
import ContentSection from './ContentSection';
import TimelineSection from './TimelineSection';
import ContactSection from './ContactSection'
import AIAboutMe from './AIAboutMe';
import DeploymentFlow from './DeploymentFlow';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-sky-900 to-cyan-800 text-white overflow-hidden">
      <FloatingElements />
      
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

            <TechIcons />
            <SocialLinks />
          </motion.div>

          <ProfileImage />
          
        </motion.div>

      </div>
            <StatsSection />
      <ContentSection />
      <TimelineSection />
      <AIAboutMe />
      <DeploymentFlow />
      <ContactSection />
    </div>
  );
}