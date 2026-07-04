import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { requireAuth } from '../../../../lib/auth';

// Helper: find by slug or numeric id
async function findArticle(id) {
  if (!isNaN(id) && !isNaN(parseInt(id))) {
    return prisma.article.findUnique({ where: { id: parseInt(id) } });
  }
  // Slug lookup — use findFirst since slug may not be @unique
  return prisma.article.findFirst({ where: { slug: id } });
}

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const article = await findArticle(id);
    if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(article);
  } catch (error) {
    console.error('GET /api/articles/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const auth = await requireAuth(request);
  if (auth) return auth;
  const { id } = await params;
  try {
    const body = await request.json();
    // Find the article first to get its numeric id
    const existing = await findArticle(id);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const article = await prisma.article.update({
      where: { id: existing.id },
      data: {
        title: body.title,
        intro: body.intro,
        content: body.content,
        category: body.category,
        status: body.status,
        type: body.type,
        image: body.image || null,
        imageAlt: body.imageAlt || null,
        metaDescription: body.metaDescription || null,
        keywords: body.keywords || null,
        views: body.views,
        date: body.date,
        fontSize: body.fontSize,
        fontColor: body.fontColor,
        isBold: body.isBold,
        isItalic: body.isItalic,
      },
    });
    return NextResponse.json(article);
  } catch (error) {
    console.error('PUT /api/articles/[id] error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update article' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const auth = await requireAuth(request);
  if (auth) return auth;
  const { id } = await params;
  try {
    const existing = await findArticle(id);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    await prisma.article.delete({ where: { id: existing.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}
