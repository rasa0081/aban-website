// Run this on the host to add the new article categories:
// node prisma/seed-categories.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding article categories...');

  // Clear existing categories
  await prisma.articleCategory.deleteMany();

  const categoryData = [
    {
      name: 'برنامه نویسی', slug: 'programming', order: 1, visible: true,
      children: [
        { name: 'طراحی وبسایت', slug: 'web-design', order: 1, visible: true },
        { name: 'دیتابیس', slug: 'database', order: 2, visible: true },
        { name: 'پنل ادمین', slug: 'admin-panel', order: 3, visible: true },
        { name: 'امنیت', slug: 'security', order: 4, visible: true },
        { name: 'اپلیکیشن', slug: 'app', order: 5, visible: true },
        { name: 'دیباگ', slug: 'debug', order: 6, visible: true },
        { name: 'UI/UX', slug: 'ui-ux', order: 7, visible: true },
      ],
    },
    {
      name: 'گرافیک', slug: 'graphic', order: 2, visible: true,
      children: [
        { name: 'هویت بصری', slug: 'visual-identity', order: 1, visible: true },
        { name: 'طراحی لوگو', slug: 'logo-design', order: 2, visible: true },
        { name: 'بروشور و کاتالوگ و مستندات', slug: 'brochure', order: 3, visible: true },
        { name: 'بسته بندی', slug: 'packaging', order: 4, visible: true },
        { name: 'آگهی', slug: 'advertising', order: 5, visible: true },
        { name: 'گرافیک محیطی', slug: 'environmental-graphic', order: 6, visible: true },
        { name: 'گرافیک شبکه اجتماعی و رابط کاربری', slug: 'social-ui', order: 7, visible: true },
        { name: 'گرافیک متحرک', slug: 'motion-graphic', order: 8, visible: true },
        { name: 'برندینگ', slug: 'branding', order: 9, visible: true },
      ],
    },
    {
      name: 'مارکتینگ', slug: 'marketing', order: 3, visible: true,
      children: [
        { name: 'بازاریابی دیجیتال', slug: 'digital-marketing', order: 1, visible: true },
        { name: 'SEO', slug: 'seo', order: 2, visible: true },
        { name: 'کمپین تبلیغاتی', slug: 'campaign', order: 3, visible: true },
        { name: 'مدیریت فضای مجازی', slug: 'social-media', order: 4, visible: true },
        { name: 'تبلیغ نویسی', slug: 'copywriting', order: 5, visible: true },
        { name: 'سناریو نویسی', slug: 'scriptwriting', order: 6, visible: true },
        { name: 'تولید محتوا', slug: 'content', order: 7, visible: true },
        { name: 'جایگاه یابی', slug: 'positioning', order: 8, visible: true },
        { name: 'تحلیل رقبا', slug: 'competitor-analysis', order: 9, visible: true },
        { name: 'بازارسازی', slug: 'market-making', order: 10, visible: true },
      ],
    },
    {
      name: 'سایر مقالات', slug: 'other', order: 4, visible: true,
      children: [],
    },
  ];

  for (const cat of categoryData) {
    const parent = await prisma.articleCategory.create({
      data: { name: cat.name, slug: cat.slug, order: cat.order, visible: cat.visible, parentId: null },
    });
    console.log(`  ✓ ${cat.name}`);
    for (const child of cat.children) {
      await prisma.articleCategory.create({
        data: { name: child.name, slug: child.slug, order: child.order, visible: child.visible, parentId: parent.id },
      });
      console.log(`    ↳ ${child.name}`);
    }
  }

  console.log('✅ Article categories seeded successfully!');
}

main()
  .catch(e => { console.error('❌ Error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });