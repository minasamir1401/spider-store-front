"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/config";

export default function CategoryServices({ params }) {
  // Unwrap params using React.use() to comply with Next.js 15+ specifications
  const unwrappedParams = use(params);
  const categoryId = unwrappedParams.id;
  const router = useRouter();

  const [categoryName, setCategoryName] = useState("");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Backup static services if backend is unreachable
  const staticServices = [
    {
      id: 1,
      category_id: 1,
      name: "ببجي موبايل (PUBG Mobile)",
      description: "اشحن شدات ببجي موبايل فوراً ومباشرة في حسابك عن طريق الآيدي ID بأفضل الأسعار.",
      price: 0.99,
      image: "pubg",
      packages: [
        { id: 1, name: "60 شدة (UC)", price: 0.99 },
        { id: 2, name: "325 شدة (UC)", price: 4.85 },
        { id: 3, name: "660 شدة (UC)", price: 9.50 }
      ]
    },
    {
      id: 2,
      category_id: 1,
      name: "فري فاير (Free Fire)",
      description: "اشحن جواهر فري فاير فوراً لتفعيل الفاير باس والحصول على أحدث سكنات اللعبة عبر الآيدي.",
      price: 1.10,
      image: "freefire",
      packages: [
        { id: 1, name: "110 جوهرة", price: 1.10 },
        { id: 2, name: "231 جوهرة", price: 2.20 }
      ]
    },
    {
      id: 3,
      category_id: 2,
      name: "بيجو لايف (Bigo Live)",
      description: "اشحن فاصوليا ومجوهرات تطبيق بيجو لايف لدعم البث المباشر المفضل لديك.",
      price: 1.25,
      image: "bigo",
      packages: [
        { id: 1, name: "42 جوهرة", price: 1.25 }
      ]
    },
    {
      id: 4,
      category_id: 3,
      name: "فودافون كاش مصر (Vodafone Cash)",
      description: "شحن رصيد وتحويل أموال عبر محفظة فودافون كاش مباشرة بسعر الصرف الممتاز.",
      price: 1.00,
      image: "vodafone",
      packages: [
        { id: 1, name: "إرسال 100 جنيه مصري", price: 2.10 }
      ]
    },
    {
      id: 5,
      category_id: 4,
      name: "شحن رصيد USDT (TRC20)",
      description: "شراء وسحب عملة USDT الرقمية بأفضل أسعار الصرف وبسرعة تنفيذ خيالية.",
      price: 1.00,
      image: "usdt",
      packages: [
        { id: 1, name: "10 USDT", price: 10.30 }
      ]
    },
    {
      id: 6,
      category_id: 5,
      name: "اشتراك كانفا برو (Canva Pro)",
      description: "تفعيل اشتراك كانفا برو الحساب الشخصي بكافة ميزات التصميم والذكاء الاصطناعي.",
      price: 1.99,
      image: "canva",
      packages: [
        { id: 1, name: "تفعيل لمدة شهر", price: 1.99 }
      ]
    },
    {
      id: 7,
      category_id: 6,
      name: "اشتراك نتفليكس (Netflix Premium)",
      description: "شاشة خاصة بك بجودة 4K UHD على حساب نتفليكس مشترك أو حساب مستقل بالكامل.",
      price: 2.50,
      image: "netflix",
      packages: [
        { id: 1, name: "شاشة واحدة لمدة شهر 4K", price: 2.50 }
      ]
    }
  ];

  const categoryNamesMap = {
    1: "شحن ألعاب",
    2: "شحن تطبيقات",
    3: "الأرصدة والاتصالات",
    4: "الدفع الإلكتروني",
    5: "تفعيل البرامج",
    6: "الحسابات والاشتراكات"
  };

  useEffect(() => {
    setLoading(true);

    // Fetch category name
    fetch(`${API_BASE_URL}/api/categories`)
      .then(res => res.json())
      .then(cats => {
        const cat = cats.find(c => c.id === Number(categoryId));
        if (cat) setCategoryName(cat.name);
        else setCategoryName(categoryNamesMap[categoryId] || "الخدمات المتاحة");
      })
      .catch(() => {
        setCategoryName(categoryNamesMap[categoryId] || "الخدمات المتاحة");
      });

    // Fetch services filtering by category_id
    fetch(`${API_BASE_URL}/api/services?category_id=${categoryId}`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback filtering by category ID
        const filtered = staticServices.filter(s => s.category_id === Number(categoryId));
        setServices(filtered);
        setLoading(false);
      });
  }, [categoryId]);

  const [searchTerm, setSearchTerm] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
  const [customerUser, setCustomerUser] = useState(null);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("customer_token");
    const userStr = localStorage.getItem("customer_user");
    if (token && userStr) {
      setIsCustomerLoggedIn(true);
      setCustomerUser(JSON.parse(userStr));
    }
  }, []);

  const handleCustomerLogout = () => {
    localStorage.removeItem("customer_token");
    localStorage.removeItem("customer_user");
    setIsCustomerLoggedIn(false);
    setCustomerUser(null);
  };

  const [drawerOpen, setDrawerOpen] = useState(false);

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

  return (
    <div className="glass-container">
      {/* Mobile Drawer Overlay */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(4,6,14,0.75)",
            backdropFilter: "blur(6px)", zIndex: 999
          }}
        />
      )}

      {/* Mobile Drawer */}
      <div style={{
        position: "fixed", top: 0, right: 0, height: "100vh", width: "280px",
        background: "rgba(13,18,36,0.97)", backdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.07)", zIndex: 1000,
        transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
        display: "flex", flexDirection: "column", padding: "28px 20px", gap: "12px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "#fff" }}>القائمة</span>
          <button onClick={() => setDrawerOpen(false)} style={{
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "50%", width: "36px", height: "36px", cursor: "pointer",
            color: "#fff", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center"
          }}>✕</button>
        </div>
        {[
          { href: "/", label: "🏠 الرئيسية" },
          { href: "/orders", label: "📦 تتبع الطلبات" },
          { href: "/wallet", label: "💳 شحن رصيدي" },
          { href: "/login", label: "👤 حسابي", hide: isCustomerLoggedIn },
        ].filter(i => !i.hide).map(item => (
          <Link key={item.href} href={item.href} onClick={() => setDrawerOpen(false)} style={{
            padding: "13px 18px", borderRadius: "14px", background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)", color: "#e2e8f0",
            fontWeight: 600, fontSize: "0.95rem", display: "block", transition: "all 0.2s"
          }}>{item.label}</Link>
        ))}
        {isCustomerLoggedIn && (
          <>
            <div style={{ padding: "12px 18px", borderRadius: "14px", background: "rgba(139,92,246,0.08)",
              border: "1px solid rgba(139,92,246,0.2)", color: "#c084fc", fontWeight: 700, fontSize: "0.9rem" }}>
              👋 {customerUser?.username}
            </div>
            <button onClick={() => { handleCustomerLogout(); setDrawerOpen(false); }} style={{
              padding: "13px 18px", borderRadius: "14px", background: "rgba(244,63,94,0.08)",
              border: "1px solid rgba(244,63,94,0.2)", color: "#f87171",
              fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", textAlign: "right"
            }}>🚪 تسجيل الخروج</button>
          </>
        )}
      </div>

      {/* Header */}
      <header className="navbar">
        <div className="nav-right">
          <button className="nav-icon-btn" onClick={() => router.back()} title="رجوع">
            <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>→</span>
          </button>

          <div className="nav-links-desktop">
            <Link href="/">الرئيسية</Link>
            <Link href="/orders">تتبع الطلبات</Link>
          </div>
        </div>

        {/* Desktop Search Bar */}
        <form onSubmit={handleSearchSubmit} className="nav-search-wrapper">
          <input
            type="text"
            className="nav-search-input"
            placeholder="ابحث عن قسم أو خدمة شحن..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" style={{ display: "none" }} />
          <span className="nav-search-icon" onClick={handleSearchSubmit} style={{ cursor: "pointer", pointerEvents: "auto" }}>🔍</span>
        </form>

        <div className="nav-left">
          <button 
            className="nav-text-btn nav-search-mobile-btn" 
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            title="البحث"
          >
            <span className="nav-btn-text">البحث</span>
            <span className="nav-btn-icon">🔍</span>
          </button>

          {isCustomerLoggedIn ? (
            <div className="user-menu-widget nav-mobile-hidden">
              <span className="user-username">{customerUser?.username}</span>
              <span className="logout-btn-text" onClick={handleCustomerLogout}>
                <span className="nav-btn-text">خروج</span>
                <span className="nav-btn-icon" style={{ color: "var(--danger-color)" }}>🚪</span>
              </span>
            </div>
          ) : (
            <Link href="/login" className="nav-mobile-hidden">
              <button className="nav-text-btn" title="حسابي">
                <span className="nav-btn-text">حسابي</span>
                <span className="nav-btn-icon">👤</span>
              </button>
            </Link>
          )}

          <Link href="/">
            <div className="logo-container">
              <span className="logo-text" style={{ fontSize: "1.1rem" }}>SPIDER STORE</span>
              <div className="logo-circle">S</div>
            </div>
          </Link>

          {/* Hamburger Button */}
          <button
            className="nav-burger-btn"
            onClick={() => setDrawerOpen(true)}
            style={{
              width: "40px", height: "40px", borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)",
              cursor: "pointer", color: "#fff", fontSize: "1.3rem",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}
            aria-label="فتح القائمة"
          >☰</button>
        </div>
      </header>

      {/* Mobile Search Bar Dropdown */}
      <div className={`mobile-search-bar-container ${mobileSearchOpen ? "open" : ""}`}>
        <div className="mobile-search-bar-inner">
          <form onSubmit={handleSearchSubmit} className="mobile-search-bar">
            <input
              type="text"
              className="nav-search-input"
              placeholder="ابحث عن قسم أو خدمة شحن..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" style={{ display: "none" }} />
            <span className="nav-search-icon" onClick={handleSearchSubmit} style={{ cursor: "pointer", pointerEvents: "auto" }}>🔍</span>
          </form>
        </div>
      </div>

      {/* Page Title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", gap: "12px", flexWrap: "wrap" }}>
        <h2 className="section-title" style={{ margin: 0 }}>قسم {categoryName}</h2>
        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "600" }}>
          {services.length} خدمة متوفرة
        </span>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", fontSize: "1.2rem", fontWeight: 700 }}>
          جاري تحميل الخدمات...
        </div>
      ) : services.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: "center", padding: "40px" }}>
          <span style={{ fontSize: "3rem" }}>📭</span>
          <h3 style={{ margin: "15px 0 10px 0" }}>لا تتوفر خدمات في هذا القسم حالياً</h3>
          <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>سندرج خدمات جديدة قريباً جداً، ترقبوا التحديثات!</p>
          <Link href="/" className="glass-btn glass-btn-primary">العودة للرئيسية</Link>
        </div>
      ) : (
        <div className="services-grid">
          {services.map((service) => (
            <div className="glass-card service-card" key={service.id}>
              <div className="service-header">
                <div className="service-icon">
                  {getServiceIcon(service.image)}
                </div>
                <div className="service-meta">
                  <h3>{service.name}</h3>
                  <span>شحن مباشر وسريع</span>
                </div>
              </div>
              
              <p className="service-desc">{service.description}</p>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>تبدأ الأسعار من</span>
                  <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--primary-color)" }}>
                    ${service.price ? service.price.toFixed(2) : "0.00"}
                  </div>
                </div>
                
                <Link href={`/service/${service.id}`} className="glass-btn glass-btn-primary" style={{ padding: "8px 20px", fontSize: "0.9rem" }}>
                  شحن الآن
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Bottom Navigation Bar */}
      <nav className="bottom-nav">
        <Link href="/" className="bottom-nav-item">
          <span className="bottom-nav-icon">🏠</span>
          <span className="bottom-nav-label">الرئيسية</span>
        </Link>
        <Link href="/orders" className="bottom-nav-item">
          <span className="bottom-nav-icon">📦</span>
          <span className="bottom-nav-label">طلباتي</span>
        </Link>
        <Link href="/wallet" className="bottom-nav-item">
          <span className="bottom-nav-icon">💳</span>
          <span className="bottom-nav-label">محفظتي</span>
        </Link>
        <Link href="/login" className="bottom-nav-item">
          <span className="bottom-nav-icon">👤</span>
          <span className="bottom-nav-label">حسابي</span>
        </Link>
      </nav>
    </div>
  );
}
