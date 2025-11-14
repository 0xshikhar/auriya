"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CreatorsDiscoveryPage() {
  const [address, setAddress] = useState('');
  const [subsId, setSubsId] = useState('');

  return (
    <div className="container py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">Creators</h1>
      <Card>
        <CardHeader>
          <CardTitle>Find a creator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
            <div>
              <div className="text-sm text-white/80 mb-1">Creator Address</div>
              <Input placeholder="0x..." value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div>
              <div className="text-sm text-white/80 mb-1">Subscriptions Object ID (optional)</div>
              <Input placeholder="0x..." value={subsId} onChange={(e) => setSubsId(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button asChild className="w-full" disabled={!address}>
                <Link href={`/creators/${address}${subsId ? `?subs=${encodeURIComponent(subsId)}` : ''}`}>View Creator</Link>
              </Button>
            </div>
          </div>

          <div className="text-xs text-white/60">
            Tip: After creators configure tiers, copy the resulting CreatorSubscriptions object ID here for quick purchase.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
