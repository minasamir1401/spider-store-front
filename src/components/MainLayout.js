"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { API_BASE_URL } from "@/config";

export default function MainLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [theme, setTheme] = useState("dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const [settings, setSettings] = useState({ site_name: "عرب تك سيرفر", site_logo: "/logo.jpg" });
  const [logoFailed, setLogoFailed] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/settings?t=${Date.now()}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setSettings(data);
          setLogoFailed(false);
        }
      })
      .catch(err => console.error("Failed to fetch settings", err));
  }, []);
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
  const [customerUser, setCustomerUser] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [selectedBalanceCurrency, setSelectedBalanceCurrency] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [fontScale, setFontScale] = useState(1);

  useEffect(() => {
    setIsMounted(true);

    // Theme
    const savedTheme = document.documentElement.getAttribute("data-theme") || localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);

    // Auth
    setIsCustomerLoggedIn(Boolean(localStorage.getItem("customer_token") && localStorage.getItem("customer_user")));
    try {
      const userStr = localStorage.getItem("customer_user");
      setCustomerUser(userStr ? JSON.parse(userStr) : null);
    } catch { }

    // PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || window.navigator.standalone
      || document.referrer.includes('android-app://');
    const isDismissed = localStorage.getItem("pwa_dismissed") === "true";
    setShowInstallBanner(!isStandalone && !isDismissed);

    // Captcha
    setIsUnlocked(sessionStorage.getItem("captcha_unlocked") === "true");

    // Font Scale
    const savedScale = localStorage.getItem("font_scale");
    const scaleVal = savedScale ? parseFloat(savedScale) : 1;
    setFontScale(Number.isFinite(scaleVal) ? scaleVal : 1);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', fontScale);
  }, [fontScale]);

  const adjustFontScale = (delta) => {
    let nextScale = parseFloat((fontScale + delta).toFixed(2));
    if (nextScale < 0.75) nextScale = 0.75;
    if (nextScale > 1.35) nextScale = 1.35;
    setFontScale(nextScale);
    document.documentElement.style.setProperty('--font-scale', nextScale);
    localStorage.setItem("font_scale", nextScale);
  };

  const resetFontScale = () => {
    setFontScale(1);
    document.documentElement.style.setProperty('--font-scale', 1);
    localStorage.setItem("font_scale", 1);
  };

  const handleCustomerLogout = () => {
    localStorage.removeItem("customer_token");
    localStorage.removeItem("customer_user");
    setIsCustomerLoggedIn(false);
    setCustomerUser(null);
    router.push("/login");
  };

  // Fetch customer profile
  const fetchProfile = () => {
    const token = localStorage.getItem("customer_token");
    const userStr = localStorage.getItem("customer_user");

    if (token && userStr) {
      fetch(`${API_BASE_URL}/api/customer/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((res) => {
          if (res.status === 401 || res.status === 403 || res.status === 404) {
            handleCustomerLogout();
            return null;
          }
          return res.ok ? res.json() : null;
        })
        .then((profile) => {
          if (profile) {
            setCustomerUser(profile);
            localStorage.setItem("customer_user", JSON.stringify(profile));
          }
        })
        .catch(() => { });
    }
  };

  // Sync profile on mount and on route changes
  useEffect(() => {
    fetchProfile();
  }, [pathname]);

  // Sync theme and setup PWA prompt
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if already running in standalone PWA mode
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
        || window.navigator.standalone
        || document.referrer.includes('android-app://');

      const isDismissed = localStorage.getItem("pwa_dismissed") === "true";

    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

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

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [menuOpen]);

  const renderBalanceDropdownAndValue = (user) => {
    if (!user) return null;
    const baseCurr = "USD";
    const userBalances = user.balances ? (typeof user.balances === 'string' ? JSON.parse(user.balances) : user.balances) : {};

    const availableCurrencies = settings.supported_currencies && settings.supported_currencies.length > 0
      ? settings.supported_currencies
      : [baseCurr];

    const activeCurrency = (selectedBalanceCurrency && availableCurrencies.includes(selectedBalanceCurrency))
      ? selectedBalanceCurrency
      : baseCurr;

    let balanceVal = 0;
    if (activeCurrency === baseCurr) {
      balanceVal = Number(user.balance || 0);
    } else {
      const rate = Number(settings.exchange_rates?.[activeCurrency] || (activeCurrency === "EGP" ? 50 : 600));
      const hasSpecificBalance = userBalances[activeCurrency] !== undefined && Number(userBalances[activeCurrency]) > 0;
      if (hasSpecificBalance) {
        balanceVal = Number(userBalances[activeCurrency]);
      } else if (rate > 0) {
        // Multiply USD balance by foreign rate to get target currency amount
        balanceVal = Number(user.balance || 0) * rate;
      } else {
        balanceVal = 0;
      }
    }

    return (
      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginTop: "4px" }} onClick={(e) => e.stopPropagation()}>
        <span>الرصيد:</span>
        <span style={{ fontWeight: 900, color: "var(--primary-color)" }}>
          {(activeCurrency === "USD" || activeCurrency === "USDT") ? `${balanceVal.toFixed(2)} ${activeCurrency}` : `${balanceVal.toFixed(2)}`}
        </span>
        <select
          value={activeCurrency}
          onChange={(e) => setSelectedBalanceCurrency(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "6px",
            color: "var(--primary-color)",
            fontWeight: "bold",
            padding: "2px 4px",
            fontSize: "0.78rem",
            outline: "none",
            cursor: "pointer"
          }}
        >
          {availableCurrencies.map(curr => (
            <option key={curr} value={curr} style={{ background: "var(--bg-main)", color: "#ffffff" }}>
              {curr} {curr === "USD" ? "🇺🇸" : curr === "EGP" ? "🇪🇬" : "🇸🇩"}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`PWA Installation choice: ${outcome}`);
      } catch (err) {
        console.warn("PWA prompt error:", err);
      }
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    } else {
      alert("لتثبيت التطبيق على جهازك:\n\n- للأندرويد: اضغط على القائمة المكونة من 3 نقاط (︙) في متصفح كروم ثم اختر 'تثبيت التطبيق' (Install app).\n\n- للأيفون: اضغط على زر مشاركة (📤) في متصفح Safari ثم اختر 'إضافة إلى الشاشة الرئيسية' (Add to Home Screen).");
    }
  };

  const navLinks = [
    { href: "/", label: "الرئيسية", icon: "🏠" },
    { href: "/services", label: "الخدمات", icon: "🛒" },
    { href: "/orders", label: "طلباتي", icon: "📦" },
    { href: "/wallet", label: "المحفظة", icon: "💳" }
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const getPageTitle = () => {
    if (pathname === "/" || pathname === "/Home") return "الرئيسية";
    if (pathname.startsWith("/orders")) return "طلباتي";
    if (pathname.startsWith("/wallet")) return "المحفظة";
    if (pathname.startsWith("/membership")) return "العضوية";
    if (pathname.startsWith("/category")) return "القسم";
    if (pathname.startsWith("/service")) return "الخدمة";
    if (pathname.startsWith("/login")) return "تسجيل الدخول";
    return "Home";
  };



  if (pathname && pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <div className="app-layout">
      {/* Background (Video removed for performance) */}
      <div className="video-background-container" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -3,
        overflow: 'hidden',
        background: 'var(--bg-color)'
      }}>
      </div>

      {/* Abstract Animated Shapes — 4 colorful orbs */}
      <div className="animated-shape shape-1"></div>
      <div className="animated-shape shape-2"></div>
      <div className="animated-shape shape-3"></div>
      <div className="animated-shape shape-4"></div>

      {isMounted && !isUnlocked && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(10, 15, 30, 0.96)",
          backdropFilter: "blur(16px)",
          zIndex: 999999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }}>
          <SliderCaptcha onSuccess={() => {
            setTimeout(() => {
              sessionStorage.setItem("captcha_unlocked", "true");
              setIsUnlocked(true);
            }, 800);
          }} />
        </div>
      )}

      {/* Desktop Sidebar (RTL Right Side) */}
      <aside className="app-sidebar">
        <div className="sidebar-logo-section" style={{ display: "flex", alignItems: "center", gap: "12px", paddingBottom: "20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          {settings.site_logo && settings.site_logo !== "default" && !logoFailed ? (
            <img
              src={settings.site_logo.startsWith("http") || settings.site_logo.startsWith("/") || settings.site_logo.startsWith("data:") ? settings.site_logo : `${API_BASE_URL}${settings.site_logo}`}
              alt={settings.site_name}
              onError={() => setLogoFailed(true)}
              style={{ width: "44px", height: "44px", borderRadius: "12px", objectFit: "cover" }}
            />
          ) : (
            <div className="logo-circle" style={{ width: "44px", height: "44px", borderRadius: "12px" }}>
              {settings.site_name ? settings.site_name.charAt(0) : "S"}
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: 900, fontSize: "1.15rem", color: "var(--text-main)" }}>{settings.site_name}</span>
            <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", letterSpacing: "0.5px" }}>DIGITAL SERVICES</span>
          </div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px", flexGrow: 1 }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`sidebar-nav-item ${isActive(link.href) ? "active" : ""}`}
            >
              <span className="sidebar-nav-icon">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}

          <button
            type="button"
            onClick={() => setSupportModalOpen(true)}
            className="sidebar-nav-item"
            style={{ width: "100%", background: "none", border: "none", textAlign: "right", cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            <span className="sidebar-nav-icon">💬</span>
            <span>الدعم الفني</span>
          </button>
        </nav>

        <div className="sidebar-footer" style={{ display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "15px" }}>


          {/* Theme Toggle in Sidebar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "var(--bg-glass-hover)", borderRadius: "12px", border: "var(--border-glass)", margin: "4px 0" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-main)", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "1.1rem" }}>{theme === "dark" ? "🌙" : "☀️"}</span>
              <span>المظهر الليلي</span>
            </span>
            <button
              onClick={toggleTheme}
              style={{
                background: theme === "dark" ? "var(--primary-color)" : "rgba(0, 0, 0, 0.15)",
                border: "none",
                borderRadius: "100px",
                width: "48px",
                height: "26px",
                display: "flex",
                alignItems: "center",
                padding: "3px",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
                position: "relative",
                outline: "none"
              }}
              type="button"
              aria-label="تبديل المظهر"
            >
              <div style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "#ffffff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: theme === "dark" ? "translateX(-22px)" : "translateX(0)"
              }} />
            </button>
          </div>

          {/* User profile / Logout / Login */}
          {isCustomerLoggedIn && customerUser ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ padding: "12px", borderRadius: "12px", background: "var(--bg-glass-hover)", border: "var(--border-glass)", fontSize: "0.85rem" }}>
                <div style={{ fontWeight: 800 }}>👤 {customerUser.username}</div>
                <div style={{ color: "var(--primary-color)", fontWeight: 800, marginTop: "4px" }}>
                  {renderBalanceDropdownAndValue(customerUser)}
                </div>
              </div>
              <button
                onClick={handleCustomerLogout}
                className="glass-btn"
                style={{ width: "100%", padding: "10px", borderRadius: "12px", color: "var(--danger-color)", fontWeight: "bold" }}
                type="button"
              >
                🚪 تسجيل الخروج
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="glass-btn glass-btn-primary"
              style={{ width: "100%", padding: "12px", borderRadius: "12px", textAlign: "center", display: "block", textDecoration: "none" }}
            >
              🔑 تسجيل الدخول
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {menuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMenuOpen(false)} />
      )}

      {/* Mobile Drawer Menu */}
      <div className={`mobile-drawer ${menuOpen ? "open" : "closed"}`}>
        <div className="mobile-drawer-header">
          <span className="mobile-drawer-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {settings.site_logo && settings.site_logo !== "default" && !logoFailed ? (
              <img
                src={settings.site_logo.startsWith("http") || settings.site_logo.startsWith("/") || settings.site_logo.startsWith("data:") ? settings.site_logo : `${API_BASE_URL}${settings.site_logo}`}
                alt={settings.site_name}
                onError={() => setLogoFailed(true)}
                style={{ width: "32px", height: "32px", borderRadius: "8px", objectFit: "cover" }}
              />
            ) : (
              <div className="logo-circle" style={{ width: "32px", height: "32px", fontSize: "1rem" }}>
                {settings.site_name ? settings.site_name.charAt(0) : "S"}
              </div>
            )}
            {settings.site_name}
          </span>
          <button className="mobile-drawer-close" onClick={() => setMenuOpen(false)}>✕</button>
        </div>

        {isCustomerLoggedIn && customerUser ? (
          <div className="mobile-drawer-user-card" style={{ marginBottom: "10px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "4px" }}>
            <div>مرحباً، {customerUser.username}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--primary-color)", fontWeight: "bold" }}>
              {renderBalanceDropdownAndValue(customerUser)}
            </div>
          </div>
        ) : (
          <Link href="/login" className="mobile-drawer-link" onClick={() => setMenuOpen(false)}>
            <span>👤</span>
            حسابي (تسجيل الدخول)
          </Link>
        )}

        <div className="mobile-drawer-divider" />

        <Link href="/" className="mobile-drawer-link" onClick={() => setMenuOpen(false)}>🏠 الرئيسية</Link>
        <Link href="/services" className="mobile-drawer-link" onClick={() => setMenuOpen(false)}>🛒 الخدمات المتاحة</Link>
        <Link href="/orders" className="mobile-drawer-link" onClick={() => setMenuOpen(false)}>📦 تتبع الطلبات</Link>
        {isCustomerLoggedIn && <Link href="/wallet" className="mobile-drawer-link" onClick={() => setMenuOpen(false)}>💳 شحن رصيدي</Link>}
        <button
          type="button"
          onClick={() => { setSupportModalOpen(true); setMenuOpen(false); }}
          className="mobile-drawer-link"
          style={{ width: "100%", textAlign: "right", border: "none", display: "flex", alignItems: "center" }}
        >
          💬 الدعم الفني
        </button>

        <div className="mobile-drawer-divider" />

        {/* Font Scale Toggle in Mobile Drawer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "var(--bg-glass-hover)", borderRadius: "12px", border: "var(--border-glass)", margin: "4px 0" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-main)", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "1.1rem" }}>📝</span>
            <span>حجم الخط</span>
          </span>
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <button
              onClick={() => adjustFontScale(-0.05)}
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-main)", width: "28px", height: "28px", borderRadius: "6px", cursor: "pointer", fontSize: "0.75rem", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center" }}
              title="تصغير الخط"
              type="button"
            >
              A-
            </button>
            <button
              onClick={resetFontScale}
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-main)", width: "28px", height: "28px", borderRadius: "6px", cursor: "pointer", fontSize: "0.75rem", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center" }}
              title="حجم افتراضي"
              type="button"
            >
              A
            </button>
            <button
              onClick={() => adjustFontScale(0.05)}
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-main)", width: "28px", height: "28px", borderRadius: "6px", cursor: "pointer", fontSize: "0.75rem", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center" }}
              title="تكبير الخط"
              type="button"
            >
              A+
            </button>
          </div>
        </div>

        {/* Theme Toggle in Mobile Drawer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "var(--bg-glass-hover)", borderRadius: "12px", border: "var(--border-glass)", margin: "4px 0" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-main)", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "1.1rem" }}>{theme === "dark" ? "🌙" : "☀️"}</span>
            <span>المظهر الليلي</span>
          </span>
          <button
            onClick={toggleTheme}
            style={{
              background: theme === "dark" ? "var(--primary-color)" : "rgba(0, 0, 0, 0.15)",
              border: "none",
              borderRadius: "100px",
              width: "48px",
              height: "26px",
              display: "flex",
              alignItems: "center",
              padding: "3px",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
              position: "relative",
              outline: "none"
            }}
            type="button"
            aria-label="تبديل المظهر"
          >
            <div style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              background: "#ffffff",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: theme === "dark" ? "translateX(-22px)" : "translateX(0)"
            }} />
          </button>
        </div>

        {isCustomerLoggedIn && (
          <>
            <div className="mobile-drawer-divider" />
            <button className="mobile-drawer-link danger" onClick={() => { handleCustomerLogout(); setMenuOpen(false); }}>
              تسجيل الخروج 🚪
            </button>
          </>
        )}
      </div>

      {/* Main Content Area (LHS on Desktop) */}
      <div className="main-content">
        {/* PWA Install Banner */}
        {showInstallBanner && (
          <div className="pwa-install-banner">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.5rem" }}>📱</span>
              <div>
                <strong style={{ display: "block", fontSize: "0.9rem", color: "var(--text-main)", textAlign: "right" }}>ثبّت تطبيق {settings.site_name}</strong>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "block", textAlign: "right" }}>تصفح أسرع وتجربة استخدام أفضل بدون متصفح!</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button
                onClick={handleInstallClick}
                className="glass-btn glass-btn-primary"
                style={{ padding: "6px 14px", borderRadius: "8px", fontSize: "0.82rem" }}
              >
                تثبيت الآن
              </button>
              <button
                onClick={() => {
                  setShowInstallBanner(false);
                  localStorage.setItem("pwa_dismissed", "true");
                }}
                style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "0 5px", fontSize: "1.1rem" }}
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Top Navbar (Reference style matching tsmart-one.online) */}
        <header className="custom-navbar">
          <div className="custom-navbar-glow"></div>

          {/* Left Section: Burger Button (mobile) / Back Button (mobile subpages) + Logo (mobile) / Page Title (desktop) */}
          <div className="flex items-center gap-3">
            {/* Drawer menu button (shown on mobile, hidden on desktop) */}
            <button
              className="header-btn lg-hidden w-9 h-9"
              onClick={() => setMenuOpen(!menuOpen)}
              type="button"
              aria-label="القائمة"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu w-5 h-5">
                <line x1="4" x2="20" y1="12" y2="12"></line>
                <line x1="4" x2="20" y1="6" y2="6"></line>
                <line x1="4" x2="20" y1="18" y2="18"></line>
              </svg>
            </button>

            {/* Back Button (mobile subpages) */}
            {pathname !== "/" && (
              <button
                className="header-btn lg-hidden w-9 h-9"
                onClick={() => router.back()}
                title="رجوع"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right w-5 h-5">
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
              </button>
            )}

            {/* Logo Link (shown on mobile, hidden on desktop) */}
            <Link className="lg-hidden flex items-center gap-2" href="/" style={{ textDecoration: "none", minWidth: 0, flex: 1 }}>
              {settings.site_logo && settings.site_logo !== "default" && !logoFailed ? (
                <img
                  src={settings.site_logo.startsWith("http") || settings.site_logo.startsWith("/") || settings.site_logo.startsWith("data:") ? settings.site_logo : `${API_BASE_URL}${settings.site_logo}`}
                  alt={settings.site_name}
                  onError={() => setLogoFailed(true)}
                  style={{ width: "28px", height: "28px", borderRadius: "6px", objectFit: "cover", flexShrink: 0 }}
                />
              ) : (
                <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-sm" style={{ background: "linear-gradient(135deg, rgb(79, 70, 229) 0%, rgb(99, 102, 241) 100%)", color: "#ffffff", boxShadow: "rgba(79, 70, 229, 0.3) 0px 2px 10px", flexShrink: 0 }}>
                  {settings.site_name ? settings.site_name.charAt(0) : "S"}
                </div>
              )}
              <span className="font-black" style={{ color: "var(--text-main)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: "clamp(0.7rem, 2.5vw, 0.875rem)" }}>{settings.site_name}</span>
            </Link>

            {/* Page Title (shown on desktop, hidden on mobile) */}
            <h2 className="lg-block font-black uppercase tracking-wider text-xs" style={{ color: "var(--text-muted)", margin: 0 }}>
              {getPageTitle()}
            </h2>
          </div>

          {/* Right Section: Theme Toggle + Language Switcher + Notifications + Profile Initials/Login */}
          <div className="flex items-center gap-1" style={{ position: "relative" }}>
            {/* Contact WhatsApp Link */}
            <a
              href={`https://wa.me/${settings.whatsapp_numbers && settings.whatsapp_numbers.length > 0 ? settings.whatsapp_numbers[0] : "16728972935"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="header-btn"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "0 10px",
                borderRadius: "8px",
                background: "rgba(34, 197, 94, 0.1)",
                border: "1px solid rgba(34, 197, 94, 0.2)",
                color: "#22c55e",
                textDecoration: "none",
                height: "36px",
                fontSize: "0.82rem",
                fontWeight: "bold",
                transition: "all 0.3s ease",
                whiteSpace: "nowrap"
              }}
            >
              <span className="flex items-center justify-center" style={{ fontSize: "1.1rem" }}>🟢</span>
              <span className="nav-mobile-hidden" style={{ direction: "ltr" }}>
                {settings.whatsapp_numbers && settings.whatsapp_numbers.length > 0
                  ? `+${settings.whatsapp_numbers[0]}`
                  : "+1 (672) 897-2935"}
              </span>
            </a>





            {/* User Profile Menu Trigger — desktop only, mobile uses drawer */}
            <div className="lg-block">
              {isCustomerLoggedIn && customerUser ? (
                <button
                  className="header-user-btn"
                  type="button"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  title="الملف الشخصي"
                >
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs" style={{ background: "rgba(79, 70, 229, 0.1)", color: "rgb(79, 70, 229)" }}>
                    {customerUser.username ? customerUser.username.charAt(0).toLowerCase() : "u"}
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down w-3 h-3" style={{ color: "rgb(88, 88, 96)" }}><path d="m6 9 6 6 6-6"></path></svg>
                </button>
              ) : (
                <button
                  className="header-user-btn"
                  type="button"
                  onClick={() => router.push("/login")}
                  title="تسجيل الدخول"
                >
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs" style={{ background: "rgba(79, 70, 229, 0.1)", color: "rgb(79, 70, 229)" }}>
                    🔑
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down w-3 h-3" style={{ color: "rgb(88, 88, 96)" }}><path d="m6 9 6 6 6-6"></path></svg>
                </button>
              )}
            </div>

            {/* Profile Dropdown Menu */}
            {isCustomerLoggedIn && customerUser && profileMenuOpen && (
              <div className="header-profile-dropdown">
                <div style={{ padding: "4px 8px", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: "4px" }}>
                  <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--text-main)" }}>👤 {customerUser.username}</div>
                  <div style={{ color: "var(--primary-color)", fontWeight: 800, fontSize: "0.82rem", marginTop: "2px" }}>
                    {renderBalanceDropdownAndValue(customerUser)}
                  </div>
                </div>
                <Link href="/orders" className="header-dropdown-item" onClick={() => setProfileMenuOpen(false)}>
                  📦 طلباتي
                </Link>
                <Link href="/wallet" className="header-dropdown-item" onClick={() => setProfileMenuOpen(false)}>
                  💳 شحن المحفظة
                </Link>
                <button
                  onClick={() => { handleCustomerLogout(); setProfileMenuOpen(false); }}
                  className="header-dropdown-item"
                  style={{ color: "var(--danger-color)" }}
                  type="button"
                >
                  🚪 تسجيل الخروج
                </button>
              </div>
            )}
          </div>


        </header>

        {/* Child Pages Content */}
        <main className="main-content-inner">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="bottom-nav">
        <Link href="/" className={`bottom-nav-item ${pathname === "/" ? "active" : ""}`}>
          <span className="bottom-nav-icon">🏠</span>
          <span className="bottom-nav-label">الرئيسية</span>
        </Link>
        <Link href="/orders" className={`bottom-nav-item ${pathname.startsWith("/orders") ? "active" : ""}`}>
          <span className="bottom-nav-icon">📦</span>
          <span className="bottom-nav-label">طلباتي</span>
        </Link>
        <Link href="/wallet" className={`bottom-nav-item ${pathname.startsWith("/wallet") ? "active" : ""}`}>
          <span className="bottom-nav-icon">💳</span>
          <span className="bottom-nav-label">محفظتي</span>
        </Link>
        <Link href="/login" className={`bottom-nav-item ${pathname.startsWith("/login") ? "active" : ""}`}>
          <span className="bottom-nav-icon">👤</span>
          <span className="bottom-nav-label">حسابي</span>
        </Link>
      </nav>

      {/* Support Channels Modal */}
      {supportModalOpen && (
        <div
          onClick={() => setSupportModalOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(4, 6, 14, 0.8)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            animation: "fadeIn 0.2s ease"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "rgba(17, 22, 45, 0.95)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "24px",
              padding: "25px",
              maxWidth: "480px",
              width: "100%",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4)",
              direction: "rtl"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 900, color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>💬</span> الدعم الفني وتواصل الإدارة
              </h3>
              <button
                onClick={() => setSupportModalOpen(false)}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "none",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  color: "#cbd5e1",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.9rem"
                }}
              >
                ✕
              </button>
            </div>

            <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: 0, marginBottom: "20px", lineHeight: "1.5" }}>
              اختر أحد قنوات الدعم الفني الرسمية للتواصل معنا أو الانضمام إلى مجتمعنا:
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {/* WhatsApp Support 1 */}
              <a
                href="https://wa.me/16728972935"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: "rgba(34, 211, 238, 0.1)",
                  border: "1px solid rgba(34, 211, 238, 0.15)",
                  borderRadius: "14px",
                  color: "#22d3ee",
                  textDecoration: "none",
                  fontWeight: "bold",
                  fontSize: "0.92rem",
                  transition: "transform 0.2s"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "1.2rem" }}>🟢</span>
                  <span>واتساب الإدارة 1 (+1 672-897-2935)</span>
                </div>
                <span style={{ color: "#22d3ee" }}>←</span>
              </a>

              {/* WhatsApp Support 2 */}
              <a
                href="https://wa.me/249123667227"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.15)",
                  borderRadius: "14px",
                  color: "#10b981",
                  textDecoration: "none",
                  fontWeight: "bold",
                  fontSize: "0.92rem",
                  transition: "transform 0.2s"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "1.2rem" }}>🟢</span>
                  <span>واتساب الإدارة 2 (+249 12 366 7227)</span>
                </div>
                <span style={{ color: "#10b981" }}>←</span>
              </a>

              {/* WhatsApp Community */}
              <a
                href="https://chat.whatsapp.com/DINRDwU2lVjFcGRowxT3m5"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: "rgba(52, 211, 153, 0.08)",
                  border: "1px solid rgba(52, 211, 153, 0.15)",
                  borderRadius: "14px",
                  color: "#34d399",
                  textDecoration: "none",
                  fontWeight: "bold",
                  fontSize: "0.92rem",
                  transition: "transform 0.2s"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "1.2rem" }}>💬</span>
                  <span>مجتمع واتساب عرب تك</span>
                </div>
                <span style={{ color: "#34d399" }}>←</span>
              </a>

              {/* Facebook Page */}
              <a
                href="https://www.facebook.com/ARABTECHSERVEROnline"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: "rgba(24, 119, 242, 0.08)",
                  border: "1px solid rgba(24, 119, 242, 0.15)",
                  borderRadius: "14px",
                  color: "#478bfb",
                  textDecoration: "none",
                  fontWeight: "bold",
                  fontSize: "0.92rem",
                  transition: "transform 0.2s"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "1.2rem" }}>📘</span>
                  <span>صفحة فيسبوك عرب تك</span>
                </div>
                <span style={{ color: "#478bfb" }}>←</span>
              </a>

              {/* TikTok Account */}
              <a
                href="https://tiktok.com/@arabtechsuppurt"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: "rgba(254, 44, 85, 0.08)",
                  border: "1px solid rgba(254, 44, 85, 0.15)",
                  borderRadius: "14px",
                  color: "#fe2c55",
                  textDecoration: "none",
                  fontWeight: "bold",
                  fontSize: "0.92rem",
                  transition: "transform 0.2s"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "1.2rem" }}>🎵</span>
                  <span>حساب تيك توك عرب تك</span>
                </div>
                <span style={{ color: "#fe2c55" }}>←</span>
              </a>

              {/* Email Support */}
              <a
                href="mailto:arab.tech.services1@gmail.com"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.15)",
                  borderRadius: "14px",
                  color: "#ef4444",
                  textDecoration: "none",
                  fontWeight: "bold",
                  fontSize: "0.92rem",
                  transition: "transform 0.2s"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "1.2rem" }}>✉️</span>
                  <span>البريد الإلكتروني (arab.tech.services1@gmail.com)</span>
                </div>
                <span style={{ color: "#ef4444" }}>←</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const SliderCaptcha = ({ onSuccess }) => {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const trackRef = useRef(null);
  const [maxDrag, setMaxDrag] = useState(240); // default fallback

  useEffect(() => {
    if (trackRef.current) {
      // Handle width is 50px
      setMaxDrag(trackRef.current.clientWidth - 50);
    }
  }, []);

  const handleStart = (e) => {
    if (isSuccess) return;
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMove = (e) => {
      if (!isDragging || isSuccess) return;
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      let x = clientX - rect.left - 25; // 25 is half of handle width
      if (x < 0) x = 0;
      if (x > maxDrag) x = maxDrag;
      setDragX(x);

      if (x >= maxDrag - 5) {
        setIsSuccess(true);
        setIsDragging(false);
        onSuccess();
      }
    };

    const handleEnd = () => {
      if (!isDragging) return;
      setIsDragging(false);
      if (!isSuccess) {
        // Reset position with animation
        setDragX(0);
      }
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchmove", handleMove);
      window.addEventListener("touchend", handleEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, isSuccess, maxDrag, onSuccess]);

  return (
    <div style={{
      background: "rgba(255, 255, 255, 0.03)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      borderRadius: "24px",
      padding: "30px 24px",
      width: "100%",
      maxWidth: "360px",
      textAlign: "center",
      boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
      backdropFilter: "blur(20px)"
    }}>
      <div style={{ fontSize: "2.5rem", marginBottom: "15px" }}>🔒</div>
      <h3 style={{ fontWeight: 800, color: "#fff", marginBottom: "8px", fontSize: "1.2rem" }}>تحقق الأمان</h3>
      <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "25px", lineHeight: "1.5" }}>
        اسحب للتأكيد أنك إنسان لست روبوت
      </p>

      {/* Slider Track */}
      <div
        ref={trackRef}
        style={{
          position: "relative",
          height: "50px",
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "25px",
          overflow: "hidden",
          userSelect: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {/* Background text */}
        <span style={{
          fontSize: "0.85rem",
          color: "#64748b",
          pointerEvents: "none",
          zIndex: 1,
          opacity: isSuccess ? 0 : 1,
          transition: "opacity 0.2s"
        }}>
          اسحب للتأكيد →
        </span>

        {/* Dynamic filled background */}
        <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: `${dragX + 25}px`,
          background: isSuccess
            ? "linear-gradient(90deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.4) 100%)"
            : "linear-gradient(90deg, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.3) 100%)",
          transition: isDragging ? "none" : "width 0.3s ease",
          zIndex: 0
        }} />

        {/* Handle */}
        <div
          onMouseDown={handleStart}
          onTouchStart={handleStart}
          style={{
            position: "absolute",
            left: `${dragX}px`,
            width: "50px",
            height: "48px",
            background: isSuccess ? "#22c55e" : "#4f46e5",
            borderRadius: "50%",
            cursor: isSuccess ? "default" : "grab",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: isSuccess
              ? "0 0 15px rgba(34, 197, 94, 0.6)"
              : "0 0 15px rgba(79, 70, 229, 0.6)",
            transition: isDragging ? "none" : "left 0.3s ease, background-color 0.3s",
            zIndex: 2,
            color: "#fff",
            fontSize: "1.1rem",
            fontWeight: "bold"
          }}
        >
          {isSuccess ? "✓" : "→"}
        </div>
      </div>
    </div>
  );
};
