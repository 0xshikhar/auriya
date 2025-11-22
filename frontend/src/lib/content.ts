import { SuiClient } from '@mysten/sui/client';
import { createSuiClient } from '@/lib/sui';

export type ContentType = 0 | 1 | 2 | 3 | 4; // text,image,video,audio,file

export interface ContentPostFields {
  creator: string;
  title: string;
  description: string;
  content_type: ContentType;
  walrus_blob_id: string;
  required_tier: 0 | 1 | 2 | 3;
  created_at: string | number;
  updated_at: string | number;
  likes: string | number;
  views: string | number;
  is_published: boolean;
  tags: string[] | { fields?: { name: string }[] };
  // Seal encryption metadata stored on-chain as Option<String>
  // Can be a string, or an object with `{ fields: { some: string } }` depending on RPC shape
  encryption_metadata?: any;
}

export async function getObjectFields(client: SuiClient, objectId: string): Promise<any | null> {
  const res = await client.getObject({ id: objectId, options: { showContent: true, showType: true } });
  if (!res.data?.content || !('fields' in res.data.content)) return null;
  // @ts-ignore
  return res.data.content.fields;
}

export async function getContentPost(objectId: string) {
  const client = createSuiClient();
  const fields = await getObjectFields(client, objectId);
  if (!fields) return null;
  return fields as ContentPostFields;
}

export async function getRegistryPostIds(registryId: string): Promise<string[]> {
  console.log('📋 [getRegistryPostIds] Fetching post IDs for registry:', registryId);
  const client = createSuiClient();

  const fetchOnce = async () => {
    const res = await client.getObject({ id: registryId, options: { showContent: true, showType: true } });
    console.log('📦 [getRegistryPostIds] Registry object response:', JSON.stringify(res, null, 2));
    if (!res.data?.content || !('fields' in res.data.content)) {
      console.warn('⚠️ [getRegistryPostIds] No fields found in registry');
      return { ids: [] as string[], count: 0 };
    }
    const fields = res.data.content.fields as any;
    console.log('🔍 [getRegistryPostIds] Registry fields:', JSON.stringify(fields, null, 2));
    const postIds = fields.post_ids || [];
    const postCount = Number(fields.post_count || 0);
    console.log('📝 [getRegistryPostIds] Raw post_ids:', JSON.stringify(postIds, null, 2));
    if (!Array.isArray(postIds)) {
      console.warn('⚠️ [getRegistryPostIds] post_ids is not an array:', typeof postIds);
      return { ids: [] as string[], count: postCount };
    }
    const ids = postIds.filter((id: any) => typeof id === 'string') as string[];
    console.log('✅ [getRegistryPostIds] Extracted post IDs:', ids);
    return { ids, count: postCount };
  };

  // Poll briefly if ids are lagging behind the on-chain post_count (indexing delay)
  let attempts = 5;
  let lastIds: string[] = [];
  while (attempts-- > 0) {
    const { ids, count } = await fetchOnce();
    lastIds = ids;
    if (count <= ids.length || attempts === 0) {
      if (count > ids.length) {
        console.log(`⏱️ [getRegistryPostIds] Returning ids after retries (count=${count}, ids=${ids.length})`);
      }
      return ids;
    }
    console.log(`⏳ [getRegistryPostIds] post_ids (${ids.length}) < post_count (${count}), retrying...`);
    await new Promise((r) => setTimeout(r, 1200));
  }
  return lastIds;
}
