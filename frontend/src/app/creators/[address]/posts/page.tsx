"use client";

import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { getRegistryPostIds, getContentPost } from '@/lib/content';

export default function CreatorPostsPage() {
  const params = useParams<{ address: string }>();
  const search = useSearchParams();
  const registry = search.get('registry') || '';
  const subs = search.get('subs') || '';

  const [loading, setLoading] = React.useState(false);
  const [posts, setPosts] = React.useState<any[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!registry) return;
      setLoading(true);
      setError(null);
      try {
        const ids = await getRegistryPostIds(registry);
        const details = await Promise.all(
          ids.map(async (id) => {
            const f = await getContentPost(id);
            return { id, fields: f };
          })
        );
        if (!cancelled) setPosts(details);
      } catch (e: any) {
        if (!cancelled) {
          const msg = e?.message || 'Failed to load posts';
          setError(msg);
          toast.error(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [registry]);

  if (!registry) {
    return (
      <div className="container py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-2">Posts</h1>
        <div className="text-sm text-white/70">Provide the content registry via query: ?registry=0x...</div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-2">Posts</h1>
      <div className="text-sm text-white/60 break-all">Registry: {registry}</div>

      {loading && <div className="mt-6 text-sm text-white/70">Loading…</div>}
      {error && <div className="mt-6 text-sm text-red-400">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {posts.map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle className="text-base">{p.fields?.title || 'Untitled'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-xs text-white/60 break-all">{p.id}</div>
              <div className="text-xs text-white/70">Tier: {p.fields?.required_tier ?? 0}</div>
              <Link
                className="text-sm text-blue-400 underline"
                href={`/creators/${params.address}/posts/${p.id}?registry=${encodeURIComponent(registry)}${subs ? `&subs=${encodeURIComponent(subs)}` : ''}`}
              >
                View
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {!loading && posts.length === 0 && (
        <div className="mt-6 text-sm text-white/70">No posts found.</div>
      )}
    </div>
  );
}
