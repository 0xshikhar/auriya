"use client";

import { useCallback } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { CONTENT_PACKAGE_ID, SUI_CLOCK_OBJECT_ID } from '@/lib/constants';

function assertConfigured() {
  if (!CONTENT_PACKAGE_ID || CONTENT_PACKAGE_ID.startsWith('REPLACE_WITH')) {
    throw new Error('CONTENT_PACKAGE_ID is not configured in constants.ts');
  }
}

export function useRecordView() {
  const signAndExecute = useSignAndExecuteTransaction();

  const recordView = useCallback(async (postId: string, registryId: string) => {
    assertConfigured();
    if (!postId) throw new Error('Missing post id');
    if (!registryId) throw new Error('Missing registry id');

    const tx = new Transaction();
    tx.moveCall({
      target: `${CONTENT_PACKAGE_ID}::content::record_view`,
      arguments: [
        tx.object(postId),
        tx.object(registryId),
        tx.object(SUI_CLOCK_OBJECT_ID),
      ],
    });

    tx.setGasBudget(8_000_000);

    const res = await signAndExecute.mutateAsync({
      transaction: tx,
      // options: { showEffects: true },
    });

    return res;
  }, [signAndExecute]);

  return { recordView, isPending: signAndExecute.isPending } as const;
}
