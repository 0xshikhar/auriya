"use client";

import { useState, useEffect } from 'react';
import { getRegistryPostIds, getContentPost, ContentPostFields } from '@/lib/content';
import { createSuiClient } from '@/lib/sui';
import { CONTENT_PACKAGE_ID } from '@/lib/constants';

export interface CreatorContentPost {
  id: string;
  fields: ContentPostFields;
}

/**
 * Hook to fetch all content posts for a creator
 * Requires the creator's content registry ID
 */
export function useCreatorContent(registryId?: string, creatorAddress?: string) {
  const [posts, setPosts] = useState<CreatorContentPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🎣 [useCreatorContent] Hook triggered', { registryId, creatorAddress });
    
    async function resolveRegistryId(): Promise<string | null> {
      if (registryId) return registryId;
      if (!creatorAddress) return null;

      // Fallback: discover registry from RegistryCreated events by this creator
      try {
        console.log('🧭 [useCreatorContent] Resolving registry via events for creator:', creatorAddress);
        const client = createSuiClient();
        const eventType = `${CONTENT_PACKAGE_ID}::content::RegistryCreated`;
        const res = await client.queryEvents({
          query: { MoveEventType: eventType },
          limit: 100,
          order: 'descending',
        });
        const match = (res.data as any[]).find((e: any) => {
          const parsed: any = e.parsedJson || {};
          const evCreator = (parsed.creator || '').toLowerCase();
          return evCreator === creatorAddress.toLowerCase();
        });
        const reg = (match as any)?.parsedJson?.registry_id as string | undefined;
        if (reg) {
          console.log('🆔 [useCreatorContent] Discovered registry from events:', reg);
          return reg;
        }
        console.warn('⚠️ [useCreatorContent] No RegistryCreated event found for creator');
        return null;
      } catch (e) {
        console.warn('⚠️ [useCreatorContent] Failed to resolve registry via events:', e);
        return null;
      }
    }

    let cancelled = false;

    async function fetchPosts() {
      const targetRegistryId = await resolveRegistryId();
      if (!targetRegistryId) {
        console.log('⚠️ [useCreatorContent] No registry ID resolved');
        setPosts([]);
        return;
      }

      console.log('🚀 [useCreatorContent] Starting fetch for registry:', targetRegistryId);
      setIsLoading(true);
      setError(null);
      
      try {
        // Get post IDs from registry
        console.log('📋 [useCreatorContent] Fetching post IDs...');
        let postIds = await getRegistryPostIds(targetRegistryId);
        console.log('✅ [useCreatorContent] Got post IDs:', postIds);

        // Fallback: if registry returns none, derive posts from PostCreated events
        if (postIds.length === 0 && creatorAddress) {
          try {
            console.log('🧭 [useCreatorContent] Fallback: deriving posts from PostCreated events for', creatorAddress);
            const client = createSuiClient();
            const eventType = `${CONTENT_PACKAGE_ID}::content::PostCreated`;
            const res = await client.queryEvents({ query: { MoveEventType: eventType }, limit: 200, order: 'descending' });
            const idsFromEvents = (res.data as any[])
              .filter((e: any) => (e.parsedJson?.creator || '').toLowerCase() === creatorAddress.toLowerCase())
              .map((e: any) => e.parsedJson?.post_id as string)
              .filter((id: any) => typeof id === 'string');
            // Unique, newest first
            const seen = new Set<string>();
            postIds = idsFromEvents.filter((id: string) => (seen.has(id) ? false : (seen.add(id), true)));
            console.log('✅ [useCreatorContent] Fallback post IDs from events:', postIds);
          } catch (evErr) {
            console.warn('⚠️ [useCreatorContent] Failed to fallback to events:', evErr);
          }
        }

        if (postIds.length === 0) {
          console.log('ℹ️ [useCreatorContent] No posts found for creator');
          if (!cancelled) {
            setPosts([]);
            setIsLoading(false);
          }
          return;
        }

        // Fetch details for each post
        console.log(`📦 [useCreatorContent] Fetching details for ${postIds.length} posts...`);
        const postDetails = await Promise.all(
          postIds.map(async (id, index) => {
            try {
              console.log(`  📄 [useCreatorContent] Fetching post ${index + 1}/${postIds.length}: ${id}`);
              const fields = await getContentPost(id);
              console.log(`  ✅ [useCreatorContent] Got post ${index + 1}:`, fields?.title);
              return { id, fields };
            } catch (e) {
              console.warn(`  ❌ [useCreatorContent] Failed to fetch post ${id}:`, e);
              return null;
            }
          })
        );

        if (!cancelled) {
          // Filter out failed fetches and reverse to show newest first
          const validPosts = postDetails
            .filter((p) => p !== null && p.fields !== null) as CreatorContentPost[];
          
          console.log(`🎉 [useCreatorContent] Successfully loaded ${validPosts.length} posts`);
          setPosts(validPosts.reverse());
        }
      } catch (e: any) {
        if (!cancelled) {
          const msg = e?.message || 'Failed to fetch content posts';
          console.error('❌ [useCreatorContent] Error:', e);
          setError(msg);
        }
      } finally {
        if (!cancelled) {
          console.log('🏁 [useCreatorContent] Fetch complete');
          setIsLoading(false);
        }
      }
    }

    fetchPosts();
    return () => {
      cancelled = true;
    };
  }, [registryId, creatorAddress]);

  return { posts, isLoading, error, postCount: posts.length };
}
