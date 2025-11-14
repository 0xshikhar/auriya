import { SuiClient } from '@mysten/sui/client';
import { createSuiClient } from '@/lib/sui';
import { SUBSCRIPTION_PACKAGE_ID } from '@/lib/constants';

export interface SubscriptionNFTFields {
  creator: string;
  subscriber: string;
  tier_id: number | string;
  expires_at: number | string;
}

export async function hasActiveSubscriptionForCreator(
  userAddress: string,
  creatorAddress: string,
  minTier: number,
): Promise<{ active: boolean; highestTier: number } | null> {
  if (!SUBSCRIPTION_PACKAGE_ID || SUBSCRIPTION_PACKAGE_ID.startsWith('REPLACE_WITH')) {
    // Not configured yet
    return null;
  }
  const client: SuiClient = createSuiClient();

  const type = `${SUBSCRIPTION_PACKAGE_ID}::subscription::SubscriptionNFT`;

  const owned = await client.getOwnedObjects({
    owner: userAddress,
    filter: { StructType: type },
    options: { showContent: true, showType: true },
  });

  let highestTier = 0;
  const now = Date.now();

  for (const item of owned.data) {
    const content: any = item.data?.content;
    if (!content || !('fields' in content)) continue;
    const fields = content.fields as any as SubscriptionNFTFields;
    const creator = String((fields as any).creator);

    // creator in Move is address, serialized as hex string like '0x...'
    if (creator.toLowerCase() !== creatorAddress.toLowerCase()) continue;

    const tier = Number((fields as any).tier_id);
    const expires = Number((fields as any).expires_at);

    if (Number.isFinite(expires) && expires > now) {
      if (tier > highestTier) highestTier = tier;
    }
  }

  return { active: highestTier >= minTier, highestTier };
}
