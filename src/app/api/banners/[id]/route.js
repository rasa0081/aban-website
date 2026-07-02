import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const banner = await prisma.banner.update({
      where: { id: parseInt(id) },
      data: {
        title: body.title || '',
        subtitle: body.subtitle || '',
        image: body.image || '',
        link: body.link || '',
        bgColor: body.bgColor,
        active: body.active,
      },
    });
    return NextResponse.json(banner);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    await prisma.banner.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 });
  }
}