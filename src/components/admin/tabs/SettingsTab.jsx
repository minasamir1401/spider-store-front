import React from "react";

export default function SettingsTab({
  siteName,
  setSiteName,
  baseCurrency,
  setBaseCurrency,
  globalMarkupPercent,
  setGlobalMarkupPercent,
  hideWalletPayment,
  setHideWalletPayment,
  logoUploadedFile,
  setLogoUploadedFile,
  siteLogo,
  setSiteLogo,
  faviconUploadedFile,
  setFaviconUploadedFile,
  siteFavicon,
  setSiteFavicon,
  paymentMethodsList,
  setPaymentMethodsList,
  globalCurrencies,
  setGlobalCurrencies,
  exchangeRates,
  setExchangeRates,
  addCurrencySelect,
  setAddCurrencySelect,
  addCurrencyCustomCode,
  setAddCurrencyCustomCode,
  addCurrencyRate,
  setAddCurrencyRate,
  whatsappNumbers,
  setWhatsappNumbers,
  newWhatsappNumber,
  setNewWhatsappNumber,
  errorMsg,
  handleUpdateSettings,
  handleUpdateCredentials,
  newAdminUsername,
  setNewAdminUsername,
  newAdminPassword,
  setNewAdminPassword,
  showAdminPassword,
  setShowAdminPassword,
  credentialsErrorMsg,
  credentialsSuccessMsg,
  token,
  API_BASE_URL
}) {
  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "30px", width: "100%" }}>
      
      {/* General Settings Card */}
      <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "20px", padding: "30px", backdropFilter: "blur(25px)" }}>
        <h3 style={{ fontWeight: 800, fontSize: "1.25rem", marginBottom: "20px", color: "#38bdf8", display: "flex", alignItems: "center", gap: "8px" }}>
          ⚙️ إعدادات الموقع العامة والعملة الأساسية
        </h3>
        <form onSubmit={handleUpdateSettings} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="form-group">
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#cbd5e1" }}>اسم الموقع بالكامل:</label>
            <input
              type="text"
              className="search-input-premium"
              style={{ padding: "12px 16px !important" }}
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="مثال: عرب تك لخدمات الإلكترونية"
              required
            />
          </div>

          <div className="form-group">
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#cbd5e1" }}>العملة الأساسية للموقع (رمز العملة، مثال: ج.م, USD, EUR):</label>
            <input
              type="text"
              className="search-input-premium"
              style={{ padding: "12px 16px !important" }}
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              placeholder="مثال: ج.م أو USD أو EUR"
              required
            />
          </div>

          <div className="form-group">
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#cbd5e1" }}>📈 نسبة الزيادة العامة على جميع أسعار الخدمات (%):</label>
            <input
              type="number"
              className="search-input-premium"
              style={{ padding: "12px 16px !important" }}
              value={globalMarkupPercent}
              onChange={(e) => setGlobalMarkupPercent(parseFloat(e.target.value) || 0)}
              placeholder="مثال: 10 للزيادة بنسبة 10% (0 للتعطيل)"
              step="0.1"
            />
          </div>

          <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px", background: "rgba(16, 185, 129, 0.05)", padding: "12px", borderRadius: "10px", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
            <input
              type="checkbox"
              id="hide-wallet-payment-checkbox"
              checked={hideWalletPayment}
              onChange={(e) => setHideWalletPayment(e.target.checked)}
              style={{ width: "20px", height: "20px", cursor: "pointer" }}
            />
            <label htmlFor="hide-wallet-payment-checkbox" style={{ fontWeight: "bold", color: "#cbd5e1", cursor: "pointer", fontSize: "0.85rem", userSelect: "none" }}>
              💳 إخفاء طرق التحويل اليدوي عند شراء الخدمات (إجبار العملاء على الدفع من المحفظة الرقمية فقط)
            </label>
          </div>

          <div className="form-group">
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#cbd5e1" }}>شعار (لجو) الموقع:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setLogoUploadedFile(reader.result);
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
            {(logoUploadedFile || (siteLogo && siteLogo !== "default")) && (
              <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                <img 
                  src={logoUploadedFile || (siteLogo.startsWith("/uploads") ? `${API_BASE_URL}${siteLogo}` : siteLogo)} 
                  alt="Logo Preview" 
                  style={{ width: "60px", height: "60px", objectFit: "contain", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.1)" }} 
                />
                <button
                  type="button"
                  onClick={() => {
                    setSiteLogo("default");
                    setLogoUploadedFile(null);
                  }}
                  className="action-btn btn-danger-premium"
                  style={{ padding: "4px 8px", fontSize: "0.75rem" }}
                >
                  إعادة الشعار الافتراضي
                </button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#cbd5e1" }}>أيقونة التبويب (Favicon):</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setFaviconUploadedFile(reader.result);
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
            {(faviconUploadedFile || (siteFavicon && siteFavicon !== "default")) && (
              <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                <img 
                  src={faviconUploadedFile || (siteFavicon.startsWith("/uploads") ? `${API_BASE_URL}${siteFavicon}` : siteFavicon)} 
                  alt="Favicon Preview" 
                  style={{ width: "32px", height: "32px", objectFit: "contain", borderRadius: "4px", border: "1px solid rgba(255, 255, 255, 0.1)" }} 
                />
                <button
                  type="button"
                  onClick={() => {
                    setSiteFavicon("default");
                    setFaviconUploadedFile(null);
                  }}
                  className="action-btn btn-danger-premium"
                  style={{ padding: "4px 8px", fontSize: "0.75rem" }}
                >
                  إعادة الأيقونة الافتراضية
                </button>
              </div>
            )}
          </div>

          <hr style={{ opacity: 0.1, margin: "10px 0" }} />

          {/* Transfer & Payment Methods */}
          <div style={{ border: "1px solid rgba(255, 255, 255, 0.05)", padding: "18px", borderRadius: "16px", background: "rgba(255, 255, 255, 0.02)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h4 style={{ fontWeight: 800, fontSize: "0.95rem", color: "#cbd5e1" }}>إدارة طرق التحويل والتحصيل:</h4>
              <button
                type="button"
                onClick={() => {
                  setPaymentMethodsList(prev => [
                    ...prev,
                    { id: `pay_${Date.now()}`, name: "", value: "", description: "" }
                  ]);
                }}
                className="action-btn"
                style={{ background: "rgba(6, 182, 212, 0.2)", color: "#22d3ee", border: "1px solid rgba(6, 182, 212, 0.3)" }}
              >
                + إضافة طريقة دفع
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {paymentMethodsList.length === 0 ? (
                <div style={{ fontSize: "0.8rem", color: "#94a3b8", textAlign: "center", padding: "10px" }}>لا توجد طرق دفع مضافة حالياً.</div>
              ) : (
                paymentMethodsList.map((pm, idx) => (
                  <div key={pm.id} style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "12px", padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.82rem", color: "#22d3ee", fontWeight: 800 }}>طريقة الدفع #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMethodsList(prev => prev.filter(item => item.id !== pm.id));
                        }}
                        style={{ background: "none", border: "none", color: "#f87171", fontSize: "0.82rem", cursor: "pointer", fontWeight: "bold" }}
                      >
                        حذف ×
                      </button>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <span style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: "bold" }}>اسم الطريقة (مثلاً: إنستاباي):</span>
                        <input
                          type="text"
                          value={pm.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPaymentMethodsList(prev => prev.map(item => item.id === pm.id ? { ...item, name: val } : item));
                          }}
                          placeholder="مثال: محفظة فودافون كاش أو إنستاباي"
                          required
                          style={{ padding: "8px 12px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(13, 18, 36, 0.7)", color: "#ffffff", fontSize: "0.85rem", outline: "none" }}
                        />
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <span style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: "bold" }}>الرقم أو العنوان للتحويل إليه:</span>
                        <input
                          type="text"
                          value={pm.value}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPaymentMethodsList(prev => prev.map(item => item.id === pm.id ? { ...item, value: val } : item));
                          }}
                          placeholder="مثال: 01026785879 أو example@instapay"
                          required
                          style={{ padding: "8px 12px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(13, 18, 36, 0.7)", color: "#ffffff", fontSize: "0.85rem", outline: "none" }}
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <span style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: "bold" }}>وصف / تعليمات التحويل للعميل:</span>
                        <textarea
                          value={pm.description}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPaymentMethodsList(prev => prev.map(item => item.id === pm.id ? { ...item, description: val } : item));
                          }}
                          placeholder="مثال: بعد التحويل اكتب الرقم المحول منه للتحقق..."
                          rows="2"
                          required
                          style={{ padding: "8px 12px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(13, 18, 36, 0.7)", color: "#ffffff", fontSize: "0.85rem", outline: "none" }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="form-group" style={{ border: "1px solid rgba(255, 255, 255, 0.05)", padding: "18px", borderRadius: "16px", background: "rgba(255, 255, 255, 0.02)", marginTop: "10px" }}>
            <label style={{ display: "block", marginBottom: "12px", fontWeight: "bold", color: "#cbd5e1" }}>تهيئة أسعار صرف العملات الإضافية (سعر 1 وحدة من العملة الإضافية مقابل الـ {baseCurrency}):</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "14px" }}>
              {globalCurrencies.map((currency) => (
                <div key={currency} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <span style={{ minWidth: "120px", fontSize: "0.85rem", color: "#cbd5e1" }}>1 {currency} =</span>
                  <input
                    type="number"
                    step="0.000001"
                    placeholder="مثال: 50"
                    value={exchangeRates[currency] !== undefined ? exchangeRates[currency] : 50}
                    onChange={(e) => {
                      const rate = parseFloat(e.target.value) || 0;
                      setExchangeRates(prev => ({ ...prev, [currency]: rate }));
                    }}
                    className="search-input-premium"
                    style={{ flex: 1, padding: "8px 12px" }}
                  />
                  <span style={{ fontSize: "0.85rem", color: "#60a5fa", fontWeight: "bold", minWidth: "50px" }}>{baseCurrency}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setGlobalCurrencies(prev => prev.filter(c => c !== currency));
                      const updatedRates = { ...exchangeRates };
                      delete updatedRates[currency];
                      setExchangeRates(updatedRates);
                    }}
                    className="action-btn btn-danger-premium"
                    style={{ padding: "8px 12px" }}
                  >
                    حذف
                  </button>
                </div>
              ))}
            </div>
            
            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", width: "100%" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
                <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "bold" }}>اختر العملة:</span>
                <select
                  value={addCurrencySelect}
                  onChange={(e) => setAddCurrencySelect(e.target.value)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(13, 18, 36, 0.7)",
                    color: "#ffffff",
                    fontSize: "0.88rem",
                    outline: "none",
                    width: "100%"
                  }}
                >
                  <option value="USD">USD (الدولار الأمريكي)</option>
                  <option value="USDT">USDT (الدولار الرقمي)</option>
                  <option value="EUR">EUR (اليورو)</option>
                  <option value="TRY">TRY (الليرة التركية)</option>
                  <option value="SAR">SAR (الريال السعودي)</option>
                  <option value="AED">AED (الدرهم الإماراتي)</option>
                  <option value="EGP">EGP (الجنيه المصري)</option>
                  <option value="KWD">KWD (الدينار الكويتي)</option>
                  <option value="QAR">QAR (الريال قطر)</option>
                  <option value="BHD">BHD (الدينار البحريني)</option>
                  <option value="OMR">OMR (الريال العماني)</option>
                  {globalCurrencies.filter(curr => !["USD", "USDT", "EUR", "TRY", "SAR", "AED", "EGP", "KWD", "QAR", "BHD", "OMR"].includes(curr)).map(curr => (
                    <option key={curr} value={curr}>{curr} (عملة مضافة)</option>
                  ))}
                  <option value="CUSTOM">أخرى (كتابة يدوية)</option>
                </select>
              </div>

              {addCurrencySelect === "CUSTOM" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
                  <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "bold" }}>رمز العملة المخصص:</span>
                  <input
                    type="text"
                    value={addCurrencyCustomCode}
                    onChange={(e) => setAddCurrencyCustomCode(e.target.value.trim().toUpperCase())}
                    placeholder="مثال: GBP"
                    className="search-input-premium"
                    style={{ padding: "8px 12px" }}
                  />
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 2 }}>
                <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "bold" }}>سعر العملة الإضافية مقابل الـ {baseCurrency} (مثال: 1 دولار = 50 ج.م):</span>
                <input
                  type="number"
                  step="0.000001"
                  value={addCurrencyRate}
                  onChange={(e) => setAddCurrencyRate(e.target.value)}
                  placeholder="مثال: 50"
                  className="search-input-premium"
                  style={{ padding: "8px 12px" }}
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  const code = addCurrencySelect === "CUSTOM" ? addCurrencyCustomCode : addCurrencySelect;
                  const rate = parseFloat(addCurrencyRate) || 0;
                  if (code && rate > 0) {
                    if (globalCurrencies.includes(code)) {
                      alert("العملة مضافة بالفعل!");
                      return;
                    }
                    setGlobalCurrencies(prev => [...prev, code]);
                    setExchangeRates(prev => ({ ...prev, [code]: rate }));
                    setAddCurrencyCustomCode("");
                    setAddCurrencyRate("");
                  } else {
                    alert("يرجى إدخال رمز عملة وسعر صرف صحيح (أكبر من 0)!");
                  }
                }}
                className="btn-add-premium"
                style={{ padding: "10px 16px", fontSize: "0.85rem", whiteSpace: "nowrap", alignSelf: "flex-end", height: "42px" }}
              >
                + إضافة العملة
              </button>
            </div>
          </div>

          {/* WhatsApp Notification Numbers */}
          <div className="form-group" style={{ border: "1px solid rgba(37,211,102,0.18)", padding: "18px", borderRadius: "16px", background: "rgba(37,211,102,0.03)", marginTop: "10px" }}>
            <label style={{ display: "block", marginBottom: "12px", fontWeight: "bold", color: "#cbd5e1" }}>
              💬 أرقام واتساب لاستقبال طلبات شحن المحفظة (بالصيغة الدولية مثل: 201012345678):
            </label>

            {/* Existing numbers */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
              {whatsappNumbers.length === 0 && (
                <div style={{ color: "#64748b", fontSize: "0.85rem", textAlign: "center", padding: "10px" }}>
                  لا توجد أرقام مضافة بعد
                </div>
              )}
              {whatsappNumbers.map((num, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.03)", padding: "10px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontSize: "1.2rem" }}>💬</span>
                  <span style={{ flex: 1, fontFamily: "monospace", color: "#34d399", fontWeight: "bold" }}>{num}</span>
                  <a href={`https://wa.me/${num}`} target="_blank" rel="noopener noreferrer" style={{ color: "#60a5fa", fontSize: "0.78rem", textDecoration: "none" }}>
                    اختبار
                  </a>
                  <button
                    type="button"
                    onClick={() => setWhatsappNumbers(prev => prev.filter((_, idx) => idx !== i))}
                    className="action-btn btn-danger-premium"
                    style={{ padding: "4px 10px" }}
                  >
                    حذف
                  </button>
                </div>
              ))}
            </div>

            {/* Add new number */}
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input
                type="tel"
                value={newWhatsappNumber}
                onChange={(e) => setNewWhatsappNumber(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="مثال: 201012345678"
                className="search-input-premium"
                style={{ flex: 1, padding: "10px 14px", direction: "ltr" }}
              />
              <button
                type="button"
                onClick={() => {
                  const clean = newWhatsappNumber.replace(/[^0-9]/g, "");
                  if (clean.length < 8) { alert("يرجى إدخال رقم صحيح بالصيغة الدولية"); return; }
                  if (whatsappNumbers.includes(clean)) { alert("الرقم مضاف بالفعل!"); return; }
                  setWhatsappNumbers(prev => [...prev, clean]);
                  setNewWhatsappNumber("");
                }}
                className="btn-add-premium"
                style={{ padding: "10px 16px", whiteSpace: "nowrap" }}
              >
                + إضافة
              </button>
            </div>
            <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "8px" }}>
              ⚠️ اكتب الرقم بالصيغة الدولية بدون + (مثال: 201012345678 للمصري، 966501234567 للسعودي)
            </div>
          </div>

          {errorMsg && (
            <div style={{ color: "#f87171", fontSize: "0.85rem", fontWeight: "600" }}>
              ⚠️ {errorMsg}
            </div>
          )}

          <button type="submit" className="btn-add-premium" style={{ width: "100%", padding: "14px", marginTop: "10px" }}>
            حفظ التغييرات وإعادة التحميل
          </button>
        </form>
      </div>

      {/* Change Credentials Card */}
      <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "20px", padding: "30px", backdropFilter: "blur(25px)" }}>
        <h3 style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: "15px", color: "#ffffff" }}>🔐 تغيير بيانات تسجيل دخول لوحة التحكم</h3>
        <form onSubmit={handleUpdateCredentials} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="form-group">
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold", color: "#cbd5e1", fontSize: "0.85rem" }}>اسم المستخدم المسؤول الجديد:</label>
            <input
              type="text"
              className="search-input-premium"
              value={newAdminUsername}
              onChange={(e) => setNewAdminUsername(e.target.value)}
              placeholder="مثال: admin"
              required
              style={{ padding: "10px 14px !important", fontSize: "0.9rem !important" }}
            />
          </div>
          
          <div className="form-group" style={{ position: "relative" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold", color: "#cbd5e1", fontSize: "0.85rem" }}>كلمة المرور الجديدة (أتركها فارغة إذا لم ترغب بتغييرها):</label>
            <div style={{ position: "relative" }}>
              <input
                type={showAdminPassword ? "text" : "password"}
                className="search-input-premium"
                value={newAdminPassword}
                onChange={(e) => setNewAdminPassword(e.target.value)}
                placeholder="كلمة مرور جديدة (الحد الأدنى 6 أحرف)"
                style={{ padding: "10px 45px 10px 14px !important", fontSize: "0.9rem !important", width: "100%" }}
              />
              <button
                type="button"
                onClick={() => setShowAdminPassword(!showAdminPassword)}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                  fontSize: "0.95rem",
                  zIndex: 10,
                  userSelect: "none"
                }}
                title={showAdminPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                {showAdminPassword ? "👀" : "👁️"}
              </button>
            </div>
          </div>

          {credentialsErrorMsg && (
            <div style={{ color: "#f87171", fontSize: "0.82rem", fontWeight: "600" }}>
              ⚠️ {credentialsErrorMsg}
            </div>
          )}

          {credentialsSuccessMsg && (
            <div style={{ color: "#34d399", fontSize: "0.82rem", fontWeight: "600" }}>
              ✓ {credentialsSuccessMsg}
            </div>
          )}

          <button type="submit" className="action-btn btn-success-premium" style={{ width: "100%", padding: "12px", justifyContent: "center", borderRadius: "10px", fontSize: "0.9rem" }}>
            تحديث بيانات تسجيل الدخول
          </button>
        </form>
      </div>

      {/* Storage Clean Up Card */}
      <div style={{ border: "1px solid rgba(239, 68, 68, 0.15)", padding: "30px", borderRadius: "20px", background: "rgba(239, 68, 68, 0.02)", backdropFilter: "blur(25px)" }}>
        <h3 style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: "8px", color: "#f87171" }}>🗑️ تفريغ مساحة السيرفر (صور إيصالات التحويل)</h3>
        <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "15px", lineHeight: "1.5" }}>
          يمكنك حذف كافة صور التحويلات واللقطات المرفوعة من العملاء لتوفير مساحة على السيرفر (الحد الأقصى المسموح به هو 1 جيجابايت).
        </p>
        <button 
          type="button" 
          onClick={async () => {
            if (!confirm("هل أنت متأكد من حذف كافة صور إيصالات التحويل من السيرفر نهائياً؟ لا يمكن التراجع عن هذا الإجراء.")) return;
            try {
              const res = await fetch(`${API_BASE_URL}/api/orders/receipts/clear`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
              });
              const data = await res.json();
              alert(data.message || "تم تفريغ كافة صور الإيصالات بنجاح.");
            } catch (err) {
              alert("حدث خطأ أثناء تفريغ صور الإيصالات.");
            }
          }}
          className="action-btn btn-danger-premium" 
          style={{ width: "100%", padding: "12px", justifyContent: "center", borderRadius: "10px", fontSize: "0.9rem", fontWeight: "bold" }}
        >
          حذف كافة إيصالات التحويل من السيرفر
        </button>
      </div>
    </div>
  );
}
