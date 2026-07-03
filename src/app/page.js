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

  // Settings state
  const [settings, setSettings] = useState({ site_name: "عرب تيك سيرفر", site_logo: "/logo.jpg" });

  // Backup static categories if backend is unreachable
  const staticCategories = [
    { id: 1,  name: "قسم الالعاب",       image: "/uploads/games-section.png",        color: "#6366f1", icon: "gamepad2"     },
    { id: 2,  name: "تطبيقات اللايف",    image: "/uploads/live-apps.png",            color: "#eab308", icon: "credit-card"  },
    { id: 3,  name: "بطاقات الكترونية",  image: "/uploads/electronic-cards.png",     color: "#6366f1", icon: "credit-card"  },
    { id: 4,  name: "الأرصدة والعملات",  image: "/uploads/balances-currencies.png",  color: "#eab308", icon: "credit-card"  },
    { id: 5,  name: "سوشال ميديا",       image: "/uploads/social-media.png",         color: "#eab308", icon: "credit-card"  },
    { id: 6,  name: "خدمات السيرفر",     image: "/uploads/server-services.png",      color: "#6366f1", icon: "gamepad2"     },
    { id: 7,  name: "اشتراكات",          image: "/uploads/subscriptions.png",        color: "#d946ef", icon: "credit-card"  },
    { id: 8,  name: "الذكاء الاصطناعي",  image: "/uploads/ai-section.png",           color: "#eab308", icon: "credit-card"  },
    { id: 9,  name: "قسم الارقام",       image: "/uploads/numbers-section.png",      color: "#6366f1", icon: "credit-card"  },
    { id: 10, name: "البرمجة والتصميم",  image: "/uploads/programming-design.png",   color: "#6366f1", icon: "gamepad2"     },
    { id: 11, name: "حسابات جاهزة",      image: "/uploads/ready-accounts.png",       color: "#eab308", icon: "credit-card"  },
    { id: 12, name: "إعلانات ممولة",     image: "/uploads/ads-section.png",          color: "#ec4899", icon: "share2"       },
    { id: 13, name: "خدمات APPLE",          image: null,                                color: "#a855f7", icon: "credit-card"  },
    { id: 14, name: "قسم خدمات سيرفر والأدوات", image: null,                                color: "#10b981", icon: "credit-card"  },
  ];


  const defaultSlides = [
    {
      title: "قسم خدمات سيرفر والأدوات",
      highlight: "Server & Tools",
      desc: "كافة خدمات السيرفر، تفعيل الأدوات، البوكسات الرقمية والدعم الفني بأفضل الأسعار المتاحة.",
      badge: "القسم الأساسي",
      color: "#10b981",
      icon: "🛠️",
      link: "/category/14"
    },
    {
      title: "أحدث خدمات وأكواد APPLE",
      highlight: "Apple Services",
      desc: "تفعيل اشتراكات آبل، بطاقات الهدايا، وخدمات الدعم المباشر وحلول الحسابات الرسمية.",
      badge: "مميز وحصري",
      color: "#a855f7",
      icon: "🍏",
      link: "/category/13"
    },
    {
      title: "صرف USDT بأفضل سعر",
      highlight: "Zoom USDT",
      desc: "كافة طرق الدفع متاحة | عمولة صفر | تنفيذ تلقائي فوري 100% وآمن تماماً.",
      badge: "عرض خاص",
      color: "#00b4d8",
      icon: "🪙",
      link: "/wallet"
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
        const sorted = [...data].sort((a, b) => {
          const idA = Number(a.id);
          const idB = Number(b.id);
          if (idA === 14) return -1;
          if (idB === 14) return 1;
          if (idA === 13) return -1;
          if (idB === 13) return 1;
          return 0;
        });
        setCategories(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Using fallback categories:", err.message);
        const sortedStatic = [...staticCategories].sort((a, b) => {
          const idA = Number(a.id);
          const idB = Number(b.id);
          if (idA === 14) return -1;
          if (idB === 14) return 1;
          if (idA === 13) return -1;
          if (idB === 13) return 1;
          return 0;
        });
        setCategories(sortedStatic);
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
          setSlides([...defaultSlides, ...data]);
        } else {
          setSlides(defaultSlides);
        }
      })
      .catch((err) => {
        console.warn("Using default static banners:", err);
        setSlides(defaultSlides);
      });

    // Fetch settings from backend
    fetch(`${API_BASE_URL}/api/settings`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setSettings(data);
        }
      })
      .catch((err) => console.error("Failed to fetch settings:", err));

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
    if (imageType.startsWith("data:") || imageType.startsWith("http") || imageType.includes("uploads") || imageType.startsWith("/")) {
      const cleanPath = imageType.startsWith("/") ? imageType : `/${imageType}`;
      const src = (imageType.startsWith("http") || imageType.startsWith("data:")) ? imageType : `${API_BASE_URL}${cleanPath}`;
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
        <div className="announcement-ticker-wrapper">
          {/* Copy 1 */}
          <div className="announcement-ticker-content">
            <a href="https://wa.me/16728972935" target="_blank" rel="noopener noreferrer" className="announcement-ticker-link">
              🟢 واتساب الإدارة 1: +1 (672) 897-2935
            </a>
            <a href="https://wa.me/201552672948" target="_blank" rel="noopener noreferrer" className="announcement-ticker-link">
              🟢 واتساب الإدارة 2: +20 15 52672948
            </a>
          </div>
          {/* Copy 2 (Seamless loop) */}
          <div className="announcement-ticker-content">
            <a href="https://wa.me/16728972935" target="_blank" rel="noopener noreferrer" className="announcement-ticker-link">
              🟢 واتساب الإدارة 1: +1 (672) 897-2935
            </a>
            <a href="https://wa.me/201552672948" target="_blank" rel="noopener noreferrer" className="announcement-ticker-link">
              🟢 واتساب الإدارة 2: +20 15 52672948
            </a>
          </div>
        </div>
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
              {slide.link && (
                <Link
                  href={slide.link}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "15px",
                    padding: "8px 20px",
                    borderRadius: "100px",
                    border: `1px solid ${slide.color}`,
                    background: `${slide.color}22`,
                    color: "#ffffff",
                    fontSize: "0.85rem",
                    fontWeight: "bold",
                    textDecoration: "none",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    alignSelf: "flex-start",
                    width: "fit-content",
                    boxShadow: `0 4px 15px ${slide.color}22`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = slide.color;
                    e.currentTarget.style.boxShadow = `0 0 15px ${slide.color}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `${slide.color}22`;
                    e.currentTarget.style.boxShadow = `0 4px 15px ${slide.color}22`;
                  }}
                >
                  <span>دخول القسم الآن</span>
                  <span>←</span>
                </Link>
              )}
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

      {/* Categories Grid - cc-card style */}
      <section>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
          <h2 className="section-title" style={{ margin: 0 }}>الأقسام الرئيسية</h2>
          <span style={{ fontSize: "0.85rem", color: "var(--primary-color)", fontWeight: "700", cursor: "pointer" }}>عرض الكل</span>
        </div>

        {loading ? (
          <div className="cc-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div className="cc-wrap" key={i}>
                <div className="cc-card cc-skeleton-card" style={{ "--cc-ac": "#6366f1", "--cc-gl": "#6366f173" }}>
                  <div className="cc-img-wrap" style={{ animation: "cc-skeleton-pulse 1.6s infinite linear" }} />
                  <div className="cc-name-area">
                    <div style={{ height: "12px", borderRadius: "6px", background: "rgba(255,255,255,0.08)", width: "70%", marginBottom: "4px" }} />
                    <div style={{ height: "10px", borderRadius: "6px", background: "rgba(255,255,255,0.05)", width: "40%" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCategories.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
            لا توجد أقسام مطابقة للبحث.
          </div>
        ) : (
          <div className="cc-grid">
            {/* Skeleton placeholders while API images load */}
            {filteredCategories.map((cat) => {
              const color = cat.color || "#6366f1";
              const glowColor = color + "73";
              const iconType = cat.icon || "credit-card";
              let imgSrc = null;
              if (cat.image) {
                if (cat.image.startsWith("http") || cat.image.startsWith("data:")) {
                  imgSrc = cat.image;
                } else {
                  const cleanPath = cat.image.startsWith("/") ? cat.image : `/${cat.image}`;
                  imgSrc = `${API_BASE_URL}${cleanPath}`;
                }
              }
              // Preload first 4 images for faster LCP
              const isPriority = cat.id <= 4;

              return (
                <div className="cc-wrap" key={cat.id}>
                  <Link
                    className="cc-card"
                    dir="rtl"
                    href={`/category/${cat.id}`}
                    style={{ "--cc-ac": color, "--cc-gl": glowColor }}
                  >
                    <div className="cc-img-wrap">
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={cat.name}
                          loading={isPriority ? "eager" : "lazy"}
                          fetchPriority={isPriority ? "high" : "auto"}
                          decoding="async"
                          className="cc-img"
                          style={{ opacity: 0, transition: "opacity 0.35s ease" }}
                          onLoad={e => { e.target.style.opacity = 1; }}
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="cc-img-placeholder">{cat.name.charAt(0)}</div>
                      )}
                    </div>
                    <div className="cc-tint"></div>
                    <div className="cc-overlay-bottom"></div>
                    <div className="cc-shimmer"></div>
                    <div className="cc-icon-badge">
                      {iconType === "gamepad2" && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="6" x2="10" y1="11" y2="11"></line>
                          <line x1="8" x2="8" y1="9" y2="13"></line>
                          <line x1="15" x2="15.01" y1="12" y2="12"></line>
                          <line x1="18" x2="18.01" y1="10" y2="10"></line>
                          <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"></path>
                        </svg>
                      )}
                      {iconType === "share2" && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="18" cy="5" r="3"></circle>
                          <circle cx="6" cy="12" r="3"></circle>
                          <circle cx="18" cy="19" r="3"></circle>
                          <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line>
                          <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line>
                        </svg>
                      )}
                      {(iconType === "credit-card" || (!["gamepad2","share2"].includes(iconType))) && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                          <line x1="2" x2="22" y1="10" y2="10"></line>
                        </svg>
                      )}
                    </div>
                    <div className="cc-name-area">
                      <span className="cc-name">{cat.name}</span>
                      <span className="cc-enter">
                        دخول
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m15 18-6-6 6-6"></path>
                        </svg>
                      </span>
                    </div>
                    <div className="cc-bottom-glow"></div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* FAQ Section */}
      <section className="faq-section" style={{ marginTop: "50px", marginBottom: "40px" }}>
        <h2 className="section-title" style={{ marginBottom: "25px" }}>الأسئلة الشائعة حول {settings.site_name}</h2>
        <div className="faq-container">
          <details className="faq-item">
            <summary className="faq-question">ما هو {settings.site_name}؟</summary>
            <p className="faq-answer">
              {settings.site_name} هو منصة متكاملة ومطورة (PWA) مخصصة لخدمات وبرامج السوفت وير بأسرع تنفيذ تلقائي وأفضل الأسعار.
            </p>
          </details>

          <details className="faq-item">
            <summary className="faq-question">كيف يمكنني شحن شدات ببجي أو جواهر فري فاير؟</summary>
            <p className="faq-answer">
              عملية الشحن سهلة للغاية: اختر اللعبة المفضلة لديك (like ببجي موبايل أو فري فاير)، حدد كمية الشدات أو الجواهر التي تريدها، أدخل معرّف اللاعب (Player ID) الخاص بك، ثم اختر وسيلة الدفع المناسبة. يتم تنفيذ الشحن تلقائياً فور تأكيد الدفع.
            </p>
          </details>

          <details className="faq-item">
            <summary className="faq-question">ما هي وسائل الدفع المدعومة في الموقع؟</summary>
            <p className="faq-answer">
              نوفر طرق دفع متعددة لتناسب الجميع، منها الدفع المباشر من خلال رصيد محفظتك الرقمية في الموقع، والتحويل اليدوي السريع عبر فودافون كاش مصر ومختلف المحافظ الإلكترونية، بالإضافة لشحن رصيد المحفظة باستخدام USDT لتسهيل الدفع للمشتركين خارج مصر.
            </p>
          </details>

          <details className="faq-item">
            <summary className="faq-question">هل شحن الألعاب من خلال {settings.site_name} آمن وحساباتي محمية؟</summary>
            <p className="faq-answer">
              نعم، {settings.site_name} يعتمد على قنوات شحن رسمية ومعتمدة 100% ومضمونة لحماية حسابات اللاعبين من الحظر أو المشاكل الأمنية. كافة تفاصيل المدفوعات والمعلومات الشخصية تخضع لأعلى معايير الحماية والأمان.
            </p>
          </details>

          <details className="faq-item">
            <summary className="faq-question">كيف يمكنني الحصول على أسعار الجملة؟</summary>
            <p className="faq-answer">
              إذا كنت صاحب متجر أو ترغب في العمل كموزع لخدماتنا، يمكنك التواصل مباشرة مع إدارة {settings.site_name} عبر الواتساب أو تيليجرام لترقية حسابك والحصول على تسعيرة الجملة والخصومات الخاصة.
            </p>
          </details>
        </div>
      </section>
    </>
  );
}
