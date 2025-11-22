"use client";

import { useCallback } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { CONTENT_PACKAGE_ID, SUI_CLOCK_OBJECT_ID } from '@/lib/constants';
import { useUnifiedTransaction } from '@/hooks/useUnifiedTransaction';

export type CreatePostInput = {
  registryId: string;
  title: string;
  description: string;
  contentType: 0 | 1 | 2 | 3 | 4; // see content.move constants
  walrusBlobId: string;
  requiredTier: 0 | 1 | 2 | 3; // 0 = public
  encryptionMetadata?: string; // Seal encryption metadata (JSON string)
};

function assertConfigured() {
  if (!CONTENT_PACKAGE_ID || CONTENT_PACKAGE_ID.startsWith('REPLACE_WITH')) {
    throw new Error('CONTENT_PACKAGE_ID is not configured in constants.ts');
  }
}

export function useCreatePost() {
  const { signAndExecute, isPending } = useUnifiedTransaction();

  const createPost = useCallback(async (input: CreatePostInput) => {
    assertConfigured();

    if (!input.registryId) throw new Error('Missing content registry ID');

    const tx = new Transaction();

    console.log('📝 [useCreatePost] Creating post with params:', {
      registryId: input.registryId,
      title: input.title,
      contentType: input.contentType,
      requiredTier: input.requiredTier,
      hasEncryption: !!input.encryptionMetadata
    });
    
    tx.moveCall({
      target: `${CONTENT_PACKAGE_ID}::content::create_post`,
      arguments: [
        tx.object(input.registryId),
        tx.pure.string(input.title),
        tx.pure.string(input.description),
        tx.pure.u8(input.contentType),
        tx.pure.string(input.walrusBlobId),
        tx.pure.u8(input.requiredTier),
        tx.pure.string(input.encryptionMetadata || ''), // Seal encryption metadata
        tx.object(SUI_CLOCK_OBJECT_ID),
      ],
    });
    
    console.log('✅ [useCreatePost] Transaction prepared');

    tx.setGasBudget(20_000_000);

    const res = await signAndExecute({ transaction: tx });

    return res;
  }, [signAndExecute]);

  return { createPost, isPending } as const;
}
