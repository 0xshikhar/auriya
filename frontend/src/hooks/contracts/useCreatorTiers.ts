"use client";

import { useSuiClientQuery } from '@mysten/dapp-kit';
import { SUBSCRIPTION_PACKAGE_ID } from '@/lib/constants';

export interface CreatorTier {
  id: string;
  tierId: number;
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

  // Step 1: find the creator's subscription object ID from events (shared object isn't owned by the creator)
  const {
    data: events,
    isLoading: loadingEvents,
    error: eventsError,
    refetch: refetchEvents,
  } = useSuiClientQuery(
    'queryEvents',
    {
      query: {
        All: [
          { MoveEventType: `${SUBSCRIPTION_PACKAGE_ID}::subscription::TiersCreated` },
          { Sender: (creatorAddress || '') as string },
        ],
      } as any,
      limit: 50,
    } as any,
    {
      enabled: !!creatorAddress && !!SUBSCRIPTION_PACKAGE_ID,
      refetchInterval: 10000,
      staleTime: 0,
    }
  );

  const allEvents = (events as any)?.data || [];
  const matching = allEvents.filter((e: any) => {
    const creator = (e.parsedJson?.creator as string) || '';
    return creator.toLowerCase() === (creatorAddress || '').toLowerCase();
  });

  const latest = matching[0];
  // subscription_id can be a string or an object with { id }
  const subIdRaw = latest?.parsedJson?.subscription_id;
  const discoveredSubscriptionId: string | undefined =
    typeof subIdRaw === 'string' ? subIdRaw : subIdRaw?.id;

  console.log('📡 [useCreatorTiers] Events found:', allEvents.length, 'matching:', matching.length);
  console.log('📎 [useCreatorTiers] Discovered subscription object ID:', discoveredSubscriptionId);

  // Fallback: search transactions that called create_tiers from this address
  // This runs in parallel with events query since events may have indexing delay
  const {
    data: txs,
    isLoading: loadingTxs,
    error: txsError,
    refetch: refetchTxs,
  } = useSuiClientQuery(
    'queryTransactionBlocks',
    {
      filter: {
        FromAddress: (creatorAddress || '') as string,
      } as any,
      options: { showObjectChanges: true, showEffects: true },
      limit: 50,
    } as any,
    {
      enabled: !!creatorAddress && !!SUBSCRIPTION_PACKAGE_ID,
      refetchInterval: 12_000,
      staleTime: 0,
    }
  );

  console.log('🔎 [useCreatorTiers] Transaction query result:', {
    txCount: (txs as any)?.data?.length || 0,
    loadingTxs,
    txsError: txsError?.message,
  });

  let discoveredFromTx: string | undefined = undefined;
  const txData = (txs as any)?.data as any[] | undefined;
  if (txData && txData.length) {
    for (const tx of txData) {
      const changes = (tx?.objectChanges as any[]) || [];
      const created = changes.find(
        (c: any) => c.type === 'created' && typeof c.objectType === 'string' && c.objectType.endsWith('::subscription::CreatorSubscriptions')
      );
      if (created?.objectId) {
        discoveredFromTx = created.objectId;
        break;
      }
    }
  }

  const finalSubscriptionId = discoveredSubscriptionId || discoveredFromTx;
  if (!discoveredSubscriptionId && discoveredFromTx) {
    console.log('🧭 [useCreatorTiers] Fallback discovered subscription object via txs:', discoveredFromTx);
  }

  // Step 2: fetch the subscription object by ID
  const {
    data: subObject,
    isLoading: loadingObject,
    error: objectError,
    refetch: refetchObject,
  } = useSuiClientQuery(
    'getObject',
    {
      id: finalSubscriptionId!,
      options: { showContent: true, showType: true },
    },
    {
      enabled: !!finalSubscriptionId,
      refetchInterval: 10_000,
      staleTime: 0,
    }
  );

  const tiers: CreatorTier[] = [];
  const subscriptionObject = (subObject as any)?.data;

  if (subscriptionObject?.content?.dataType === 'moveObject') {
    const fields = (subscriptionObject.content as any).fields;
    console.log('✅ [useCreatorTiers] Loaded subscription object:', subscriptionObject?.objectId);
    console.log('📋 [useCreatorTiers] Full fields:', JSON.stringify(fields, null, 2));

    // The JSON shape for vector<SubscriptionTier> is an array of structs with a `fields` object
    const tiersVector = (fields?.tiers as any[]) || [];
    console.log('🎯 [useCreatorTiers] tiersVector length:', tiersVector.length);

    for (let i = 0; i < tiersVector.length; i++) {
      const tierNode = tiersVector[i];
      const t = tierNode?.fields ?? tierNode; // be defensive

      const priceMist = BigInt(t?.price_mist || 0);
      const priceSui = Number(priceMist) / 1_000_000_000;
      const durationMs = BigInt(t?.duration_ms || 0);
      const durationDays = Number(durationMs) / (24 * 60 * 60 * 1000);

      tiers.push({
        id: `tier-${t?.tier_id ?? i + 1}`,
        tierId: Number(t?.tier_id ?? i + 1),
        name: t?.name || `Tier ${i + 1}`,
        price: priceSui.toFixed(2),
        duration: Math.round(durationDays),
        currency: 'SUI',
        benefits: Array.isArray(t?.benefits) ? t.benefits : [
          'Access to exclusive content',
          'Support the creator',
          `${Math.round(durationDays)} days of membership`,
        ],
      });
    }

    console.log('🎉 [useCreatorTiers] Parsed tiers:', tiers);
  } else if (finalSubscriptionId) {
    console.warn('⚠️ [useCreatorTiers] Subscription object not in expected shape for ID:', finalSubscriptionId);
  }

  const isLoading = loadingEvents || loadingTxs || loadingObject;
  const error = eventsError || txsError || objectError;
  const subscriptionObjectId = finalSubscriptionId;

  return {
    tiers,
    subscriptionObjectId,
    isLoading,
    error,
    refetch: async () => {
      await refetchEvents();
      if (!subscriptionObjectId) await refetchTxs();
      if (subscriptionObjectId) await refetchObject();
    },
  };
}
