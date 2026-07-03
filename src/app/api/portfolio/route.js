import { NextResponse } from 'next/server';
import { requireAuth } from '../../../lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import prisma from '../../../lib/prisma';

export async function GET() {
  try {
    const portfolio = await prisma.portfolio.findMany({
      orderBy: { createdAt: 'desc' },
    });
    // Convert tags string back to array
    const result = portfolio.map(p => ({
      ...p,
      tags: p.tags ? p.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      features: p.features ? p.features.split('|').map(f => f.trim()).filter(Boolean) : [],
    }));
    return NextResponse.json(result);
  } catch (error) {
    console.error('GET /api/portfolio error:', error);
    return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await requireAuth(request);
    if (auth) return auth;
  try {
    const body = await request.json();
    const project = await prisma.portfolio.create({
      data: {
        title: body.title,
        category: body.category || 'web',
        image: body.image || null,
        tags: Array.isArray(body.tags) ? body.tags.join(', ') : (body.tags || ''),
        year: body.year || '',
        client: body.client || '',
        description: body.description || null,
        duration: body.duration || null,
        url: body.url || null,
        features: Array.isArray(body.features) ? body.features.join('|') : (body.features || null),
        videoUrl: body.videoUrl || null,
        videoTitle: body.videoTitle || null,
        showPreview: body.showPreview !== undefined ? body.showPreview : false,
        visible: body.visible !== undefined ? body.visible : true,
      },
    });
    return NextResponse.json({ ...project, tags: project.tags ? project.tags.split(',').map(t => t.trim()) : [], features: project.features ? project.features.split('|').map(f => f.trim()).filter(Boolean) : [] }, { status: 201 });
  } catch (error) {
    console.error('POST /api/portfolio error:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}