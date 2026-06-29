"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "@/config";

export default function CustomerLogin() {
  const [activeTab, setActiveTab] = useState("login"); // login, register
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [settings, setSettings] = useState({ site_name: "عرب تك سيرفر", site_logo: "/logo.jpg" });
  const router = useRouter();

  // Fetch settings on mount
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

  useEffect(() => {
    // If already logged in, redirect to home or redirectTo
    const token = localStorage.getItem("customer_token");
    if (token) {
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const redirectTo = urlParams.get("redirectTo");
        if (redirectTo) {
          router.push(redirectTo);
          return;
        }
      }
      router.push("/");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username.trim() || !password) {
      setError("جميع الحقول مطلوبة.");
      return;
    }

    if (activeTab === "register" && !phone.trim()) {
      setError("رقم الهاتف مطلوب.");
      return;
    }

    if (activeTab === "register" && password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين.");
      return;
    }

    setSubmitting(true);

    const endpoint = activeTab === "login" ? "login" : "register";
    const bodyObj = activeTab === "login" ? { username, password } : { username, password, phone };

    try {
      const response = await fetch(`${API_BASE_URL}/api/customer/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyObj)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "حدث خطأ أثناء معالجة الطلب.");
      }

      // Save credentials in localStorage
      localStorage.setItem("customer_token", data.token);
      localStorage.setItem("customer_user", JSON.stringify(data.customer));

      setSuccess(activeTab === "login" ? "تم تسجيل دخولك بنجاح!" : "تم إنشاء حسابك وتسجيل الدخول بنجاح!");
      
      setTimeout(() => {
        if (typeof window !== "undefined") {
          const urlParams = new URLSearchParams(window.location.search);
          const redirectTo = urlParams.get("redirectTo");
          if (redirectTo) {
            router.push(redirectTo);
            router.refresh();
            return;
          }
        }
        router.push("/");
        router.refresh();
      }, 1000);
    } catch (err) {
      setError(err.message || "تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", padding: "20px" }}>
      <div className="glass-panel" style={{ width: "100%", maxWidth: "440px", display: "flex", flexDirection: "column", gap: "20px" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "inline-flex", justifyContent: "center", marginBottom: "10px" }}>
            {settings.site_logo && settings.site_logo !== "default" ? (
              <img 
                src={settings.site_logo.startsWith("http") || settings.site_logo.startsWith("/") || settings.site_logo.startsWith("data:") ? settings.site_logo : `${API_BASE_URL}${settings.site_logo}`} 
                alt={settings.site_name} 
                style={{ width: "54px", height: "54px", borderRadius: "12px", objectFit: "cover" }} 
              />
            ) : (
              <div className="logo-circle" style={{ width: "54px", height: "54px", fontSize: "1.6rem", borderRadius: "12px" }}>
                {settings.site_name ? settings.site_name.charAt(0) : "ع"}
              </div>
            )}
          </div>
          <h2 style={{ fontWeight: 900 }}>حساب {settings.site_name}</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginTop: "4px" }}>تابع مشترياتك واشحن ألعابك بسرعة فائقة</p>
        </div>

        {/* Tab switcher */}
        <div className="auth-tabs">
          <div
            className={`auth-tab ${activeTab === "login" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("login");
              setError("");
            }}
          >
            تسجيل الدخول
          </div>
          <div
            className={`auth-tab ${activeTab === "register" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("register");
              setError("");
            }}
          >
            إنشاء حساب جديد
          </div>
        </div>

        {/* Form */}
        <style>{`
          @media (max-width: 640px) {
            .register-password-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="username">اسم المستخدم:</label>
            <input
              id="username"
              type="text"
              placeholder="مثال: zoom_player"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {activeTab === "register" && (
            <>
              <div className="register-password-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", width: "100%", margin: "0 auto" }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="password">كلمة المرور:</label>
                  <div style={{ position: "relative" }}>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="أدخل كلمة المرور"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ width: "100%", paddingLeft: "48px" }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                      style={{
                        position: "absolute",
                        left: "8px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "rgba(255, 255, 255, 0.06)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        color: "#fff",
                        borderRadius: "10px",
                        padding: "6px 10px",
                        cursor: "pointer",
                        fontSize: "0.8rem"
                      }}
                    >
                      {showPassword ? "إخفاء" : "إظهار"}
                    </button>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="confirmPassword">تأكيد كلمة المرور:</label>
                  <div style={{ position: "relative" }}>
                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="أعد إدخال كلمة المرور"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{ width: "100%", paddingLeft: "48px" }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                      style={{
                        position: "absolute",
                        left: "8px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "rgba(255, 255, 255, 0.06)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        color: "#fff",
                        borderRadius: "10px",
                        padding: "6px 10px",
                        cursor: "pointer",
                        fontSize: "0.8rem"
                      }}
                    >
                      {showPassword ? "إخفاء" : "إظهار"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="phone">رقم الهاتف (واتساب):</label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="مثال: 01023456789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {activeTab === "login" && (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="password">كلمة المرور:</label>
              <input
                id="password"
                type="password"
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}

          {error && (
            <div style={{ padding: "10px 14px", background: "rgba(244, 63, 94, 0.1)", borderRight: "4px solid var(--danger-color)", color: "var(--danger-color)", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "600" }}>
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div style={{ padding: "10px 14px", background: "rgba(16, 185, 129, 0.1)", borderRight: "4px solid var(--success-color)", color: "var(--success-color)", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "600" }}>
              ✓ {success}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="glass-btn glass-btn-primary"
            style={{ padding: "12px", width: "100%", borderRadius: "12px" }}
          >
            {submitting ? "جاري المعالجة..." : activeTab === "login" ? "تسجيل الدخول" : "إنشاء الحساب الجديد"}
          </button>
        </form>

        <hr style={{ opacity: 0.1 }} />

        <div style={{ textAlign: "center" }}>
          <Link href="/" style={{ fontSize: "0.85rem", color: "var(--accent-color)", fontWeight: "600" }}>
            ← العودة للموقع الرئيسي للتصفح
          </Link>
        </div>

      </div>
    </div>
  );
}
