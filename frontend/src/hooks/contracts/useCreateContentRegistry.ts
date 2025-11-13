"use client";

import { useCallback } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { CONTENT_PACKAGE_ID } from '@/lib/constants';

function assertConfigured() {
  if (!CONTENT_PACKAGE_ID || CONTENT_PACKAGE_ID.startsWith('REPLACE_WITH')) {
    throw new Error('CONTENT_PACKAGE_ID is not configured in constants.ts');
  }
}

export function useCreateContentRegistry() {
  const signAndExecute = useSignAndExecuteTransaction();

  const createRegistry = useCallback(async () => {
    assertConfigured();

    const tx = new Transaction();
    tx.moveCall({
      target: `${CONTENT_PACKAGE_ID}::content::create_registry`,
      arguments: [],
    });
    tx.setGasBudget(20_000_000);

    const res = await signAndExecute.mutateAsync({
      transaction: tx,
      options: { showEffects: true, showObjectChanges: true },
    });

    const created = (res?.objectChanges as any[] | undefined)?.find(
      (c) => c.type === 'created' && typeof c.objectType === 'string' && c.objectType.endsWith('::content::ContentRegistry')
    );

    return { tx: res, registryId: created?.objectId as string | undefined };
  }, [signAndExecute]);

  return { createRegistry, isPending: signAndExecute.isPending } as const;
}
