"use client";

import React, { useState, useEffect, use, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/config";

export default function ServiceDetail({ params }) {
  const unwrappedParams = use(params);
  const serviceId = unwrappedParams.id;
  const router = useRouter();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [customQuantity, setCustomQuantity] = useState(1000);
  const [copied, setCopied] = useState(false);
  const [customerPricingMode, setCustomerPricingMode] = useState("packages");
  const [packageSearchTerm, setPackageSearchTerm] = useState("");
  const [exchangeRates, setExchangeRates] = useState({ "USD": 50, "USDT": 51 });
  
  // Form state - dynamic fields
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [senderPhone, setSenderPhone] = useState("");
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [receiptImage, setReceiptImage] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [baseCurrency, setBaseCurrency] = useState("ج.م");
  const [hideManualTransfersSetting, setHideManualTransfersSetting] = useState(false);
  const transferNumber = "01026785879";

  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
  const [customerUser, setCustomerUser] = useState(null);
  const [theme, setTheme] = useState("dark");

  /* eslint-disable react-hooks/set-state-in-effect */
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
    } else {
      router.push(`/login?redirectTo=/service/${serviceId}`);
    }
  }, [serviceId, router]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/settings?t=${Date.now()}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          const hideManual = !!data.hide_wallet_payment;
          setHideManualTransfersSetting(hideManual);
          if (data.payment_methods) {
            setPaymentMethods(data.payment_methods);
            const token = localStorage.getItem("customer_token");
            if (hideManual || token) {
              setPaymentMethod("wallet");
            } else if (data.payment_methods.length > 0) {
              setPaymentMethod(data.payment_methods[0].id);
            }
          }
          if (data.base_currency) {
            setBaseCurrency(data.base_currency);
          }
          if (data.exchange_rates) {
            setExchangeRates(data.exchange_rates);
          }
        }
      })
      .catch(err => console.error("Error fetching settings:", err));
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

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

  // Backup static services if backend is unreachable
  const staticServices = [
    {
      id: 1,
      name: "ببجي موبايل (PUBG Mobile)",
      description: "اشحن شدات ببجي موبايل فوراً ومباشرة في حسابك عن طريق الآيدي ID بأفضل الأسعار.",
      price: 0.99,
      image: "pubg",
      packages: [
        { id: 1, name: "60 شدة (UC)", price: 0.99 },
        { id: 2, name: "325 شدة (UC)", price: 4.85 },
        { id: 3, name: "660 شدة (UC)", price: 9.50 },
        { id: 4, name: "1800 شدة (UC)", price: 23.99 }
      ]
    },
    {
      id: 2,
      name: "فري فاير (Free Fire)",
      description: "اشحن جواهر فري فاير فوراً لتفعيل الفاير باس والحصول على أحدث سكنات اللعبة عبر الآيدي.",
      price: 1.10,
      image: "freefire",
      packages: [
        { id: 1, name: "110 جواهر", price: 1.10 },
        { id: 2, name: "231 جواهر", price: 2.20 },
        { id: 3, name: "583 جواهر", price: 5.30 },
        { id: 4, name: "1188 جواهر", price: 10.50 }
      ]
    },
    {
      id: 3,
      name: "بيجو لايف (Bigo Live)",
      description: "اشحن فاصوليا ومجوهرات تطبيق بيجو لايف لدعم البث المباشر المفضل لديك.",
      price: 1.25,
      image: "bigo",
      packages: [
        { id: 1, name: "42 جوهرة", price: 1.25 },
        { id: 2, name: "297 جوهرة", price: 7.99 },
        { id: 3, name: "848 جوهرة", price: 22.50 }
      ]
    },
    {
      id: 4,
      name: "فودافون كاش مصر (Vodafone Cash)",
      description: "شحن رصيد وتحويل أموال عبر محفظة فودافون كاش مباشرة بسعر الصرف الممتاز.",
      price: 1.00,
      image: "vodafone",
      packages: [
        { id: 1, name: "إرسال 100 جنيه مصري", price: 2.10 },
        { id: 2, name: "إرسال 500 جنيه مصري", price: 10.50 },
        { id: 3, name: "إرسال 1000 جنيه مصري", price: 21.00 }
      ]
    },
    {
      id: 5,
      name: "شحن رصيد USDT (TRC20)",
      description: "شراء وسحب عملة USDT الرقمية بأفضل أسعار الصرف وبسرعة تنفيذ خيالية.",
      price: 1.00,
      image: "usdt",
      packages: [
        { id: 1, name: "10 USDT", price: 10.30 },
        { id: 2, name: "50 USDT", price: 51.50 },
        { id: 3, name: "100 USDT", price: 102.50 }
      ]
    },
    {
      id: 6,
      name: "اشتراك كانفا برو (Canva Pro)",
      description: "تفعيل اشتراك كانفا برو الحساب الشخصي بكافة ميزات التصميم والذكاء الاصطناعي.",
      price: 1.99,
      image: "canva",
      packages: [
        { id: 1, name: "تفعيل لمدة شهر", price: 1.99 },
        { id: 2, name: "تفعيل لمدة 6 أشهر", price: 8.99 },
        { id: 3, name: "تفعيل لمدة سنة كاملة", price: 14.99 }
      ]
    },
    {
      id: 7,
      name: "اشتراك نتفليكس (Netflix Premium)",
      description: "شاشة خاصة بك بجودة 4K UHD على حساب نتفليكس مشترك أو حساب مستقل بالكامل.",
      price: 2.50,
      image: "netflix",
      packages: [
        { id: 1, name: "شاشة واحدة لمدة شهر 4K", price: 2.50 },
        { id: 2, name: "حساب كامل مستقل لمدة شهر", price: 9.99 }
      ]
    }
  ];

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/services/${serviceId}`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setService(data);
        if (data.packages && data.packages.length > 0) {
          setSelectedPackage(data.packages[0]);
        }
        if (data.price_type === "dynamic") {
          setCustomerPricingMode("dynamic");
        } else {
          setCustomerPricingMode("packages");
        }
        setLoading(false);
      })
      .catch(() => {
        const fallback = staticServices.find(s => s.id === Number(serviceId));
        if (fallback) {
          setService(fallback);
          if (fallback.packages && fallback.packages.length > 0) {
            setSelectedPackage(fallback.packages[0]);
          }
          if (fallback.price_type === "dynamic") {
            setCustomerPricingMode("dynamic");
          } else {
            setCustomerPricingMode("packages");
          }
        }
        setLoading(false);
      });
  }, [serviceId]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Parse dynamic fields from service
  const serviceFields = useMemo(() => {
    if (!service) return [];
    if (Array.isArray(service.fields)) return service.fields;
    if (typeof service.fields === 'string') {
      try { return JSON.parse(service.fields); } catch { return []; }
    }
    return [];
  }, [service]);

  // Fallback fields if none configured
  const defaultFields = [
    { name: "player_id", label: "معرّف اللاعب / حساب الشحن (Player ID / Email)", type: "text", placeholder: "أدخل معرّف الحساب بدقة هنا (مثال: 512495910)", required: true },
    { name: "phone", label: "رقم الهاتف للتواصل وتأكيد الشحن (واتساب)", type: "tel", placeholder: "مثال: 01023456789 أو +96651234567", required: true }
  ];

  const activeFields = serviceFields.length > 0 ? serviceFields : defaultFields;

  const handleFieldChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleReceiptChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("حجم الصورة كبير جداً. الحد الأقصى المسموح به هو 10 ميجابايت.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const isDynamic = service.price_type === "dynamic" || (service.price_type === "both" && customerPricingMode === "dynamic");

    if (!isDynamic && !selectedPackage) {
      setErrorMessage("من فضلك حدد باقة الشحن المطلوبة.");
      return;
    }

    if (isDynamic && (!customQuantity || customQuantity < 100)) {
      setErrorMessage("من فضلك أدخل كمية صالحة (الحد الأدنى 100).");
      return;
    }

    if (paymentMethod === "wallet" && !isCustomerLoggedIn) {
      setErrorMessage("يجب تسجيل الدخول لاستخدام المحفظة في الدفع.");
      return;
    }

    if (paymentMethod !== "wallet" && !senderPhone.trim()) {
      setErrorMessage("يرجى إدخال الرقم أو اسم الحساب الذي تم التحويل منه.");
      return;
    }

    if (paymentMethod !== "wallet" && !receiptImage) {
      setErrorMessage("يرجى رفع صورة إيصال التحويل (لقطة شاشة).");
      return;
    }

    if (paymentMethod !== "wallet" && !transferAmount.trim()) {
      setErrorMessage("يرجى تحديد المبلغ الذي قمت بتحويله.");
      return;
    }

    // Validate required fields
    for (const field of activeFields) {
      if (field.required !== false && (!formData[field.name] || !formData[field.name].toString().trim())) {
        setErrorMessage(`حقل "${field.label}" مطلوب.`);
        return;
      }
    }

    setSubmitting(true);

    let computedPrice = 0;
    if (isDynamic) {
      const usdPrice = (customQuantity / 1000) * (service.price_per_thousand || 0);
      if (service.category_currency === 'USD') {
        const usdRate = Number(exchangeRates?.["USD"] || 50);
        computedPrice = Number((usdPrice * usdRate).toFixed(2));
      } else {
        computedPrice = Number(usdPrice.toFixed(2));
      }
    } else {
      if (service.category_currency === 'USD') {
        const usdPrice = selectedPackage.usd_price || selectedPackage.price;
        const usdRate = Number(exchangeRates?.["USD"] || 50);
        computedPrice = Number((usdPrice * usdRate).toFixed(2));
      } else {
        computedPrice = selectedPackage.price;
      }
    }
    const computedPackageName = isDynamic
      ? `كمية: ${customQuantity}`
      : selectedPackage.name;

    try {
      const headers = {
        "Content-Type": "application/json"
      };

      const token = localStorage.getItem("customer_token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          service_id: service.id,
          player_id: formData.player_id || formData[activeFields[0]?.name] || "",
          phone: formData.phone || "",
          package_name: computedPackageName,
          package_price: computedPrice,
          payment_method: paymentMethod === "wallet" ? "wallet" : "transfer",
          sender_phone: senderPhone,
          transfer_to: paymentMethod === "wallet" ? "" : (paymentMethods.find(pm => pm.id === paymentMethod)?.value || ""),
          custom_fields: formData,
          quantity: isDynamic ? customQuantity : 1,
          receipt_image: receiptImage,
          transfer_amount: paymentMethod === "wallet" ? 0 : parseFloat(transferAmount)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "فشل إرسال الطلب، الرجاء المحاولة مجدداً.");
      }

      if (typeof data.customer_balance === "number") {
        try {
          const currentUserStr = localStorage.getItem("customer_user");
          if (currentUserStr) {
            const currentUser = JSON.parse(currentUserStr);
            const updatedUser = { ...currentUser, balance: data.customer_balance };
            localStorage.setItem("customer_user", JSON.stringify(updatedUser));
            setCustomerUser(updatedUser);
          }
        } catch {
          // Ignore local storage sync issues; balance already updated on the server.
        }
      }

      setSuccessData(data);
    } catch (err) {
      setErrorMessage(err.message || "حدث خطأ غير متوقع، يرجى المحاولة لاحقاً.");
    } finally {
      setSubmitting(false);
    }
  };

  const getFallbackEmoji = (name = "", image = "") => {
    const lowerName = (name || "").toLowerCase();
    const lowerImg = (image || "").toLowerCase();
    
    if (lowerImg.includes("pubg") || lowerName.includes("pubg") || lowerName.includes("ببجي")) return "🔫";
    if (lowerImg.includes("freefire") || lowerImg.includes("free fire") || lowerName.includes("فري فاير") || lowerName.includes("free fire") || lowerName.includes("freefire")) return "🔥";
    if (lowerImg.includes("bigo") || lowerName.includes("بيجو")) return "💬";
    if (lowerImg.includes("vodafone") || lowerName.includes("فودافون")) return "📱";
    if (lowerImg.includes("usdt") || lowerName.includes("usdt") || lowerName.includes("عملة") || lowerName.includes("أرصدة")) return "🪙";
    if (lowerImg.includes("canva") || lowerName.includes("كانفا")) return "🎨";
    if (lowerImg.includes("netflix") || lowerName.includes("نتفليكس")) return "🎬";
    if (lowerName.includes("ايفون") || lowerName.includes("iphone") || lowerName.includes("ipad") || lowerName.includes("ايباد") || lowerName.includes("bypass") || lowerName.includes("تخط") || lowerName.includes("icloud") || lowerName.includes("ايكلاود") || lowerName.includes("hello") || lowerName.includes("removal") || lowerName.includes("hfz") || lowerName.includes("smd") || lowerName.includes("otix")) return "📱";
    
    return "⚡";
  };

  const getServiceIcon = (image, name = "") => {
    if (!image) return getFallbackEmoji(name, image);
    if (image.startsWith("data:image") || image.startsWith("http") || image.includes("uploads")) {
      const src = image.startsWith("http") || image.startsWith("data:") 
        ? image 
        : (image.startsWith("/") ? `${API_BASE_URL}${image}` : `${API_BASE_URL}/${image}`);
      return <img 
        src={src} 
        alt="Service Icon" 
        onError={(e) => {
          e.target.style.display = 'none';
          const parent = e.target.parentElement;
          if (parent) {
            parent.innerText = getFallbackEmoji(name, image);
          }
        }}
        style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "inherit" }} 
      />;
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

  const [drawerOpen, setDrawerOpen] = useState(false);

  const filteredPackages = useMemo(() => {
    if (!service?.packages) return [];
    if (!packageSearchTerm.trim()) return service.packages;
    return service.packages.filter(pkg => 
      pkg.name.toLowerCase().includes(packageSearchTerm.toLowerCase())
    );
  }, [service?.packages, packageSearchTerm]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px" }}>
        <h2 style={{ fontWeight: 800 }}>جاري تحميل تفاصيل الخدمة...</h2>
      </div>
    );
  }

  if (!service) {
    return (
      <div style={{ textAlign: "center", padding: "80px" }}>
        <h2 style={{ fontWeight: 800, color: "var(--danger-color)" }}>الخدمة المطلوبة غير متوفرة!</h2>
        <Link href="/" className="glass-btn glass-btn-primary" style={{ marginTop: "20px" }}>العودة للرئيسية</Link>
      </div>
    );
  }

  const packagesSection = (
    <div>
      <h3 style={{ fontWeight: 800, marginBottom: "10px" }}>1. اختر الباقة المطلوبة:</h3>
      
      {service.packages && service.packages.length > 3 && (
        <div style={{ marginBottom: "15px", position: "relative" }}>
          <input
            type="text"
            placeholder="البحث عن باقة..."
            value={packageSearchTerm}
            onChange={(e) => setPackageSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 40px 12px 15px",
              fontSize: "0.95rem",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              background: "rgba(255, 255, 255, 0.05)",
              color: "var(--text-main)",
              outline: "none",
              transition: "border-color 0.2s"
            }}
          />
          <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", opacity: 0.6, fontSize: "1rem" }}>🔍</span>
          {packageSearchTerm && (
            <button
              onClick={() => setPackageSearchTerm("")}
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                fontSize: "1.1rem"
              }}
            >
              ✕
            </button>
          )}
        </div>
      )}

      {filteredPackages && filteredPackages.length > 0 ? (
        <div className="packages-selector">
          {filteredPackages.map((pkg, idx) => {
            const simulatedDiscount = 2 + (idx % 4);
            const isUsd = service.category_currency === 'USD';
            const usdPrice = pkg.usd_price || pkg.price;
            const originalUsdPrice = usdPrice / (1 - simulatedDiscount / 100);
            
            const usdRate = Number(exchangeRates?.["USD"] || 50);
            const egpPrice = usdPrice * usdRate;
            const originalEgpPrice = originalUsdPrice * usdRate;

            const isSelected = selectedPackage?.id === pkg.id && (service.price_type !== "both" || customerPricingMode === "packages");
            return (
              <div
                key={pkg.id}
                className={`package-option ${isSelected ? "selected" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (service.price_type === "both") {
                    setCustomerPricingMode("packages");
                  }
                  setSelectedPackage(pkg);
                  
                  // Scroll to form smoothly
                  setTimeout(() => {
                    const formEl = document.getElementById("payment-form-section");
                    if (formEl) {
                      formEl.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }, 50);
                }}
                style={{ position: "relative", overflow: "hidden", padding: "24px 14px 16px 14px", cursor: "pointer" }}
              >
                {/* Discount Tag */}
                <span style={{
                  position: "absolute",
                  top: "6px",
                  left: "6px",
                  background: "var(--danger-color)",
                  color: "white",
                  fontSize: "0.68rem",
                  padding: "2px 6px",
                  borderRadius: "6px",
                  fontWeight: "800"
                }}>
                  -{simulatedDiscount}%
                </span>
 
                <span className="package-name" style={{ display: "block", marginBottom: "6px" }}>{pkg.name}</span>
 
                <div style={{ display: "flex", flexDirection: "column", gap: "2px", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: "6px", justifyContent: "center", alignItems: "baseline" }}>
                    <span className="package-price" style={{ fontSize: "1.1rem" }}>
                      {isUsd 
                        ? `$ ${usdPrice.toFixed(2)}` 
                        : `${Number(pkg.price).toFixed(2)} ${baseCurrency}`}
                    </span>
                    <span style={{ textDecoration: "line-through", color: "var(--text-muted)", fontSize: "0.75rem" }}>
                      {isUsd ? '$' : ''}{isUsd ? originalUsdPrice.toFixed(2) : Number(pkg.price / (1 - simulatedDiscount / 100)).toFixed(2)}{isUsd ? '' : ` ${baseCurrency}`}
                    </span>
                  </div>
                  {isUsd && (
                    <span style={{ fontSize: "0.78rem", color: "var(--primary-color)", fontWeight: "bold" }}>
                      ما يعادل {egpPrice.toFixed(2)} {baseCurrency}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)" }}>لا تتوفر باقات مطابقة للبحث.</div>
      )}
    </div>
  );

  const customQuantitySection = (
    <div>
      <h3 style={{ fontWeight: 800, marginBottom: "10px" }}>1. أدخل الكمية المطلوبة:</h3>
      <p style={{ fontSize: "0.85rem", color: "var(--accent-color)", marginBottom: "12px", fontWeight: "bold" }}>
        سعر الـ 1000 وحدة هو: {service.category_currency === 'USD'
          ? `$ ${Number(service.price_per_thousand || 0).toFixed(2)} (ما يعادل ${Number((service.price_per_thousand || 0) * (exchangeRates?.["USD"] || 50)).toFixed(2)} ${baseCurrency})`
          : `${Number(service.price_per_thousand || 0).toFixed(2)} ${baseCurrency}`} (أقل كمية: 100)
      </p>
      <div className="form-group" style={{ marginBottom: "20px" }}>
        <input
          type="number"
          min="100"
          step="100"
          value={customQuantity}
          onFocus={() => {
            if (service.price_type === "both") {
              setCustomerPricingMode("dynamic");
            }
          }}
          onChange={(e) => {
            if (service.price_type === "both") {
              setCustomerPricingMode("dynamic");
            }
            const val = e.target.value === "" ? "" : parseInt(e.target.value);
            setCustomQuantity(val);
          }}
          onBlur={() => {
            if (!customQuantity || customQuantity < 100) {
              setCustomQuantity(100);
            }
          }}
          style={{
            padding: "16px 20px",
            fontSize: "1.2rem",
            fontWeight: "bold",
            borderRadius: "14px",
            border: (service.price_type !== "both" || customerPricingMode === "dynamic") ? "2px solid #3b82f6" : "1px solid rgba(255, 255, 255, 0.08)",
            background: "#ffffff",
            color: "#000000",
            width: "100%",
            boxSizing: "border-box",
            outline: "none"
          }}
          placeholder="أدخل الكمية هنا (مثال: 5000)"
        />
        <div style={{ marginTop: "8px", fontSize: "0.88rem", color: "var(--text-muted)" }}>
          السعر الإجمالي للكمية: <strong style={{ color: "#34d399", fontSize: "1.05rem" }}>
            {(() => {
              const usdPrice = ((Number(customQuantity) || 0) / 1000) * (service.price_per_thousand || 0);
              if (service.category_currency === 'USD') {
                const egpPrice = usdPrice * Number(exchangeRates?.["USD"] || 50);
                return `$ ${usdPrice.toFixed(2)} (ما يعادل ${egpPrice.toFixed(2)} ${baseCurrency})`;
              } else {
                return `${usdPrice.toFixed(2)} ${baseCurrency}`;
              }
            })()}
          </strong>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        .spinner-loader {
          width: 18px;
          height: 18px;
          border: 3.5px solid rgba(255, 255, 255, 0.35);
          border-radius: 50%;
          border-top-color: #ffffff;
          animation: spin-loader 0.8s linear infinite;
          display: inline-block;
        }
        @keyframes spin-loader {
          to { transform: rotate(360deg); }
        }
        
        .success-ring-pulse {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(34, 197, 94, 0.12);
          box-shadow: 0 0 20px rgba(34, 197, 94, 0.25);
          animation: pulse-ring 2s infinite;
          margin-bottom: 20px;
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.5); }
          70% { transform: scale(1); box-shadow: 0 0 0 15px rgba(34, 197, 94, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
      `}</style>
      {/* Main layout */}
      <div className="service-details-layout">
        {/* Form and Packages Selector */}
        <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {isCustomerLoggedIn && customerUser && (
            <div style={{ 
              background: "rgba(59, 130, 246, 0.08)", 
              border: "1px solid rgba(59, 130, 246, 0.2)", 
              padding: "12px 18px", 
              borderRadius: "14px", 
              display: "flex", 
              alignItems: "center", 
              gap: "10px",
              fontSize: "0.9rem",
              color: "#38bdf8",
              flexWrap: "wrap"
            }}>
              <span style={{ fontSize: "1.1rem" }}>👤</span>
              <span>أنت تقوم بالشراء بحساب: <strong>{customerUser.username}</strong></span>
              {typeof customerUser.balance === "number" && (
                <span style={{ marginInlineStart: "auto", background: "rgba(34, 197, 94, 0.15)", color: "#4ade80", padding: "4px 10px", borderRadius: "8px", fontWeight: "bold", fontSize: "0.82rem" }}>
                  رصيد محفظتك: {customerUser.balance.toFixed(2)} {baseCurrency}
                </span>
              )}
            </div>
          )}

          {/* Header of service */}
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <div className="service-icon" style={{ width: "80px", height: "80px", borderRadius: "24px", fontSize: "2.4rem" }}>
              {getServiceIcon(service.image, service.name)}
            </div>
            <div>
              <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-main)" }}>{service.name}</h1>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>شحن فوري ومضمون 100%</p>
            </div>
          </div>

          <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: "1.7" }}>{service.description}</p>

          <hr style={{ opacity: 0.1 }} />

          {/* Package Select / Custom Quantity */}
          <div>
            {service.price_type === "both" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                
                {/* Option 1: Packages */}
                <div 
                  onClick={() => setCustomerPricingMode("packages")}
                  style={{ 
                    border: customerPricingMode === "packages" ? "2px solid #3b82f6" : "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "16px",
                    padding: "20px 16px 16px 16px",
                    background: customerPricingMode === "packages" ? "rgba(59, 130, 246, 0.05)" : "rgba(255,255,255,0.01)",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                    <input 
                      type="radio" 
                      name="pricing_mode_selector" 
                      checked={customerPricingMode === "packages"} 
                      onChange={() => setCustomerPricingMode("packages")} 
                      style={{ width: "18px", height: "18px", cursor: "pointer" }}
                    />
                    <strong style={{ fontSize: "1.05rem", color: customerPricingMode === "packages" ? "#3b82f6" : "var(--text-main)" }}>
                      📦 الخيار الأول: اختر باقة شحن جاهزة
                    </strong>
                  </div>
                  
                  <div style={{ 
                    opacity: customerPricingMode === "packages" ? 1 : 0.6, 
                    pointerEvents: customerPricingMode === "packages" ? "auto" : "none",
                    transition: "opacity 0.2s"
                  }}>
                    {packagesSection}
                  </div>
                </div>

                {/* Option 2: Custom Quantity */}
                <div 
                  onClick={() => setCustomerPricingMode("dynamic")}
                  style={{ 
                    border: customerPricingMode === "dynamic" ? "2px solid #3b82f6" : "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "16px",
                    padding: "20px 16px 16px 16px",
                    background: customerPricingMode === "dynamic" ? "rgba(59, 130, 246, 0.05)" : "rgba(255,255,255,0.01)",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                    <input 
                      type="radio" 
                      name="pricing_mode_selector" 
                      checked={customerPricingMode === "dynamic"} 
                      onChange={() => setCustomerPricingMode("dynamic")} 
                      style={{ width: "18px", height: "18px", cursor: "pointer" }}
                    />
                    <strong style={{ fontSize: "1.05rem", color: customerPricingMode === "dynamic" ? "#3b82f6" : "var(--text-main)" }}>
                      ⚡ الخيار الثاني: الشحن بالكمية المخصصة (حسب الطلب)
                    </strong>
                  </div>

                  <div style={{ 
                    opacity: customerPricingMode === "dynamic" ? 1 : 0.6, 
                    transition: "opacity 0.2s"
                  }}>
                    {customQuantitySection}
                  </div>
                </div>

              </div>
            ) : (
              service.price_type === "dynamic" ? customQuantitySection : packagesSection
            )}
          </div>

          <hr style={{ opacity: 0.1 }} />

          {/* Form fields - Dynamic */}
          <form onSubmit={handleSubmit}>
            <h3 id="payment-form-section" style={{ fontWeight: 800, marginBottom: "15px" }}>2. بيانات الحساب المراد شحنه:</h3>
            
            {activeFields.map((field, idx) => (
              <div className="form-group" key={field.name || idx}>
                <label htmlFor={`field_${field.name}`}>{field.label}:</label>
                {field.type === "select" && field.options ? (
                  <select
                    id={`field_${field.name}`}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    required={field.required !== false}
                    style={{
                      width: "100%",
                      padding: "14px 18px",
                      fontSize: "0.95rem",
                      borderRadius: "12px",
                      border: "2px solid #3b82f6",
                      background: "#ffffff",
                      color: "#000000",
                      outline: "none"
                    }}
                  >
                    <option value="" style={{ color: "#000000", background: "#ffffff" }}>-- اختر --</option>
                    {(typeof field.options === 'string' ? field.options.split(',') : field.options).map((opt, i) => (
                      <option key={i} value={opt.trim()} style={{ color: "#000000", background: "#ffffff" }}>{opt.trim()}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={`field_${field.name}`}
                    type={field.type || "text"}
                    placeholder={field.placeholder || ""}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    required={field.required !== false}
                    style={{
                      width: "100%",
                      padding: "14px 18px",
                      fontSize: "0.95rem",
                      borderRadius: "12px",
                      border: "2px solid #3b82f6",
                      background: "#ffffff",
                      color: "#000000",
                      outline: "none"
                    }}
                  />
                )}
              </div>
            ))}

            <div style={{ marginTop: "18px", padding: "16px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
                <h3 style={{ fontWeight: 800, margin: 0 }}>3. طريقة الدفع:</h3>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "bold" }}>
                  المبلغ: {(() => {
                    const isUsd = service.category_currency === 'USD';
                    let usdPrice = 0;
                    let egpPrice = 0;
                    const usdRate = Number(exchangeRates?.["USD"] || 50);

                    if (service.price_type === "dynamic" || (service.price_type === "both" && customerPricingMode === "dynamic")) {
                      const computedUsd = (customQuantity / 1000) * (service.price_per_thousand || 0);
                      if (isUsd) {
                        usdPrice = computedUsd;
                        egpPrice = usdPrice * usdRate;
                      } else {
                        egpPrice = computedUsd;
                      }
                    } else if (selectedPackage) {
                      if (isUsd) {
                        usdPrice = selectedPackage.usd_price || selectedPackage.price;
                        egpPrice = usdPrice * usdRate;
                      } else {
                        egpPrice = selectedPackage.price;
                      }
                    }

                    if (isUsd) {
                      return `$ ${usdPrice.toFixed(2)} (ما يعادل ${egpPrice.toFixed(2)} ${baseCurrency})`;
                    } else {
                      return `${egpPrice.toFixed(2)} ${baseCurrency}`;
                    }
                  })()}
                </span>
              </div>

              <div style={{ display: "grid", gap: "10px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: isCustomerLoggedIn ? "pointer" : "not-allowed", padding: "12px 14px", borderRadius: "12px", border: paymentMethod === "wallet" ? "1px solid rgba(34,197,94,0.45)" : "1px solid rgba(255,255,255,0.08)", background: paymentMethod === "wallet" ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.03)", opacity: isCustomerLoggedIn ? 1 : 0.65 }}>
                  <input type="radio" name="paymentMethod" value="wallet" checked={paymentMethod === "wallet"} onChange={() => setPaymentMethod("wallet")} disabled={!isCustomerLoggedIn} />
                  <span>
                    <strong>المحفظة الرقمية للموقع</strong>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      الخصم يتم تلقائيًا من رصيدك الحالي. {isCustomerLoggedIn ? `رصيدك الحالي: ${Number(customerUser?.balance || 0).toFixed(2)} ${baseCurrency}` : "يتطلب تسجيل الدخول."}
                    </div>
                  </span>
                </label>

                {!hideManualTransfersSetting && paymentMethods.map((pm) => {
                  const isSelected = paymentMethod === pm.id;
                  return (
                    <label key={pm.id} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", padding: "12px 14px", borderRadius: "12px", border: isSelected ? "1px solid rgba(59,130,246,0.45)" : "1px solid rgba(255,255,255,0.08)", background: isSelected ? "rgba(59, 130, 246, 0.08)" : "rgba(255,255,255,0.03)" }}>
                      <input type="radio" name="paymentMethod" value={pm.id} checked={isSelected} onChange={() => setPaymentMethod(pm.id)} />
                      <span>
                        <strong>تحويل يدوي: {pm.name}</strong>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                          {pm.description}
                        </div>
                      </span>
                    </label>
                  );
                })}
              </div>

              {paymentMethod !== "wallet" && (
                (() => {
                  const currentPM = paymentMethods.find(pm => pm.id === paymentMethod) || paymentMethods[0];
                  if (!currentPM) return null;
                  return (
                    <div className="form-group" style={{ marginTop: "14px" }}>
                      <label htmlFor="senderPhone">الرقم أو اسم الحساب الذي تم التحويل منه *إجباري*:</label>
                      <input
                        id="senderPhone"
                        type="text"
                        placeholder="مثال: 01023456789 أو اسم حسابك المحول منه"
                        value={senderPhone}
                        onChange={(e) => setSenderPhone(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "14px 18px",
                          fontSize: "0.95rem",
                          borderRadius: "12px",
                          border: "2px solid #3b82f6",
                          background: "#ffffff",
                          color: "#000000",
                          outline: "none"
                        }}
                        required
                      />

                      <div style={{ marginTop: "14px" }}>
                        <label htmlFor="transferAmount">المبلغ الذي قمت بتحويله فعلياً ({baseCurrency}) *إجباري*:</label>
                        <input
                          id="transferAmount"
                          type="number"
                          step="any"
                          placeholder="أدخل المبلغ المحول بالضبط (مثال: 150)"
                          value={transferAmount}
                          onChange={(e) => setTransferAmount(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "14px 18px",
                            fontSize: "0.95rem",
                            borderRadius: "12px",
                            border: "2px solid #3b82f6",
                            background: "#ffffff",
                            color: "#000000",
                            outline: "none"
                          }}
                          required
                        />
                      </div>
                      
                      <div style={{ marginTop: "14px" }}>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#cbd5e1" }}>ارفع صورة إيصال التحويل (لقطة شاشة) *إجباري*:</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleReceiptChange}
                          style={{
                            width: "100%",
                            padding: "10px",
                            fontSize: "0.9rem",
                            borderRadius: "10px",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            background: "rgba(255,255,255,0.02)",
                            color: "#ffffff"
                          }}
                        />
                        {receiptImage && (
                          <div style={{ marginTop: "10px", position: "relative", display: "inline-block" }}>
                            <img
                              src={receiptImage}
                              alt="Receipt Preview"
                              style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "10px", border: "2px solid #22c55e" }}
                            />
                            <button
                              type="button"
                              onClick={() => setReceiptImage("")}
                              style={{
                                position: "absolute",
                                top: "-8px",
                                right: "-8px",
                                background: "#ef4444",
                                color: "white",
                                border: "none",
                                borderRadius: "50%",
                                width: "20px",
                                height: "20px",
                                cursor: "pointer",
                                fontSize: "0.75rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "bold"
                              }}
                              title="حذف الصورة"
                            >
                              ×
                            </button>
                          </div>
                        )}
                      </div>
                      <div style={{ marginTop: "8px", padding: "10px 12px", borderRadius: "10px", background: "#f1f5f9", border: "1px solid #cbd5e1", color: "#334155", fontSize: "0.85rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>بيانات الاستلام للتحويل: <strong style={{ color: "#000000", direction: "ltr", display: "inline-block", fontSize: "1rem", userSelect: "all" }}>{currentPM.value}</strong></span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(currentPM.value);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                          style={{
                            background: copied ? "#10b981" : "#3b82f6",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "6px",
                            padding: "4px 8px",
                            fontSize: "0.75rem",
                            cursor: "pointer",
                            fontWeight: "bold",
                            transition: "all 0.2s"
                          }}
                        >
                          {copied ? "تم النسخ! ✓" : "نسخ 📋"}
                        </button>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>

            {errorMessage && (
              <div style={{ padding: "12px", background: "rgba(239, 68, 68, 0.1)", borderRight: "4px solid var(--danger-color)", color: "var(--danger-color)", borderRadius: "8px", fontWeight: "600", fontSize: "0.85rem", marginBottom: "15px" }}>
                ⚠️ {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="glass-btn glass-btn-primary"
              style={{ 
                width: "100%", 
                padding: "14px", 
                fontSize: "1.1rem", 
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                cursor: submitting ? "not-allowed" : "pointer",
                background: submitting ? "linear-gradient(90deg, #1e3a8a, #3b82f6)" : "",
                opacity: submitting ? 0.8 : 1,
                transition: "all 0.3s ease"
              }}
            >
              {submitting ? (
                <>
                  <span className="spinner-loader"></span>
                  <span>جاري معالجة طلبك وإرساله... يرجى الانتظار ⏳</span>
                </>
              ) : (
                "تأكيد وإرسال طلب الشحن"
              )}
            </button>
          </form>

        </div>

        {/* Sidebar Summary */}
        <div>
          <div className="glass-panel summary-box">
            <h3 style={{ fontWeight: 800, borderBottom: "2px solid rgba(0,0,0,0.05)", paddingBottom: "10px" }}>تفاصيل الطلب</h3>
            
            <div className="summary-row">
              <span className="summary-label">الخدمة</span>
              <span className="summary-value">{service.name}</span>
            </div>

            {(service.price_type === "dynamic" || (service.price_type === "both" && customerPricingMode === "dynamic")) ? (
              <>
                <div className="summary-row">
                  <span className="summary-label">الكمية المطلوبة</span>
                  <span className="summary-value">{customQuantity} وحدة</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">سعر الـ 1000 وحدة</span>
                  <span className="summary-value">{Number(service.price_per_thousand || 0).toFixed(2)} {baseCurrency}</span>
                </div>
              </>
            ) : (
              selectedPackage && (
                <>
                  <div className="summary-row">
                    <span className="summary-label">الباقة المختارة</span>
                    <span className="summary-value">{selectedPackage.name}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">سعر الباقة</span>
                    <span className="summary-value">
                      {service.category_currency === 'USD' 
                        ? `$ ${Number(selectedPackage.usd_price || selectedPackage.price).toFixed(2)}` 
                        : `${Number(selectedPackage.price).toFixed(2)} ${baseCurrency}`}
                    </span>
                  </div>
                </>
              )
            )}

            {activeFields.map((field, idx) => (
              <div className="summary-row" key={field.name || idx}>
                <span className="summary-label">{field.label}</span>
                <span className="summary-value" style={{ wordBreak: "break-all" }}>{formData[field.name] || "---"}</span>
              </div>
            ))}

            <hr style={{ opacity: 0.1 }} />

            <div className="summary-row" style={{ alignItems: "center" }}>
              <span className="summary-label" style={{ fontSize: "1.1rem", fontWeight: "bold" }}>الإجمالي المستحق</span>
              <span className="summary-value summary-total">
                {(() => {
                  const isUsd = service.category_currency === 'USD';
                  let usdPrice = 0;
                  let egpPrice = 0;
                  const usdRate = Number(exchangeRates?.["USD"] || 50);

                  if (service.price_type === "dynamic" || (service.price_type === "both" && customerPricingMode === "dynamic")) {
                    const computedUsd = (customQuantity / 1000) * (service.price_per_thousand || 0);
                    if (isUsd) {
                      usdPrice = computedUsd;
                      egpPrice = usdPrice * usdRate;
                    } else {
                      egpPrice = computedUsd;
                    }
                  } else if (selectedPackage) {
                    if (isUsd) {
                      usdPrice = selectedPackage.usd_price || selectedPackage.price;
                      egpPrice = usdPrice * usdRate;
                    } else {
                      egpPrice = selectedPackage.price;
                    }
                  }

                  if (isUsd) {
                    return `$ ${usdPrice.toFixed(2)} (${egpPrice.toFixed(2)} ${baseCurrency})`;
                  } else {
                    return `${egpPrice.toFixed(2)} ${baseCurrency}`;
                  }
                })()}
              </span>
            </div>

            <div style={{ marginTop: "10px", fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: "1.5", background: "rgba(255,255,255,0.4)", padding: "10px", borderRadius: "8px" }}>
              📢 بمجرد إتمام الطلب، سيتم مراجعة الدفع وتحويل الشحنة لحسابك في غضون 5 إلى 15 دقيقة فقط كحد أقصى.
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {successData && (
        <div className="overlay" style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, padding: "20px", backdropFilter: "blur(8px)" }}>
          <div className="modal-content" style={{ 
            textAlign: "center", 
            padding: "30px clamp(12px, 5vw, 24px)", 
            width: "95%", 
            maxWidth: "650px", 
            borderRadius: "30px", 
            maxHeight: "90vh", 
            overflowY: "auto",
            background: "rgba(15, 23, 42, 0.95)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5), 0 0 40px rgba(59, 130, 246, 0.15)",
            backdropFilter: "blur(16px)"
          }}>
            <div className="success-ring-pulse">
              <span style={{ fontSize: "3rem", color: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>✓</span>
            </div>
            
            <h2 style={{ fontWeight: 800, fontSize: "1.8rem", color: "#ffffff", marginBottom: "10px" }}>تم استلام طلبك بنجاح!</h2>
            <p style={{ margin: "0 auto 30px auto", maxWidth: "480px", lineHeight: "1.6", color: "#94a3b8", fontSize: "0.95rem" }}>
              شكراً لثقتك بـ <strong style={{ color: "#38bdf8" }}>Spider Store</strong>. تم استلام وتسجيل طلب الشحن الخاص بك وهو الآن قيد التنفيذ التلقائي الفوري.
            </p>
            
            <div style={{ 
              background: "linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.8))", 
              border: "1px solid rgba(255,255,255,0.06)", 
              padding: "24px", 
              borderRadius: "20px", 
              textAlign: "right",
              marginBottom: "24px",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "12px", marginBottom: "16px" }}>
                <span style={{ fontSize: "1.2rem" }}>📄</span>
                <strong style={{ color: "#e2e8f0", fontSize: "1.05rem" }}>تفاصيل فاتورة الشحن</strong>
              </div>
              
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", 
                gap: "14px 20px" 
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: "8px" }}>
                  <span style={{ color: "#94a3b8" }}>رقم الطلب:</span>
                  <strong style={{ color: "#38bdf8" }}>#{successData.id}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: "8px" }}>
                  <span style={{ color: "#94a3b8" }}>الخدمة:</span>
                  <strong style={{ color: "#f1f5f9" }}>{successData.service_name}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: "8px" }}>
                  <span style={{ color: "#94a3b8" }}>الباقة / الكمية:</span>
                  <strong style={{ color: "#f1f5f9" }}>{successData.package_name}</strong>
                </div>
                 <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: "8px" }}>
                  <span style={{ color: "#94a3b8" }}>القيمة المستحقة:</span>
                  <strong style={{ color: "#4ade80", fontSize: "1.05rem" }}>
                    {service.category_currency === 'USD' 
                      ? `$ ${Number((successData.package_price) / (Number(exchangeRates?.["USD"] || 50))).toFixed(2)}` 
                      : `${Number(successData.package_price).toFixed(2)} ${baseCurrency}`}
                  </strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: "8px", gridColumn: "1 / -1" }}>
                  <span style={{ color: "#94a3b8" }}>حساب الشحن (Player ID):</span>
                  <strong style={{ color: "#22d3ee", direction: "ltr", display: "inline-block", letterSpacing: "0.5px" }}>{successData.player_id}</strong>
                </div>
                {successData.sender_phone && (
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: "8px", gridColumn: "1 / -1" }}>
                    <span style={{ color: "#94a3b8" }}>الرقم المحول منه:</span>
                    <strong style={{ color: "#e2e8f0", direction: "ltr" }}>{successData.sender_phone}</strong>
                  </div>
                )}
                {successData.receipt_image && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", gridColumn: "1 / -1", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: "12px", textAlign: "right" }}>
                    <span style={{ color: "#94a3b8" }}>صورة إيصال التحويل المرفقة:</span>
                    <div style={{ marginTop: "4px" }}>
                      <img 
                        src={`${API_BASE_URL}${successData.receipt_image}`} 
                        alt="Receipt Screenshot" 
                        style={{ maxWidth: "150px", maxHeight: "150px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.1)", cursor: "pointer" }}
                        onClick={() => window.open(`${API_BASE_URL}${successData.receipt_image}`, '_self')}
                        title="انقر لفتح الصورة في نفس الصفحة"
                      />
                    </div>
                  </div>
                )}
                {typeof successData.customer_balance === "number" && (
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: "8px" }}>
                    <span style={{ color: "#94a3b8" }}>الرصيد المتبقي:</span>
                     <strong style={{ color: "#86efac" }}>{successData.customer_balance.toFixed(2)} {baseCurrency}</strong>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: "8px" }}>
                  <span style={{ color: "#94a3b8" }}>الحالة:</span>
                  <span style={{ color: "#4ade80", background: "rgba(74, 222, 128, 0.1)", padding: "2px 8px", borderRadius: "6px", fontSize: "0.8rem", fontWeight: "bold" }}>قيد الانتظار (سيتم الشحن فوراً)</span>
                </div>
              </div>

              {/* Payment Method Details inside Receipt */}
              <div style={{ 
                marginTop: "20px", 
                padding: "12px 16px", 
                borderRadius: "12px", 
                background: "rgba(255,255,255,0.03)", 
                border: "1px solid rgba(255,255,255,0.05)",
                display: "flex",
                flexDirection: "column",
                gap: "6px"
              }}>
                <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>طريقة الدفع ومستلم التحويل:</span>
                {successData.payment_method === "wallet" ? (
                  <strong style={{ color: "#60a5fa" }}>المحفظة الشخصية للموقع</strong>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", flexWrap: "wrap", marginTop: "4px" }}>
                    <span style={{ color: "#f1f5f9", fontWeight: "bold" }}>تحويل يدوي إلى الرقم:</span>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <strong style={{
                        color: "#ffffff",
                        background: "#1e293b",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        border: "1px solid rgba(255,255,255,0.1)",
                        direction: "ltr",
                        display: "inline-block",
                        fontSize: "0.95rem",
                        userSelect: "all",
                        fontWeight: "bold",
                        letterSpacing: "0.5px"
                      }}>
                        {successData.transfer_to}
                      </strong>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(successData.transfer_to);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        style={{
                          background: copied ? "#22c55e" : "#3b82f6",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "8px",
                          padding: "6px 12px",
                          fontSize: "0.85rem",
                          cursor: "pointer",
                          fontWeight: "bold",
                          transition: "all 0.2s ease"
                        }}
                      >
                        {copied ? "تم النسخ ✓" : "نسخ 📋"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>

            <button
              className="glass-btn glass-btn-primary"
              style={{ width: "100%", padding: "14px", fontSize: "1.05rem", borderRadius: "14px", fontWeight: "bold" }}
              onClick={() => router.push("/")}
            >
              حسناً، العودة للرئيسية
            </button>
          </div>
        </div>
      )}
    </>
  );
}
