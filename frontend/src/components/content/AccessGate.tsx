"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import PurchaseModal from '@/components/subscriptions/PurchaseModal';
import { hasActiveSubscriptionForCreator } from '@/lib/subscriptions';
import { useCurrentAccount } from '@mysten/dapp-kit';

interface Props {
  creatorAddress: string;
  requiredTier: number; // 0..3
  subsIdHint?: string; // optional CreatorSubscriptions id to prefill
  children: React.ReactNode;
}

export default function AccessGate({ creatorAddress, requiredTier, subsIdHint, children }: Props) {
  const account = useCurrentAccount();
  const [allowed, setAllowed] = useState(requiredTier === 0);
  const [checked, setChecked] = useState(requiredTier === 0);

  useEffect(() => {
    let cancelled = false;
    async function check() {
      if (requiredTier === 0) {
        setAllowed(true);
        setChecked(true);
        return;
      }
      if (!account?.address) {
        setAllowed(false);
        setChecked(true);
        return;
      }
      const r = await hasActiveSubscriptionForCreator(account.address, creatorAddress, requiredTier);
      if (!cancelled) {
        setAllowed(!!r && r.active);
        setChecked(true);
      }
    }
    check();
    return () => { cancelled = true; };
  }, [account?.address, creatorAddress, requiredTier]);

  if (!checked) return <div className="text-sm text-white/60">Checking access…</div>;

  if (allowed) return <>{children}</>;

  return (
    <div className="p-6 rounded-lg border border-white/10 bg-white/5">
      <div className="text-white font-medium mb-2">This post is for subscribers only.</div>
      <div className="text-sm text-white/70 mb-4">Subscribe at tier {requiredTier} or higher to unlock.</div>
      <PurchaseModal trigger={<Button>Purchase Subscription</Button>} defaultSubsId={subsIdHint} />
    </div>
  );
}
