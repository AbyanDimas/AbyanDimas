'use client';

import { Doughnut, Bar, Line, Radar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, RadialLinearScale, Filler } from 'chart.js';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler
);

const skillsData = {
  labels: ['Frontend', 'Backend', 'DevOps', 'UI/UX', 'Database', 'Cloud', 'Data Engineering', 'Data Science', 'Mobile', 'Git'],
  datasets: [
    {
      label: 'Skill Level',
      data: [85, 65, 45, 60, 50, 60, 50, 35, 20, 75],
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',   // Frontend
        'rgba(54, 162, 235, 0.8)',   // Backend
        'rgba(255, 206, 86, 0.8)',   // DevOps
        'rgba(75, 192, 192, 0.8)',   // UI/UX
        'rgba(153, 102, 255, 0.8)',  // Database
        'rgba(255, 159, 64, 0.8)',   // Cloud
        'rgba(201, 203, 207, 0.8)',  // Data Engineering
        'rgba(100, 149, 237, 0.8)',  // Data Science
        'rgba(255, 99, 71, 0.8)',    // Mobile
        'rgba(60, 179, 113, 0.8)',   // Git
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)',
        'rgba(100, 149, 237, 1)',
        'rgba(255, 99, 71, 1)',
        'rgba(60, 179, 113, 1)',
      ],
      borderWidth: 1,
    },
  ],
};


const projectsData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Projects Completed',
      data: [5, 8, 6, 9, 7, 10],
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 2,
    },
  ],
};

const experienceData = {
  labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
  datasets: [
    {
      label: 'Years of Experience',
      data: [1, 2, 3, 4, 5, 6],
      fill: false,
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      tension: 0.4,
    },
  ],
};

const languagesData = {
  labels: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust'],
  datasets: [
    {
      label: 'Proficiency',
      data: [95, 90, 85, 75, 65, 60],
      backgroundColor: 'rgba(255, 206, 86, 0.6)',
      borderColor: 'rgba(255, 206, 86, 1)',
      pointBackgroundColor: 'rgba(153, 102, 255, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(153, 102, 255, 1)',
    }
  ]
};

const productivityData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Productivity Level',
      data: [70, 75, 85, 80, 65, 50, 40],
      fill: true,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      tension: 0.4,
    },
  ],
};

export default function StatsSection({ onCardClick }: { onCardClick: (card: string) => void }) {
  const [visitorsData, setVisitorsData] = useState({
    labels: Array(24).fill(0).map((_, i) => `${i}:00`),
    datasets: [
      {
        label: 'Live Visitors',
        data: Array(24).fill(0),
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 2,
      },
    ],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentHour = now.getHours();
      
      setVisitorsData(prev => {
        const newData = [...prev.datasets[0].data];
        const baseVisitors = currentHour >= 9 && currentHour <= 17 ? 
          Math.floor(Math.random() * 30) + 20 : 
          Math.floor(Math.random() * 15) + 5;
        
        newData[currentHour] = baseVisitors;
        
        for (let i = 0; i < 24; i++) {
          if (i !== currentHour) {
            newData[i] = Math.max(0, newData[i] * 0.95);
          }
        }
        
        return {
          ...prev,
          datasets: [
            {
              ...prev.datasets[0],
              data: newData,
            },
          ],
        };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="projects" className="py-12 bg-sky-950/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-3xl font-bold mb-8 text-cyan-400 text-center">My Statistics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Skills Card */}
          <motion.div 
            className="bg-sky-900/50 p-6 rounded-2xl shadow-lg cursor-pointer relative overflow-hidden group"
            onClick={() => onCardClick('skills')}
            whileHover={{ scale: 1.02, boxShadow: '0 10px 25px -5px rgba(34, 211, 238, 0.2)' }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <h3 className="text-xl font-semibold mb-4 relative z-10">Skills Distribution</h3>
            <div className="h-64 relative z-10">
              <Doughnut data={skillsData} />
            </div>
          </motion.div>
          
          {/* Projects Card */}
          <motion.div 
            className="bg-sky-900/50 p-6 rounded-2xl shadow-lg cursor-pointer relative overflow-hidden group"
            onClick={() => onCardClick('projects')}
            whileHover={{ scale: 1.02, boxShadow: '0 10px 25px -5px rgba(34, 211, 238, 0.2)' }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <h3 className="text-xl font-semibold mb-4 relative z-10">Projects Timeline</h3>
            <div className="h-64 relative z-10">
              <Bar data={projectsData} />
            </div>
          </motion.div>
          
          {/* Experience Card */}
          <motion.div 
            className="bg-sky-900/50 p-6 rounded-2xl shadow-lg cursor-pointer relative overflow-hidden group"
            onClick={() => onCardClick('experience')}
            whileHover={{ scale: 1.02, boxShadow: '0 10px 25px -5px rgba(34, 211, 238, 0.2)' }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <h3 className="text-xl font-semibold mb-4 relative z-10">Experience Growth</h3>
            <div className="h-64 relative z-10">
              <Line 
                data={experienceData} 
                options={{
                  elements: {
                    line: {
                      tension: 0.4
                    }
                  }
                }}
              />
            </div>
          </motion.div>

          {/* Visitors Card */}
          <motion.div 
            className="bg-sky-900/50 p-6 rounded-2xl shadow-lg cursor-pointer relative overflow-hidden group"
            onClick={() => onCardClick('visitors')}
            whileHover={{ scale: 1.02, boxShadow: '0 10px 25px -5px rgba(34, 211, 238, 0.2)' }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <h3 className="text-xl font-semibold mb-4 relative z-10">Live Visitors</h3>
            <div className="h-64 relative z-10">
              <Bar 
                data={visitorsData} 
                options={{
                  animation: {
                    duration: 1000
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 60
                    }
                  }
                }} 
              />
            </div>
          </motion.div>

          {/* Languages Card */}
          <motion.div 
            className="bg-sky-900/50 p-6 rounded-2xl shadow-lg cursor-pointer relative overflow-hidden group"
            onClick={() => onCardClick('languages')}
            whileHover={{ scale: 1.02, boxShadow: '0 10px 25px -5px rgba(34, 211, 238, 0.2)' }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <h3 className="text-xl font-semibold mb-4 relative z-10">Language Proficiency</h3>
            <div className="h-64 relative z-10">
              <Radar 
                data={languagesData} 
                options={{
                  scales: {
                    r: {
                      angleLines: {
                        display: true,
                        color: 'rgba(255, 255, 255, 0.1)'
                      },
                      suggestedMin: 0,
                      suggestedMax: 100
                    }
                  }
                }} 
              />
            </div>
          </motion.div>

          {/* Productivity Card */}
          <motion.div 
            className="bg-sky-900/50 p-6 rounded-2xl shadow-lg cursor-pointer relative overflow-hidden group"
            onClick={() => onCardClick('productivity')}
            whileHover={{ scale: 1.02, boxShadow: '0 10px 25px -5px rgba(34, 211, 238, 0.2)' }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <h3 className="text-xl font-semibold mb-4 relative z-10">Weekly Productivity</h3>
            <div className="h-64 relative z-10">
              <Line 
                data={productivityData} 
                options={{
                  plugins: {
                    filler: {
                      propagate: false
                    }
                  },
                  interaction: {
                    intersect: false
                  },
                  scales: {
                    y: {
                      min: 0,
                      max: 100
                    }
                  },
                  elements: {
                    line: {
                      tension: 0.4
                    }
                  },
                  animation: {
                    duration: 1000,
                    easing: 'linear'
                  }
                }} 
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}