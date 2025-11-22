"use client";

import { useSuiClientQuery } from '@mysten/dapp-kit';
import { SUBSCRIPTION_PACKAGE_ID } from '@/lib/constants';

export interface SubscriptionData {
  id: string;
  creator: string;
  subscriber: string;
  tier_level: number;
  is_cancelled: boolean;
  expires_at: number;
}

/**
 * Hook to fetch user's subscription NFTs
 * @param subscriberAddress - User's Sui address
 * @returns List of active subscriptions
 */
export function useSubscriptions(subscriberAddress?: string) {
  console.log('🎫 [useSubscriptions] Fetching subscriptions for:', subscriberAddress);
  
  const { data, isLoading, error } = useSuiClientQuery(
    'getOwnedObjects',
    {
      owner: subscriberAddress!,
      filter: {
        StructType: `${SUBSCRIPTION_PACKAGE_ID}::subscription::SubscriptionNFT`,
      },
      options: {
        showContent: true,
        showType: true,
      },
    },
    {
      enabled: !!subscriberAddress,
    }
  );
  
  const subscriptions: SubscriptionData[] = data?.data
    ?.map((obj) => {
      const objData = obj.data;
      if (!objData) {
        console.warn('⚠️ [useSubscriptions] Missing data for object response:', obj);
        return null;
      }

      const content = objData.content as any;
      if (!content || content.dataType !== 'moveObject') {
        console.warn('⚠️ [useSubscriptions] Object is not a Move object or has no content:', objData.objectId);
        return null;
      }

      const fields = content.fields as any | undefined;
      if (!fields) {
        console.warn('⚠️ [useSubscriptions] No fields found for object:', objData.objectId);
        return null;
      }

      const subscription: SubscriptionData = {
        id: objData.objectId!,
        creator: fields.creator,
        subscriber: fields.subscriber,
        tier_level: Number(fields.tier_level ?? fields.tier_id ?? 0),
        is_cancelled: Boolean(fields.is_cancelled ?? false),
        expires_at: Number(fields.expires_at ?? '0'),
      };

      console.log('🎫 [useSubscriptions] Found subscription:', subscription);
      return subscription;
    })
    .filter((sub): sub is SubscriptionData => sub !== null && !sub.is_cancelled) || [];
  
  console.log(`✅ [useSubscriptions] Total active subscriptions: ${subscriptions.length}`);
  
  return {
    subscriptions,
    isLoading,
    error,
  };
}
