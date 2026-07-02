import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
    });
    if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(article);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const article = await prisma.article.update({
      where: { id: parseInt(id) },
      data: {
        title: body.title,
        intro: body.intro,
        content: body.content,
        category: body.category,
        status: body.status,
        type: body.type,
        image: body.image || null,
        imageAlt: body.imageAlt || null,
        metaDescription: body.metaDescription || null,
        keywords: body.keywords || null,
        views: body.views,
        date: body.date,
        fontSize: body.fontSize,
        fontColor: body.fontColor,
        isBold: body.isBold,
        isItalic: body.isItalic,
      },
    });
    return NextResponse.json(article);
  } catch (error) {
    console.error('PUT /api/articles/[id] error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update article' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    await prisma.article.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}