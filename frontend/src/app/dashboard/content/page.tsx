"use client";

import React, { useEffect, useMemo, useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useSearchParams } from 'next/navigation';
import { useCreatorProfile } from '@/hooks/contracts/useCreatorProfile';
import { useCreatorContent } from '@/hooks/contracts/useCreatorContent';
import { DecryptedContentCard } from '@/components/content/DecryptedContentCard';
import { getWalrusUrl } from '@/lib/walrus';
import { FileText, Plus, Image as ImageIcon, Video, Music, File, Lock, Eye, Heart, Calendar, AlertCircle, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useLinkContentRegistry } from '@/hooks/contracts/useLinkContentRegistry';

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

function ContentPageInner() {
  const account = useCurrentAccount();
  const searchParams = useSearchParams();
  const { profile, hasProfile } = useCreatorProfile(account?.address);

  // Incoming registry from URL or localStorage
  const queryRegistry = searchParams?.get('registry') || undefined;
  const [manualRegistry, setManualRegistry] = useState<string>('');
  const [effectiveRegistry, setEffectiveRegistry] = useState<string | undefined>(undefined);

  // Compute effective registry: query -> profile -> localStorage
  useEffect(() => {
    const last = typeof window !== 'undefined' ? localStorage.getItem('auriya:lastRegistryId') || undefined : undefined;
    const next = queryRegistry || profile?.contentRegistryId || last;
    setEffectiveRegistry(next);
    if (!profile?.contentRegistryId && (queryRegistry || last)) {
      toast.message('Using registry from recent publish', {
        description: (queryRegistry || last) as string,
      });
    }
  }, [profile?.contentRegistryId, queryRegistry]);

  const { posts, isLoading, error, postCount } = useCreatorContent(effectiveRegistry);
  const { linkRegistry, isPending: linkingRegistry } = useLinkContentRegistry();

  console.log('🎨 [CreatorContentPage] Render', {
    address: account?.address,
    hasProfile,
    profileObjectId: profile?.objectId,
    contentRegistryId: profile?.contentRegistryId,
    effectiveRegistry,
    postCount,
    isLoading,
    error,
  });

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

          {/* Registry Resolver */}
        <div className="mb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
            <div className="text-sm text-yellow-900">
              <div className="font-semibold">Registry</div>
              <div className="break-all">
                {effectiveRegistry ? (
                  <>
                    <span className="font-mono text-xs">{effectiveRegistry}</span>
                    {!profile?.contentRegistryId && (
                      <span className="ml-2 text-yellow-700"> </span>
                    )}
                  </>
                ) : (
                  <span>No registry selected. Paste one below or create a post to auto-create.</span>
                )}
              </div>
            </div>

            <div className="flex-1 w-full md:w-auto md:flex md:items-center gap-2">
              <input
                placeholder="Paste registry id (0x...)"
                className="w-full md:w-[460px] px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                value={manualRegistry}
                onChange={(e) => setManualRegistry(e.target.value.trim())}
              />
              <Button
                className="bg-black text-white hover:bg-gray-800"
                onClick={() => {
                  if (!manualRegistry.startsWith('0x')) {
                    toast.error('Invalid registry id - must start with 0x');
                    return;
                  }
                  setEffectiveRegistry(manualRegistry);
                  try { 
                    localStorage.setItem('auriya:lastRegistryId', manualRegistry);
                    toast.success('Registry loaded! Fetching posts...');
                  } catch {}
                }}
              >
                Load
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Refresh
              </Button>
              {hasProfile && effectiveRegistry && !profile?.contentRegistryId && (
                <Button
                  disabled={linkingRegistry}
                  onClick={async () => {
                    try {
                      toast.info('Linking registry to profile...');
                      await linkRegistry(profile!.objectId, effectiveRegistry);
                      toast.success('Linked! Reloading...');
                      setTimeout(() => window.location.reload(), 800);
                    } catch (e: any) {
                      toast.error('Link failed', { description: e?.message || 'Unknown error' });
                    }
                  }}
                >
                  Link to Profile
                </Button>
              )}
              {effectiveRegistry && (
                <Link href={`https://testnet.suivision.xyz/object/${effectiveRegistry}`} target="_blank" className="text-sm underline ml-2">
                  View on explorer →
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Content List */}
        <div className="bg-gray-50 rounded-xl overflow-hidden">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {posts.map((post) => {
                  const walrusBlobId = post.fields?.walrus_blob_id || '';
                  const contentType = post.fields?.content_type || 0;
                  const isImage = contentType === 1;
                  const isVideo = contentType === 2;
                  const walrusUrl = walrusBlobId ? getWalrusUrl(walrusBlobId) : null;
                  const hasEncryption = !!post.fields?.encryption_metadata;

                return hasEncryption ? (
                  <DecryptedContentCard key={post.id} post={post} />
                ) : (
                  <div key={post.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Post Header - User Info */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-gumroad-pink to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {profile?.displayName?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-black">{profile?.displayName || 'Creator'}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(parseInt(String(post.fields?.created_at || 0))).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-full transition">
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>

                    {/* Post Media */}
                    <div className="relative bg-gray-100 aspect-square">
                      {walrusUrl && isImage ? (
                        <Image 
                          src={walrusUrl} 
                          alt={post.fields?.title || 'Post image'}
                          fill
                          className="object-cover"
                          unoptimized
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            if (e.currentTarget.parentElement) {
                              e.currentTarget.parentElement.innerHTML = `
                                <div class="w-full h-full flex items-center justify-center">
                                  <div class="text-center">
                                    <div class="w-16 h-16 bg-gumroad-pink/10 rounded-full flex items-center justify-center mx-auto mb-2">
                                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                                    </div>
                                    <p class="text-sm text-gray-500">Image unavailable</p>
                                  </div>
                                </div>
                              `;
                            }
                          }}
                        />
                      ) : walrusUrl && isVideo ? (
                        <video 
                          src={walrusUrl} 
                          className="w-full h-full object-cover"
                          controls
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center">
                                <div class="text-center">
                                  <div class="w-16 h-16 bg-gumroad-pink/10 rounded-full flex items-center justify-center mx-auto mb-2">
                                    ${contentTypeIcons[contentType]}
                                  </div>
                                  <p class="text-sm text-gray-500">Video unavailable</p>
                                </div>
                              </div>
                            `;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-gumroad-pink/10 rounded-full flex items-center justify-center mx-auto mb-2 text-gumroad-pink">
                              {contentTypeIcons[contentType]}
                            </div>
                            <p className="text-sm font-medium text-gray-700">{contentTypeLabels[contentType]}</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Access Tier Badge */}
                      <div className="absolute top-3 right-3">
                        <div className="bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          {tierLabels[post.fields?.required_tier || 0]}
                        </div>
                      </div>
                    </div>

                    {/* Post Actions & Stats */}
                    <div className="p-4">
                      {/* Action Buttons */}
                      <div className="flex items-center gap-4 mb-3">
                        <button className="hover:text-red-500 transition">
                          <Heart className="w-6 h-6" />
                        </button>
                        <button className="hover:text-blue-500 transition">
                          <Eye className="w-6 h-6" />
                        </button>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                        <span className="font-semibold">{parseInt(String(post.fields?.likes || 0)) || 0} likes</span>
                        <span>·</span>
                        <span>{parseInt(String(post.fields?.views || 0)) || 0} views</span>
                      </div>

                      {/* Title & Description */}
                      <div className="mb-3">
                        <h3 className="font-bold text-black mb-1">{post.fields?.title || 'Untitled'}</h3>
                        {post.fields?.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">{post.fields.description}</p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium">
                          View
                        </button>
                        <button className="flex-1 px-4 py-2 border border-gray-200 text-black rounded-lg hover:bg-gray-50 transition text-sm font-medium">
                          Edit
                        </button>
                      </div>

                      {/* Post ID (Collapsible) */}
                      <details className="mt-3">
                        <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">Post ID</summary>
                        <div className="mt-2 p-2 bg-gray-50 rounded text-xs font-mono text-gray-600 break-all">
                          {post.id}
                        </div>
                      </details>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CreatorContentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    }>
      <ContentPageInner />
    </Suspense>
  );
}
