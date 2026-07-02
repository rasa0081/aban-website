import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

function serialize(row) {
  let buttons = [];
  try {
    buttons = Array.isArray(row.buttons) ? row.buttons : JSON.parse(row.buttons || '[]');
  } catch {
    buttons = [];
  }
  return { ...row, buttons };
}

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const data = {};
    if (body.sectionKey !== undefined) data.sectionKey = body.sectionKey;
    if (body.type !== undefined) data.type = body.type;
    if (body.title !== undefined) data.title = body.title;
    if (body.subtitle !== undefined) data.subtitle = body.subtitle || null;
    if (body.buttons !== undefined) data.buttons = JSON.stringify(Array.isArray(body.buttons) ? body.buttons : []);
    if (body.order !== undefined) data.order = body.order;
    if (body.visible !== undefined) data.visible = body.visible;

    const updated = await prisma.homeSection.update({
      where: { id: parseInt(id) },
      data,
    });
    return NextResponse.json(serialize(updated));
  } catch (error) {
    console.error('PUT /api/home-sections/[id] error:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'این شناسه (sectionKey) قبلاً استفاده شده' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update home section' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    await prisma.homeSection.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/home-sections/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete home section' }, { status: 500 });
  }
}
