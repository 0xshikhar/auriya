"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getOwnedCreatorProfiles, extractFields } from '@/lib/creator';
import { useCurrentAccount } from '@mysten/dapp-kit';

export default function AnalyticsPage() {
  const account = useCurrentAccount();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [stats, setStats] = React.useState<{ totalSubscribers: number; totalRevenueSui: number } | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!account?.address) return;
      setLoading(true);
      setError(null);
      try {
        const list = await getOwnedCreatorProfiles(account.address);
        const first = list[0];
        const fields = extractFields(first);
        if (!cancelled && fields) {
          const totalSubscribers = Number(fields.total_subscribers) || 0;
          const totalRevenueSui = (Number(fields.total_revenue_mist) || 0) / 1_000_000_000;
          setStats({ totalSubscribers, totalRevenueSui });
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load analytics');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [account?.address]);

  return (
    <div className="container py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>
      {!account && <div className="text-sm text-white/70">Connect an account to view analytics.</div>}
      {loading && <div className="text-sm text-white/70">Loading…</div>}
      {error && <div className="text-sm text-red-400">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.totalSubscribers ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{(stats?.totalRevenueSui ?? 0).toFixed(2)} SUI</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
