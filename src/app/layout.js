import "./globals.css";
import ContactFloatingButton from "../components/ContactFloatingButton";
import MainLayout from "../components/MainLayout";
import { SITE_URL } from "../config";

export const metadata = {
  title: "سبايدر استور | متجر اسبيدر لشحن الألعاب والخدمات الرقمية مصر",
  description: "متجر سبايدر استور (اسبيدر مصر) لشحن الألعاب والخدمات الرقمية والبطاقات. اشحن شدات وجواهر ألعابك المفضلة وتفعيل الاشتراكات بأفضل الأسعار وأسرع تنفيذ تلقائي.",
  keywords: [
    "سبايدر استور",
    "سبايدر استور مصر",
    "متجر سبايدر",
    "سبايدر لشحن الالعاب",
    "سبايدر ستور",
    "سبايدر ستور مصر",
    "متجر سبايدر ستور",
    "اسبيدر استور مصر",
    "اسبيدر لشحن الالعاب",
    "اسبيدر استور لشحن الالعاب",
    "متجر اسبيدر",
    "اسبيدر استور",
    "شحن الالعاب اسبيدر",
    "شحن شدات ببجي اسبيدر",
    "شحن جواهر فري فاير اسبيدر",
    "اسبيدر شحن",
    "اسبيرد استور",
    "Spider Store",
    "Spider Store Egypt",
    "شحن شدات ببجي",
    "شحن جواهر فري فاير",
    "شحن USDT",
    "تفعيل كانفا برو",
    "تفعيل نتفليكس",
    "شحن فودافون كاش",
    "شحن رصيد",
    "متجر شحن ألعاب"
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "سبايدر استور | متجر اسبيدر لشحن الألعاب والخدمات الرقمية مصر",
    description: "متجر سبايدر استور (اسبيدر مصر) لشحن الألعاب والخدمات الرقمية والبطاقات. اشحن شدات وجواهر ألعابك المفضلة وتفعيل الاشتراكات بأفضل الأسعار وأسرع تنفيذ تلقائي.",
    url: SITE_URL,
    siteName: "Spider Store",
    images: [
      {
        url: `${SITE_URL}/uploads/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Spider Store - شحن الألعاب والخدمات الرقمية"
      }
    ],
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "سبايدر استور | متجر اسبيدر لشحن الألعاب والخدمات الرقمية مصر",
    description: "متجر سبايدر استور (اسبيدر مصر) لشحن الألعاب والخدمات الرقمية والبطاقات. اشحن شدات وجواهر ألعابك المفضلة وتفعيل الاشتراكات بأفضل الأسعار وأسرع تنفيذ تلقائي.",
    images: [`${SITE_URL}/uploads/og-image.png`],
  },
  verification: {
    google: "yFNB147NXr3pxjnf_qGAB9wJrfQsTh2QTyh0bc5e8h8",
  },
  icons: {
    icon: [
      { url: "/icons/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        "name": "Spider Store - سبايدر استور",
        "alternateName": ["اسبيدر استور", "سبايدر استور", "سبايدر ستور", "اسبيرد استور", "اسبيدر استور مصر", "Spider Store Egypt", "اسبيدر لشحن الالعاب", "متجر اسبيدر", "متجر سبايدر"],
        "url": SITE_URL,
        "logo": {
          "@type": "ImageObject",
          "@id": `${SITE_URL}/#logo`,
          "url": `${SITE_URL}/icons/icon-192.png`,
          "caption": "Spider Store Logo"
        },
        "description": "متجر سبايدر استور (اسبيدر مصر) لشحن الألعاب والخدمات الرقمية والبطاقات. اشحن شدات وجواهر ألعابك المفضلة وتفعيل الاشتراكات بأفضل الأسعار وأسرع تنفيذ تلقائي."
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        "url": SITE_URL,
        "name": "سبايدر استور | متجر اسبيدر لشحن الألعاب والخدمات الرقمية مصر",
        "description": "متجر سبايدر استور (اسبيدر مصر) لشحن الألعاب والخدمات الرقمية والبطاقات. اشحن شدات وجواهر ألعابك المفضلة وتفعيل الاشتراكات بأفضل الأسعار وأسرع تنفيذ تلقائي.",
        "publisher": {
          "@id": `${SITE_URL}/#organization`
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${SITE_URL}/?search={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        },
        "inLanguage": "ar"
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "ما هو متجر سبايدر استور (Spider Store)؟",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "متجر سبايدر استور (اسبيدر) هو منصة متكاملة لشحن الألعاب وتفعيل الاشتراكات الرقمية وبطاقات الهدايا بأسرع تنفيذ تلقائي وأفضل الأسعار في مصر."
            }
          },
          {
            "@type": "Question",
            "name": "كيف يمكنني شحن شدات ببجي أو جواهر فري فاير؟",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "يمكنك شحن ألعابك المفضلة مباشرة عبر معرّف اللاعب (Player ID) من خلال اختيار اللعبة، وتحديد الفئة، وإتمام الدفع لتبدأ عملية الشحن التلقائي فوراً."
            }
          },
          {
            "@type": "Question",
            "name": "ما هي طرق الدفع المتاحة في متجر سبايدر؟",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "يدعم المتجر الدفع الإلكتروني المباشر، الدفع عبر رصيد المحفظة الخاص بك، وطرق الدفع المحلية مثل فودافون كاش ومحافظ الهاتف الذكي في مصر."
            }
          },
          {
            "@type": "Question",
            "name": "كيف أضمن أمان شحن الألعاب والخدمات؟",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "متجر سبايدر استور آمن وموثوق 100%، وتتم كافة المعاملات عبر بوابات دفع مشفرة وخدمات شحن رسمية تضمن حماية حسابات اللاعبين."
            }
          }
        ]
      }
    ]
  };

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        {/* PWA Settings */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00b4d8" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />

        {/* Favicon / Tab Icon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16.png" />
        <link rel="shortcut icon" href="/favicon.png" />
        
        {/* SEO Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Anti-Flicker Theme Initialization Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('theme');
                  var theme = savedTheme || 'dark';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {
                  console.error('Failed to set theme early:', e);
                }
              })();
            `,
          }}
        />

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    },
                    function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </head>
      <body>
        <MainLayout>
          {children}
          <ContactFloatingButton />
        </MainLayout>
      </body>
    </html>
  );
}
