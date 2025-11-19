"use client";

import React from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import AddressName from '@/components/web3/AddressName';
import { hasActiveSubscriptionForCreator } from '@/lib/subscriptions';
import { toast } from 'sonner';

export type UiComment = {
  id: string;
  author: string;
  content: string;
  createdAt: number;
};

function timeAgo(ts: number) {
  const d = Math.max(0, Date.now() - ts);
  const mins = Math.floor(d / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function CommentSection({
  postId,
  creatorAddress,
  requiredTier,
}: {
  postId: string;
  creatorAddress: string;
  requiredTier: number; // 0..3
}) {
  const account = useCurrentAccount();
  const [comments, setComments] = React.useState<UiComment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [text, setText] = React.useState('');
  const [canComment, setCanComment] = React.useState(false);
  const [checkingGate, setCheckingGate] = React.useState(true);
  const [posting, setPosting] = React.useState(false);

  // Policy: Require at least Silver (2) to comment, or higher if post requires higher
  const minTierToComment = Math.max(2, requiredTier);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const r = await fetch(`/api/comments/${postId}`, { cache: 'no-store' });
        const json = await r.json();
        if (!cancelled) setComments((json?.comments || []) as UiComment[]);
      } catch (e: any) {
        if (!cancelled) toast.error(e?.message || 'Failed to load comments');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [postId]);

  React.useEffect(() => {
    let cancelled = false;
    async function check() {
      setCheckingGate(true);
      try {
        if (!account?.address) {
          setCanComment(false);
        } else {
          const r = await hasActiveSubscriptionForCreator(account.address, creatorAddress, minTierToComment);
          setCanComment(!!r && r.active);
        }
      } finally {
        if (!cancelled) setCheckingGate(false);
      }
    }
    check();
    return () => {
      cancelled = true;
    };
  }, [account?.address, creatorAddress, minTierToComment]);

  const submit = async () => {
    const author = account?.address;
    if (!author) {
      toast.error('Connect wallet or sign in to comment');
      return;
    }
    if (!canComment) {
      toast.error(`Comments require tier ${minTierToComment}+`);
      return;
    }
    const content = text.trim();
    if (!content) return;
    setPosting(true);
    const temp: UiComment = {
      id: `temp-${Date.now()}`,
      author,
      content,
      createdAt: Date.now(),
    };
    setComments((c) => [temp, ...c]);
    setText('');
    try {
      const r = await fetch(`/api/comments/${postId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, content }),
      });
      if (!r.ok) throw new Error((await r.json())?.error || r.statusText);
      const json = await r.json();
      const created = json?.comment as UiComment;
      setComments((c) => [created, ...c.filter((x) => x.id !== temp.id)]);
      toast.success('Comment posted');
    } catch (e: any) {
      setComments((c) => c.filter((x) => x.id !== temp.id));
      setText(content);
      toast.error(e?.message || 'Failed to post comment');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-3">Comments</h3>

      {/* Composer */}
      <div className="mb-4">
        <label htmlFor="comment" className="sr-only">Add a comment</label>
        <Textarea
          id="comment"
          placeholder={checkingGate ? 'Checking permissions…' : canComment ? 'Share your thoughts' : `Subscribe (tier ${minTierToComment}+) to comment`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!canComment || checkingGate || posting}
          className="mb-2"
          aria-disabled={!canComment || checkingGate}
          aria-live="polite"
        />
        <div className="flex justify-end">
          <Button onClick={submit} disabled={!canComment || !text.trim() || posting}>
            {posting ? 'Posting…' : 'Post Comment'}
          </Button>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-12 w-3/4" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-sm text-muted-foreground">No comments yet.</div>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => (
            <li key={c.id} className="rounded-md border border-white/10 p-3">
              <div className="text-sm text-white/70 mb-1">
                <AddressName address={c.author} />
                <span className="mx-2 text-white/40">•</span>
                <span className="text-white/50">{timeAgo(c.createdAt)}</span>
              </div>
              <div className="whitespace-pre-wrap text-[15px]">{c.content}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
