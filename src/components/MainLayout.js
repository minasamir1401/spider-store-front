"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { API_BASE_URL } from "@/config";

export default function MainLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [theme, setTheme] = useState("dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const [settings, setSettings] = useState({ site_name: "متجر سبايدر", site_logo: "default" });
  
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/settings`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setSettings(data);
        }
      })
      .catch(err => console.error("Failed to fetch settings", err));
  }, []);
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
  const [customerUser, setCustomerUser] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  // Fetch customer profile
  const fetchProfile = () => {
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
    } else {
      setIsCustomerLoggedIn(false);
      setCustomerUser(null);
    }
  };

  // Sync profile on mount and on route changes
  useEffect(() => {
    fetchProfile();
  }, [pathname]);

  // Sync theme and setup PWA prompt
  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
      setTheme(currentTheme);

      // Check if already running in standalone PWA mode
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
        || window.navigator.standalone 
        || document.referrer.includes('android-app://');
      
      const isDismissed = localStorage.getItem("pwa_dismissed") === "true";
      
      if (!isStandalone && !isDismissed) {
        setShowInstallBanner(true);
      }
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

  const handleCustomerLogout = () => {
    localStorage.removeItem("customer_token");
    localStorage.removeItem("customer_user");
    setIsCustomerLoggedIn(false);
    setCustomerUser(null);
    router.push("/login");
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`PWA Installation choice: ${outcome}`);
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
    if (pathname.startsWith("/category")) return "القسم";
    if (pathname.startsWith("/service")) return "الخدمة";
    if (pathname.startsWith("/login")) return "تسجيل الدخول";
    return "Home";
  };

  const triggerNotificationToast = (e) => {
    e.preventDefault();
    setShowNotificationToast(true);
    setTimeout(() => {
      setShowNotificationToast(false);
    }, 3000);
  };

  if (pathname && pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <div className="app-layout">
      {/* Desktop Sidebar (RTL Right Side) */}
      <aside className="app-sidebar">
        <div className="sidebar-logo-section" style={{ display: "flex", alignItems: "center", gap: "12px", paddingBottom: "20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          {settings.site_logo && settings.site_logo !== "default" ? (
            <img 
              src={settings.site_logo.startsWith("http") || settings.site_logo.startsWith("/") || settings.site_logo.startsWith("data:") ? settings.site_logo : `${API_BASE_URL}${settings.site_logo}`} 
              alt={settings.site_name} 
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
          
          <a 
            href="https://wa.me/message/7J7PQMKIB2G7O1" 
            target="_blank" 
            rel="noopener noreferrer"
            className="sidebar-nav-item"
          >
            <span className="sidebar-nav-icon">💬</span>
            <span>الدعم الفني</span>
          </a>
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
                  الرصيد: {Number(customerUser.balance || 0).toFixed(2)} ج.م
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
            {settings.site_logo && settings.site_logo !== "default" ? (
              <img 
                src={settings.site_logo.startsWith("http") || settings.site_logo.startsWith("/") || settings.site_logo.startsWith("data:") ? settings.site_logo : `${API_BASE_URL}${settings.site_logo}`} 
                alt={settings.site_name} 
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
            <div style={{ fontSize: "0.8rem", color: "var(--primary-color)", fontWeight: "bold" }}>الرصيد: {Number(customerUser.balance || 0).toFixed(2)} ج.م</div>
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
        
        <div className="mobile-drawer-divider" />

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
              {settings.site_logo && settings.site_logo !== "default" ? (
                <img 
                  src={settings.site_logo.startsWith("http") || settings.site_logo.startsWith("/") || settings.site_logo.startsWith("data:") ? settings.site_logo : `${API_BASE_URL}${settings.site_logo}`} 
                  alt={settings.site_name} 
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
            {/* Theme Toggle */}
            <button 
              className="header-btn w-9 h-9" 
              onClick={toggleTheme}
              title={theme === "dark" ? "الوضع الفاتح" : "الوضع الداكن"}
              type="button"
            >
              {theme === "dark" ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun w-4 h-4" style={{ color: "rgb(79, 70, 229)" }}>
                  <circle cx="12" cy="12" r="4"></circle>
                  <path d="M12 2v2"></path>
                  <path d="M12 20v2"></path>
                  <path d="M4.93 4.93l1.41 1.41"></path>
                  <path d="M17.66 17.66l1.41 1.41"></path>
                  <path d="M2 12h2"></path>
                  <path d="M20 12h2"></path>
                  <path d="M6.34 17.66l-1.41 1.41"></path>
                  <path d="M17.66 6.34l-1.41 1.41"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-moon w-4 h-4" style={{ color: "rgb(79, 70, 229)" }}>
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                </svg>
              )}
            </button>



            {/* Notifications Bell */}
            <a className="relative" href="#" onClick={triggerNotificationToast}>
              <button className="header-btn w-9 h-9" title="الإشعارات" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell w-4 h-4">
                  <path d="M10.268 21a2 2 0 0 0 3.464 0"></path>
                  <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"></path>
                </svg>
              </button>
            </a>

            {/* User Profile Menu Trigger */}
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

            {/* Profile Dropdown Menu */}
            {isCustomerLoggedIn && customerUser && profileMenuOpen && (
              <div className="header-profile-dropdown">
                <div style={{ padding: "4px 8px", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: "4px" }}>
                  <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--text-main)" }}>👤 {customerUser.username}</div>
                  <div style={{ color: "var(--primary-color)", fontWeight: 800, fontSize: "0.82rem", marginTop: "2px" }}>
                    الرصيد: {Number(customerUser.balance || 0).toFixed(2)} ج.م
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
          
          {/* Notification Toast */}
          {showNotificationToast && (
            <div className="notification-toast">
              🔔 لا توجد إشعارات جديدة حالياً
            </div>
          )}
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
    </div>
  );
}
