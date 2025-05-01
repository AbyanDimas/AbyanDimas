'use client';

import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Code2, Rocket } from 'lucide-react';

const timelineItems = [
  {
    date: '2023 - Present',
    title: 'Senior Full Stack Developer',
    company: 'Tech Innovators Inc.',
    icon: <Briefcase className="w-5 h-5 text-cyan-400" />,
    description: 'Leading a team of developers to build scalable web applications using modern technologies.'
  },
  {
    date: '2020 - 2023',
    title: 'Full Stack Developer',
    company: 'Digital Solutions Co.',
    icon: <Code2 className="w-5 h-5 text-cyan-400" />,
    description: 'Developed and maintained multiple web applications with React and Node.js.'
  },
  {
    date: '2018 - 2020',
    title: 'Junior Developer',
    company: 'Web Craft Studios',
    icon: <Rocket className="w-5 h-5 text-cyan-400" />,
    description: 'Started my professional career building frontend components and learning backend development.'
  },
  {
    date: '2014 - 2018',
    title: 'Computer Science Degree',
    company: 'State University',
    icon: <GraduationCap className="w-5 h-5 text-cyan-400" />,
    description: 'Specialized in web technologies and software engineering principles.'
  }
];

export default function TimelineSection() {
  return (
    <section className="py-12 bg-sky-950/70 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.h2 
          className="text-3xl font-bold mb-8 text-cyan-400 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          My Journey
        </motion.h2>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 sm:left-1/2 h-full w-0.5 bg-cyan-500/30 -translate-x-1/2"></div>
          
          <div className="space-y-8">
            {timelineItems.map((item, index) => (
              <motion.div
                key={index}
                className="relative pl-10 sm:pl-0"
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Timeline dot */}
                <div className="absolute left-0 sm:left-1/2 top-1 w-3 h-3 rounded-full bg-cyan-400 -translate-x-1/2"></div>
                
                <div className={`bg-sky-900/50 backdrop-blur-sm p-6 rounded-xl ${index % 2 === 0 ? 'sm:mr-auto sm:pr-16 sm:pl-8' : 'sm:ml-auto sm:pl-16 sm:pr-8'} max-w-2xl`}>
                  <div className="flex items-center gap-4 mb-2">
                    {item.icon}
                    <div>
                      <h3 className="text-xl font-semibold">{item.title}</h3>
                      <p className="text-sm text-cyan-300">{item.company} • {item.date}</p>
                    </div>
                  </div>
                  <p className="text-gray-300">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}