"use client";

import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AccessGate from '@/components/content/AccessGate';
import { getContentPost } from '@/lib/content';
import { getWalrusUrl } from '@/lib/walrus';
import { Button } from '@/components/ui/button';
import { useRecordView } from '@/hooks/contracts/useRecordView';
import { useLikePost } from '@/hooks/contracts/useLikePost';
import Image from 'next/image';
import CommentSection from '@/components/comments/CommentSection';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function PostViewerPage() {
  const params = useParams<{ address: string; id: string }>();
  const search = useSearchParams();
  const registry = search.get('registry') || '';
  const subs = search.get('subs') || '';

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [post, setPost] = React.useState<any | null>(null);

  const { recordView } = useRecordView();
  const { like, isPending: likePending } = useLikePost();

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const fields = await getContentPost(params.id);
        if (!cancelled) setPost(fields);
      } catch (e: any) {
        if (!cancelled) {
          const msg = e?.message || 'Failed to load post';
          setError(msg);
          toast.error(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    // Record view when loaded
    if (registry) {
      recordView(params.id, registry).catch(() => {});
    }
    return () => { cancelled = true; };
  }, [params.id, registry, recordView]);

  if (loading)
    return (
      <div className="container py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-2/3 mb-4" />
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  if (error) return <div className="container py-8 text-red-400">{error}</div>;
  if (!post) return <div className="container py-8">Not found</div>;

  const media = (
    <div className="mt-4">
      {/* naive display based on content_type */}
      {post.content_type === 1 && (
        <Image
          src={getWalrusUrl(post.walrus_blob_id)}
          alt={post.title}
          width={1200}
          height={675}
          className="max-w-full h-auto rounded-lg border border-white/10"
        />
      )}
      {post.content_type === 2 && (
        <video className="w-full rounded-lg border border-white/10" controls>
          <source src={getWalrusUrl(post.walrus_blob_id)} />
        </video>
      )}
      {post.content_type === 3 && (
        <audio className="w-full" controls>
          <source src={getWalrusUrl(post.walrus_blob_id)} />
        </audio>
      )}
      {post.content_type === 4 && (
        <a className="text-blue-400 underline" href={getWalrusUrl(post.walrus_blob_id)} target="_blank" rel="noreferrer">
          Download file
        </a>
      )}
    </div>
  );

  return (
    <div className="container py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{post.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-white/70 text-sm">{post.description}</div>

          <div className="my-4">
            <AccessGate creatorAddress={params.address} requiredTier={post.required_tier} subsIdHint={subs || undefined}>
              {media}
            </AccessGate>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                if (!registry) return;
                try {
                  await like(params.id, registry);
                  toast.success('Liked');
                } catch (e: any) {
                  toast.error(e?.message || 'Failed to like');
                }
              }}
              disabled={!registry || likePending}
            >
              {likePending ? 'Liking…' : 'Like'}
            </Button>
          </div>

          {/* Comments */}
          <CommentSection
            postId={params.id}
            creatorAddress={params.address}
            requiredTier={post.required_tier}
          />
        </CardContent>
      </Card>
    </div>
  );
}
