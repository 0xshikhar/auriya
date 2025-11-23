"use client";

import { useSuiClientQuery } from '@mysten/dapp-kit';
import { CONTENT_PACKAGE_ID } from '@/lib/constants';
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
    if (!registryId) {
      setPosts([]);
      return;
    }

    let cancelled = false;

    async function fetchPosts() {
      setIsLoading(true);
      setError(null);
      try {
        // Get post IDs from registry
        const postIds = await getRegistryPostIds(registryId);

        // Fetch details for each post
        const postDetails = await Promise.all(
          postIds.map(async (id) => {
            try {
              const fields = await getContentPost(id);
              return { id, fields };
            } catch (e) {
              console.warn(`Failed to fetch post ${id}:`, e);
              return null;
            }
          })
        );

        if (!cancelled) {
          // Filter out failed fetches and reverse to show newest first
          const validPosts = postDetails
            .filter((p) => p !== null && p.fields !== null) as CreatorContentPost[];
          setPosts(validPosts.reverse());
        }
      } catch (e: any) {
        if (!cancelled) {
          const msg = e?.message || 'Failed to fetch content posts';
          setError(msg);
          console.error('Content fetch error:', e);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchPosts();
    return () => {
      cancelled = true;
    };
  }, [registryId]);

  return { posts, isLoading, error, postCount: posts.length };
}
