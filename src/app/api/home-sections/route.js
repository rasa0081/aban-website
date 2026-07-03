import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { requireAuth } from '../../../lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Normalize a stored row into a clean object (buttons parsed to an array)
function serialize(row) {
  let buttons = [];
  try {
    buttons = Array.isArray(row.buttons) ? row.buttons : JSON.parse(row.buttons || '[]');
  } catch {
    buttons = [];
  }
  return { ...row, buttons };
}

// GET — all sections, ordered. Pass ?all=1 (admin) to include hidden ones too.
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeHidden = searchParams.get('all') === '1';
    const rows = await prisma.homeSection.findMany({
      where: includeHidden ? {} : { visible: true },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(rows.map(serialize));
  } catch (error) {
    console.error('GET /api/home-sections error:', error);
    return NextResponse.json({ error: 'Failed to fetch home sections' }, { status: 500 });
  }
}

// POST — create a section
export async function POST(request) {
  const auth = await requireAuth(request);
    if (auth) return auth;
  try {
    const body = await request.json();
    const buttons = Array.isArray(body.buttons) ? body.buttons : [];
    const created = await prisma.homeSection.create({
      data: {
        sectionKey: body.sectionKey,
        type: body.type || 'card',
        title: body.title || '',
        subtitle: body.subtitle || null,
        buttons: JSON.stringify(buttons),
        order: body.order ?? 0,
        visible: body.visible !== undefined ? body.visible : true,
      },
    });
    return NextResponse.json(serialize(created), { status: 201 });
  } catch (error) {
    console.error('POST /api/home-sections error:', error);
    // Unique constraint on sectionKey
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'این شناسه (sectionKey) قبلاً استفاده شده' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create home section' }, { status: 500 });
  }
}
