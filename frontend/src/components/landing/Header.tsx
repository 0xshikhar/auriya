'use client'

import Link from 'next/link'
import { Github } from 'lucide-react'
import { motion } from 'framer-motion'
import { startZkLogin } from '@/lib/enoki'
import { useConnectWallet, useWallets } from '@mysten/dapp-kit'
import { isEnokiWallet, type EnokiWallet } from '@mysten/enoki'
import Image from 'next/image'

export default function Header() {
  const { mutateAsync: connect } = useConnectWallet();
  const enokiWallets = useWallets().filter(isEnokiWallet) as EnokiWallet[];
  const connectEnoki = async () => {
    const wallet = enokiWallets.find((w) => w.provider === 'google');
    if (wallet) {
      await connect({ wallet });
    } else {
      startZkLogin('google');
    }
  };
  return (
    <motion.header 
      className="border-b border-gray-200/50 bg-white/80 backdrop-blur-xl sticky top-0 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
        <Link href="/">
          <motion.div 
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 bg-gumroad-pink rounded-full flex items-center justify-center p-0.5">
                          <Image src="/logo.png" alt="Auriya" width={55} height={55} />
                        </div>
                        <span className="text-xl font-bold text-black">Auriya</span>
          </motion.div>
        </Link>

        <div className="flex items-center gap-4">
          <motion.button 
            onClick={connectEnoki}
            className="text-gray-600 hover:text-black transition text-sm font-bold "
            whileHover={{ scale: 1.05 }}
          >
            Log in
          </motion.button>
          <Link href="/dashboard/setup">
            <motion.button 
              className="bg-gumroad-pink text-black px-6 py-4 text-lg font-semibold rounded-full hover:shadow-lg transition font-semibold text-sm"
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
