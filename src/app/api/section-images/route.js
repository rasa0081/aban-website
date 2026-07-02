import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sectionId = searchParams.get('section');

    const images = await prisma.sectionImage.findMany({
      where: {
        ...(sectionId ? { sectionId } : {}),
        visible: true,
      },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch section images' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const image = await prisma.sectionImage.create({
      data: {
        sectionId: body.sectionId,
        src: body.src,
        alt: body.alt || null,
        title: body.title || '',
        description: body.description || null,
        details: body.details || null,
        category: body.category || null,
        date: body.date || null,
        rating: body.rating || null,
        order: body.order || 0,
        visible: body.visible !== undefined ? body.visible : true,
      },
    });
    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create section image' }, { status: 500 });
  }
}