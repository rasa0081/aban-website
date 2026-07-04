import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

// In-memory IP rate limit: one like/unlike per article per IP per 60 seconds.
// This resets on server restart but is sufficient to block casual scripting.
const cooldowns = new Map();
const COOLDOWN_MS = 60_000;

function getRateLimitKey(ip, articleId) {
  return `${ip}:${articleId}`;
}

function isRateLimited(ip, articleId) {
  const key = getRateLimitKey(ip, articleId);
  const last = cooldowns.get(key);
  const now = Date.now();
  if (last && now - last < COOLDOWN_MS) return true;
  cooldowns.set(key, now);
  // Prune old entries to prevent unbounded memory growth
  if (cooldowns.size > 10_000) {
    for (const [k, t] of cooldowns) {
      if (now - t > COOLDOWN_MS) cooldowns.delete(k);
    }
  }
  return false;
}

// POST /api/articles/[id]/like  body: { delta: 1 | -1 }
export async function POST(request, { params }) {
  const { id } = await params;

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  if (isRateLimited(ip, id)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const delta = body.delta === -1 ? -1 : 1;
    const article = await prisma.article.update({
      where: { id: parseInt(id) },
      data: { likes: { increment: delta } },
      select: { id: true, likes: true },
    });
    const likes = Math.max(0, article.likes);
    if (article.likes < 0) {
      await prisma.article.update({ where: { id: parseInt(id) }, data: { likes: 0 } });
    }
    return NextResponse.json({ id: article.id, likes });
  } catch (error) {
    console.error('POST /api/articles/[id]/like error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update likes' }, { status: 500 });
  }
}