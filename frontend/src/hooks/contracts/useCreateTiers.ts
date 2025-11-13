"use client";

import { useCallback } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { SUBSCRIPTION_PACKAGE_ID } from '@/lib/constants';
import { createSuiClient } from '@/lib/sui';

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
  const signAndExecute = useSignAndExecuteTransaction();

  const createTiers = useCallback(async (tiers: TierInput[]) => {
    assertConfigured();
    if (!tiers.length) throw new Error('At least one tier is required');

    const names = tiers.map((t) => t.name);
    const pricesMist = tiers.map((t) => BigInt(Math.round(t.priceSui * 1_000_000_000)));
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

    const res = await signAndExecute.mutateAsync({ transaction: tx });

    // Enrich with objectChanges for caller convenience
    const client = createSuiClient();
    const digest = (res as any)?.digest as string | undefined;
    let objectChanges: any[] | undefined;
    if (digest) {
      const txInfo = await client.getTransactionBlock({ digest, options: { showObjectChanges: true } });
      objectChanges = (txInfo as any)?.objectChanges as any[] | undefined;
    }
    return { ...(res as any), objectChanges } as any;
  }, [signAndExecute]);

  return { createTiers, isPending: signAndExecute.isPending } as const;
}
