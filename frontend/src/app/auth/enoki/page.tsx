'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useConnectWallet, useWallets } from '@mysten/dapp-kit';
import { isEnokiWallet, type EnokiWallet } from '@mysten/enoki';

function EnokiConnectContent() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get('next') || '/dashboard';
  const { mutateAsync: connect } = useConnectWallet();
  const wallets = useWallets();
  const enokiWallet = useMemo(() => wallets.filter(isEnokiWallet)[0] as EnokiWallet | undefined, [wallets]);
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const doConnect = useCallback(async () => {
    if (!enokiWallet) {
      setError('Enoki zkLogin wallet not available. Please refresh after installing/activating.');
      return;
    }
    try {
      setConnecting(true);
      await connect({ wallet: enokiWallet });
      router.replace(next);
    } catch (e: any) {
      setError(e?.message || 'Failed to connect zkLogin wallet');
    } finally {
      setConnecting(false);
    }
  }, [connect, enokiWallet, next, router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-xl p-6 text-center">
        <h1 className="text-xl font-bold text-black mb-2">Connect zkLogin Wallet</h1>
        <p className="text-sm text-gray-600 mb-4">You&apos;ll be redirected to Google on this fixed page to satisfy redirect URI requirements.</p>
        <button
          onClick={doConnect}
          disabled={connecting}
          className="w-full py-3 rounded-lg bg-black text-white hover:bg-gray-800 disabled:opacity-60"
        >
          {connecting ? 'Connecting…' : 'Connect with Google'}
        </button>
        {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
        <button onClick={() => router.back()} className="mt-4 text-sm text-gray-600 hover:text-black">Cancel</button>
      </div>
    </div>
  );
}

export default function EnokiConnectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    }>
      <EnokiConnectContent />
    </Suspense>
  );
}
