'use client'

import { Search } from 'lucide-react'
import { motion } from 'framer-motion'

const FloatingLogo = ({ delay, size, position }: { delay: number; size: number; position: string }) => {
  return (
    <motion.div
      className={`absolute ${position} pointer-events-none`}
      animate={{ 
        y: [0, -30, 0],
        rotate: [0, 5, 0]
      }}
      transition={{ 
        duration: 6 + delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <div className="relative">
        <motion.svg 
          width={size} 
          height={size} 
          viewBox="0 0 200 200"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 6 + delay, repeat: Infinity }}
        >
          <defs>
            <linearGradient id={`grad-${delay}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#98f0e5" />
              <stop offset="100%" stopColor="#80ffdb" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="95" fill={`url(#grad-${delay})`} stroke="#000" strokeWidth="6" />
          <text x="100" y="120" fontSize="110" fontWeight="900" textAnchor="middle" fill="#000" fontFamily="system-ui">A</text>
        </motion.svg>
      </div>
    </motion.div>
  )
}

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-white via-slate-50 to-white pt-16 pb-24 md:pt-24 md:pb-40 overflow-hidden">
      <FloatingLogo delay={0} size={100} position="top-20 left-8" />
      <FloatingLogo delay={1} size={120} position="top-32 right-12" />
      <FloatingLogo delay={0.5} size={140} position="bottom-40 left-12" />
      <FloatingLogo delay={1.5} size={110} position="bottom-32 right-16" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-pink-100 to-transparent rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-blue-100 to-transparent rounded-full opacity-30 blur-3xl"></div>
      </div>

      <motion.div 
        className="mx-auto max-w-5xl px-4 md:px-6 text-center relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1 
          className="text-6xl md:text-8xl font-bold mb-8 leading-tight bg-gradient-to-r from-black via-gray-800 to-black bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Own your audience.
          <br />Keep 95% revenue.
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Decentralized creator monetization on Sui. NFT subscriptions, Walrus storage, instant payments. No middlemen, no deplatforming risk.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.button 
            className="bg-gradient-to-r from-black to-gray-900 text-white px-8 py-3 rounded-full font-semibold hover:shadow-xl transition text-lg"
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
            whileTap={{ scale: 0.95 }}
          >
            Launch your page
          </motion.button>
          <motion.div 
            className="flex items-center bg-white border-2 border-gray-200 rounded-full px-4 py-3 hover:border-gray-300 transition shadow-sm hover:shadow-md"
            whileHover={{ scale: 1.02 }}
          >
            <input
              type="text"
              placeholder="Search creators..."
              className="flex-1 px-2 py-1 text-sm focus:outline-none bg-transparent"
            />
            <motion.button 
              className="px-3 py-2 hover:bg-gray-100 rounded-full transition"
              whileHover={{ scale: 1.1 }}
            >
              <Search size={20} />
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div 
          className="text-sm text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <a href="https://github.com/0xshikhar/auriya" target="_blank" rel="noopener noreferrer" className="hover:text-black transition font-medium">Built on Sui • Powered by Walrus & zkLogin</a>
        </motion.div>
      </motion.div>
    </section>
  )
}
