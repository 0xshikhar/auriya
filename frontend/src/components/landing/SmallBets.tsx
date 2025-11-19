'use client'

import { motion } from 'framer-motion'

export default function SmallBets() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Don&apos;t take risks.<br />
            <span className="text-gray-500">That&apos;s scary!</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Left card - Stressed character */}
          <motion.div 
            className="bg-white border-2 border-gray-200 rounded-3xl p-8 hover:shadow-xl transition"
            whileHover={{ y: -5 }}
          >
            <div className="mb-6">
              <div className="inline-block bg-gray-100 rounded-2xl px-4 py-2 mb-4">
                <p className="text-sm font-medium">Instead of selling a book...</p>
              </div>
            </div>
            
            {/* Illustration: Stressed character at desk */}
            <div className="relative h-64 flex items-center justify-center mb-6">
              <motion.div
                className="relative"
                animate={{ rotate: [-2, 2, -2] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Desk */}
                  <rect x="40" y="140" width="120" height="10" fill="#8B4513" stroke="#000" strokeWidth="2"/>
                  <rect x="50" y="150" width="10" height="40" fill="#8B4513" stroke="#000" strokeWidth="2"/>
                  <rect x="140" y="150" width="10" height="40" fill="#8B4513" stroke="#000" strokeWidth="2"/>
                  
                  {/* Character body */}
                  <ellipse cx="100" cy="100" rx="35" ry="45" fill="#ec4899" stroke="#000" strokeWidth="3"/>
                  
                  {/* Arms stressed */}
                  <path d="M 70 110 Q 50 100, 45 85" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round"/>
                  <path d="M 130 110 Q 150 100, 155 85" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round"/>
                  
                  {/* Stressed face */}
                  <ellipse cx="88" cy="95" rx="5" ry="8" fill="#000"/>
                  <ellipse cx="112" cy="95" rx="5" ry="8" fill="#000"/>
                  <path d="M 85 115 Q 100 105, 115 115" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round"/>
                  
                  {/* Stress lines */}
                  <path d="M 60 70 L 55 60" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M 70 65 L 68 55" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M 140 70 L 145 60" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
                  
                  {/* Papers on desk */}
                  <rect x="60" y="125" width="30" height="15" fill="#fff" stroke="#000" strokeWidth="2"/>
                  <rect x="110" y="125" width="30" height="15" fill="#fff" stroke="#000" strokeWidth="2"/>
                  <line x1="65" y1="130" x2="85" y2="130" stroke="#000" strokeWidth="1"/>
                  <line x1="65" y1="135" x2="85" y2="135" stroke="#000" strokeWidth="1"/>
                </svg>
              </motion.div>
            </div>
          </motion.div>

          {/* Right card - Happy character */}
          <motion.div 
            className="bg-white border-2 border-gray-200 rounded-3xl p-8 hover:shadow-xl transition"
            whileHover={{ y: -5 }}
          >
            <div className="mb-6">
              <div className="inline-block bg-gray-100 rounded-2xl px-4 py-2 mb-4">
                <p className="text-sm font-medium">...start by selling a blog post!</p>
              </div>
            </div>
            
            {/* Illustration: Happy character outdoors */}
            <div className="relative h-64 flex items-center justify-center mb-6">
              <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Sky/background circle */}
                <circle cx="100" cy="100" r="90" fill="#a7d8f0" stroke="#000" strokeWidth="3"/>
                
                {/* Tree */}
                <rect x="150" y="80" width="20" height="60" fill="#8B4513" stroke="#000" strokeWidth="2"/>
                <ellipse cx="160" cy="70" rx="25" ry="30" fill="#22c55e" stroke="#000" strokeWidth="2"/>
                
                {/* Ground */}
                <ellipse cx="100" cy="160" rx="80" ry="15" fill="#22c55e" stroke="#000" strokeWidth="2"/>
                
                {/* Character body */}
                <ellipse cx="80" cy="120" rx="30" ry="40" fill="#ec4899" stroke="#000" strokeWidth="3"/>
                
                {/* Arms relaxed */}
                <path d="M 55 125 Q 40 130, 35 140" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round"/>
                <path d="M 105 125 Q 120 130, 125 140" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round"/>
                
                {/* Happy face */}
                <ellipse cx="72" cy="115" rx="4" ry="6" fill="#000"/>
                <ellipse cx="88" cy="115" rx="4" ry="6" fill="#000"/>
                <path d="M 70 130 Q 80 140, 90 130" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round"/>
                
                {/* Laptop */}
                <rect x="60" y="145" width="40" height="25" fill="#374151" stroke="#000" strokeWidth="2"/>
                <rect x="65" y="150" width="30" height="15" fill="#93c5fd" stroke="#000" strokeWidth="1"/>
              </svg>
            </div>
          </motion.div>
        </div>

        <div className="text-center py-12 border-t border-gray-200">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            Place small bets. That&apos;s exciting!
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Launch your subscription page in minutes. NFT memberships, Walrus storage, instant SUI payments. No middlemen.
          </p>
        </div>
      </div>
    </section>
  )
}
