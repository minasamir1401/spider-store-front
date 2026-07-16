"use client";

import React, { useState, useEffect } from "react";
import dashboardStyles from "@/app/admin/dashboard/AdminDashboardClient.styles";
import { API_BASE_URL } from "@/config";

export default function MembershipsTab({ token }) {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [newTier, setNewTier] = useState({ name: "", condition_type: "total_deposited", condition_value: 0, icon: "⭐", color: "#fbbf24" });
  
  // Selected tier for viewing discounts
  const [selectedTier, setSelectedTier] = useState(null);
  const [discounts, setDiscounts] = useState([]);
  const [newDiscount, setNewDiscount] = useState({ target_type: "global", target_id: "", discount_type: "percentage", discount_value: 0 });

  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    if (!token) return;
    fetchTiers();
    fetchCategoriesAndServices();
  }, [token]);

  const fetchTiers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/memberships/tiers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTiers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoriesAndServices = async () => {
    try {
      const catRes = await fetch(`${API_BASE_URL}/api/categories`);
      if (catRes.ok) {
        setCategories(await catRes.json());
      }
      const srvRes = await fetch(`${API_BASE_URL}/api/services`);
      if (srvRes.ok) {
        setServices(await srvRes.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTier = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/memberships/tiers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newTier)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "فشل إضافة العضوية.");
      setSuccessMsg("تم إضافة العضوية بنجاح.");
      setNewTier({ name: "", condition_type: "total_deposited", condition_value: 0, icon: "⭐", color: "#fbbf24" });
      fetchTiers();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg(err.message);
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  const handleDeleteTier = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذه العضوية؟")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/memberships/tiers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setSuccessMsg("تم حذف العضوية بنجاح.");
        if (selectedTier?.id === id) setSelectedTier(null);
        fetchTiers();
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDiscounts = async (tierId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/memberships/tiers/${tierId}/discounts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setDiscounts(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectTier = (tier) => {
    setSelectedTier(tier);
    fetchDiscounts(tier.id);
  };

  const handleAddDiscount = async (e) => {
    e.preventDefault();
    if (!selectedTier) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/memberships/tiers/${selectedTier.id}/discounts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newDiscount)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "فشل إضافة الخصم.");
      setSuccessMsg("تم إضافة الخصم بنجاح.");
      setNewDiscount({ target_type: "global", target_id: "", discount_type: "percentage", discount_value: 0 });
      fetchDiscounts(selectedTier.id);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg(err.message);
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  const handleDeleteDiscount = async (id) => {
    if (!confirm("هل أنت متأكد من حذف الخصم؟")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/memberships/discounts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setSuccessMsg("تم حذف الخصم بنجاح.");
        if (selectedTier) fetchDiscounts(selectedTier.id);
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>جاري التحميل...</div>;

  return (
    <div style={dashboardStyles.tabContent}>
      <h2 style={dashboardStyles.tabTitle}>العضويات والخصومات الديناميكية</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>
        من هنا يمكنك إنشاء مستويات عضويات مخصصة بناءً على شروط محددة (مثل إجمالي ما شحنه العميل)، وتخصيص خصومات لهذه العضويات.
      </p>

      {errorMsg && (
        <div style={{ padding: "10px", backgroundColor: "#fca5a5", color: "#991b1b", borderRadius: "8px", marginBottom: "15px" }}>
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div style={{ padding: "10px", backgroundColor: "#86efac", color: "#166534", borderRadius: "8px", marginBottom: "15px" }}>
          {successMsg}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        
        {/* Left Column: Tiers List & Form */}
        <div style={{ backgroundColor: "var(--bg-secondary)", padding: "20px", borderRadius: "12px" }}>
          <h3 style={{ marginBottom: "15px", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px" }}>مستويات العضوية</h3>
          
          <form onSubmit={handleAddTier} style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px", backgroundColor: "var(--bg-primary)", padding: "15px", borderRadius: "8px" }}>
            <h4 style={{ margin: 0, fontSize: "0.9rem" }}>إضافة عضوية جديدة</h4>
            <div style={{ display: "flex", gap: "10px" }}>
              <input type="text" placeholder="اسم العضوية" required value={newTier.name} onChange={e => setNewTier({...newTier, name: e.target.value})} style={dashboardStyles.input} />
              <input type="text" placeholder="الأيقونة (مثال ⭐)" value={newTier.icon} onChange={e => setNewTier({...newTier, icon: e.target.value})} style={{...dashboardStyles.input, width: "80px"}} />
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <select value={newTier.condition_type} onChange={e => setNewTier({...newTier, condition_type: e.target.value})} style={dashboardStyles.input}>
                <option value="total_deposited">إجمالي المبالغ المشحونة (USD)</option>
                <option value="total_orders">إجمالي عدد الطلبات الناجحة</option>
              </select>
              <input type="number" placeholder="القيمة المطلوبة" required min="0" step="any" value={newTier.condition_value} onChange={e => setNewTier({...newTier, condition_value: e.target.value})} style={dashboardStyles.input} />
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", display: "block", marginBottom: "4px" }}>لون العضوية</label>
              <input type="color" value={newTier.color} onChange={e => setNewTier({...newTier, color: e.target.value})} style={{ width: "100%", height: "40px", border: "none", borderRadius: "8px", cursor: "pointer" }} />
            </div>
            <button type="submit" style={dashboardStyles.actionBtn}>إضافة العضوية</button>
          </form>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {tiers.length === 0 ? <p style={{ color: "var(--text-muted)", textAlign: "center" }}>لا توجد عضويات بعد.</p> : null}
            {tiers.map(tier => (
              <div 
                key={tier.id} 
                onClick={() => handleSelectTier(tier)}
                style={{ 
                  display: "flex", justifyContent: "space-between", alignItems: "center", 
                  padding: "15px", backgroundColor: "var(--bg-primary)", borderRadius: "8px",
                  cursor: "pointer", border: selectedTier?.id === tier.id ? `2px solid ${tier.color}` : "2px solid transparent"
                }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "1.5rem" }}>{tier.icon}</span>
                  <div>
                    <div style={{ fontWeight: "bold", color: tier.color }}>{tier.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      الشرط: {tier.condition_type === 'total_deposited' ? 'الشحن' : 'الطلبات'} &gt;= {tier.condition_value}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDeleteTier(tier.id); }}
                  style={{ ...dashboardStyles.actionBtn, backgroundColor: "#ef4444" }}>
                  حذف
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Discounts for selected tier */}
        <div style={{ backgroundColor: "var(--bg-secondary)", padding: "20px", borderRadius: "12px" }}>
          {selectedTier ? (
            <>
              <h3 style={{ marginBottom: "15px", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", color: selectedTier.color }}>
                خصومات ({selectedTier.name})
              </h3>

              <form onSubmit={handleAddDiscount} style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px", backgroundColor: "var(--bg-primary)", padding: "15px", borderRadius: "8px" }}>
                <h4 style={{ margin: 0, fontSize: "0.9rem" }}>إضافة خصم / تقليل ربح جديد</h4>
                
                <select value={newDiscount.target_type} onChange={e => setNewDiscount({...newDiscount, target_type: e.target.value, target_id: ""})} style={dashboardStyles.input}>
                  <option value="global">عام (على جميع الخدمات)</option>
                  <option value="category">على قسم معين فقط</option>
                  <option value="service">على خدمة معينة فقط</option>
                </select>

                {newDiscount.target_type === 'category' && (
                  <select required value={newDiscount.target_id} onChange={e => setNewDiscount({...newDiscount, target_id: e.target.value})} style={dashboardStyles.input}>
                    <option value="">اختر القسم...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                )}

                {newDiscount.target_type === 'service' && (
                  <select required value={newDiscount.target_id} onChange={e => setNewDiscount({...newDiscount, target_id: e.target.value})} style={dashboardStyles.input}>
                    <option value="">اختر الخدمة...</option>
                    {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                )}

                <div style={{ display: "flex", gap: "10px" }}>
                  <select value={newDiscount.discount_type} onChange={e => setNewDiscount({...newDiscount, discount_type: e.target.value})} style={dashboardStyles.input}>
                    <option value="percentage">نسبة مئوية (%)</option>
                    <option value="fixed">مبلغ ثابت ($)</option>
                  </select>
                  <input type="number" placeholder="قيمة الخصم" required min="0" step="any" value={newDiscount.discount_value} onChange={e => setNewDiscount({...newDiscount, discount_value: e.target.value})} style={dashboardStyles.input} />
                </div>
                
                <button type="submit" style={{ ...dashboardStyles.actionBtn, backgroundColor: "#10b981" }}>حفظ الخصم</button>
              </form>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {discounts.length === 0 ? <p style={{ color: "var(--text-muted)", textAlign: "center" }}>لا توجد خصومات مضافة.</p> : null}
                {discounts.map(d => {
                  let targetName = "عام";
                  if (d.target_type === 'category') targetName = categories.find(c => c.id == d.target_id)?.name || "قسم محذوف";
                  if (d.target_type === 'service') targetName = services.find(s => s.id == d.target_id)?.name || "خدمة محذوفة";

                  return (
                    <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 15px", backgroundColor: "var(--bg-primary)", borderRadius: "8px" }}>
                      <div>
                        <div style={{ fontWeight: "bold" }}>
                          خصم {d.discount_value}{d.discount_type === 'percentage' ? '%' : '$'}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>الهدف: {targetName}</div>
                      </div>
                      <button 
                        onClick={() => handleDeleteDiscount(d.id)}
                        style={{ ...dashboardStyles.actionBtn, padding: "6px 12px", backgroundColor: "#ef4444" }}>
                        إزالة
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-muted)", textAlign: "center" }}>
              يرجى اختيار عضوية من القائمة الجانبية لعرض وتعديل خصوماتها.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
