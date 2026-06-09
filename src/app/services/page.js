"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/config";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const staticServices = [
    {
      id: 1,
      category_id: 1,
      name: "ببجي موبايل (PUBG Mobile)",
      description: "اشحن شدات ببجي موبايل فوراً ومباشرة في حسابك عن طريق الآيدي ID بأفضل الأسعار.",
      price: 0.99,
      image: "pubg"
    },
    {
      id: 2,
      category_id: 1,
      name: "فري فاير (Free Fire)",
      description: "اشحن جواهر فري فاير فوراً لتفعيل الفاير باس والحصول على أحدث سكنات اللعبة عبر الآيدي.",
      price: 1.10,
      image: "freefire"
    },
    {
      id: 3,
      category_id: 2,
      name: "بيجو لايف (Bigo Live)",
      description: "اشحن فاصوليا ومجوهرات تطبيق بيجو لايف لدعم البث المباشر المفضل لديك.",
      price: 1.25,
      image: "bigo"
    },
    {
      id: 4,
      category_id: 3,
      name: "فودافون كاش مصر (Vodafone Cash)",
      description: "شحن رصيد وتحويل أموال عبر محفظة فودافون كاش مباشرة بسعر الصرف الممتاز.",
      price: 1.00,
      image: "vodafone"
    },
    {
      id: 5,
      category_id: 4,
      name: "شحن رصيد USDT (TRC20)",
      description: "شراء وسحب عملة USDT الرقمية بأفضل أسعار الصرف وبسرعة تنفيذ خيالية.",
      price: 1.00,
      image: "usdt"
    },
    {
      id: 6,
      category_id: 5,
      name: "اشتراك كانفا برو (Canva Pro)",
      description: "تفعيل اشتراك كانفا برو الحساب الشخصي بكافة ميزات التصميم والذكاء الاصطناعي.",
      price: 1.99,
      image: "canva"
    },
    {
      id: 7,
      category_id: 6,
      name: "اشتراك نتفليكس (Netflix Premium)",
      description: "شاشة خاصة بك بجودة 4K UHD على حساب نتفليكس مشترك أو حساب مستقل بالكامل.",
      price: 2.50,
      image: "netflix"
    }
  ];

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/services`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch(() => {
        setServices(staticServices);
        setLoading(false);
      });
  }, []);

  const getServiceIcon = (image) => {
    if (!image) return "⚡";
    if (image.startsWith("data:image") || image.startsWith("http") || image.startsWith("/uploads")) {
      const src = image.startsWith("/uploads") ? `${API_BASE_URL}${image}` : image;
      return <img src={src} alt="Service Icon" style={{ width: "45px", height: "45px", objectFit: "contain", borderRadius: "8px" }} />;
    }
    if (image.includes("pubg")) return "🔫";
    if (image.includes("freefire")) return "🔥";
    if (image.includes("bigo")) return "💬";
    if (image.includes("vodafone")) return "📱";
    if (image.includes("usdt")) return "🪙";
    if (image.includes("canva")) return "🎨";
    if (image.includes("netflix")) return "🎬";
    return "⚡";
  };

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Announcement Banner */}
      <div className="announcement-banner">
        <span>✨</span>
        <span>عملائنا الأعزاء — للحصول على أسعار الجملة يرجى التواصل مع الإدارة.</span>
      </div>

      {/* Page Title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", marginBottom: "10px", gap: "12px", flexWrap: "wrap" }}>
        <h2 className="section-title" style={{ margin: 0 }}>الخدمات المتاحة</h2>
        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "600" }}>
          {filteredServices.length} خدمة متوفرة
        </span>
      </div>
      <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", margin: "0 0 20px 0" }}>
        تصفح وابحث في كافة الخدمات الرقمية المتوفرة للشحن والدفع المباشر.
      </p>

      {/* Centered Search Bar */}
      <div className="search-container-center">
        <input
          type="text"
          className="search-input-center"
          placeholder="ابحث عن خدمة شحن، بطاقات، ألعاب..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="search-icon-center">🔍</span>
      </div>

      {/* Services List (scc-grid) */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", fontSize: "1.2rem", fontWeight: 700 }}>
          جاري تحميل الخدمات...
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: "center", padding: "40px" }}>
          <span style={{ fontSize: "3rem" }}>📭</span>
          <h3 style={{ margin: "15px 0 10px 0" }}>لا تتوفر خدمات مطابقة للبحث</h3>
          <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>يرجى تجربة كلمات بحث أخرى أو تصفح الأقسام الرئيسية.</p>
          <Link href="/" className="glass-btn glass-btn-primary">العودة للرئيسية</Link>
        </div>
      ) : (
        <div className="scc-grid">
          {filteredServices.map((service) => {
            const isCustomImg = service.image && (service.image.startsWith("data:image") || service.image.startsWith("http") || service.image.startsWith("/uploads"));
            return (
              <Link href={`/service/${service.id}`} className="scc-card" key={service.id}>
                {/* Image on the right */}
                <div className="scc-image-container">
                  {isCustomImg ? (
                    <img 
                      src={service.image.startsWith("/uploads") ? `${API_BASE_URL}${service.image}` : service.image} 
                      alt={service.name} 
                    />
                  ) : (
                    <span style={{ fontSize: "2rem" }}>
                      {getServiceIcon(service.image)}
                    </span>
                  )}
                </div>

                {/* Text details in the middle */}
                <div className="scc-info">
                  <h3 className="scc-title">{service.name}</h3>
                  <p className="scc-desc">{service.description}</p>
                </div>

                {/* Action and price on the left */}
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", alignItems: "flex-end", minWidth: "90px" }}>
                  <div className="scc-action">اضغط للعرض</div>
                  <div style={{ fontSize: "0.85rem", fontWeight: "800", color: "var(--primary-color)", marginTop: "12px" }}>
                    {service.price ? Number(service.price).toFixed(2) : "0.00"} ج.م
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
