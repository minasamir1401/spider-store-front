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
    1: "قسم الالعاب",
    2: "تطبيقات اللايف",
    3: "بطاقات الكترونية",
    4: "الأرصدة والعملات",
    5: "سوشال ميديا",
    6: "خدمات السيرفر",
    7: "اشتراكات",
    8: "الذكاء الاصطناعي",
    9: "قسم الارقام",
    10: "البرمجة والتصميم",
    11: "حسابات جاهزة",
    12: "إعلانات ممولة"
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
  const [theme, setTheme] = useState("dark");

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  useEffect(() => {
    // Theme sync
    if (typeof window !== "undefined") {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
      setTheme(currentTheme);
    }

    const token = localStorage.getItem("customer_token");
    const userStr = localStorage.getItem("customer_user");
    if (token && userStr) {
      setIsCustomerLoggedIn(true);
      setCustomerUser(JSON.parse(userStr));
    }
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
    <>
      {/* Page Title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", gap: "12px", flexWrap: "wrap" }}>
        <h2 className="section-title" style={{ margin: 0 }}>قسم {categoryName}</h2>
        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "600" }}>
          {services.length} خدمة متوفرة
        </span>
      </div>

      {/* Services Grid (Subcategories scc-grid) */}
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
        <div className="scc-grid">
          {services.map((service) => {
            const isCustomImg = service.image && (service.image.startsWith("data:image") || service.image.startsWith("http") || service.image.startsWith("/uploads"));
            
            // Premium colors per category
            const categoryColors = {
              1: '#6366f1', // games
              2: '#eab308', // live apps
              3: '#a855f7', // cards
              4: '#06b6d4', // balances/currencies
              5: '#ec4899', // social media
              6: '#10b981', // server services
              7: '#d946ef', // subscriptions
              8: '#eab308', // AI
              9: '#6366f1', // numbers
              10: '#6366f1', // programming/design
              11: '#eab308', // ready accounts
              12: '#ec4899'  // ads
            };
            const catColor = categoryColors[service.category_id] || '#6366f1';
            
            const hexToRgb = (hex) => {
              const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
              return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '99, 102, 241';
            };
            const catGlow = `rgba(${hexToRgb(catColor)}, 0.35)`;

            const imgSrc = isCustomImg
              ? (service.image.startsWith("/uploads") ? `${API_BASE_URL}${service.image}` : service.image)
              : null;

            return (
              <div className="scc-wrap" key={service.id}>
                <Link 
                  href={`/service/${service.id}`} 
                  className="scc-card" 
                  dir="rtl" 
                  style={{ '--scc-ac': catColor, '--scc-gl': catGlow }}
                >
                  <div className="scc-side-line"></div>
                  <div className="scc-img-ring">
                    <div className="scc-img-inner">
                      {imgSrc ? (
                        <img src={imgSrc} alt={service.name} loading="lazy" className="scc-img" />
                      ) : (
                        <span style={{ fontSize: "1.2rem" }}>⚡</span>
                      )}
                    </div>
                  </div>
                  <div className="scc-content">
                    <span className="scc-name">{service.name}</span>
                    <div className="scc-meta">
                      <div className="scc-dot"></div>
                      <span>اضغط للعرض</span>
                    </div>
                  </div>
                  <div className="scc-arrow">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left">
                      <path d="m15 18-6-6 6-6"></path>
                    </svg>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
