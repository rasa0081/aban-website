const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Articles ──────────────────────────────────────────────────────────────
  // Safe to run multiple times: delete then recreate
  await prisma.article.deleteMany();
  await prisma.article.createMany({
    data: [
      {
        title: 'راهنمای جامع سئو برای وبسایت‌های فروشگاهی',
        intro: 'در این مقاله به بررسی کامل تکنیک‌های سئو برای فروشگاه‌های اینترنتی می‌پردازیم.',
        content: 'محتوای کامل مقاله اینجا قرار می‌گیرد...',
        category: 'seo', status: 'published', type: 'main',
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&fit=crop',
        views: 1240, date: '۱۴۰۳/۰۲/۱۵', fontSize: 16, fontColor: '#1a1e24', isBold: false, isItalic: false,
      },
      {
        title: 'اصول طراحی رابط کاربری مدرن',
        intro: 'با اصول و مبانی طراحی رابط کاربری مدرن آشنا شوید.',
        content: 'محتوای کامل مقاله اینجا قرار می‌گیرد...',
        category: 'ui-ux', status: 'published', type: 'normal',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
        views: 890, date: '۱۴۰۳/۰۲/۱۰', fontSize: 16, fontColor: '#1a1e24', isBold: false, isItalic: false,
      },
      {
        title: 'بهترین فریمورک‌های جاوااسکریپت در ۲۰۲۴',
        intro: 'مقایسه و بررسی برترین فریمورک‌های جاوااسکریپت.',
        content: 'محتوای کامل مقاله اینجا قرار می‌گیرد...',
        category: 'frontend', status: 'draft', type: 'normal',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
        views: 2100, date: '۱۴۰۳/۰۲/۰۵', fontSize: 16, fontColor: '#1a1e24', isBold: false, isItalic: false,
      },
      {
        title: 'بهینه‌سازی سرعت سایت با ۱۰ تکنیک ساده',
        intro: 'افزایش سرعت بارگذاری سایت نه تنها تجربه کاربری را بهبود می‌بخشد.',
        content: 'محتوای کامل مقاله اینجا قرار می‌گیرد...',
        category: 'seo', status: 'published', type: 'main',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
        views: 3450, date: '۱۴۰۳/۰۱/۲۸', fontSize: 16, fontColor: '#1a1e24', isBold: false, isItalic: false,
      },
    ],
  });
  console.log('✅ Articles seeded');

  // ── Portfolio — includes all new fields ───────────────────────────────────
  await prisma.portfolio.deleteMany();
  await prisma.portfolio.createMany({
    data: [
      {
        title: 'فروشگاه آنلاین مد و پوشاک', category: 'ecommerce',
        image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&h=600&fit=crop',
        tags: 'Next.js, MUI, Stripe', year: '۱۴۰۳', client: 'برند پوشاک ایرانی',
        description: 'فروشگاه آنلاین کامل با سیستم پرداخت امن و مدیریت موجودی.',
        duration: '۴ ماه', url: 'https://example.com',
        features: 'طراحی ریسپانسیو|سبد خرید|درگاه پرداخت|پنل مدیریت',
        videoUrl: null, videoTitle: null, visible: true,
      },
      {
        title: 'اپلیکیشن مدیریت وظایف', category: 'app',
        image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
        tags: 'React Native, Firebase, Redux', year: '۱۴۰۳', client: 'استارتاپ فین‌تک',
        description: 'اپلیکیشن موبایل برای مدیریت پروژه‌ها و وظایف تیمی.',
        duration: '۳ ماه', url: null,
        features: 'اندروید و iOS|نوتیفیکیشن|همگام‌سازی ابری',
        videoUrl: null, videoTitle: null, visible: true,
      },
      {
        title: 'وبسایت شرکت ساختمانی', category: 'web',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
        tags: 'Next.js, GSAP, Framer Motion', year: '۱۴۰۲', client: 'شرکت ساختمانی آریا',
        description: 'وبسایت معرفی شرکت با انیمیشن‌های پیشرفته و گالری پروژه‌ها.',
        duration: '۲ ماه', url: null,
        features: 'انیمیشن GSAP|گالری پروژه‌ها|سئو',
        videoUrl: null, videoTitle: null, visible: true,
      },
      {
        title: 'پلتفرم آموزش آنلاین', category: 'web',
        image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop',
        tags: 'React, Node.js, MongoDB', year: '۱۴۰۲', client: 'آکادمی آموزشی',
        description: 'پلتفرم جامع آموزش آنلاین با سیستم دوره و آزمون.',
        duration: '۶ ماه', url: null,
        features: 'پخش ویدیو|آزمون آنلاین|گواهینامه',
        videoUrl: null, videoTitle: null, visible: false,
      },
    ],
  });
  console.log('✅ Portfolio seeded');

  // ── Banners ───────────────────────────────────────────────────────────────
  await prisma.banner.deleteMany();
  await prisma.banner.create({
    data: { title: 'تخفیف ویژه خدمات طراحی', subtitle: 'تا پایان ماه از ۲۰٪ تخفیف بهره‌مند شوید', bgColor: '#0c2b29', active: true },
  });
  console.log('✅ Banners seeded');

  // ── Site Content — upsert so running twice is safe ────────────────────────
  const contentItems = [
    { key: 'home_hero_title', value: 'آژانس تجارت الکترونیک آبان' },
    { key: 'home_hero_subtitle', value: 'داستان، چهره، اثر' },
    { key: 'home_sections', value: JSON.stringify([
      { id: 'services', title: 'خدمات ما', subtitle: 'طراحی وبسایت، اپلیکیشن موبایل، سئو', visible: true },
      { id: 'portfolio', title: 'نمونه کارها', subtitle: 'مشاهده پروژه‌های اخیر ما', visible: true },
      { id: 'about', title: 'درباره آبان', subtitle: 'با تیم حرفه‌ای ما آشنا شوید', visible: true },
      { id: 'contact', title: 'تماس با ما', subtitle: 'برای شروع همکاری با ما در تماس باشید', visible: true },
    ])},
    { key: 'about_hero_title', value: 'درباره آبان' },
    { key: 'about_hero_subtitle', value: 'ما تیمی از متخصصان خلاق و با تجربه هستیم که به دنبال خلق تجربه‌های دیجیتال منحصر‌به‌فرد برای کسب‌وکارها هستیم.' },
    { key: 'about_mission_title', value: 'تحول دیجیتال کسب‌وکارها' },
    { key: 'about_mission_text', value: 'در آبان، ما به دنبال ایجاد تحول دیجیتال در کسب‌وکارها هستیم. با ترکیب خلاقیت، تکنولوژی و تجربه، راه‌حل‌های منحصر‌به‌فردی ارائه می‌دهیم.' },
    { key: 'about_stats', value: JSON.stringify([
      { number: '۸+', label: 'سال تجربه' },
      { number: '۱۵۰+', label: 'پروژه موفق' },
      { number: '۵۰+', label: 'تیم متخصص' },
    ])},
    { key: 'about_values', value: JSON.stringify([
      { title: 'کیفیت', description: 'ما به کیفیت کار خود افتخار می‌کنیم.' },
      { title: 'نوآوری', description: 'همیشه به دنبال راه‌های جدید هستیم.' },
      { title: 'اعتماد', description: 'اعتماد مشتریان مهمترین سرمایه ماست.' },
      { title: 'تعهد', description: 'به تعهدات خود پایبند هستیم.' },
    ])},
    { key: 'contact_phone1', value: '۰۲۱-۸۸۵۲۱۲۳۴' },
    { key: 'contact_phone2', value: '۰۲۱-۸۸۵۲۴۳۶۵' },
    { key: 'contact_mobile', value: '۰۹۱۲۱۲۳۴۵۶۷' },
    { key: 'contact_email1', value: 'info@abaan.ir' },
    { key: 'contact_email2', value: 'support@abaan.ir' },
    { key: 'contact_address', value: 'تهران، خیابان ولیعصر، بالاتر از میدان ونک، پلاک ۱۲۳، طبقه ۴' },
    { key: 'contact_work_hours', value: 'شنبه تا چهارشنبه: ۹ - ۱۸' },
    { key: 'contact_instagram', value: 'https://www.instagram.com/aban.ec?igsh=MWJqZGsyc3Zya3F1Mw==' },
    { key: 'contact_linkedin', value: 'https://www.linkedin.com/in/aban-e-commerce-bb4412415?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' },
    { key: 'contact_telegram', value: 'https://t.me/abanagency' },
    { key: 'contact_whatsapp', value: 'https://wa.me/message/JSIPIQGW3NESM1' },
    { key: 'services_data', value: JSON.stringify({
      heroTitle: 'خدمات ما',
      heroSubtitle: 'راه‌حل‌های جامع دیجیتال برای رشد کسب‌وکار شما. از طراحی وبسایت تا بازاریابی دیجیتال، همه چیز در یکجا.',
      mobileTitle: 'خدمات ما',
      mobileSubtitle: 'راه‌حل‌های دیجیتال جامع برای کسب‌وکار شما',
      ctaTitle: 'آماده شروع پروژه شما هستیم',
      ctaSubtitle: 'برای مشاوره رایگان و دریافت قیمت با ما تماس بگیرید',
      mobileCTATitle: 'مشاوره رایگان',
      mobileCTASubtitle: 'همین امروز با ما در تماس باشید',
      items: [
        { id: 1, title: 'طراحی و توسعه وبسایت', description: 'طراحی وبسایت‌های حرفه‌ای، مدرن و واکنش‌گرا با آخرین تکنولوژی‌های روز دنیا', visible: true },
        { id: 2, title: 'توسعه اپلیکیشن موبایل', description: 'توسعه اپلیکیشن‌های موبایل اندروید و iOS با بهترین عملکرد و تجربه کاربری', visible: true },
        { id: 3, title: 'سئو و بازاریابی دیجیتال', description: 'افزایش رتبه سایت در گوگل و جذب ترافیک هدفمند با استراتژی‌های حرفه‌ای', visible: true },
      ],
    })},
  ];

  // upsert = safe to run multiple times, no duplicate key errors
  for (const item of contentItems) {
    await prisma.siteContent.upsert({
      where: { key: item.key },
      update: { value: item.value },
      create: item,
    });
  }
  console.log('✅ Site content seeded');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch(e => { console.error('❌ Seed error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
