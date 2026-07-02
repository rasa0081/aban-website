import Script from 'next/script';
import ThemeRegistry from '../components/ThemeRegistry';
import ClientLayout from '../components/ClientLayout';
import '../../public/fonts/fontface.css';
import './globals.css';

export const metadata = {
  metadataBase: new URL('https://aban.agency'),
  title: {
    default: 'آژانس تجارت الکترونیک آبان',
    template: '%s — آژانس آبان',
  },
  description: 'آژانس تجارت‌الکترونیک آبان ارائه دهنده خدمات حرفه‌ای در حوزه‌های طراحی‌گرافیک، برنامه‌نویسی و توسعه وبسایت، مارکتینگ وبازاریابی در دنیای  دیجیتال همگام با بروزترین متد‌ها در راستای ارزش‌های آبان و رضایت مشتریان است.',
  keywords: ['گرافیک', 'طراحی سایت', 'تجارت الکترونیک', 'سئو', 'دیجیتال مارکتینگ', 'طراحی وبسایت', 'آبان', 'تهران', 'تبلیغات', 'چاپ تجاری', 'وب سایت', 'وب اپلیکیشن', 'پنل مدیریتی', 'اپلیکیشن موبایل', 'UI UX design', 'تبلیغات محیطی','هویت بصری', 'طراحی بنر','اقلام سازمانی', 'طراحی لوگو', 'انیمیشن', 'بیلبورد', 'موشنگرافی', 'موشن گرافیک', 'موشن دیزاین', 'لوگو موشن', 'رابط کاریری', 'چاپ', 'بازاریابی دیجیتال', 'بازاریابی', 'مارکتینگ', 'تحلیل رقبا', 'برندینگ', 'استراتژی برند', 'کمپین فروش', 'آنالیز بازار', 'تولید محتوا', 'تبلیغ نویسی', 'تقویم محتوایی', 'سناریو نویسی'],
  authors: [{ name: 'آژانس آبان', url: 'https://aban.agency' }],
  creator: 'آژانس آبان',
  publisher: 'آژانس آبان',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'XbGPMdgx3xi30XK_aCNdXixgYvMPIKViCjFIKa3aSd8',
  },
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: 'https://aban.agency',
    siteName: 'آژانس تجارت‌الکترونیک آبان',
    title: 'آژانس آبان — داستان، چهره، اثر',
    description: 'آژانس تجارت‌الکترونیک آبان ارائه دهنده خدمات حرفه‌ای در حوزه‌های طراحی‌گرافیک، برنامه‌نویسی و توسعه وبسایت، مارکتینگ وبازاریابی در دنیای  دیجیتال همگام با بروزترین متد‌ها در راستای ارزش‌های آبان و رضایت مشتریان است.',
    images: [
      {
        url: '/Logo.png',
        width: 1200,
        height: 630,
        alt: 'آژانس آبان',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'آژانس آبان — داستان، چهره، اثر',
    description: 'آژانس تجارت الکترونیک آبان — طراحی وبسایت، توسعه اپلیکیشن، سئو و بازاریابی دیجیتال در تهران.',
    images: ['/Logo.png'],
  },
  alternates: {
    canonical: 'https://aban.agency',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v30.1.0/dist/font-face.css"
        />
        {/* JSON-LD: Organization structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'آژانس آبان',
              alternateName: 'Aban Agency',
              url: 'https://aban.agency',
              logo: 'https://aban.agency/Logo.png',
              description: 'آژانس تجارت الکترونیک آبان — طراحی وبسایت، توسعه اپلیکیشن، سئو و بازاریابی دیجیتال',
              slogan: 'داستان، چهره، اثر',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'تهران',
                addressCountry: 'IR',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                availableLanguage: 'Persian',
              },
              sameAs: [
                // 'https://instagram.com/aban.agency',
                // 'https://linkedin.com/company/aban-agency',
              ],
            }),
          }}
        />
      </head>
      <body>
        <ThemeRegistry>
          <ClientLayout>
            {children}
          </ClientLayout>
        </ThemeRegistry>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FPNH6H9DP7"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FPNH6H9DP7');
          `}
        </Script>
      </body>
    </html>
  );
}