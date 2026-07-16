"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "@/config";

export default function CustomerLogin() {
  const [activeTab, setActiveTab] = useState("login"); // login, register
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [settings, setSettings] = useState({ site_name: "عرب تك سيرفر", site_logo: "/logo.jpg" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // OTP State
  const [otpStep, setOtpStep] = useState(false);
  const [otpKey, setOtpKey] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpInfo, setOtpInfo] = useState("");

  // Forgot Password State
  const [forgotStep, setForgotStep] = useState(0); // 0=none, 1=request, 2=verify, 3=reset
  const [forgotIdentifier, setForgotIdentifier] = useState("");
  const [forgotToken, setForgotToken] = useState("");

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    const token = localStorage.getItem("customer_token");
    if (!token) {
      setIsLoggedIn(false);
      setLoadingProfile(false);
      return;
    }

    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const redirectTo = urlParams.get("redirectTo");
      if (redirectTo) {
        router.push(redirectTo);
        return;
      }
    }

    setIsLoggedIn(true);
    fetch(`${API_BASE_URL}/api/customer/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 401 || res.status === 403 || res.status === 404) {
          localStorage.removeItem("customer_token");
          localStorage.removeItem("customer_user");
          setIsLoggedIn(false);
          return null;
        }
        return res.ok ? res.json() : null;
      })
      .then(data => {
        if (data) {
          setCustomer(data);
          localStorage.setItem("customer_user", JSON.stringify(data));
        } else {
          const localUser = localStorage.getItem("customer_user");
          if (localUser) setCustomer(JSON.parse(localUser));
        }
      })
      .catch(err => {
        console.error("Failed to fetch profile:", err);
        const localUser = localStorage.getItem("customer_user");
        if (localUser) setCustomer(JSON.parse(localUser));
      })
      .finally(() => {
        setLoadingProfile(false);
      });
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (activeTab === "register") {
      if (!username.trim() || !email.trim() || !password || !phone.trim()) {
        setError("جميع الحقول المطلوبة (اسم المستخدم، البريد الإلكتروني، كلمة المرور، ورقم الواتساب) يجب ملؤها.");
        return;
      }

      if (username.trim().length < 3) {
        setError("يجب أن يكون اسم المستخدم 3 أحرف على الأقل.");
        return;
      }

      const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
      if (!emailRegex.test(email.trim().toLowerCase())) {
        setError("يجب إدخال بريد إلكتروني Gmail صحيح (ينتهي بـ @gmail.com).");
        return;
      }

      if (password !== confirmPassword) {
        setError("كلمتا المرور غير متطابقتين.");
        return;
      }
    } else {
      if (!username.trim() || !password) {
        setError("البريد الإلكتروني/اسم المستخدم وكلمة المرور مطلوبان.");
        return;
      }
    }

    setSubmitting(true);

    const endpoint = activeTab === "login" ? "login" : "register";
    const bodyObj = activeTab === "login" 
      ? { username, password } 
      : { username, email, password, phone };

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

      // If backend asks for OTP confirmation via WhatsApp/Gmail
      if (data.requireOtp) {
        setOtpKey(data.otpKey);
        setOtpInfo(data.targetInfo || "");
        setSuccess(data.message || "تم إرسال كود التحقق بنجاح.");
        setOtpStep(true);
        setSubmitting(false);
        return;
      }

      // Fallback direct login if OTP not required
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

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!otpCode.trim() || otpCode.trim().length < 4) {
      setError("يرجى إدخال كود التحقق المكون من 6 أرقام.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/customer/verify-auth-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otpKey, code: otpCode.trim() })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "كود التحقق غير صحيح.");
      }
      localStorage.setItem("customer_token", data.token);
      localStorage.setItem("customer_user", JSON.stringify(data.customer));
      setSuccess("تم تأكيد هويتك وتفعيل الحساب بنجاح! 🚀");
      setOtpStep(false);
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
      setError(err.message || "تعذر التحقق من الكود.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPasswordRequest = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/customer/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: forgotIdentifier })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "حدث خطأ.");
      setSuccess(data.message);
      setForgotStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPasswordVerify = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!otpCode.trim() || otpCode.trim().length < 4) {
      setError("يرجى إدخال الكود بشكل صحيح.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/customer/verify-forgot-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: forgotIdentifier, code: otpCode.trim() })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "الكود غير صحيح.");
      setForgotToken(data.token);
      setSuccess(data.message);
      setOtpCode(""); // clear for next time
      setForgotStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPasswordReset = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!password || password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/customer/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: forgotToken, newPassword: password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "حدث خطأ.");
      setSuccess(data.message);
      setTimeout(() => {
        setForgotStep(0);
        setActiveTab("login");
        setPassword("");
        setConfirmPassword("");
        setSuccess("");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("customer_token");
    localStorage.removeItem("customer_user");
    setIsLoggedIn(false);
    setCustomer(null);
    router.push("/");
    router.refresh();
  };

  if (!isMounted) {
    return null;
  }

  if (isLoggedIn) {
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
                  style={{ width: "64px", height: "64px", borderRadius: "16px", objectFit: "cover" }} 
                />
              ) : (
                <div className="logo-circle" style={{ width: "64px", height: "64px", fontSize: "1.8rem", borderRadius: "16px" }}>
                  {settings.site_name ? settings.site_name.charAt(0) : "ع"}
                </div>
              )}
            </div>
            <h2 style={{ fontWeight: 900 }}>الملف الشخصي</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginTop: "4px" }}>بيانات حسابك الشخصي والتحكم بالرصيد</p>
          </div>

          {loadingProfile ? (
            <div style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>جاري تحميل بيانات الحساب...</div>
          ) : customer ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              
              {/* Profile Details List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { label: "👤 اسم المستخدم", value: customer.username, color: "var(--text-main)" },
                  { label: "✉️ البريد الإلكتروني", value: customer.email || "غير متوفر", color: "var(--text-main)", isEmail: true, ltr: true },
                  { label: "📞 رقم الهاتف", value: customer.phone || "غير متوفر", color: "var(--text-main)", ltr: true },
                  { label: "💳 رصيد المحفظة", value: `${Number(customer.balance || 0).toFixed(2)} USD`, color: "var(--primary-color)", fontWeight: "bold" },
                ].map((row, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.04)", gap: "10px" }}>
                    <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: "bold", flexShrink: 0 }}>{row.label}</span>
                    <span style={{ 
                      fontSize: "0.9rem", 
                      fontWeight: row.fontWeight || "800", 
                      color: row.color, 
                      direction: row.ltr ? "ltr" : "rtl",
                      wordBreak: row.isEmail ? "break-all" : "normal",
                      overflowWrap: "anywhere",
                      textAlign: row.ltr ? "left" : "right",
                      maxWidth: "65%"
                    }}>{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Navigation Actions */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
                <Link href="/orders" className="glass-btn glass-btn-primary" style={{ padding: "12px", textAlign: "center", textDecoration: "none", width: "100%", borderRadius: "12px", fontWeight: "bold" }}>
                  📦 تتبع واستعراض طلباتي
                </Link>
                <Link href="/wallet" className="glass-btn" style={{ padding: "12px", textAlign: "center", textDecoration: "none", width: "100%", borderRadius: "12px", fontWeight: "bold", background: "rgba(255,255,255,0.05)" }}>
                  💳 شحن رصيد المحفظة
                </Link>
              </div>

              <hr style={{ opacity: 0.08, margin: "10px 0" }} />

              {/* Logout Action */}
              <button
                onClick={handleLogout}
                className="glass-btn"
                style={{ padding: "12px", width: "100%", borderRadius: "12px", color: "var(--danger-color)", fontWeight: "bold", background: "rgba(244, 63, 94, 0.05)", border: "1px solid rgba(244, 63, 94, 0.15)" }}
              >
                🚪 تسجيل الخروج من الحساب
              </button>

            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "20px", color: "var(--danger-color)" }}>فشل تحميل الملف الشخصي. يرجى تسجيل الدخول مجدداً.</div>
          )}

          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <Link href="/" style={{ fontSize: "0.85rem", color: "var(--accent-color)", fontWeight: "600" }}>
              ← العودة للموقع الرئيسي للتصفح
            </Link>
          </div>

        </div>
      </div>
    );
  }

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
          <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginTop: "4px" }}>تابع مشترياتك واحصل على خدماتك بسرعة فائقة</p>
        </div>

        {/* Tab switcher */}
        {!otpStep && forgotStep === 0 && (
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
        )}

        {/* Form */}
        <style>{`
          @media (max-width: 640px) {
            .register-password-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>

        {otpStep ? (
          <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ textAlign: "center", background: "rgba(56, 189, 248, 0.08)", border: "1px dashed rgba(56, 189, 248, 0.3)", borderRadius: "14px", padding: "16px" }}>
              <div style={{ fontSize: "2rem", marginBottom: "6px" }}>📲</div>
              <h3 style={{ fontWeight: 800, color: "#38bdf8", margin: "0 0 6px 0" }}>تأكيد الهوية وتفعيل الحساب</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
                تم إرسال كود تحقق (OTP) مكون من 6 أرقام إلى <strong>{otpInfo || "حسابك"}</strong>. يرجى إدخاله أدناه لإتمام العملية.
              </p>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontWeight: 700, color: "var(--text-main)", marginBottom: "8px", display: "block" }}>كود التحقق (OTP):</label>
              <input
                type="text"
                placeholder="1 2 3 4 5 6"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                maxLength={6}
                style={{ width: "100%", textAlign: "center", fontSize: "1.5rem", letterSpacing: "8px", fontWeight: 900, padding: "14px", borderRadius: "12px", background: "rgba(0,0,0,0.3)", border: "2px solid rgba(255,255,255,0.15)" }}
                required
              />
            </div>

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
              style={{ padding: "14px", width: "100%", borderRadius: "12px", fontWeight: 800, fontSize: "1.05rem" }}
            >
              {submitting ? "جاري التحقق..." : "🚀 تأكيد والدخول الآن"}
            </button>

            <button
              type="button"
              onClick={() => { setOtpStep(false); setOtpCode(""); setError(""); setSuccess(""); }}
              className="glass-btn"
              style={{ padding: "10px", width: "100%", borderRadius: "12px", background: "rgba(255,255,255,0.04)" }}
            >
              ← العودة وتعديل البيانات
            </button>
          </form>
        ) : forgotStep > 0 ? (
          <>
            {forgotStep === 1 && (
              <form onSubmit={handleForgotPasswordRequest} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <h3 style={{ margin: "0 0 10px 0", color: "var(--text-main)", textAlign: "center" }}>استعادة كلمة المرور</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", textAlign: "center", marginBottom: "10px" }}>
                  يرجى إدخال البريد الإلكتروني، رقم الهاتف، أو اسم المستخدم لإرسال كود التحقق.
                </p>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>المُعرّف الخاص بك:</label>
                  <input
                    type="text"
                    placeholder="example@gmail.com أو 01012345678"
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    required
                  />
                </div>
                {error && <div style={{ padding: "10px", background: "rgba(244, 63, 94, 0.1)", color: "var(--danger-color)", borderRadius: "8px", fontSize: "0.85rem" }}>⚠️ {error}</div>}
                {success && <div style={{ padding: "10px", background: "rgba(16, 185, 129, 0.1)", color: "var(--success-color)", borderRadius: "8px", fontSize: "0.85rem" }}>✓ {success}</div>}
                <button type="submit" disabled={submitting} className="glass-btn glass-btn-primary" style={{ padding: "12px", borderRadius: "12px" }}>
                  {submitting ? "جاري الإرسال..." : "إرسال كود التحقق"}
                </button>
                <button type="button" onClick={() => { setForgotStep(0); setError(""); setSuccess(""); }} className="glass-btn" style={{ padding: "10px", borderRadius: "12px", background: "rgba(255,255,255,0.04)" }}>
                  ← العودة لتسجيل الدخول
                </button>
              </form>
            )}
            {forgotStep === 2 && (
              <form onSubmit={handleForgotPasswordVerify} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <h3 style={{ margin: "0 0 10px 0", color: "var(--text-main)", textAlign: "center" }}>إدخال كود التحقق</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", textAlign: "center", marginBottom: "10px" }}>
                  تم إرسال الكود إلى حسابك. يرجى إدخاله هنا.
                </p>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>كود التحقق (OTP):</label>
                  <input
                    type="text"
                    placeholder="1 2 3 4 5 6"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    maxLength={6}
                    style={{ textAlign: "center", fontSize: "1.5rem", letterSpacing: "8px", fontWeight: 900 }}
                    required
                  />
                </div>
                {error && <div style={{ padding: "10px", background: "rgba(244, 63, 94, 0.1)", color: "var(--danger-color)", borderRadius: "8px", fontSize: "0.85rem" }}>⚠️ {error}</div>}
                {success && <div style={{ padding: "10px", background: "rgba(16, 185, 129, 0.1)", color: "var(--success-color)", borderRadius: "8px", fontSize: "0.85rem" }}>✓ {success}</div>}
                <button type="submit" disabled={submitting} className="glass-btn glass-btn-primary" style={{ padding: "12px", borderRadius: "12px" }}>
                  {submitting ? "جاري التحقق..." : "تأكيد الكود"}
                </button>
                <button type="button" onClick={() => { setForgotStep(1); setOtpCode(""); setError(""); setSuccess(""); }} className="glass-btn" style={{ padding: "10px", borderRadius: "12px", background: "rgba(255,255,255,0.04)" }}>
                  ← إعادة طلب الكود
                </button>
              </form>
            )}
            {forgotStep === 3 && (
              <form onSubmit={handleForgotPasswordReset} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <h3 style={{ margin: "0 0 10px 0", color: "var(--text-main)", textAlign: "center" }}>تعيين كلمة مرور جديدة</h3>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>كلمة المرور الجديدة:</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="أدخل كلمة المرور الجديدة"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ width: "100%", paddingLeft: "48px" }}
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle-btn">
                      {showPassword ? "إخفاء" : "إظهار"}
                    </button>
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>تأكيد كلمة المرور:</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="أعد إدخال كلمة المرور"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{ width: "100%", paddingLeft: "48px" }}
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle-btn">
                      {showPassword ? "إخفاء" : "إظهار"}
                    </button>
                  </div>
                </div>
                {error && <div style={{ padding: "10px", background: "rgba(244, 63, 94, 0.1)", color: "var(--danger-color)", borderRadius: "8px", fontSize: "0.85rem" }}>⚠️ {error}</div>}
                {success && <div style={{ padding: "10px", background: "rgba(16, 185, 129, 0.1)", color: "var(--success-color)", borderRadius: "8px", fontSize: "0.85rem" }}>✓ {success}</div>}
                <button type="submit" disabled={submitting} className="glass-btn glass-btn-primary" style={{ padding: "12px", borderRadius: "12px" }}>
                  {submitting ? "جاري الحفظ..." : "حفظ كلمة المرور"}
                </button>
              </form>
            )}
          </>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {activeTab === "login" ? (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="username">البريد الإلكتروني (الجميل) أو اسم المستخدم:</label>
                <input
                  id="username"
                  type="text"
                  placeholder="أدخل البريد الإلكتروني أو اسم المستخدم"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            ) : (
              <>
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
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="email">البريد الإلكتروني (الجميل - Gmail):</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

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
                        className="password-toggle-btn"
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
                        className="password-toggle-btn"
                      >
                        {showPassword ? "إخفاء" : "إظهار"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="phone">رقم الهاتف (واتساب) - مطلوب:</label>
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
                    className="password-toggle-btn"
                  >
                    {showPassword ? "إخفاء" : "إظهار"}
                  </button>
                </div>
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
            {activeTab === "login" && (
              <div style={{ textAlign: "center", marginTop: "5px" }}>
                <button
                  type="button"
                  onClick={() => { setForgotStep(1); setError(""); setSuccess(""); }}
                  style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.85rem", textDecoration: "underline", cursor: "pointer" }}
                >
                  هل نسيت كلمة المرور؟
                </button>
              </div>
            )}
          </form>
        )}

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
