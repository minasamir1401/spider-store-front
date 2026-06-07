"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/config";

export default function OrdersHistory() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [token, setToken] = useState("");
  const [customerUserStr, setCustomerUserStr] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Guest tracking states
  const [trackId, setTrackId] = useState("");
  const [trackPhone, setTrackPhone] = useState("");
  const [singleOrder, setSingleOrder] = useState(null);
  const [trackError, setTrackError] = useState("");
  const [trackLoading, setTrackLoading] = useState(false);

  const customer = useMemo(() => {
    try {
      return customerUserStr ? JSON.parse(customerUserStr) : null;
    } catch {
      return null;
    }
  }, [customerUserStr]);
  const isLoggedIn = Boolean(token && customer);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
    setToken(localStorage.getItem("customer_token") || "");
    setCustomerUserStr(localStorage.getItem("customer_user") || "");
  }, []);

  async function fetchCustomerOrders(currentToken) {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/customer/orders`, {
        headers: {
          "Authorization": `Bearer ${currentToken}`
        }
      });
      if (!response.ok) throw new Error();
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching customer orders:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!hydrated || !token || !customerUserStr) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCustomerOrders(token);

    fetch(`${API_BASE_URL}/api/customer/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((profile) => {
        if (profile) {
          setCustomerUserStr(JSON.stringify(profile));
          localStorage.setItem("customer_user", JSON.stringify(profile));
        }
      })
      .catch(() => {});
  }, [hydrated, token, customerUserStr]);

  const handleTrackSingleOrder = async (e) => {
    e.preventDefault();
    setTrackError("");
    setSingleOrder(null);

    if (!trackId.trim() || !trackPhone.trim()) {
      setTrackError("يرجى ملء جميع الحقول لتتبع طلبك.");
      return;
    }

    setTrackLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/track?id=${trackId.trim()}&phone=${encodeURIComponent(trackPhone.trim())}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "تعذر العثور على الطلب.");
      }

      setSingleOrder(data);
    } catch (err) {
      setTrackError(err.message || "تأكد من إدخال رقم الطلب ورقم الهاتف بشكل صحيح.");
    } finally {
      setTrackLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("customer_token");
    localStorage.removeItem("customer_user");
    setToken("");
    setCustomerUserStr("");
    setOrders([]);
    router.refresh();
  };

  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!hydrated) return null;

  return (
    <div className="glass-container">

      {/* Mobile Drawer Overlay */}
      {drawerOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setDrawerOpen(false)} />
      )}

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${drawerOpen ? "open" : "closed"}`}>
        <div className="mobile-drawer-header">
          <span className="mobile-drawer-title">
            <div className="logo-circle" style={{ width: "32px", height: "32px", fontSize: "1rem" }}>S</div>
            القائمة
          </span>
          <button className="mobile-drawer-close" onClick={() => setDrawerOpen(false)}>✕</button>
        </div>

        {isLoggedIn && (
          <div className="mobile-drawer-user-card">
            <span>👤</span>
            <div>
              <div>{customer?.username}</div>
              <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>${Number(customer?.balance || 0).toFixed(2)}</div>
            </div>
          </div>
        )}

        <div className="mobile-drawer-divider" />

        <Link href="/" className="mobile-drawer-link" onClick={() => setDrawerOpen(false)}>🏠 الرئيسية</Link>
        <Link href="/orders" className="mobile-drawer-link active" onClick={() => setDrawerOpen(false)}>📦 تتبع الطلبات</Link>
        {isLoggedIn && <Link href="/wallet" className="mobile-drawer-link" onClick={() => setDrawerOpen(false)}>💳 شحن رصيدي</Link>}

        <div className="mobile-drawer-divider" />

        {isLoggedIn ? (
          <button
            className="mobile-drawer-link danger"
            onClick={() => { handleLogout(); setDrawerOpen(false); }}
          >🚪 تسجيل الخروج</button>
        ) : (
          <Link href="/login" className="mobile-drawer-link" onClick={() => setDrawerOpen(false)}>👤 تسجيل الدخول / حساب</Link>
        )}
      </div>

      {/* Header */}
      <header className="navbar">
        <div className="nav-right">
          <Link href="/" className="glass-btn" style={{ padding: "8px 16px", borderRadius: "100px", fontSize: "0.85rem" }}>
            <span className="nav-btn-text">← تصفح المتجر</span>
            <span className="nav-btn-icon">←</span>
          </Link>
          {isLoggedIn && (
            <Link href="/wallet" className="glass-btn nav-mobile-hidden" style={{ padding: "8px 16px", borderRadius: "100px", fontSize: "0.85rem" }}>
              <span className="nav-btn-text">💳 المحفظة</span>
              <span className="nav-btn-icon">💳</span>
            </Link>
          )}
        </div>

        <div className="nav-left">
          {isLoggedIn ? (
            <div className="user-menu-widget nav-mobile-hidden">
              <span className="user-username"><span className="nav-btn-text">مرحباً، </span>{customer.username}</span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                ${Number(customer?.balance || 0).toFixed(2)}
              </span>
              <span className="logout-btn-text" onClick={handleLogout}>
                <span className="nav-btn-text">خروج</span>
                <span className="nav-btn-icon" style={{ color: "var(--danger-color)" }}>🚪</span>
              </span>
            </div>
          ) : (
            <Link href="/login" className="glass-btn glass-btn-primary nav-mobile-hidden" style={{ padding: "8px 18px", borderRadius: "100px", fontSize: "0.85rem" }}>
              <span className="nav-btn-text">تسجيل الدخول</span>
              <span className="nav-btn-icon">👤</span>
            </Link>
          )}

          <Link href="/">
            <div className="logo-container">
              <span className="logo-text" style={{ fontSize: "1.1rem" }}>SPIDER STORE</span>
              <div className="logo-circle">S</div>
            </div>
          </Link>

          {/* Burger Button */}
          <button className="burger-btn" onClick={() => setDrawerOpen(true)} aria-label="القائمة">☰</button>
        </div>
      </header>

      {/* Main content */}
      <div style={{ marginBottom: "40px" }}>
        {isLoggedIn ? (
          /* Logged In: Show purchase history */
          <div>
            <h2 className="section-title">مشترياتي وطلباتي السابقة</h2>
            
            {loading ? (
              <div style={{ textAlign: "center", padding: "40px", fontWeight: "bold" }}>جاري تحميل طلباتك...</div>
            ) : orders.length === 0 ? (
              <div className="glass-panel" style={{ textAlign: "center", padding: "50px 20px" }}>
                <span style={{ fontSize: "3.5rem" }}>🛍️</span>
                <h3 style={{ margin: "15px 0" }}>لم تقم بأي عمليات شراء بعد!</h3>
                <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>تصفح أقسام الألعاب والتطبيقات واشحن حسابك فوراً.</p>
                <Link href="/" className="glass-btn glass-btn-primary">شحن ألعاب الآن</Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {orders.map((order) => (
                  <div className="glass-panel" key={order.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px", padding: "20px 30px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ fontWeight: 900, color: "var(--accent-color)" }}>طلب رقم #{order.id}</span>
                        <span className={`badge badge-${order.status}`} style={{ fontSize: "0.75rem" }}>
                          {order.status === "pending" && "انتظار"}
                          {order.status === "completed" && "مكتمل"}
                          {order.status === "cancelled" && "ملغي"}
                        </span>
                      </div>
                      <h3 style={{ fontWeight: 800, fontSize: "1.2rem", marginTop: "4px" }}>{order.service_name}</h3>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                        الباقة: <strong>{order.package_name}</strong> | القيمة: <strong>${Number(order.package_price || 0).toFixed(2)}</strong>
                      </p>
                      <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                        حساب الشحن (ID): <span style={{ direction: "ltr", display: "inline-block", fontWeight: "bold", color: "white" }}>{order.player_id}</span>
                      </p>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        {new Date(order.created_at).toLocaleString("ar-EG")}
                      </span>
                      {order.status === "pending" && (
                        <a
                          href={`https://wa.me/201000000000?text=${encodeURIComponent(`مرحباً دعم Spider Store، أريد تسريع طلبي رقم #${order.id} لشحن ${order.service_name}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="glass-btn"
                          style={{ padding: "6px 14px", fontSize: "0.8rem", borderRadius: "8px", background: "rgba(16, 185, 129, 0.1)", borderColor: "rgba(16, 185, 129, 0.2)", color: "var(--success-color)" }}
                        >
                          ⚡ تسريع الشحن (واتساب)
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Guest: Search by ID & Phone form */
          <div className="orders-layout">
            
            {/* Form Column */}
            <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <h2 style={{ fontWeight: 900 }}>تتبع حالة طلب الشحن</h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "4px" }}>
                  أدخل رقم الطلب ورقم الهاتف الذي استخدمته عند الشحن لمعرفة حالة طلبك فوراً.
                </p>
              </div>

              <hr style={{ opacity: 0.1 }} />

              <form onSubmit={handleTrackSingleOrder} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="track_id">رقم الطلب (Order ID):</label>
                  <input
                    id="track_id"
                    type="number"
                    placeholder="مثال: 12"
                    value={trackId}
                    onChange={(e) => setTrackId(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="track_phone">رقم الهاتف المستخدم:</label>
                  <input
                    id="track_phone"
                    type="text"
                    placeholder="مثال: 01023456789"
                    value={trackPhone}
                    onChange={(e) => setTrackPhone(e.target.value)}
                    required
                  />
                </div>

                {trackError && (
                  <div style={{ padding: "10px 14px", background: "rgba(244, 63, 94, 0.1)", borderRight: "4px solid var(--danger-color)", color: "var(--danger-color)", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "600" }}>
                    ⚠️ {trackError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={trackLoading}
                  className="glass-btn glass-btn-primary"
                  style={{ padding: "12px", borderRadius: "12px" }}
                >
                  {trackLoading ? "جاري البحث..." : "تتبع حالة الطلب 🔍"}
                </button>
              </form>
            </div>

            {/* Result Column or Info */}
            <div className="glass-panel" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              {singleOrder ? (
                /* Order found */
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  <div style={{ textAlign: "center" }}>
                    <span style={{ fontSize: "3rem" }}>📦</span>
                    <h3 style={{ fontWeight: 900, marginTop: "10px", color: "#ffffff" }}>تفاصيل الطلب #{singleOrder.id}</h3>
                    
                    <div style={{ display: "inline-block", marginTop: "10px" }}>
                      <span className={`badge badge-${singleOrder.status}`} style={{ fontSize: "0.9rem", padding: "6px 16px" }}>
                        {singleOrder.status === "pending" && "طلبك قيد الانتظار"}
                        {singleOrder.status === "completed" && "تم شحن طلبك بنجاح ✅"}
                        {singleOrder.status === "cancelled" && "تم إلغاء الطلب ❌"}
                      </span>
                    </div>
                  </div>

                  <hr style={{ opacity: 0.12, borderColor: "rgba(255,255,255,0.08)" }} />

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.92rem", padding: "16px", borderRadius: "16px", background: "linear-gradient(180deg, rgba(13, 18, 36, 0.95), rgba(13, 18, 36, 0.75))", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                      <span style={{ color: "#cbd5e1" }}>الخدمة:</span>
                      <strong style={{ color: "#ffffff", textAlign: "left" }}>{singleOrder.service_name} ({singleOrder.category_name})</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                      <span style={{ color: "#cbd5e1" }}>الباقة المطلوبة:</span>
                      <strong style={{ color: "#ffffff", textAlign: "left" }}>{singleOrder.package_name}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                      <span style={{ color: "#cbd5e1" }}>معرّف الحساب (ID):</span>
                      <strong style={{ color: "#22d3ee", direction: "ltr", textAlign: "left" }}>{singleOrder.player_id}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                      <span style={{ color: "#cbd5e1" }}>القيمة الإجمالية:</span>
                      <strong style={{ color: "#34d399" }}>${Number(singleOrder.package_price || 0).toFixed(2)}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                      <span style={{ color: "#cbd5e1" }}>تاريخ الطلب:</span>
                      <span style={{ color: "#f8fafc" }}>{new Date(singleOrder.created_at).toLocaleString("ar-EG")}</span>
                    </div>
                  </div>

                  {singleOrder.status === "pending" && (
                    <a
                      href={`https://wa.me/201000000000?text=${encodeURIComponent(`مرحباً دعم Spider Store، أريد تسريع طلب الشحن رقم #${singleOrder.id}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-btn"
                      style={{ padding: "10px", width: "100%", borderRadius: "10px", marginTop: "10px", background: "rgba(16, 185, 129, 0.14)", borderColor: "rgba(16, 185, 129, 0.35)", color: "#86efac", fontWeight: "bold", textAlign: "center" }}
                    >
                      💬 تواصل مع الدعم الفني لتسريع الشحن
                    </a>
                  )}
                </div>
              ) : (
                /* Static Guidance */
                <div style={{ textAlign: "center", padding: "20px 10px" }}>
                  <span style={{ fontSize: "3.5rem" }}>🔑</span>
                  <h3 style={{ fontWeight: 900, margin: "15px 0" }}>تسجيل الدخول لتتبع أسهل</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: "1.7", marginBottom: "20px" }}>
                    عند تسجيل حساب جديد، ستتمكن من مراجعة وتتبع جميع طلبات الشحن السابقة الخاصة بك في مكان واحد ودون الحاجة لإدخال أرقام الهواتف أو أرقام الطلبات يدوياً في كل مرة.
                  </p>
                  <Link href="/login" className="glass-btn glass-btn-primary" style={{ width: "100%", padding: "12px", borderRadius: "12px" }}>
                    تسجيل الدخول / إنشاء حساب
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="bottom-nav">
        <Link href="/" className="bottom-nav-item">
          <span className="bottom-nav-icon">🏠</span>
          <span className="bottom-nav-label">الرئيسية</span>
        </Link>
        <Link href="/orders" className="bottom-nav-item active">
          <span className="bottom-nav-icon">📦</span>
          <span className="bottom-nav-label">طلباتي</span>
        </Link>
        <Link href="/wallet" className="bottom-nav-item">
          <span className="bottom-nav-icon">💳</span>
          <span className="bottom-nav-label">محفظتي</span>
        </Link>
        <Link href="/login" className="bottom-nav-item">
          <span className="bottom-nav-icon">👤</span>
          <span className="bottom-nav-label">حسابي</span>
        </Link>
      </nav>
    </div>
  );
}
