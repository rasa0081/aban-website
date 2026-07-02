// Seeds the 5 default homepage sections (hero + cards) into the home_sections
// table. Safe to run multiple times — it upserts by sectionKey, so it won't
// duplicate or overwrite sections you've already customized in the admin panel
// (only creates the ones that are missing).
//
// Run with:  node prisma/seed-home-sections.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sections = [
  {
    sectionKey: 'hero',
    type: 'hero',
    title: 'آژانس تجارت الکترونیک آبان',
    subtitle: 'داستان، چهره، اثر',
    buttons: [
      { text: 'درباره آبان', link: '/about', variant: 'contained' },
      { text: 'تماس با ما', link: '/contact', variant: 'outlined' },
    ],
    order: 0,
    visible: true,
  },
  {
    sectionKey: 'services',
    type: 'card',
    title: 'خدمات ما',
    subtitle: 'طراحی وبسایت، اپلیکیشن موبایل، سئو و بهینه‌سازی',
    buttons: [{ text: 'مشاهده خدمات', link: '/services', variant: 'contained' }],
    order: 1,
    visible: true,
  },
  {
    sectionKey: 'portfolio',
    type: 'card',
    title: 'نمونه کارها',
    subtitle: 'مشاهده پروژه‌های اخیر ما در زمینه طراحی وبسایت',
    buttons: [{ text: 'مشاهده نمونه کارها', link: '/portfolio', variant: 'contained' }],
    order: 2,
    visible: true,
  },
  {
    sectionKey: 'about',
    type: 'card',
    title: 'درباره آبان',
    subtitle: 'با تیم حرفه‌ای ما آشنا شوید',
    buttons: [{ text: 'درباره ما', link: '/about', variant: 'contained' }],
    order: 3,
    visible: true,
  },
  {
    sectionKey: 'contact',
    type: 'card',
    title: 'تماس با ما',
    subtitle: 'برای شروع همکاری با ما در تماس باشید',
    buttons: [{ text: 'ارسال پیام', link: '/contact', variant: 'contained' }],
    order: 4,
    visible: true,
  },
];

async function main() {
  console.log('🌱 Seeding home sections...');
  for (const s of sections) {
    const existing = await prisma.homeSection.findUnique({ where: { sectionKey: s.sectionKey } });
    if (existing) {
      console.log(`   ↷ skip "${s.sectionKey}" (already exists)`);
      continue;
    }
    await prisma.homeSection.create({
      data: { ...s, buttons: JSON.stringify(s.buttons) },
    });
    console.log(`   ✓ created "${s.sectionKey}"`);
  }
  console.log('✅ Done.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
