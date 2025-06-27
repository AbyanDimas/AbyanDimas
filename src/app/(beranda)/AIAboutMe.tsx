'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Send, User, Bot } from 'lucide-react';

interface Message {
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function AIAboutMe() {
  const [responses, setResponses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [userQuestion, setUserQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [initialLoad, setInitialLoad] = useState(true);

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  useEffect(() => {
    const fetchInitialResponses = async () => {
      try {
        const questions = [
          "Tell me about Abyan's technical skills in 2 sentences",
          "What makes Abyan a good developer in 2 sentences?",
          "Describe Abyan's approach to problem solving in 2 sentences",
          "What are Abyan's strongest soft skills as a developer?",
          "How does Abyan handle teamwork and collaboration?",
          "What technologies is Abyan most proficient with?"
        ];

        const generatedResponses: string[] = [];
        
        for (const question of questions) {
          const result = await model.generateContent({
            contents: [{
              role: 'user',
              parts: [{
                text: `${question} Keep the response professional and concise.`
              }]
            }]
          });
          generatedResponses.push(result.response.text());
        }

        setResponses(generatedResponses);
        
        // Add initial greeting
        setConversation([{
          text: "Hello! I can answer questions about Abyan's professional skills and experience. What would you like to know?",
          sender: 'ai',
          timestamp: new Date()
        }]);
      } catch (error) {
        console.error("Error fetching AI responses:", error);
        setResponses([
          "Abyan is skilled in full-stack development with expertise in modern frameworks.",
          "He is a diligent developer who writes clean, efficient code and solves complex problems.",
          "Abyan approaches problems methodically, breaking them down into manageable components.",
          "Abyan excels in communication, adaptability, and time management.",
          "He collaborates effectively, values diverse perspectives, and maintains positive team dynamics.",
          "Abyan is proficient in JavaScript/TypeScript, React, Node.js, and modern web technologies."
        ]);
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };

    fetchInitialResponses();
  }, []);

  const handleAskQuestion = async () => {
    if (!userQuestion.trim() || isAsking) return;

    try {
      setIsAsking(true);
      
      // Add user question to conversation
      const userMessage: Message = {
        text: userQuestion,
        sender: 'user',
        timestamp: new Date()
      };
      setConversation(prev => [...prev, userMessage]);
      setUserQuestion('');

      // Get AI response
      const prompt = `Answer this question about Abyan professionally and concisely: ${userQuestion}. 
      If the question is not related to Abyan's professional skills or experience, politely decline to answer.
      Keep response under 100 words.`;
      
      const result = await model.generateContent({
        contents: [{
          role: 'user',
          parts: [{ text: prompt }]
        }]
      });

      const aiResponse = result.response.text();
      
      // Add AI response to conversation
      const aiMessage: Message = {
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      setConversation(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error asking question:", error);
      const errorMessage: Message = {
        text: "Sorry, I encountered an error processing your question. Please try again.",
        sender: 'ai',
        timestamp: new Date()
      };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsAsking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion();
    }
  };

  const aiCards = [
    {
      title: "Technical Skills",
      icon: "💻",
      response: responses[0] || "Loading..."
    },
    {
      title: "Development Strengths",
      icon: "🚀",
      response: responses[1] || "Loading..."
    },
    {
      title: "Problem Solving",
      icon: "🧩",
      response: responses[2] || "Loading..."
    },
    {
      title: "Soft Skills",
      icon: "🤝",
      response: responses[3] || "Loading..."
    },
    {
      title: "Team Collaboration",
      icon: "👥",
      response: responses[4] || "Loading..."
    },
    {
      title: "Tech Stack",
      icon: "🛠️",
      response: responses[5] || "Loading..."
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-sky-900/30 to-blue-900/30">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.h2 
          className="text-3xl font-bold mb-12 text-cyan-400 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Ask About Me
        </motion.h2>
        
        {/* Cards Grid - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {aiCards.map((card, index) => (
            <motion.div
              key={index}
              className="bg-sky-900/50 backdrop-blur-sm p-6 rounded-xl min-h-[200px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl mb-4">{card.icon}</div>
              <h3 className="text-xl font-semibold mb-4">{card.title}</h3>
              {loading ? (
                <div className="space-y-2">
                  <div className="h-4 bg-sky-800/50 rounded animate-pulse"></div>
                  <div className="h-4 bg-sky-800/50 rounded animate-pulse w-5/6"></div>
                </div>
              ) : (
                <p className="text-gray-300">"{card.response}"</p>
              )}
              <div className="mt-4 text-xs text-cyan-400/70 flex items-center gap-1">
                <span>Generated by Gemini 1.5 Flash</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chat Section Below Cards */}
        <div className="max-w-4xl mx-auto">
          <motion.h3 
            className="text-2xl font-semibold mb-6 text-cyan-300 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Ask Me Anything
          </motion.h3>
          
          <div className="bg-sky-900/50 backdrop-blur-sm rounded-xl p-6 mb-6 h-[400px] overflow-y-auto">
            {initialLoad ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {conversation.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] rounded-lg p-4 ${msg.sender === 'user' ? 'bg-cyan-600/30' : 'bg-sky-800/30'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        {msg.sender === 'user' ? (
                          <User className="w-4 h-4 text-cyan-300" />
                        ) : (
                          <Bot className="w-4 h-4 text-cyan-300" />
                        )}
                        <span className="text-xs font-medium text-cyan-300">
                          {msg.sender === 'user' ? 'You' : 'AI Assistant'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-gray-100">{msg.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <input
              type="text"
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about my skills, experience, or work approach..."
              className="w-full bg-sky-900/50 backdrop-blur-sm border border-sky-700 rounded-xl py-4 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 text-gray-100"
              disabled={isAsking}
            />
            <button
              onClick={handleAskQuestion}
              disabled={isAsking || !userQuestion.trim()}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cyan-400 hover:text-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAsking ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-cyan-400"></div>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}