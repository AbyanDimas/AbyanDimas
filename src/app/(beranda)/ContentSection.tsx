'use client';

import { motion } from 'framer-motion';
import Sidebar from './Sidebar';

export default function ContentSection() {
  return (
    <section id="about" className="py-12 bg-gradient-to-b from-sky-900/30 to-blue-900/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-sky-900/50 backdrop-blur-sm p-6 rounded-xl mb-8"
            >
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">About Me</h2>
              <p className="mb-4">
                I'm a full-stack developer with 5+ years of experience building web applications. 
                My passion lies in creating efficient, scalable solutions with beautiful user interfaces.
              </p>
              <p>
                When I'm not coding, you can find me contributing to open-source projects, 
                writing technical articles, or exploring new technologies in the ever-evolving 
                web development landscape.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-sky-900/50 backdrop-blur-sm p-6 rounded-xl"
            >
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">Recent Projects</h2>
              <div className="space-y-6">
                <div className="border-b border-sky-800 pb-4">
                  <h3 className="text-xl font-semibold mb-2">E-commerce Platform</h3>
                  <p className="text-sm text-gray-300 mb-3">Built with Next.js, Node.js, and MongoDB</p>
                  <p>
                    A full-featured e-commerce solution with payment integration, inventory management, 
                    and analytics dashboard.
                  </p>
                </div>
                <div className="border-b border-sky-800 pb-4">
                  <h3 className="text-xl font-semibold mb-2">Task Management App</h3>
                  <p className="text-sm text-gray-300 mb-3">Built with React, Firebase, and Material UI</p>
                  <p>
                    A collaborative task management application with real-time updates and team features.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Weather Dashboard</h3>
                  <p className="text-sm text-gray-300 mb-3">Built with Vue.js and Weather API</p>
                  <p>
                    A responsive weather application with 5-day forecasts, historical data, and location tracking.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div>
            <Sidebar />
          </div>
        </div>
      </div>
    </section>
  );
}