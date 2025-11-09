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
import { useCreateAccessPolicy } from '@/hooks/contracts/useCreateAccessPolicy';
import { useLinkSealPolicy } from '@/hooks/contracts/useLinkSealPolicy';
import { DEFAULT_CONTENT_REGISTRY_ID } from '@/lib/constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Image as ImageIcon, Video, Music, File as FileIcon, Lock, CheckCircle2, AlertCircle, Upload, Shield, ArrowLeft, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { encryptContent } from '@/lib/seal';
import { uploadToWalrus } from '@/lib/walrus';

export default function NewContentPage() {
  const currentAccount = useCurrentAccount();
  const { profile, hasProfile } = useCreatorProfile(currentAccount?.address);
  const router = useRouter();
  
  const [registryId, setRegistryId] = useState<string>(DEFAULT_CONTENT_REGISTRY_ID);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentType, setContentType] = useState<0 | 1 | 2 | 3 | 4>(1);
  const [requiredTier, setRequiredTier] = useState<0 | 1 | 2 | 3>(0);
  const [blobId, setBlobId] = useState<string>('');
  const [txDigest, setTxDigest] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Seal encryption state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [encryptionMetadata, setEncryptionMetadata] = useState<string | null>(null);
  const [accessPolicyId, setAccessPolicyId] = useState<string | null>(null); // CRITICAL: Policy must be created BEFORE encryption
  const [useEncryption, setUseEncryption] = useState(true); // Enable encryption by default for gated content

  const { createPost, isPending } = useCreatePost();
  const { createRegistry, isPending: creatingRegistry } = useCreateContentRegistry();
  const { linkRegistry, isPending: linkingRegistry } = useLinkContentRegistry();
  const { createPolicy, isPending: creatingPolicy } = useCreateAccessPolicy();
  const { linkPolicy, isPending: linkingPolicy } = useLinkSealPolicy();

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
  
  // Handle file encryption and upload to Walrus
  const handleEncryptAndUpload = async (file: File) => {
    if (!currentAccount?.address) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    console.log('📤 [ContentCreation] Starting encrypt and upload process...');
    setSelectedFile(file);
    setIsEncrypting(true);
    setIsUploading(true);
    
    try {
      let finalBlobId: string;
      let metadata: string | null = null;
      let policyId: string | null = null;
      
      // Check if encryption should be used (for gated content)
      if (useEncryption && requiredTier > 0) {
        // CRITICAL: Create AccessPolicy FIRST (required for encryption ID generation)
        console.log('🛡️ [ContentCreation] Creating AccessPolicy BEFORE encryption...');
        toast.info('🛡️ Creating access policy...');
        
        const policyRes = await createPolicy({
          creator: currentAccount.address,
          contentPostId: '0x0000000000000000000000000000000000000000000000000000000000000000', // Placeholder, will be linked later
          requiredTier,
        });
        
        // Extract policy ID from transaction result
        // @ts-ignore
        const policyObjects = policyRes?.effects?.created || [];
        const policyObject = policyObjects.find((obj: any) => 
          obj?.reference?.objectId && obj?.owner?.Shared
        );
        
        if (!policyObject?.reference?.objectId) {
          throw new Error('Failed to create AccessPolicy - no object ID returned');
        }
        
        const createdPolicyId = policyObject.reference.objectId;
        policyId = createdPolicyId;
        setAccessPolicyId(createdPolicyId);
        console.log('✅ [ContentCreation] AccessPolicy created:', createdPolicyId);
        toast.success(`Access policy created: ${createdPolicyId.slice(0, 10)}...`);
        
        // Wait for policy to be indexed
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // NOW encrypt content using the policy ID as prefix
        console.log('🔐 [ContentCreation] Encrypting content with Seal...');
        toast.info('🔐 Encrypting content with Mysten Seal...');
        
        // Ensure policyId is not null before encryption
        if (!policyId) {
          throw new Error('Policy ID is null after creation');
        }
        
        const { encryptedData, encryptionMetadata } = await encryptContent(
          file,
          requiredTier,
          currentAccount.address,
          policyId // CRITICAL: Pass policy ID for encryption ID generation
        );
        
        setIsEncrypting(false);
        console.log('✅ [ContentCreation] Encryption complete');
        toast.success('✅ Content encrypted successfully!');
        
        // Upload encrypted data to Walrus
        console.log('📤 [ContentCreation] Uploading encrypted content to Walrus...');
        toast.info('📤 Uploading encrypted content to Walrus...');
        
        // Convert Uint8Array to regular array for Blob compatibility
        const encryptedArray = Array.from(encryptedData);
        const encryptedBlob = new Blob([new Uint8Array(encryptedArray)], { type: 'application/octet-stream' });
        const encryptedFile = new File([encryptedBlob], file.name + '.encrypted', { type: 'application/octet-stream' });
        
        const walrusResult = await uploadToWalrus(encryptedFile, (progress) => {
          console.log(`📊 [ContentCreation] Upload progress: ${progress}%`);
        });
        
        finalBlobId = walrusResult.blobId;
        metadata = JSON.stringify(encryptionMetadata);
        
        console.log('✅ [ContentCreation] Encrypted content uploaded to Walrus');
        console.log('🆔 [ContentCreation] Blob ID:', finalBlobId);
        toast.success('✅ Encrypted content uploaded to Walrus!');
        
      } else {
        // Upload without encryption (public content)
        console.log('📤 [ContentCreation] Uploading content without encryption...');
        toast.info('📤 Uploading content to Walrus...');
        
        const walrusResult = await uploadToWalrus(file, (progress) => {
          console.log(`📊 [ContentCreation] Upload progress: ${progress}%`);
        });
        
        finalBlobId = walrusResult.blobId;
        console.log('✅ [ContentCreation] Content uploaded to Walrus');
        console.log('🆔 [ContentCreation] Blob ID:', finalBlobId);
        toast.success('✅ Content uploaded to Walrus!');
      }
      
      setBlobId(finalBlobId);
      setEncryptionMetadata(metadata);
      if (policyId) {
        setAccessPolicyId(policyId);
      }
      setIsUploading(false);
      
    } catch (error: any) {
      console.error('❌ [ContentCreation] Encrypt and upload failed:', error);
      setIsEncrypting(false);
      setIsUploading(false);
      toast.error(`Failed: ${error.message || 'Unknown error'}`);
    }
  };

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

      console.log('📝 [ContentCreation] Publishing post to blockchain...');
      toast.info('Publishing post...');
      
      const res = await createPost({
        registryId: targetRegistry,
        title,
        description,
        contentType,
        walrusBlobId: blobId,
        requiredTier,
        encryptionMetadata: encryptionMetadata || '', // Include Seal metadata
      });
      
      console.log('✅ [ContentCreation] Post published successfully!');
      console.log('📄 [ContentCreation] Transaction result:', res);
      
      // @ts-ignore
      const digest = res?.digest || null;
      setTxDigest(digest);
      toast.success('Post published successfully!');

      // If encrypted, link the pre-created AccessPolicy to the post
      if (encryptionMetadata && requiredTier > 0 && accessPolicyId) {
        try {
          console.log('🔗 [ContentCreation] Linking AccessPolicy to post...');
          
          // Extract post ID from transaction result
          // @ts-ignore
          const createdObjects = res?.effects?.created || [];
          const postObject = createdObjects.find((obj: any) => 
            obj?.reference?.objectId && obj?.owner?.Shared
          );
          
          if (!postObject?.reference?.objectId) {
            console.warn('⚠️ [ContentCreation] Could not extract post ID from transaction result');
            toast.warning('Post created but could not link access policy. Decryption may fail.');
          } else {
            const postId = postObject.reference.objectId;
            console.log('📄 [ContentCreation] Extracted post ID:', postId);
            
            // Wait for post to be indexed
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Link the pre-created policy to the post
            console.log('🔗 [ContentCreation] Linking policy', accessPolicyId, 'to post', postId);
            toast.info('Linking access policy...');
            await linkPolicy({
              postId,
              sealPolicyId: accessPolicyId,
            });
            
            console.log('✅ [ContentCreation] Policy linked to post successfully!');
            toast.success('Access policy linked to post!');
          }
        } catch (policyError: any) {
          console.error('❌ [ContentCreation] Failed to link AccessPolicy:', policyError);
          toast.error(`Policy linking failed: ${policyError.message || 'Unknown error'}. Content created but decryption may not work.`);
        }
      }

      // Persist the last used/created registry for the content page fallback
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('auriya:lastRegistryId', targetRegistry);
        }
      } catch {}

      // Navigate to dashboard with the exact registry so the new post appears immediately
      // try {
      //   router.push(`/dashboard/content?registry=${encodeURIComponent(targetRegistry)}`);
      // } catch {}

      // Auto-link registry to profile if not already linked (for existing registries too)
      if (profile?.objectId && !profile?.contentRegistryId && !isNewRegistry) {
        try {
          // Wait a bit for the previous transaction to finalize
          toast.info('Linking registry to your profile...');
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
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
      setAccessPolicyId(null);
      setEncryptionMetadata(null);
      setSelectedFile(null);
      
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
    4: <FileIcon className="w-5 h-5" />,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/content')}
            className="text-gray-600 hover:text-black -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Content
          </Button>
        </div>

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
                  {useEncryption && requiredTier > 0 ? (
                    <Shield className="w-5 h-5 text-gumroad-pink" />
                  ) : (
                    <Upload className="w-5 h-5 text-gumroad-pink" />
                  )}
                  <Label className="text-lg font-semibold">
                    {useEncryption && requiredTier > 0 ? 'Encrypt & Upload to Walrus' : 'Upload to Walrus'}
                  </Label>
                </div>
                
                {/* Custom file input with encryption */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gumroad-pink transition">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleEncryptAndUpload(file);
                    }}
                    disabled={isEncrypting || isUploading}
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    {isEncrypting ? (
                      <>
                        <Shield className="w-8 h-8 text-gumroad-pink animate-pulse mb-2" />
                        <p className="text-sm font-medium text-gray-700">Encrypting with Seal...</p>
                      </>
                    ) : isUploading ? (
                      <>
                        <Upload className="w-8 h-8 text-gumroad-pink animate-bounce mb-2" />
                        <p className="text-sm font-medium text-gray-700">Uploading to Walrus...</p>
                      </>
                    ) : blobId ? (
                      <>
                        <CheckCircle2 className="w-8 h-8 text-green-600 mb-2" />
                        <p className="text-sm font-medium text-green-700">
                          {encryptionMetadata ? 'Encrypted & Uploaded!' : 'Uploaded!'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Click to replace</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-700">Click to select file</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {useEncryption && requiredTier > 0 ? 'Will be encrypted with Seal' : 'Direct upload'}
                        </p>
                      </>
                    )}
                  </label>
                </div>
                
                {blobId && (
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-700">
                      {encryptionMetadata ? '🔐 Encrypted & uploaded' : '📤 Uploaded'}
                    </span>
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

