"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import WalrusUploader from '@/components/walrus/WalrusUploader';
import { useCreatePost } from '@/hooks/contracts/useCreatePost';
import { useCreateContentRegistry } from '@/hooks/contracts/useCreateContentRegistry';
import { useLinkContentRegistry } from '@/hooks/contracts/useLinkContentRegistry';
import { useCreatorProfile } from '@/hooks/contracts/useCreatorProfile';
import { DEFAULT_CONTENT_REGISTRY_ID } from '@/lib/constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Image as ImageIcon, Video, Music, File, Lock, CheckCircle2, AlertCircle, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useCurrentAccount } from '@mysten/dapp-kit';

export default function NewContentPage() {
  const currentAccount = useCurrentAccount();
  const { profile } = useCreatorProfile(currentAccount?.address);
  
  const [registryId, setRegistryId] = useState<string>(DEFAULT_CONTENT_REGISTRY_ID);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentType, setContentType] = useState<0 | 1 | 2 | 3 | 4>(1);
  const [requiredTier, setRequiredTier] = useState<0 | 1 | 2 | 3>(0);
  const [blobId, setBlobId] = useState<string>('');
  const [txDigest, setTxDigest] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { createPost, isPending } = useCreatePost();
  const { createRegistry, isPending: creatingRegistry } = useCreateContentRegistry();
  const { linkRegistry, isPending: linkingRegistry } = useLinkContentRegistry();

  // Load from localStorage first (most recent registry)
  useEffect(() => {
    if (!registryId) {
      const last = typeof window !== 'undefined' ? localStorage.getItem('auriya:lastRegistryId') : null;
      if (last) {
        setRegistryId(last);
        toast.info('Loaded registry from last publish');
      }
    }
  }, [registryId]);

  // Load registry from profile if available
  useEffect(() => {
    if (profile?.contentRegistryId && !registryId) {
      setRegistryId(profile.contentRegistryId);
      toast.info('Loaded registry from your profile');
    }
  }, [profile?.contentRegistryId, registryId]);

  // Allow empty registryId (we will auto-create one on submit)
  const canSubmit = useMemo(() => !!blobId && !!title, [blobId, title]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setTxDigest(null);
    
    try {
      let targetRegistry = registryId.trim();
      let isNewRegistry = false;
      
      // Validate or create registry
      if (!targetRegistry) {
        toast.info('Creating content registry...');
        const result = await createRegistry();
        
        if (!result?.registryId) {
          throw new Error('Failed to create registry - no object ID returned');
        }
        
        targetRegistry = result.registryId;
        setRegistryId(targetRegistry);
        isNewRegistry = true;
        toast.success(`Registry created: ${targetRegistry.slice(0, 8)}...`);
        
        // Link registry to profile if available
        if (profile?.objectId && isNewRegistry) {
          try {
            toast.info('Linking registry to your profile...');
            await linkRegistry(profile.objectId, targetRegistry);
            toast.success('Registry linked to profile');
          } catch (linkError: any) {
            console.warn('Failed to link registry to profile:', linkError);
            // Non-fatal error, continue with post creation
          }
        }
        
        // Small delay to ensure registry is fully indexed
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      // Validate registry ID format
      if (!targetRegistry.startsWith('0x') || targetRegistry.length < 10) {
        throw new Error('Invalid registry ID format. Must be a valid Sui object ID.');
      }
      
      // If using an existing registry and profile not yet linked, link BEFORE publish
      if (profile?.objectId && !profile?.contentRegistryId && !isNewRegistry) {
        try {
          toast.info('Linking registry to your profile...');
          await linkRegistry(profile.objectId, targetRegistry);
          toast.success('Registry linked to profile');
        } catch (linkError: any) {
          console.warn('Pre-publish link failed; will continue', linkError);
        }
      }

      toast.info('Publishing post...');
      const res = await createPost({
        registryId: targetRegistry,
        title,
        description,
        contentType,
        walrusBlobId: blobId,
        requiredTier,
      });
      
      // @ts-ignore
      const digest = res?.digest || null;
      setTxDigest(digest);
      toast.success('Post published successfully!');

      // Persist the last used/created registry for the content page fallback
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('auriya:lastRegistryId', targetRegistry);
        }
      } catch {}

      // Auto-link registry to profile if not already linked (for existing registries too)
      if (profile?.objectId && !profile?.contentRegistryId && !isNewRegistry) {
        try {
          toast.info('Linking registry to your profile...');
          await linkRegistry(profile.objectId, targetRegistry);
          toast.success('Registry linked to profile!');
        } catch (linkError: any) {
          console.warn('Failed to link registry to profile:', linkError);
          toast.warning('Post created but registry linking failed. You can link it manually from the content page.');
        }
      }
      
      // Reset form
      setTitle('');
      setDescription('');
      setBlobId('');
      
    } catch (e: any) {
      console.error('Content creation error:', e);
      const errorMsg = e?.message || 'Failed to create post';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const onCreateRegistry = async () => {
    setError(null);
    try {
      const { registryId: newId } = await createRegistry();
      if (newId) setRegistryId(newId);
      toast.success('Content registry created');
    } catch (e: any) {
      setError(e?.message || 'Failed to create registry');
      toast.error(e?.message || 'Failed to create registry');
    }
  };

  const contentTypeIcons = {
    0: <FileText className="w-5 h-5" />,
    1: <ImageIcon className="w-5 h-5" />,
    2: <Video className="w-5 h-5" />,
    3: <Music className="w-5 h-5" />,
    4: <File className="w-5 h-5" />,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-black mb-4">Create Gated Content</h1>
          <p className="text-xl text-gray-600">Upload to Walrus and publish content for your NFT subscribers.</p>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-2xl p-10 shadow-sm">{/* Form */}
          <form onSubmit={onSubmit} className="space-y-8">
            {/* Registry ID - Advanced */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
              <Label className="text-lg font-semibold mb-3 block">Content Registry (Advanced)</Label>
              <div className="flex gap-3">
                <Input 
                  value={registryId} 
                  onChange={(e) => setRegistryId(e.target.value)} 
                  placeholder="0x... (shared ContentRegistry)" 
                  className="font-mono text-sm"
                />
                <Button type="button" variant="secondary" onClick={onCreateRegistry} disabled={creatingRegistry}>
                  {creatingRegistry ? 'Creating…' : 'Create New'}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Use default or create your own content registry</p>
            </div>

            {/* Title & Access */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-lg font-semibold">Post Title</Label>
                <Input 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="e.g. Exclusive Tutorial"
                  className="text-lg py-6"
                  required 
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-gumroad-pink" />
                  <Label className="text-lg font-semibold">Access Tier</Label>
                </div>
                <Select value={String(requiredTier)} onValueChange={(v) => setRequiredTier(parseInt(v, 10) as any)}>
                  <SelectTrigger className="text-lg py-6">
                    <SelectValue placeholder="Select tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">🌍 Public (Free)</SelectItem>
                    <SelectItem value="1">🥉 Bronze Tier</SelectItem>
                    <SelectItem value="2">🥈 Silver Tier</SelectItem>
                    <SelectItem value="3">🥇 Gold Tier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold">Description (Optional)</Label>
              <Input 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Brief description of your content..."
                className="py-6"
              />
            </div>

            {/* Content Type & Upload */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-lg font-semibold">Content Type</Label>
                <Select value={String(contentType)} onValueChange={(v) => setContentType(parseInt(v, 10) as any)}>
                  <SelectTrigger className="text-lg py-6">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">📝 Text</SelectItem>
                    <SelectItem value="1">🖼️ Image</SelectItem>
                    <SelectItem value="2">🎥 Video</SelectItem>
                    <SelectItem value="3">🎵 Audio</SelectItem>
                    <SelectItem value="4">📁 File</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-gumroad-pink" />
                  <Label className="text-lg font-semibold">Upload to Walrus</Label>
                </div>
                <WalrusUploader label="" onUploaded={(r) => setBlobId(r.blobId)} />
                {blobId && (
                  <div className="flex items-center gap-2 text-sm text-gumroad-pink">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="font-medium">Uploaded successfully</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-8 border-t-2 border-gray-200">
              <Button 
                type="submit" 
                disabled={isPending || !canSubmit}
                className="bg-black hover:bg-gray-800 text-white px-10 py-4 rounded-full font-semibold text-lg disabled:opacity-50"
              >
                {isPending ? 'Publishing...' : 'Publish Post'}
              </Button>
            </div>

            {txDigest && (
              <div className="p-6 bg-gumroad-pink/10 border-2 border-gumroad-pink rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-gumroad-pink flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-lg font-semibold text-black mb-1">Post Published Successfully!</p>
                  <p className="text-sm text-gray-600 break-all">Transaction: {txDigest}</p>
                </div>
              </div>
            )}
            {error && (
              <div className="p-6 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-lg font-semibold text-red-800 mb-1">Error</p>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

