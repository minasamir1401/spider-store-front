"use client";

import React, { useContext } from "react";
import { AdminDashboardContext } from "../AdminDashboardContext";

export default function AdminDashboardModals() {
  const { catModal, serviceModal, editCatModal, editServiceModal, bannerModal, editBannerModal, customerModal, orderModal, codeModal, errorMsg } = useContext(AdminDashboardContext);
  const { showCatModal, setShowCatModal, handleAddCategory, newCatName, setNewCatName, newCatImage, setNewCatImage, catUploadedFile, setCatUploadedFile, newCatFieldsTitle, setNewCatFieldsTitle, newCatFields, handleAddField, handleRemoveField, handleFieldChange, newCatParentId, setNewCatParentId, categories, API_BASE_URL } = catModal;
  const { showServiceModal, setShowServiceModal, handleAddService, newServiceName, setNewServiceName, newServiceDesc, setNewServiceDesc, newServiceCatId, setNewServiceCatId, newServicePrice, setNewServicePrice, newServiceImage, setNewServiceImage, serviceUploadedFile, setServiceUploadedFile, newServicePriceType, setNewServicePriceType, newServicePricePerThousand, setNewServicePricePerThousand, newServiceIsPopular, setNewServiceIsPopular, newServicePackages, handleAddPkgInput, handleRemovePkgInput, handlePkgChange, newServiceFieldsTitle, setNewServiceFieldsTitle, newServiceFields, handleAddCatField, handleRemoveCatField, handleCatFieldChange, newServiceDownloadLink, setNewServiceDownloadLink, newServiceDownloadLinkTitle, setNewServiceDownloadLinkTitle } = serviceModal;
  const { showEditCatModal, setShowEditCatModal, handleEditCategory, editCatName, setEditCatName, editCatImage, setEditCatImage, editCatUploadedFile, setEditCatUploadedFile, editCatFieldsTitle, setEditCatFieldsTitle, editCatFields, handleAddEditCatField, handleRemoveEditCatField, handleEditCatFieldChange, editCatParentId, setEditCatParentId, applyToServices, setApplyToServices, editCatId } = editCatModal;
  const { showEditServiceModal, setShowEditServiceModal, handleEditService, editServiceName, setEditServiceName, editServiceDesc, setEditServiceDesc, editServiceCatId, setEditServiceCatId, editServiceImage, setEditServiceImage, editServiceUploadedFile, setEditServiceUploadedFile, editServicePackages, handleAddEditPkgInput, handleRemoveEditPkgInput, handleEditPkgChange, editServiceFields, handleAddEditField, handleRemoveEditField, handleEditFieldChange, editServicePriceType, setEditServicePriceType, editServicePricePerThousand, setEditServicePricePerThousand, editServiceIsPopular, setEditServiceIsPopular, editServiceFieldsTitle, setEditServiceFieldsTitle, editServiceDownloadLink, setEditServiceDownloadLink, editServiceDownloadLinkTitle, setEditServiceDownloadLinkTitle } = editServiceModal;
  const { showBannerModal, setShowBannerModal, handleAddBanner, newBannerTitle, setNewBannerTitle, newBannerHighlight, setNewBannerHighlight, newBannerDesc, setNewBannerDesc, newBannerBadge, setNewBannerBadge, newBannerColor, setNewBannerColor, newBannerIcon, setNewBannerIcon, bannerUploadedFile, setBannerUploadedFile } = bannerModal;
  const { showEditBannerModal, setShowEditBannerModal, handleEditBanner, editBannerTitle, setEditBannerTitle, editBannerHighlight, setEditBannerHighlight, editBannerDesc, setEditBannerDesc, editBannerBadge, setEditBannerBadge, editBannerColor, setEditBannerColor, editBannerIcon, setEditBannerIcon, editBannerUploadedFile, setEditBannerUploadedFile } = editBannerModal;
  const { showEditCustomerModal, setShowEditCustomerModal, handleUpdateCustomer, editCustomerUsername, setEditCustomerUsername, editCustomerEmail, setEditCustomerEmail, editCustomerPhone, setEditCustomerPhone, editCustomerBalance, setEditCustomerBalance, globalCurrencies, editCustomerBalances, setEditCustomerBalances, editCustomerNewPassword, setEditCustomerNewPassword } = customerModal;
  const { showOrderDetailsModal, setShowOrderDetailsModal, orderDetailsData, baseCurrency, isUnlockerOrder, handleApproveOrder, handleOpenCodeModal, updateOrderStatus, cancelUnlockerOrder } = orderModal;
  const { codeModalOrder, showCodeModal, setShowCodeModal, codeModalStatusToUpdate, codeValue, setCodeValue, orderDownloadLinkValue, setOrderDownloadLinkValue, orderDownloadLinkTitleValue, setOrderDownloadLinkTitleValue, handleSubmitCodeModal, updateOrderCodeAndStatus } = codeModal;
  return (
    <React.Fragment>
      {showCatModal && (
        <div className="premium-overlay" onClick={() => setShowCatModal(false)}>
          <div className="premium-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px", maxHeight: "90vh", overflowY: "auto" }}>
            <div className="premium-modal-header">
              <h3 className="premium-modal-title">إضافة قسم جديد</h3>
              <button className="close-btn-premium" onClick={() => setShowCatModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleAddCategory} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>اسم القسم:</label>
                <input
                  type="text"
                  placeholder="مثال: شحن ألعاب، شحن تطبيقات"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="search-input-premium"
                  style={{ padding: "12px 16px !important" }}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>القسم الرئيسي (اختياري - لجعله قسماً فرعياً):</label>
                <select 
                  value={newCatParentId || ""} 
                  onChange={(e) => setNewCatParentId(e.target.value)}
                  style={{
                    padding: "12px 18px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    background: "rgba(13, 18, 36, 0.7)",
                    color: "#ffffff",
                    fontSize: "0.95rem",
                    outline: "none",
                    width: "100%"
                  }}
                >
                  <option value="">-- قسم رئيسي (بدون قسم أب) --</option>
                  {categories.filter(c => !c.parent_id).map(c => (
                    <option key={c.id} value={c.id}>📁 {c.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>أيقونة القسم التعبيرية (الافتراضية):</label>
                <select 
                  value={newCatImage} 
                  onChange={(e) => setNewCatImage(e.target.value)}
                  style={{
                    padding: "12px 18px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    background: "rgba(13, 18, 36, 0.7)",
                    color: "#ffffff",
                    fontSize: "0.95rem",
                    outline: "none",
                    width: "100%"
                  }}
                >
                  <option value="games">🎮 ألعاب</option>
                  <option value="apps">📱 تطبيقات شات</option>
                  <option value="telecom">📞 أرصدة واتصالات</option>
                  <option value="payment">💳 دفع إلكتروني وبطاقات</option>
                  <option value="software">💻 تفعيل برامج ومفاتيح</option>
                  <option value="accounts">🔑 حسابات واشتراكات</option>
                  <option value="default">📁 مجلد افتراضي</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>أو رفع صورة مخصصة من الجهاز (اختياري - ستحل محل الأيقونة):</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setCatUploadedFile(reader.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    background: "rgba(13, 18, 36, 0.7)",
                    color: "#ffffff",
                    fontSize: "0.95rem",
                    width: "100%"
                  }}
                />
                {catUploadedFile && (
                  <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <img src={catUploadedFile} alt="Preview" style={{ width: "60px", height: "60px", objectFit: "contain", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.1)" }} />
                    <button
                      type="button"
                      onClick={() => setCatUploadedFile(null)}
                      className="action-btn btn-danger-premium"
                      style={{ padding: "4px 8px", fontSize: "0.75rem" }}
                    >
                      حذف الصورة المرفوعة
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group" style={{ marginBottom: "14px" }}>
                <label>عنوان قسم بيانات الخدمة (اختياري - الافتراضي: &quot;بيانات الخدمة&quot;):</label>
                <input
                  type="text"
                  placeholder="مثال: بيانات الخدمة، بيانات لاعب ببجي"
                  value={newCatFieldsTitle}
                  onChange={(e) => setNewCatFieldsTitle(e.target.value)}
                  className="search-input-premium"
                  style={{ padding: "12px 16px !important" }}
                />
              </div>

              {/* Custom Fields Builder for Category */}
              <div style={{ border: "1px solid rgba(255, 255, 255, 0.05)", padding: "18px", borderRadius: "16px", background: "rgba(255, 255, 255, 0.02)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <h4 style={{ fontWeight: 800, fontSize: "0.9rem" }}>حقول البيانات المطلوبة من العميل عند الشراء:</h4>
                  <button 
                    type="button" 
                    onClick={handleAddCatField} 
                    className="action-btn"
                    style={{ background: "rgba(6, 182, 212, 0.2)", color: "#22d3ee", border: "1px solid rgba(6, 182, 212, 0.3)" }}
                  >
                    + إضافة حقل
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {newCatFields.map((f, idx) => (
                    <div key={idx} style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      borderRadius: "12px",
                      padding: "12px",
                      marginBottom: "10px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.82rem", color: "#22d3ee", fontWeight: "800" }}>الحقل المطلوب #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCatField(idx)}
                          style={{ background: "none", border: "none", color: "#f87171", fontSize: "0.82rem", cursor: "pointer", fontWeight: "bold" }}
                        >
                          حذف الحقل ×
                        </button>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "10px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <span style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: "bold" }}>معرّف الحقل (ID):</span>
                          <input
                            type="text"
                            placeholder="معرّف الحقل (ID مثل: player_id)"
                            value={f.id}
                            onChange={(e) => handleCatFieldChange(idx, "id", e.target.value)}
                            required
                          />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <span style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: "bold" }}>اسم الحقل بالعربية:</span>
                          <input
                            type="text"
                            placeholder="اسم الحقل بالعربية"
                            value={f.label}
                            onChange={(e) => handleCatFieldChange(idx, "label", e.target.value)}
                            required
                          />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <span style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: "bold" }}>نص تلميح تلميحي:</span>
                          <input
                            type="text"
                            placeholder="نص تلميح تلميحي"
                            value={f.placeholder || ""}
                            onChange={(e) => handleCatFieldChange(idx, "placeholder", e.target.value)}
                          />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <span style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: "bold" }}>نوع المدخل:</span>
                          <select
                            value={f.type}
                            onChange={(e) => handleCatFieldChange(idx, "type", e.target.value)}
                            style={{
                              padding: "8px 12px",
                              borderRadius: "10px",
                              border: "1px solid rgba(255, 255, 255, 0.06)",
                              background: "rgba(13, 18, 36, 0.7)",
                              color: "#ffffff",
                              fontSize: "0.85rem",
                              width: "100%",
                              boxSizing: "border-box"
                            }}
                          >
                            <option value="text">نص (text)</option>
                            <option value="tel">هاتف (tel)</option>
                            <option value="number">رقم (number)</option>
                            <option value="email">إيميل (email)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {errorMsg && (
                <div style={{ color: "#f87171", fontSize: "0.85rem", fontWeight: "600" }}>
                  ⚠️ {errorMsg}
                </div>
              )}

              <button type="submit" className="btn-add-premium" style={{ width: "100%", padding: "14px" }}>
                حفظ وإضافة القسم
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Service Modal */}
      {showServiceModal && (
        <div className="premium-overlay" onClick={() => setShowServiceModal(false)}>
          <div className="premium-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px", maxHeight: "90vh", overflowY: "auto" }}>
            <div className="premium-modal-header">
              <h3 className="premium-modal-title">إضافة خدمة شحن جديدة</h3>
              <button className="close-btn-premium" onClick={() => setShowServiceModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleAddService} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>القسم الرئيسي:</label>
                <select 
                  value={newServiceCatId} 
                  onChange={(e) => setNewServiceCatId(e.target.value)}
                  style={{
                    padding: "12px 18px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    background: "rgba(13, 18, 36, 0.7)",
                    color: "#ffffff",
                    fontSize: "0.95rem",
                    outline: "none"
                  }}
                >
                  {categories.map(c => {
                    const parent = categories.find(p => p.id === Number(c.parent_id));
                    return (
                      <option key={c.id} value={c.id}>
                        {parent ? `↳ ${parent.name} > ${c.name}` : `📁 ${c.name}`}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>اسم الخدمة:</label>
                <input
                  type="text"
                  placeholder="مثال: ببجي موبايل (PUBG Mobile)"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="search-input-premium"
                  style={{ padding: "12px 16px !important" }}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>وصف الخدمة:</label>
                <textarea
                  placeholder="اكتب وصفاً جذاباً للخدمة للعميل هنا..."
                  rows="3"
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  style={{
                    padding: "12px 18px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    background: "rgba(13, 18, 36, 0.7)",
                    color: "#ffffff",
                    fontSize: "0.95rem",
                    outline: "none"
                  }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>رمز الأيقونة للخدمة (الافتراضية):</label>
                <select 
                  value={newServiceImage} 
                  onChange={(e) => setNewServiceImage(e.target.value)}
                  style={{
                    padding: "12px 18px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    background: "rgba(13, 18, 36, 0.7)",
                    color: "#ffffff",
                    fontSize: "0.95rem",
                    outline: "none",
                    width: "100%"
                  }}
                >
                  <option value="pubg">🔫 ببجي / أسلحة</option>
                  <option value="freefire">🔥 فري فاير / نار</option>
                  <option value="bigo">💬 بيجو لايف / دردشة</option>
                  <option value="vodafone">📱 فودافون / كاش</option>
                  <option value="usdt">🪙 USDT / عملة رقمية</option>
                  <option value="canva">🎨 كانفا / تصميم</option>
                  <option value="netflix">🎬 نتفليكس / أفلام</option>
                  <option value="default">⚡ صاعقة / افتراضي</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>أو رفع صورة مخصصة من الجهاز (اختياري - ستحل محل الأيقونة):</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setServiceUploadedFile(reader.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    background: "rgba(13, 18, 36, 0.7)",
                    color: "#ffffff",
                    fontSize: "0.95rem",
                    width: "100%"
                  }}
                />
                {serviceUploadedFile && (
                  <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <img src={serviceUploadedFile} alt="Preview" style={{ width: "60px", height: "60px", objectFit: "contain", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.1)" }} />
                    <button
                      type="button"
                      onClick={() => setServiceUploadedFile(null)}
                      className="action-btn btn-danger-premium"
                      style={{ padding: "4px 8px", fontSize: "0.75rem" }}
                    >
                      حذف الصورة المرفوعة
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group" style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>نوع التسعير:</label>
                <select
                  value={newServicePriceType}
                  onChange={(e) => setNewServicePriceType(e.target.value)}
                  style={{
                    padding: "16px 20px",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    borderRadius: "14px",
                    border: "2px solid #3b82f6",
                    background: "rgba(13, 18, 36, 0.9)",
                    color: "#ffffff",
                    width: "100%",
                    boxSizing: "border-box",
                    outline: "none"
                  }}
                >
                  <option value="fixed" style={{ color: "#ffffff", background: "#0d1224" }}>📦 باقات (Packages)</option>
                  <option value="dynamic" style={{ color: "#ffffff", background: "#0d1224" }}>⚡ عادي (Normal / SMM)</option>
                  <option value="both" style={{ color: "#ffffff", background: "#0d1224" }}>🔄 الاثنين معاً (باقات وبالكمية)</option>
                </select>
              </div>

              {(newServicePriceType === "dynamic" || newServicePriceType === "both") && (
                <div className="form-group" style={{ marginBottom: "20px" }}>
                  <label>سعر الـ 1000 وحدة ({baseCurrency}):</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="مثال: 50.00"
                    value={newServicePricePerThousand || ""}
                    onChange={(e) => setNewServicePricePerThousand(e.target.value)}
                    className="search-input-premium"
                    style={{ padding: "12px 16px", direction: "ltr" }}
                    required={newServicePriceType === "dynamic" || newServicePriceType === "both"}
                  />
                </div>
              )}

              {(newServicePriceType === "fixed" || newServicePriceType === "both") && (
                /* Package Builder List */
                <div style={{ border: "1px solid rgba(255, 255, 255, 0.05)", padding: "18px", borderRadius: "16px", background: "rgba(255, 255, 255, 0.02)", marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                    <h4 style={{ fontWeight: 800, fontSize: "0.9rem" }}>الباقات المتوفرة (الحزم):</h4>
                    <button 
                      type="button" 
                      onClick={handleAddPkgInput} 
                      className="action-btn"
                      style={{ background: "rgba(139, 92, 246, 0.2)", color: "#c084fc", border: "1px solid rgba(139, 92, 246, 0.3)" }}
                    >
                      + إضافة باقة
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {newServicePackages.map((pkg, idx) => (
                      <div key={idx} style={{
                        background: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                        borderRadius: "12px",
                        padding: "12px",
                        marginBottom: "10px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px"
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "0.82rem", color: "#c084fc", fontWeight: "800" }}>الباقة #{idx + 1}</span>
                          {newServicePackages.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemovePkgInput(idx)}
                              style={{ background: "none", border: "none", color: "#f87171", fontSize: "0.82rem", cursor: "pointer", fontWeight: "bold" }}
                            >
                              حذف الباقة ×
                            </button>
                          )}
                        </div>
                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                          <div style={{ flex: "2 1 180px", display: "flex", flexDirection: "column", gap: "4px" }}>
                            <span style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: "bold" }}>اسم الباقة (مثلاً: 325 شدة):</span>
                            <input
                              type="text"
                              placeholder="اسم الباقة"
                              value={pkg.name}
                              onChange={(e) => handlePkgChange(idx, "name", e.target.value)}
                              required
                            />
                          </div>
                          <div style={{ flex: "1 1 100px", display: "flex", flexDirection: "column", gap: "4px" }}>
                            <span style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: "bold" }}>السعر ({baseCurrency}):</span>
                            <input
                              type="number"
                              step="0.01"
                              placeholder="السعر"
                              value={pkg.price || ""}
                              onChange={(e) => handlePkgChange(idx, "price", e.target.value)}
                              style={{ direction: "ltr" }}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ border: "1px solid rgba(255, 255, 255, 0.05)", padding: "18px", borderRadius: "16px", background: "rgba(255, 255, 255, 0.02)", marginBottom: "20px" }}>
                <h4 style={{ fontWeight: 800, fontSize: "0.9rem", marginBottom: "14px" }}>رابط تحميل الأداة (اختياري):</h4>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <div style={{ flex: "2 1 180px", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: "bold" }}>رابط التحميل (مثال: https://...):</span>
                    <input
                      type="text"
                      placeholder="رابط التحميل"
                      value={newServiceDownloadLink}
                      onChange={(e) => setNewServiceDownloadLink(e.target.value)}
                      style={{
                        padding: "10px 14px",
                        borderRadius: "12px",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        background: "rgba(13, 18, 36, 0.7)",
                        color: "#ffffff",
                        fontSize: "0.95rem",
                        outline: "none"
                      }}
                    />
                  </div>
                  <div style={{ flex: "1 1 100px", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: "bold" }}>عنوان زر التحميل:</span>
                    <input
                      type="text"
                      placeholder="مثال: تحميل الأداة"
                      value={newServiceDownloadLinkTitle}
                      onChange={(e) => setNewServiceDownloadLinkTitle(e.target.value)}
                      style={{
                        padding: "10px 14px",
                        borderRadius: "12px",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        background: "rgba(13, 18, 36, 0.7)",
                        color: "#ffffff",
                        fontSize: "0.95rem",
                        outline: "none"
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: "14px" }}>
                <label>عنوان قسم بيانات الخدمة (اختياري - في حال رغبتك بتخصيصه لهذه الخدمة فقط):</label>
                <input
                  type="text"
                  placeholder="مثال: بيانات الخدمة، بيانات لاعب ببجي"
                  value={newServiceFieldsTitle}
                  onChange={(e) => setNewServiceFieldsTitle(e.target.value)}
                  className="search-input-premium"
                  style={{ padding: "12px 16px !important" }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: "14px", display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <input
                  type="checkbox"
                  id="newServiceIsPopular"
                  checked={newServiceIsPopular}
                  onChange={(e) => setNewServiceIsPopular(e.target.checked)}
                  style={{ width: "20px", height: "20px", accentColor: "#f59e0b", cursor: "pointer" }}
                />
                <label htmlFor="newServiceIsPopular" style={{ cursor: "pointer", fontWeight: "bold", color: "#fcd34d", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>⭐ إضافة إلى قسم "الخدمات الأكثر طلباً" في الصفحة الرئيسية</span>
                </label>
              </div>

              {/* Custom Fields Builder */}
              <div style={{ border: "1px solid rgba(255, 255, 255, 0.05)", padding: "18px", borderRadius: "16px", background: "rgba(255, 255, 255, 0.02)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <h4 style={{ fontWeight: 800, fontSize: "0.9rem" }}>حقول البيانات المطلوبة من العميل:</h4>
                  <button 
                    type="button" 
                    onClick={handleAddField} 
                    className="action-btn"
                    style={{ background: "rgba(6, 182, 212, 0.2)", color: "#22d3ee", border: "1px solid rgba(6, 182, 212, 0.3)" }}
                  >
                    + إضافة حقل
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {newServiceFields.map((f, idx) => (
                    <div key={idx} style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      borderRadius: "12px",
                      padding: "12px",
                      marginBottom: "10px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.82rem", color: "#22d3ee", fontWeight: "800" }}>الحقل المطلوب #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveField(idx)}
                          style={{ background: "none", border: "none", color: "#f87171", fontSize: "0.82rem", cursor: "pointer", fontWeight: "bold" }}
                        >
                          حذف الحقل ×
                        </button>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "10px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <span style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: "bold" }}>معرّف الحقل (ID):</span>
                          <input
                            type="text"
                            placeholder="معرّف الحقل (ID مثل: player_id)"
                            value={f.id}
                            onChange={(e) => handleFieldChange(idx, "id", e.target.value)}
                            required
                          />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <span style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: "bold" }}>اسم الحقل بالعربية:</span>
                          <input
                            type="text"
                            placeholder="اسم الحقل بالعربية"
                            value={f.label}
                            onChange={(e) => handleFieldChange(idx, "label", e.target.value)}
                            required
                          />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <span style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: "bold" }}>نص تلميح تلميحي:</span>
                          <input
                            type="text"
                            placeholder="نص تلميح تلميحي"
                            value={f.placeholder}
                            onChange={(e) => handleFieldChange(idx, "placeholder", e.target.value)}
                          />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <span style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: "bold" }}>نوع المدخل:</span>
                          <select
                            value={f.type}
                            onChange={(e) => handleFieldChange(idx, "type", e.target.value)}
                            style={{
                              padding: "8px 12px",
                              borderRadius: "10px",
                              border: "1px solid rgba(255, 255, 255, 0.06)",
                              background: "rgba(13, 18, 36, 0.7)",
                              color: "#ffffff",
                              fontSize: "0.85rem",
                              width: "100%",
                              boxSizing: "border-box"
                            }}
                          >
                            <option value="text">نص (text)</option>
                            <option value="tel">هاتف (tel)</option>
                            <option value="number">رقم (number)</option>
                            <option value="email">إيميل (email)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {errorMsg && (
                <div style={{ color: "#f87171", fontSize: "0.85rem", fontWeight: "600" }}>
                  ⚠️ {errorMsg}
                </div>
              )}

              <button type="submit" className="btn-add-premium" style={{ width: "100%", padding: "14px" }}>
                حفظ وإضافة الخدمة
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditCatModal && (
        <div className="premium-overlay" onClick={() => setShowEditCatModal(false)}>
          <div className="premium-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px", maxHeight: "90vh", overflowY: "auto" }}>
            <div className="premium-modal-header">
              <h3 className="premium-modal-title">تعديل القسم</h3>
              <button className="close-btn-premium" onClick={() => setShowEditCatModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleEditCategory} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>اسم القسم:</label>
                <input
                  type="text"
                  placeholder="مثال: شحن ألعاب، شحن تطبيقات"
                  value={editCatName}
                  onChange={(e) => setEditCatName(e.target.value)}
                  className="search-input-premium"
                  style={{ padding: "12px 16px !important" }}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>القسم الرئيسي (اختياري - لجعله قسماً فرعياً):</label>
                <select 
                  value={editCatParentId || ""} 
                  onChange={(e) => setEditCatParentId(e.target.value)}
                  style={{
                    padding: "12px 18px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    background: "rgba(13, 18, 36, 0.7)",
                    color: "#ffffff",
                    fontSize: "0.95rem",
                    outline: "none",
                    width: "100%"
                  }}
                >
                  <option value="">-- قسم رئيسي (بدون قسم أب) --</option>
                  {categories.filter(c => !c.parent_id && c.id !== editCatId).map(c => (
                    <option key={c.id} value={c.id}>📁 {c.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>أيقونة القسم التعبيرية (الافتراضية):</label>
                <select 
                  value={editCatImage} 
                  onChange={(e) => setEditCatImage(e.target.value)}
                  style={{
                    padding: "12px 18px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    background: "rgba(13, 18, 36, 0.7)",
                    color: "#ffffff",
                    fontSize: "0.95rem",
                    outline: "none",
                    width: "100%"
                  }}
                >
                  <option value="games">🎮 ألعاب</option>
                  <option value="apps">📱 تطبيقات شات</option>
                  <option value="telecom">📞 أرصدة واتصالات</option>
                  <option value="payment">💳 دفع إلكتروني وبطاقات</option>
                  <option value="software">💻 تفعيل برامج ومفاتيح</option>
                  <option value="accounts">🔑 حسابات واشتراكات</option>
                  <option value="default">📁 مجلد افتراضي</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>أو رفع صورة مخصصة من الجهاز (اختياري - ستحل محل الأيقونة):</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setEditCatUploadedFile(reader.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    background: "rgba(13, 18, 36, 0.7)",
                    color: "#ffffff",
                    fontSize: "0.95rem",
                    width: "100%"
                  }}
                />
                {editCatUploadedFile && (
                  <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <img src={editCatUploadedFile.startsWith("/uploads") ? `${API_BASE_URL}${editCatUploadedFile}` : editCatUploadedFile} alt="Preview" style={{ width: "60px", height: "60px", objectFit: "contain", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.1)" }} />
                    <button
                      type="button"
                      onClick={() => setEditCatUploadedFile(null)}
                      className="action-btn btn-danger-premium"
                      style={{ padding: "4px 8px", fontSize: "0.75rem" }}
                    >
                      حذف الصورة المرفوعة
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group" style={{ marginBottom: "14px" }}>
                <label>عنوان قسم بيانات الخدمة (اختياري - الافتراضي: &quot;بيانات الخدمة&quot;):</label>
                <input
                  type="text"
                  placeholder="مثال: بيانات الخدمة، بيانات لاعب ببجي"
                  value={editCatFieldsTitle}
                  onChange={(e) => setEditCatFieldsTitle(e.target.value)}
                  className="search-input-premium"
                  style={{ padding: "12px 16px !important" }}
                />
              </div>

              {/* Custom Fields Builder for Edit Category */}
              <div style={{ border: "1px solid rgba(255, 255, 255, 0.05)", padding: "18px", borderRadius: "16px", background: "rgba(255, 255, 255, 0.02)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <h4 style={{ fontWeight: 800, fontSize: "0.9rem" }}>حقول البيانات المطلوبة من العميل عند الشراء:</h4>
                  <button 
                    type="button" 
                    onClick={handleAddEditCatField} 
                    className="action-btn"
                    style={{ background: "rgba(6, 182, 212, 0.2)", color: "#22d3ee", border: "1px solid rgba(6, 182, 212, 0.3)" }}
                  >
                    + إضافة حقل
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {editCatFields.map((f, idx) => (
                    <div key={idx} style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      borderRadius: "12px",
                      padding: "12px",
                      marginBottom: "10px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.82rem", color: "#22d3ee", fontWeight: "800" }}>الحقل المطلوب #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveEditCatField(idx)}
                          style={{ background: "none", border: "none", color: "#f87171", fontSize: "0.82rem", cursor: "pointer", fontWeight: "bold" }}
                        >
                          حذف الحقل ×
                        </button>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "10px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <span style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: "bold" }}>معرّف الحقل (ID):</span>
                          <input
                            type="text"
                            placeholder="معرّف الحقل (ID مثل: player_id)"
                            value={f.id}
                            onChange={(e) => handleEditCatFieldChange(idx, "id", e.target.value)}
                            required
                          />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <span style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: "bold" }}>اسم الحقل بالعربية:</span>
                          <input
                            type="text"
                            placeholder="اسم الحقل بالعربية"
                            value={f.label}
                            onChange={(e) => handleEditCatFieldChange(idx, "label", e.target.value)}
                            required
                          />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <span style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: "bold" }}>نص تلميح تلميحي:</span>
                          <input
                            type="text"
                            placeholder="نص تلميح تلميحي"
                            value={f.placeholder || ""}
                            onChange={(e) => handleEditCatFieldChange(idx, "placeholder", e.target.value)}
                          />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <span style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: "bold" }}>نوع المدخل:</span>
                          <select
                            value={f.type}
                            onChange={(e) => handleEditCatFieldChange(idx, "type", e.target.value)}
                            style={{
                              padding: "8px 12px",
                              borderRadius: "10px",
                              border: "1px solid rgba(255, 255, 255, 0.06)",
                              background: "rgba(13, 18, 36, 0.7)",
                              color: "#ffffff",
                              fontSize: "0.85rem",
                              width: "100%",
                              boxSizing: "border-box"
                            }}
                          >
                            <option value="text">نص (text)</option>
                            <option value="tel">هاتف (tel)</option>
                            <option value="number">رقم (number)</option>
                            <option value="email">إيميل (email)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {errorMsg && (
                <div style={{ color: "#f87171", fontSize: "0.85rem", fontWeight: "600" }}>
                  ⚠️ {errorMsg}
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "6px 0 12px 0" }}>
                <input
                  type="checkbox"
                  id="apply_to_services_checkbox"
                  checked={applyToServices}
                  onChange={(e) => setApplyToServices(e.target.checked)}
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                />
                <label htmlFor="apply_to_services_checkbox" style={{ fontSize: "0.85rem", cursor: "pointer", color: "var(--text-muted)", userSelect: "none", textAlign: "right", flex: 1 }}>
                  تطبيق هذه الحقول والعنوان المخصص على جميع الخدمات الحالية في هذا القسم
                </label>
              </div>

              <button type="submit" className="btn-add-premium" style={{ width: "100%", padding: "14px" }}>
                حفظ وتعديل القسم
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {showEditServiceModal && (
        <div
          className="premium-overlay"
          onClick={() => setShowEditServiceModal(false)}
        >
          <div
            className="premium-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "600px", maxHeight: "90vh", overflowY: "auto" }}
          >
            <div className="premium-modal-header">
              <h3 className="premium-modal-title">تعديل الخدمة</h3>
              <button className="close-btn-premium" onClick={() => setShowEditServiceModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleEditService} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>القسم الرئيسي:</label>
                <select 
                  value={editServiceCatId} 
                  onChange={(e) => setEditServiceCatId(e.target.value)}
                  style={{
                    padding: "12px 18px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    background: "rgba(13, 18, 36, 0.7)",
                    color: "#ffffff",
                    fontSize: "0.95rem",
                    outline: "none"
                  }}
                >
                  {categories.map(c => {
                    const parent = categories.find(p => p.id === Number(c.parent_id));
                    return (
                      <option key={c.id} value={c.id}>
                        {parent ? `↳ ${parent.name} > ${c.name}` : `📁 ${c.name}`}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>اسم الخدمة:</label>
                <input
                  type="text"
                  placeholder="مثال: ببجي موبايل (PUBG Mobile)"
                  value={editServiceName}
                  onChange={(e) => setEditServiceName(e.target.value)}
                  className="search-input-premium"
                  style={{ padding: "12px 16px !important" }}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>وصف الخدمة:</label>
                <textarea
                  placeholder="اكتب وصفاً جذاباً للخدمة للعميل هنا..."
                  rows="3"
                  value={editServiceDesc}
                  onChange={(e) => setEditServiceDesc(e.target.value)}
                  style={{
                    padding: "12px 18px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    background: "rgba(13, 18, 36, 0.7)",
                    color: "#ffffff",
                    fontSize: "0.95rem",
                    outline: "none"
                  }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>رمز الأيقونة للخدمة (الافتراضية):</label>
                <select 
                  value={editServiceImage} 
                  onChange={(e) => setEditServiceImage(e.target.value)}
                  style={{
                    padding: "12px 18px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    background: "rgba(13, 18, 36, 0.7)",
                    color: "#ffffff",
                    fontSize: "0.95rem",
                    outline: "none",
                    width: "100%"
                  }}
                >
                  <option value="pubg">🔫 ببجي / أسلحة</option>
                  <option value="freefire">🔥 فري فاير / نار</option>
                  <option value="bigo">💬 بيجو لايف / دردشة</option>
                  <option value="vodafone">📱 فودافون / كاش</option>
                  <option value="usdt">🪙 USDT / عملة رقمية</option>
                  <option value="canva">🎨 كانفا / تصميم</option>
                  <option value="netflix">🎬 نتفليكس / أفلام</option>
                  <option value="default">⚡ صاعقة / افتراضي</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>أو رفع صورة مخصصة من الجهاز (اختياري - ستحل محل الأيقونة):</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setEditServiceUploadedFile(reader.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    background: "rgba(13, 18, 36, 0.7)",
                    color: "#ffffff",
                    fontSize: "0.95rem",
                    width: "100%"
                  }}
                />
                {editServiceUploadedFile && (
                  <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <img src={editServiceUploadedFile.startsWith("/uploads") ? `${API_BASE_URL}${editServiceUploadedFile}` : editServiceUploadedFile} alt="Preview" style={{ width: "60px", height: "60px", objectFit: "contain", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.1)" }} />
                    <button
                      type="button"
                      onClick={() => setEditServiceUploadedFile(null)}
                      className="action-btn btn-danger-premium"
                      style={{ padding: "4px 8px", fontSize: "0.75rem" }}
                    >
                      حذف الصورة المرفوعة
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group" style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>نوع التسعير:</label>
                <select
                  value={editServicePriceType}
                  onChange={(e) => setEditServicePriceType(e.target.value)}
                  style={{
                    padding: "16px 20px",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    borderRadius: "14px",
                    border: "2px solid #3b82f6",
                    background: "rgba(13, 18, 36, 0.9)",
                    color: "#ffffff",
                    width: "100%",
                    boxSizing: "border-box",
                    outline: "none"
                  }}
                >
                  <option value="fixed" style={{ color: "#ffffff", background: "#0d1224" }}>📦 باقات (Packages)</option>
                  <option value="dynamic" style={{ color: "#ffffff", background: "#0d1224" }}>⚡ عادي (Normal / SMM)</option>
                  <option value="both" style={{ color: "#ffffff", background: "#0d1224" }}>🔄 الاثنين معاً (باقات وبالكمية)</option>
                </select>
              </div>

              {(editServicePriceType === "dynamic" || editServicePriceType === "both") && (
                <div className="form-group" style={{ marginBottom: "20px" }}>
                  <label>سعر الـ 1000 وحدة ({baseCurrency}):</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="مثال: 50.00"
                    value={editServicePricePerThousand || ""}
                    onChange={(e) => setEditServicePricePerThousand(e.target.value)}
                    className="search-input-premium"
                    style={{ padding: "12px 16px", direction: "ltr" }}
                    required={editServicePriceType === "dynamic" || editServicePriceType === "both"}
                  />
                </div>
              )}

              {(editServicePriceType === "fixed" || editServicePriceType === "both") && (
                /* Package Builder List */
                <div style={{ border: "1px solid rgba(255, 255, 255, 0.05)", padding: "18px", borderRadius: "16px", background: "rgba(255, 255, 255, 0.02)", marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                    <h4 style={{ fontWeight: 800, fontSize: "0.9rem" }}>الباقات المتوفرة (الحزم):</h4>
                    <button 
                      type="button" 
                      onClick={handleAddEditPkgInput} 
                      className="action-btn"
                      style={{ background: "rgba(139, 92, 246, 0.2)", color: "#c084fc", border: "1px solid rgba(139, 92, 246, 0.3)" }}
                    >
                      + إضافة باقة
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {editServicePackages.map((pkg, idx) => (
                      <div key={idx} style={{
                        background: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                        borderRadius: "12px",
                        padding: "12px",
                        marginBottom: "10px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px"
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "0.82rem", color: "#c084fc", fontWeight: "800" }}>الباقة #{idx + 1}</span>
                          {editServicePackages.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveEditPkgInput(idx)}
                              style={{ background: "none", border: "none", color: "#f87171", fontSize: "0.82rem", cursor: "pointer", fontWeight: "bold" }}
                            >
                              حذف الباقة ×
                            </button>
                          )}
                        </div>
                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
                          <div style={{ flex: "2 1 180px", display: "flex", flexDirection: "column", gap: "4px" }}>
                            <span style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: "bold" }}>اسم الباقة (مثلاً: 325 شدة):</span>
                            <input
                              type="text"
                              placeholder="اسم الباقة"
                              value={pkg.name}
                              onChange={(e) => handleEditPkgChange(idx, "name", e.target.value)}
                              required
                            />
                          </div>
                          <div style={{ flex: "1 1 100px", display: "flex", flexDirection: "column", gap: "4px" }}>
                            <span style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: "bold" }}>السعر ({baseCurrency}):</span>
                            <input
                              type="number"
                              step="0.01"
                              placeholder="السعر"
                              value={pkg.price || ""}
                              onChange={(e) => handleEditPkgChange(idx, "price", e.target.value)}
                              style={{ direction: "ltr" }}
                              required
                            />
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
                          <div style={{ flex: "1 1 100px", display: "flex", flexDirection: "column", gap: "4px" }}>
                            <span style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: "bold" }}>تفعيل الكمية لهذه الباقة:</span>
                            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.85rem", color: "#ffffff", padding: "8px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                              <input
                                type="checkbox"
                                checked={!!pkg.requires_quantity}
                                onChange={(e) => handleEditPkgChange(idx, "requires_quantity", e.target.checked)}
                                style={{ width: "16px", height: "16px", accentColor: "#3b82f6" }}
                              />
                              الباقة تطلب كمية (مثال: سيرفرات)
                            </label>
                          </div>
                          {pkg.requires_quantity && (
                            <>
                              <div style={{ flex: "1 1 80px", display: "flex", flexDirection: "column", gap: "4px" }}>
                                <span style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: "bold" }}>الحد الأدنى:</span>
                                <input
                                  type="number"
                                  min="1"
                                  placeholder="1"
                                  value={pkg.min_quantity || ""}
                                  onChange={(e) => handleEditPkgChange(idx, "min_quantity", parseInt(e.target.value))}
                                  style={{ direction: "ltr" }}
                                />
                              </div>
                              <div style={{ flex: "1 1 80px", display: "flex", flexDirection: "column", gap: "4px" }}>
                                <span style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: "bold" }}>الحد الأقصى (0 = غير محدود):</span>
                                <input
                                  type="number"
                                  min="0"
                                  placeholder="0"
                                  value={pkg.max_quantity || ""}
                                  onChange={(e) => handleEditPkgChange(idx, "max_quantity", parseInt(e.target.value))}
                                  style={{ direction: "ltr" }}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ border: "1px solid rgba(255, 255, 255, 0.05)", padding: "18px", borderRadius: "16px", background: "rgba(255, 255, 255, 0.02)", marginBottom: "20px" }}>
                <h4 style={{ fontWeight: 800, fontSize: "0.9rem", marginBottom: "14px" }}>رابط تحميل الأداة (اختياري):</h4>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <div style={{ flex: "2 1 180px", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: "bold" }}>رابط التحميل (مثال: https://...):</span>
                    <input
                      type="text"
                      placeholder="رابط التحميل"
                      value={editServiceDownloadLink}
                      onChange={(e) => setEditServiceDownloadLink(e.target.value)}
                      style={{
                        padding: "10px 14px",
                        borderRadius: "12px",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        background: "rgba(13, 18, 36, 0.7)",
                        color: "#ffffff",
                        fontSize: "0.95rem",
                        outline: "none"
                      }}
                    />
                  </div>
                  <div style={{ flex: "1 1 100px", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: "bold" }}>عنوان زر التحميل:</span>
                    <input
                      type="text"
                      placeholder="مثال: تحميل الأداة"
                      value={editServiceDownloadLinkTitle}
                      onChange={(e) => setEditServiceDownloadLinkTitle(e.target.value)}
                      style={{
                        padding: "10px 14px",
                        borderRadius: "12px",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        background: "rgba(13, 18, 36, 0.7)",
                        color: "#ffffff",
                        fontSize: "0.95rem",
                        outline: "none"
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: "14px" }}>
                <label>عنوان قسم بيانات الخدمة (اختياري - في حال رغبتك بتخصيصه لهذه الخدمة فقط):</label>
                <input
                  type="text"
                  placeholder="مثال: بيانات الخدمة، بيانات لاعب ببجي"
                  value={editServiceFieldsTitle}
                  onChange={(e) => setEditServiceFieldsTitle(e.target.value)}
                  className="search-input-premium"
                  style={{ padding: "12px 16px !important" }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: "14px", display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <input
                  type="checkbox"
                  id="editServiceIsPopularCheckbox"
                  checked={editServiceIsPopular}
                  onChange={(e) => setEditServiceIsPopular(e.target.checked)}
                  style={{ width: "20px", height: "20px", accentColor: "#f59e0b", cursor: "pointer" }}
                />
                <label htmlFor="editServiceIsPopularCheckbox" style={{ cursor: "pointer", fontWeight: "bold", color: "#fcd34d", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>⭐ إضافة إلى قسم "الخدمات الأكثر طلباً" في الصفحة الرئيسية</span>
                </label>
              </div>

              {/* Custom Fields Builder */}
              <div style={{ border: "1px solid rgba(255, 255, 255, 0.05)", padding: "18px", borderRadius: "16px", background: "rgba(255, 255, 255, 0.02)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <h4 style={{ fontWeight: 800, fontSize: "0.9rem" }}>حقول البيانات المطلوبة من العميل:</h4>
                  <button 
                    type="button" 
                    onClick={handleAddEditField} 
                    className="action-btn"
                    style={{ background: "rgba(6, 182, 212, 0.2)", color: "#22d3ee", border: "1px solid rgba(6, 182, 212, 0.3)" }}
                  >
                    + إضافة حقل
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {editServiceFields.map((f, idx) => (
                    <div key={idx} style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      borderRadius: "12px",
                      padding: "12px",
                      marginBottom: "10px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.82rem", color: "#22d3ee", fontWeight: "800" }}>الحقل المطلوب #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveEditField(idx)}
                          style={{ background: "none", border: "none", color: "#f87171", fontSize: "0.82rem", cursor: "pointer", fontWeight: "bold" }}
                        >
                          حذف الحقل ×
                        </button>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "10px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <span style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: "bold" }}>معرّف الحقل (ID):</span>
                          <input
                            type="text"
                            placeholder="معرّف الحقل (ID مثل: player_id)"
                            value={f.id}
                            onChange={(e) => handleEditFieldChange(idx, "id", e.target.value)}
                            required
                          />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <span style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: "bold" }}>اسم الحقل بالعربية:</span>
                          <input
                            type="text"
                            placeholder="اسم الحقل بالعربية"
                            value={f.label}
                            onChange={(e) => handleEditFieldChange(idx, "label", e.target.value)}
                            required
                          />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <span style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: "bold" }}>نص تلميح تلميحي:</span>
                          <input
                            type="text"
                            placeholder="نص تلميح تلميحي"
                            value={f.placeholder}
                            onChange={(e) => handleEditFieldChange(idx, "placeholder", e.target.value)}
                          />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <span style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: "bold" }}>نوع المدخل:</span>
                          <select
                            value={f.type}
                            onChange={(e) => handleEditFieldChange(idx, "type", e.target.value)}
                            style={{
                              padding: "8px 12px",
                              borderRadius: "10px",
                              border: "1px solid rgba(255, 255, 255, 0.06)",
                              background: "rgba(13, 18, 36, 0.7)",
                              color: "#ffffff",
                              fontSize: "0.85rem",
                              width: "100%",
                              boxSizing: "border-box"
                            }}
                          >
                            <option value="text">نص (text)</option>
                            <option value="tel">هاتف (tel)</option>
                            <option value="number">رقم (number)</option>
                            <option value="email">إيميل (email)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {errorMsg && (
                <div style={{ color: "#f87171", fontSize: "0.85rem", fontWeight: "600" }}>
                  ⚠️ {errorMsg}
                </div>
              )}

              <button type="submit" className="btn-add-premium" style={{ width: "100%", padding: "14px" }}>
                حفظ وتعديل الخدمة
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Banner Modal */}
      {showBannerModal && (
        <div className="premium-overlay" onClick={() => setShowBannerModal(false)}>
          <div className="premium-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px", maxHeight: "90vh", overflowY: "auto" }}>
            <div className="premium-modal-header">
              <h3 className="premium-modal-title">إضافة شريحة إعلانية جديدة</h3>
              <button className="close-btn-premium" onClick={() => setShowBannerModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleAddBanner} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", gap: "14px" }}>
                <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                  <label>العنوان الرئيسي:</label>
                  <input
                    type="text"
                    placeholder="مثال: شدات ببجي موبايل بأقل الأسعار"
                    value={newBannerTitle}
                    onChange={(e) => setNewBannerTitle(e.target.value)}
                    className="search-input-premium"
                    style={{ padding: "10px 14px !important" }}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                  <label>النص المميز (الملون):</label>
                  <input
                    type="text"
                    placeholder="مثال: PUBG Mobile UC"
                    value={newBannerHighlight}
                    onChange={(e) => setNewBannerHighlight(e.target.value)}
                    className="search-input-premium"
                    style={{ padding: "10px 14px !important" }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>الوصف:</label>
                <textarea
                  placeholder="اكتب وصف الشريحة هنا..."
                  rows="2"
                  value={newBannerDesc}
                  onChange={(e) => setNewBannerDesc(e.target.value)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    background: "rgba(13, 18, 36, 0.7)",
                    color: "#ffffff",
                    fontSize: "0.95rem",
                    outline: "none"
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "14px", alignItems: "flex-end" }}>
                <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                  <label>الشارة / التنبيه:</label>
                  <input
                    type="text"
                    placeholder="مثال: عرض خاص"
                    value={newBannerBadge}
                    onChange={(e) => setNewBannerBadge(e.target.value)}
                    className="search-input-premium"
                    style={{ padding: "10px 14px !important" }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0, width: "120px" }}>
                  <label>لون الهوية:</label>
                  <input
                    type="color"
                    value={newBannerColor}
                    onChange={(e) => setNewBannerColor(e.target.value)}
                    style={{
                      padding: "4px",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      background: "rgba(13, 18, 36, 0.7)",
                      width: "100%",
                      height: "40px",
                      cursor: "pointer"
                    }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0, width: "120px" }}>
                  <label>أيقونة تعبيرية:</label>
                  <input
                    type="text"
                    placeholder="مثال: 🎮"
                    value={newBannerIcon}
                    onChange={(e) => setNewBannerIcon(e.target.value)}
                    className="search-input-premium"
                    style={{ padding: "10px 14px !important" }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>أو رفع صورة مخصصة للبانر (اختياري - ستحل محل الأيقونة):</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setBannerUploadedFile(reader.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    background: "rgba(13, 18, 36, 0.7)",
                    color: "#ffffff",
                    fontSize: "0.9rem",
                    width: "100%"
                  }}
                />
                {bannerUploadedFile && (
                  <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <img src={bannerUploadedFile} alt="Preview" style={{ width: "50px", height: "50px", objectFit: "contain", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.1)" }} />
                    <button
                      type="button"
                      onClick={() => setBannerUploadedFile(null)}
                      className="action-btn btn-danger-premium"
                      style={{ padding: "4px 8px", fontSize: "0.75rem" }}
                    >
                      حذف الصورة
                    </button>
                  </div>
                )}
              </div>

              {errorMsg && (
                <div style={{ color: "#f87171", fontSize: "0.85rem", fontWeight: "600" }}>
                  ⚠️ {errorMsg}
                </div>
              )}

              <button type="submit" className="btn-add-premium" style={{ width: "100%", padding: "12px" }}>
                حفظ وإضافة الشريحة
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Banner Modal */}
      {showEditBannerModal && (
        <div className="premium-overlay" onClick={() => setShowEditBannerModal(false)}>
          <div className="premium-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px", maxHeight: "90vh", overflowY: "auto" }}>
            <div className="premium-modal-header">
              <h3 className="premium-modal-title">تعديل الشريحة الإعلانية</h3>
              <button className="close-btn-premium" onClick={() => setShowEditBannerModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleEditBanner} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", gap: "14px" }}>
                <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                  <label>العنوان الرئيسي:</label>
                  <input
                    type="text"
                    placeholder="مثال: شدات ببجي موبايل بأقل الأسعار"
                    value={editBannerTitle}
                    onChange={(e) => setEditBannerTitle(e.target.value)}
                    className="search-input-premium"
                    style={{ padding: "10px 14px !important" }}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                  <label>النص المميز (الملون):</label>
                  <input
                    type="text"
                    placeholder="مثال: PUBG Mobile UC"
                    value={editBannerHighlight}
                    onChange={(e) => setEditBannerHighlight(e.target.value)}
                    className="search-input-premium"
                    style={{ padding: "10px 14px !important" }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>الوصف:</label>
                <textarea
                  placeholder="اكتب وصف الشريحة هنا..."
                  rows="2"
                  value={editBannerDesc}
                  onChange={(e) => setEditBannerDesc(e.target.value)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    background: "rgba(13, 18, 36, 0.7)",
                    color: "#ffffff",
                    fontSize: "0.95rem",
                    outline: "none"
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "14px", alignItems: "flex-end" }}>
                <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                  <label>الشارة / التنبيه:</label>
                  <input
                    type="text"
                    placeholder="مثال: عرض خاص"
                    value={editBannerBadge}
                    onChange={(e) => setEditBannerBadge(e.target.value)}
                    className="search-input-premium"
                    style={{ padding: "10px 14px !important" }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0, width: "120px" }}>
                  <label>لون الهوية:</label>
                  <input
                    type="color"
                    value={editBannerColor}
                    onChange={(e) => setEditBannerColor(e.target.value)}
                    style={{
                      padding: "4px",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      background: "rgba(13, 18, 36, 0.7)",
                      width: "100%",
                      height: "40px",
                      cursor: "pointer"
                    }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0, width: "120px" }}>
                  <label>أيقونة تعبيرية:</label>
                  <input
                    type="text"
                    placeholder="مثال: 🎮"
                    value={editBannerIcon}
                    onChange={(e) => setEditBannerIcon(e.target.value)}
                    className="search-input-premium"
                    style={{ padding: "10px 14px !important" }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>أو رفع صورة مخصصة للبانر (اختياري - ستحل محل الأيقونة):</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setEditBannerUploadedFile(reader.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    background: "rgba(13, 18, 36, 0.7)",
                    color: "#ffffff",
                    fontSize: "0.9rem",
                    width: "100%"
                  }}
                />
                {editBannerUploadedFile && (
                  <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <img src={editBannerUploadedFile.startsWith("/uploads") ? `${API_BASE_URL}${editBannerUploadedFile}` : editBannerUploadedFile} alt="Preview" style={{ width: "50px", height: "50px", objectFit: "contain", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.1)" }} />
                    <button
                      type="button"
                      onClick={() => setEditBannerUploadedFile(null)}
                      className="action-btn btn-danger-premium"
                      style={{ padding: "4px 8px", fontSize: "0.75rem" }}
                    >
                      حذف الصورة
                    </button>
                  </div>
                )}
              </div>

              {errorMsg && (
                <div style={{ color: "#f87171", fontSize: "0.85rem", fontWeight: "600" }}>
                  ⚠️ {errorMsg}
                </div>
              )}

              <button type="submit" className="btn-add-premium" style={{ width: "100%", padding: "12px" }}>
                حفظ التعديلات
              </button>
            </form>
          </div>
        </div>
      )}

      {showEditCustomerModal && (
        <div className="premium-overlay" onClick={() => setShowEditCustomerModal(false)}>
          <div className="premium-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "620px", maxHeight: "90vh", overflowY: "auto" }}>
            <div className="premium-modal-header">
              <h3 className="premium-modal-title">تعديل بيانات العميل</h3>
              <button className="close-btn-premium" onClick={() => setShowEditCustomerModal(false)}>×</button>
            </div>

            <form onSubmit={handleUpdateCustomer} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>اسم المستخدم:</label>
                <input
                  type="text"
                  value={editCustomerUsername}
                  onChange={(e) => setEditCustomerUsername(e.target.value)}
                  className="search-input-premium"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>البريد الإلكتروني:</label>
                <input
                  type="email"
                  value={editCustomerEmail}
                  onChange={(e) => setEditCustomerEmail(e.target.value)}
                  className="search-input-premium"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>رقم الهاتف:</label>
                <input
                  type="tel"
                  value={editCustomerPhone}
                  onChange={(e) => setEditCustomerPhone(e.target.value)}
                  className="search-input-premium"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>الرصيد الحالي ({baseCurrency}):</label>
                <input
                  type="number"
                  step="0.01"
                  value={editCustomerBalance}
                  onChange={(e) => setEditCustomerBalance(e.target.value)}
                  className="search-input-premium"
                  required
                />
              </div>

              <div style={{ marginTop: "16px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "14px" }}>
                <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>أرصدة العملات الإضافية:</label>
                {globalCurrencies.length === 0 ? (
                  <div style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "10px" }}>لا توجد عملات إضافية مضافة في إعدادات الموقع العامة.</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "10px" }}>
                    {globalCurrencies.filter(c => c !== baseCurrency).map((currency) => (
                      <div key={currency} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <span style={{ minWidth: "80px", fontSize: "0.85rem", color: "#cbd5e1", fontWeight: "bold" }}>رصيد {currency}:</span>
                        <input
                          type="number"
                          step="0.01"
                          value={editCustomerBalances[currency] !== undefined ? editCustomerBalances[currency] : 0}
                          onChange={(e) => {
                            const newVal = parseFloat(e.target.value);
                            setEditCustomerBalances(prev => ({
                              ...prev,
                              [currency]: isNaN(newVal) ? 0 : newVal
                            }));
                          }}
                          className="search-input-premium"
                          style={{ flex: 1, padding: "8px 12px" }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>كلمة مرور جديدة (اختياري):</label>
                <input
                  type="text"
                  placeholder="اتركها فارغة إذا لا تريد تغييرها"
                  value={editCustomerNewPassword}
                  onChange={(e) => setEditCustomerNewPassword(e.target.value)}
                  className="search-input-premium"
                />
                <div style={{ marginTop: "8px", fontSize: "0.82rem", color: "#94a3b8" }}>
                  كلمة المرور القديمة لا يمكن إظهارها لأنها محفوظة بشكل مشفّر.
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", flexWrap: "wrap" }}>
                <button type="button" className="action-btn btn-danger-premium" onClick={() => setShowEditCustomerModal(false)}>
                  إلغاء
                </button>
                <button type="submit" className="btn-add-premium">
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderDetailsModal && orderDetailsData && (
        <div className="premium-overlay" onClick={() => setShowOrderDetailsModal(false)}>
          <div className="premium-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "540px", maxHeight: "90vh", overflowY: "auto" }}>
            <div className="premium-modal-header">
              <h3 className="premium-modal-title">📋 تفاصيل الطلب #{orderDetailsData.id}</h3>
              <button className="close-btn-premium" onClick={() => setShowOrderDetailsModal(false)}>×</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {/* Status */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <span className={`premium-badge premium-badge-${orderDetailsData.status}`} style={{ fontSize: "0.9rem", padding: "6px 18px" }}>
                  <span className="badge-dot" />
                  {orderDetailsData.status === "pending" && "قيد الانتظار"}
                  {orderDetailsData.status === "completed" && "مكتمل"}
                  {orderDetailsData.status === "cancelled" && "ملغي"}
                </span>
              </div>

              {/* Details Grid */}
              {[
                { label: "رقم الطلب", value: `#${orderDetailsData.id}`, color: "#38bdf8" },
                { label: "حساب العميل", value: `${orderDetailsData.customer_username || "زائر"}${orderDetailsData.customer_id ? ` (ID: ${orderDetailsData.customer_id})` : ""}`, color: "#fbbf24" },
                { label: "الخدمة", value: orderDetailsData.service_name },
                { label: "التصنيف", value: orderDetailsData.category_name },
                { label: "الباقة", value: `${orderDetailsData.package_name}${orderDetailsData.quantity > 1 ? ` × ${orderDetailsData.quantity}` : ""}` },
                { label: "السعر", value: `${Number(orderDetailsData.package_price || 0).toFixed(2)} ${baseCurrency}`, color: "#34d399" },
                { label: "معرّف الحساب (ID)", value: orderDetailsData.player_id, color: "#c084fc", ltr: true },
                { label: "رقم الهاتف", value: orderDetailsData.phone, ltr: true },
                // Custom fields mapping
                ...(() => {
                  if (!orderDetailsData.custom_fields) return [];
                  try {
                    const parsed = typeof orderDetailsData.custom_fields === 'string' ? JSON.parse(orderDetailsData.custom_fields) : orderDetailsData.custom_fields;
                    return Object.entries(parsed)
                      .map(([key, val]) => ({
                        label: key,
                        value: String(val),
                        color: "#22d3ee"
                      }));
                  } catch {
                    return [];
                  }
                })(),
                { label: "طريقة الدفع", value: orderDetailsData.payment_method === "wallet" ? "المحفظة 💳" : orderDetailsData.payment_method === "transfer" ? `تحويل إلى ${orderDetailsData.transfer_to || ""}` : "غير محدد", color: orderDetailsData.payment_method === "wallet" ? "#34d399" : "#38bdf8" },
                ...(orderDetailsData.payment_method === "transfer" ? [
                  { label: "رقم المحول", value: orderDetailsData.sender_phone || "-", ltr: true },
                  { label: "مبلغ التحويل", value: Number(orderDetailsData.transfer_amount || 0) > 0 ? `${Number(orderDetailsData.transfer_amount).toFixed(2)} ${baseCurrency}` : "-" },
                ] : []),
                { label: "تاريخ الطلب", value: new Date(orderDetailsData.created_at).toLocaleString("ar-EG"), color: "#94a3b8" },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.04)", gap: "12px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.82rem", color: "#64748b", fontWeight: 700, flexShrink: 0 }}>{row.label}</span>
                  <span style={{ fontSize: "0.88rem", fontWeight: 800, color: row.color || "#cbd5e1", direction: row.ltr ? "ltr" : "rtl", textAlign: "left", wordBreak: "break-all" }}>{row.value || "-"}</span>
                </div>
              ))}

              {/* Receipt Image */}
              {orderDetailsData.receipt_image && (
                <a
                  href={`${API_BASE_URL}${orderDetailsData.receipt_image}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-add-premium"
                  style={{ textAlign: "center", textDecoration: "none", display: "block", padding: "10px", borderRadius: "12px", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)", color: "#4ade80", fontWeight: 800 }}
                >
                  📸 عرض إيصال التحويل
                </a>
              )}

              {/* Code */}
              {orderDetailsData.code && (
                <div style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)", borderRadius: "12px", padding: "12px 14px" }}>
                  <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "6px", fontWeight: 700 }}>🔑 كود التفعيل / رسالة الخدمة</div>
                  <div style={{ fontFamily: "monospace", fontSize: "0.95rem", color: "#c084fc", wordBreak: "break-all", whiteSpace: "pre-wrap" }}>{orderDetailsData.code}</div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "flex-end", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "14px" }}>
                {orderDetailsData.status === "pending" && (
                  <>
                    <button
                      onClick={() => { setShowOrderDetailsModal(false); handleApproveOrder(orderDetailsData); }}
                      className="btn-add-premium"
                      style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#34d399" }}
                    >
                      {isUnlockerOrder(orderDetailsData) ? "⚡ اعتماد وإرسال للـAPI" : "✅ تم الشحن"}
                    </button>
                    <button
                      onClick={() => {
                        if (isUnlockerOrder(orderDetailsData) && cancelUnlockerOrder) {
                          cancelUnlockerOrder(orderDetailsData.id);
                        } else {
                          updateOrderStatus(orderDetailsData.id, "cancelled");
                        }
                        setShowOrderDetailsModal(false);
                      }}
                      className="action-btn btn-danger-premium"
                    >
                      ❌ إلغاء
                    </button>
                  </>
                )}
                {orderDetailsData.status === "cancelled" && (
                  <button
                    onClick={async () => {
                      if (confirm("هل تريد إعادة تفعيل هذا الطلب كـ 'قيد الانتظار'؟ سيقوم النظام بخصم قيمة الباقة من رصيد محفظة العميل مجدداً.")) {
                        await updateOrderStatus(orderDetailsData.id, "pending");
                        setShowOrderDetailsModal(false);
                      }
                    }}
                    className="action-btn btn-edit-premium"
                    style={{ background: "rgba(56, 189, 248, 0.15)", border: "1px solid rgba(56, 189, 248, 0.3)", color: "#38bdf8" }}
                  >
                    🔄 إعادة تفعيل الطلب (خصم وتعليق الرصيد)
                  </button>
                )}
                <button
                  onClick={() => { setShowOrderDetailsModal(false); handleOpenCodeModal(orderDetailsData, null); }}
                  className="action-btn btn-edit-premium"
                  style={{ background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.2)", color: "#c084fc" }}
                >
                  🔑 تعديل الكود
                </button>
                <button onClick={() => setShowOrderDetailsModal(false)} className="action-btn btn-edit-premium">
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCodeModal && codeModalOrder && (
        <div className="premium-overlay" onClick={() => setShowCodeModal(false)}>
          <div className="premium-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "500px", maxHeight: "85vh", overflowY: "auto" }}>
            <div className="premium-modal-header">
              <h3 className="premium-modal-title">
                {codeModalStatusToUpdate === "completed" 
                  ? `إتمام التنفيذ وإرسال كود التفعيل للطلب #${codeModalOrder.id}` 
                  : `تعديل كود التفعيل للطلب #${codeModalOrder.id}`}
              </h3>
              <button className="close-btn-premium" onClick={() => setShowCodeModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmitCodeModal} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)", fontSize: "0.85rem", color: "#cbd5e1" }}>
                <div>الخدمة: <strong>{codeModalOrder.service_name}</strong></div>
                <div style={{ marginTop: "4px" }}>الباقة: <strong>{codeModalOrder.package_name}</strong></div>
                <div style={{ marginTop: "4px" }}>معرف الحساب (ID): <strong style={{ color: "#c084fc" }}>{codeModalOrder.player_id}</strong></div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>كود التفعيل أو رسالة الخدمة للعميل:</label>
                <textarea
                  placeholder="أدخل كود التفعيل، كود البطاقة، أو أي رسالة توضيحية للعميل هنا..."
                  rows="4"
                  value={codeValue}
                  onChange={(e) => setCodeValue(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    background: "rgba(13, 18, 36, 0.7)",
                    color: "#ffffff",
                    fontSize: "0.95rem",
                    outline: "none",
                    fontFamily: "monospace"
                  }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>رابط تحميل الأداة أو التطبيق للعميل (اختياري):</label>
                <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                  <input
                    type="text"
                    placeholder="رابط التحميل (مثال: https://...)"
                    value={orderDownloadLinkValue}
                    onChange={(e) => setOrderDownloadLinkValue(e.target.value)}
                    style={{
                      flex: 2,
                      padding: "10px 14px",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      background: "rgba(13, 18, 36, 0.7)",
                      color: "#ffffff",
                      fontSize: "0.95rem",
                      outline: "none"
                    }}
                  />
                  <input
                    type="text"
                    placeholder="عنوان زر التحميل (مثال: تحميل الأداة)"
                    value={orderDownloadLinkTitleValue}
                    onChange={(e) => setOrderDownloadLinkTitleValue(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "10px 14px",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      background: "rgba(13, 18, 36, 0.7)",
                      color: "#ffffff",
                      fontSize: "0.95rem",
                      outline: "none"
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", flexWrap: "wrap" }}>
                <button 
                  type="button" 
                  className="action-btn btn-danger-premium" 
                  onClick={() => setShowCodeModal(false)}
                >
                  إلغاء
                </button>
                
                {codeModalStatusToUpdate === "completed" && (
                  <button 
                    type="button" 
                    className="action-btn btn-edit-premium"
                    style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)" }}
                    onClick={async () => {
                      await updateOrderCodeAndStatus(codeModalOrder.id, "completed", "", orderDownloadLinkValue, orderDownloadLinkTitleValue);
                      setShowCodeModal(false);
                      setCodeModalOrder(null);
                      setCodeValue("");
                      setOrderDownloadLinkValue("");
                      setOrderDownloadLinkTitleValue("");
                    }}
                  >
                    شحن بدون كود
                  </button>
                )}

                <button type="submit" className="btn-add-premium">
                  {codeModalStatusToUpdate === "completed" ? "إتمام التنفيذ وحفظ الكود" : "حفظ الكود"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
