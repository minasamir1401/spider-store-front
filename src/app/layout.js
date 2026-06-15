import "./globals.css";
import ContactFloatingButton from "../components/ContactFloatingButton";
import MainLayout from "../components/MainLayout";

export const metadata = {
  title: "اسبيدر استور مصر | متجر اسبيدر لشحن الألعاب والخدمات الرقمية",
  description: "متجر اسبيدر استور مصر لشحن الألعاب والخدمات الرقمية والبطاقات. اشحن شدات وجواهر ألعابك المفضلة وتفعيل الاشتراكات بأفضل الأسعار وأسرع تنفيذ تلقائي في مصر.",
  keywords: [
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
    canonical: "https://spider-store.vercel.app",
  },
  openGraph: {
    title: "اسبيدر استور مصر | متجر اسبيدر لشحن الألعاب والخدمات الرقمية",
    description: "متجر اسبيدر استور مصر لشحن الألعاب والخدمات الرقمية والبطاقات. اشحن شدات وجواهر ألعابك المفضلة وتفعيل الاشتراكات بأفضل الأسعار وأسرع تنفيذ تلقائي في مصر.",
    url: "https://spider-store.vercel.app",
    siteName: "Spider Store",
    images: [
      {
        url: "https://spider-store.vercel.app/uploads/og-image.png",
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
    title: "اسبيدر استور مصر | متجر اسبيدر لشحن الألعاب والخدمات الرقمية",
    description: "متجر اسبيدر استور مصر لشحن الألعاب والخدمات الرقمية والبطاقات. اشحن شدات وجواهر ألعابك المفضلة وتفعيل الاشتراكات بأفضل الأسعار وأسرع تنفيذ تلقائي في مصر.",
    images: ["https://spider-store.vercel.app/uploads/og-image.png"],
  },
  verification: {
    google: "gqLrYi58w5XaErY-bdg29ngTqxAQQ60V7qOw9MAGT1w",
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
        "@id": "https://spider-store.vercel.app/#organization",
        "name": "Spider Store - اسبيدر استور",
        "alternateName": ["اسبيرد استور", "اسبيدر استور مصر", "Spider Store Egypt", "اسبيدر استور لشحن الالعاب والخدمات الالكترونيه", "اسبيدر لشحن الالعاب", "متجر اسبيدر"],
        "url": "https://spider-store.vercel.app",
        "logo": {
          "@type": "ImageObject",
          "@id": "https://spider-store.vercel.app/#logo",
          "url": "https://spider-store.vercel.app/icons/icon-192.png",
          "caption": "Spider Store Logo"
        },
        "description": "متجر اسبيدر استور مصر لشحن الألعاب والخدمات الرقمية والبطاقات. اشحن شدات وجواهر ألعابك المفضلة وتفعيل الاشتراكات بأفضل الأسعار وأسرع تنفيذ تلقائي في مصر."
      },
      {
        "@type": "WebSite",
        "@id": "https://spider-store.vercel.app/#website",
        "url": "https://spider-store.vercel.app",
        "name": "اسبيدر استور مصر | متجر اسبيدر لشحن الألعاب والخدمات الرقمية",
        "description": "متجر اسبيدر استور مصر لشحن الألعاب والخدمات الرقمية والبطاقات. اشحن شدات وجواهر ألعابك المفضلة وتفعيل الاشتراكات بأفضل الأسعار وأسرع تنفيذ تلقائي في مصر.",
        "publisher": {
          "@id": "https://spider-store.vercel.app/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://spider-store.vercel.app/?search={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        },
        "inLanguage": "ar"
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
