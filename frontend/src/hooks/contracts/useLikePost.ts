"use client";

import { useCallback } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { CONTENT_PACKAGE_ID, SUI_CLOCK_OBJECT_ID } from '@/lib/constants';
import { useUnifiedTransaction } from '@/hooks/useUnifiedTransaction';

function assertConfigured() {
  if (!CONTENT_PACKAGE_ID || CONTENT_PACKAGE_ID.startsWith('REPLACE_WITH')) {
    throw new Error('CONTENT_PACKAGE_ID is not configured in constants.ts');
  }
}

export function useLikePost() {
  const { signAndExecute, isPending } = useUnifiedTransaction();

  const like = useCallback(async (postId: string, registryId: string) => {
    assertConfigured();
    if (!postId) throw new Error('Missing post id');
    if (!registryId) throw new Error('Missing registry id');

    const tx = new Transaction();
    tx.moveCall({
      target: `${CONTENT_PACKAGE_ID}::content::like_post`,
      arguments: [
        tx.object(postId),
        tx.object(registryId),
        tx.object(SUI_CLOCK_OBJECT_ID),
      ],
    });

    tx.setGasBudget(10_000_000);

    const res = await signAndExecute({ transaction: tx });

    return res;
  }, [signAndExecute]);

  return { like, isPending } as const;
}
