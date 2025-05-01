'use client';

import { motion } from 'framer-motion';
import { Code, Cpu, Database, Server, Clock, Award, Briefcase } from 'lucide-react';

const stats = [
  { icon: <Briefcase className="w-5 h-5" />, label: "Projects", value: "42+" },
  { icon: <Clock className="w-5 h-5" />, label: "Hours", value: "5000+" },
  { icon: <Award className="w-5 h-5" />, label: "Certifications", value: "8" },
];

const technologies = [
  { icon: <Code className="w-5 h-5" />, name: "JavaScript/TypeScript" },
  { icon: <Cpu className="w-5 h-5" />, name: "Node.js" },
  { icon: <Database className="w-5 h-5" />, name: "MongoDB/PostgreSQL" },
  { icon: <Server className="w-5 h-5" />, name: "Docker/Kubernetes" },
];

export default function Sidebar() {
  return (
    <motion.div 
      className="bg-sky-900/50 backdrop-blur-sm p-6 rounded-xl h-fit sticky top-6"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      <h3 className="text-xl font-semibold mb-6 text-cyan-400">Quick Stats</h3>
      
      <div className="space-y-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="bg-cyan-500/20 p-2 rounded-full">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-300">{stat.label}</p>
              <p className="text-lg font-semibold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      
      <h3 className="text-xl font-semibold mb-4 text-cyan-400">Technologies</h3>
      <div className="space-y-3">
        {technologies.map((tech, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-full">
              {tech.icon}
            </div>
            <p>{tech.name}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}