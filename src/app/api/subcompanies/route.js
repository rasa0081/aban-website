import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { requireAuth } from '../../../lib/auth';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const companies = await prisma.subCompany.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(companies);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sub companies' }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await requireAuth(request);
    if (auth) return auth;
  try {
    const body = await request.json();
    const company = await prisma.subCompany.create({
      data: {
        name: body.name,
        logo: body.logo || null,
        url: body.url || '#',
        visible: body.visible !== undefined ? body.visible : true,
        order: body.order || 0,
      },
    });
    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create sub company' }, { status: 500 });
  }
}