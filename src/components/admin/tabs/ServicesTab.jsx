import React from "react";
import { API_BASE_URL } from "@/config";

export default function ServicesTab({
  serviceSearch,
  setServiceSearch,
  filteredServices,
  categories,
  baseCurrency,
  globalMarkupPercent,
  setGlobalMarkupPercent,
  savingMarkup,
  handleSaveGlobalMarkup,
  handleOpenEditService,
  handleDeleteService
}) {
  return (
    <>
      <div className="table-filter-bar" style={{ justifyContent: "flex-start", gap: "20px", flexWrap: "wrap", alignItems: "center" }}>
        <div className="search-input-wrapper">
          <input
            type="text"
            className="search-input-premium"
            placeholder="ابحث باسم الخدمة أو القسم..."
            value={serviceSearch}
            onChange={(e) => setServiceSearch(e.target.value)}
          />
          <span className="search-input-icon">🔍</span>
        </div>

        <form onSubmit={handleSaveGlobalMarkup} style={{ display: "flex", alignItems: "center", gap: "10px", marginRight: "auto" }}>
          <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#94a3b8", whiteSpace: "nowrap" }}>
            هامش الربح العام للكل (%):
          </label>
          <input
            type="number"
            step="0.1"
            className="search-input-premium"
            style={{ width: "90px", textAlign: "center", padding: "8px !important" }}
            placeholder="0.0"
            value={globalMarkupPercent}
            onChange={(e) => setGlobalMarkupPercent(e.target.value)}
          />
          <button
            type="submit"
            className="action-btn"
            disabled={savingMarkup}
            style={{
              background: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
              color: "#ffffff",
              boxShadow: "0 0 15px rgba(239, 68, 68, 0.3)",
              padding: "8px 16px",
              borderRadius: "10px",
              fontWeight: "800",
              fontSize: "0.85rem"
            }}
          >
            {savingMarkup ? "جاري الحفظ..." : "حفظ الهامش"}
          </button>
        </form>
      </div>

      <div className="premium-table-wrapper">
        <table className="premium-table">
          <thead>
            <tr>
              <th>رقم الخدمة</th>
              <th>الخدمة</th>
              <th>القسم التابع</th>
              <th>الباقات المتوفرة</th>
              <th>السعر الابتدائي</th>
              <th style={{ textAlign: "center" }}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                  لا توجد خدمات مضافة حالياً.
                </td>
              </tr>
            ) : (
              filteredServices.map((service) => {
                const parentCat = categories.find((c) => c.id === service.category_id);
                let parsedPackages = [];
                try {
                  parsedPackages = typeof service.packages === "string" ? JSON.parse(service.packages) : service.packages;
                } catch (e) {
                  parsedPackages = service.packages || [];
                }

                return (
                  <tr key={service.id}>
                    <td data-label="رقم الخدمة" style={{ fontWeight: 800, color: "#38bdf8" }}>#{service.id}</td>
                    <td data-label="الخدمة" style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: "160px", maxWidth: "220px" }}>
                      <div style={{ width: "32px", height: "32px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
                        {service.image && (service.image.startsWith("data:image") || service.image.startsWith("http") || service.image.startsWith("/uploads")) ? (
                          <img src={service.image.startsWith("/uploads") ? `${API_BASE_URL}${service.image}` : service.image} alt={service.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                        ) : (
                          <span style={{ fontSize: "1.1rem" }}>
                            {service.image === "pubg" && "🔫"}
                            {service.image === "freefire" && "🔥"}
                            {service.image === "bigo" && "💬"}
                            {service.image === "vodafone" && "📱"}
                            {service.image === "usdt" && "🪙"}
                            {service.image === "canva" && "🎨"}
                            {service.image === "netflix" && "🎬"}
                            {service.image === "default" && "⚡"}
                          </span>
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.88rem", whiteSpace: "normal" }}>{service.name}</div>
                        <div style={{ fontSize: "0.7rem", color: "#64748b" }}>
                          أيقونة: {service.image && (service.image.startsWith("data:image") || service.image.startsWith("http") || service.image.startsWith("/uploads")) ? "صورة مخصصة" : service.image}
                        </div>
                      </div>
                    </td>
                    <td data-label="القسم التابع" style={{ fontWeight: 700 }}>{parentCat ? parentCat.name : `قسم #${service.category_id}`}</td>
                    <td data-label="الباقات المتوفرة">
                      {service.price_type === "dynamic" ? (
                        <span className="pkg-tag" style={{ background: "rgba(192, 132, 252, 0.15)", color: "#c084fc", borderColor: "rgba(192, 132, 252, 0.3)", fontWeight: "bold" }}>
                          سعر الـ 1000: {Number(service.price_per_thousand || 0).toFixed(2)} ج.م
                        </span>
                      ) : service.price_type === "both" ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <span className="pkg-tag" style={{ background: "rgba(59, 130, 246, 0.15)", color: "#60a5fa", borderColor: "rgba(59, 130, 246, 0.3)", fontWeight: "bold", width: "fit-content" }}>
                            سعر الـ 1000: {Number(service.price_per_thousand || 0).toFixed(2)} ج.م
                          </span>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", maxWidth: "300px" }}>
                            {parsedPackages && parsedPackages.slice(0, 3).map((pkg) => (
                              <span key={pkg.id || pkg.name} className="pkg-tag">
                                {pkg.name} ({parentCat && parentCat.currency === "USD" ? `$${pkg.usd_price || pkg.price}` : `${pkg.price} ج.م`})
                              </span>
                            ))}
                            {parsedPackages && parsedPackages.length > 3 && (
                              <span className="pkg-tag" style={{ background: "rgba(139, 92, 246, 0.12)", color: "#c084fc", borderColor: "rgba(139, 92, 246, 0.22)", fontWeight: "bold" }}>
                                + {parsedPackages.length - 3} أخرى
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", maxWidth: "300px" }}>
                          {parsedPackages && parsedPackages.slice(0, 3).map((pkg) => (
                            <span key={pkg.id || pkg.name} className="pkg-tag">
                              {pkg.name} ({parentCat && parentCat.currency === "USD" ? `$${pkg.usd_price || pkg.price}` : `${pkg.price} ج.م`})
                            </span>
                          ))}
                          {parsedPackages && parsedPackages.length > 3 && (
                            <span className="pkg-tag" style={{ background: "rgba(139, 92, 246, 0.12)", color: "#c084fc", borderColor: "rgba(139, 92, 246, 0.22)", fontWeight: "bold" }}>
                              + {parsedPackages.length - 3} أخرى
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td data-label="السعر الابتدائي" style={{ fontWeight: 800, color: "#34d399" }}>
                      {parentCat && parentCat.currency === "USD" ? (
                        `$ ${Number(parsedPackages && parsedPackages.length > 0 ? (parsedPackages[0].usd_price || parsedPackages[0].price) : service.price).toFixed(2)}`
                      ) : service.price_type === "dynamic" ? (
                        `${Number(service.price_per_thousand || 0).toFixed(2)} ${baseCurrency} / 1000`
                      ) : service.price_type === "both" ? (
                        `${Number(service.price_per_thousand || 0).toFixed(2)} ${baseCurrency} / 1000`
                      ) : (
                        `${Number(service.price || 0).toFixed(2)} ${baseCurrency}`
                      )}
                    </td>
                    <td data-label="الإجراءات" style={{ textAlign: "center" }}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                        <button onClick={() => handleOpenEditService(service)} className="action-btn btn-edit-premium">
                          تعديل
                        </button>
                        <button onClick={() => handleDeleteService(service.id)} className="action-btn btn-danger-premium">
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
