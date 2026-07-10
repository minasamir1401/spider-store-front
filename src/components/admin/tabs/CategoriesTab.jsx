import React from "react";

export default function CategoriesTab({
  catSearch,
  setCatSearch,
  filteredCategories,
  categories,
  handleOpenEditCat,
  handleDeleteCategory,
  handleClearAllCategories,
  API_BASE_URL
}) {
  return (
    <>
      <div className="table-filter-bar" style={{ justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div className="search-input-wrapper">
          <input
            type="text"
            className="search-input-premium"
            placeholder="ابحث باسم القسم..."
            value={catSearch}
            onChange={(e) => setCatSearch(e.target.value)}
          />
          <span className="search-input-icon">🔍</span>
        </div>
        <button
          onClick={handleClearAllCategories}
          className="action-btn"
          style={{
            background: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
            color: "#ffffff",
            boxShadow: "0 0 15px rgba(239, 68, 68, 0.3)",
            padding: "10px 20px",
            borderRadius: "10px",
            fontWeight: "800",
            fontSize: "0.85rem",
            border: "none",
            cursor: "pointer"
          }}
        >
          🗑️ حذف جميع الأقسام نهائياً
        </button>
      </div>

      <div className="category-grid-premium">
        {filteredCategories.map((cat) => (
          <div className="category-card-premium" key={cat.id}>
            <span className="category-icon-big" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80px" }}>
              {cat.image && (cat.image.startsWith("data:image") || cat.image.startsWith("http") || cat.image.startsWith("/uploads")) ? (
                <img src={cat.image.startsWith("/uploads") ? `${API_BASE_URL}${cat.image}` : cat.image} alt={cat.name} style={{ width: "80px", height: "80px", objectFit: "contain", borderRadius: "12px" }} />
              ) : (
                <>
                  {cat.image === "games" && "🎮"}
                  {cat.image === "apps" && "📱"}
                  {cat.image === "telecom" && "📞"}
                  {cat.image === "payment" && "💳"}
                  {cat.image === "software" && "💻"}
                  {cat.image === "accounts" && "🔑"}
                  {cat.image === "default" && "📁"}
                </>
              )}
            </span>
            <h3 className="category-title-premium">{cat.name}</h3>
            <span className="category-slug">
              أيقونة: {cat.image && (cat.image.startsWith("data:image") || cat.image.startsWith("http") || cat.image.startsWith("/uploads")) ? "صورة مخصصة" : cat.image}
            </span>
            {cat.parent_id ? (
              <span style={{ display: "inline-block", marginTop: "6px", padding: "4px 10px", borderRadius: "100px", background: "rgba(99, 102, 241, 0.15)", color: "#818cf8", fontSize: "0.8rem", fontWeight: "600", border: "1px solid rgba(99, 102, 241, 0.3)" }}>
                🏷️ قسم فرعي من: {categories.find((c) => c.id === Number(cat.parent_id))?.name || "قسم رئيسي"}
              </span>
            ) : (
              <span style={{ display: "inline-block", marginTop: "6px", padding: "4px 10px", borderRadius: "100px", background: "rgba(16, 185, 129, 0.15)", color: "#34d399", fontSize: "0.8rem", fontWeight: "600", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                📁 قسم رئيسي
              </span>
            )}

            <div style={{ marginTop: "15px", display: "flex", gap: "8px" }}>
              <button onClick={() => handleOpenEditCat(cat)} className="action-btn btn-edit-premium" style={{ flex: 1, justifyContent: "center" }}>
                تعديل
              </button>
              <button onClick={() => handleDeleteCategory(cat.id)} className="action-btn btn-danger-premium" style={{ flex: 1, justifyContent: "center" }}>
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
