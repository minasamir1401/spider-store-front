"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/config";
import Link from "next/link";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
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

  // Redirect to dashboard if already logged in
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      router.push("/admin/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "فشل تسجيل الدخول، يرجى التحقق من البيانات.");
      }

      // Store token
      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_user", JSON.stringify(data.user));

      router.push("/admin/dashboard");
    } catch (err) {
      setError(err.message || "تعذر الاتصال بالخادم، تأكد من تشغيل الباك إند.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "20px" }}>
      <div className="glass-panel" style={{ width: "100%", maxWidth: "420px", display: "flex", flexDirection: "column", gap: "25px" }}>
        
        {/* Logo and title */}
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "inline-flex", justifyContent: "center", marginBottom: "15px" }}>
            {settings.site_logo && settings.site_logo !== "default" ? (
              <img 
                src={settings.site_logo.startsWith("http") || settings.site_logo.startsWith("/") || settings.site_logo.startsWith("data:") ? settings.site_logo : `${API_BASE_URL}${settings.site_logo}`} 
                alt={settings.site_name} 
                style={{ width: "60px", height: "60px", borderRadius: "12px", objectFit: "cover" }} 
              />
            ) : (
              <div className="logo-circle" style={{ width: "60px", height: "60px", fontSize: "2rem", borderRadius: "12px" }}>
                {settings.site_name ? settings.site_name.charAt(0) : "ع"}
              </div>
            )}
          </div>
          <h2 style={{ fontWeight: 800 }}>بوابة المشرفين الآمنة</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "5px" }}>تسجيل دخول لوحة تحكم {settings.site_name}</p>
        </div>

        <hr style={{ opacity: 0.1 }} />

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="username">اسم المستخدم:</label>
            <input
              id="username"
              type="text"
              placeholder="مثال: admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="password">كلمة المرور الحساسة:</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div style={{ padding: "10px 14px", background: "rgba(239, 68, 68, 0.1)", borderRight: "4px solid var(--danger-color)", color: "var(--danger-color)", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "600" }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="glass-btn glass-btn-primary"
            style={{ padding: "12px", width: "100%", borderRadius: "12px" }}
          >
            {submitting ? "جاري التحقق والتوقيع..." : "تسجيل الدخول الآمن"}
          </button>
        </form>

        <hr style={{ opacity: 0.1 }} />

        <div style={{ textAlign: "center" }}>
          <Link href="/" style={{ fontSize: "0.85rem", color: "var(--primary-color)", fontWeight: "600" }}>
            ← العودة للموقع الرئيسي
          </Link>
        </div>

      </div>
    </div>
  );
}
