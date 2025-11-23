"use client";

import { useCallback } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { CONTENT_PACKAGE_ID } from '@/lib/constants';

function assertConfigured() {
  if (!CONTENT_PACKAGE_ID || CONTENT_PACKAGE_ID.startsWith('REPLACE_WITH')) {
    throw new Error('CONTENT_PACKAGE_ID is not configured in constants.ts');
  }
}

export function useCreateContentRegistry() {
  const signAndExecute = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();

  const createRegistry = useCallback(async () => {
    assertConfigured();

    const tx = new Transaction();
    tx.moveCall({
      target: `${CONTENT_PACKAGE_ID}::content::create_registry`,
      arguments: [],
    });
    tx.setGasBudget(20_000_000);

    const res = await signAndExecute.mutateAsync({ transaction: tx });

    // Wait for transaction to be indexed and fetch object changes
    const digest = (res as any)?.digest as string | undefined;
    if (!digest) {
      throw new Error('Transaction digest not found in response');
    }

    // Poll for transaction with retries (transaction might not be indexed immediately)
    let txInfo: any;
    let retries = 5;
    while (retries > 0) {
      try {
        txInfo = await suiClient.getTransactionBlock({ 
          digest, 
          options: { showObjectChanges: true } 
        });
        if (txInfo?.objectChanges) break;
      } catch (e) {
        console.warn('Waiting for transaction to be indexed...', e);
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      retries--;
    }

    if (!txInfo?.objectChanges) {
      throw new Error('Failed to fetch transaction object changes after retries');
    }

    const objectChanges = txInfo.objectChanges as any[];
    const created = objectChanges.find(
      (c) => c.type === 'created' && 
             typeof c.objectType === 'string' && 
             c.objectType.includes('::content::ContentRegistry')
    );

    if (!created?.objectId) {
      throw new Error('ContentRegistry object ID not found in transaction');
    }

    return { 
      tx: { ...res, objectChanges }, 
      registryId: created.objectId as string,
      digest 
    };
  }, [signAndExecute, suiClient]);

  return { createRegistry, isPending: signAndExecute.isPending } as const;
}
