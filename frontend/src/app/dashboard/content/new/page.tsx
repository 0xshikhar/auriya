"use client";

import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import WalrusUploader from '@/components/walrus/WalrusUploader';
import { useCreatePost } from '@/hooks/contracts/useCreatePost';
import { useCreateContentRegistry } from '@/hooks/contracts/useCreateContentRegistry';
import { DEFAULT_CONTENT_REGISTRY_ID } from '@/lib/constants';

export default function NewContentPage() {
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

  const canSubmit = useMemo(() => !!registryId && !!blobId && !!title, [registryId, blobId, title]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setTxDigest(null);
    try {
      const res = await createPost({
        registryId,
        title,
        description,
        contentType,
        walrusBlobId: blobId,
        requiredTier,
      });
      // @ts-ignore
      setTxDigest(res?.digest || null);
    } catch (e: any) {
      setError(e?.message || 'Failed to create post');
    }
  };

  const onCreateRegistry = async () => {
    setError(null);
    try {
      const { registryId: newId } = await createRegistry();
      if (newId) setRegistryId(newId);
    } catch (e: any) {
      setError(e?.message || 'Failed to create registry');
    }
  };

  return (
    <div className="container py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Create Content</h1>
      <Card>
        <CardHeader>
          <CardTitle>New Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Content Registry ID</Label>
              <div className="flex gap-2">
                <Input value={registryId} onChange={(e) => setRegistryId(e.target.value)} placeholder="0x... (shared ContentRegistry)" />
                <Button type="button" variant="secondary" onClick={onCreateRegistry} disabled={creatingRegistry}>
                  {creatingRegistry ? 'Creating…' : 'Create Registry'}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Required Tier</Label>
                <select
                  className="h-10 rounded-md bg-transparent border border-white/10 px-3 text-sm"
                  value={requiredTier}
                  onChange={(e) => setRequiredTier(parseInt(e.target.value, 10) as any)}
                >
                  <option value={0}>Public</option>
                  <option value={1}>Bronze</option>
                  <option value={2}>Silver</option>
                  <option value={3}>Gold</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Content Type</Label>
                <select
                  className="h-10 rounded-md bg-transparent border border-white/10 px-3 text-sm"
                  value={contentType}
                  onChange={(e) => setContentType(parseInt(e.target.value, 10) as any)}
                >
                  <option value={0}>Text</option>
                  <option value={1}>Image</option>
                  <option value={2}>Video</option>
                  <option value={3}>Audio</option>
                  <option value={4}>File</option>
                </select>
              </div>

              <WalrusUploader label="Upload media to Walrus" onUploaded={(r) => setBlobId(r.blobId)} />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="submit" disabled={isPending || !canSubmit}>{isPending ? 'Creating…' : 'Publish Post'}</Button>
            </div>

            {txDigest && <div className="text-xs text-green-400 break-all">Submitted tx: {txDigest}</div>}
            {error && <div className="text-xs text-red-400">{error}</div>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
