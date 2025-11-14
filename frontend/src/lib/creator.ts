import { SuiClient } from '@mysten/sui/client';
import { createSuiClient } from '@/lib/sui';
import { CREATOR_PROFILE_PACKAGE_ID } from '@/lib/constants';

export interface CreatorProfileFields {
  owner: string;
  suins_name?: { fields?: { some?: string } } | null;
  display_name: string;
  bio: string;
  avatar_walrus_id: string;
  banner_walrus_id: string;
  category: string;
  total_subscribers: string | number;
  total_revenue_mist: string | number;
}

export async function getOwnedCreatorProfiles(address: string) {
  if (!CREATOR_PROFILE_PACKAGE_ID || CREATOR_PROFILE_PACKAGE_ID.startsWith('REPLACE_WITH')) {
    return [] as any[];
  }
  const client: SuiClient = createSuiClient();
  const type = `${CREATOR_PROFILE_PACKAGE_ID}::creator_profile::CreatorProfile`;
  const res = await client.getOwnedObjects({
    owner: address,
    filter: { StructType: type },
    options: { showContent: true, showType: true },
  });
  return res.data;
}

export function extractFields(obj: any): CreatorProfileFields | null {
  const content: any = obj?.data?.content;
  if (!content || !('fields' in content)) return null;
  return content.fields as any as CreatorProfileFields;
}
