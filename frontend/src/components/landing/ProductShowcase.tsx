'use client'

import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
}

export default function ProductShowcase() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-l from-purple-100 to-transparent rounded-full opacity-40 blur-3xl"></div>
      </div>

      <div className="mx-auto max-w-6xl px-4 md:px-6 relative z-10">
        <motion.div 
          className="grid md:grid-cols-3 gap-8 items-start mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Left - Sell Anything */}
          <motion.div 
            className="rounded-3xl border-2 border-gray-200 p-8 md:p-10 bg-white/50 backdrop-blur-sm hover:border-gray-300 hover:shadow-xl transition-all duration-300"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <h3 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">NFT subscriptions</h3>
            <p className="text-gray-700 leading-relaxed mb-6 font-medium">
              Fans get provable membership NFTs. Transferable, tradeable, and verifiable onchain. True ownership for your supporters.
            </p>
          </motion.div>

          {/* Center - Product Mockup */}
          <motion.div 
            className="flex justify-center"
            variants={itemVariants}
          >
            <motion.div 
              className="relative"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Laptop frame */}
              <motion.div 
                className="bg-white rounded-2xl shadow-2xl border-8 border-gray-900 p-1 w-80 transition-shadow"
                whileHover={{ scale: 1.02 }}
              >
                <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-lg p-4 h-64">
                  <div className="flex gap-2 mb-3">
                    <motion.div 
                      className="w-3 h-3 bg-teal-400 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    ></motion.div>
                    <div className="w-3 h-3 bg-teal-400 rounded-full"></div>
                  </div>
                  <div className="bg-white rounded-lg p-3 mb-2">
                    <p className="text-xs font-semibold text-gray-800">My Product</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 mb-2">
                    <p className="text-xs font-semibold text-gray-800 mb-2">How to Play Ukelele</p>
                    <div className="aspect-square bg-gradient-to-br from-pink-400 to-pink-600 rounded flex items-center justify-center hover:shadow-lg transition-shadow">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-900 h-6 flex items-center justify-center">
                  <div className="w-24 h-1 bg-gray-700 rounded-full"></div>
                </div>
              </motion.div>

              {/* Second mockup card */}
              <motion.div 
                className="absolute bottom-0 right-0 transform translate-x-12 translate-y-12 bg-white rounded-2xl shadow-xl border-4 border-gray-900 p-2 w-48"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <div className="bg-teal-600 rounded-lg p-2 h-32">
                  <div className="bg-white rounded p-2 mb-1">
                    <p className="text-xs font-semibold text-gray-800">How to Play Ukelele</p>
                    <p className="text-xs text-gray-600">Priyanka</p>
                  </div>
                  <div className="flex gap-1">
                    <button className="text-xs bg-white text-teal-600 px-2 py-1 rounded hover:bg-gray-100 transition">Add to cart</button>
                    <button className="text-xs bg-gradient-to-r from-pink-500 to-pink-600 text-white px-2 py-1 rounded font-bold hover:shadow-lg transition">$15</button>
                  </div>
                </div>
              </motion.div>

              {/* Yellow badges */}
              <motion.div 
                className="absolute -top-6 -right-8 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full w-16 h-16 flex items-center justify-center font-bold text-sm shadow-lg border-2 border-yellow-500"
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                $$$
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right - Make Your Own Road */}
          <motion.div 
            className="rounded-3xl border-2 border-gray-200 p-8 md:p-10 bg-white/50 backdrop-blur-sm hover:border-gray-300 hover:shadow-xl transition-all duration-300"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <h3 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">Decentralized storage</h3>
            <p className="text-gray-700 leading-relaxed mb-12 font-medium">
              All content stored on Walrus. No censorship, no takedowns. Your content, your rules, forever accessible.
            </p>
            
            {/* Stats card */}
            <motion.div 
              className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex gap-6 mb-6">
                <motion.div 
                  className="text-right"
                  whileHover={{ scale: 1.1 }}
                >
                  <p className="text-sm text-gray-600 font-medium">Sales</p>
                  <p className="text-3xl font-bold">9</p>
                </motion.div>
                <div className="border-r border-gray-200"></div>
                <motion.div whileHover={{ scale: 1.1 }}>
                  <p className="text-sm text-gray-600 font-medium">People</p>
                  <p className="text-3xl font-bold">481</p>
                </motion.div>
                <div className="border-r border-gray-200"></div>
                <motion.div whileHover={{ scale: 1.1 }}>
                  <p className="text-sm text-gray-600 font-medium">Total</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">$50,000</p>
                </motion.div>
              </div>
              
              {/* Mini chart */}
              <svg className="w-full h-16" viewBox="0 0 200 60" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <motion.path 
                  d="M0,40 L20,35 L40,30 L60,35 L80,25 L100,20 L120,25 L140,15 L160,18 L180,12 L200,15" 
                  stroke="#ec4899" 
                  strokeWidth="2" 
                  fill="none"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 1.5 }}
                  viewport={{ once: true }}
                />
                <path d="M0,40 L20,35 L40,30 L60,35 L80,25 L100,20 L120,25 L140,15 L160,18 L180,12 L200,15 L200,60 L0,60 Z" fill="url(#chartGrad)" />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Sell To Anyone / Sell Anywhere Row */}
        <motion.div 
          className="grid md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div 
            className="rounded-3xl border-2 border-gray-200 p-8 md:p-10 bg-white/50 backdrop-blur-sm hover:border-gray-300 hover:shadow-xl transition-all duration-300"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">Instant payments</h3>
            <div className="space-y-4">
              {['95% revenue share, paid instantly in SUI.', 'No chargebacks, no payment processor fees.'].map((item, idx) => (
                <motion.div 
                  key={idx}
                  className="flex gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <motion.div 
                    className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center flex-shrink-0 text-white text-sm font-bold"
                    whileHover={{ scale: 1.2, rotate: 360 }}
                  >
                    ✓
                  </motion.div>
                  <p className="text-gray-700 font-medium">{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="rounded-3xl border-2 border-gray-200 p-8 md:p-10 bg-white/50 backdrop-blur-sm hover:border-gray-300 hover:shadow-xl transition-all duration-300"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">Privacy-first auth</h3>
            <p className="text-gray-700 mb-6 font-medium leading-relaxed">
              zkLogin with Google, no wallet needed. Fans authenticate privately while creators maintain full custody. Best of both worlds.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
