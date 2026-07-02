import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const company = await prisma.subCompany.update({
      where: { id: parseInt(id) },
      data: {
        name: body.name,
        logo: body.logo || null,
        url: body.url,
        visible: body.visible,
        order: body.order,
      },
    });
    return NextResponse.json(company);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update sub company' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    await prisma.subCompany.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete sub company' }, { status: 500 });
  }
}