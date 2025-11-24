"use client";

import { useCallback } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { CONTENT_PACKAGE_ID } from '@/lib/constants';
import { useUnifiedTransaction } from '@/hooks/useUnifiedTransaction';

export type LinkSealPolicyInput = {
  postId: string;
  sealPolicyId: string;
};

export function useLinkSealPolicy() {
  const { signAndExecute, isPending } = useUnifiedTransaction();

  const linkPolicy = useCallback(async (input: LinkSealPolicyInput) => {
    if (!CONTENT_PACKAGE_ID || CONTENT_PACKAGE_ID.startsWith('REPLACE_WITH')) {
      throw new Error('CONTENT_PACKAGE_ID is not configured');
    }

    const tx = new Transaction();

    console.log('🔗 [useLinkSealPolicy] Linking policy to post:', {
      postId: input.postId,
      sealPolicyId: input.sealPolicyId,
    });
    
    tx.moveCall({
      target: `${CONTENT_PACKAGE_ID}::content::set_seal_policy`,
      arguments: [
        tx.object(input.postId),
        tx.pure.string(input.sealPolicyId),
      ],
    });
    
    console.log('✅ [useLinkSealPolicy] Transaction prepared');

    tx.setGasBudget(10_000_000);

    const res = await signAndExecute({ transaction: tx });

    console.log('✅ [useLinkSealPolicy] Policy linked to post', res);
    return res;
  }, [signAndExecute]);

  return { linkPolicy, isPending } as const;
}
