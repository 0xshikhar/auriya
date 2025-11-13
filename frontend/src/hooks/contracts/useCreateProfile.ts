"use client";

import { useCallback } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { CREATOR_PROFILE_PACKAGE_ID, CREATOR_PROFILE_REGISTRY_ID, SUI_CLOCK_OBJECT_ID } from '@/lib/constants';

export type CreateProfileInput = {
  displayName: string;
  bio: string;
  avatarWalrusId: string;
  bannerWalrusId: string;
  category: string;
};

function assertConfigured() {
  if (!CREATOR_PROFILE_PACKAGE_ID || CREATOR_PROFILE_PACKAGE_ID.startsWith('REPLACE_WITH')) {
    throw new Error('CREATOR_PROFILE_PACKAGE_ID is not configured in constants.ts');
  }
  if (!CREATOR_PROFILE_REGISTRY_ID || CREATOR_PROFILE_REGISTRY_ID.startsWith('REPLACE_WITH')) {
    throw new Error('CREATOR_PROFILE_REGISTRY_ID is not configured in constants.ts');
  }
}

export function useCreateProfile() {
  const signAndExecute = useSignAndExecuteTransaction();

  const createProfile = useCallback(async (input: CreateProfileInput) => {
    assertConfigured();

    const tx = new Transaction();

    tx.moveCall({
      target: `${CREATOR_PROFILE_PACKAGE_ID}::creator_profile::create_profile`,
      arguments: [
        tx.object(CREATOR_PROFILE_REGISTRY_ID),
        tx.pure.string(input.displayName),
        tx.pure.string(input.bio),
        tx.pure.string(input.avatarWalrusId),
        tx.pure.string(input.bannerWalrusId),
        tx.pure.string(input.category),
        tx.object(SUI_CLOCK_OBJECT_ID),
      ],
    });

    tx.setGasBudget(20_000_000);

    const res = await signAndExecute.mutateAsync({
      transaction: tx,
      options: { showEffects: true, showObjectChanges: true },
    });

    return res;
  }, [signAndExecute]);

  return { createProfile, isPending: signAndExecute.isPending } as const;
}
