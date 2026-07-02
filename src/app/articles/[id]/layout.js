const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://aban.agency';

export async function generateMetadata({ params }) {
  try {
    const { id } = await params;
    const res = await fetch(`${BASE}/api/articles/${id}`, { cache: 'no-store' });
    if (!res.ok) return { title: 'مقاله - آژانس آبان' };
    const article = await res.json();
    const metaDesc = (article.metaDescription && article.metaDescription.trim())
      || article.intro?.replace(/<[^>]*>/g, '').slice(0, 160)
      || 'مقاله از آژانس آبان';
    return {
      title: article.title,
      description: metaDesc,
      keywords: (article.keywords && article.keywords.trim()) || undefined,
      alternates: { canonical: `${BASE}/articles/${id}` },
      openGraph: {
        title: article.title,
        description: metaDesc,
        url: `${BASE}/articles/${id}`,
        type: 'article',
        images: article.image ? [{ url: article.image, alt: article.title }] : [{ url: '/Logo.png' }],
      },
      other: {
        'article:published_time': article.createdAt,
        'article:modified_time': article.updatedAt,
      },
    };
  } catch {
    return { title: 'مقاله - آژانس آبان' };
  }
}

export default function Layout({ children }) { return children; }