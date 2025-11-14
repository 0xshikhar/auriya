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
  const client = createSuiClient();
  const fields = await getObjectFields(client, registryId);
  if (!fields) return [];
  const ids = (fields.post_ids?.fields?.contents as any[]) || fields.post_ids || [];
  // Support both vector<ID> representations
  if (Array.isArray(ids)) {
    if (ids.length && ids[0]?.fields?.id?.id) return ids.map((x) => x.fields.id.id as string);
    if (typeof ids[0] === 'string') return ids as string[];
  }
  return [];
}
