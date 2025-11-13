"use client";

import { useCallback } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { CONTENT_PACKAGE_ID } from '@/lib/constants';
import { createSuiClient } from '@/lib/sui';

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

    const res = await signAndExecute.mutateAsync({ transaction: tx });

    // Enrich with objectChanges via RPC using digest
    const client = createSuiClient();
    const digest = (res as any)?.digest as string | undefined;
    let objectChanges: any[] | undefined;
    if (digest) {
      const txInfo = await client.getTransactionBlock({ digest, options: { showObjectChanges: true } });
      objectChanges = (txInfo as any)?.objectChanges as any[] | undefined;
    }

    const created = (objectChanges || [])?.find(
      (c) => c.type === 'created' && typeof c.objectType === 'string' && c.objectType.endsWith('::content::ContentRegistry')
    );

    // Return original result but also include objectChanges for callers expecting it
    const enriched: any = { ...res, objectChanges };
    return { tx: enriched, registryId: created?.objectId as string | undefined };
  }, [signAndExecute]);

  return { createRegistry, isPending: signAndExecute.isPending } as const;
}
