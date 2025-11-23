"use client";

import React from 'react';
import Link from 'next/link';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useCreatorProfile } from '@/hooks/contracts/useCreatorProfile';
import { useCreatorContent } from '@/hooks/contracts/useCreatorContent';
import { FileText, Plus, Image as ImageIcon, Video, Music, File, Lock, Eye, Heart, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const contentTypeIcons: Record<number, React.ReactNode> = {
  0: <FileText className="w-5 h-5" />,
  1: <ImageIcon className="w-5 h-5" />,
  2: <Video className="w-5 h-5" />,
  3: <Music className="w-5 h-5" />,
  4: <File className="w-5 h-5" />,
};

const contentTypeLabels: Record<number, string> = {
  0: 'Text',
  1: 'Image',
  2: 'Video',
  3: 'Audio',
  4: 'File',
};

const tierLabels: Record<number, string> = {
  0: 'Public (Free)',
  1: 'Bronze Tier',
  2: 'Silver Tier',
  3: 'Gold Tier',
};

export default function CreatorContentPage() {
  const account = useCurrentAccount();
  const { profile, hasProfile } = useCreatorProfile(account?.address);
  const { posts, isLoading, error, postCount } = useCreatorContent(profile?.contentRegistryId);

  if (!account) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-black mb-2">Sign in to view your content</h2>
            <p className="text-gray-600">Connect your wallet to see all your posted content.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!hasProfile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-black mb-2">Create your profile first</h2>
            <p className="text-gray-600 mb-6">You need to create a creator profile before posting content.</p>
            <Link href="/dashboard/setup">
              <Button className="bg-black hover:bg-gray-800 text-white">
                Create Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-black">Your Content</h1>
            <p className="text-gray-600 mt-2">Manage and view all your posted content</p>
          </div>
          <Link href="/dashboard/content/new">
            <Button className="bg-black hover:bg-gray-800 text-white flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Post Content
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Posts</span>
              <FileText className="w-5 h-5 text-gumroad-pink" />
            </div>
            <div className="text-3xl font-bold text-black">{postCount}</div>
            <div className="text-sm text-gray-500 mt-1">Stored on Walrus</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Views</span>
              <Eye className="w-5 h-5 text-gumroad-pink" />
            </div>
            <div className="text-3xl font-bold text-black">
              {posts.reduce((sum, p) => sum + (parseInt(String(p.fields?.views || 0)) || 0), 0)}
            </div>
            <div className="text-sm text-gray-500 mt-1">Across all posts</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Likes</span>
              <Heart className="w-5 h-5 text-gumroad-pink" />
            </div>
            <div className="text-3xl font-bold text-black">
              {posts.reduce((sum, p) => sum + (parseInt(String(p.fields?.likes || 0)) || 0), 0)}
            </div>
            <div className="text-sm text-gray-500 mt-1">Community engagement</div>
          </div>
        </div>

        {/* Content List */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {isLoading && (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
              <p className="text-gray-600 mt-4">Loading your content...</p>
            </div>
          )}

          {error && (
            <div className="p-6 bg-red-50 border-b border-red-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-800">Error loading content</p>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {!isLoading && !error && postCount === 0 && (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-black mb-2">No content yet</h3>
              <p className="text-gray-600 mb-6">Start creating content to engage with your subscribers</p>
              <Link href="/dashboard/content/new">
                <Button className="bg-black hover:bg-gray-800 text-white">
                  Create Your First Post
                </Button>
              </Link>
            </div>
          )}

          {!isLoading && !error && postCount > 0 && (
            <div className="divide-y divide-gray-200">
              {posts.map((post) => (
                <div key={post.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Title & Type */}
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gumroad-pink/10 rounded-lg flex items-center justify-center text-gumroad-pink">
                          {contentTypeIcons[post.fields?.content_type || 0]}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-black">{post.fields?.title || 'Untitled'}</h3>
                          <p className="text-sm text-gray-500">
                            {contentTypeLabels[post.fields?.content_type || 0]}
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      {post.fields?.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.fields.description}</p>
                      )}

                      {/* Metadata */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        {/* Access Tier */}
                        <div className="flex items-center gap-1">
                          <Lock className="w-4 h-4" />
                          <span>{tierLabels[post.fields?.required_tier || 0]}</span>
                        </div>

                        {/* Views */}
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{parseInt(String(post.fields?.views || 0)) || 0} views</span>
                        </div>

                        {/* Likes */}
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{parseInt(String(post.fields?.likes || 0)) || 0} likes</span>
                        </div>

                        {/* Created Date */}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(parseInt(String(post.fields?.created_at || 0))).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Post ID */}
                      <div className="mt-3 p-2 bg-gray-100 rounded text-xs font-mono text-gray-600 break-all">
                        {post.id}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium">
                        View
                      </button>
                      <button className="px-4 py-2 border border-gray-200 text-black rounded-lg hover:bg-gray-50 transition text-sm font-medium">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
