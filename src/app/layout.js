import "./globals.css";
import ContactFloatingButton from "../components/ContactFloatingButton";
import MainLayout from "../components/MainLayout";

export const metadata = {
  title: "Spider Store | شحن الألعاب والخدمات الرقمية",
  description: "متجر Spider Store لشحن شدات وجواهر الألعاب وتفعيل الاشتراكات والبطاقات الرقمية بأفضل الأسعار وأسرع تنفيذ.",
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
