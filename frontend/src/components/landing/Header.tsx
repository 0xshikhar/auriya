'use client'

import Link from 'next/link'
import { Github } from 'lucide-react'
import { motion } from 'framer-motion'
import { startZkLogin } from '@/lib/enoki'

export default function Header() {
  return (
    <motion.header 
      className="border-b border-gray-200/50 bg-white/80 backdrop-blur-xl sticky top-0 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <Link href="/">
          <motion.div 
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-2xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">Auriya</div>
            <motion.a
              href="https://github.com/0xshikhar/auriya"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-300 rounded-full px-3 py-1 text-xs flex items-center gap-1 bg-gray-50/50"
              whileHover={{ scale: 1.05, backgroundColor: '#f3f4f6' }}
              onClick={(e) => e.stopPropagation()}
            >
              <Github size={14} />
              <span className="text-gray-700 font-semibold">Star</span>
              <span>★</span>
            </motion.a>
          </motion.div>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <motion.div whileHover={{ y: -2 }}>
            <Link href="/creators" className="text-gray-600 hover:text-black transition font-medium">
              Discover
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -2 }}>
            <Link href="/pricing" className="text-gray-600 hover:text-black transition font-medium">
              Pricing
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -2 }}>
            <a href="https://github.com/0xshikhar/auriya#readme" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black transition font-medium">
              Docs
            </a>
          </motion.div>
        </nav>

        <div className="flex items-center gap-4">
          <motion.button 
            onClick={() => startZkLogin('google')}
            className="text-gray-600 hover:text-black transition text-sm font-medium"
            whileHover={{ scale: 1.05 }}
          >
            Log in
          </motion.button>
          <Link href="/dashboard/setup">
            <motion.button 
              className="bg-gradient-to-r from-black to-gray-900 text-white px-6 py-2 rounded-full hover:shadow-lg transition font-semibold text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Launch your page
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.header>
  )
}
