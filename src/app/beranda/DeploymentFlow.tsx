'use client';

import { motion } from 'framer-motion';
import { Code, GitBranch, Github, GitPullRequest, Server, CheckCircle2, Clock } from 'lucide-react';

const deploymentSteps = [
  {
    icon: <Code className="w-5 h-5" />,
    title: "Code",
    description: "I write clean, maintainable code with proper documentation",
    color: "text-blue-400"
  },
  {
    icon: <GitBranch className="w-5 h-5" />,
    title: "Branch",
    description: "Create feature branches for all new developments",
    color: "text-purple-400"
  },
  {
    icon: <Github className="w-5 h-5" />,
    title: "Commit",
    description: "Regular commits with semantic messages",
    color: "text-gray-400"
  },
  {
    icon: <GitPullRequest className="w-5 h-5" />,
    title: "PR Review",
    description: "Thorough code reviews before merging",
    color: "text-yellow-400"
  },
  {
    icon: <CheckCircle2 className="w-5 h-5" />,
    title: "Tests",
    description: "Automated testing pipeline runs on every push",
    color: "text-green-400"
  },
  {
    icon: <Server className="w-5 h-5" />,
    title: "Deploy",
    description: "Automated deployment to production",
    color: "text-cyan-400"
  }
];

export default function DeploymentFlow() {
  return (
    <section className="py-12 bg-sky-950/70 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.h2 
          className="text-3xl font-bold mb-12 text-cyan-400 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          My CI/CD Workflow
        </motion.h2>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 sm:left-1/2 top-0 h-full w-0.5 bg-gradient-to-b from-blue-500/30 via-purple-500/30 to-cyan-500/30 -translate-x-1/2"></div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {deploymentSteps.map((step, index) => (
              <motion.div
                key={index}
                className={`relative ${index % 2 === 0 ? 'sm:mr-auto' : 'sm:ml-auto'} lg:col-span-1`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Timeline dot */}
                <div className={`absolute left-0 sm:left-1/2 top-6 w-3 h-3 rounded-full ${step.color} bg-opacity-30 -translate-x-1/2`}></div>
                
                <motion.div 
                  className="bg-sky-900/50 backdrop-blur-sm p-6 rounded-xl h-full"
                  whileHover={{ y: -5 }}
                >
                  <div className={`flex items-center gap-3 mb-3 ${step.color}`}>
                    {step.icon}
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                  </div>
                  <p className="text-gray-300">{step.description}</p>
                  
                  {/* Animated progress indicator */}
                  {index < deploymentSteps.length - 1 && (
                    <motion.div
                      className="absolute -bottom-6 left-1/2 -translate-x-1/2"
                      animate={{ 
                        y: [0, 5, 0],
                        opacity: [0.6, 1, 0.6]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.2
                      }}
                    >
                      <Clock className="w-4 h-4 text-cyan-400/50" />
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>
          
          {/* Animated deployment rocket */}
          <motion.div
            className="absolute left-1/2 -bottom-10 -translate-x-1/2"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="text-4xl">🚀</div>
          </motion.div>
        </div>
        
        {/* Tools section */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl font-semibold mb-6 text-cyan-300">Tools I Work With</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {['GitHub Actions', 'CircleCI', 'Jenkins', 'Docker', 'Kubernetes', 'AWS CodePipeline', 'Terraform'].map((tool, i) => (
              <motion.div
                key={i}
                className="bg-cyan-500/10 px-4 py-2 rounded-full text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tool}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}