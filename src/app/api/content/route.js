import { NextResponse } from 'next/server';
import { requireAuth } from '../../../lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import prisma from '../../../lib/prisma';

// GET all site content (returns object with all keys)
export async function GET() {
  try {
    const rows = await prisma.siteContent.findMany();
    const content = {};
    rows.forEach(row => {
      try { content[row.key] = JSON.parse(row.value); }
      catch { content[row.key] = row.value; }
    });
    return NextResponse.json(content);
  } catch (error) {
    console.error('GET /api/content error:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

// POST upsert a content key
export async function POST(request) {
  const auth = await requireAuth(request);
    if (auth) return auth;
  try {
    const body = await request.json();
    const { key, value } = body;
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    const row = await prisma.siteContent.upsert({
      where: { key },
      update: { value: stringValue },
      create: { key, value: stringValue },
    });
    return NextResponse.json(row);
  } catch (error) {
    console.error('POST /api/content error:', error);
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}