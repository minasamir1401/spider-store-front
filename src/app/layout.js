import "./globals.css";
import Footer from "../components/Footer";
import ContactFloatingButton from "../components/ContactFloatingButton";

export const metadata = {
  title: "Spider Store | شحن الألعاب والبرامج",
  description: "الموقع الأول لشحن شدات وجواهر الألعاب وتفعيل الاشتراكات وتطبيقات الدردشة والبطاقات الرقمية بأسرع خدمة وأفضل الأسعار.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        {children}
        <Footer />
        <ContactFloatingButton />
      </body>
    </html>
  );
}
