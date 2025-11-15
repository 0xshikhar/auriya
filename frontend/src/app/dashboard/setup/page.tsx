"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import WalrusUploader from '@/components/walrus/WalrusUploader';
import { useCreateProfile } from '@/hooks/contracts/useCreateProfile';

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
    <div className="container py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Profile Setup</h1>
      <Card>
        <CardHeader>
          <CardTitle>Create your creator profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Display Name</Label>
                <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Art/Music/Writing" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Input value={bio} onChange={(e) => setBio(e.target.value)} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <WalrusUploader label="Avatar" accept="image/*" maxSizeMB={10} onUploaded={(r) => setAvatarId(r.blobId)} />
              <WalrusUploader label="Banner" accept="image/*" maxSizeMB={20} onUploaded={(r) => setBannerId(r.blobId)} />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="submit" disabled={isPending || !avatarId || !bannerId}>
                {isPending ? 'Creating…' : 'Create Profile'}
              </Button>
            </div>

            {txDigest && (
              <div className="text-xs text-green-400 break-all">Submitted tx: {txDigest}</div>
            )}
            {error && <div className="text-xs text-red-400">{error}</div>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
