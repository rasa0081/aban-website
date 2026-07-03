import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import prisma from '../../../lib/prisma';
import { requireAuth } from '../../../lib/auth';

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(banners);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await requireAuth(request);
    if (auth) return auth;
  try {
    const body = await request.json();
    const banner = await prisma.banner.create({
      data: {
        title: body.title || '',
        subtitle: body.subtitle || '',
        image: body.image || '',
        link: body.link || '',
        bgColor: body.bgColor || '#0c2b29',
        active: body.active !== undefined ? body.active : true,
      },
    });
    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    console.error('Failed to create banner:', error);
    return NextResponse.json({ error: 'Failed to create banner: ' + error.message }, { status: 500 });
  }
}