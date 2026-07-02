import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const project = await prisma.portfolio.update({
      where: { id: parseInt(id) },
      data: {
        title: body.title,
        category: body.category,
        image: body.image || null,
        tags: Array.isArray(body.tags) ? body.tags.join(', ') : (body.tags || ''),
        year: body.year,
        client: body.client,
        description: body.description || null,
        duration: body.duration || null,
        url: body.url || null,
        features: Array.isArray(body.features) ? body.features.join('|') : (body.features || null),
        videoUrl: body.videoUrl || null,
        videoTitle: body.videoTitle || null,
        showPreview: body.showPreview !== undefined ? body.showPreview : false,
        visible: body.visible,
      },
    });
    return NextResponse.json({ ...project, tags: project.tags ? project.tags.split(',').map(t => t.trim()) : [], features: project.features ? project.features.split('|').map(f => f.trim()).filter(Boolean) : [] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    await prisma.portfolio.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}