"use client";

import React, { useState, useEffect, use, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/config";

export default function ServiceDetail({ params }) {
  const unwrappedParams = use(params);
  const serviceId = unwrappedParams.id;
  const router = useRouter();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [customQuantity, setCustomQuantity] = useState(1000);
  const [copied, setCopied] = useState(false);
  const [customerPricingMode, setCustomerPricingMode] = useState("packages");

  // Form state - dynamic fields
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [senderPhone, setSenderPhone] = useState("");
  const transferNumber = "01026785879";

  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
  const [customerUser, setCustomerUser] = useState(null);
  const [theme, setTheme] = useState("dark");

  const [validatingId, setValidatingId] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [validationError, setValidationError] = useState("");

  const handleValidatePlayerId = async (playerId) => {
    if (!playerId || !playerId.trim()) {
      setValidationError("???? ????? ???? ?????? ?????.");
      setValidationResult(null);
      return;
    }

    setValidatingId(true);
    setValidationError("");
    setValidationResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          game: service.name,
          userId: playerId.trim()
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "??? ?????? ?? ???? ??????.");
      }

      setValidationResult(data);
    } catch (err) {
      setValidationError(err.message || "??? ?????? ?? ???? ??????. ???? ?????? ?? ????? ????????? ??????.");
    } finally {
      setValidatingId(false);
    }
  };

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    // Theme sync
    if (typeof window !== "undefined") {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
      setTheme(currentTheme);
    }

    const token = localStorage.getItem("customer_token");
    const userStr = localStorage.getItem("customer_user");
    if (token && userStr) {
      setIsCustomerLoggedIn(true);
      setCustomerUser(JSON.parse(userStr));
      setPaymentMethod("wallet");
    } else {
      setPaymentMethod("transfer");
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  const handleCustomerLogout = () => {
    localStorage.removeItem("customer_token");
    localStorage.removeItem("customer_user");
    setIsCustomerLoggedIn(false);
    setCustomerUser(null);
  };

  // Backup static services if backend is unreachable
  const staticServices = [
    {
      id: 1,
      name: "???? ?????? (PUBG Mobile)",
      description: "???? ???? ???? ?????? ????? ??????? ?? ????? ?? ???? ?????? ID ????? ???????.",
      price: 0.99,
      image: "pubg",
      packages: [
        { id: 1, name: "60 ??? (UC)", price: 0.99 },
        { id: 2, name: "325 ??? (UC)", price: 4.85 },
        { id: 3, name: "660 ??? (UC)", price: 9.50 },
        { id: 4, name: "1800 ??? (UC)", price: 23.99 }
      ]
    },
    {
      id: 2,
      name: "??? ???? (Free Fire)",
      description: "???? ????? ??? ???? ????? ?????? ?????? ??? ??????? ??? ???? ????? ?????? ??? ??????.",
      price: 1.10,
      image: "freefire",
      packages: [
        { id: 1, name: "110 ?????", price: 1.10 },
        { id: 2, name: "231 ?????", price: 2.20 },
        { id: 3, name: "583 ?????", price: 5.30 },
        { id: 4, name: "1188 ?????", price: 10.50 }
      ]
    },
    {
      id: 3,
      name: "???? ???? (Bigo Live)",
      description: "???? ??????? ???????? ????? ???? ???? ???? ???? ??????? ?????? ????.",
      price: 1.25,
      image: "bigo",
      packages: [
        { id: 1, name: "42 ?????", price: 1.25 },
        { id: 2, name: "297 ?????", price: 7.99 },
        { id: 3, name: "848 ?????", price: 22.50 }
      ]
    },
    {
      id: 4,
      name: "??????? ??? ??? (Vodafone Cash)",
      description: "??? ???? ?????? ????? ??? ????? ??????? ??? ?????? ???? ????? ???????.",
      price: 1.00,
      image: "vodafone",
      packages: [
        { id: 1, name: "????? 100 ???? ????", price: 2.10 },
        { id: 2, name: "????? 500 ???? ????", price: 10.50 },
        { id: 3, name: "????? 1000 ???? ????", price: 21.00 }
      ]
    },
    {
      id: 5,
      name: "??? ???? USDT (TRC20)",
      description: "???? ???? ???? USDT ??????? ????? ????? ????? ?????? ????? ??????.",
      price: 1.00,
      image: "usdt",
      packages: [
        { id: 1, name: "10 USDT", price: 10.30 },
        { id: 2, name: "50 USDT", price: 51.50 },
        { id: 3, name: "100 USDT", price: 102.50 }
      ]
    },
    {
      id: 6,
      name: "?????? ????? ??? (Canva Pro)",
      description: "????? ?????? ????? ??? ?????? ?????? ????? ????? ??????? ??????? ?????????.",
      price: 1.99,
      image: "canva",
      packages: [
        { id: 1, name: "????? ???? ???", price: 1.99 },
        { id: 2, name: "????? ???? 6 ????", price: 8.99 },
        { id: 3, name: "????? ???? ??? ?????", price: 14.99 }
      ]
    },
    {
      id: 7,
      name: "?????? ??????? (Netflix Premium)",
      description: "???? ???? ?? ????? 4K UHD ??? ???? ??????? ????? ?? ???? ????? ???????.",
      price: 2.50,
      image: "netflix",
      packages: [
        { id: 1, name: "???? ????? ???? ??? 4K", price: 2.50 },
        { id: 2, name: "???? ???? ????? ???? ???", price: 9.99 }
      ]
    }
  ];

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/services/${serviceId}`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setService(data);
        if (data.packages && data.packages.length > 0) {
          setSelectedPackage(data.packages[0]);
        }
        if (data.price_type === "dynamic") {
          setCustomerPricingMode("dynamic");
        } else {
          setCustomerPricingMode("packages");
        }
        setLoading(false);
      })
      .catch(() => {
        const fallback = staticServices.find(s => s.id === Number(serviceId));
        if (fallback) {
          setService(fallback);
          if (fallback.packages && fallback.packages.length > 0) {
            setSelectedPackage(fallback.packages[0]);
          }
          if (fallback.price_type === "dynamic") {
            setCustomerPricingMode("dynamic");
          } else {
            setCustomerPricingMode("packages");
          }
        }
        setLoading(false);
      });
  }, [serviceId]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Parse dynamic fields from service
  const serviceFields = useMemo(() => {
    if (!service) return [];
    if (Array.isArray(service.fields)) return service.fields;
    if (typeof service.fields === 'string') {
      try { return JSON.parse(service.fields); } catch { return []; }
    }
    return [];
  }, [service]);

  // Fallback fields if none configured
  const defaultFields = [
    { name: "player_id", label: "????? ?????? / ???? ????? (Player ID / Email)", type: "text", placeholder: "???? ????? ?????? ???? ??? (????: 512495910)", required: true },
    { name: "phone", label: "??? ?????? ??????? ?????? ????? (??????)", type: "tel", placeholder: "????: 01023456789 ?? +96651234567", required: true }
  ];

  const activeFields = useMemo(() => {
    const raw = serviceFields.length > 0 ? serviceFields : defaultFields;
    return raw.map(f => ({
      ...f,
      name: f.name || f.id
    }));
  }, [serviceFields, defaultFields]);

  const handleFieldChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    if (fieldName === "player_id") {
      setValidationResult(null);
      setValidationError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const isDynamic = service.price_type === "dynamic" || (service.price_type === "both" && customerPricingMode === "dynamic");

    if (!isDynamic && !selectedPackage) {
      setErrorMessage("?? ???? ??? ???? ????? ????????.");
      return;
    }

    if (isDynamic && (!customQuantity || customQuantity < 100)) {
      setErrorMessage("?? ???? ???? ???? ????? (???? ?????? 100).");
      return;
    }

    if (paymentMethod === "wallet" && !isCustomerLoggedIn) {
      setErrorMessage("??? ????? ?????? ???????? ??????? ?? ?????.");
      return;
    }

    if (paymentMethod === "transfer" && !senderPhone.trim()) {
      setErrorMessage("???? ????? ????? ???? ?? ??????? ???.");
      return;
    }

    // Validate required fields
    for (const field of activeFields) {
      if (field.required !== false && (!formData[field.name] || !formData[field.name].toString().trim())) {
        setErrorMessage(`??? "${field.label}" ?????.`);
        return;
      }
    }

    setSubmitting(true);

    const computedPrice = isDynamic
      ? Number(((customQuantity / 1000) * (service.price_per_thousand || 0)).toFixed(2))
      : Number(Number(selectedPackage.price || 0).toFixed(2));
    const computedPackageName = isDynamic
      ? `????: ${customQuantity}`
      : selectedPackage.name;

    try {
      const headers = {
        "Content-Type": "application/json"
      };

      const token = localStorage.getItem("customer_token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          service_id: service.id,
          player_id: formData.player_id || formData[activeFields[0]?.name] || "",
          phone: formData.phone || "",
          package_name: computedPackageName,
          package_price: computedPrice,
          payment_method: paymentMethod,
          sender_phone: senderPhone,
          transfer_to: transferNumber,
          custom_fields: formData,
          quantity: isDynamic ? customQuantity : 1
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "??? ????? ?????? ?????? ???????? ??????.");
      }

      if (typeof data.customer_balance === "number") {
        try {
          const currentUserStr = localStorage.getItem("customer_user");
          if (currentUserStr) {
            const currentUser = JSON.parse(currentUserStr);
            const updatedUser = { ...currentUser, balance: data.customer_balance };
            localStorage.setItem("customer_user", JSON.stringify(updatedUser));
            setCustomerUser(updatedUser);
          }
        } catch {
          // Ignore local storage sync issues; balance already updated on the server.
        }
      }

      setSuccessData(data);
    } catch (err) {
      setErrorMessage(err.message || "??? ??? ??? ?????? ???? ???????? ??????.");
    } finally {
      setSubmitting(false);
    }
  };

  const getServiceIcon = (image) => {
    if (!image) return "?";
    if (image.startsWith("data:image") || image.startsWith("http") || image.startsWith("/uploads")) {
      const src = image.startsWith("/uploads") ? `${API_BASE_URL}${image}` : image;
      return <img src={src} alt="Service Icon" style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "inherit" }} />;
    }
    if (image.includes("pubg")) return "??";
    if (image.includes("freefire")) return "??";
    if (image.includes("bigo")) return "??";
    if (image.includes("vodafone")) return "??";
    if (image.includes("usdt")) return "??";
    if (image.includes("canva")) return "??";
    if (image.includes("netflix")) return "??";
    return "?";
  };

  const [drawerOpen, setDrawerOpen] = useState(false);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px" }}>
        <h2 style={{ fontWeight: 800 }}>???? ????? ?????? ??????...</h2>
      </div>
    );
  }

  if (!service) {
    return (
      <div style={{ textAlign: "center", padding: "80px" }}>
        <h2 style={{ fontWeight: 800, color: "var(--danger-color)" }}>?????? ???????? ??? ??????!</h2>
        <Link href="/" className="glass-btn glass-btn-primary" style={{ marginTop: "20px" }}>?????? ????????</Link>
      </div>
    );
  }

  const packagesSection = (
    <div>
      <h3 style={{ fontWeight: 800, marginBottom: "10px" }}>1. ???? ?????? ????????:</h3>
      {service.packages && service.packages.length > 0 ? (
        <div className="packages-selector">
          {service.packages.map((pkg, idx) => {
            const simulatedDiscount = 2 + (idx % 4);
            const originalPrice = pkg.price / (1 - simulatedDiscount / 100);
            const isSelected = selectedPackage?.id === pkg.id && (service.price_type !== "both" || customerPricingMode === "packages");
            return (
              <div
                key={pkg.id}
                className={`package-option ${isSelected ? "selected" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (service.price_type === "both") {
                    setCustomerPricingMode("packages");
                  }
                  setSelectedPackage(pkg);
                }}
                style={{ position: "relative", overflow: "hidden", padding: "24px 14px 16px 14px", cursor: "pointer" }}
              >
                {/* Discount Tag */}
                <span style={{
                  position: "absolute",
                  top: "6px",
                  left: "6px",
                  background: "var(--danger-color)",
                  color: "white",
                  fontSize: "0.68rem",
                  padding: "2px 6px",
                  borderRadius: "6px",
                  fontWeight: "800"
                }}>
                  -{simulatedDiscount}%
                </span>

                <span className="package-name" style={{ display: "block", marginBottom: "6px" }}>{pkg.name}</span>

                <div style={{ display: "flex", gap: "6px", justifyContent: "center", alignItems: "baseline" }}>
                  <span className="package-price" style={{ fontSize: "1.1rem" }}>{Number(pkg.price).toFixed(2)} ?.?</span>
                  <span style={{ textDecoration: "line-through", color: "var(--text-muted)", fontSize: "0.75rem" }}>
                    {Number(originalPrice).toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)" }}>?? ????? ????? ?????? ???? ??????.</div>
      )}
    </div>
  );

  const customQuantitySection = (
    <div>
      <h3 style={{ fontWeight: 800, marginBottom: "10px" }}>1. ???? ?????? ????????:</h3>
      <p style={{ fontSize: "0.85rem", color: "var(--accent-color)", marginBottom: "12px", fontWeight: "bold" }}>
        ??? ??? 1000 ???? ??: {Number(service.price_per_thousand || 0).toFixed(2)} ?.? (??? ????: 100)
      </p>
      <div className="form-group" style={{ marginBottom: "20px" }}>
        <input
          type="number"
          min="100"
          step="100"
          value={customQuantity}
          onFocus={() => {
            if (service.price_type === "both") {
              setCustomerPricingMode("dynamic");
            }
          }}
          onChange={(e) => {
            if (service.price_type === "both") {
              setCustomerPricingMode("dynamic");
            }
            const val = e.target.value === "" ? "" : parseInt(e.target.value);
            setCustomQuantity(val);
          }}
          onBlur={() => {
            if (!customQuantity || customQuantity < 100) {
              setCustomQuantity(100);
            }
          }}
          style={{
            padding: "16px 20px",
            fontSize: "1.2rem",
            fontWeight: "bold",
            borderRadius: "14px",
            border: (service.price_type !== "both" || customerPricingMode === "dynamic") ? "2px solid #3b82f6" : "1px solid rgba(255, 255, 255, 0.08)",
            background: "#ffffff",
            color: "#000000",
            width: "100%",
            boxSizing: "border-box",
            outline: "none"
          }}
          placeholder="???? ?????? ??? (????: 5000)"
        />
        <div style={{ marginTop: "8px", fontSize: "0.88rem", color: "var(--text-muted)" }}>
          ????? ???????? ??????: <strong style={{ color: "#34d399", fontSize: "1.05rem" }}>{(((Number(customQuantity) || 0) / 1000) * (service.price_per_thousand || 0)).toFixed(2)} ?.?</strong>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Main layout */}
      <div className="service-details-layout">
        {/* Form and Packages Selector */}
        <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Header of service */}
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <div className="service-icon" style={{ width: "80px", height: "80px", borderRadius: "24px", fontSize: "2.4rem" }}>
              {getServiceIcon(service.image)}
            </div>
            <div>
              <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-main)" }}>{service.name}</h1>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>??? ???? ?????? 100%</p>
            </div>
          </div>

          <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: "1.7" }}>{service.description}</p>

          <hr style={{ opacity: 0.1 }} />

          {/* Package Select / Custom Quantity */}
          <div>
            {service.price_type === "both" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

                {/* Option 1: Packages */}
                <div
                  onClick={() => setCustomerPricingMode("packages")}
                  style={{
                    border: customerPricingMode === "packages" ? "2px solid #3b82f6" : "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "16px",
                    padding: "20px 16px 16px 16px",
                    background: customerPricingMode === "packages" ? "rgba(59, 130, 246, 0.05)" : "rgba(255,255,255,0.01)",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                    <input
                      type="radio"
                      name="pricing_mode_selector"
                      checked={customerPricingMode === "packages"}
                      onChange={() => setCustomerPricingMode("packages")}
                      style={{ width: "18px", height: "18px", cursor: "pointer" }}
                    />
                    <strong style={{ fontSize: "1.05rem", color: customerPricingMode === "packages" ? "#3b82f6" : "var(--text-main)" }}>
                      ?? ?????? ?????: ???? ???? ??? ?????
                    </strong>
                  </div>

                  <div style={{
                    opacity: customerPricingMode === "packages" ? 1 : 0.6,
                    pointerEvents: customerPricingMode === "packages" ? "auto" : "none",
                    transition: "opacity 0.2s"
                  }}>
                    {packagesSection}
                  </div>
                </div>

                {/* Option 2: Custom Quantity */}
                <div
                  onClick={() => setCustomerPricingMode("dynamic")}
                  style={{
                    border: customerPricingMode === "dynamic" ? "2px solid #3b82f6" : "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "16px",
                    padding: "20px 16px 16px 16px",
                    background: customerPricingMode === "dynamic" ? "rgba(59, 130, 246, 0.05)" : "rgba(255,255,255,0.01)",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                    <input
                      type="radio"
                      name="pricing_mode_selector"
                      checked={customerPricingMode === "dynamic"}
                      onChange={() => setCustomerPricingMode("dynamic")}
                      style={{ width: "18px", height: "18px", cursor: "pointer" }}
                    />
                    <strong style={{ fontSize: "1.05rem", color: customerPricingMode === "dynamic" ? "#3b82f6" : "var(--text-main)" }}>
                      ? ?????? ??????: ????? ??????? ??????? (??? ?????)
                    </strong>
                  </div>

                  <div style={{
                    opacity: customerPricingMode === "dynamic" ? 1 : 0.6,
                    transition: "opacity 0.2s"
                  }}>
                    {customQuantitySection}
                  </div>
                </div>

              </div>
            ) : (
              service.price_type === "dynamic" ? customQuantitySection : packagesSection
            )}
          </div>

          <hr style={{ opacity: 0.1 }} />

          {/* Form fields - Dynamic */}
          <form onSubmit={handleSubmit}>
            <h3 style={{ fontWeight: 800, marginBottom: "15px" }}>2. ?????? ?????? ?????? ????:</h3>

            {activeFields.map((field, idx) => (
              <div className="form-group" key={field.name || idx}>
                <label htmlFor={`field_${field.name}`}>{field.label}:</label>
                {field.type === "select" && field.options ? (
                  <select
                    id={`field_${field.name}`}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    required={field.required !== false}
                    style={{
                      width: "100%",
                      padding: "14px 18px",
                      fontSize: "0.95rem",
                      borderRadius: "12px",
                      border: "2px solid #3b82f6",
                      background: "#ffffff",
                      color: "#000000",
                      outline: "none"
                    }}
                  >
                    <option value="" style={{ color: "#000000", background: "#ffffff" }}>-- ???? --</option>
                    {(typeof field.options === 'string' ? field.options.split(',') : field.options).map((opt, i) => (
                      <option key={i} value={opt.trim()} style={{ color: "#000000", background: "#ffffff" }}>{opt.trim()}</option>
                    ))}
                  </select>
                ) : (
                  field.name === "player_id" && (service?.name && (service.name.toLowerCase().includes("pubg") || service.name.includes("????"))) ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <input
                          id={`field_${field.name}`}
                          type={field.type || "text"}
                          placeholder={field.placeholder || ""}
                          value={formData[field.name] || ""}
                          onChange={(e) => handleFieldChange(field.name, e.target.value)}
                          required={field.required !== false}
                          style={{
                            flex: 1,
                            padding: "14px 18px",
                            fontSize: "0.95rem",
                            borderRadius: "12px",
                            border: "2px solid #3b82f6",
                            background: "#ffffff",
                            color: "#000000",
                            outline: "none"
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleValidatePlayerId(formData[field.name])}
                          disabled={validatingId || !formData[field.name]?.trim()}
                          style={{
                            padding: "0 20px",
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%)",
                            color: "#ffffff",
                            border: "none",
                            fontSize: "0.9rem",
                            fontWeight: "bold",
                            cursor: (validatingId || !formData[field.name]?.trim()) ? "not-allowed" : "pointer",
                            opacity: (validatingId || !formData[field.name]?.trim()) ? 0.6 : 1,
                            transition: "all 0.2s",
                            minWidth: "120px"
                          }}
                        >
                          {validatingId ? "???? ?????..." : "??? ??????"}
                        </button>
                      </div>
                      {validationResult && (
                        <div style={{
                          padding: "10px 14px",
                          background: "rgba(16, 185, 129, 0.1)",
                          border: "1px solid rgba(16, 185, 129, 0.3)",
                          borderRadius: "10px",
                          color: "#10b981",
                          fontSize: "0.88rem",
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}>
                          <span>?</span>
                          <span>??? ??????: <strong>{validationResult.name}</strong></span>
                        </div>
                      )}
                      {validationError && (
                        <div style={{
                          padding: "10px 14px",
                          background: "rgba(244, 63, 94, 0.1)",
                          border: "1px solid rgba(244, 63, 94, 0.3)",
                          borderRadius: "10px",
                          color: "#f43f5e",
                          fontSize: "0.88rem",
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}>
                          <span>?</span>
                          <span>{validationError}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <input
                      id={`field_${field.name}`}
                      type={field.type || "text"}
                      placeholder={field.placeholder || ""}
                      value={formData[field.name] || ""}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      required={field.required !== false}
                      style={{
                        width: "100%",
                        padding: "14px 18px",
                        fontSize: "0.95rem",
                        borderRadius: "12px",
                        border: "2px solid #3b82f6",
                        background: "#ffffff",
                        color: "#000000",
                        outline: "none"
                      }}
                    />
                  )
                )}
              </div>
            ))}

            <div style={{ marginTop: "18px", padding: "16px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
                <h3 style={{ fontWeight: 800, margin: 0 }}>3. ????? ?????:</h3>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  ??????: {((service.price_type === "dynamic" || (service.price_type === "both" && customerPricingMode === "dynamic")) ? ((customQuantity / 1000) * (service.price_per_thousand || 0)) : (selectedPackage?.price || 0)).toFixed(2)} ?.?
                </span>
              </div>

              <div style={{ display: "grid", gap: "10px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: isCustomerLoggedIn ? "pointer" : "not-allowed", padding: "12px 14px", borderRadius: "12px", border: paymentMethod === "wallet" ? "1px solid rgba(34,197,94,0.45)" : "1px solid rgba(255,255,255,0.08)", background: paymentMethod === "wallet" ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.03)", opacity: isCustomerLoggedIn ? 1 : 0.65 }}>
                  <input type="radio" name="paymentMethod" value="wallet" checked={paymentMethod === "wallet"} onChange={() => setPaymentMethod("wallet")} disabled={!isCustomerLoggedIn} />
                  <span>
                    <strong>???????</strong>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      ????? ??? ???????? ?? ????? ??????. {isCustomerLoggedIn ? `????? ??????: ${Number(customerUser?.balance || 0).toFixed(2)} ?.?` : "????? ????? ??????."}
                    </div>
                  </span>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", padding: "12px 14px", borderRadius: "12px", border: paymentMethod === "transfer" ? "1px solid rgba(59,130,246,0.45)" : "1px solid rgba(255,255,255,0.08)", background: paymentMethod === "transfer" ? "rgba(59,130,246,0.08)" : "rgba(255,255,255,0.03)" }}>
                  <input type="radio" name="paymentMethod" value="transfer" checked={paymentMethod === "transfer"} onChange={() => setPaymentMethod("transfer")} />
                  <span>
                    <strong>????? ??? {transferNumber}</strong>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      ??? ??????? ???? ????? ???? ?? ??????? ??? ??? ???? ??????.
                    </div>
                  </span>
                </label>
              </div>

              {paymentMethod === "transfer" && (
                <div className="form-group" style={{ marginTop: "14px" }}>
                  <label htmlFor="senderPhone">????? ???? ?? ??????? ???:</label>
                  <input
                    id="senderPhone"
                    type="tel"
                    placeholder="????: 01023456789"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "14px 18px",
                      fontSize: "0.95rem",
                      borderRadius: "12px",
                      border: "2px solid #3b82f6",
                      background: "#ffffff",
                      color: "#000000",
                      outline: "none"
                    }}
                  />
                  <div style={{ marginTop: "8px", padding: "10px 12px", borderRadius: "10px", background: "#f1f5f9", border: "1px solid #cbd5e1", color: "#334155", fontSize: "0.85rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>??? ????????: <strong style={{ color: "#000000", direction: "ltr", display: "inline-block", fontSize: "1rem", userSelect: "all" }}>{transferNumber}</strong></span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(transferNumber);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      style={{
                        background: copied ? "#10b981" : "#3b82f6",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "6px",
                        padding: "4px 8px",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        fontWeight: "bold",
                        transition: "all 0.2s"
                      }}
                    >
                      {copied ? "?? ?????! ?" : "??? ??"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {errorMessage && (
              <div style={{ padding: "12px", background: "rgba(239, 68, 68, 0.1)", borderRight: "4px solid var(--danger-color)", color: "var(--danger-color)", borderRadius: "8px", fontWeight: "600", fontSize: "0.85rem", marginBottom: "15px" }}>
                ?? {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="glass-btn glass-btn-primary"
              style={{ width: "100%", padding: "14px", fontSize: "1.1rem", borderRadius: "14px" }}
            >
              {submitting ? "???? ????? ?????..." : "????? ?????? ??? ?????"}
            </button>
          </form>

        </div>

        {/* Sidebar Summary */}
        <div>
          <div className="glass-panel summary-box">
            <h3 style={{ fontWeight: 800, borderBottom: "2px solid rgba(0,0,0,0.05)", paddingBottom: "10px" }}>?????? ?????</h3>

            <div className="summary-row">
              <span className="summary-label">??????</span>
              <span className="summary-value">{service.name}</span>
            </div>

            {(service.price_type === "dynamic" || (service.price_type === "both" && customerPricingMode === "dynamic")) ? (
              <>
                <div className="summary-row">
                  <span className="summary-label">?????? ????????</span>
                  <span className="summary-value">{customQuantity} ????</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">??? ??? 1000 ????</span>
                  <span className="summary-value">{Number(service.price_per_thousand || 0).toFixed(2)} ?.?</span>
                </div>
              </>
            ) : (
              selectedPackage && (
                <>
                  <div className="summary-row">
                    <span className="summary-label">?????? ????????</span>
                    <span className="summary-value">{selectedPackage.name}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">??? ??????</span>
                    <span className="summary-value">{Number(selectedPackage.price).toFixed(2)} ?.?</span>
                  </div>
                </>
              )
            )}

            {activeFields.map((field, idx) => (
              <div className="summary-row" key={field.name || idx}>
                <span className="summary-label">{field.label}</span>
                <span className="summary-value" style={{ wordBreak: "break-all" }}>{formData[field.name] || "---"}</span>
              </div>
            ))}

            <hr style={{ opacity: 0.1 }} />

            <div className="summary-row" style={{ alignItems: "center" }}>
              <span className="summary-label" style={{ fontSize: "1.1rem", fontWeight: "bold" }}>???????? ???????</span>
              <span className="summary-value summary-total">
                {((service.price_type === "dynamic" || (service.price_type === "both" && customerPricingMode === "dynamic")) ? ((customQuantity / 1000) * (service.price_per_thousand || 0)) : (selectedPackage?.price || 0)).toFixed(2)} ?.?
              </span>
            </div>

            <div style={{ marginTop: "10px", fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: "1.5", background: "rgba(255,255,255,0.4)", padding: "10px", borderRadius: "8px" }}>
              ?? ????? ????? ?????? ???? ?????? ????? ?????? ?????? ?????? ?? ???? 5 ??? 15 ????? ??? ??? ????.
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {successData && (
        <div className="overlay">
          <div className="modal-content" style={{ textAlign: "center", padding: "30px 20px", width: "95%", maxWidth: "500px", borderRadius: "24px", maxHeight: "90vh", overflowY: "auto" }}>
            <span style={{ fontSize: "4rem", color: "var(--success-color)", display: "block", marginBottom: "15px" }}>?</span>
            <h2 style={{ fontWeight: 800, color: "#ffffff" }}>?? ?????? ???? ?????!</h2>
            <p style={{ margin: "15px 0", lineHeight: "1.6", color: "#cbd5e1" }}>
              ????? ??????? ?? Spider Store. ?? ????? ??? ????? ????? ?? ????? ??? ??? ??????? ????.
            </p>

            <div style={{ background: "linear-gradient(180deg, rgba(13, 18, 36, 0.98), rgba(13, 18, 36, 0.82))", border: "1px solid rgba(255,255,255,0.08)", padding: "15px", borderRadius: "12px", textAlign: "right", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.9rem", marginBottom: "20px", color: "#f8fafc" }}>
              <div><strong style={{ color: "#cbd5e1" }}>??? ?????:</strong> #{successData.id}</div>
              <div><strong style={{ color: "#cbd5e1" }}>??????:</strong> {successData.service_name}</div>
              <div><strong style={{ color: "#cbd5e1" }}>??????:</strong> {successData.package_name}</div>
              <div><strong style={{ color: "#cbd5e1" }}>??????:</strong> {Number(successData.package_price).toFixed(2)} ?.?</div>
              <div>
                <strong style={{ color: "#cbd5e1" }}>????? ?????:</strong>{" "}
                {successData.payment_method === "wallet" ? (
                  "???????"
                ) : (
                  <span style={{ display: "inline-flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                    ????? ???:{" "}
                    <strong style={{
                      color: "#000000",
                      background: "#f1f5f9",
                      padding: "4px 10px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      direction: "ltr",
                      display: "inline-block",
                      fontSize: "0.95rem",
                      userSelect: "all",
                      fontWeight: "bold"
                    }}>
                      {successData.transfer_to}
                    </strong>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(successData.transfer_to);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      style={{
                        background: copied ? "#10b981" : "#3b82f6",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "6px",
                        padding: "4px 10px",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                        fontWeight: "bold",
                        transition: "all 0.2s"
                      }}
                    >
                      {copied ? "?? ?????! ?" : "??? ??"}
                    </button>
                  </span>
                )}
              </div>
              {successData.sender_phone && (
                <div><strong style={{ color: "#cbd5e1" }}>????? ?????? ???:</strong> <span style={{ color: "#f8fafc", direction: "ltr", display: "inline-block" }}>{successData.sender_phone}</span></div>
              )}
              <div><strong style={{ color: "#cbd5e1" }}>???? ?????:</strong> <span style={{ color: "#22d3ee", direction: "ltr", display: "inline-block" }}>{successData.player_id}</span></div>
              {typeof successData.customer_balance === "number" && (
                <div><strong style={{ color: "#cbd5e1" }}>?????? ???????:</strong> <span style={{ color: "#86efac" }}>{successData.customer_balance.toFixed(2)} ?.?</span></div>
              )}
              <div><strong style={{ color: "#cbd5e1" }}>??????:</strong> <span style={{ color: "#86efac" }}>??? ???????? (???? ????? ????)</span></div>
            </div>

            <button
              className="glass-btn glass-btn-primary"
              style={{ width: "100%", padding: "12px" }}
              onClick={() => router.push("/")}
            >
              ?????? ?????? ????????
            </button>
          </div>
        </div>
      )}
    </>
  );
}
