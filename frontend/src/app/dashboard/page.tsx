"use client";

import Link from 'next/link';
import { useCurrentAccount, useSuiClientQuery, useConnectWallet, useWallets } from '@mysten/dapp-kit';
import { BarChart3, FileText, Settings, TrendingUp, Users, DollarSign, Wallet, CheckCircle2, Sparkles, ExternalLink, User } from 'lucide-react';
import { startZkLogin } from '@/lib/enoki';
import { useCreatorProfile } from '@/hooks/contracts/useCreatorProfile';
import { useCreatorTiers } from '@/hooks/contracts/useCreatorTiers';
import { useCreatorContent } from '@/hooks/contracts/useCreatorContent';
import { isEnokiWallet, type EnokiWallet } from '@mysten/enoki';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const account = useCurrentAccount();
  const { mutateAsync: connect } = useConnectWallet();
  const enokiWallets = useWallets().filter(isEnokiWallet) as EnokiWallet[];
  const { profile, hasProfile, isLoading: profileLoading } = useCreatorProfile(account?.address);
  const { tiers, subscriptionObjectId } = useCreatorTiers(account?.address);
  const { postCount, posts } = useCreatorContent(profile?.contentRegistryId);

  const connectEnoki = async () => {
    const wallet = enokiWallets.find((w) => w.provider === 'google');
    if (wallet) {
      await connect({ wallet });
    } else {
      startZkLogin('google');
    }
  };

  // Fetch subscription object to get real stats
  const { data: subData } = useSuiClientQuery(
    'getObject',
    {
      id: subscriptionObjectId!,
      options: { showContent: true },
    },
    {
      enabled: !!subscriptionObjectId,
    }
  );

  const subFields = (subData as any)?.data?.content?.fields;
  const activeSubscribers = parseInt(subFields?.active_subscriber_count || '0');
  const totalRevenueMist = BigInt(subFields?.total_revenue_mist || '0');
  const totalRevenueSui = Number(totalRevenueMist) / 1_000_000_000;
  
  // Calculate total views and likes from posts
  const totalViews = posts.reduce((sum, p) => sum + (parseInt(String(p.fields?.views || 0)) || 0), 0);
  const totalLikes = posts.reduce((sum, p) => sum + (parseInt(String(p.fields?.likes || 0)) || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-black">Creator Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your NFT subscriptions, content, and earnings on Sui.</p>
          </div>
          {hasProfile && account?.address && (
            <Link href={`/${account.address}`}>
              <Button variant="outline" className="gap-2">
                <User className="w-4 h-4" />
                View Public Profile
                <ExternalLink className="w-3 h-3" />
              </Button>
            </Link>
          )}
        </div>

        {!account && (
          <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8 text-center">
            <Wallet className="w-16 h-16 text-gumroad-pink mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-black mb-2">Connect to get started</h2>
            <p className="text-gray-600 mb-6">Sign in with zkLogin (Google) or connect your Sui wallet to access creator tools.</p>
            <button
              onClick={connectEnoki}
              className="bg-gradient-to-r from-black to-gray-900 text-white px-8 py-3 rounded-full hover:shadow-lg transition font-semibold"
            >
              Connect with zkLogin
            </button>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Sales</span>
              <DollarSign className="w-5 h-5 text-gumroad-pink" />
            </div>
            <div className="text-3xl font-bold text-black">{totalRevenueSui.toFixed(2)} SUI</div>
            <div className="text-sm text-gray-500 mt-1">97% revenue share</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">NFT Subscribers</span>
              <Users className="w-5 h-5 text-gumroad-pink" />
            </div>
            <div className="text-3xl font-bold text-black">{activeSubscribers}</div>
            <div className="text-sm text-gray-500 mt-1">Active memberships</div>
          </div>

          <Link href="/dashboard/content" className="group">
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition cursor-pointer h-full">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm font-medium">Content Posts</span>
                <FileText className="w-5 h-5 text-gumroad-pink" />
              </div>
              <div className="text-3xl font-bold text-black">{postCount}</div>
              <div className="text-sm text-gray-500 mt-1">Stored on Walrus</div>
            </div>
          </Link>

          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Engagement</span>
              <TrendingUp className="w-5 h-5 text-gumroad-pink" />
            </div>
            <div className="text-3xl font-bold text-black">{totalViews + totalLikes}</div>
            <div className="text-sm text-gray-500 mt-1">{totalViews} views, {totalLikes} likes</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-black mb-4">
            {hasProfile ? 'Manage Your Creator Hub' : 'Get Started'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/dashboard/setup" className="group">
              <div className={`bg-white border-2 rounded-xl p-6 hover:shadow-lg transition ${
                hasProfile ? 'border-green-200 bg-green-50' : 'border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition ${
                    hasProfile ? 'bg-green-500' : 'bg-gumroad-pink'
                  }`}>
                    {hasProfile ? <CheckCircle2 className="w-6 h-6 text-white" /> : <Settings className="w-6 h-6 text-black" />}
                  </div>
                  {hasProfile && (
                    <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                      COMPLETED
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Creator Profile</h3>
                <p className="text-gray-600 mb-4">
                  {hasProfile 
                    ? `Profile created as "${profile?.displayName}". View your onchain identity.`
                    : 'Set up your onchain profile with Walrus-stored avatar and banner.'}
                </p>
                <span className="text-black font-medium group-hover:text-gumroad-pink transition">
                  {hasProfile ? 'View profile →' : 'Create profile →'}
                </span>
              </div>
            </Link>
            
            <Link href="/dashboard/landing" className="group">
              <div className={`bg-white border-2 rounded-xl p-6 hover:shadow-lg transition ${
                hasProfile ? 'border-gray-200' : 'border-gray-200 opacity-60 pointer-events-none'
              }`}>
                <div className="w-12 h-12 bg-gumroad-pink rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <Sparkles className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Landing Page</h3>
                <p className="text-gray-600 mb-4">
                  {hasProfile
                    ? 'Customize your public creator page with sections, themes, and content.'
                    : 'Create your profile first to unlock landing page customization.'}
                </p>
                <span className="text-black font-medium group-hover:text-gumroad-pink transition">
                  {hasProfile ? 'Customize page →' : 'Locked - Create profile first'}
                </span>
              </div>
            </Link>

            <Link href="/dashboard/tiers" className="group">
              <div className={`bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition ${
                hasProfile ? '' : 'opacity-60 pointer-events-none'
              }`}>
                <div className="w-12 h-12 bg-gumroad-pink rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <DollarSign className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">NFT Tiers</h3>
                <p className="text-gray-600 mb-4">
                  {hasProfile
                    ? 'Configure Bronze/Silver/Gold subscription NFTs with pricing in SUI.'
                    : 'Create your profile first to set up membership tiers.'}
                </p>
                <span className="text-black font-medium group-hover:text-gumroad-pink transition">
                  {hasProfile ? 'Set up tiers →' : 'Locked'}
                </span>
              </div>
            </Link>
          </div>
        </div>
        
        {/* Secondary Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-black mb-4">Content & Engagement</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/dashboard/content" className="group">
              <div className={`bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition ${
                hasProfile ? '' : 'opacity-60 pointer-events-none'
              }`}>
                <div className="w-12 h-12 bg-gumroad-pink rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <FileText className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Your Content</h3>
                <p className="text-gray-600 mb-4">
                  {hasProfile
                    ? `View and manage your ${postCount} posted content on Walrus.`
                    : 'Create your profile first to start posting content.'}
                </p>
                <span className="text-black font-medium group-hover:text-gumroad-pink transition">
                  {hasProfile ? 'View content →' : 'Locked'}
                </span>
              </div>
            </Link>
            
            <div className="bg-white border border-gray-200 rounded-xl p-6 opacity-60">
              <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-500 mb-2">Analytics</h3>
              <p className="text-gray-400 mb-4">Track your subscribers, revenue, and engagement metrics.</p>
              <span className="text-gray-400 font-medium">
                Coming soon
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-black">Recent Activity</h2>
            <Link href="/dashboard/analytics" className="text-black hover:text-gumroad-pink transition font-medium">
              View all →
            </Link>
          </div>
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No activity yet. Start by creating your first product!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
