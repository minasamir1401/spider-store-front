import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        {/* About column */}
        <div className="footer-column">
          <div className="logo-container" style={{ cursor: "default" }}>
            <span style={{ fontSize: "1.2rem" }}>Spider Store</span>
            <div className="logo-circle" style={{ width: "36px", height: "36px", fontSize: "1.2rem" }}>S</div>
          </div>
          <p className="footer-desc" style={{ marginTop: "10px" }}>
            المنصة العربية الأسرع والأكثر أماناً لشحن شدات وجواهر الألعاب وتفعيل الاشتراكات الترفيهية والخدمية والبطاقات الرقمية بأفضل الأسعار على مدار الساعة.
          </p>
        </div>

        {/* Links column */}
        <div className="footer-column">
          <h4 className="footer-title">روابط سريعة</h4>
          <div className="footer-links">
            <Link href="/">🏠 الصفحة الرئيسية</Link>
            <Link href="/orders">📦 تتبع طلباتي ومشترياتي</Link>
            <Link href="/wallet">💳 محفظتي وشحن الرصيد</Link>
            <Link href="/login">👤 تسجيل الدخول / حساب جديد</Link>
          </div>
        </div>

        {/* Support column */}
        <div className="footer-column">
          <h4 className="footer-title">الدعم الفني والمساعدة</h4>
          <p className="footer-desc">
            فريق الدعم الفني متواجد لمساعدتكم 24 ساعة طوال أيام الأسبوع لحل أي مشكلة تتعلق بالشحن أو الدفع.
          </p>
          <div className="footer-links" style={{ marginTop: "5px" }}>
            <a href="https://wa.me/message/7J7PQMKIB2G7O1" target="_blank" rel="noopener noreferrer">💬 واتساب الدعم</a>
            <a href="https://t.me/spaider_store_2" target="_blank" rel="noopener noreferrer">✈️ تلجرام الدعم</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        جميع الحقوق محفوظة © {new Date().getFullYear()} لصالح متجر Spider Store. تصميم فخم ومطور بالكامل.
      </div>
    </footer>
  );
}
