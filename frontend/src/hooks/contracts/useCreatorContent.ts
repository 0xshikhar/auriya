"use client";

import { useState, useEffect } from 'react';
import { getRegistryPostIds, getContentPost, ContentPostFields } from '@/lib/content';

export interface CreatorContentPost {
  id: string;
  fields: ContentPostFields;
}

/**
 * Hook to fetch all content posts for a creator
 * Requires the creator's content registry ID
 */
export function useCreatorContent(registryId?: string) {
  const [posts, setPosts] = useState<CreatorContentPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🎣 [useCreatorContent] Hook triggered', { registryId });
    
    if (!registryId) {
      console.log('⚠️ [useCreatorContent] No registry ID provided');
      setPosts([]);
      return;
    }

    let cancelled = false;

    async function fetchPosts() {
      console.log('🚀 [useCreatorContent] Starting fetch for registry:', registryId);
      setIsLoading(true);
      setError(null);
      
      try {
        // Get post IDs from registry
        console.log('📋 [useCreatorContent] Fetching post IDs...');
        const postIds = await getRegistryPostIds(registryId as string);
        console.log('✅ [useCreatorContent] Got post IDs:', postIds);

        if (postIds.length === 0) {
          console.log('ℹ️ [useCreatorContent] No posts found in registry');
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
  }, [registryId]);

  return { posts, isLoading, error, postCount: posts.length };
}
