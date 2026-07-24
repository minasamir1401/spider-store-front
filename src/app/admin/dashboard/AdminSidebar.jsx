"use client";
import React from 'react';
import Link from 'next/link';
import dashboardStyles from "./AdminDashboardClient.styles";

export default function AdminSidebar({ activeTab, setActiveTab, unreadOrders, pendingWallets, handleLogout, adminUser, siteLogo, siteName, API_BASE_URL }) {
  return (
      <aside className="premium-sidebar">
        <div className="premium-logo">
          <div className="logo-circle" style={{ borderRadius: "10px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {siteLogo && siteLogo !== "default" ? (
              <img src={siteLogo.startsWith("/uploads") ? `${API_BASE_URL}${siteLogo}` : siteLogo} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            ) : (
              (siteName ? siteName.charAt(0) : "S")
            )}
          </div>
          <span>{siteName || "عرب تك سيرفر"} المسؤول</span>
        </div>

        <div className="user-menu-widget" style={{ marginBottom: "18px", justifyContent: "space-between" }}>
          <span className="user-username">المسجل: {adminUser?.username || "admin"}</span>
          <span className="logout-btn-text" onClick={handleLogout}>خروج</span>
        </div>

        <nav className="sidebar-nav">
          <div
            className={`nav-item-premium ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <span className="nav-icon">📥</span>
            <span>طلبات الخدمات</span>
          </div>
          
          <div
            className={`nav-item-premium ${activeTab === "categories" ? "active" : ""}`}
            onClick={() => setActiveTab("categories")}
          >
            <span className="nav-icon">📁</span>
            <span>إدارة الأقسام</span>
          </div>

          <div
            className={`nav-item-premium ${activeTab === "services" ? "active" : ""}`}
            onClick={() => setActiveTab("services")}
          >
            <span className="nav-icon">⚡</span>
            <span>إدارة الخدمات</span>
          </div>

          <div
            className={`nav-item-premium ${activeTab === "banners" ? "active" : ""}`}
            onClick={() => setActiveTab("banners")}
          >
            <span className="nav-icon">🖼️</span>
            <span>إدارة البانر الإعلاني</span>
          </div>

          <div
            className={`nav-item-premium ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            <span className="nav-icon">⭐</span>
            <span>آراء العملاء</span>
          </div>

            <div
              className={`nav-item-premium ${activeTab === "memberships" ? "active" : ""}`}
              onClick={() => setActiveTab("memberships")}
            >
              <span className="nav-icon">⭐</span>
              <span>نظام العضويات</span>
            </div>

            <div
              className={`nav-item-premium ${activeTab === "wallets" ? "active" : ""}`}
              onClick={() => setActiveTab("wallets")}
            >
              <span className="nav-icon">💳</span>
              <span>طلبات شحن الرصيد</span>
            </div>

            <div
              className={`nav-item-premium ${activeTab === "customers" ? "active" : ""}`}
              onClick={() => setActiveTab("customers")}
            >
              <span className="nav-icon">👥</span>
              <span>إدارة المستخدمين</span>
            </div>

            <div
              className={`nav-item-premium ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              <span className="nav-icon">⚙️</span>
              <span>إعدادات الموقع</span>
            </div>

            <div
              className={`nav-item-premium ${activeTab === "gmail" ? "active" : ""}`}
              onClick={() => setActiveTab("gmail")}
              style={{ background: activeTab === "gmail" ? "rgba(234,67,53,0.1)" : "", borderColor: activeTab === "gmail" ? "rgba(234,67,53,0.3)" : "" }}
            >
              <span className="nav-icon">📧</span>
              <span>بوابة ربط الجميل</span>
            </div>

            <div
              className={`nav-item-premium ${activeTab === "excel_prices" ? "active" : ""}`}
              onClick={() => setActiveTab("excel_prices")}
              style={{ background: activeTab === "excel_prices" ? "rgba(168,85,247,0.1)" : "", borderColor: activeTab === "excel_prices" ? "rgba(168,85,247,0.3)" : "" }}
            >
              <span className="nav-icon">📊</span>
              <span>أسعار أقسام السيرفر</span>
            </div>

            <div
              className={`nav-item-premium ${activeTab === "amrr_unlocker" ? "active" : ""}`}
              onClick={() => setActiveTab("amrr_unlocker")}
              style={{ background: activeTab === "amrr_unlocker" ? "rgba(14,165,233,0.1)" : "", borderColor: activeTab === "amrr_unlocker" ? "rgba(14,165,233,0.3)" : "" }}
            >
              <span className="nav-icon">🔓</span>
              <span>بوابة Amrr Unlocker</span>
            </div>

            <div
              className={`nav-item-premium ${activeTab === "backups" ? "active" : ""}`}
              onClick={() => setActiveTab("backups")}
              style={{ background: activeTab === "backups" ? "rgba(59,130,246,0.1)" : "", borderColor: activeTab === "backups" ? "rgba(59,130,246,0.3)" : "" }}
            >
              <span className="nav-icon">💾</span>
              <span>النسخ الاحتياطي</span>
            </div>

            <hr style={{ opacity: 0.05, margin: "15px 0" }} />

          <Link href="/" className="nav-item-premium">
            <span className="nav-icon">🏠</span>
            <span>الموقع الرئيسي</span>
          </Link>

          <div 
            className="nav-item-premium" 
            onClick={handleLogout} 
            style={{ color: "#f87171", marginTop: "auto" }}
          >
            <span className="nav-icon">🚪</span>
            <span>تسجيل الخروج</span>
          </div>
        </nav>
      </aside>
  );
}
