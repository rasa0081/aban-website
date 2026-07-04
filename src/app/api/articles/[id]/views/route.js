import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

// POST /api/articles/[id]/views
// Increments the article's view count. No auth required — called by public visitors.
export async function POST(request, { params }) {
  const { id } = await params;
  try {
    const numericId = !isNaN(id) ? parseInt(id) : null;
    const article = numericId
      ? await prisma.article.findUnique({ where: { id: numericId }, select: { id: true } })
      : await prisma.article.findFirst({ where: { slug: id }, select: { id: true } });

    if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const updated = await prisma.article.update({
      where: { id: article.id },
      data: { views: { increment: 1 } },
      select: { id: true, views: true },
    });
    return NextResponse.json({ id: updated.id, views: updated.views });
  } catch (error) {
    console.error('POST /api/articles/[id]/views error:', error);
    return NextResponse.json({ error: 'Failed to increment views' }, { status: 500 });
  }
}