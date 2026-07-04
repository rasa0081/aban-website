import { NextResponse } from 'next/server';
import { generateSlug } from '../../../lib/slug';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import prisma from '../../../lib/prisma';
import { requireAuth } from '../../../lib/auth';

// GET all articles
export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(articles);
  } catch (error) {
    console.error('GET /api/articles error:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

// POST create new article
export async function POST(request) {
  const auth = await requireAuth(request);
  if (auth) return auth;

  try {
    const body = await request.json();

    // Generate unique slug from title
    const existing = await prisma.article.findMany({ select: { slug: true } });
    const existingSlugs = existing.map(a => a.slug).filter(Boolean);
    const slug = generateSlug(body.title, existingSlugs);

    const article = await prisma.article.create({
      data: {
        title: body.title,
        slug,
        intro: body.intro || '',
        content: body.content || '',
        category: body.category || 'general',
        status: body.status || 'draft',
        type: body.type || 'normal',
        image: body.image || null,
        imageAlt: body.imageAlt || null,
        metaDescription: body.metaDescription || null,
        keywords: body.keywords || null,
        views: body.views || 0,
        date: body.date || new Date().toLocaleDateString('fa-IR'),
        fontSize: body.fontSize || 16,
        fontColor: body.fontColor || '#1a1e24',
        isBold: body.isBold || false,
        isItalic: body.isItalic || false,
      },
    });
    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('POST /api/articles error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create article' }, { status: 500 });
  }
}
