'use client';

import { Doughnut, Bar, Line, Radar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, RadialLinearScale, Filler } from 'chart.js';
import { useEffect, useState } from 'react';

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
  labels: ['Frontend', 'Backend', 'DevOps', 'UI/UX', 'Database'],
  datasets: [
    {
      label: 'Skill Level',
      data: [85, 90, 75, 80, 85],
      backgroundColor: [
        'rgba(34, 211, 238, 0.8)',
        'rgba(6, 182, 212, 0.8)',
        'rgba(8, 145, 178, 0.8)',
        'rgba(14, 116, 144, 0.8)',
        'rgba(21, 94, 117, 0.8)',
      ],
      borderColor: [
        'rgba(34, 211, 238, 1)',
        'rgba(6, 182, 212, 1)',
        'rgba(8, 145, 178, 1)',
        'rgba(14, 116, 144, 1)',
        'rgba(21, 94, 117, 1)',
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
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: 'rgba(34, 211, 238, 0.5)',
      borderColor: 'rgba(34, 211, 238, 1)',
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
      backgroundColor: 'rgba(6, 182, 212, 0.5)',
      borderColor: 'rgba(6, 182, 212, 1)',
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
      backgroundColor: 'rgba(8, 145, 178, 0.6)',
      borderColor: 'rgba(14, 116, 144, 1)',
      pointBackgroundColor: 'rgba(34, 211, 238, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(34, 211, 238, 1)',
    }
  ]
};

const productivityData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Productivity Level',
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: true,
      backgroundColor: 'rgba(6, 182, 212, 0.2)',
      borderColor: 'rgba(6, 182, 212, 1)',
      tension: 0.4,
    },
  ],
};

export default function StatsSection() {
  const [visitorsData, setVisitorsData] = useState({
    labels: Array(24).fill(0).map((_, i) => `${i}:00`),
    datasets: [
      {
        label: 'Live Visitors',
        data: Array(24).fill(0),
        backgroundColor: 'rgba(34, 211, 238, 0.5)',
        borderColor: 'rgba(34, 211, 238, 1)',
        borderWidth: 2,
      },
    ],
  });

  useEffect(() => {
    // Simulate real-time visitors data
    const interval = setInterval(() => {
      const now = new Date();
      const currentHour = now.getHours();
      
      setVisitorsData(prev => {
        const newData = [...prev.datasets[0].data];
        // Random fluctuation in current hour
        newData[currentHour] = Math.floor(Math.random() * 50) + 10;
        // Gradually decrease older data
        for (let i = 0; i < 24; i++) {
          if (i !== currentHour && newData[i] > 0) {
            newData[i] = Math.max(0, newData[i] - 0.5);
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
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 bg-sky-950/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-3xl font-bold mb-8 text-cyan-400">My Statistics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-sky-900/50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Skills Distribution</h3>
            <div className="h-64">
              <Doughnut data={skillsData} />
            </div>
          </div>
          
          <div className="bg-sky-900/50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Projects Timeline</h3>
            <div className="h-64">
              <Bar data={projectsData} />
            </div>
          </div>
          
          <div className="bg-sky-900/50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Experience Growth</h3>
            <div className="h-64">
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
          </div>

          <div className="bg-sky-900/50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Live Visitors</h3>
            <div className="h-64">
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
          </div>

          <div className="bg-sky-900/50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Language Proficiency</h3>
            <div className="h-64">
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
          </div>

          <div className="bg-sky-900/50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Weekly Productivity</h3>
            <div className="h-64">
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
          </div>
        </div>
      </div>
    </section>
  );
}