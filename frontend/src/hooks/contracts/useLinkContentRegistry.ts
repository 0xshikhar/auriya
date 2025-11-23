"use client";

import { useCallback } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { CREATOR_PROFILE_PACKAGE_ID } from '@/lib/constants';

export function useLinkContentRegistry() {
  const signAndExecute = useSignAndExecuteTransaction();

  const linkRegistry = useCallback(async (profileId: string, registryId: string) => {
    if (!CREATOR_PROFILE_PACKAGE_ID || CREATOR_PROFILE_PACKAGE_ID.startsWith('REPLACE_WITH')) {
      throw new Error('CREATOR_PROFILE_PACKAGE_ID is not configured');
    }

    if (!profileId || !registryId) {
      throw new Error('Profile ID and Registry ID are required');
    }

    const tx = new Transaction();
    tx.moveCall({
      target: `${CREATOR_PROFILE_PACKAGE_ID}::creator_profile::link_content_registry`,
      arguments: [
        tx.object(profileId),
        tx.pure.id(registryId),
      ],
    });
    tx.setGasBudget(10_000_000);

    const res = await signAndExecute.mutateAsync({ transaction: tx });
    return res;
  }, [signAndExecute]);

  return { linkRegistry, isPending: signAndExecute.isPending } as const;
}
