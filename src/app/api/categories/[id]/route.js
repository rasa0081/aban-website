import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { requireAuth } from '../../../../lib/auth';

export async function PUT(request, { params }) {
  const auth = await requireAuth(request);
    if (auth) return auth;
  const { id } = await params;
  try {
    const body = await request.json();
    const category = await prisma.articleCategory.update({
      where: { id: parseInt(id) },
      data: {
        name: body.name,
        slug: body.slug,
        parentId: body.parentId || null,
        order: body.order,
        visible: body.visible,
      },
      include: { children: true },
    });
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const auth = await requireAuth(request);
    if (auth) return auth;
  const { id } = await params;
  try {
    // Delete children first
    await prisma.articleCategory.deleteMany({ where: { parentId: parseInt(id) } });
    await prisma.articleCategory.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}