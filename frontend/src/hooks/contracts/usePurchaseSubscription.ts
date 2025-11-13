"use client";

import { useCallback } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { SUBSCRIPTION_PACKAGE_ID, SUBSCRIPTION_TREASURY_ID, SUI_CLOCK_OBJECT_ID } from '@/lib/constants';

export type PurchaseInput = {
  subsId: string; // CreatorSubscriptions shared object id
  tierId: number; // 1..n
  amountSui: number; // SUI to pay (should be >= price)
  overrideTreasuryId?: string; // optional override
};

function assertConfigured(treasuryId: string) {
  if (!SUBSCRIPTION_PACKAGE_ID || SUBSCRIPTION_PACKAGE_ID.startsWith('REPLACE_WITH')) {
    throw new Error('SUBSCRIPTION_PACKAGE_ID is not configured in constants.ts');
  }
  if (!treasuryId || treasuryId.startsWith('REPLACE_WITH')) {
    throw new Error('SUBSCRIPTION_TREASURY_ID is not configured in constants.ts or override');
  }
}

export function usePurchaseSubscription() {
  const signAndExecute = useSignAndExecuteTransaction();

  const purchase = useCallback(async (input: PurchaseInput) => {
    const treasuryId = input.overrideTreasuryId || SUBSCRIPTION_TREASURY_ID;
    assertConfigured(treasuryId);

    if (!input.subsId) throw new Error('Missing CreatorSubscriptions ID');
    if (!input.tierId || input.tierId <= 0) throw new Error('Invalid tier');

    const amountMist = BigInt(Math.round(input.amountSui * 1_000_000_000));

    const tx = new Transaction();

    // create payment from gas coin
    const [payment] = tx.splitCoins(tx.gas, [tx.pure.u64(amountMist)]);

    tx.moveCall({
      target: `${SUBSCRIPTION_PACKAGE_ID}::subscription::purchase_subscription`,
      arguments: [
        tx.object(input.subsId),
        tx.object(treasuryId),
        tx.pure.u8(input.tierId),
        payment,
        tx.object(SUI_CLOCK_OBJECT_ID),
      ],
    });

    tx.setGasBudget(30_000_000);

    const res = await signAndExecute.mutateAsync({
      transaction: tx,
      options: { showEffects: true, showObjectChanges: true },
    });

    return res;
  }, [signAndExecute]);

  return { purchase, isPending: signAndExecute.isPending } as const;
}
