'use client';

import { motion, AnimatePresence } from 'framer-motion';
import SocialLinks from '../../components/SocialLinks';
import TechIcons from '../../components/TechIcons';
import ProfileImage from '../../components/ProfileImage';
import FloatingElements from '../../components/FloatingElements';
import { containerVariants, itemVariants } from '../../type/animations';
import StatsSection from './StatsSection';
import ContentSection from './ContentSection';
import TimelineSection from './TimelineSection';
import ContactSection from './ContactSection';
import AIAboutMe from './AIAboutMe';
import DeploymentFlow from './DeploymentFlow';
import { useEffect, useState, useRef } from 'react';

export default function Home() {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Card data for the overlay
  const cardDetails = {
skills: {
  title: "Detail Distribusi Keahlian",
  content: "Rincian lengkap tentang keahlian teknis saya di berbagai bidang dalam pengembangan perangkat lunak.",
  data: [
    'Frontend Development',
    'Backend Development',
    'Cloud Computing',
    'DevOps',
    'Data Engineering',
    'UI/UX Design',
    'Mobile Development',
    'Cybersecurity',
    'Data Science / AI',
    'Git & Version Control'
  ].map((label, i) => ({
    label,
    value: [85, 65, 60, 45, 50, 60, 20, 10, 35, 75][i],
    color: [
      'rgba(255, 99, 132, 0.8)',   // Frontend
      'rgba(54, 162, 235, 0.8)',   // Backend
      'rgba(255, 159, 64, 0.8)',   // Cloud
      'rgba(255, 206, 86, 0.8)',   // DevOps
      'rgba(201, 203, 207, 0.8)',  // Data Engineering
      'rgba(75, 192, 192, 0.8)',   // UI/UX
      'rgba(255, 99, 71, 0.8)',    // Mobile
      'rgba(153, 102, 255, 0.8)',  // Cybersecurity
      'rgba(100, 149, 237, 0.8)',  // Data Science
      'rgba(60, 179, 113, 0.8)',   // Git
    ][i]
  }))
},

    projects: {
      title: "Projects Timeline Details",
      content: "Monthly project completion rate showing my productivity throughout the year.",
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((label, i) => ({
        label,
        value: [5, 8, 6, 9, 7, 10][i],
        color: 'rgba(255, 99, 132, 0.5)'
      }))
    },
    experience: {
      title: "Experience Growth Details",
      content: "Progression of my professional experience over the years in the tech industry.",
      data: ['2018', '2019', '2020', '2021', '2022', '2023'].map((label, i) => ({
        label,
        value: [1, 2, 3, 4, 5, 6][i],
        color: 'rgba(54, 162, 235, 0.5)'
      }))
    },
    visitors: {
      title: "Live Visitors Details",
      content: "Real-time visitor analytics showing traffic patterns on my portfolio throughout the day.",
      data: Array(24).fill(0).map((_, i) => ({
        label: `${i}:00`,
        value: Math.floor(Math.random() * 30) + 5,
        color: 'rgba(153, 102, 255, 0.5)'
      }))
    },
    languages: {
      title: "Language Proficiency Details",
      content: "My proficiency levels across different programming languages I work with.",
      data: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust'].map((label, i) => ({
        label,
        value: [95, 90, 85, 75, 65, 60][i],
        color: 'rgba(255, 206, 86, 0.6)'
      }))
    },
    productivity: {
      title: "Weekly Productivity Details",
      content: "My typical productivity pattern throughout the week based on historical data.",
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label, i) => ({
        label,
        value: [70, 75, 85, 80, 65, 50, 40][i],
        color: 'rgba(75, 192, 192, 0.2)'
      }))
    }
  };

  // Card order for keyboard navigation
  const cardOrder = ['skills', 'projects', 'experience', 'visitors', 'languages', 'productivity'];

  // Handle keyboard navigation
  useEffect(() => {
    if (!activeCard) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveCard(null);
      } else if (e.key === 'ArrowRight') {
        const currentIndex = cardOrder.indexOf(activeCard);
        const nextIndex = (currentIndex + 1) % cardOrder.length;
        setActiveCard(cardOrder[nextIndex]);
      } else if (e.key === 'ArrowLeft') {
        const currentIndex = cardOrder.indexOf(activeCard);
        const prevIndex = (currentIndex - 1 + cardOrder.length) % cardOrder.length;
        setActiveCard(cardOrder[prevIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCard]);

  // Close overlay when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
        setActiveCard(null);
      }
    };

    if (activeCard) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [activeCard]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-sky-900 to-cyan-800 text-white overflow-hidden">
      <FloatingElements />
      
      <div id="home" className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 h-screen flex flex-col justify-center relative z-10 overflow-y-auto">
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

      <StatsSection onCardClick={setActiveCard} />
      <ContentSection />
      <TimelineSection />
      <DeploymentFlow />
      <ContactSection />

      {/* Global Overlay Modal */}
      <AnimatePresence>
        {activeCard && (
          <motion.div
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <motion.div
              ref={overlayRef}
              className="bg-sky-900/90 backdrop-blur-lg rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ 
                type: 'spring',
                stiffness: 300,
                damping: 25,
                duration: 0.3
              }}
            >
              <motion.button 
                onClick={() => setActiveCard(null)}
                className="absolute top-4 right-4 text-cyan-400 hover:text-cyan-300 text-2xl transition-colors"
                aria-label="Close"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                &times;
              </motion.button>
              
              <div className="flex justify-between items-center mb-4">
                <motion.button
                  onClick={() => {
                    const currentIndex = cardOrder.indexOf(activeCard);
                    const prevIndex = (currentIndex - 1 + cardOrder.length) % cardOrder.length;
                    setActiveCard(cardOrder[prevIndex]);
                  }}
                  className="text-cyan-400 hover:text-cyan-300 text-xl p-2"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ←
                </motion.button>
                
                <motion.h3 
                  className="text-2xl font-bold text-cyan-400 text-center"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {cardDetails[activeCard as keyof typeof cardDetails].title}
                </motion.h3>
                
                <motion.button
                  onClick={() => {
                    const currentIndex = cardOrder.indexOf(activeCard);
                    const nextIndex = (currentIndex + 1) % cardOrder.length;
                    setActiveCard(cardOrder[nextIndex]);
                  }}
                  className="text-cyan-400 hover:text-cyan-300 text-xl p-2"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  →
                </motion.button>
              </div>
              
              <motion.p 
                className="mb-6 text-sky-100 text-center"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                {cardDetails[activeCard as keyof typeof cardDetails].content}
              </motion.p>
              
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, staggerChildren: 0.1 }}
              >
                {cardDetails[activeCard as keyof typeof cardDetails].data.map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="bg-sky-800/50 rounded-xl p-4 flex items-center hover:bg-sky-800/70 transition-colors"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div 
                      className="w-4 h-4 rounded-full mr-3" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div>
                      <h4 className="font-medium">{item.label}</h4>
                      <p className="text-cyan-400">{item.value} {activeCard === 'experience' ? 'years' : activeCard === 'visitors' ? 'visitors' : '%'}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}