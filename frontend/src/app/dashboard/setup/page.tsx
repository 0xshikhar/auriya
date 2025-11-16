"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import WalrusUploader from '@/components/walrus/WalrusUploader';
import { useCreateProfile } from '@/hooks/contracts/useCreateProfile';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { getWalrusUrl } from '@/lib/walrus';

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
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black">Profile Setup</h1>
          <p className="text-gray-600 mt-2">Create your public creator profile. Media is stored on Walrus for verifiable permanence.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-black mb-6">Create your creator profile</h2>
          
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <WalrusUploader label="Avatar" accept="image/*" maxSizeMB={10} onUploaded={(r) => setAvatarId(r.blobId)} />
                {avatarId && (
                  <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-gumroad-pink">
                    <Image src={getWalrusUrl(avatarId)} alt="Avatar preview" fill sizes="96px" className="object-cover" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <WalrusUploader label="Banner" accept="image/*" maxSizeMB={20} onUploaded={(r) => setBannerId(r.blobId)} />
                {bannerId && (
                  <div className="relative h-28 w-full overflow-hidden rounded-lg border border-gray-200">
                    <Image src={getWalrusUrl(bannerId)} alt="Banner preview" fill sizes="100vw" className="object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="submit" disabled={isPending || !avatarId || !bannerId}>
                {isPending ? 'Creating…' : 'Create Profile'}
              </Button>
            </div>

            {txDigest && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-800">Success!</p>
                <p className="text-xs text-green-600 mt-1 break-all">Transaction: {txDigest}</p>
              </div>
            )}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

