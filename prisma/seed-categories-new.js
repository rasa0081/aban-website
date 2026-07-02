// Run this on the host to REPLACE article categories with the new 8-category list:
// node prisma/seed-categories-new.js
//
// Note: the display order on the public site is NOT driven by the `order`
// field below — the articles page automatically sorts categories by which
// one most recently received a new article. The `order` field here is only
// a fallback for categories that have no articles yet at all.

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Replacing article categories...');

  // Clear existing categories
  await prisma.articleCategory.deleteMany();

  const categoryData = [
    { name: 'دیجیتال مارکتینگ و رشد کسب و کار', slug: 'digital-marketing-growth', order: 1, visible: true },
    { name: 'طراحی گرافیک و هویت بصری', slug: 'graphic-visual-identity', order: 2, visible: true },
    { name: 'طراحی سایت و توسعه وب', slug: 'web-design-development', order: 3, visible: true },
    { name: 'سئو و بهینه‌سازی سایت', slug: 'seo-optimization', order: 4, visible: true },
    { name: 'موشن گرافیک و انیمیشن', slug: 'motion-graphic-animation', order: 5, visible: true },
    { name: 'تولید محتوا و مدیریت شبکه‌های اجتماعی', slug: 'content-social-media', order: 6, visible: true },
    { name: 'برندینگ و استراتژی برند', slug: 'branding-strategy', order: 7, visible: true },
    { name: 'سایر مقالات', slug: 'other-articles', order: 8, visible: true },
  ];

  for (const cat of categoryData) {
    await prisma.articleCategory.create({
      data: { name: cat.name, slug: cat.slug, order: cat.order, visible: cat.visible, parentId: null },
    });
    console.log(`  ✓ ${cat.name}`);
  }

  console.log('✅ Article categories replaced successfully!');
}

main()
  .catch(e => { console.error('❌ Error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });