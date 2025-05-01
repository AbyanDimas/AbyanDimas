'use client';

import { motion } from 'framer-motion';
import { Cloud, Server, Cpu, Database } from 'lucide-react';

const techIcons = [
  { icon: <Cloud className="w-4 h-4 sm:w-6 sm:h-6" />, name: 'Cloud' },
  { icon: <Server className="w-4 h-4 sm:w-6 sm:h-6" />, name: 'Server' },
  { icon: <Cpu className="w-4 h-4 sm:w-6 sm:h-6" />, name: 'Compute' },
  { icon: <Database className="w-4 h-4 sm:w-6 sm:h-6" />, name: 'Database' },
];

export default function TechIcons() {
  return (
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
  );
}