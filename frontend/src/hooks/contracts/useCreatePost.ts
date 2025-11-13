"use client";

import { useCallback } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { CONTENT_PACKAGE_ID, SUI_CLOCK_OBJECT_ID } from '@/lib/constants';

export type CreatePostInput = {
  registryId: string;
  title: string;
  description: string;
  contentType: 0 | 1 | 2 | 3 | 4; // see content.move constants
  walrusBlobId: string;
  requiredTier: 0 | 1 | 2 | 3; // 0 = public
};

function assertConfigured() {
  if (!CONTENT_PACKAGE_ID || CONTENT_PACKAGE_ID.startsWith('REPLACE_WITH')) {
    throw new Error('CONTENT_PACKAGE_ID is not configured in constants.ts');
  }
}

export function useCreatePost() {
  const signAndExecute = useSignAndExecuteTransaction();

  const createPost = useCallback(async (input: CreatePostInput) => {
    assertConfigured();

    if (!input.registryId) throw new Error('Missing content registry ID');

    const tx = new Transaction();

    tx.moveCall({
      target: `${CONTENT_PACKAGE_ID}::content::create_post`,
      arguments: [
        tx.object(input.registryId),
        tx.pure.string(input.title),
        tx.pure.string(input.description),
        tx.pure.u8(input.contentType),
        tx.pure.string(input.walrusBlobId),
        tx.pure.u8(input.requiredTier),
        tx.object(SUI_CLOCK_OBJECT_ID),
      ],
    });

    tx.setGasBudget(20_000_000);

    const res = await signAndExecute.mutateAsync({
      transaction: tx,
      // options: { showEffects: true, showObjectChanges: true },
    });

    return res;
  }, [signAndExecute]);

  return { createPost, isPending: signAndExecute.isPending } as const;
}
