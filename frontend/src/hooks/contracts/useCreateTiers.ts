"use client";

import { useCallback } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { SUBSCRIPTION_PACKAGE_ID } from '@/lib/constants';
import { createSuiClient } from '@/lib/sui';
import { useUnifiedTransaction } from '@/hooks/useUnifiedTransaction';

export type TierInput = {
  name: string;
  priceSui: number; // human SUI amount
  durationDays: number; // human days
};

function assertConfigured() {
  if (!SUBSCRIPTION_PACKAGE_ID || SUBSCRIPTION_PACKAGE_ID.startsWith('REPLACE_WITH')) {
    throw new Error('SUBSCRIPTION_PACKAGE_ID is not configured in constants.ts');
  }
}

export function useCreateTiers() {
  const { signAndExecute, isPending } = useUnifiedTransaction();

  const createTiers = useCallback(async (tiers: TierInput[]) => {
    assertConfigured();
    if (!tiers.length) throw new Error('At least one tier is required');

    const names = tiers.map((t) => t.name);
    // Use ceil to guarantee payment >= configured tier price in Move (avoid float underpayment)
    const pricesMist = tiers.map((t) => BigInt(Math.ceil(t.priceSui * 1_000_000_000)));
    const durationsMs = tiers.map((t) => BigInt(Math.round(t.durationDays * 24 * 60 * 60 * 1000)));

    const tx = new Transaction();

    tx.moveCall({
      target: `${SUBSCRIPTION_PACKAGE_ID}::subscription::create_tiers`,
      arguments: [
        tx.pure.vector('string', names),
        tx.pure.vector('u64', pricesMist),
        tx.pure.vector('u64', durationsMs),
      ],
    });

    tx.setGasBudget(20_000_000);

    const res = await signAndExecute({ transaction: tx });

    // Ensure the transaction is finalized before querying object changes
    const client = createSuiClient();
    const digest = (res as any)?.digest as string | undefined;
    let objectChanges: any[] | undefined;
    if (digest) {
      const txInfo = await client.waitForTransaction({
        digest,
        options: { showObjectChanges: true, showEffects: true, showEvents: true },
      });
      objectChanges = (txInfo as any)?.objectChanges as any[] | undefined;
    }
    return { ...(res as any), objectChanges } as any;
  }, [signAndExecute]);

  return { createTiers, isPending } as const;
}
