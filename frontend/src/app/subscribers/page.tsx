"use client";

import React, { Suspense } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useSubscriptions, type SubscriptionData } from '@/hooks/contracts/useSubscriptions';
import { useCreatorProfile } from '@/hooks/contracts/useCreatorProfile';
import { getWalrusUrl } from '@/lib/walrus';
import { Lock, Sparkles, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function SubscriptionTile({ sub }: { sub: SubscriptionData }) {
  const { profile } = useCreatorProfile(sub.creator);

  const displayName = profile?.displayName || 'Creator';
  const avatarUrl = profile?.avatarWalrusId ? getWalrusUrl(profile.avatarWalrusId) : null;
  const tierNames = ['', 'Bronze', 'Silver', 'Gold'];
  const tierColors = ['', 'bg-orange-100 text-orange-800', 'bg-gray-200 text-gray-800', 'bg-yellow-100 text-yellow-800'];

  return (
    <div 
      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
    >
      {/* Creator Avatar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-gumroad-pink to-purple-500 flex items-center justify-center">
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} className="object-cover w-12 h-12" />
          ) : (
            <User className="w-6 h-6 text-white" />
          )}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-black">{displayName}</p>
          <p className="text-xs text-gray-500 font-mono">
            {sub.creator.slice(0, 8)}...{sub.creator.slice(-6)}
          </p>
        </div>
      </div>

      {/* Tier Badge */}
      <div className="mb-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${tierColors[sub.tier_level]}`}>
          {tierNames[sub.tier_level]} Tier
        </span>
      </div>

      {/* Subscription Details */}
      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex justify-between">
          <span>Status:</span>
          <span className="font-semibold text-green-600">Active</span>
        </div>
        {sub.expires_at > 0 && (
          <div className="flex justify-between">
            <span>Expires:</span>
            <span className="font-semibold">
              {new Date(sub.expires_at).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Link href={`/creators/${sub.creator}/content`} className="flex-1">
          <Button className="w-full bg-black hover:bg-gray-800 text-white">
            View Content
          </Button>
        </Link>
      </div>

      {/* Subscription ID */}
      <details className="mt-3">
        <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
          Subscription ID
        </summary>
        <div className="mt-2 p-2 bg-gray-50 rounded text-xs font-mono text-gray-600 break-all">
          {sub.id}
        </div>
      </details>
    </div>
  );
}

function SubscriberContentInner() {
  const account = useCurrentAccount();
  const { subscriptions, isLoading } = useSubscriptions(account?.address);
  
  console.log('📱 [SubscriberContent] Rendering page');
  console.log('👤 [SubscriberContent] Account:', account?.address);
  console.log('🎫 [SubscriberContent] Subscriptions:', subscriptions.length);
  
  if (!account) {
    console.log('⚠️ [SubscriberContent] No account connected');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Connect Wallet</h2>
          <p className="text-gray-600 mb-6">
            Connect your wallet to view your subscriptions and access exclusive content
          </p>
          <Button className="bg-black hover:bg-gray-800 text-white">
            Connect Wallet
          </Button>
        </div>
      </div>
    );
  }
  
  if (isLoading) {
    console.log('⏳ [SubscriberContent] Loading subscriptions...');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your subscriptions...</p>
        </div>
      </div>
    );
  }
  
  if (subscriptions.length === 0) {
    console.log('📭 [SubscriberContent] No subscriptions found');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <Sparkles className="w-16 h-16 text-gumroad-pink mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">No Subscriptions Yet</h2>
          <p className="text-gray-600 mb-6">
            Subscribe to creators to unlock their exclusive content stored securely on Walrus
          </p>
          <Link href="/creators">
            <Button className="bg-black hover:bg-gray-800 text-white">
              Discover Creators
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  console.log('✅ [SubscriberContent] Rendering subscriptions');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">My Subscriptions</h1>
          <p className="text-gray-600">
            Access exclusive content from {subscriptions.length} creator{subscriptions.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        {/* Subscriptions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions.map((sub) => (
            <SubscriptionTile key={sub.id} sub={sub} />
          ))}
        </div>
        
        {/* Info Box */}
        <div className="mt-12 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 mb-2">🔐 Secure Content Access</h3>
          <p className="text-sm text-blue-700">
            All content is encrypted with Mysten Seal and stored on Walrus. 
            Your subscription NFT grants you access to decrypt and view exclusive content from your favorite creators.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SubscriberContentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SubscriberContentInner />
    </Suspense>
  );
}
