'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';

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

export default function SocialLinks() {
  return (
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
  );
}