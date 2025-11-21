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
  const res = await client.getObject({ 
    id: registryId, 
    options: { showContent: true, showType: true } 
  });
  
  console.log('📦 [getRegistryPostIds] Registry object response:', JSON.stringify(res, null, 2));
  
  if (!res.data?.content || !('fields' in res.data.content)) {
    console.warn('⚠️ [getRegistryPostIds] No fields found in registry');
    return [];
  }
  
  const fields = res.data.content.fields as any;
  console.log('🔍 [getRegistryPostIds] Registry fields:', JSON.stringify(fields, null, 2));
  
  // Handle vector<ID> format from Sui
  const postIds = fields.post_ids || [];
  console.log('📝 [getRegistryPostIds] Raw post_ids:', JSON.stringify(postIds, null, 2));
  
  if (!Array.isArray(postIds)) {
    console.warn('⚠️ [getRegistryPostIds] post_ids is not an array:', typeof postIds);
    return [];
  }
  
  // Sui returns vector<ID> as array of strings
  const ids = postIds.filter((id: any) => typeof id === 'string') as string[];
  console.log('✅ [getRegistryPostIds] Extracted post IDs:', ids);
  
  return ids;
}
