"use client";

import React, { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { useCreatorProfile } from '@/hooks/contracts/useCreatorProfile';
import { useCreatorContent } from '@/hooks/contracts/useCreatorContent';
import { useSubscriptions } from '@/hooks/contracts/useSubscriptions';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { DecryptedContentCard } from '@/components/content/DecryptedContentCard';
import { Lock, Sparkles, User, Shield } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function CreatorContentInner() {
  const params = useParams();
  const creatorAddress = params.address as string;
  const account = useCurrentAccount();
  
  console.log('📱 [CreatorContentPage] Rendering page');
  console.log('👤 [CreatorContentPage] Creator address:', creatorAddress);
  console.log('🔑 [CreatorContentPage] Current account:', account?.address);
  
  const { profile, isLoading: profileLoading } = useCreatorProfile(creatorAddress);
  const { posts, isLoading: postsLoading } = useCreatorContent(profile?.contentRegistryId, creatorAddress);
  const { subscriptions } = useSubscriptions(account?.address);
  
  console.log('📊 [CreatorContentPage] Profile:', profile);
  console.log('📄 [CreatorContentPage] Posts count:', posts.length);
  console.log('🎫 [CreatorContentPage] Subscriptions count:', subscriptions.length);
  
  // Find subscription for this creator (case-insensitive)
  const subscription = subscriptions.find(
    (sub) => sub.creator.toLowerCase() === creatorAddress.toLowerCase()
  );
  console.log('🎫 [CreatorContentPage] Active subscription:', subscription);
  
  if (!account) {
    console.log('⚠️ [CreatorContentPage] No account connected');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Connect Wallet</h2>
          <p className="text-gray-600 mb-6">
            Connect your wallet to view creator content
          </p>
          <Button className="bg-black hover:bg-gray-800 text-white">
            Connect Wallet
          </Button>
        </div>
      </div>
    );
  }
  
  if (profileLoading || postsLoading) {
    console.log('⏳ [CreatorContentPage] Loading...');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading creator content...</p>
        </div>
      </div>
    );
  }
  
  // Filter posts by tier
  // If user has subscription, show posts at or below their tier
  // If no subscription, only show public posts (tier 0)
  const userTier = subscription?.tier_level ?? 0;
  
  const accessiblePosts = posts.filter(post => 
    post.fields.required_tier <= userTier
  );
  
  const lockedPosts = posts.filter(post => 
    post.fields.required_tier > userTier
  );
  
  console.log('✅ [CreatorContentPage] Accessible posts:', accessiblePosts.length);
  console.log('🔒 [CreatorContentPage] Locked posts:', lockedPosts.length);
  
  const tierNames = ['Public', 'Bronze', 'Silver', 'Gold'];
  const tierColors = ['bg-gray-100 text-gray-800', 'bg-orange-100 text-orange-800', 'bg-gray-200 text-gray-800', 'bg-yellow-100 text-yellow-800'];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-gumroad-pink to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-black">
                {profile?.displayName || 'Creator Content'}
              </h1>
              <p className="text-gray-600">
                {profile?.bio || `Content from ${creatorAddress.slice(0, 8)}...`}
              </p>
            </div>
          </div>
          
          {/* Subscription Status */}
          {subscription ? (
            <div className="bg-white border-2 border-gray-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gumroad-pink" />
                <div>
                  <p className="font-semibold text-black">Your Subscription</p>
                  <p className="text-sm text-gray-600">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${tierColors[subscription.tier_level]}`}>
                      {tierNames[subscription.tier_level]} Tier
                    </span>
                    {' • '}
                    {accessiblePosts.length} posts accessible
                  </p>
                </div>
              </div>
              <Link href="/subscribers">
                <Button variant="outline" size="sm">
                  Manage Subscriptions
                </Button>
              </Link>
            </div>
          ) : (
            <div className="bg-white border-2 border-gumroad-pink rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-gumroad-pink" />
                <div>
                  <p className="font-semibold text-black">No Subscription</p>
                  <p className="text-sm text-gray-600">
                    Subscribe to unlock exclusive content • Viewing {accessiblePosts.length} public posts
                  </p>
                </div>
              </div>
              <Link href={`/creators/${creatorAddress}`}>
                <Button className="bg-black hover:bg-gray-800 text-white" size="sm">
                  Subscribe Now
                </Button>
              </Link>
            </div>
          )}
        </div>
        
        {/* Accessible Content */}
        {accessiblePosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-6">
              Your Content ({accessiblePosts.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accessiblePosts.map(post => (
                <DecryptedContentCard
                  key={post.id}
                  post={post}
                  subscriptionNftId={subscription?.id}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Locked Content */}
        {lockedPosts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
              <Lock className="w-6 h-6 text-gray-400" />
              Locked Content ({lockedPosts.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lockedPosts.map(post => (
                <div 
                  key={post.id}
                  className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden opacity-60"
                >
                  <div className="relative aspect-square bg-gray-100">
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 backdrop-blur-sm bg-black/10">
                      <Lock className="w-12 h-12 text-gray-400 mb-3" />
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Requires {tierNames[post.fields.required_tier]} Tier
                      </p>
                      <Link href={`/creators/${creatorAddress}`}>
                        <Button size="sm" className="bg-gumroad-pink hover:bg-gumroad-pink/90 text-white">
                          Upgrade Subscription
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-black text-lg mb-1">{post.fields.title}</h3>
                    <p className="text-sm text-gray-500">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${tierColors[post.fields.required_tier]}`}>
                        {tierNames[post.fields.required_tier]} Tier Required
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-16">
            <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-black mb-2">No Content Yet</h3>
            <p className="text-gray-600">
              This creator hasn&apos;t published any content yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CreatorContentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <CreatorContentInner />
    </Suspense>
  );
}
