'use client'

import { motion } from 'framer-motion'

export default function GumroadWay() {
  return (
    <section className="py-20 md:py-32 bg-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-yellow-100 to-transparent rounded-full opacity-40 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-purple-100 to-transparent rounded-full opacity-40 blur-3xl"></div>
      </div>

      <div className="mx-auto max-w-5xl px-4 md:px-6 relative z-10">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Ready to own your creator business?
        </motion.h2>

        <motion.div 
          className="bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-3xl max-w-4xl mx-auto mb-16 px-8 md:px-16 py-16 relative shadow-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          whileHover={{ boxShadow: "0 30px 60px rgba(0,0,0,0.2)" }}
        >
          <div className="flex justify-between items-center relative mb-8">
            <motion.div 
              className="text-center flex-1"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <p className="font-bold text-lg text-gray-900">Start Small</p>
            </motion.div>

            <motion.div 
              className="flex-1 flex justify-center gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <motion.span 
                className="text-3xl font-bold"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                →
              </motion.span>
              <h3 className="font-bold text-xl text-center text-gray-900">The Auriya Way</h3>
              <motion.span 
                className="text-3xl font-bold"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                →
              </motion.span>
            </motion.div>

            <motion.div 
              className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, -5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <motion.span 
                  className="text-4xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  😊
                </motion.span>
              </div>
            </motion.div>

            <div className="flex-1"></div>
          </div>

          <div className="flex justify-between items-center mt-8 relative">
            <div className="flex-1"></div>
            
            <motion.div 
              className="flex-1 flex justify-center gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <motion.span 
                className="text-3xl font-bold"
                animate={{ x: [-5, 0, -5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ←
              </motion.span>
              <span className="font-bold text-lg text-gray-900">Get Better Together</span>
              <motion.span 
                className="text-3xl font-bold"
                animate={{ x: [-5, 0, -5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ←
              </motion.span>
            </motion.div>

            <motion.div 
              className="flex-1 flex justify-center"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <motion.span 
                className="text-3xl font-bold"
                animate={{ x: [-5, 0, -5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ←
              </motion.span>
              <span className="font-bold text-lg text-gray-900 ml-4">Learn Quickly</span>
            </motion.div>
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
