"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/config";
import Link from "next/link";
import dashboardStyles from "./AdminDashboardClient.styles";
import AdminSidebar from "./AdminSidebar";
import { useAdminDashboardLogic } from "./useAdminDashboardLogic";
import { AdminDashboardContext } from "@/components/admin/AdminDashboardContext";
import AdminDashboardModals from "@/components/admin/modals/AdminDashboardModals";
import SettingsTab from "@/components/admin/tabs/SettingsTab";
import GmailTab from "@/components/admin/tabs/GmailTab";
import ExcelPricesTab from "@/components/admin/tabs/ExcelPricesTab";
import AmrrUnlockerTab from "@/components/admin/tabs/AmrrUnlockerTab";
import AdminReviewsTab from "@/components/admin/tabs/AdminReviewsTab";
import OrdersTab from "@/components/admin/tabs/OrdersTab";
import WalletsTab from "@/components/admin/tabs/WalletsTab";
import CustomersTab from "@/components/admin/tabs/CustomersTab";
import CategoriesTab from "@/components/admin/tabs/CategoriesTab";
import ServicesTab from "@/components/admin/tabs/ServicesTab";
import BannersTab from "@/components/admin/tabs/BannersTab";
import BackupsTab from "@/components/admin/tabs/BackupsTab";
import MembershipsTab from "@/components/admin/tabs/MembershipsTab";

export default function AdminDashboard() {
  const router = useRouter();
  const state = useAdminDashboardLogic(API_BASE_URL);
  if (!state.hydrated) return null;

  return (
    <div className="admin-dashboard-root" dir="rtl">
      {/* Premium Styling Overrides injected globally via style tag */}
      <style jsx global>{dashboardStyles}</style>
      {state.adminDrawerOpen && (
        <div className="mobile-drawer-overlay" onClick={() => state.setAdminDrawerOpen(false)} />
      )}
      <div className={`mobile-drawer ${state.adminDrawerOpen ? "open" : "closed"}`}>
        <div className="mobile-drawer-header">
          <span className="mobile-drawer-title">
            <div className="logo-circle" style={{ width: "32px", height: "32px", fontSize: "1rem" }}>Z</div>
            <span>لوحة التحكم</span>
          </span>
          <button className="mobile-drawer-close" onClick={() => state.setAdminDrawerOpen(false)}>✕</button>
        </div>
        <div className="mobile-drawer-user-card">
          <span>🔐</span>
          <div>
            <div style={{ fontWeight: 600 }}>{state.adminUser?.username || "admin"}</div>
            <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>مسؤول النظام</div>
          </div>
        </div>
        <div className="mobile-drawer-divider" />
        {[
          { tab: "orders", icon: "📥", label: "طلبات الخدمات" },
          { tab: "categories", icon: "📁", label: "إدارة الأقسام" },
          { tab: "services", icon: "⚡", label: "إدارة الخدمات" },
          { tab: "banners", icon: "🖼️", label: "إدارة البانر الإعلاني" },
          { tab: "reviews", icon: "⭐", label: "آراء العملاء" },
          { tab: "memberships", icon: "⭐", label: "العضويات والخصومات" },
          { tab: "wallets", icon: "💳", label: "طلبات شحن الرصيد" },
          { tab: "customers", icon: "👥", label: "إدارة المستخدمين" },
          { tab: "settings", icon: "⚙️", label: "إعدادات الموقع" },
          { tab: "gmail", icon: "📧", label: "بوابة ربط الجميل" },
          { tab: "amrr_unlocker", icon: "🔓", label: "بوابة Amrr Unlocker" },
          { tab: "backups", icon: "💾", label: "النسخ الاحتياطي" },
        ].map(item => (
          <button key={item.tab}
            className={`mobile-drawer-link ${state.activeTab === item.tab ? "active" : ""}`}
            onClick={() => { setActiveTab(item.tab); state.setAdminDrawerOpen(false); }}
          >
            <span style={{ marginInlineEnd: "10px" }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
        <div className="mobile-drawer-divider" />
        <Link href="/" className="mobile-drawer-link" onClick={() => state.setAdminDrawerOpen(false)}>
          <span style={{ marginInlineEnd: "10px" }}>🏠</span>
          الموقع الرئيسي
        </Link>
        <button className="mobile-drawer-link danger" onClick={state.handleLogout}>
          <span style={{ marginInlineEnd: "10px" }}>🚪</span>
          تسجيل الخروج
        </button>
      </div>

      {/* Sidebar */}
      <AdminSidebar activeTab={state.activeTab} setActiveTab={state.setActiveTab} unreadOrders={state.orders?.filter(o=>o.status==='pending')?.length || 0} pendingWallets={state.walletRequests?.filter(w=>w.status==='pending')?.length || 0} handleLogout={state.handleLogout} adminUser={state.adminUser} siteLogo={state.settings?.site_logo} siteName={state.settings?.site_name} API_BASE_URL={API_BASE_URL} />

      {/* Main Content */}
      <main className="premium-content">
        <header className="content-header">
          <button className="admin-burger-btn" onClick={() => state.setAdminDrawerOpen(true)}>☰</button>
          <div className="header-title-section">
            <h1>
              {state.activeTab === "orders" && "طلبات الخدمات"}
              {state.activeTab === "categories" && "الأقسام والتبويبات"}
                {state.activeTab === "services" && "الخدمات والمنتجات"}
                {state.activeTab === "banners" && "البانر الإعلاني الرئيسي"}
                {state.activeTab === "reviews" && "إدارة آراء العملاء"}
                {state.activeTab === "memberships" && "نظام العضويات والخصومات"}
                {state.activeTab === "wallets" && "طلبات شحن الرصيد"}
                {state.activeTab === "customers" && "إدارة المستخدمين والمحافظ (العملاء)"}
                {state.activeTab === "settings" && "إعدادات معلومات الموقع"}
                {state.activeTab === "gmail" && "بوابة ربط البريد الإلكتروني (Gmail Portal)"}
                {state.activeTab === "excel_prices" && "أسعار أقسام السيرفر (APPLE & FRP)"}
              {state.activeTab === "amrr_unlocker" && "بوابة تفعيل ومزامنة Amrr Unlocker"}
              {state.activeTab === "backups" && "نظام النسخ الاحتياطي واستعادة البيانات"}
              </h1>
              <p>
                {state.activeTab === "orders" && "عرض وإدارة الطلبات المدخلة من العملاء وحالة شحنها"}
                {state.activeTab === "categories" && "إدارة وتصنيف أقسام المتجر وتحديث أيقوناتها"}
                {state.activeTab === "services" && "إدارة الخدمات وتفاصيل حزم التسعير والباقات"}
                {state.activeTab === "banners" && "التحكم الكامل بالشرائح الإعلانية والعروض في الصفحة الرئيسية للموقع"}
                {state.activeTab === "reviews" && "إدارة وإضافة آراء وتقييمات العملاء التي تظهر في الصفحة الرئيسية"}
                {state.activeTab === "memberships" && "إدارة مستويات العضويات (مثل الفضية والذهبية) وتحديد خصومات خاصة لكل مستوى"}
                {state.activeTab === "wallets" && "مراجعة طلبات شحن الرصيد واعتمادها أو رفضها وتحديث رصيد العميل مباشرة"}
                {state.activeTab === "customers" && "إدارة حسابات العملاء المسجلين، حذف الحسابات، تعديل الأرصدة والبيانات، واستعراض سجل الحركات"}
                {state.activeTab === "settings" && "تعديل اسم الموقع وشعاره وأيقونة التبويب (Favicon) لتبديل الهوية البصرية للفلاتر ومحركات البحث (SEO)"}
                {state.activeTab === "gmail" && "التحكم ببيانات خادم Gmail، إرسال رسائل تجريبية، وإدارة أكواد تحقق الـ OTP للعملاء"}
                {state.activeTab === "excel_prices" && "التحكم بأسعار صرف الدولار وهامش الأرباح واستيراد وتحديث خدمات APPLE وسيرفر FRP عبر ملفات الإكسل"}
              {state.activeTab === "amrr_unlocker" && "إدارة مفتاح الـ API واستيراد خدمات تخطي وحسابات Amrr Unlocker بهامش ربح مخصص وتفعيلها آلياً"}
              {state.activeTab === "backups" && "إنشاء نسخ احتياطية للموقع وتنزيلها محلياً أو استرجاعها مباشرة لضمان سلامة البيانات"}
              </p>
            </div>

          <div className="header-actions">
            <button
              onClick={() => {
                state.fetchData();
                alert("تم تحديث البيانات بنجاح! 🔄");
              }}
              className="btn-add-premium"
              style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "#ffffff", padding: "10px 16px", cursor: "pointer" }}
            >
              🔄 تحديث البيانات
            </button>
            <div className="user-menu-widget" style={{ marginInlineStart: "auto" }}>
              <span className="user-username">{state.adminUser?.username || "admin"}</span>
              <span className="logout-btn-text" onClick={state.handleLogout}>خروج</span>
            </div>
            {state.activeTab === "categories" && (
              <button 
                onClick={() => {
                  setNewCatImage("games");
                  setCatUploadedFile(null);
                  setShowCatModal(true);
                }} 
                className="btn-add-premium"
              >
                + إضافة قسم جديد
              </button>
            )}
            {state.activeTab === "services" && (
              <button 
                onClick={() => {
                  setNewServiceImage("pubg");
                  setServiceUploadedFile(null);
                  setShowServiceModal(true);
                }} 
                className="btn-add-premium"
              >
                + إضافة خدمة جديدة
              </button>
            )}
            {state.activeTab === "banners" && (
              <button 
                onClick={() => {
                  setNewBannerTitle("");
                  setNewBannerHighlight("");
                  setNewBannerDesc("");
                  setNewBannerBadge("");
                  setNewBannerColor("#8b5cf6");
                  setNewBannerIcon("⚡");
                  setShowBannerModal(true);
                }} 
                className="btn-add-premium"
              >
                + إضافة شريحة جديدة
              </button>
            )}
          </div>
        </header>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
            <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "#94a3b8" }}>جاري تحميل البيانات...</span>
          </div>
        ) : (
          <>
            {/* Orders Section */}
            {state.activeTab === "orders" && (
      <OrdersTab 
        stats={stats}
        baseCurrency={baseCurrency}
        orderSearch={orderSearch}
        setOrderSearch={setOrderSearch}
                orderFilter={orderFilter}
                setOrderFilter={setOrderFilter}
        orders={orders}
        filteredOrders={filteredOrders}
        setOrderDetailsData={setOrderDetailsData}
        setShowOrderDetailsModal={setShowOrderDetailsModal}
        handleApproveOrder={handleApproveOrder}
        handleOpenCodeModal={handleOpenCodeModal}
        updateOrderStatus={updateOrderStatus}
        checkUnlockerOrderStatus={checkUnlockerOrderStatus}
        cancelUnlockerOrder={cancelUnlockerOrder}
        handleManualRefund={handleManualRefund}
        deleteOrder={deleteOrder}
                walletTransactions={walletTransactions}
                filteredWalletTransactions={filteredWalletTransactions}
              />
            )}

            {/* Wallet Requests Section */}
            {state.activeTab === "wallets" && (
              <WalletsTab
                walletRequests={walletRequests}
                walletSearch={walletSearch}
                setWalletSearch={setWalletSearch}
                walletFilter={walletFilter}
                setWalletFilter={setWalletFilter}
                filteredWalletRequests={filteredWalletRequests}
                updateWalletRequestStatus={updateWalletRequestStatus}
              />
            )}

            {/* Customers Section */}
            {state.activeTab === "customers" && (
              <CustomersTab
                customers={customers}
                customerSearch={customerSearch}
                setCustomerSearch={setCustomerSearch}
                filteredCustomers={filteredCustomers}
                baseCurrency={baseCurrency}
                walletTransactions={walletTransactions}
                selectedCustomerId={selectedCustomerId}
                setSelectedCustomerId={setSelectedCustomerId}
                selectedCustomerTransactions={selectedCustomerTransactions}
                handleOpenEditCustomer={handleOpenEditCustomer}
                handleDeleteCustomer={handleDeleteCustomer}
              />
            )}

            {/* Categories Section */}
            {state.activeTab === "categories" && (
              <CategoriesTab
                catSearch={catSearch}
                setCatSearch={setCatSearch}
                filteredCategories={filteredCategories}
                categories={categories}
                handleOpenEditCat={handleOpenEditCat}
                handleDeleteCategory={handleDeleteCategory}
                handleClearAllCategories={handleClearAllCategories}
                API_BASE_URL={API_BASE_URL}
              />
            )}

            {/* Services Section */}
            {state.activeTab === "services" && (
              <ServicesTab
                serviceSearch={serviceSearch}
                setServiceSearch={setServiceSearch}
                filteredServices={filteredServices}
                categories={categories}
                baseCurrency={baseCurrency}
                globalMarkupPercent={globalMarkupPercent}
                setGlobalMarkupPercent={setGlobalMarkupPercent}
                savingMarkup={savingMarkup}
                handleSaveGlobalMarkup={handleSaveGlobalMarkup}
                handleOpenEditService={handleOpenEditService}
                handleDeleteService={handleDeleteService}
                handleClearAllServices={handleClearAllServices}
                token={token}
                setServices={setServices}
              />
            )}

            {/* Banners Section */}
            {state.activeTab === "banners" && (
              <BannersTab
                banners={banners}
                bannerSearch={bannerSearch}
                setBannerSearch={setBannerSearch}
                handleOpenEditBanner={handleOpenEditBanner}
                handleDeleteBanner={handleDeleteBanner}
              />
            )}

            {/* Reviews Section */}
            {state.activeTab === "reviews" && (
              <AdminReviewsTab token={token} />
            )}

            {/* Memberships Section */}
            {state.activeTab === "memberships" && (
              <MembershipsTab token={token} />
            )}

            {/* Settings Section */}
            {state.activeTab === "settings" && (
              <SettingsTab
                siteName={siteName}
                setSiteName={setSiteName}
                baseCurrency={baseCurrency}
                setBaseCurrency={setBaseCurrency}
                globalMarkupPercent={globalMarkupPercent}
                setGlobalMarkupPercent={setGlobalMarkupPercent}
                hideWalletPayment={hideWalletPayment}
                setHideWalletPayment={setHideWalletPayment}
                logoUploadedFile={logoUploadedFile}
                setLogoUploadedFile={setLogoUploadedFile}
                siteLogo={siteLogo}
                setSiteLogo={setSiteLogo}
                faviconUploadedFile={faviconUploadedFile}
                setFaviconUploadedFile={setFaviconUploadedFile}
                siteFavicon={siteFavicon}
                setSiteFavicon={setSiteFavicon}
                paymentMethodsList={paymentMethodsList}
                setPaymentMethodsList={setPaymentMethodsList}
                globalCurrencies={globalCurrencies}
                setGlobalCurrencies={setGlobalCurrencies}
                exchangeRates={exchangeRates}
                setExchangeRates={setExchangeRates}
                addCurrencySelect={addCurrencySelect}
                setAddCurrencySelect={setAddCurrencySelect}
                addCurrencyCustomCode={addCurrencyCustomCode}
                setAddCurrencyCustomCode={setAddCurrencyCustomCode}
                addCurrencyRate={addCurrencyRate}
                setAddCurrencyRate={setAddCurrencyRate}
                whatsappNumbers={whatsappNumbers}
                setWhatsappNumbers={setWhatsappNumbers}
                newWhatsappNumber={newWhatsappNumber}
                setNewWhatsappNumber={setNewWhatsappNumber}
                homeStats={homeStats}
                setHomeStats={setHomeStats}
                emailUser={emailUser}
                setEmailUser={setEmailUser}
                emailPass={emailPass}
                setEmailPass={setEmailPass}
                announcementText={announcementText}
                setAnnouncementText={setAnnouncementText}
                errorMsg={errorMsg}
                handleUpdateSettings={handleUpdateSettings}
                handleUpdateCredentials={handleUpdateCredentials}
                newAdminUsername={newAdminUsername}
                setNewAdminUsername={setNewAdminUsername}
                newAdminPassword={newAdminPassword}
                setNewAdminPassword={setNewAdminPassword}
                showAdminPassword={showAdminPassword}
                setShowAdminPassword={setShowAdminPassword}
                credentialsErrorMsg={credentialsErrorMsg}
                credentialsSuccessMsg={credentialsSuccessMsg}
                token={token}
                API_BASE_URL={API_BASE_URL}
              />
            )}

            {/* Backups Section */}
            {state.activeTab === "backups" && (
              <BackupsTab token={token} API_BASE_URL={API_BASE_URL} />
            )}
          </>
        )}

        {/* ===================== Gmail TAB ===================== */}
        {state.activeTab === "gmail" && <GmailTab />}

            {/* Excel & Server Prices Tab */}
            {state.activeTab === "excel_prices" && (
              <ExcelPricesTab
                excelSettingsSuccessMsg={excelSettingsSuccessMsg}
                excelSettingsErrorMsg={excelSettingsErrorMsg}
                handleUpdateExcelSettings={handleUpdateExcelSettings}
                excelAppleUsdRate={excelAppleUsdRate}
                setExcelAppleUsdRate={setExcelAppleUsdRate}
                excelAppleMarkup={excelAppleMarkup}
                setExcelAppleMarkup={setExcelAppleMarkup}
                excelFrpUsdRate={excelFrpUsdRate}
                setExcelFrpUsdRate={setExcelFrpUsdRate}
                excelFrpMarkup={excelFrpMarkup}
                setExcelFrpMarkup={setExcelFrpMarkup}
                excelUploadLoading={excelUploadLoading}
                handleUploadExcelFile={handleUploadExcelFile}
                excelAppleUploadMsg={excelAppleUploadMsg}
                excelFrpUploadMsg={excelFrpUploadMsg}
              />
            )}
      
            {state.activeTab === "amrr_unlocker" && (
              <AmrrUnlockerTab
                unlockerBalanceEmail={unlockerBalanceEmail}
                unlockerBalance={unlockerBalance}
                unlockerBalanceLoading={unlockerBalanceLoading}
                fetchUnlockerBalance={fetchUnlockerBalance}
                unlockerExchangeRate={unlockerExchangeRate}
                setUnlockerExchangeRate={setUnlockerExchangeRate}
                unlockerMarkupPercent={unlockerMarkupPercent}
                setUnlockerMarkupPercent={setUnlockerMarkupPercent}
                unlockerImportTargetCat={unlockerImportTargetCat}
                setUnlockerImportTargetCat={setUnlockerImportTargetCat}
                categories={categories}
                unlockerNewCatName={unlockerNewCatName}
                setUnlockerNewCatName={setUnlockerNewCatName}
                unlockerGroupAsPackages={unlockerGroupAsPackages}
                setUnlockerGroupAsPackages={setUnlockerGroupAsPackages}
                fetchUnlockerServices={fetchUnlockerServices}
                unlockerLoading={unlockerLoading}
                importSelectedUnlockerServices={importSelectedUnlockerServices}
                selectedUnlockerServices={selectedUnlockerServices}
                setSelectedUnlockerServices={setSelectedUnlockerServices}
                unlockerSyncMsg={unlockerSyncMsg}
                unlockerServices={unlockerServices}
                unlockerSearch={unlockerSearch}
                setUnlockerSearch={setUnlockerSearch}
                unlockerPage={unlockerPage}
                setUnlockerPage={setUnlockerPage}
                unlockerCategoryFilter={unlockerCategoryFilter}
                setUnlockerCategoryFilter={setUnlockerCategoryFilter}
                unlockerPageSize={unlockerPageSize}
                setUnlockerPageSize={setUnlockerPageSize}
                unlockerSortOrder={unlockerSortOrder}
                setUnlockerSortOrder={setUnlockerSortOrder}
                filteredUnlockerServices={filteredUnlockerServices}
                paginatedUnlockerServices={paginatedUnlockerServices}
                importedUnlockerServiceIds={importedUnlockerServiceIds}
                unlockerCurrency={unlockerCurrency}
                unlockerCustomPrices={unlockerCustomPrices}
                setUnlockerCustomPrices={setUnlockerCustomPrices}
                unlockerCustomDiscounts={unlockerCustomDiscounts}
                setUnlockerCustomDiscounts={setUnlockerCustomDiscounts}
                totalUnlockerPages={totalUnlockerPages}
                unlockerCategories={unlockerCategories}
                apiAutoSubmit={apiAutoSubmit}
                handleToggleAutoSubmit={handleToggleAutoSubmit}
                handleWipeAndSyncAll={handleWipeAndSyncAll}
              />
            )}
</main>

      {/* Universal Deletion 2FA OTP Gate Modal */}
      {deleteOtpModal.isOpen && (
        <div className="modal-overlay" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.75)", backdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999, padding: "20px" }}>
          <div className="glass-panel" style={{ width: "100%", maxWidth: "440px", padding: "28px", borderRadius: "20px", border: "1px solid rgba(239, 68, 68, 0.4)", boxShadow: "0 20px 50px rgba(0,0,0,0.6)" }}>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", marginBottom: "12px" }}>
                🔒
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#fff", margin: 0 }}>تأكيد الحذف بواسطة كود الواتساب</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "6px" }}>أمان عالي لمنع الحذف غير المصرح به من لوحة التحكم</p>
            </div>

            <div style={{ padding: "12px 14px", background: "rgba(34, 197, 94, 0.12)", border: "1px solid rgba(34, 197, 94, 0.3)", borderRadius: "10px", color: "#4ade80", fontSize: "0.86rem", lineHeight: "1.6", textAlign: "center", marginBottom: "18px" }}>
              📲 {deleteOtpModal.message}
            </div>

            <form onSubmit={handleConfirmDeleteOtp} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", textAlign: "center", fontWeight: "700", marginBottom: "8px", color: "#f87171" }}>
                  أدخل كود التحقق (6 أرقام):
                </label>
                <input
                  type="text"
                  placeholder="1 2 3 4 5 6"
                  maxLength={6}
                  value={deleteOtpCode}
                  onChange={(e) => setDeleteOtpCode(e.target.value.replace(/\D/g, ""))}
                  style={{
                    width: "100%",
                    textAlign: "center",
                    fontSize: "1.6rem",
                    letterSpacing: "8px",
                    fontWeight: "800",
                    padding: "12px",
                    borderRadius: "12px",
                    background: "rgba(0, 0, 0, 0.4)",
                    border: "2px solid #f87171",
                    color: "#fff"
                  }}
                  autoFocus
                  required
                />
              </div>

              {deleteOtpError && (
                <div style={{ padding: "10px 14px", background: "rgba(239, 68, 68, 0.15)", borderRight: "4px solid var(--danger-color)", color: "var(--danger-color)", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "600" }}>
                  ❌ {deleteOtpError}
                </div>
              )}

              <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                <button
                  type="submit"
                  disabled={deleteOtpLoading || deleteOtpCode.length < 6}
                  className="glass-btn"
                  style={{ flex: 1, padding: "14px", background: "#ef4444", color: "#fff", fontWeight: "800", borderRadius: "12px", fontSize: "0.95rem" }}
                >
                  {deleteOtpLoading ? "جاري التحقق والتنفيذ..." : "🚀 تأكيد وحذف الآن"}
                </button>
                <button
                  type="button"
                  onClick={() => { setDeleteOtpModal({ isOpen: false, url: "", message: "", onSuccess: null }); setDeleteOtpCode(""); setDeleteOtpError(""); }}
                  className="glass-btn"
                  style={{ padding: "14px 20px", background: "rgba(255,255,255,0.06)", color: "var(--text-muted)", fontWeight: "700", borderRadius: "12px" }}
                >
                  إلغاء ✕
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AdminDashboardContext.Provider value={state.dashboardContextValue}>
        <AdminDashboardModals />
      </AdminDashboardContext.Provider>
    </div>
  );
}
