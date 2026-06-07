"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/config";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Customer states
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
  const [customerUser, setCustomerUser] = useState(null);

  // Backup static categories if backend is unreachable
  const staticCategories = [
    { id: 1, name: "شحن ألعاب", image: "games" },
    { id: 2, name: "شحن تطبيقات", image: "apps" },
    { id: 3, name: "الأرصدة والاتصالات", image: "telecom" },
    { id: 4, name: "الدفع الإلكتروني", image: "payment" },
    { id: 5, name: "تفعيل البرامج", image: "software" },
    { id: 6, name: "الحسابات والاشتراكات", image: "accounts" }
  ];

  const defaultSlides = [
    {
      title: "صرف USDT بأفضل سعر",
      highlight: "Zoom USDT",
      desc: "كافة طرق الدفع متاحة | عمولة صفر | تنفيذ تلقائي فوري 100% وآمن تماماً.",
      badge: "عرض خاص",
      color: "#10b981",
      icon: "🪙"
    },
    {
      title: "شدات ببجي موبايل بأقل الأسعار",
      highlight: "PUBG Mobile UC",
      desc: "شحن مباشر وسريع في حسابك عبر الآيدي ID على مدار 24 ساعة.",
      badge: "الأكثر مبيعاً",
      color: "#f59e0b",
      icon: "🎮"
    },
    {
      title: "تفعيل اشتراكات برامج التصميم والـ AI",
      highlight: "Canva & ChatGPT",
      desc: "حسابات كانفا برو وشات جي بي تي بلس بتفعيل فوري ومضمون.",
      badge: "الجديد كلياً",
      color: "#2563eb",
      icon: "🚀"
    }
  ];

  const [slides, setSlides] = useState(defaultSlides);

  useEffect(() => {
    // Check customer login
    const token = localStorage.getItem("customer_token");
    const userStr = localStorage.getItem("customer_user");
    if (token && userStr) {
      setIsCustomerLoggedIn(true);
      setCustomerUser(JSON.parse(userStr));

      fetch(`${API_BASE_URL}/api/customer/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((profile) => {
          if (profile) {
            setCustomerUser(profile);
            localStorage.setItem("customer_user", JSON.stringify(profile));
          }
        })
        .catch(() => {});
    }

    // Check URL parameters for search term
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const searchParam = urlParams.get("search");
      if (searchParam) {
        setSearchTerm(searchParam);
      }
    }

    // Fetch categories from backend
    fetch(`${API_BASE_URL}/api/categories`)
      .then((res) => {
        if (!res.ok) throw new Error("Backend unreachable");
        return res.json();
      })
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Using fallback categories:", err.message);
        setCategories(staticCategories);
        setLoading(false);
      });

    // Fetch banners from backend
    fetch(`${API_BASE_URL}/api/banners`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (data && data.length > 0) {
          setSlides(data);
        }
      })
      .catch((err) => {
        console.warn("Using default static banners:", err);
      });
  }, []);

  // Auto-scroll hero banner carousel
  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  const handleCustomerLogout = () => {
    localStorage.removeItem("customer_token");
    localStorage.removeItem("customer_user");
    setIsCustomerLoggedIn(false);
    setCustomerUser(null);
  };

  const getCategoryIcon = (imageType) => {
    if (!imageType) return "📁";
    if (imageType.startsWith("data:image") || imageType.startsWith("http") || imageType.startsWith("/uploads")) {
      const src = imageType.startsWith("/uploads") ? `${API_BASE_URL}${imageType}` : imageType;
      return <img src={src} alt="Category Icon" style={{ width: "48px", height: "48px", objectFit: "contain", borderRadius: "8px" }} />;
    }
    switch (imageType) {
      case "games":
        return "🎮";
      case "apps":
        return "📱";
      case "telecom":
        return "📞";
      case "payment":
        return "💳";
      case "software":
        return "💻";
      case "accounts":
        return "🔑";
      default:
        return "📁";
    }
  };

  // Filter categories by search term
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Burger Menu Drawer Overlay - Outside glass-container for proper fixed positioning */}
      {menuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMenuOpen(false)} />
      )}
      <div className={`mobile-drawer ${menuOpen ? "open" : "closed"}`}>
        <div className="mobile-drawer-header">
          <span className="mobile-drawer-title">تصفح الموقع</span>
          <button className="mobile-drawer-close" onClick={() => setMenuOpen(false)}>✕</button>
        </div>
        
        {isCustomerLoggedIn ? (
          <div className="mobile-drawer-user-card" style={{ marginBottom: "10px" }}>
            <span>👤</span>
            <div>مرحباً، {customerUser?.username}</div>
          </div>
        ) : (
          <Link href="/login" className="mobile-drawer-link" onClick={() => setMenuOpen(false)}>
            <span>👤</span>
            حسابي (تسجيل الدخول)
          </Link>
        )}
        
        <div className="mobile-drawer-divider" />
        
        <Link href="/" className="mobile-drawer-link active" onClick={() => setMenuOpen(false)}>
          🏠 الرئيسية
        </Link>
        <Link href="/orders" className="mobile-drawer-link" onClick={() => setMenuOpen(false)}>
          📦 تتبع طلباتي ومشترياتي
        </Link>
        {isCustomerLoggedIn && (
          <Link href="/wallet" className="mobile-drawer-link" onClick={() => setMenuOpen(false)}>
            💳 محفظتي وشحن الرصيد
          </Link>
        )}
        
        <div className="mobile-drawer-divider" />
        
        {isCustomerLoggedIn && (
          <button className="mobile-drawer-link danger" onClick={() => { handleCustomerLogout(); setMenuOpen(false); }}>
            تسجيل الخروج 🚪
          </button>
        )}
        
        <div style={{ padding: "10px 16px", fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "auto" }}>
          قسم الدعم الفني متاح 24/7 لمساعدتكم.
        </div>
      </div>

      <div className="glass-container">
      {/* Header / Navbar */}
      <header className="navbar">
        <div className="nav-right">
          <button 
            className="nav-icon-btn nav-burger-btn" 
            onClick={() => setMenuOpen(!menuOpen)}
            title="القائمة"
          >
            <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>☰</span>
          </button>

          <div className="nav-links-desktop">
            <Link href="/">الرئيسية</Link>
            <Link href="/orders">تتبع الطلبات</Link>
            {isCustomerLoggedIn && <Link href="/wallet">محفظتي</Link>}
          </div>
          
          <div className="balance-widget">
            <span className="balance-title">الرصيد الحالي</span>
            <span className="balance-value">{Number(customerUser?.balance || 0).toFixed(2)} USD</span>
          </div>
        </div>

        {/* Desktop Search Bar */}
        <div className="nav-search-wrapper">
          <input
            type="text"
            className="nav-search-input"
            placeholder="ابحث عن قسم أو خدمة شحن..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="nav-search-icon">🔍</span>
        </div>

        <div className="nav-left">
          <button 
            className="nav-text-btn nav-search-mobile-btn" 
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            title="البحث"
          >
            <span className="nav-btn-text">البحث</span>
            <span className="nav-btn-icon">🔍</span>
          </button>

          <button 
            className="nav-text-btn nav-mobile-hidden" 
            onClick={() => setNotificationOpen(!notificationOpen)}
            title="الإشعارات"
          >
            <span className="nav-btn-text">الإشعارات</span>
            <span className="nav-btn-icon">🔔</span>
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
              <span className="logo-text">Spider Store</span>
            </div>
          </Link>
        </div>
      </header>

      {/* Mobile Search Bar Dropdown */}
      <div className={`mobile-search-bar-container ${mobileSearchOpen ? "open" : ""}`}>
        <div className="mobile-search-bar-inner">
          <div className="mobile-search-bar">
            <input
              type="text"
              className="nav-search-input"
              placeholder="ابحث عن قسم أو خدمة شحن..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="nav-search-icon">🔍</span>
          </div>
        </div>
      </div>


      {/* Notifications Drawer */}
      {notificationOpen && (
        <div className="overlay" onClick={() => setNotificationOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ width: "90%", maxWidth: "350px", position: "absolute", left: "10px", top: "85px" }}>
            <div className="modal-header">
              <h3 style={{ fontWeight: 800 }}>تنبيهات النظام</h3>
              <button className="modal-close" onClick={() => setNotificationOpen(false)}>×</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "10px" }}>
              <div style={{ padding: "10px", borderRadius: "8px", background: "rgba(16, 185, 129, 0.1)", borderLeft: "4px solid var(--success-color)", fontSize: "0.85rem" }}>
                <strong>شحن USDT تلقائي:</strong> يمكنك الآن شراء وسحب الـ USDT بأمان عبر محفظتك الإلكترونية مباشرة.
              </div>
              <div style={{ padding: "10px", borderRadius: "8px", background: "rgba(37, 99, 235, 0.1)", borderLeft: "4px solid var(--primary-color)", fontSize: "0.85rem" }}>
                <strong>تحديث الأسعار:</strong> تم تحديث أسعار شدات ببجي موبايل وعروض فري فاير اليومية.
              </div>
              <div style={{ padding: "10px", borderRadius: "8px", background: "rgba(139, 92, 246, 0.1)", borderLeft: "4px solid #8b5cf6", fontSize: "0.85rem" }}>
                <strong>المحفظة الجديدة:</strong> يمكنك شحن رصيد حسابك من صفحة المحفظة ثم تتم الموافقة عليه من لوحة التحكم.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar has been moved to Navbar */}

      {/* Hero Slide Banner */}
      <section className="hero-banner">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className="banner-content"
            style={{
              opacity: currentSlide === idx ? 1 : 0,
              visibility: currentSlide === idx ? "visible" : "hidden",
              transition: "opacity 0.6s ease-in-out, visibility 0.6s ease-in-out"
            }}
          >
            <div className="banner-info">
              <span className="banner-badge" style={{ borderColor: slide.color, color: slide.color, background: `${slide.color}22` }}>
                {slide.badge}
              </span>
              <h1 className="banner-title">
                {slide.title} <br />
                <span style={{ backgroundImage: `linear-gradient(135deg, #ffffff 0%, ${slide.color} 100%)`, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" }}>
                  {slide.highlight}
                </span>
              </h1>
              <p className="banner-desc">{slide.desc}</p>
            </div>
            <div className="banner-graphic">
              {slide.icon && (slide.icon.startsWith("data:image") || slide.icon.startsWith("http") || slide.icon.startsWith("/uploads")) ? (
                <img 
                  src={slide.icon.startsWith("/uploads") ? `${API_BASE_URL}${slide.icon}` : slide.icon} 
                  alt={slide.title} 
                  style={{ width: "220px", height: "220px", objectFit: "contain", filter: `drop-shadow(0 0 25px ${slide.color}66)` }} 
                />
              ) : (
                <span className="coin-icon" style={{ color: slide.color, filter: `drop-shadow(0 0 25px ${slide.color}66)` }}>
                  {slide.icon}
                </span>
              )}
            </div>
          </div>
        ))}

        {/* Carousel Dots */}
        <div style={{ position: "absolute", bottom: "15px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "8px" }}>
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              style={{
                width: currentSlide === idx ? "20px" : "8px",
                height: "8px",
                borderRadius: "4px",
                border: "none",
                background: currentSlide === idx ? "#ffffff" : "rgba(255,255,255,0.4)",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
            />
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section>
        <h2 className="section-title">الأقسام المتوفرة</h2>
        
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", fontSize: "1.2rem", fontWeight: 700 }}>
            جاري تحميل الأقسام...
          </div>
        ) : filteredCategories.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
            لا توجد أقسام مطابقة للبحث.
          </div>
        ) : (
          <div className="categories-grid">
            {filteredCategories.map((cat) => {
              const isCustomImg = cat.image && (cat.image.startsWith("data:image") || cat.image.startsWith("http") || cat.image.startsWith("/uploads"));
              return (
                <Link href={`/category/${cat.id}`} key={cat.id}>
                  <div className="glass-card category-card">
                    <div className="category-img-container" style={isCustomImg ? { padding: 0 } : {}}>
                      {isCustomImg ? (
                        <img 
                          src={cat.image.startsWith("/uploads") ? `${API_BASE_URL}${cat.image}` : cat.image} 
                          alt={cat.name} 
                          style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                        />
                      ) : (
                        <span className="category-banner-icon">
                          {getCategoryIcon(cat.image)}
                        </span>
                      )}
                    </div>
                    <h3 className="category-title">{cat.name}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
      {/* Bottom Navigation Bar */}
      <nav className="bottom-nav">
        <Link href="/" className="bottom-nav-item active">
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
    </>
  );
}
