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

  // Theme states
  const [theme, setTheme] = useState("dark");

  // PWA states
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

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
      color: "#00b4d8",
      icon: "🪙"
    },
    {
      title: "شدات ببجي موبايل بأقل الأسعار",
      highlight: "PUBG Mobile UC",
      desc: "شحن مباشر وسريع في حسابك عبر الآيدي ID على مدار 24 ساعة.",
      badge: "الأكثر مبيعاً",
      color: "#00b4d8",
      icon: "🎮"
    },
    {
      title: "تفعيل اشتراكات برامج التصميم والـ AI",
      highlight: "Canva & ChatGPT",
      desc: "حسابات كانفا برو وشات جي بي تي بلس بتفعيل فوري ومضمون.",
      badge: "الجديد كلياً",
      color: "#00b4d8",
      icon: "🚀"
    }
  ];

  const [slides, setSlides] = useState(defaultSlides);

  useEffect(() => {
    // Theme sync
    if (typeof window !== "undefined") {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
      setTheme(currentTheme);
    }

    // PWA Install Prompt Listener
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show custom banner if not already running in standalone PWA mode
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

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

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User choice outcome: ${outcome}`);
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

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
      {/* Announcement Banner */}
      <div className="announcement-banner">
        <span>✨</span>
        <span>عملائنا الأعزاء — للحصول على أسعار الجملة يرجى التواصل مع الإدارة.</span>
      </div>

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

      {/* Centered Search Bar */}
      <div className="search-container-center">
        <input
          type="text"
          className="search-input-center"
          placeholder="ابحث عن قسم أو خدمة شحن..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="search-icon-center">🔍</span>
      </div>

      {/* Categories Grid */}
      <section>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
          <h2 className="section-title" style={{ margin: 0 }}>الأقسام الرئيسية</h2>
          <span style={{ fontSize: "0.85rem", color: "var(--primary-color)", fontWeight: "700", cursor: "pointer" }}>عرض الكل</span>
        </div>
        
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", fontSize: "1.2rem", fontWeight: 700 }}>
            جاري تحميل الأقسام...
          </div>
        ) : filteredCategories.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
            لا توجد أقسام مطابقة للبحث.
          </div>
        ) : (
          <div className="categories-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
            {filteredCategories.map((cat) => {
              const isCustomImg = cat.image && (cat.image.startsWith("data:image") || cat.image.startsWith("http") || cat.image.startsWith("/uploads"));
              return (
                <Link href={`/category/${cat.id}`} key={cat.id}>
                  <div className="glass-card category-card" style={{ borderRadius: "16px" }}>
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
    </>
  );
}
