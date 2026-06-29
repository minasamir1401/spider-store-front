import "./globals.css";
import ContactFloatingButton from "../components/ContactFloatingButton";
import MainLayout from "../components/MainLayout";
import { API_BASE_URL, SITE_URL, fetchWithTimeout } from "../config";

// Skip API fetch during Vercel build when the API is not reachable
const isBuildTime = typeof window === "undefined" && (API_BASE_URL.includes("localhost") || API_BASE_URL.includes("127.0.0.1"));

export async function generateMetadata() {
  let siteName = "عرب تك سيرفر";
  let siteLogo = "/logo.jpg";
  let siteFavicon = "/favicon.png";

  if (!isBuildTime) {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/api/settings`, { next: { revalidate: 10 } });
      if (res.ok) {
        const settings = await res.json();
        if (settings.site_name) siteName = settings.site_name;
        if (settings.site_logo && settings.site_logo !== "default") siteLogo = settings.site_logo;
        if (settings.site_favicon && settings.site_favicon !== "default") siteFavicon = settings.site_favicon;
      }
    } catch (error) {
      console.error("Failed to fetch settings for metadata:", error);
    }
  }

  const siteLogoUrl = siteLogo.startsWith("http") || siteLogo.startsWith("data:") ? siteLogo : (siteLogo.startsWith("/") ? `${SITE_URL}${siteLogo}` : `${API_BASE_URL}${siteLogo}`);
  const siteFaviconUrl = siteFavicon.startsWith("http") || siteFavicon.startsWith("data:") ? siteFavicon : (siteFavicon.startsWith("/") ? `${SITE_URL}${siteFavicon}` : `${API_BASE_URL}${siteFavicon}`);

  const titleText = `${siteName} | لشحن الألعاب والخدمات الرقمية`;
  const descText = `متجر ${siteName} لشحن الألعاب والخدمات الرقمية والبطاقات. اشحن شدات وجواهر ألعابك المفضلة وتفعيل الاشتراكات بأفضل الأسعار وأسرع تنفيذ تلقائي.`;

  return {
    metadataBase: new URL(SITE_URL),
    title: titleText,
    description: descText,
    verification: {
      google: "BpQsEK6Xln0FauVIlj0qYpPxuzvoYrACWOehkyBc5-U",
    },
    keywords: [
      siteName,
      `${siteName} لشحن الالعاب`,
      `متجر ${siteName}`,
      "شحن شدات ببجي",
      "شحن جواهر فري فاير",
      "شحن USDT",
      "تفعيل كانفا برو",
      "تفعيل نتفليكس",
      "شحن فودافون كاش",
      "متجر شحن ألعاب"
    ],
    alternates: {
      canonical: SITE_URL,
    },
    openGraph: {
      title: titleText,
      description: descText,
      url: SITE_URL,
      siteName: siteName,
      images: [
        {
          url: siteLogoUrl,
          width: 1200,
          height: 630,
          alt: `${siteName} - شحن الألعاب والخدمات الرقمية`
        }
      ],
      locale: "ar_EG",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: titleText,
      description: descText,
      images: [siteLogoUrl],
    },
    icons: {
      icon: [
        { url: siteFaviconUrl, type: "image/png" }
      ],
      apple: [
        { url: siteLogoUrl, type: "image/png" }
      ],
      shortcut: siteFaviconUrl,
    }
  };
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }) {
  let siteName = "عرب تك سيرفر";
  let siteLogo = "/logo.jpg";
  let siteFavicon = "/favicon.png";

  if (!isBuildTime) {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/api/settings`, { next: { revalidate: 10 } });
      if (res.ok) {
        const settings = await res.json();
        if (settings.site_name) siteName = settings.site_name;
        if (settings.site_logo && settings.site_logo !== "default") siteLogo = settings.site_logo;
        if (settings.site_favicon && settings.site_favicon !== "default") siteFavicon = settings.site_favicon;
      }
    } catch (error) {
      console.error("Failed to fetch settings in layout:", error);
    }
  }

  const siteLogoUrl = siteLogo.startsWith("http") || siteLogo.startsWith("data:") ? siteLogo : (siteLogo.startsWith("/") ? `${SITE_URL}${siteLogo}` : `${API_BASE_URL}${siteLogo}`);
  const siteFaviconUrl = siteFavicon.startsWith("http") || siteFavicon.startsWith("data:") ? siteFavicon : (siteFavicon.startsWith("/") ? `${SITE_URL}${siteFavicon}` : `${API_BASE_URL}${siteFavicon}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        "name": siteName,
        "alternateName": [siteName],
        "url": SITE_URL,
        "logo": {
          "@type": "ImageObject",
          "@id": `${SITE_URL}/#logo`,
          "url": siteLogoUrl,
          "caption": `${siteName} Logo`
        },
        "description": `متجر ${siteName} لشحن الألعاب والخدمات الرقمية والبطاقات. اشحن شدات وجواهر ألعابك المفضلة وتفعيل الاشتراكات بأفضل الأسعار وأسرع تنفيذ تلقائي.`
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        "url": SITE_URL,
        "name": `${siteName} | لشحن الألعاب والخدمات الرقمية`,
        "description": `متجر ${siteName} لشحن الألعاب والخدمات الرقمية والبطاقات. اشحن شدات وجواهر ألعابك المفضلة وتفعيل الاشتراكات بأفضل الأسعار وأسرع تنفيذ تلقائي.`,
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
            "name": `ما هو متجر ${siteName}؟`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `متجر ${siteName} هو منصة متكاملة لشحن الألعاب وتفعيل الاشتراكات الرقمية وبطاقات الهدايا بأسرع تنفيذ تلقائي وأفضل الأسعار في مصر.`
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
            "name": `ما هي طرق الدفع المتاحة في متجر ${siteName}؟`,
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
              "text": `متجر ${siteName} آمن وموثوق 100%، وتتم كافة المعاملات عبر بوابات دفع مشفرة وخدمات شحن رسمية تضمن حماية حسابات اللاعبين.`
            }
          }
        ]
      }
    ]
  };

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="BpQsEK6Xln0FauVIlj0qYpPxuzvoYrACWOehkyBc5-U" />
        {/* PWA Settings */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00b4d8" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href={siteLogoUrl} />

        {/* Favicon / Tab Icon */}
        <link rel="icon" type="image/png" href={siteFaviconUrl} />
        <link rel="shortcut icon" href={siteFaviconUrl} />
        
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
      <body suppressHydrationWarning={true}>
        <MainLayout>
          {children}
          <ContactFloatingButton />
        </MainLayout>
      </body>
    </html>
  );
}
