'use client'

import { motion } from 'framer-motion'

export default function SmallBets() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            From Patreon to Auriya<br />
            <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">The Creator Revolution</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">See why creators are switching to decentralized monetization</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Left card - Stressed character */}
          <motion.div 
            className="bg-white border-2 border-gray-200 rounded-3xl p-8 hover:shadow-xl transition"
            whileHover={{ y: -5 }}
          >
            <div className="mb-6">
              <div className="inline-block bg-red-100 rounded-2xl px-4 py-2 mb-4 border-2 border-red-200">
                <p className="text-sm font-bold text-red-700">❌ Traditional Platforms (Patreon, OnlyFans, Gumroad)</p>
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
            <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-200">
              <h4 className="font-bold text-xl mb-3 text-red-700">Patreon</h4>
              <ul className="text-left space-y-2 text-gray-700">
                <li>❌ 80-85% revenue (15-20% fees)</li>
                <li>❌ 7-14 day payment delays</li>
                <li>❌ Can ban you anytime</li>
                <li>❌ Platform owns your audience</li>
                <li>❌ Content can be deleted</li>
              </ul>
            </div>
          </motion.div>
          

          {/* Right card - Happy character */}
          <motion.div 
            className="bg-white border-2 border-gray-200 rounded-3xl p-8 hover:shadow-xl transition"
            whileHover={{ y: -5 }}
          >
            <div className="mb-6">
              <div className="inline-block bg-green-100 rounded-2xl px-4 py-2 mb-4 border-2 border-green-200">
                <p className="text-sm font-bold text-green-700">✅ Auriya (Decentralized)</p>
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
            <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
              <h4 className="font-bold text-xl mb-3 text-green-700">Auriya</h4>
              <ul className="text-left space-y-2 text-gray-700">
                <li>✅ 97% revenue (3% fees only)</li>
                <li>✅ Instant payments in SUI</li>
                <li>✅ Unstoppable, no censorship</li>
                <li>✅ You own everything on-chain</li>
                <li>✅ Content stored forever on Walrus</li>
              </ul>
            </div>
          </motion.div>
        </div>

        <div className="text-center py-6 border-gray-200">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
          
           
          </div>
          <h3 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
            The Choice is Clear
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Join the creator revolution. NFT subscriptions, Walrus storage, Mysten Seal encryption, zkLogin auth. Built on Sui.
          </p>
          <motion.button 
            className="bg-gradient-to-r from-black to-gray-900 text-white px-8 py-3 rounded-full font-semibold hover:shadow-xl transition text-lg"
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
            whileTap={{ scale: 0.95 }}
          >
            Start Creating on Auriya
          </motion.button>
        </div>
      </div>
    </section>
  )
}
