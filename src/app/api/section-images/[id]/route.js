import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { requireAuth } from '../../../../lib/auth';


export async function PUT(request, { params }) {
  const auth = await requireAuth(request);
    if (auth) return auth;
  const { id } = await params;
  try {
    const body = await request.json();
    const image = await prisma.sectionImage.update({
      where: { id: parseInt(id) },
      data: {
        src: body.src,
        alt: body.alt || null,
        title: body.title,
        description: body.description || null,
        details: body.details || null,
        category: body.category || null,
        date: body.date || null,
        rating: body.rating || null,
        order: body.order,
        visible: body.visible,
      },
    });
    return NextResponse.json(image);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update section image' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const auth = await requireAuth(request);
    if (auth) return auth;

  const { id } = await params;
  try {
    await prisma.sectionImage.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete section image' }, { status: 500 });
  }
}