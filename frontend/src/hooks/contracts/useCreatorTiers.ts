"use client";

import { useSuiClientQuery } from '@mysten/dapp-kit';
import { SUBSCRIPTION_PACKAGE_ID } from '@/lib/constants';

export interface CreatorTier {
  id: string;
  name: string;
  price: string; // SUI amount
  duration: number; // days
  currency: string;
  benefits: string[];
}

/**
 * Hook to fetch creator's subscription tiers
 */
export function useCreatorTiers(creatorAddress?: string) {
  console.log('🔍 [useCreatorTiers] Starting fetch for address:', creatorAddress);
  console.log('🔍 [useCreatorTiers] SUBSCRIPTION_PACKAGE_ID:', SUBSCRIPTION_PACKAGE_ID);

  const { data: ownedObjects, isLoading, error, refetch } = useSuiClientQuery(
    'getOwnedObjects',
    {
      owner: creatorAddress!,
      filter: {
        StructType: `${SUBSCRIPTION_PACKAGE_ID}::subscription::CreatorSubscriptions`,
      },
      options: {
        showContent: true,
        showType: true,
      },
    },
    {
      enabled: !!creatorAddress && !!SUBSCRIPTION_PACKAGE_ID,
      refetchInterval: 5000,
      staleTime: 0,
    }
  );

  console.log('📦 [useCreatorTiers] Query result:', {
    isLoading,
    error: error?.message,
    objectCount: ownedObjects?.data?.length || 0,
    hasData: !!ownedObjects,
  });

  const subscriptionObject = ownedObjects?.data?.[0];
  const tiers: CreatorTier[] = [];

  if (subscriptionObject?.data?.content?.dataType === 'moveObject') {
    const fields = (subscriptionObject.data.content as any).fields;
    
    console.log('✅ [useCreatorTiers] Found subscription object!');
    console.log('📋 [useCreatorTiers] Object ID:', subscriptionObject.data.objectId);
    console.log('📋 [useCreatorTiers] Full fields:', JSON.stringify(fields, null, 2));
    
    // Extract tier data from the Move object - tiers is a vector of SubscriptionTier structs
    const tiersVector = fields?.tiers || [];

    console.log('🎯 [useCreatorTiers] Tiers vector length:', tiersVector.length);
    console.log('🎯 [useCreatorTiers] Tiers vector:', JSON.stringify(tiersVector, null, 2));

    for (let i = 0; i < tiersVector.length; i++) {
      const tier = tiersVector[i];
      console.log(`🔸 [useCreatorTiers] Processing tier ${i}:`, tier);
      
      const priceMist = BigInt(tier.price_mist || 0);
      const priceSui = Number(priceMist) / 1_000_000_000;
      
      const durationMs = BigInt(tier.duration_ms || 0);
      const durationDays = Number(durationMs) / (24 * 60 * 60 * 1000);

      const processedTier = {
        id: `tier-${tier.tier_id || i}`,
        name: tier.name || `Tier ${i + 1}`,
        price: priceSui.toFixed(2),
        duration: Math.round(durationDays),
        currency: 'SUI',
        benefits: tier.benefits || [
          'Access to exclusive content',
          'Support the creator',
          `${Math.round(durationDays)} days of membership`,
        ],
      };

      console.log(`✅ [useCreatorTiers] Processed tier ${i}:`, processedTier);
      tiers.push(processedTier);
    }

    console.log('🎉 [useCreatorTiers] Total tiers processed:', tiers.length);
  } else {
    console.warn('⚠️ [useCreatorTiers] No subscription object found or wrong data type');
    console.log('📦 [useCreatorTiers] Subscription object:', subscriptionObject);
  }

  return {
    tiers,
    subscriptionObjectId: subscriptionObject?.data?.objectId,
    isLoading,
    error,
    refetch,
  };
}
