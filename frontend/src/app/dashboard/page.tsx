"use client";

import Link from 'next/link';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { BarChart3, FileText, Settings, TrendingUp, Users, DollarSign, Wallet } from 'lucide-react';
import { startZkLogin } from '@/lib/enoki';

export default function DashboardPage() {
  const account = useCurrentAccount();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black">Creator Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your NFT subscriptions, content, and earnings on Sui.</p>
        </div>

        {!account && (
          <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8 text-center">
            <Wallet className="w-16 h-16 text-gumroad-pink mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-black mb-2">Connect to get started</h2>
            <p className="text-gray-600 mb-6">Sign in with zkLogin (Google) or connect your Sui wallet to access creator tools.</p>
            <button
              onClick={() => startZkLogin('google')}
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
            <div className="text-3xl font-bold text-black">0 SUI</div>
            <div className="text-sm text-gray-500 mt-1">95% revenue share</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">NFT Subscribers</span>
              <Users className="w-5 h-5 text-gumroad-pink" />
            </div>
            <div className="text-3xl font-bold text-black">0</div>
            <div className="text-sm text-gray-500 mt-1">Active memberships</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Content Posts</span>
              <FileText className="w-5 h-5 text-gumroad-pink" />
            </div>
            <div className="text-3xl font-bold text-black">0</div>
            <div className="text-sm text-gray-500 mt-1">Stored on Walrus</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Profile Views</span>
              <TrendingUp className="w-5 h-5 text-gumroad-pink" />
            </div>
            <div className="text-3xl font-bold text-black">0</div>
            <div className="text-sm text-gray-500 mt-1">This month</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-black mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/dashboard/setup" className="group">
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition">
                <div className="w-12 h-12 bg-gumroad-pink rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <Settings className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Creator Profile</h3>
                <p className="text-gray-600 mb-4">Set up your onchain profile with Walrus-stored avatar and banner.</p>
                <span className="text-black font-medium group-hover:text-gumroad-pink transition">
                  Create profile →
                </span>
              </div>
            </Link>

            <Link href="/dashboard/tiers" className="group">
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition">
                <div className="w-12 h-12 bg-gumroad-pink rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <DollarSign className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">NFT Tiers</h3>
                <p className="text-gray-600 mb-4">Configure Bronze/Silver/Gold subscription NFTs with pricing in SUI.</p>
                <span className="text-black font-medium group-hover:text-gumroad-pink transition">
                  Set up tiers →
                </span>
              </div>
            </Link>

            <Link href="/dashboard/content/new" className="group">
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition">
                <div className="w-12 h-12 bg-gumroad-pink rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <FileText className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Post Content</h3>
                <p className="text-gray-600 mb-4">Upload to Walrus, set tier access, publish gated content.</p>
                <span className="text-black font-medium group-hover:text-gumroad-pink transition">
                  Create post →
                </span>
              </div>
            </Link>
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
