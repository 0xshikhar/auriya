"use client";

import { useCallback } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { SEAL_ACCESS_CONTROL_PACKAGE_ID, SUI_CLOCK_OBJECT_ID } from '@/lib/constants';
import { createSuiClient } from '@/lib/sui';
import { useUnifiedTransaction } from '@/hooks/useUnifiedTransaction';

export type CreateAccessPolicyInput = {
  creator: string;
  contentPostId: string; // Content post object ID
  requiredTier: number;
};

export function useCreateAccessPolicy() {
  const { signAndExecute, isPending } = useUnifiedTransaction();

  const createPolicy = useCallback(async (input: CreateAccessPolicyInput) => {
    if (!SEAL_ACCESS_CONTROL_PACKAGE_ID || SEAL_ACCESS_CONTROL_PACKAGE_ID.startsWith('REPLACE_WITH')) {
      throw new Error('SEAL_ACCESS_CONTROL_PACKAGE_ID is not configured');
    }

    const tx = new Transaction();
    const timestamp = Date.now();

    console.log('🛡️ [useCreateAccessPolicy] Creating AccessPolicy with params:', {
      creator: input.creator,
      contentPostId: input.contentPostId,
      requiredTier: input.requiredTier,
      timestamp,
    });
    
    tx.moveCall({
      target: `${SEAL_ACCESS_CONTROL_PACKAGE_ID}::content_access::create_policy`,
      arguments: [
        tx.pure.address(input.creator),
        tx.pure.id(input.contentPostId),
        tx.pure.u8(input.requiredTier),
        tx.pure.u64(timestamp),
      ],
    });
    
    console.log('✅ [useCreateAccessPolicy] Transaction prepared');

    tx.setGasBudget(10_000_000);

    const res = await signAndExecute({ transaction: tx });
    // Ensure we have effects/object changes by waiting on the digest
    // @ts-ignore
    const digest = res?.digest as string | undefined;
    if (!digest) return res;
    const client = createSuiClient();
    const full = await (client as any).waitForTransactionBlock?.({
      digest,
      options: { showEffects: true, showEvents: true, showObjectChanges: true } as any,
    }) ?? await (client as any).waitForTransaction({
      digest,
      options: { showEffects: true, showEvents: true, showObjectChanges: true } as any,
    });
    console.log('✅ [useCreateAccessPolicy] AccessPolicy created (waited):', full);
    return full as any;
  }, [signAndExecute]);

  return { createPolicy, isPending } as const;
}
