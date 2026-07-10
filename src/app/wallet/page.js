"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/config";

export default function WalletPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
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
  const [globalCurrencies, setGlobalCurrencies] = useState(["USD"]);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [exchangeRates, setExchangeRates] = useState({ "EGP": 50, "SDG": 600 });
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [loadingRates, setLoadingRates] = useState(true);
  const [whatsappNumbers, setWhatsappNumbers] = useState([]);
  const [receiptImageFile, setReceiptImageFile] = useState(null);
  const [receiptImagePreview, setReceiptImagePreview] = useState("");
  const [whatsappSent, setWhatsappSent] = useState(false);
  const [pendingWhatsapp, setPendingWhatsapp] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    setToken(localStorage.getItem("customer_token") || "");
    setTheme(document.documentElement.getAttribute("data-theme") || localStorage.getItem("theme") || "dark");
    
    fetch(`${API_BASE_URL}/api/settings?t=${Date.now()}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          if (data.payment_methods) {
            setPaymentMethods(data.payment_methods);
            if (data.payment_methods.length > 0) {
              setSelectedMethodId(data.payment_methods[0].id);
            }
          }
          if (data.whatsapp_numbers && Array.isArray(data.whatsapp_numbers)) {
            setWhatsappNumbers(data.whatsapp_numbers);
          }
          if (data.supported_currencies && Array.isArray(data.supported_currencies)) {
            setGlobalCurrencies(data.supported_currencies);
            if (data.supported_currencies.length > 0) {
              setSelectedCurrency(data.supported_currencies[0]);
            }
          }
          if (data.exchange_rates) {
            setExchangeRates(prev => ({ ...prev, ...data.exchange_rates }));
          }
          if (data.base_currency) {
            setBaseCurrency(data.base_currency);
          }
        }
      })
      .catch(err => console.error("Error loading settings in wallet page:", err));

    // Fetch live exchange rates from ExchangeRate-API
    fetch("https://v6.exchangerate-api.com/v6/182089caed1406b0fb1aa9e6/latest/USD")
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.result === "success" && data.conversion_rates) {
          setExchangeRates({
            EGP: data.conversion_rates.EGP || 50,
            SDG: data.conversion_rates.SDG || 600
          });
        }
        setLoadingRates(false);
      })
      .catch(err => {
        console.error("Error fetching live rates:", err);
        setLoadingRates(false);
      });
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
    if (!senderPhone.trim()) {
      setError("يرجى إدخال رقم التحويل.");
      return;
    }
    if (!receiptImageFile) {
      setError("يرجى إرفاق صورة وصل التحويل.");
      return;
    }

    setSubmitting(true);

    try {
      // Convert receipt image to base64
      let receiptBase64 = null;
      if (receiptImageFile) {
        receiptBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(receiptImageFile);
        });
      }

      const formattedNotes = notes;

      const response = await fetch(`${API_BASE_URL}/api/customer/wallet-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: parsedAmount,
          currency: selectedCurrency,
          sender_phone: senderPhone,
          notes: formattedNotes,
          receipt_image: receiptBase64  // sent to backend for auto WhatsApp delivery
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "فشل إرسال الطلب.");
      }

      const requestId = data.id || data.request_id || "";
      const customerName = customer?.username || "";
      const waText = [
        `💳 طلب شحن رصيد #${requestId}`,
        `👤 الاسم: ${customerName}`,
        `💰 القيمة المطلوبة: $${parsedAmount} USD`,
        `💵 عملة التحويل: ${selectedCurrency}`,
        `📞 رقم التحويل: ${senderPhone}`,
        notes ? `📝 ملاحظات: ${notes}` : "",
        `\nالرجاء مراجعة وصل التحويل المرفق والتأكد من اعتماده.`
      ].filter(Boolean).join("\n");

      setPendingWhatsapp({ text: waText, requestId, autoSent: data.wa_sent === true });
      setWhatsappSent(false);
      setMessage("");
      setAmount("");
      setSenderPhone("");
      setNotes("");
      setReceiptImageFile(null);
      setReceiptImagePreview("");

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

  const openWhatsapp = (number) => {
    const encoded = encodeURIComponent(pendingWhatsapp?.text || "");
    const clean = number.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${clean}?text=${encoded}`, "_blank");
  };

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
                    background: selectedMethodId === pm.id ? "linear-gradient(135deg, #ef4444 0%, #8b5cf6 100%)" : "rgba(128, 128, 128, 0.05)",
                    color: selectedMethodId === pm.id ? "#ffffff" : "var(--text-main, #000000)",
                    border: selectedMethodId === pm.id ? "none" : "1px solid rgba(128, 128, 128, 0.2)",
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

                <div style={{ padding: "16px", borderRadius: "16px", background: "rgba(59, 130, 246, 0.08)", border: "1px solid rgba(59, 130, 246, 0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, marginBottom: "4px", color: "var(--text-muted)" }}>رقم أو عنوان التحويل:</div>
                    <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "var(--text-main)", direction: "ltr", userSelect: "all", wordBreak: "break-all" }}>{currentPM.value}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginTop: "4px" }}>
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
            <div style={{ padding: "16px", borderRadius: "16px", background: "rgba(139, 92, 246, 0.08)", border: "1px solid rgba(139, 92, 246, 0.15)", gridColumn: "span 2" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "8px" }}>الرصيد الحالي للمحفظة (USD)</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", alignItems: "center" }}>
                <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#22c55e" }}>
                  $ {Number(customer?.balance || 0).toFixed(2)} USD
                </div>
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
              <label>عملة التحويل والدفع:</label>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "12px",
                  color: "#ffffff",
                  outline: "none",
                  fontSize: "0.95rem"
                }}
              >
                {globalCurrencies.map((curr) => (
                  <option key={curr} value={curr} style={{ background: "var(--bg-color)" }}>
                    {curr} {curr === "USD" ? "(الدولار الأمريكي 🇺🇸)" : curr === "EGP" ? "(الجنيه المصري 🇪🇬)" : curr === "SDG" ? "(الجنيه السوداني 🇸🇩)" : curr === "USDT" ? "(تيزر 🟢)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>المبلغ المطلوب إضافته للمحفظة بالدولار (USD):</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                placeholder="مثال: 10"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              {amount && (
                <div style={{ marginTop: "10px", padding: "12px", background: "rgba(96, 165, 250, 0.08)", borderRight: "4px solid var(--primary-color)", borderRadius: "8px", fontSize: "0.88rem", color: "#60a5fa", display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div>
                    💵 المبلغ المطلوب إضافته للمحفظة: <strong>$ {Number(amount).toFixed(2)} USD</strong>
                  </div>
                  {selectedCurrency !== baseCurrency && (
                    <div>
                      💸 المبلغ المطلوب تحويله: <strong>{Number(Number(amount) * (selectedCurrency === baseCurrency ? 1 : (exchangeRates[selectedCurrency] || 50))).toFixed(2)} {selectedCurrency}</strong> (بسعر صرف: 1 {baseCurrency} = {selectedCurrency === baseCurrency ? 1 : (exchangeRates[selectedCurrency] || 50)} {selectedCurrency})
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>رقم الهاتف / المحفظة الذي تم التحويل منه: <span style={{ color: "var(--danger-color)" }}>*</span></label>
              <input
                type="tel"
                placeholder="مثال: 01012345678"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                required
              />
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "5px" }}>
                📌 هذا الرقم سيُرسل للأدمن للتحقق من التحويل
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>صورة وصل التحويل: <span style={{ color: "var(--danger-color)" }}>*</span></label>
              <div
                style={{ border: "2px dashed rgba(255,255,255,0.15)", borderRadius: "12px", padding: "18px", textAlign: "center", background: "rgba(255,255,255,0.02)", cursor: "pointer", position: "relative" }}
                onClick={() => document.getElementById("receipt-upload-input").click()}
              >
                <input
                  id="receipt-upload-input"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setReceiptImageFile(file);
                      const reader = new FileReader();
                      reader.onload = (ev) => setReceiptImagePreview(ev.target.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {receiptImagePreview ? (
                  <div>
                    <img src={receiptImagePreview} alt="وصل التحويل" style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "10px", objectFit: "contain" }} />
                    <div style={{ fontSize: "0.8rem", color: "#10b981", marginTop: "8px" }}>✓ تم رفع الصورة — ستُرسل عبر واتساب</div>
                  </div>
                ) : (
                  <div style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
                    <div style={{ fontSize: "2rem", marginBottom: "6px" }}>📷</div>
                    اضغط لاختيار صورة وصل التحويل
                  </div>
                )}
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>ملاحظات إضافية:</label>
              <textarea
                rows="2"
                placeholder="اكتب أي تفاصيل إضافية..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {error && (
              <div style={{ padding: "10px 14px", background: "rgba(244, 63, 94, 0.1)", borderRight: "4px solid var(--danger-color)", color: "var(--danger-color)", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "600" }}>
                ⚠️ {error}
              </div>
            )}

            <button type="submit" disabled={submitting} className="glass-btn glass-btn-primary" style={{ padding: "12px", borderRadius: "12px" }}>
              {submitting ? "جاري إرسال الطلب..." : "إرسال طلب شحن الرصيد"}
            </button>
          </form>
        </section>

        {/* WhatsApp Confirmation Modal */}
        {pendingWhatsapp && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
            <div style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "18px", padding: "18px", maxWidth: "380px", width: "100%", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2.5rem" }}>{pendingWhatsapp.autoSent ? "🤖" : "✅"}</div>
                <h3 style={{ fontWeight: 900, marginTop: "6px", fontSize: "1.1rem" }}>تم تسجيل طلبك بنجاح!</h3>
                <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "2px" }}>
                  رقم الطلب: <strong style={{ color: "var(--primary-color)" }}>#{pendingWhatsapp.requestId}</strong>
                </div>
              </div>

              {pendingWhatsapp.autoSent ? (
                /* WhatsApp Bot connected — auto sent */
                <div style={{ background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.25)", borderRadius: "12px", padding: "14px", textAlign: "center" }}>
                  <div style={{ fontSize: "1.6rem", marginBottom: "6px" }}>💬✓</div>
                  <div style={{ color: "#34d399", fontWeight: "bold", fontSize: "0.88rem" }}>
                    تم إرسال الطلب وصورة الوصل تلقائياً للأدمن عبر واتساب!
                  </div>
                  <div style={{ color: "#64748b", fontSize: "0.75rem", marginTop: "4px" }}>
                    لا تحتاج لفعل أي شيء — انتظر تأكيد الأدمن
                  </div>
                </div>
              ) : (
                /* WhatsApp Bot not connected — manual fallback */
                <>
                  <div style={{ background: "rgba(37,211,102,0.08)", border: "1px solid rgba(37,211,102,0.2)", borderRadius: "10px", padding: "10px", fontSize: "0.8rem", whiteSpace: "pre-wrap", color: "#cbd5e1", direction: "rtl", maxHeight: "140px", overflowY: "auto" }}>
                    {pendingWhatsapp.text}
                  </div>

                  <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "10px", padding: "10px", fontSize: "0.78rem", color: "#fbbf24" }}>
                    📎 <strong>يرجى إرسال الوصل يدوياً:</strong> اضغط الزر أدناه ثم أرفق صورة وصل التحويل في واتساب
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {whatsappNumbers.length > 0 ? whatsappNumbers.map((num, i) => (
                      <button
                        key={i}
                        onClick={() => { openWhatsapp(num); setWhatsappSent(true); }}
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "10px", background: "linear-gradient(135deg, #25d366, #128c7e)", border: "none", borderRadius: "10px", color: "#fff", fontWeight: 800, fontSize: "0.88rem", cursor: "pointer" }}
                      >
                        <span style={{ fontSize: "1.2rem" }}>💬</span>
                        إرسال الوصل عبر واتساب {whatsappNumbers.length > 1 ? `(${i + 1})` : ""}
                      </button>
                    )) : (
                      <div style={{ color: "var(--text-muted)", textAlign: "center", fontSize: "0.8rem" }}>
                        ⚠️ واتساب البوت غير متصل — تواصل مع الأدمن
                      </div>
                    )}
                  </div>

                  {whatsappSent && (
                    <div style={{ color: "#10b981", fontWeight: "bold", textAlign: "center", fontSize: "0.8rem" }}>
                      ✓ تم فتح واتساب — لا تنسَ إرفاق صورة الوصل
                    </div>
                  )}
                </>
              )}


              <button
                onClick={() => setPendingWhatsapp(null)}
                style={{ padding: "8px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "var(--text-muted)", cursor: "pointer", fontWeight: "bold", fontSize: "0.85rem" }}
              >
                إغلاق
              </button>
            </div>
          </div>
        )}

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
                    <div>المبلغ المطلوب شحنه: <strong style={{ color: "white" }}>$ {Number(request.amount).toFixed(2)} USD</strong></div>
                    <div>عملة التحويل: <strong style={{ color: "white" }}>{request.currency || "USD"}</strong></div>
                    <div>رقم التحويل: <strong style={{ color: "white" }}>{request.sender_phone || "-"}</strong></div>
                    <div>التاريخ: <strong style={{ color: "white" }}>{new Date(request.created_at).toLocaleString("ar-EG")}</strong></div>
                    <div style={{ gridColumn: "span 2" }}>الملاحظة: <strong style={{ color: "white" }}>{request.notes ? request.notes.replace(/^\[تم تحويل:[^\]]+\]\s*/, "") : "-"}</strong></div>
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
