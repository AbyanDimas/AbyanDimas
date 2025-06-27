'use client';

import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Menu, X, Home, User, Folder, Terminal, Mail, 
  Github, Linkedin, Twitter, ChevronRight, CircleDot
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('#home');
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['#home', '#about', '#projects', '#workflow', '#contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.querySelector(section);
        if (element) {
          const { offsetTop, offsetHeight } = element as HTMLElement;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveTab(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 10);
  });

  const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const navItems = [
    { name: 'Home', href: '#home', icon: <Home className="w-5 h-5" /> },
    { name: 'Projects', href: '#projects', icon: <Folder className="w-5 h-5" /> },
    { name: 'About', href: '#about', icon: <User className="w-5 h-5" /> },
    { name: 'Workflow', href: '#workflow', icon: <Terminal className="w-5 h-5" /> },
    { name: 'Contact', href: '#contact', icon: <Mail className="w-5 h-5" /> },
  ];

  const socialItems = [
    { name: 'GitHub', href: 'https://github.com', icon: <Github className="w-5 h-5" /> },
    { name: 'LinkedIn', href: 'https://linkedin.com', icon: <Linkedin className="w-5 h-5" /> },
    { name: 'Twitter', href: 'https://twitter.com', icon: <Twitter className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        className={`hidden md:flex fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${scrolled ? 'bg-sky-900/80 backdrop-blur-md' : 'bg-sky-900/60 backdrop-blur-md'} rounded-full border border-sky-700 shadow-lg`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between px-2 py-1">
          {navItems.map((item) => (
            <motion.div
              key={item.name}
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={() => scrollToSection(item.href)}
                className={`relative px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors ${
                  activeTab === item.href 
                    ? 'text-cyan-400 font-semibold' 
                    : 'text-gray-300 hover:text-cyan-300'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>

              {/* Active tab background highlight */}
              {activeTab === item.href && (
                <motion.div
                  className="absolute inset-0 bg-cyan-400/10 rounded-full -z-10"
                  layoutId="activeTabBackground"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </motion.nav>

      {/* Mobile Navbar */}
      <motion.nav
        className={`md:hidden fixed top-4 right-4 z-50 ${
          scrolled ? 'bg-sky-900/80 backdrop-blur-md' : 'bg-sky-900/60 backdrop-blur-md'
        } rounded-full p-2 border border-sky-700 shadow-lg`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full text-gray-300 hover:text-cyan-400 focus:outline-none"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </motion.button>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 right-4 z-50 bg-sky-900/95 backdrop-blur-lg rounded-xl shadow-xl border border-sky-700 overflow-hidden"
          >
            <div className="flex flex-col p-4 w-64">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    onClick={() => {
                      scrollToSection(item.href);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left flex items-center justify-between px-4 py-3 text-sm ${
                      activeTab === item.href
                        ? 'text-cyan-400 bg-sky-800/30'
                        : 'text-gray-300 hover:text-cyan-300 hover:bg-sky-800/20'
                    } rounded-lg transition-colors`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.name}</span>
                    </div>
                    {activeTab === item.href ? (
                      <CircleDot className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </motion.div>
              ))}

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="border-t border-sky-800 my-3"
              />

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center gap-4 pt-1"
              >
                {socialItems.map((item) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-gray-300 hover:text-cyan-400 rounded-full transition-colors"
                    aria-label={item.name}
                  >
                    {item.icon}
                  </motion.a>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}