"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Search, Users, TrendingUp } from 'lucide-react';

export default function CreatorsDiscoveryPage() {
  const [address, setAddress] = useState('');
  const [subsId, setSubsId] = useState('');

  // Mock featured creators data
  const featuredCreators = [
    { name: 'Digital Artist', address: '0x123...', subscribers: 1234, revenue: '$12,345' },
    { name: 'Music Producer', address: '0x456...', subscribers: 856, revenue: '$8,567' },
    { name: 'Course Creator', address: '0x789...', subscribers: 2341, revenue: '$23,410' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Discover Creators</h1>
          <p className="text-gray-600">Find and support amazing creators on the platform</p>
        </div>

        {/* Search Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-black mb-6">Find a creator</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">Creator Address</label>
                <Input 
                  placeholder="0x..." 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">Subscriptions Object ID (optional)</label>
                <Input 
                  placeholder="0x..." 
                  value={subsId} 
                  onChange={(e) => setSubsId(e.target.value)} 
                />
              </div>
            </div>

            <Button asChild className="w-full md:w-auto" disabled={!address}>
              <Link href={`/creators/${address}${subsId ? `?subs=${encodeURIComponent(subsId)}` : ''}`}>
                <Search className="w-4 h-4 mr-2" />
                View Creator
              </Link>
            </Button>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                💡 <strong>Tip:</strong> After creators configure tiers, copy the resulting CreatorSubscriptions object ID here for quick purchase.
              </p>
            </div>
          </div>
        </div>

        {/* Featured Creators */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-black mb-6">Featured Creators</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCreators.map((creator, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition">
                <div className="w-16 h-16 bg-gradient-to-br from-gumroad-pink to-gumroad-pink-light rounded-full mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-black">{creator.name[0]}</span>
                </div>
                <h3 className="text-xl font-bold text-black mb-2">{creator.name}</h3>
                <p className="text-sm text-gray-500 font-mono mb-4">{creator.address}</p>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{creator.subscribers}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>{creator.revenue}</span>
                  </div>
                </div>

                <Button asChild variant="outline" className="w-full">
                  <Link href={`/creators/${creator.address}`}>View Profile</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-2xl font-bold text-black mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Art & Design', 'Music & Audio', 'Education', 'Gaming', 'Writing', 'Photography', 'Video', 'Software'].map((category) => (
              <button
                key={category}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-gumroad-pink transition text-left"
              >
                <span className="font-medium text-black">{category}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
