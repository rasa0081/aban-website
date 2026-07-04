import prisma from '../lib/prisma';

export default async function sitemap() {
  // Use env var so it works locally AND in production
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000';

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/portfolio`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/articles`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];

  let articlePages = [];
  try {
    const articles = await prisma.article.findMany({
      where: { status: 'published' },
      select: { id: true, slug: true, updatedAt: true },
    });
    articlePages = articles.map((article) => ({
      url: `${baseUrl}/articles/${article.slug || article.id}`,
      lastModified: article.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
  } catch (e) {
    // If DB is unreachable during build, skip dynamic pages
  }

  return [...staticPages, ...articlePages];
}