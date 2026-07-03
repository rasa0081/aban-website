import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { requireAuth } from '../../../lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const categories = await prisma.articleCategory.findMany({
      where: { parentId: null },
      orderBy: { order: 'asc' },
      include: {
        children: {
          orderBy: { order: 'asc' },
        },
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('GET /api/categories error:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await requireAuth(request);
  if (auth) return auth;
  try {
    const body = await request.json();
    const category = await prisma.articleCategory.create({
      data: {
        name: body.name,
        slug: body.slug || body.name.replace(/\s+/g, '-').toLowerCase(),
        parentId: body.parentId || null,
        order: body.order || 0,
        visible: body.visible !== undefined ? body.visible : true,
      },
      include: { children: true },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('POST /api/categories error:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}