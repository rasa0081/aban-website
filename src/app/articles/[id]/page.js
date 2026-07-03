import prisma from '../../../lib/prisma';
import ArticleDetail from './ArticleDetail';

// ── Dynamic metadata: title = article title ──────────────────────────────────
export async function generateMetadata({ params }) {
  const { id } = await params;
  let title = 'مقاله';
  let description = '';

  try {
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
      select: { title: true, intro: true, metaDescription: true },
    });
    if (article) {
      title = article.title;
      // Use metaDescription if set, otherwise strip HTML from intro
      description = article.metaDescription || (article.intro || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160);
    }
  } catch {
    // fallback already set
  }

  return {
    title: `${title} — آژانس آبان`,
    description: description || 'مقاله‌ای از آژانس تجارت الکترونیک آبان',
    openGraph: {
      title: `${title} — آژانس آبان`,
      description: description || 'مقاله‌ای از آژانس تجارت الکترونیک آبان',
    },
  };
}

export default function ArticlePage() {
  return <ArticleDetail />;
}
