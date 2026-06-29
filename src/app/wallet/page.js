"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/config";

export default function WalletPage() {
  const router = useRouter();
  const [token] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("customer_token") || "";
  });
  const [customer, setCustomer] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [amount, setAmount] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethodId, setSelectedMethodId] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/settings`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.payment_methods) {
          setPaymentMethods(data.payment_methods);
          if (data.payment_methods.length > 0) {
            setSelectedMethodId(data.payment_methods[0].id);
          }
        }
      })
      .catch(err => console.error("Error loading settings in wallet page:", err));
  }, []);

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [router, token]);

  useEffect(() => {
    if (!token) return;

    const fetchWalletData = async () => {
      setLoading(true);
      setError("");

      try {
        const headers = { Authorization: `Bearer ${token}` };

        const meRes = await fetch(`${API_BASE_URL}/api/customer/me`, { headers });
        if (!meRes.ok) throw new Error("فشل تحميل بيانات المحفظة.");
        const meData = await meRes.json();
        setCustomer(meData);

        const requestsRes = await fetch(`${API_BASE_URL}/api/customer/wallet-requests`, { headers });
        if (!requestsRes.ok) throw new Error("فشل تحميل الطلبات.");
        const requestsData = await requestsRes.json();
        setRequests(requestsData);
      } catch (err) {
        setError(err.message || "تعذر تحميل بيانات المحفظة.");
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      setError("يرجى إدخال مبلغ صحيح.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/customer/wallet-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount: parsedAmount, sender_phone: senderPhone, notes })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "فشل إرسال الطلب.");
      }

      setMessage(data.message || "تم إرسال الطلب بنجاح.");
      setAmount("");
      setSenderPhone("");
      setNotes("");

      const [meRes, reqRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/customer/me`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/api/customer/wallet-requests`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (meRes.ok) setCustomer(await meRes.json());
      if (reqRes.ok) setRequests(await reqRes.json());
    } catch (err) {
      setError(err.message || "تعذر إرسال طلب الشحن.");
    } finally {
      setSubmitting(false);
    }
  };

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
      setTheme(currentTheme);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem("customer_token");
    localStorage.removeItem("customer_user");
    router.push("/login");
  };

  return (
    <>
      <style>{`
        @media (max-width: 992px) {
          .wallet-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div className="wallet-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "start" }}>
        <section className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {paymentMethods.length > 1 && (
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "5px" }}>
              {paymentMethods.map((pm) => (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setSelectedMethodId(pm.id)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "10px",
                    background: selectedMethodId === pm.id ? "linear-gradient(135deg, #ef4444 0%, #8b5cf6 100%)" : "rgba(255,255,255,0.03)",
                    color: "#ffffff",
                    border: selectedMethodId === pm.id ? "none" : "1px solid rgba(255,255,255,0.08)",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    fontWeight: "bold",
                    transition: "all 0.2s"
                  }}
                >
                  {pm.name}
                </button>
              ))}
            </div>
          )}

          {(() => {
            const currentPM = paymentMethods.find(pm => pm.id === selectedMethodId) || paymentMethods[0];
            if (!currentPM) {
              return (
                <div>
                  <h2 style={{ fontWeight: 900, marginBottom: "6px" }}>شحن المحفظة</h2>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>يرجى تهيئة طرق الدفع من لوحة التحكم.</p>
                </div>
              );
            }
            return (
              <>
                <div>
                  <h2 style={{ fontWeight: 900, marginBottom: "6px" }}>المحفظة الرقمية ({currentPM.name})</h2>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.7 }}>
                    {currentPM.description}
                  </p>
                </div>

                <div style={{ padding: "16px", borderRadius: "16px", background: "#f1f5f9", border: "1px solid #cbd5e1", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, marginBottom: "4px", color: "#475569" }}>رقم أو عنوان التحويل:</div>
                    <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#000000", direction: "ltr", userSelect: "all", wordBreak: "break-all" }}>{currentPM.value}</div>
                    <div style={{ color: "#64748b", fontSize: "0.82rem", marginTop: "4px" }}>
                      تأكد من كتابة الرقم/اسم الحساب الذي حولت منه بدقة بالأسفل.
                    </div>
                  </div>
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
                      borderRadius: "8px",
                      padding: "8px 16px",
                      fontSize: "0.9rem",
                      cursor: "pointer",
                      fontWeight: "bold",
                      transition: "all 0.2s",
                      marginRight: "10px"
                    }}
                  >
                    {copied ? "تم النسخ! ✓" : "نسخ 📋"}
                  </button>
                </div>
              </>
            );
          })()}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ padding: "16px", borderRadius: "16px", background: "rgba(139, 92, 246, 0.08)", border: "1px solid rgba(139, 92, 246, 0.15)" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>الرصيد الحالي</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 900, marginTop: "6px" }}>
                {Number(customer?.balance || 0).toFixed(2)} ج.م
              </div>
            </div>
            <div style={{ padding: "16px", borderRadius: "16px", background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.15)" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>طلبات الشحن</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 900, marginTop: "6px" }}>
                {requests.length}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>المبلغ المطلوب شحنه:</label>
              <input
                type="number"
                min="1"
                step="0.01"
                placeholder="مثال: 50"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>رقم الهاتف الذي تم التحويل منه:</label>
              <input
                type="tel"
                placeholder="مثال: 01012345678"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>ملاحظات إضافية:</label>
              <textarea
                rows="3"
                placeholder="اكتب أي تفاصيل إضافية تساعد الأدمن في مراجعة الطلب..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {error && (
              <div style={{ padding: "10px 14px", background: "rgba(244, 63, 94, 0.1)", borderRight: "4px solid var(--danger-color)", color: "var(--danger-color)", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "600" }}>
                ⚠️ {error}
              </div>
            )}

            {message && (
              <div style={{ padding: "10px 14px", background: "rgba(16, 185, 129, 0.1)", borderRight: "4px solid var(--success-color)", color: "var(--success-color)", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "600" }}>
                ✓ {message}
              </div>
            )}

            <button type="submit" disabled={submitting} className="glass-btn glass-btn-primary" style={{ padding: "12px", borderRadius: "12px" }}>
              {submitting ? "جاري إرسال الطلب..." : "إرسال طلب شحن الرصيد"}
            </button>
          </form>
        </section>

        <section className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <h3 style={{ fontWeight: 900, marginBottom: "6px" }}>سجل الطلبات</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>تظهر هنا كل طلبات الشحن وحالاتها الحالية.</p>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)" }}>جاري تحميل المحفظة...</div>
          ) : requests.length === 0 ? (
            <div style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)" }}>
              لا توجد طلبات شحن رصيد بعد.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {requests.map((request) => (
                <div key={request.id} style={{ padding: "14px", borderRadius: "14px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.06)", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
                    <strong>طلب #{request.id}</strong>
                    <span className={`badge badge-${request.status}`}>
                      {request.status === "pending" && "قيد الانتظار"}
                      {request.status === "approved" && "تم الاعتماد"}
                      {request.status === "rejected" && "مرفوض"}
                    </span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.88rem", color: "var(--text-muted)" }}>
                    <div>المبلغ: <strong style={{ color: "white" }}>{Number(request.amount).toFixed(2)} ج.م</strong></div>
                    <div>رقم التحويل: <strong style={{ color: "white" }}>{request.sender_phone || "-"}</strong></div>
                    <div>التاريخ: <strong style={{ color: "white" }}>{new Date(request.created_at).toLocaleString("ar-EG")}</strong></div>
                    <div>الملاحظة: <strong style={{ color: "white" }}>{request.notes || "-"}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
