"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateTiers, TierInput } from '@/hooks/contracts/useCreateTiers';

export default function TiersPage() {
  const { createTiers, isPending } = useCreateTiers();
  const [tiers, setTiers] = useState<TierInput[]>([
    { name: 'Bronze', priceSui: 0.1, durationDays: 30 },
  ]);
  const [resultId, setResultId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addTier = () => setTiers((t) => [...t, { name: '', priceSui: 0, durationDays: 30 }]);
  const removeTier = (i: number) => setTiers((t) => t.filter((_, idx) => idx !== i));

  const update = (i: number, patch: Partial<TierInput>) => {
    setTiers((t) => t.map((ti, idx) => (idx === i ? { ...ti, ...patch } : ti)));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResultId(null);
    try {
      const res = await createTiers(tiers);
      const created = ((res as any)?.objectChanges as any[] | undefined)?.find(
        (c) => c.type === 'created' && typeof c.objectType === 'string' && c.objectType.endsWith('::subscription::CreatorSubscriptions')
      );
      setResultId(created?.objectId || null);
    } catch (e: any) {
      setError(e?.message || 'Failed to create tiers');
    }
  };

  return (
    <div className="container py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Subscription Tiers</h1>
      <Card>
        <CardHeader>
          <CardTitle>Configure your tiers</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {tiers.map((t, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="space-y-1">
                  <Label>Name</Label>
                  <Input value={t.name} onChange={(e) => update(i, { name: e.target.value })} required />
                </div>
                <div className="space-y-1">
                  <Label>Price (SUI)</Label>
                  <Input type="number" step="0.000001" value={t.priceSui} onChange={(e) => update(i, { priceSui: parseFloat(e.target.value || '0') })} required />
                </div>
                <div className="space-y-1">
                  <Label>Duration (days)</Label>
                  <Input type="number" value={t.durationDays} onChange={(e) => update(i, { durationDays: parseInt(e.target.value || '30', 10) })} required />
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => removeTier(i)} disabled={tiers.length <= 1}>Remove</Button>
                </div>
              </div>
            ))}
            <div className="flex justify-between">
              <Button type="button" variant="secondary" onClick={addTier} disabled={tiers.length >= 5}>+ Add Tier</Button>
              <Button type="submit" disabled={isPending}>{isPending ? 'Creating…' : 'Save Tiers'}</Button>
            </div>
            {resultId && (
              <div className="text-xs text-green-400 break-all">CreatorSubscriptions ID: {resultId}</div>
            )}
            {error && <div className="text-xs text-red-400">{error}</div>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
