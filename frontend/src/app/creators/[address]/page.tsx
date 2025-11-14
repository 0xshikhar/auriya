"use client";

import React from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PurchaseModal from '@/components/subscriptions/PurchaseModal';

export default function CreatorPage() {
  const params = useParams<{ address: string }>();
  const search = useSearchParams();
  const router = useRouter();
  const subs = search.get('subs') || '';
  const [registry, setRegistry] = React.useState<string>(search.get('registry') || '');

  return (
    <div className="container py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-2">Creator</h1>
      <div className="text-white/70 text-sm break-all">{params.address}</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Registry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-sm text-white/80 mb-1">Registry Object ID</div>
              <Input value={registry} onChange={(e) => setRegistry(e.target.value)} placeholder="0x..." />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => router.push(`/creators/${params.address}/posts?registry=${encodeURIComponent(registry)}${subs ? `&subs=${encodeURIComponent(subs)}` : ''}`)}
                disabled={!registry}
              >
                View Posts
              </Button>
            </div>
            <div className="text-xs text-white/60">Ask the creator for their ContentRegistry ID.</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscribe</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-white/70">Purchase a subscription to unlock gated content.</div>
            <PurchaseModal defaultSubsId={subs || undefined} />
            {!subs && (
              <div className="text-xs text-yellow-400">
                Note: Provide the creator&apos;s Subscriptions object ID via ?subs=0x... for quick purchase.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
