"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { ConnectButton, useConnectWallet, useWallets, useDisconnectWallet } from "@mysten/dapp-kit";
import { isEnokiWallet, type EnokiWallet } from "@mysten/enoki";
import { startZkLogin } from "@/lib/enoki";
import { useUnifiedAccount } from "@/hooks/useUnifiedAccount";
import AddressName from "@/components/web3/AddressName";
import { Star, Copy as CopyIcon, Check as CheckIcon } from "lucide-react";
import Image from "next/image";

export default function NavbarApp() {
  const router = useRouter();
  const { accounts, selected, selectedType, choose, disconnectZkLogin } = useUnifiedAccount();
  const { mutateAsync: connect } = useConnectWallet();
  const allWallets = useWallets();
  const enokiWallets = allWallets.filter(isEnokiWallet) as EnokiWallet[];
  const disconnectWalletMutation = useDisconnectWallet();
  const [copied, setCopied] = React.useState<string | null>(null);

  const connectEnoki = () => {
    const wallet = enokiWallets.find((w) => w.provider === 'google');
    if (wallet) {
      connect({ wallet });
    } else {
      // Fallback to legacy flow if wallets are not registered yet
      startZkLogin('google');
    }
  };

  const disconnectWallet = async () => {
    try {
      // First, try official dapp-kit disconnect
      await disconnectWalletMutation.mutateAsync();

      // Extra safety: directly invoke wallet-standard disconnect on the actual wallet instance
      const wallet = allWallets.find((w) => (w.accounts || []).some((a) => a.address === selected?.address));
      const directDisconnect = (wallet as any)?.features?.['standard:disconnect']?.disconnect as undefined | (() => Promise<void> | void);
      if (directDisconnect) {
        await directDisconnect();
      }

      // If wallet was selected but zklogin exists, switch selection to zklogin
      const hasZk = accounts.some((a) => a.type === 'zklogin');
      if (selectedType === 'wallet' && hasZk) choose('zklogin');
    } catch (e) {
      console.error('[Navbar] Wallet disconnect failed:', e);
    }
  };

  const copyAddress = async (address: string, e: React.MouseEvent) => {
    try {
      e.stopPropagation();
      e.preventDefault();
      await navigator.clipboard.writeText(address);
      setCopied(address);
      setTimeout(() => setCopied(null), 1500);
    } catch (err) {
      console.error('[Navbar] Failed to copy address:', err);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-8 h-8 bg-gumroad-pink rounded-full flex items-center justify-center p-0.5">
              <Image src="/logo.png" alt="Auriya" width={35} height={35} />
            </div>
            <span className="text-xl font-bold text-black">Auriya</span>
            {/* <div className="flex items-center gap-1 ml-2 px-2 py-1 bg-black rounded-full">
              <Star className="w-3 h-3 text-white fill-white" />
              <span className="text-xs text-white font-medium">7.6K</span>
            </div> */}
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/discover" className="text-black hover:text-gumroad-pink transition font-medium">
              Discover
            </Link>
            <Link href="/creators" className="text-black hover:text-gumroad-pink transition font-medium">
              Creators
            </Link>
            <Link href="/dashboard" className="text-black hover:text-gumroad-pink transition font-medium">
              Dashboard
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {!selected ? (
              <>
                <button
                  onClick={connectEnoki}
                  className="px-4 py-2 text-black bg-gumroad-pink hover:bg-gumroad-pink/80 rounded-lg transition font-medium"
                >
                  Log in
                </button>
                <ConnectButton />
              </>
            ) : (
              <div className="relative group">
                <button className="px-4 py-2 bg-black text-white hover:bg-gray-800 rounded-lg transition font-medium flex items-center gap-2">
                  <AddressName address={selected.address} />
                  <span
                    title="Copy address"
                    onClick={(e) => copyAddress(selected.address, e)}
                    className="inline-flex items-center justify-center rounded hover:bg-white/10 p-1"
                  >
                    {copied === selected.address ? (
                      <CheckIcon className="w-4 h-4" />
                    ) : (
                      <CopyIcon className="w-4 h-4" />
                    )}
                  </span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    {accounts.map((a) => (
                      <button
                        key={`${a.type}-${a.address}`}
                        onClick={() => choose(a.type)}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition ${
                          selectedType === a.type ? 'bg-gray-100' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500 uppercase tracking-wide">{a.label}</div>
                          {selectedType === a.type && (
                            <svg className="w-4 h-4 text-gumroad-pink" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <div className="font-mono text-sm text-black"><AddressName address={a.address} /></div>
                          <button
                            title="Copy address"
                            onClick={(e) => copyAddress(a.address, e)}
                            className="p-1 rounded hover:bg-gray-100"
                          >
                            {copied === a.address ? (
                              <CheckIcon className="w-4 h-4 text-gumroad-pink" />
                            ) : (
                              <CopyIcon className="w-4 h-4 text-gray-600" />
                            )}
                          </button>
                        </div>
                      </button>
                    ))}
                    
                    <div className="my-2 border-t border-gray-200" />
                    
                    {!accounts.find(a => a.type === 'wallet') && (
                      <button
                        onClick={() => {
                          const btn = document.querySelector('[data-dapp-kit-connect-button]') as HTMLButtonElement;
                          btn?.click();
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm transition"
                      >
                        + Connect Wallet
                      </button>
                    )}
                    {!accounts.find(a => a.type === 'zklogin') && (
                      <button
                        onClick={connectEnoki}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm transition"
                      >
                        + Connect zkLogin
                      </button>
                    )}

                    {/* show suins name if user wallet have it on testnet  */}
                  
                    <div className="my-2 border-t border-gray-200" />
                    
                    {accounts.find(a => a.type === 'wallet') && (
                      <button
                        onClick={disconnectWallet}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-sm transition"
                      >
                        Disconnect Wallet
                      </button>
                    )}
                    {accounts.find(a => a.type === 'zklogin') && (
                      <button
                        onClick={disconnectZkLogin}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-sm transition"
                      >
                        Logout zkLogin
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

