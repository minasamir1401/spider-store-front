"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/config";

export default function MembershipClient() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [token, setToken] = useState("");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setHydrated(true);
    const storedToken = localStorage.getItem("customer_token");
    setToken(storedToken || "");

    if (storedToken) {
      fetchProfile(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async (currentToken) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/customer/me`, {
        headers: {
          Authorization: `Bearer ${currentToken}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        localStorage.setItem("customer_user", JSON.stringify(data));
      } else {
        // Token might be invalid
        localStorage.removeItem("customer_token");
        localStorage.removeItem("customer_user");
        setToken("");
      }
    } catch (err) {
      console.error("Error fetching profile on membership page:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!hydrated) return null;

  if (!token) {
    return (
      <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px" }}>
        <div className="glass-panel" style={{ textAlign: "center", padding: "50px 20px" }}>
          <span style={{ fontSize: "4rem" }}>⭐</span>
          <h2 style={{ fontWeight: 900, margin: "20px 0 10px 0" }}>صفحة العضوية والميزات</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "30px", lineHeight: "1.7" }}>
            يرجى تسجيل الدخول إلى حسابك لاستعراض مستوى العضوية الخاص بك، الميزات النشطة، والخصومات المخصصة لك.
          </p>
          <Link href="/login" className="glass-btn glass-btn-primary" style={{ padding: "12px 30px", borderRadius: "12px", display: "inline-block", textDecoration: "none" }}>
            تسجيل الدخول / إنشاء حساب جديد 🔑
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px", fontWeight: "bold" }}>
        <div className="logo-circle" style={{ animation: "spin 1s linear infinite", width: "40px", height: "40px", margin: "0 auto 20px auto" }}>⏳</div>
        جاري تحميل تفاصيل العضوية...
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px", textAlign: "center" }}>
        <div className="glass-panel" style={{ padding: "40px 20px" }}>
          <span style={{ fontSize: "3rem" }}>⚠️</span>
          <h3 style={{ margin: "15px 0" }}>خطأ في تحميل البيانات</h3>
          <p style={{ color: "var(--text-muted)" }}>تعذر تحميل بيانات العضوية. يرجى التحقق من اتصالك بالشبكة والمحاولة مجدداً.</p>
          <button onClick={() => fetchProfile(token)} className="glass-btn" style={{ marginTop: "15px", padding: "8px 20px" }}>إعادة المحاولة 🔄</button>
        </div>
      </div>
    );
  }

  const { customer_level = "bronze", is_vip = false, total_orders = 0, balance = 0, discounts = [] } = profile;

  // Level configuration
  const levelConfig = {
    bronze: { name: "البرونزية (Bronze)", label: "برونزي", color: "#cd7f32", icon: "🥉", nextLevel: "silver", nextLevelName: "الفضية", requiredOrders: 5 },
    silver: { name: "الفضية (Silver)", label: "فضي", color: "#c0c0c0", icon: "🥈", nextLevel: "gold", nextLevelName: "الذهبية", requiredOrders: 15 },
    gold: { name: "الذهبية (Gold)", label: "ذهبي", color: "#ffd700", icon: "🥇", nextLevel: "diamond", nextLevelName: "الماسية", requiredOrders: 30 },
    diamond: { name: "الماسية (Diamond)", label: "ماسي", color: "#b9f2ff", icon: "💎", nextLevel: null, nextLevelName: "", requiredOrders: 99999 }
  };

  const currentLevelInfo = levelConfig[customer_level] || levelConfig.bronze;
  const progressPercent = currentLevelInfo.nextLevel
    ? Math.min(100, (total_orders / currentLevelInfo.requiredOrders) * 100)
    : 100;
  const remainingOrders = currentLevelInfo.nextLevel
    ? currentLevelInfo.requiredOrders - total_orders
    : 0;

  return (
    <div style={{ maxWidth: "850px", margin: "0 auto 40px auto", padding: "10px", direction: "rtl" }}>
      
      {/* Header Info */}
      <div style={{ marginBottom: "25px" }}>
        <h2 className="section-title" style={{ display: "flex", alignItems: "center", gap: "10px", margin: 0 }}>
          <span>⭐</span> عضوية الحساب والميزات الخاصة
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginTop: "6px" }}>
          استعرض تفاصيل مستواك، العروض الترويجية والخصومات المخصصة لك مباشرة.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px" }}>
        
        {/* User Card */}
        <div className="glass-panel" style={{ 
          background: "linear-gradient(135deg, rgba(30, 27, 75, 0.4) 0%, rgba(15, 23, 42, 0.4) 100%)",
          border: "1px solid rgba(99, 102, 241, 0.15)",
          padding: "25px",
          borderRadius: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ 
              width: "65px", 
              height: "65px", 
              borderRadius: "20px", 
              background: "rgba(99, 102, 241, 0.1)", 
              border: "2px dashed rgba(99, 102, 241, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem"
            }}>
              {currentLevelInfo.icon}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <h3 style={{ margin: 0, fontWeight: 900, fontSize: "1.3rem" }}>👤 {profile.username}</h3>
                {is_vip && (
                  <span style={{ 
                    background: "linear-gradient(90deg, #eab308 0%, #ca8a04 100%)", 
                    color: "#000", 
                    fontSize: "0.72rem", 
                    fontWeight: "bold",
                    padding: "3px 10px", 
                    borderRadius: "100px",
                    boxShadow: "0 0 10px rgba(234, 179, 8, 0.3)"
                  }}>
                    👑 VIP
                  </span>
                )}
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: "4px 0" }}>{profile.email}</p>
              <div style={{ display: "flex", gap: "15px", fontSize: "0.82rem", color: "#94a3b8", marginTop: "6px" }}>
                <span>إجمالي الطلبات: <strong style={{ color: "#fff" }}>{total_orders}</strong></span>
                <span>•</span>
                <span>المحفظة: <strong style={{ color: "var(--primary-color)" }}>{balance.toFixed(2)} USD</strong></span>
              </div>
            </div>
          </div>

          <div style={{ textAlign: "left" }}>
            <span style={{ fontSize: "0.78rem", color: "#94a3b8", display: "block" }}>مستوى العضوية الحالي</span>
            <span style={{ 
              fontSize: "1.25rem", 
              fontWeight: "900", 
              color: currentLevelInfo.color,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginTop: "4px",
              justifyContent: "flex-end"
            }}>
              {currentLevelInfo.icon} {currentLevelInfo.name}
            </span>
          </div>
        </div>

        {/* Progress Tracker Card */}
        {currentLevelInfo.nextLevel && (
          <div className="glass-panel" style={{ padding: "25px" }}>
            <h4 style={{ fontWeight: 800, margin: "0 0 15px 0", fontSize: "1.05rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>🚀</span> طريق الترقية للمستوى القادم
            </h4>
            
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "#cbd5e1", marginBottom: "8px" }}>
              <span>مستوى العضوية: {currentLevelInfo.label}</span>
              <span>المستوى القادم: {levelConfig[currentLevelInfo.nextLevel].label}</span>
            </div>

            {/* Progress Bar Container */}
            <div style={{ 
              width: "100%", 
              height: "12px", 
              background: "rgba(255,255,255,0.06)", 
              borderRadius: "6px", 
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.05)",
              position: "relative"
            }}>
              <div style={{ 
                width: `${progressPercent}%`, 
                height: "100%", 
                background: `linear-gradient(90deg, var(--primary-color) 0%, ${levelConfig[currentLevelInfo.nextLevel].color} 100%)`, 
                borderRadius: "6px",
                transition: "width 0.8s ease"
              }} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "8px" }}>
              <span>{total_orders} طلب</span>
              <span>{currentLevelInfo.requiredOrders} طلب</span>
            </div>

            <div style={{ 
              marginTop: "15px", 
              padding: "10px 14px", 
              background: "rgba(99, 102, 241, 0.05)", 
              borderRight: "3px solid var(--primary-color)", 
              borderRadius: "8px",
              fontSize: "0.82rem",
              lineHeight: "1.5"
            }}>
              💡 متبقي لك <strong style={{ color: "#ffffff" }}>{remainingOrders} من الطلبات الناجحة</strong> للترقية تلقائياً إلى العضوية <strong style={{ color: levelConfig[currentLevelInfo.nextLevel].color }}>{levelConfig[currentLevelInfo.nextLevel].label}</strong> والحصول على خصومات وميزات أفضل!
            </div>
          </div>
        )}

        {/* Benefits Grid */}
        <div>
          <h4 style={{ fontWeight: 800, margin: "10px 0 15px 0", fontSize: "1.1rem" }}>📋 جدول الميزات والمستويات</h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "15px" }}>
            
            {/* Bronze benefits */}
            <div className="glass-panel" style={{ 
              padding: "20px", 
              border: customer_level === "bronze" ? "1px solid #cd7f32" : "1px solid rgba(255,255,255,0.06)",
              background: customer_level === "bronze" ? "rgba(205, 127, 50, 0.05)" : "transparent"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ fontWeight: 800, color: "#cd7f32", fontSize: "1rem" }}>🥉 العضوية البرونزية</span>
                {customer_level === "bronze" && <span style={{ background: "rgba(205, 127, 50, 0.2)", color: "#cd7f32", padding: "2px 8px", borderRadius: "6px", fontSize: "0.72rem", fontWeight: "bold" }}>نشط حالياً</span>}
              </div>
              <ul style={{ paddingRight: "15px", margin: 0, fontSize: "0.82rem", color: "#94a3b8", lineHeight: "1.7" }}>
                <li>المستوى الافتراضي لجميع المسجلين.</li>
                <li>أسعار التجزئة العادية لجميع الخدمات.</li>
                <li>دعم فني عادي عبر تذاكر واتساب.</li>
              </ul>
            </div>

            {/* Silver benefits */}
            <div className="glass-panel" style={{ 
              padding: "20px", 
              border: customer_level === "silver" ? "1px solid #c0c0c0" : "1px solid rgba(255,255,255,0.06)",
              background: customer_level === "silver" ? "rgba(192, 192, 192, 0.05)" : "transparent"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ fontWeight: 800, color: "#c0c0c0", fontSize: "1rem" }}>🥈 العضوية الفضية</span>
                {customer_level === "silver" && <span style={{ background: "rgba(192, 192, 192, 0.2)", color: "#c0c0c0", padding: "2px 8px", borderRadius: "6px", fontSize: "0.72rem", fontWeight: "bold" }}>نشط حالياً</span>}
              </div>
              <ul style={{ paddingRight: "15px", margin: 0, fontSize: "0.82rem", color: "#94a3b8", lineHeight: "1.7" }}>
                <li>متطلبات الترقية: <strong style={{ color: "#fff" }}>5 طلبات ناجحة</strong>.</li>
                <li>خصم تلقائي بقيمة <strong style={{ color: "#fff" }}>1%</strong> على الخدمات.</li>
                <li>أولوية متوسطة في مراجعة وتنفيذ الطلبات.</li>
              </ul>
            </div>

            {/* Gold benefits */}
            <div className="glass-panel" style={{ 
              padding: "20px", 
              border: customer_level === "gold" ? "1px solid #ffd700" : "1px solid rgba(255,255,255,0.06)",
              background: customer_level === "gold" ? "rgba(255, 215, 0, 0.05)" : "transparent"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ fontWeight: 800, color: "#ffd700", fontSize: "1rem" }}>🥇 العضوية الذهبية</span>
                {customer_level === "gold" && <span style={{ background: "rgba(255, 215, 0, 0.2)", color: "#ffd700", padding: "2px 8px", borderRadius: "6px", fontSize: "0.72rem", fontWeight: "bold" }}>نشط حالياً</span>}
              </div>
              <ul style={{ paddingRight: "15px", margin: 0, fontSize: "0.82rem", color: "#94a3b8", lineHeight: "1.7" }}>
                <li>متطلبات الترقية: <strong style={{ color: "#fff" }}>15 طلب ناجح</strong>.</li>
                <li>خصم تلقائي بقيمة <strong style={{ color: "#fff" }}>2.5%</strong> على كافة الخدمات.</li>
                <li>أولوية عالية وسرعة تواصل مع الإدارة.</li>
              </ul>
            </div>

            {/* Diamond benefits */}
            <div className="glass-panel" style={{ 
              padding: "20px", 
              border: customer_level === "diamond" ? "1px solid #b9f2ff" : "1px solid rgba(255,255,255,0.06)",
              background: customer_level === "diamond" ? "rgba(185, 242, 255, 0.05)" : "transparent"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ fontWeight: 800, color: "#b9f2ff", fontSize: "1rem" }}>💎 العضوية الماسية</span>
                {customer_level === "diamond" && <span style={{ background: "rgba(185, 242, 255, 0.2)", color: "#b9f2ff", padding: "2px 8px", borderRadius: "6px", fontSize: "0.72rem", fontWeight: "bold" }}>نشط حالياً</span>}
              </div>
              <ul style={{ paddingRight: "15px", margin: 0, fontSize: "0.82rem", color: "#94a3b8", lineHeight: "1.7" }}>
                <li>متطلبات الترقية: <strong style={{ color: "#fff" }}>30 طلب ناجح</strong>.</li>
                <li>خصم تلقائي بقيمة <strong style={{ color: "#fff" }}>4%</strong> على كافة الخدمات.</li>
                <li>تواصل فوري وأولوية مطلقة في طابور التنفيذ.</li>
              </ul>
            </div>

            {/* VIP benefits */}
            <div className="glass-panel" style={{ 
              padding: "20px", 
              border: is_vip ? "1px solid #ca8a04" : "1px solid rgba(255,255,255,0.06)",
              background: is_vip ? "rgba(202, 138, 4, 0.05)" : "transparent"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ fontWeight: 800, color: "#eab308", fontSize: "1rem" }}>👑 العضوية الممتازة VIP</span>
                {is_vip && <span style={{ background: "rgba(234, 179, 8, 0.2)", color: "#eab308", padding: "2px 8px", borderRadius: "6px", fontSize: "0.72rem", fontWeight: "bold" }}>نشط حالياً</span>}
              </div>
              <ul style={{ paddingRight: "15px", margin: 0, fontSize: "0.82rem", color: "#94a3b8", lineHeight: "1.7" }}>
                <li>تُمنح يدوياً فقط للموزعين وأصحاب المتاجر الكبيرة.</li>
                <li>الحصول على أسعار الجملة الخاصة والحصرية (خارج التصنيف).</li>
                <li>خدمة عملاء مخصصة وإمكانية إيداع وحجز أرصدة خاصة.</li>
              </ul>
            </div>

          </div>
        </div>

        {/* Custom Discounts List */}
        <div className="glass-panel" style={{ padding: "25px" }}>
          <h4 style={{ fontWeight: 800, margin: "0 0 15px 0", fontSize: "1.05rem", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>🏷️</span> الخصومات والأسعار المخصصة لحسابك
          </h4>
          
          {discounts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px 0", color: "var(--text-muted)", fontSize: "0.85rem" }}>
              لا توجد خصومات استثنائية مخصصة لحسابك حالياً. خصومات مستواك (العضوية) تطبق تلقائياً عند الدفع.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {discounts.map((d) => (
                <div key={d.id} style={{ 
                  background: "rgba(255,255,255,0.03)", 
                  border: "1px solid rgba(255,255,255,0.06)", 
                  padding: "12px 18px", 
                  borderRadius: "12px", 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px"
                }}>
                  <div>
                    <strong style={{ display: "block", color: "#ffffff", fontSize: "0.9rem" }}>{d.description || "خصم مخصص على الخدمات"}</strong>
                    {d.expires_at && (
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        ينتهي بتاريخ: {new Date(d.expires_at).toLocaleDateString("ar-EG")}
                      </span>
                    )}
                  </div>
                  <div>
                    <span style={{ 
                      background: "rgba(52, 211, 153, 0.15)", 
                      color: "#34d399", 
                      fontSize: "0.95rem", 
                      fontWeight: "bold",
                      padding: "4px 12px",
                      borderRadius: "8px"
                    }}>
                      {d.discount_type === "percentage" ? `خصم ${d.discount_value}%` : `خصم بقيمة $${d.discount_value}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
