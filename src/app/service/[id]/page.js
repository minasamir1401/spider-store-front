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
  
  // Form state - dynamic fields
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [senderPhone, setSenderPhone] = useState("");
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
      setPaymentMethod("wallet");
    } else {
      setPaymentMethod("transfer");
    }
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
        setLoading(false);
      })
      .catch(() => {
        const fallback = staticServices.find(s => s.id === Number(serviceId));
        if (fallback) {
          setService(fallback);
          if (fallback.packages && fallback.packages.length > 0) {
            setSelectedPackage(fallback.packages[0]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!selectedPackage) {
      setErrorMessage("من فضلك حدد باقة الشحن المطلوبة.");
      return;
    }

    if (paymentMethod === "wallet" && !isCustomerLoggedIn) {
      setErrorMessage("يجب تسجيل الدخول لاستخدام المحفظة في الدفع.");
      return;
    }

    if (paymentMethod === "transfer" && !senderPhone.trim()) {
      setErrorMessage("يرجى إدخال الرقم الذي تم التحويل منه.");
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
          package_name: selectedPackage.name,
          package_price: selectedPackage.price,
          payment_method: paymentMethod,
          sender_phone: senderPhone,
          transfer_to: transferNumber,
          custom_fields: formData
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

  const getServiceIcon = (image) => {
    if (!image) return "⚡";
    if (image.startsWith("data:image") || image.startsWith("http") || image.startsWith("/uploads")) {
      const src = image.startsWith("/uploads") ? `${API_BASE_URL}${image}` : image;
      return <img src={src} alt="Service Icon" style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "inherit" }} />;
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

  return (
    <>
      {/* Main layout */}
      <div className="service-details-layout">
        {/* Form and Packages Selector */}
        <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Header of service */}
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <div className="service-icon" style={{ width: "80px", height: "80px", borderRadius: "24px", fontSize: "2.4rem" }}>
              {getServiceIcon(service.image)}
            </div>
            <div>
              <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-main)" }}>{service.name}</h1>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>شحن فوري ومضمون 100%</p>
            </div>
          </div>

          <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: "1.7" }}>{service.description}</p>

          <hr style={{ opacity: 0.1 }} />

          {/* Package Select */}
          <div>
            <h3 style={{ fontWeight: 800, marginBottom: "10px" }}>1. اختر الباقة المطلوبة:</h3>
            {service.packages && service.packages.length > 0 ? (
              <div className="packages-selector">
                {service.packages.map((pkg, idx) => {
                  const simulatedDiscount = 2 + (idx % 4);
                  const originalPrice = pkg.price / (1 - simulatedDiscount / 100);
                  return (
                    <div
                      key={pkg.id}
                      className={`package-option ${selectedPackage?.id === pkg.id ? "selected" : ""}`}
                      onClick={() => setSelectedPackage(pkg)}
                      style={{ position: "relative", overflow: "hidden", padding: "24px 14px 16px 14px" }}
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

                      <div style={{ display: "flex", gap: "6px", justifyContent: "center", alignItems: "baseline" }}>
                        <span className="package-price" style={{ fontSize: "1.1rem" }}>{pkg.price.toFixed(2)} ج.م</span>
                        <span style={{ textDecoration: "line-through", color: "var(--text-muted)", fontSize: "0.75rem" }}>
                          {originalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)" }}>لا تتوفر باقات حالياً لهذه الخدمة.</div>
            )}
          </div>

          <hr style={{ opacity: 0.1 }} />

          {/* Form fields - Dynamic */}
          <form onSubmit={handleSubmit}>
            <h3 style={{ fontWeight: 800, marginBottom: "15px" }}>2. بيانات الحساب المراد شحنه:</h3>
            
            {activeFields.map((field, idx) => (
              <div className="form-group" key={field.name || idx}>
                <label htmlFor={`field_${field.name}`}>{field.label}:</label>
                {field.type === "select" && field.options ? (
                  <select
                    id={`field_${field.name}`}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    required={field.required !== false}
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.1)", fontSize: "0.95rem", background: "rgba(255,255,255,0.6)" }}
                  >
                    <option value="">-- اختر --</option>
                    {(typeof field.options === 'string' ? field.options.split(',') : field.options).map((opt, i) => (
                      <option key={i} value={opt.trim()}>{opt.trim()}</option>
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
                  />
                )}
              </div>
            ))}

            <div style={{ marginTop: "18px", padding: "16px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
                <h3 style={{ fontWeight: 800, margin: 0 }}>3. طريقة الدفع:</h3>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>المبلغ: {selectedPackage ? selectedPackage.price.toFixed(2) : "0.00"} ج.م</span>
              </div>

              <div style={{ display: "grid", gap: "10px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: isCustomerLoggedIn ? "pointer" : "not-allowed", padding: "12px 14px", borderRadius: "12px", border: paymentMethod === "wallet" ? "1px solid rgba(34,197,94,0.45)" : "1px solid rgba(255,255,255,0.08)", background: paymentMethod === "wallet" ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.03)", opacity: isCustomerLoggedIn ? 1 : 0.65 }}>
                  <input type="radio" name="paymentMethod" value="wallet" checked={paymentMethod === "wallet"} onChange={() => setPaymentMethod("wallet")} disabled={!isCustomerLoggedIn} />
                  <span>
                    <strong>المحفظة</strong>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      الخصم يتم تلقائيًا من رصيدك الحالي. {isCustomerLoggedIn ? `رصيدك الحالي: ${Number(customerUser?.balance || 0).toFixed(2)} ج.م` : "يتطلب تسجيل الدخول."}
                    </div>
                  </span>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", padding: "12px 14px", borderRadius: "12px", border: paymentMethod === "transfer" ? "1px solid rgba(59,130,246,0.45)" : "1px solid rgba(255,255,255,0.08)", background: paymentMethod === "transfer" ? "rgba(59,130,246,0.08)" : "rgba(255,255,255,0.03)" }}>
                  <input type="radio" name="paymentMethod" value="transfer" checked={paymentMethod === "transfer"} onChange={() => setPaymentMethod("transfer")} />
                  <span>
                    <strong>تحويل إلى {transferNumber}</strong>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      بعد التحويل اكتب الرقم الذي تم التحويل منه حتى يظهر للأدمن.
                    </div>
                  </span>
                </label>
              </div>

              {paymentMethod === "transfer" && (
                <div className="form-group" style={{ marginTop: "14px" }}>
                  <label htmlFor="senderPhone">الرقم الذي تم التحويل منه:</label>
                  <input
                    id="senderPhone"
                    type="tel"
                    placeholder="مثال: 01023456789"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                  />
                  <div style={{ marginTop: "8px", padding: "10px 12px", borderRadius: "10px", background: "rgba(59,130,246,0.08)", color: "#cbd5e1", fontSize: "0.85rem" }}>
                    رقم الاستلام: <strong style={{ color: "#ffffff", direction: "ltr", display: "inline-block" }}>{transferNumber}</strong>
                  </div>
                </div>
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
              style={{ width: "100%", padding: "14px", fontSize: "1.1rem", borderRadius: "14px" }}
            >
              {submitting ? "جاري إرسال الطلب..." : "تأكيد وإرسال طلب الشحن"}
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

            {selectedPackage && (
              <>
                <div className="summary-row">
                  <span className="summary-label">الباقة المختارة</span>
                  <span className="summary-value">{selectedPackage.name}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">سعر الباقة</span>
                  <span className="summary-value">{selectedPackage.price.toFixed(2)} ج.م</span>
                </div>
              </>
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
                {selectedPackage ? selectedPackage.price.toFixed(2) : "0.00"} ج.م
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
        <div className="overlay">
          <div className="modal-content" style={{ textAlign: "center", padding: "30px 20px", width: "95%", maxWidth: "500px", borderRadius: "24px", maxHeight: "90vh", overflowY: "auto" }}>
            <span style={{ fontSize: "4rem", color: "var(--success-color)", display: "block", marginBottom: "15px" }}>✅</span>
            <h2 style={{ fontWeight: 800, color: "#ffffff" }}>تم استلام طلبك بنجاح!</h2>
            <p style={{ margin: "15px 0", lineHeight: "1.6", color: "#cbd5e1" }}>
              شكراً لتعاملك مع Spider Store. تم تسجيل طلب الشحن الخاص بك بنجاح وهو قيد التنفيذ الآن.
            </p>
            
            <div style={{ background: "linear-gradient(180deg, rgba(13, 18, 36, 0.98), rgba(13, 18, 36, 0.82))", border: "1px solid rgba(255,255,255,0.08)", padding: "15px", borderRadius: "12px", textAlign: "right", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.9rem", marginBottom: "20px", color: "#f8fafc" }}>
              <div><strong style={{ color: "#cbd5e1" }}>رقم الطلب:</strong> #{successData.id}</div>
              <div><strong style={{ color: "#cbd5e1" }}>الخدمة:</strong> {successData.service_name}</div>
              <div><strong style={{ color: "#cbd5e1" }}>الباقة:</strong> {successData.package_name}</div>
              <div><strong style={{ color: "#cbd5e1" }}>القيمة:</strong> {successData.package_price.toFixed(2)} ج.م</div>
              <div><strong style={{ color: "#cbd5e1" }}>طريقة الدفع:</strong> {successData.payment_method === "wallet" ? "المحفظة" : `تحويل إلى ${successData.transfer_to}`}</div>
              {successData.sender_phone && (
                <div><strong style={{ color: "#cbd5e1" }}>الرقم المحول منه:</strong> <span style={{ color: "#f8fafc", direction: "ltr", display: "inline-block" }}>{successData.sender_phone}</span></div>
              )}
              <div><strong style={{ color: "#cbd5e1" }}>حساب الشحن:</strong> <span style={{ color: "#22d3ee", direction: "ltr", display: "inline-block" }}>{successData.player_id}</span></div>
              {typeof successData.customer_balance === "number" && (
                <div><strong style={{ color: "#cbd5e1" }}>الرصيد المتبقي:</strong> <span style={{ color: "#86efac" }}>{successData.customer_balance.toFixed(2)} ج.م</span></div>
              )}
              <div><strong style={{ color: "#cbd5e1" }}>الحالة:</strong> <span style={{ color: "#86efac" }}>قيد الانتظار (سيتم الشحن فورا)</span></div>
            </div>

            <button
              className="glass-btn glass-btn-primary"
              style={{ width: "100%", padding: "12px" }}
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
