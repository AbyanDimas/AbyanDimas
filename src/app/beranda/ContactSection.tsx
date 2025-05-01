'use client';

import { motion } from 'framer-motion';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Message sent successfully!');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section className="py-12 bg-sky-950/70 backdrop-blur-sm" id="contact">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.h2 
          className="text-3xl font-bold mb-8 text-cyan-400 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Get In Touch
        </motion.h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold">Contact Information</h3>
            <p className="text-gray-300">
              Feel free to reach out to me for any questions or opportunities. I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 mt-1 text-cyan-400" />
                <div>
                  <h4 className="font-semibold">Email</h4>
                  <p className="text-gray-300">abyan.dimas@example.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 mt-1 text-cyan-400" />
                <div>
                  <h4 className="font-semibold">Phone</h4>
                  <p className="text-gray-300">+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 mt-1 text-cyan-400" />
                <div>
                  <h4 className="font-semibold">Location</h4>
                  <p className="text-gray-300">San Francisco, CA</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.form
            onSubmit={handleSubmit}
            className="bg-sky-900/50 backdrop-blur-sm p-6 rounded-xl"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-sky-800/50 border border-sky-700 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium">Your Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-sky-800/50 border border-sky-700 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block mb-2 text-sm font-medium">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-sky-800/50 border border-sky-700 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-medium transition-colors duration-300"
              >
                Send Message
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}