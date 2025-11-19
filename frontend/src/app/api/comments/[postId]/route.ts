import { NextRequest, NextResponse } from 'next/server';

// In-memory comment store (ephemeral). Replace with a real DB in production.
type Comment = {
  id: string;
  postId: string;
  author: string; // sui address
  content: string;
  createdAt: number;
};

const store: Map<string, Comment[]> = new Map();

export async function GET(
  _req: NextRequest,
  { params }: { params: { postId: string } }
) {
  const { postId } = params;
  const comments = store.get(postId) || [];
  return NextResponse.json({ comments });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  const { postId } = params;
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const author = String(body?.author || '').trim();
  const content = String(body?.content || '').trim();

  if (!author || !/^0x[0-9a-fA-F]{40,}$/.test(author)) {
    return NextResponse.json({ error: 'Valid Sui address required' }, { status: 400 });
  }
  if (!content || content.length < 1 || content.length > 2000) {
    return NextResponse.json({ error: 'Comment must be 1-2000 chars' }, { status: 400 });
  }

  const entry: Comment = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    postId,
    author,
    content,
    createdAt: Date.now(),
  };

  const list = store.get(postId) || [];
  list.push(entry);
  store.set(postId, list);

  return NextResponse.json({ comment: entry }, { status: 201 });
}
