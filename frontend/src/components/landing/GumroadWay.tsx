'use client'

import { motion } from 'framer-motion'

export default function GumroadWay() {
  return (
    <section className="py-20 md:py-32 bg-gray-50 relative overflow-hidden">
      <div className="mx-auto max-w-5xl px-4 md:px-6 relative z-10">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          You know all those great ideas you have?
        </motion.h2>

        {/* Yellow pill with character */}
        <motion.div 
          className="relative max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Yellow rounded pill */}
          <div className="relative bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-300 rounded-full px-12 py-20 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            
            {/* Top row labels */}
            <div className="absolute top-8 left-0 right-0 flex justify-between items-center px-16">
              <motion.div 
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <motion.span 
                  className="text-2xl font-bold"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  →
                </motion.span>
                <span className="font-bold text-base">The Auriya Way</span>
              </motion.div>

              <motion.div 
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <motion.span 
                  className="text-2xl font-bold"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  →
                </motion.span>
                <span className="font-bold text-base">Start Small</span>
              </motion.div>
            </div>

            {/* Character in center */}
            <motion.div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
              animate={{ 
                y: [0, -10, 0],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Pink blob character */}
              <svg width="120" height="140" viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Head */}
                <ellipse cx="60" cy="50" rx="45" ry="55" fill="#ec4899" stroke="#000" strokeWidth="3"/>
                {/* Body */}
                <path d="M 40 90 Q 40 110, 50 120 L 70 120 Q 80 110, 80 90 Z" fill="#fbbf24" stroke="#000" strokeWidth="3"/>
                {/* Arms */}
                <path d="M 35 95 Q 20 100, 25 110" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round"/>
                <path d="M 85 95 Q 100 100, 95 110" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round"/>
                {/* Legs */}
                <ellipse cx="50" cy="125" rx="8" ry="12" fill="#fbbf24" stroke="#000" strokeWidth="3"/>
                <ellipse cx="70" cy="125" rx="8" ry="12" fill="#fbbf24" stroke="#000" strokeWidth="3"/>
                {/* Face - happy */}
                <ellipse cx="48" cy="45" rx="4" ry="6" fill="#000"/>
                <ellipse cx="72" cy="45" rx="4" ry="6" fill="#000"/>
                <path d="M 45 60 Q 60 70, 75 60" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round"/>
              </svg>
            </motion.div>

            {/* Bottom row labels */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-between items-center px-16">
              <motion.div 
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <span className="font-bold text-base">Get Better Together</span>
                <motion.span 
                  className="text-2xl font-bold"
                  animate={{ x: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ←
                </motion.span>
              </motion.div>

              <motion.div 
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <span className="font-bold text-base">Learn Quickly</span>
                <motion.span 
                  className="text-2xl font-bold"
                  animate={{ x: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ←
                </motion.span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
            Launch in minutes.
          </h2>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
            Scale with blockchain.
          </h2>

          <p className="text-center text-gray-700 max-w-2xl mx-auto mb-10 leading-relaxed text-lg font-medium">
            No coding required. Connect with zkLogin, upload to Walrus, set your tiers. Your decentralized creator page is live in 5 minutes.
          </p>

          <div className="text-center">
            <motion.button 
              className="bg-gradient-to-r from-black to-gray-900 text-white px-8 py-3 rounded-full font-semibold hover:shadow-xl transition text-lg"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              Find out how
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
