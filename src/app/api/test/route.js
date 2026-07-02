import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const count = await prisma.article.count();
    const articles = await prisma.article.findMany({ take: 2 });
    return NextResponse.json({ 
      status: 'DB connected ✓', 
      articleCount: count,
      sample: articles.map(a => ({ id: a.id, title: a.title }))
    });
  } catch (error) {
    return NextResponse.json({ 
      status: 'DB ERROR ✗', 
      error: error.message 
    }, { status: 500 });
  }
}