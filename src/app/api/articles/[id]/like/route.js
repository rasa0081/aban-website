import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

// POST /api/articles/[id]/like  body: { delta: 1 | -1 }
// Increments (or decrements) the article's like count atomically.
export async function POST(request, { params }) {
  const { id } = await params;
  try {
    const body = await request.json().catch(() => ({}));
    const delta = body.delta === -1 ? -1 : 1;
    const article = await prisma.article.update({
      where: { id: parseInt(id) },
      data: { likes: { increment: delta } },
      select: { id: true, likes: true },
    });
    // never report a negative count
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