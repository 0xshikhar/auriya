"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import WalrusUploader from '@/components/walrus/WalrusUploader';
import { useCreateProfile } from '@/hooks/contracts/useCreateProfile';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { getWalrusUrl } from '@/lib/walrus';
import { User, Image as ImageIcon, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProfileSetupPage() {
  const { createProfile, isPending } = useCreateProfile();
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [category, setCategory] = useState('Art');
  const [avatarId, setAvatarId] = useState<string>('');
  const [bannerId, setBannerId] = useState<string>('');
  const [txDigest, setTxDigest] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setTxDigest(null);
    try {
      const res = await createProfile({
        displayName,
        bio,
        avatarWalrusId: avatarId,
        bannerWalrusId: bannerId,
        category,
      });
      // @ts-ignore
      setTxDigest(res?.digest || null);
    } catch (err: any) {
      setError(err?.message || 'Failed to create profile');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-black mb-4">Create Your Profile</h1>
          <p className="text-xl text-gray-600">Set up your onchain creator identity. All media stored permanently on Walrus.</p>
        </div>

        {/* Progress indicators */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${displayName && bio ? 'bg-gumroad-pink' : 'bg-gray-200'}`}>
              <User className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">Basic Info</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-200"></div>
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${avatarId && bannerId ? 'bg-gumroad-pink' : 'bg-gray-200'}`}>
              <ImageIcon className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">Media</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-200"></div>
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${txDigest ? 'bg-gumroad-pink' : 'bg-gray-200'}`}>
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">Complete</span>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-2xl p-10 shadow-sm">{/* Form content */}
          
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Display Name</Label>
                <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="e.g. Alice" required />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Art / Music / Writing" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Short intro about you..." rows={4} required />
              <p className="text-xs text-gray-500">Keep it concise. You can edit this later.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <ImageIcon className="w-5 h-5 text-gumroad-pink" />
                  <Label className="text-lg font-semibold">Avatar</Label>
                </div>
                <WalrusUploader label="" accept="image/*" maxSizeMB={10} onUploaded={(r) => setAvatarId(r.blobId)} />
                {avatarId && (
                  <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-gumroad-pink shadow-lg">
                    <Image src={getWalrusUrl(avatarId)} alt="Avatar preview" fill sizes="128px" className="object-cover" />
                  </div>
                )}
                <p className="text-sm text-gray-500">Recommended: 400x400px, max 10MB</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <ImageIcon className="w-5 h-5 text-gumroad-pink" />
                  <Label className="text-lg font-semibold">Banner</Label>
                </div>
                <WalrusUploader label="" accept="image/*" maxSizeMB={20} onUploaded={(r) => setBannerId(r.blobId)} />
                {bannerId && (
                  <div className="relative h-32 w-full overflow-hidden rounded-xl border-2 border-gray-200 shadow-lg">
                    <Image src={getWalrusUrl(bannerId)} alt="Banner preview" fill sizes="100vw" className="object-cover" />
                  </div>
                )}
                <p className="text-sm text-gray-500">Recommended: 1500x500px, max 20MB</p>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-8 border-t border-gray-200">
              <Button 
                type="submit" 
                disabled={isPending || !avatarId || !bannerId}
                className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full font-semibold text-lg disabled:opacity-50"
              >
                {isPending ? 'Creating Profile...' : 'Create Profile'}
              </Button>
            </div>

            {txDigest && (
              <div className="p-6 bg-gumroad-pink/10 border-2 border-gumroad-pink rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-gumroad-pink flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-lg font-semibold text-black mb-1">Profile Created Successfully!</p>
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

