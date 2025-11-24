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
    <section className="py-12 md:py-20 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-l from-purple-100 to-transparent rounded-full opacity-40 blur-3xl"></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-6 relative z-10">
        <motion.div 
          className="grid md:grid-cols-3 gap-6 items-center mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Left - Subscription NFTs */}
          <motion.div 
            className="rounded-3xl border-2 border-gray-200 p-6 md:p-8 bg-white/50 backdrop-blur-sm hover:border-gray-300 hover:shadow-xl transition-all duration-300 h-full flex flex-col"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="inline-block px-3 py-1 bg-gradient-to-r from-purple-100 to-purple-50 rounded-full text-xs font-bold text-purple-700 mb-3 border border-purple-200 w-fit">NFT-POWERED</div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">Subscription NFTs</h3>
            <p className="text-gray-700 leading-relaxed font-medium text-sm md:text-base">
              Fans mint <span className="font-bold text-gray-900">membership NFTs</span> on Sui blockchain. Transferable, tradeable, verifiable on-chain. Gift to friends, sell on marketplaces, or keep forever. <span className="font-bold text-gray-900">True ownership</span> for your supporters.
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
              {/* Main Dashboard Mockup */}
              <motion.div 
                className="bg-white rounded-2xl shadow-2xl border-8 border-gray-900 p-1 w-80 transition-shadow"
                whileHover={{ scale: 1.02 }}
              >
                <div className="bg-gradient-to-br from-[#98f0e5] to-[#80ffdb] rounded-lg p-4 h-64">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <motion.div 
                        className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-bold text-xs"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        A
                      </motion.div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">Creator Dashboard</p>
                        <p className="text-[10px] text-gray-700">@creator.sui</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stats Card */}
                  <div className="bg-white rounded-lg p-3 mb-2 shadow-sm">
                    <p className="text-[10px] text-gray-600 mb-2">Monthly Revenue</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-xl font-bold text-gray-900">$9,700</p>
                      <span className="text-xs text-green-600 font-semibold">+97%</span>
                    </div>
                  </div>
                  
                  {/* Content Preview */}
                  <div className="bg-white rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-gray-800">Latest Content</p>
                      <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">NFT</span>
                    </div>
                    <div className="aspect-video bg-yellow-100 rounded-lg flex items-center justify-center hover:shadow-lg transition-shadow">
                      <div className="text-center">
                        <div className="text-2xl mb-1">🎨</div>
                        <p className="text-[10px] text-white font-semibold">Premium Tutorial</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-900 h-6 flex items-center justify-center">
                  <div className="w-24 h-1 bg-gray-700 rounded-full"></div>
                </div>
              </motion.div>

              {/* NFT Subscription Card */}
              <motion.div 
                className="absolute bottom-0 right-0 transform translate-x-12 translate-y-12 bg-white rounded-2xl shadow-xl border-4 border-gray-900 p-2 w-48"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <div className="bg-gradient-to-br from-[#98f0e5] to-[#80ffdb] rounded-lg p-3 h-32">
                  <div className="bg-white rounded-lg p-2 mb-2 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-400 rounded flex items-center justify-center text-xs">🎫</div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">Gold Tier NFT</p>
                        <p className="text-[10px] text-gray-600">Subscription</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button className="text-xs bg-white text-gray-900 px-3 py-1.5 rounded-lg font-bold hover:shadow-lg transition flex-1">Subscribe</button>
                    <div className="text-xs bg-white text-gray-900 px-2 py-1.5 rounded-lg font-bold border-2 border-gray-900">20 SUI</div>
                  </div>
                </div>
              </motion.div>

              {/* Walrus Badge */}
              
              {/* <motion.div 
                className="absolute -top-6 -right-8 bg-gradient-to-br from-[#98f0e5] to-[#80ffdb] rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl shadow-lg border-2 border-purple-600"
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                A
              </motion.div> */}
            </motion.div>
          </motion.div>

          {/* Right - Permanent Storage */}
          <motion.div 
            className="rounded-3xl border-2 border-gray-200 p-6 md:p-8 bg-white/50 backdrop-blur-sm hover:border-gray-300 hover:shadow-xl transition-all duration-300 h-full flex flex-col"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="inline-block px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-50 rounded-full text-xs font-bold text-blue-700 mb-3 border border-blue-200 w-fit">WALRUS POWERED</div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">Permanent Storage</h3>
            <p className="text-gray-700 leading-relaxed mb-6 font-medium text-sm md:text-base">
              Every video, image, and file stored on <span className="font-bold text-gray-900">Walrus decentralized storage</span>. No censorship, no takedowns, no single point of failure. Content lives <span className="font-bold text-gray-900">forever</span>, even if Auriya shuts down.
            </p>
            
            {/* Stats card */}
            <motion.div 
              className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-4 hover:shadow-lg transition-shadow mt-auto"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex gap-4 mb-4">
                <motion.div 
                  className="text-center flex-1"
                  whileHover={{ scale: 1.1 }}
                >
                  <p className="text-xs text-gray-600 font-medium">Sales</p>
                  <p className="text-2xl font-bold">9</p>
                </motion.div>
                <div className="border-r border-gray-200"></div>
                <motion.div className="text-center flex-1" whileHover={{ scale: 1.1 }}>
                  <p className="text-xs text-gray-600 font-medium">People</p>
                  <p className="text-2xl font-bold">481</p>
                </motion.div>
                <div className="border-r border-gray-200"></div>
                <motion.div className="text-center flex-1" whileHover={{ scale: 1.1 }}>
                  <p className="text-xs text-gray-600 font-medium">Total</p>
                  <p className="text-xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">$50,000</p>
                </motion.div>
              </div>
              
              {/* Mini chart */}
              <svg className="w-full h-12" viewBox="0 0 200 60" preserveAspectRatio="none">
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

        {/* Bottom Row - Instant Payments & Privacy */}
        <motion.div 
          className="grid md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div 
            className="rounded-3xl border-2 border-gray-200 p-6 md:p-8 bg-white/50 backdrop-blur-sm hover:border-gray-300 hover:shadow-xl transition-all duration-300"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="inline-block px-3 py-1 bg-gradient-to-r from-green-100 to-green-50 rounded-full text-xs font-bold text-green-700 mb-3 border border-green-200">SUI BLOCKCHAIN</div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">Instant Payments</h3>
            <div className="space-y-3">
              {[
                '97% revenue share—paid instantly in SUI tokens.',
                'No chargebacks, no payment processor fees.',
                '3-5 second finality. Fans subscribe, you earn immediately.'
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  className="flex gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <motion.div 
                    className="w-5 h-5 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
                    whileHover={{ scale: 1.2, rotate: 360 }}
                  >
                    ✓
                  </motion.div>
                  <p className="text-gray-700 font-medium text-sm md:text-base">{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="rounded-3xl border-2 border-gray-200 p-6 md:p-8 bg-white/50 backdrop-blur-sm hover:border-gray-300 hover:shadow-xl transition-all duration-300"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="inline-block px-3 py-1 bg-gradient-to-r from-pink-100 to-pink-50 rounded-full text-xs font-bold text-pink-700 mb-3 border border-pink-200">ZKLOGIN + SEAL</div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">Privacy-First Security</h3>
            <p className="text-gray-700 font-medium leading-relaxed text-sm md:text-base">
              <span className="font-bold text-gray-900">zkLogin with Google</span>—no wallet setup, no seed phrases. Premium content encrypted with <span className="font-bold text-gray-900">Mysten Seal</span>, decrypted only by NFT holders. Privacy meets security.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
