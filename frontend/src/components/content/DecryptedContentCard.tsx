"use client";

import React, { useState } from 'react';
import { useCurrentAccount, useSignPersonalMessage } from '@mysten/dapp-kit';
import { decryptContent, createSealSessionKey, createAccessVerificationTx } from '@/lib/seal';
import { getWalrusUrl } from '@/lib/walrus';
import { Lock, Shield, Download, Eye, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface DecryptedContentCardProps {
  post: any;
  subscriptionNftId?: string; // optional; creator or open-mode can omit
}

export function DecryptedContentCard({ post, subscriptionNftId }: DecryptedContentCardProps) {
  const account = useCurrentAccount();
  const { mutateAsync: signPersonalMessage } = useSignPersonalMessage();
  const [decryptedBlob, setDecryptedBlob] = useState<Blob | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  console.log('🎴 [DecryptedContentCard] Rendering card for post:', post.id);
  console.log('🔐 [DecryptedContentCard] Has encryption:', !!post.fields?.encryption_metadata);
  
  const handleDecrypt = async () => {
    if (!account?.address) {
      toast.error('Please connect your wallet');
      return;
    }
    
    console.log('🔓 [DecryptedContentCard] Starting decryption process...');
    console.log('📄 [DecryptedContentCard] Post ID:', post.id);
    console.log('🎫 [DecryptedContentCard] Subscription NFT:', subscriptionNftId);
    
    setIsDecrypting(true);
    setError(null);
    
    try {
      // Check if content is encrypted
      const encryptionMetadata = post.fields?.encryption_metadata;
      
      if (!encryptionMetadata) {
        console.log('ℹ️ [DecryptedContentCard] Content is not encrypted, downloading directly...');
        toast.info('📥 Downloading public content...');
        
        // Download directly from Walrus for public content
        const walrusBlobId = post.fields.walrus_blob_id;
        const walrusUrl = getWalrusUrl(walrusBlobId);
        
        console.log('📥 [DecryptedContentCard] Downloading from:', walrusUrl);
        const response = await fetch(walrusUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to download: ${response.statusText}`);
        }
        
        const blob = await response.blob();
        console.log('✅ [DecryptedContentCard] Downloaded:', blob.size, 'bytes');
        setDecryptedBlob(blob);
        toast.success('✅ Content loaded!');
        return;
      }
      
      // Content is encrypted - decrypt it
      console.log('🔐 [DecryptedContentCard] Content is encrypted, starting decryption...');
      
      // 1. Download encrypted data from Walrus
      console.log('📥 [DecryptedContentCard] Downloading encrypted content from Walrus...');
      toast.info('📥 Downloading encrypted content...');
      
      const walrusBlobId = post.fields.walrus_blob_id;
      const walrusUrl = getWalrusUrl(walrusBlobId);
      
      const response = await fetch(walrusUrl);
      if (!response.ok) {
        throw new Error(`Failed to download from Walrus: ${response.statusText}`);
      }
      
      const encryptedBlob = await response.blob();
      const encryptedData = new Uint8Array(await encryptedBlob.arrayBuffer());
      console.log('✅ [DecryptedContentCard] Downloaded encrypted data:', encryptedData.length, 'bytes');
      
      // 2. Parse encryption metadata
      console.log('📋 [DecryptedContentCard] Parsing encryption metadata...');
      const metadataStr = typeof encryptionMetadata === 'string'
        ? encryptionMetadata
        : encryptionMetadata?.fields?.some ?? encryptionMetadata?.some ?? null;
      if (!metadataStr) {
        throw new Error('Invalid encryption metadata');
      }
      const metadata = JSON.parse(metadataStr);
      console.log('📋 [DecryptedContentCard] Metadata:', metadata);
      
      // 3. Create session key
      console.log('🔑 [DecryptedContentCard] Creating session key...');
      toast.info('🔑 Creating session key...'); 
      const sessionKey = await createSealSessionKey(account.address, signPersonalMessage);
      console.log('✅ [DecryptedContentCard] Session key created');
      
      // 4. Create access verification transaction
      console.log('📝 [DecryptedContentCard] Creating access verification transaction...');
      console.log('📋 [DecryptedContentCard] Post fields for policy check:', {
        access_policy_id: post.fields?.access_policy_id,
        seal_policy_id: post.fields?.seal_policy_id,
      });
      toast.info('📝 Verifying access...');
      let txBytes: Uint8Array | undefined;
      
      // Resolve AccessPolicy ID from post (supports string or Option encoding)
      const rawPolicy = post.fields?.access_policy_id ?? post.fields?.seal_policy_id;
      const policyId: string | undefined =
        typeof rawPolicy === 'string'
          ? rawPolicy
          : (rawPolicy?.fields?.vec?.[0] ?? rawPolicy?.fields?.some);
      console.log('🛡️ [DecryptedContentCard] Resolved policyId:', policyId);
      
      if (subscriptionNftId && policyId) {
        // Build verification PTB with content ID, subscription NFT, and policy
        txBytes = await createAccessVerificationTx(
          metadata.id,
          subscriptionNftId,
          policyId,
          metadata.packageId
        );
      } else {
        console.log('ℹ️ [DecryptedContentCard] No subscription NFT or policy; attempting open-mode decryption.');
        txBytes = undefined;
      }
      console.log('✅ [DecryptedContentCard] Access verification transaction created');
      
      // 5. Decrypt
      console.log('🔓 [DecryptedContentCard] Decrypting content...');
      toast.info('🔓 Decrypting content...');
      const decryptedData = await decryptContent(
        encryptedData,
        metadata,
        subscriptionNftId,
        sessionKey,
        txBytes
      );
      console.log('✅ [DecryptedContentCard] Content decrypted:', decryptedData.length, 'bytes');
      
      // 6. Create blob and display
      const contentType = getContentType(post.fields.content_type) || 'application/octet-stream';
      // Ensure we pass an ArrayBuffer (not ArrayBufferLike) to Blob
      const arrayBuffer = decryptedData instanceof Uint8Array
        ? (decryptedData.buffer as ArrayBuffer).slice(
            decryptedData.byteOffset,
            decryptedData.byteOffset + decryptedData.byteLength,
          )
        : (decryptedData as unknown as ArrayBuffer);
      const blob = new Blob([arrayBuffer], { type: contentType });
      setDecryptedBlob(blob);
      
      console.log('✅ [DecryptedContentCard] Decryption complete!');
      toast.success('✅ Content decrypted successfully!');
      
    } catch (error: any) {
      console.error('❌ [DecryptedContentCard] Decryption failed:', error);
      console.error('❌ [DecryptedContentCard] Error stack:', error.stack);
      setError(error.message || 'Failed to decrypt content');
      toast.error(`Decryption failed: ${error.message}`);
    } finally {
      setIsDecrypting(false);
    }
  };
  
  const handleDownload = () => {
    if (!decryptedBlob) return;
    
    console.log('💾 [DecryptedContentCard] Downloading decrypted content...');
    const url = URL.createObjectURL(decryptedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = post.fields.title || 'content';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('✅ Download started!');
  };
  
  const blobUrl = decryptedBlob ? URL.createObjectURL(decryptedBlob) : null;
  const isEncrypted = !!post.fields?.encryption_metadata;
  const contentType = post.fields.content_type;
  
  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
      {/* Content Preview */}
      <div className="relative aspect-square bg-gray-100">
        {!blobUrl ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
            {isEncrypted && (
              <div className="absolute top-3 right-3 bg-gumroad-pink text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Encrypted
              </div>
            )}
            
            {error ? (
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <p className="text-sm text-red-600 mb-4">{error}</p>
                <Button
                  onClick={handleDecrypt}
                  variant="outline"
                  className="border-red-500 text-red-600 hover:bg-red-50"
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <>
                <Lock className="w-16 h-16 text-gray-400 mb-4" />
                <Button
                  onClick={handleDecrypt}
                  disabled={isDecrypting}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  {isDecrypting ? (
                    <>
                      <Shield className="w-4 h-4 mr-2 animate-pulse" />
                      {isEncrypted ? 'Decrypting...' : 'Loading...'}
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      View Content
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        ) : (
          <>
            {contentType === 1 ? ( // Image
              <img 
                src={blobUrl} 
                alt={post.fields.title} 
                className="w-full h-full object-cover" 
              />
            ) : contentType === 2 ? ( // Video
              <video 
                src={blobUrl} 
                controls 
                className="w-full h-full object-cover"
              />
            ) : contentType === 3 ? ( // Audio
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
                <audio src={blobUrl} controls className="w-full px-6" />
              </div>
            ) : ( // File or Text
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Download className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <Button onClick={handleDownload} className="bg-black hover:bg-gray-800 text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Download File
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Post Info */}
      <div className="p-4">
        <h3 className="font-bold text-black text-lg mb-1">{post.fields.title}</h3>
        {post.fields.description && (
          <p className="text-sm text-gray-600 mb-3">{post.fields.description}</p>
        )}
        
        {/* Metadata */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {post.fields.views || 0} views
          </div>
          <div className="flex items-center gap-1">
            {isEncrypted ? (
              <>
                <Shield className="w-3 h-3 text-gumroad-pink" />
                <span className="text-gumroad-pink font-semibold">Encrypted</span>
              </>
            ) : (
              <span>Public</span>
            )}
          </div>
        </div>
        
        {blobUrl && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <Button
              onClick={handleDownload}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to get MIME type from content_type
function getContentType(contentType: number): string {
  switch (contentType) {
    case 0: return 'text/plain';
    case 1: return 'image/jpeg';
    case 2: return 'video/mp4';
    case 3: return 'audio/mpeg';
    case 4: return 'application/octet-stream';
    default: return 'application/octet-stream';
  }
}
