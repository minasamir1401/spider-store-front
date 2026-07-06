"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/config";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [token, setToken] = useState("");
  const [adminUser, setAdminUser] = useState(null);
  const [activeTab, setActiveTab] = useState("orders"); // orders, categories, services, banners, wallet, customers
  const [adminDrawerOpen, setAdminDrawerOpen] = useState(false);

  const defaultFields = [
    { id: "player_id", label: "معرّف اللاعب / حساب الخدمة (Player ID / Email)", placeholder: "أدخل معرّف الحساب بدقة هنا (مثال: 512495910)", type: "text", required: true }
  ];

  // Data states
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search/Filter states
  const [orderSearch, setOrderSearch] = useState("");
  const [orderFilter, setOrderFilter] = useState("all"); // all, pending, completed, cancelled
  const [catSearch, setCatSearch] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");

  // Modal / Form states
  const [showCatModal, setShowCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatImage, setNewCatImage] = useState("games");
  const [catUploadedFile, setCatUploadedFile] = useState(null);
  const [newCatFields, setNewCatFields] = useState(defaultFields);
  const [newCatFieldsTitle, setNewCatFieldsTitle] = useState("بيانات الحساب المراد شحنه");
  const [newCatParentId, setNewCatParentId] = useState("");

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceDesc, setNewServiceDesc] = useState("");
  const [newServiceCatId, setNewServiceCatId] = useState("");
  const [newServicePrice, setNewServicePrice] = useState(0);
  const [newServiceImage, setNewServiceImage] = useState("pubg");
  const [serviceUploadedFile, setServiceUploadedFile] = useState(null);
  const [newServicePriceType, setNewServicePriceType] = useState("fixed"); // fixed or dynamic
  const [newServicePricePerThousand, setNewServicePricePerThousand] = useState(0);
  
  // Package list builder
  const [newServicePackages, setNewServicePackages] = useState([
    { name: "", price: 0 }
  ]);

  const [newServiceFields, setNewServiceFields] = useState(defaultFields);
  const [newServiceFieldsTitle, setNewServiceFieldsTitle] = useState("");
  const [newServiceDownloadLink, setNewServiceDownloadLink] = useState("");
  const [newServiceDownloadLinkTitle, setNewServiceDownloadLinkTitle] = useState("تحميل الأداة");

  // Edit Category Modal / Form states
  const [showEditCatModal, setShowEditCatModal] = useState(false);
  const [editCatId, setEditCatId] = useState(null);
  const [editCatName, setEditCatName] = useState("");
  const [editCatImage, setEditCatImage] = useState("games");
  const [editCatUploadedFile, setEditCatUploadedFile] = useState(null);
  const [editCatFields, setEditCatFields] = useState(defaultFields);
  const [editCatFieldsTitle, setEditCatFieldsTitle] = useState("بيانات الحساب المراد شحنه");
  const [applyToServices, setApplyToServices] = useState(false);
  const [editCatParentId, setEditCatParentId] = useState("");

  // Edit Service Modal / Form states
  const [showEditServiceModal, setShowEditServiceModal] = useState(false);
  const [editServiceId, setEditServiceId] = useState(null);
  const [editServiceName, setEditServiceName] = useState("");
  const [editServiceDesc, setEditServiceDesc] = useState("");
  const [editServiceCatId, setEditServiceCatId] = useState("");
  const [editServiceImage, setEditServiceImage] = useState("pubg");
  const [editServiceUploadedFile, setEditServiceUploadedFile] = useState(null);
  const [editServicePackages, setEditServicePackages] = useState([{ name: "", price: 0 }]);
  const [editServiceFields, setEditServiceFields] = useState(defaultFields);
  const [editServicePriceType, setEditServicePriceType] = useState("fixed");
  const [editServicePricePerThousand, setEditServicePricePerThousand] = useState(0);
  const [editServiceFieldsTitle, setEditServiceFieldsTitle] = useState("");
  const [editServiceDownloadLink, setEditServiceDownloadLink] = useState("");
  const [editServiceDownloadLinkTitle, setEditServiceDownloadLinkTitle] = useState("تحميل الأداة");

  // Banners data & form states
  const [banners, setBanners] = useState([]);
  const [bannerSearch, setBannerSearch] = useState("");

  const [walletRequests, setWalletRequests] = useState([]);
  const [walletTransactions, setWalletTransactions] = useState([]);
  const [walletSearch, setWalletSearch] = useState("");
  const [walletFilter, setWalletFilter] = useState("all");
  const [customers, setCustomers] = useState([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [selectedCustomerTransactions, setSelectedCustomerTransactions] = useState([]);
  const [showEditCustomerModal, setShowEditCustomerModal] = useState(false);
  const [editCustomerId, setEditCustomerId] = useState(null);
  const [editCustomerUsername, setEditCustomerUsername] = useState("");
  const [editCustomerEmail, setEditCustomerEmail] = useState("");
  const [editCustomerPhone, setEditCustomerPhone] = useState("");
  const [editCustomerBalance, setEditCustomerBalance] = useState("");
  const [editCustomerBalances, setEditCustomerBalances] = useState({});
  const [editCustomerNewPassword, setEditCustomerNewPassword] = useState("");

  const [showBannerModal, setShowBannerModal] = useState(false);
  const [newBannerTitle, setNewBannerTitle] = useState("");
  const [newBannerHighlight, setNewBannerHighlight] = useState("");
  const [newBannerDesc, setNewBannerDesc] = useState("");
  const [newBannerBadge, setNewBannerBadge] = useState("");
  const [newBannerColor, setNewBannerColor] = useState("#8b5cf6");
  const [newBannerIcon, setNewBannerIcon] = useState("⚡");
  const [bannerUploadedFile, setBannerUploadedFile] = useState(null);

  const [showEditBannerModal, setShowEditBannerModal] = useState(false);
  const [editBannerId, setEditBannerId] = useState(null);
  const [editBannerTitle, setEditBannerTitle] = useState("");
  const [editBannerHighlight, setEditBannerHighlight] = useState("");
  const [editBannerDesc, setEditBannerDesc] = useState("");
  const [editBannerBadge, setEditBannerBadge] = useState("");
  const [editBannerColor, setEditBannerColor] = useState("#8b5cf6");
  const [editBannerIcon, setEditBannerIcon] = useState("⚡");
  const [editBannerUploadedFile, setEditBannerUploadedFile] = useState(null);

  const [siteName, setSiteName] = useState("");
  const [siteLogo, setSiteLogo] = useState("");
  const [siteFavicon, setSiteFavicon] = useState("");
  const [logoUploadedFile, setLogoUploadedFile] = useState(null);
  const [faviconUploadedFile, setFaviconUploadedFile] = useState(null);
  const [paymentMethodsList, setPaymentMethodsList] = useState([]);
  const [globalCurrencies, setGlobalCurrencies] = useState(["USD", "USDT"]);
  const [exchangeRates, setExchangeRates] = useState({ "USD": 50, "USDT": 51 });
  const [baseCurrency, setBaseCurrency] = useState("ج.م");
  const [supportedCurrenciesText, setSupportedCurrenciesText] = useState("USD, USDT");
  const [hideWalletPayment, setHideWalletPayment] = useState(false);
  const [whatsappNumbers, setWhatsappNumbers] = useState([]);
  const [newWhatsappNumber, setNewWhatsappNumber] = useState("");
  const [waStatus, setWaStatus] = useState("disconnected"); // 'disconnected'|'loading'|'qr'|'ready'
  const [waQR, setWaQR] = useState(null);
  const waPollingRef = useRef(null);

  const [newAdminUsername, setNewAdminUsername] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [credentialsErrorMsg, setCredentialsErrorMsg] = useState("");
  const [credentialsSuccessMsg, setCredentialsSuccessMsg] = useState("");

  const [showCodeModal, setShowCodeModal] = useState(false);
  const [codeModalOrder, setCodeModalOrder] = useState(null);
  const [codeValue, setCodeValue] = useState("");
  const [codeModalStatusToUpdate, setCodeModalStatusToUpdate] = useState(null);
  const [orderDownloadLinkValue, setOrderDownloadLinkValue] = useState("");
  const [orderDownloadLinkTitleValue, setOrderDownloadLinkTitleValue] = useState("");
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [orderDetailsData, setOrderDetailsData] = useState(null);

  const [errorMsg, setErrorMsg] = useState("");
  const [addCurrencySelect, setAddCurrencySelect] = useState("USD");
  const [addCurrencyCustomCode, setAddCurrencyCustomCode] = useState("");
  const [addCurrencyRate, setAddCurrencyRate] = useState("");

  const [excelAppleUsdRate, setExcelAppleUsdRate] = useState(50.0);
  const [excelAppleMarkup, setExcelAppleMarkup] = useState(10.0);
  const [excelFrpUsdRate, setExcelFrpUsdRate] = useState(50.0);
  const [excelFrpMarkup, setExcelFrpMarkup] = useState(10.0);
  const [excelSettingsSuccessMsg, setExcelSettingsSuccessMsg] = useState("");
  const [excelSettingsErrorMsg, setExcelSettingsErrorMsg] = useState("");
  const [excelAppleUploadMsg, setExcelAppleUploadMsg] = useState("");
  const [excelFrpUploadMsg, setExcelFrpUploadMsg] = useState("");
  const [excelUploadLoading, setExcelUploadLoading] = useState(false);
  const [unlockerApiKey, setUnlockerApiKey] = useState("5TC-O62-NRZ-HF3-NQ4-3VJ-S7V-FPK");
  const [unlockerUsername, setUnlockerUsername] = useState("Hassen1990");
  const [unlockerApiUrl, setUnlockerApiUrl] = useState("https://amrr-unlocker.com/api/index.php");
  const [unlockerExchangeRate, setUnlockerExchangeRate] = useState(50);
  const [unlockerMarkupPercent, setUnlockerMarkupPercent] = useState(10);
  const [unlockerServices, setUnlockerServices] = useState([]);
  const [unlockerLoading, setUnlockerLoading] = useState(false);
  const [unlockerSearch, setUnlockerSearch] = useState("");
  const [unlockerCategoryFilter, setUnlockerCategoryFilter] = useState("ALL");
  const [unlockerPage, setUnlockerPage] = useState(1);
  const [unlockerPageSize, setUnlockerPageSize] = useState(50);
  const [unlockerImportTargetCat, setUnlockerImportTargetCat] = useState("auto");
  const [unlockerNewCatName, setUnlockerNewCatName] = useState("");
  const [selectedUnlockerServices, setSelectedUnlockerServices] = useState([]);
  const [unlockerSettingsMsg, setUnlockerSettingsMsg] = useState("");
  const [unlockerSyncMsg, setUnlockerSyncMsg] = useState("");
  const [unlockerGroupAsPackages, setUnlockerGroupAsPackages] = useState(true);
  const [unlockerCustomPrices, setUnlockerCustomPrices] = useState({});
  const [unlockerCustomDiscounts, setUnlockerCustomDiscounts] = useState({});
  const [unlockerBalance, setUnlockerBalance] = useState(null);
  const [unlockerBalanceLoading, setUnlockerBalanceLoading] = useState(false);
  const [unlockerBalanceEmail, setUnlockerBalanceEmail] = useState("");
  const [unlockerCurrency, setUnlockerCurrency] = useState("USD");

  const fetchUnlockerBalance = useCallback(async () => {
    if (!token) return;
    setUnlockerBalanceLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/unlocker/balance`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setUnlockerBalance(data.credit);
        setUnlockerBalanceEmail(data.email);
        if (data.currency) {
          setUnlockerCurrency(data.currency);
        }
      } else {
        console.warn("Failed to fetch unlocker balance:", data.message);
      }
    } catch (err) {
      console.warn("Failed to fetch unlocker balance:", err.message);
    } finally {
      setUnlockerBalanceLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (activeTab === "amrr_unlocker" && token) {
      void fetchUnlockerBalance();
    }
  }, [activeTab, token, fetchUnlockerBalance]);

  const unlockerCategories = useMemo(() => {
    return ["ALL", ...Array.from(new Set(unlockerServices.map(s => s.category))).sort()];
  }, [unlockerServices]);

  const importedUnlockerServiceIds = useMemo(() => {
    return new Set(services.filter(s => s.api_source === 'amrr-unlocker').map(s => String(s.api_service_id)));
  }, [services]);

  const filteredUnlockerServices = useMemo(() => {
    const query = (unlockerSearch || "").trim().toLowerCase();
    return unlockerServices.filter(s => {
      const name = s.name || "";
      const category = s.category || "";
      const matchSearch = !query || 
                          name.toLowerCase().includes(query) || 
                          category.toLowerCase().includes(query) ||
                          String(s.id).includes(query);
      const matchCat = unlockerCategoryFilter === "ALL" || s.category === unlockerCategoryFilter;
      return matchSearch && matchCat;
    });
  }, [unlockerServices, unlockerSearch, unlockerCategoryFilter]);

  const totalUnlockerPages = Math.max(1, Math.ceil(filteredUnlockerServices.length / unlockerPageSize));
  const paginatedUnlockerServices = useMemo(() => {
    const start = (unlockerPage - 1) * unlockerPageSize;
    return filteredUnlockerServices.slice(start, start + unlockerPageSize);
  }, [filteredUnlockerServices, unlockerPage, unlockerPageSize]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setHydrated(true);

    const storedToken = localStorage.getItem("admin_token") || "";
    setToken(storedToken);

    try {
      const storedUser = localStorage.getItem("admin_user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      setAdminUser(parsedUser);
      setNewAdminUsername(parsedUser?.username || "");
    } catch {
      setAdminUser(null);
      setNewAdminUsername("");
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "pending").length;
    const completed = orders.filter((o) => o.status === "completed").length;
    const revenue = orders
      .filter((o) => o.status === "completed")
      .reduce((sum, o) => sum + Number(o.package_price || 0), 0);

    return {
      totalOrders: total,
      pendingOrders: pending,
      completedOrders: completed,
      revenue
    };
  }, [orders]);

  // Security Check
  useEffect(() => {
    if (!hydrated) return;
    if (!token) {
      router.push("/admin/login");
    }
  }, [hydrated, token, router]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const headers = { "Authorization": `Bearer ${token}` };

      // Fetch categories
      const catRes = await fetch(`${API_BASE_URL}/api/categories`);
      const catData = await catRes.json();
      setCategories(catData);
      if (catData.length > 0) {
        setNewServiceCatId(catData[0].id.toString());
      }

      // Fetch services
      const serviceRes = await fetch(`${API_BASE_URL}/api/services`);
      const serviceData = await serviceRes.json();
      setServices(serviceData);

      // Fetch site settings
      const settingsRes = await fetch(`${API_BASE_URL}/api/settings?t=${Date.now()}`);
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setSiteName(settingsData.site_name || "عرب تك سيرفر");
        setSiteLogo(settingsData.site_logo || "default");
        setSiteFavicon(settingsData.site_favicon || "default");
        setPaymentMethodsList(settingsData.payment_methods || []);
        if (settingsData.supported_currencies) {
          setGlobalCurrencies(settingsData.supported_currencies);
          setSupportedCurrenciesText(settingsData.supported_currencies.join(", "));
        }
        if (settingsData.exchange_rates) {
          setExchangeRates(settingsData.exchange_rates);
        }
        if (settingsData.base_currency) {
          setBaseCurrency(settingsData.base_currency);
        }
        setHideWalletPayment(settingsData.hide_wallet_payment || false);
        if (settingsData.whatsapp_numbers && Array.isArray(settingsData.whatsapp_numbers)) {
          setWhatsappNumbers(settingsData.whatsapp_numbers);
        }
      }

      // Fetch orders
      const orderRes = await fetch(`${API_BASE_URL}/api/orders`, { headers });
      if (orderRes.status === 401 || orderRes.status === 403) {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        router.push("/admin/login");
        return;
      }
      if (orderRes.ok) {
        const orderData = await orderRes.json();
        setOrders(orderData);
      }

      // Fetch banners
      const bannerRes = await fetch(`${API_BASE_URL}/api/banners`);
      if (bannerRes.ok) {
        const bannerData = await bannerRes.json();
        setBanners(bannerData);
      }

      // Fetch wallet requests
      const walletRes = await fetch(`${API_BASE_URL}/api/wallet`, { headers });
      if (walletRes.ok) {
        const walletData = await walletRes.json();
        setWalletRequests(walletData);
      }

      const walletTxRes = await fetch(`${API_BASE_URL}/api/wallet/transactions`, { headers });
      if (walletTxRes.ok) {
        const walletTxData = await walletTxRes.json();
        setWalletTransactions(walletTxData);
      }

      const customersRes = await fetch(`${API_BASE_URL}/api/customer/admin/customers`, { headers });
      if (customersRes.ok) {
        const customersData = await customersRes.json();
        setCustomers(customersData);
        if (!selectedCustomerId && customersData.length > 0) {
          setSelectedCustomerId(customersData[0].id);
        }
      }

      // Fetch Excel settings
      const excelSettingsRes = await fetch(`${API_BASE_URL}/api/excel/settings`, { headers });
      if (excelSettingsRes.ok) {
        const excelSettingsData = await excelSettingsRes.ok ? await excelSettingsRes.json() : null;
        if (excelSettingsData) {
          setExcelAppleUsdRate(excelSettingsData.apple_usd_rate);
          setExcelAppleMarkup(excelSettingsData.apple_markup);
          setExcelFrpUsdRate(excelSettingsData.frp_usd_rate);
          setExcelFrpMarkup(excelSettingsData.frp_markup);
        }
      }
      // Fetch Unlocker settings
      const unlockerSettingsRes = await fetch(`${API_BASE_URL}/api/unlocker/settings`, { headers });
      if (unlockerSettingsRes.ok) {
        const unlockerSettingsData = await unlockerSettingsRes.json();
        setUnlockerApiKey(unlockerSettingsData.api_key || "");
        setUnlockerApiUrl(unlockerSettingsData.api_url || "");
        setUnlockerUsername(unlockerSettingsData.username || "");
      }
    } catch (err) {
      console.error("Error fetching admin data:", err);
      setErrorMsg("حدث خطأ أثناء تحميل البيانات من الخادم.");
    } finally {
      setLoading(false);
    }
  }, [router, token, selectedCustomerId]);

  // Load dashboard data when token is available
  useEffect(() => {
    if (!token) return;
    const timer = setTimeout(() => {
      void fetchData();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchData, token]);

  useEffect(() => {
    if (!token || !selectedCustomerId) return;

    const loadCustomerTransactions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/customer/admin/${selectedCustomerId}/transactions`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) return;

        const data = await response.json();
        setSelectedCustomerTransactions(data.transactions || []);
      } catch (err) {
        console.error("Error loading customer transactions:", err);
      }
    };

    loadCustomerTransactions();
  }, [token, selectedCustomerId]);

  
  const saveUnlockerSettings = async (e) => {
    e.preventDefault();
    setUnlockerSettingsMsg("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/unlocker/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          api_key: unlockerApiKey,
          api_url: unlockerApiUrl,
          username: unlockerUsername
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "فشل تحديث الإعدادات.");
      setUnlockerSettingsMsg("✅ تم حفظ إعدادات البوابة بنجاح!");
      setTimeout(() => setUnlockerSettingsMsg(""), 3000);
    } catch (err) {
      setUnlockerSettingsMsg(`❌ خطأ: ${err.message}`);
    }
  };

  const fetchUnlockerServices = async () => {
    setUnlockerLoading(true);
    setUnlockerSyncMsg("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/unlocker/fetch-services`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "فشل جلب الخدمات.");
      setUnlockerServices(data.services || []);
      setUnlockerSyncMsg(`✅ تم جلب عدد ${data.services.length} خدمة بنجاح من المزود.`);
      setSelectedUnlockerServices([]);
      setUnlockerPage(1);
      setUnlockerCategoryFilter("ALL");
    } catch (err) {
      setUnlockerSyncMsg(`❌ فشل الاتصال: ${err.message}`);
    } finally {
      setUnlockerLoading(false);
    }
  };

  const importSelectedUnlockerServices = async () => {
    if (selectedUnlockerServices.length === 0) {
      alert("يرجى تحديد خدمة واحدة على الأقل للاستيراد.");
      return;
    }
    
    setUnlockerLoading(true);
    setUnlockerSyncMsg("");
    
    try {
      const servicesToImport = unlockerServices
        .filter(s => selectedUnlockerServices.includes(s.id))
        .map(s => ({
          ...s,
          custom_price: unlockerCustomPrices[s.id] !== undefined && unlockerCustomPrices[s.id] !== "" ? parseFloat(unlockerCustomPrices[s.id]) : null,
          custom_discount: unlockerCustomDiscounts[s.id] !== undefined && unlockerCustomDiscounts[s.id] !== "" ? parseFloat(unlockerCustomDiscounts[s.id]) : null
        }));
      const response = await fetch(`${API_BASE_URL}/api/unlocker/import-services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          services: servicesToImport,
          exchange_rate: parseFloat(unlockerExchangeRate) || 50,
          markup_percent: parseFloat(unlockerMarkupPercent) || 0,
          local_category_id: unlockerImportTargetCat,
          custom_category_name: unlockerNewCatName,
          group_as_packages: unlockerGroupAsPackages
        })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "فشل استيراد الخدمات.");
      
      setUnlockerSyncMsg(`✅ ${data.message}`);
      setSelectedUnlockerServices([]);
      void fetchData();
    } catch (err) {
      setUnlockerSyncMsg(`❌ فشل الاستيراد: ${err.message}`);
    } finally {
      setUnlockerLoading(false);
    }
  };

  const triggerUnlockerOrderApproval = async (orderId) => {
    if (!confirm("هل أنت متأكد من تفعيل هذا الطلب وإرساله إلى Amrr Unlocker؟")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/unlocker/place-order/${orderId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "فشل إرسال الطلب لـ API.");
      
      alert(data.message);
      void fetchData();
    } catch (err) {
      alert(`خطأ: ${err.message}`);
    }
  };

  const checkUnlockerOrderStatus = async (orderId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/unlocker/check-status/${orderId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "فشل تحديث حالة الطلب.");
      
      alert(data.message);
      void fetchData();
    } catch (err) {
      alert(`خطأ: ${err.message}`);
    }
  };

const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.push("/admin/login");
  };

  // Orders Actions
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error();

      // Update locally
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert("فشل تحديث حالة الطلب.");
    }
  };

  const updateOrderCodeAndStatus = async (orderId, newStatus, newCode, newDownloadLink, newDownloadLinkTitle) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          status: newStatus || undefined, 
          code: newCode,
          download_link: newDownloadLink,
          download_link_title: newDownloadLinkTitle
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      // Update locally
      setOrders(prev => prev.map(o => o.id === orderId ? { 
        ...o, 
        status: newStatus || o.status, 
        code: newCode,
        download_link: newDownloadLink,
        download_link_title: newDownloadLinkTitle
      } : o));
    } catch (err) {
      alert(err.message || "فشل تحديث الطلب.");
    }
  };

  const handleOpenCodeModal = (order, statusToUpdate = null) => {
    setCodeModalOrder(order);
    setCodeValue(order.code || "");
    const service = services.find(s => s.id === order.service_id);
    const defaultLink = service ? (service.download_link || "") : "";
    const defaultLinkTitle = service ? (service.download_link_title || "تحميل الأداة") : "تحميل الأداة";

    setOrderDownloadLinkValue(order.download_link || defaultLink);
    setOrderDownloadLinkTitleValue(order.download_link_title || defaultLinkTitle);
    setCodeModalStatusToUpdate(statusToUpdate);
    setShowCodeModal(true);
  };

  const handleSubmitCodeModal = async (e) => {
    e.preventDefault();
    if (!codeModalOrder) return;
    
    await updateOrderCodeAndStatus(codeModalOrder.id, codeModalStatusToUpdate, codeValue, orderDownloadLinkValue, orderDownloadLinkTitleValue);
    setShowCodeModal(false);
    setCodeModalOrder(null);
    setCodeValue("");
    setOrderDownloadLinkValue("");
    setOrderDownloadLinkTitleValue("");
    setCodeModalStatusToUpdate(null);
  };

  const deleteOrder = async (orderId) => {
    if (!confirm("هل أنت متأكد من حذف هذا الطلب؟")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "فشل حذف الطلب.");

      setOrders(prev => prev.filter(o => o.id !== orderId));
      setWalletTransactions(prev => prev.filter(tx => !((tx.reference_type === "order" || tx.reference_type === "order_refund") && tx.reference_id === orderId)));
    } catch (err) {
      alert(err.message || "فشل حذف الطلب.");
    }
  };

  const handleOpenEditCustomer = (customer) => {
    setEditCustomerId(customer.id);
    setEditCustomerUsername(customer.username || "");
    setEditCustomerEmail(customer.email || "");
    setEditCustomerPhone(customer.phone || "");
    setEditCustomerBalance(Number(customer.balance || 0).toFixed(2));
    setEditCustomerBalances(customer.balances ? (typeof customer.balances === 'string' ? JSON.parse(customer.balances) : customer.balances) : {});
    setEditCustomerNewPassword("");
    setShowEditCustomerModal(true);
  };

  const handleUpdateCustomer = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/api/customer/admin/${editCustomerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          username: editCustomerUsername,
          email: editCustomerEmail,
          phone: editCustomerPhone,
          balance: editCustomerBalance,
          balances: editCustomerBalances,
          new_password: editCustomerNewPassword
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "فشل تحديث بيانات العميل.");

      setCustomers(prev => prev.map((customer) =>
        customer.id === editCustomerId
          ? { ...customer, username: data.customer.username, email: data.customer.email, phone: data.customer.phone, balance: data.customer.balance, balances: data.customer.balances, password_masked: data.customer.password_masked }
          : customer
      ));

      if (selectedCustomerId === editCustomerId) {
        setSelectedCustomerTransactions([]);
        setSelectedCustomerId(editCustomerId);
      }

      setShowEditCustomerModal(false);
      setEditCustomerNewPassword("");
    } catch (err) {
      alert(err.message || "فشل تحديث بيانات العميل.");
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    if (!window.confirm("هل أنت متأكد من رغبتك في حذف هذا العميل نهائياً؟ سيتم حذف كافة حركات حسابه ورصيده ولا يمكن التراجع عن هذا الإجراء!")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/customer/admin/${customerId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "فشل حذف العميل.");

      // Remove customer from state
      setCustomers(prev => prev.filter(c => c.id !== customerId));
      
      // Clear selected customer details if they were deleted
      if (selectedCustomerId === customerId) {
        setSelectedCustomerId(null);
        setSelectedCustomerTransactions([]);
      }

      alert("تم حذف العميل والبيانات المرتبطة به بنجاح.");
    } catch (err) {
      alert(err.message || "فشل حذف العميل.");
    }
  };

  const updateWalletRequestStatus = async (requestId, newStatus, adminNote = "") => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/wallet/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus, admin_note: adminNote })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "فشل تحديث طلب الشحن.");

      setWalletRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: newStatus, admin_note: adminNote, processed_at: new Date().toISOString() } : r));
    } catch (err) {
      alert(err.message || "فشل تحديث طلب الشحن.");
    }
  };

  // Add Category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!newCatName.trim()) {
      setErrorMsg("اسم القسم مطلوب.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name: newCatName, image: catUploadedFile || newCatImage, fields: newCatFields, fields_title: newCatFieldsTitle, parent_id: newCatParentId || null })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "فشل إضافة القسم.");
      }

      setCategories(prev => [...prev, data]);
      setNewCatName("");
      setNewCatImage("games");
      setCatUploadedFile(null);
      setNewCatFields(defaultFields);
      setNewCatFieldsTitle("بيانات الحساب المراد شحنه");
      setNewCatParentId("");
      setShowCatModal(false);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا القسم؟ سيتم حذف جميع الخدمات التابعة له تلقائياً!")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error();

      setCategories(prev => prev.filter(c => c.id !== id).map(c => {
        if (Number(c.parent_id) === Number(id)) {
          return { ...c, parent_id: null };
        }
        return c;
      }));
      // Filter out deleted services
      setServices(prev => prev.filter(s => s.category_id !== id));
    } catch (err) {
      alert("فشل حذف القسم.");
    }
  };

  // Package list helpers
  const handleAddPkgInput = () => {
    setNewServicePackages(prev => [...prev, { name: "", price: 0 }]);
  };

  const handleRemovePkgInput = (index) => {
    setNewServicePackages(prev => prev.filter((_, i) => i !== index));
  };

  const handlePkgChange = (index, field, value) => {
    setNewServicePackages(prev => prev.map((pkg, i) => {
      if (i === index) {
        return {
          ...pkg,
          [field]: field === "price" ? parseFloat(value) || 0 : value
        };
      }
      return pkg;
    }));
  };

  // Custom fields helpers
  const handleAddField = () => {
    setNewServiceFields(prev => [...prev, { id: `field_${Date.now()}`, label: "", placeholder: "", type: "text", required: true }]);
  };

  const handleRemoveField = (index) => {
    setNewServiceFields(prev => prev.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index, field, value) => {
    setNewServiceFields(prev => prev.map((f, i) => {
      if (i === index) {
        return {
          ...f,
          [field]: value
        };
      }
      return f;
    }));
  };

  // Add Service
  const handleAddService = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!newServiceName.trim()) {
      setErrorMsg("اسم الخدمة مطلوب.");
      return;
    }

    let validPackages = [];
    let minPrice = 0;

    if (newServicePriceType === "fixed") {
      validPackages = newServicePackages
        .filter(p => p.name.trim())
        .map((p, idx) => ({ id: idx + 1, name: p.name, price: p.price }));

      if (validPackages.length === 0) {
        setErrorMsg("يجب إضافة باقة واحدة على الأقل للخدمة.");
        return;
      }
      minPrice = Math.min(...validPackages.map(p => p.price));
    } else if (newServicePriceType === "dynamic") {
      minPrice = parseFloat(newServicePricePerThousand) || 0;
      validPackages = [{ id: 1, name: "شحن بالكمية", price: minPrice }];
    } else {
      validPackages = newServicePackages
        .filter(p => p.name.trim())
        .map((p, idx) => ({ id: idx + 1, name: p.name, price: p.price }));

      if (validPackages.length === 0) {
        setErrorMsg("يجب إضافة باقة واحدة على الأقل للخدمة.");
        return;
      }
      minPrice = parseFloat(newServicePricePerThousand) || 0;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          category_id: parseInt(newServiceCatId),
          name: newServiceName,
          description: newServiceDesc,
          price: minPrice,
          image: serviceUploadedFile || newServiceImage,
          packages: validPackages,
          fields: newServiceFields,
          price_type: newServicePriceType,
          price_per_thousand: parseFloat(newServicePricePerThousand) || 0.0,
          fields_title: newServiceFieldsTitle,
          download_link: newServiceDownloadLink,
          download_link_title: newServiceDownloadLinkTitle
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "فشل إضافة الخدمة.");
      }

      setServices(prev => [...prev, data]);
      
      // Reset form
      setNewServiceName("");
      setNewServiceDesc("");
      setNewServicePrice(0);
      setNewServiceImage("pubg");
      setServiceUploadedFile(null);
      setNewServicePackages([{ name: "", price: 0 }]);
      setNewServiceFields(defaultFields);
      setNewServiceFieldsTitle("");
      setNewServicePriceType("fixed");
      setNewServicePricePerThousand(0);
      setNewServiceDownloadLink("");
      setNewServiceDownloadLinkTitle("تحميل الأداة");
      setShowServiceModal(false);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  // Delete Service
  const handleDeleteService = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذه الخدمة؟")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/services/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error();

      setServices(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      alert("فشل حذف الخدمة.");
    }
  };

  // Open Edit Category Modal
  const handleOpenEditCat = (cat) => {
    setErrorMsg("");
    setEditCatId(cat.id);
    setEditCatName(cat.name);
    const isCustom = cat.image && (cat.image.startsWith("data:image") || cat.image.startsWith("http") || cat.image.startsWith("/uploads"));
    if (isCustom) {
      setEditCatUploadedFile(cat.image);
      setEditCatImage("games");
    } else {
      setEditCatUploadedFile(null);
      setEditCatImage(cat.image || "games");
    }
    
    // Parse and set edit fields
    let parsedFields = [];
    try {
      parsedFields = typeof cat.fields === 'string'
        ? JSON.parse(cat.fields)
        : cat.fields;
    } catch (e) {
      parsedFields = cat.fields || [];
    }
    setEditCatFields(parsedFields && parsedFields.length > 0 ? parsedFields : defaultFields);
    setEditCatFieldsTitle(cat.fields_title || "بيانات الحساب المراد شحنه");
    setEditCatParentId(cat.parent_id || "");
    
    setShowEditCatModal(true);
  };

  // Edit Category handler
  const handleEditCategory = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!editCatName.trim()) {
      setErrorMsg("اسم القسم مطلوب.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/categories/${editCatId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editCatName,
          image: editCatUploadedFile || editCatImage,
          fields: editCatFields,
          fields_title: editCatFieldsTitle,
          apply_to_services: applyToServices,
          parent_id: editCatParentId || null
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "فشل تعديل القسم.");
      }

      setCategories(prev => prev.map(c => c.id === editCatId ? { ...c, name: editCatName, image: data.image, fields: data.fields, fields_title: data.fields_title, parent_id: data.parent_id } : c));
      
      if (applyToServices) {
        setServices(prev => prev.map(s => Number(s.category_id) === Number(editCatId) ? {
          ...s,
          fields: editCatFields,
          fields_title: editCatFieldsTitle
        } : s));
      }
      setApplyToServices(false);
      setEditCatParentId("");
      setShowEditCatModal(false);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  // Open Edit Service Modal
  const handleOpenEditService = (service) => {
    setErrorMsg("");
    setEditServiceId(service.id);
    setEditServiceName(service.name);
    setEditServiceDesc(service.description || "");
    setEditServiceCatId(service.category_id.toString());
    
    const isCustom = service.image && (service.image.startsWith("data:image") || service.image.startsWith("http") || service.image.startsWith("/uploads"));
    if (isCustom) {
      setEditServiceUploadedFile(service.image);
      setEditServiceImage("pubg");
    } else {
      setEditServiceUploadedFile(null);
      setEditServiceImage(service.image || "pubg");
    }

    let parsedPackages = [];
    try {
      parsedPackages = typeof service.packages === 'string' 
        ? JSON.parse(service.packages) 
        : service.packages;
    } catch(e) {
      parsedPackages = service.packages || [];
    }
    setEditServicePackages(parsedPackages.length > 0 ? parsedPackages : [{ name: "", price: 0 }]);

    let parsedFields = [];
    try {
      parsedFields = typeof service.fields === 'string' 
        ? JSON.parse(service.fields) 
        : service.fields;
    } catch(e) {
      parsedFields = service.fields || [];
    }
    setEditServiceFields(parsedFields.length > 0 ? parsedFields : defaultFields);
    setEditServicePriceType(service.price_type || "fixed");
    setEditServicePricePerThousand(service.price_per_thousand || 0);
    setEditServiceFieldsTitle(service.fields_title || "");
    setEditServiceDownloadLink(service.download_link || "");
    setEditServiceDownloadLinkTitle(service.download_link_title || "تحميل الأداة");

    setShowEditServiceModal(true);
  };

  // Edit Service Packages helpers
  const handleAddEditPkgInput = () => {
    setEditServicePackages(prev => [...prev, { name: "", price: 0 }]);
  };

  const handleRemoveEditPkgInput = (index) => {
    setEditServicePackages(prev => prev.filter((_, i) => i !== index));
  };

  const handleEditPkgChange = (index, field, value) => {
    setEditServicePackages(prev => prev.map((pkg, i) => {
      if (i === index) {
        return {
          ...pkg,
          [field]: field === "price" ? parseFloat(value) || 0 : value
        };
      }
      return pkg;
    }));
  };

  // Edit Service Fields helpers
  const handleAddEditField = () => {
    setEditServiceFields(prev => [...prev, { id: `field_${Date.now()}`, label: "", placeholder: "", type: "text", required: true }]);
  };

  const handleRemoveEditField = (index) => {
    setEditServiceFields(prev => prev.filter((_, i) => i !== index));
  };

  const handleEditFieldChange = (index, field, value) => {
    setEditServiceFields(prev => prev.map((f, i) => {
      if (i === index) {
        return {
          ...f,
          [field]: value
        };
      }
      return f;
    }));
  };

  // Category Fields helpers
  const handleAddCatField = () => {
    setNewCatFields(prev => [...prev, { id: `field_${Date.now()}`, label: "", placeholder: "", type: "text", required: true }]);
  };

  const handleRemoveCatField = (index) => {
    setNewCatFields(prev => prev.filter((_, i) => i !== index));
  };

  const handleCatFieldChange = (index, field, value) => {
    setNewCatFields(prev => prev.map((f, i) => {
      if (i === index) {
        return { ...f, [field]: value };
      }
      return f;
    }));
  };

  const handleAddEditCatField = () => {
    setEditCatFields(prev => [...prev, { id: `field_${Date.now()}`, label: "", placeholder: "", type: "text", required: true }]);
  };

  const handleRemoveEditCatField = (index) => {
    setEditCatFields(prev => prev.filter((_, i) => i !== index));
  };

  const handleEditCatFieldChange = (index, field, value) => {
    setEditCatFields(prev => prev.map((f, i) => {
      if (i === index) {
        return { ...f, [field]: value };
      }
      return f;
    }));
  };

  // Edit Service handler
  const handleEditService = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!editServiceName.trim()) {
      setErrorMsg("اسم الخدمة مطلوب.");
      return;
    }

    let validPackages = [];
    let minPrice = 0;

    if (editServicePriceType === "fixed") {
      validPackages = editServicePackages
        .filter(p => p.name.trim())
        .map((p, idx) => ({ id: idx + 1, name: p.name, price: p.price }));

      if (validPackages.length === 0) {
        setErrorMsg("يجب إضافة باقة واحدة على الأقل للخدمة.");
        return;
      }
      minPrice = Math.min(...validPackages.map(p => p.price));
    } else if (editServicePriceType === "dynamic") {
      minPrice = parseFloat(editServicePricePerThousand) || 0;
      validPackages = [{ id: 1, name: "شحن بالكمية", price: minPrice }];
    } else {
      validPackages = editServicePackages
        .filter(p => p.name.trim())
        .map((p, idx) => ({ id: idx + 1, name: p.name, price: p.price }));

      if (validPackages.length === 0) {
        setErrorMsg("يجب إضافة باقة واحدة على الأقل للخدمة.");
        return;
      }
      minPrice = parseFloat(editServicePricePerThousand) || 0;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/services/${editServiceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          category_id: parseInt(editServiceCatId),
          name: editServiceName,
          description: editServiceDesc,
          price: minPrice,
          image: editServiceUploadedFile || editServiceImage,
          packages: validPackages,
          fields: editServiceFields,
          price_type: editServicePriceType,
          price_per_thousand: parseFloat(editServicePricePerThousand) || 0.0,
          fields_title: editServiceFieldsTitle,
          download_link: editServiceDownloadLink,
          download_link_title: editServiceDownloadLinkTitle
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "فشل تعديل الخدمة.");
      }

      setServices(prev => prev.map(s => s.id === editServiceId ? { 
        ...s, 
        category_id: parseInt(editServiceCatId),
        name: editServiceName,
        description: editServiceDesc,
        price: minPrice,
        image: data.image,
        packages: validPackages,
        fields: data.fields,
        fields_title: data.fields_title,
        price_type: editServicePriceType,
        price_per_thousand: parseFloat(editServicePricePerThousand) || 0.0,
        download_link: data.download_link,
        download_link_title: data.download_link_title
      } : s));
      
      setShowEditServiceModal(false);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  // Add Banner handler
  const handleAddBanner = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!newBannerTitle.trim()) {
      setErrorMsg("العنوان مطلوب.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/banners`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newBannerTitle,
          highlight: newBannerHighlight,
          desc: newBannerDesc,
          badge: newBannerBadge,
          color: newBannerColor,
          icon: bannerUploadedFile || newBannerIcon
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "فشل إضافة شريحة البانر.");
      }

      setBanners(prev => [...prev, data]);
      setNewBannerTitle("");
      setNewBannerHighlight("");
      setNewBannerDesc("");
      setNewBannerBadge("");
      setNewBannerColor("#8b5cf6");
      setNewBannerIcon("⚡");
      setBannerUploadedFile(null);
      setShowBannerModal(false);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  // Open Edit Banner
  const handleOpenEditBanner = (banner) => {
    setErrorMsg("");
    setEditBannerId(banner.id);
    setEditBannerTitle(banner.title);
    setEditBannerHighlight(banner.highlight || "");
    setEditBannerDesc(banner.desc || "");
    setEditBannerBadge(banner.badge || "");
    setEditBannerColor(banner.color || "#8b5cf6");
    
    const isCustom = banner.icon && (banner.icon.startsWith("data:image") || banner.icon.startsWith("http") || banner.icon.startsWith("/uploads"));
    if (isCustom) {
      setEditBannerUploadedFile(banner.icon);
      setEditBannerIcon("⚡");
    } else {
      setEditBannerUploadedFile(null);
      setEditBannerIcon(banner.icon || "⚡");
    }
    setShowEditBannerModal(true);
  };

  // Edit Banner handler
  const handleEditBanner = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!editBannerTitle.trim()) {
      setErrorMsg("العنوان مطلوب للتحديث.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/banners/${editBannerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: editBannerTitle,
          highlight: editBannerHighlight,
          desc: editBannerDesc,
          badge: editBannerBadge,
          color: editBannerColor,
          icon: editBannerUploadedFile || editBannerIcon
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "فشل تعديل شريحة البانر.");
      }

      setBanners(prev => prev.map(b => b.id === editBannerId ? data : b));
      setEditBannerUploadedFile(null);
      setShowEditBannerModal(false);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  // Delete Banner handler
  const handleDeleteBanner = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذه الشريحة من البانر؟")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/banners/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error();

      setBanners(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      alert("فشل حذف الشريحة.");
    }
  };

  // ── WhatsApp status polling ───────────────────────────────────────────────
  const fetchWaStatus = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/whatsapp/status`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const d = await res.json();
        setWaStatus(d.status || "disconnected");
        setWaQR(d.qr || null);
      }
    } catch {}
  };

  useEffect(() => {
    if (activeTab !== "whatsapp") {
      if (waPollingRef.current) {
        clearInterval(waPollingRef.current);
        waPollingRef.current = null;
      }
      return;
    }
    // Start polling every 3 seconds when on WhatsApp tab
    const bootstrapTimer = setTimeout(() => {
      void fetchWaStatus();
    }, 0);
    const interval = setInterval(fetchWaStatus, 3000);
    waPollingRef.current = interval;
    return () => {
      clearTimeout(bootstrapTimer);
      clearInterval(interval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);
  // ─────────────────────────────────────────────────────────────────────────

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          site_name: siteName,
          site_logo: logoUploadedFile || siteLogo,
          site_favicon: faviconUploadedFile || siteFavicon,
          payment_methods: paymentMethodsList,
          supported_currencies: globalCurrencies,
          exchange_rates: exchangeRates,
          base_currency: baseCurrency,
          hide_wallet_payment: hideWalletPayment,
          whatsapp_numbers: whatsappNumbers
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "فشل تحديث الإعدادات.");
      }

      alert("تم تحديث إعدادات الموقع بنجاح!");
      window.location.reload();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleUpdateExcelSettings = async (e) => {
    if (e) e.preventDefault();
    setExcelSettingsErrorMsg("");
    setExcelSettingsSuccessMsg("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/excel/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          apple_usd_rate: excelAppleUsdRate,
          apple_markup: excelAppleMarkup,
          frp_usd_rate: excelFrpUsdRate,
          frp_markup: excelFrpMarkup
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "فشل تحديث أسعار الصرف والأرباح.");
      }

      setExcelSettingsSuccessMsg("تم حفظ الإعدادات وإعادة حساب الأسعار في قاعدة البيانات بنجاح!");
      void fetchData(); // reload categories and services
    } catch (err) {
      setExcelSettingsErrorMsg(err.message);
    }
  };

  const handleUploadExcelFile = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === 'apple') {
      setExcelAppleUploadMsg("جاري الرفع والمعالجة...");
    } else {
      setExcelFrpUploadMsg("جاري الرفع والمعالجة...");
    }
    setExcelUploadLoading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/excel/upload`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            file_name: file.name,
            file_data: reader.result,
            type: type
          })
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "فشل استيراد الملف.");
        }

        if (type === 'apple') {
          setExcelAppleUploadMsg(`✅ ${data.message}`);
        } else {
          setExcelFrpUploadMsg(`✅ ${data.message}`);
        }
        void fetchData(); // Reload services
      } catch (err) {
        if (type === 'apple') {
          setExcelAppleUploadMsg(`❌ خطأ: ${err.message}`);
        } else {
          setExcelFrpUploadMsg(`❌ خطأ: ${err.message}`);
        }
      } finally {
        setExcelUploadLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateCredentials = async (e) => {
    e.preventDefault();
    setCredentialsErrorMsg("");
    setCredentialsSuccessMsg("");

    if (!newAdminUsername && !newAdminPassword) {
      setCredentialsErrorMsg("يرجى إدخال اسم المستخدم أو كلمة المرور الجديدة.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/update-credentials`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          new_username: newAdminUsername,
          new_password: newAdminPassword
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "فشل تحديث البيانات.");
      }

      setCredentialsSuccessMsg("تم تحديث بيانات المسؤول بنجاح!");
      
      // Update local storage username if it changed
      if (adminUser) {
        const updatedUser = { ...adminUser, username: newAdminUsername };
        localStorage.setItem("admin_user", JSON.stringify(updatedUser));
        setAdminUser(updatedUser);
      }
      setNewAdminPassword("");
    } catch (err) {
      setCredentialsErrorMsg(err.message);
    }
  };

  // Filtering Logic
  const filteredOrders = Array.isArray(orders) ? orders.filter(o => {
    const query = (orderSearch || "").trim().toLowerCase();
    if (!query) return orderFilter === "all" ? true : o.status === orderFilter;
    const matchesSearch = 
      o.id.toString().includes(query) ||
      (o.service_name || "").toLowerCase().includes(query) ||
      (o.player_id || "").toLowerCase().includes(query) ||
      (o.phone || "").includes(query) ||
      (o.payment_method || "").toLowerCase().includes(query) ||
      (o.sender_phone || "").includes(query) ||
      (o.transfer_to || "").includes(query);
    
    const matchesStatus = orderFilter === "all" ? true : o.status === orderFilter;
    return matchesSearch && matchesStatus;
  }) : [];

  const filteredCategories = Array.isArray(categories) ? categories.filter(c => {
    const query = (catSearch || "").trim().toLowerCase();
    return (c.name || "").toLowerCase().includes(query);
  }) : [];

  const filteredServices = Array.isArray(services) ? services.filter(s => {
    const parentCat = Array.isArray(categories) ? categories.find(c => c.id === s.category_id) : null;
    const catName = parentCat ? parentCat.name : "";
    const query = (serviceSearch || "").trim().toLowerCase();
    return (s.name || "").toLowerCase().includes(query) || 
           catName.toLowerCase().includes(query) ||
           String(s.id).includes(query);
  }) : [];

  const filteredWalletRequests = Array.isArray(walletRequests) ? walletRequests.filter((request) => {
    const search = walletSearch.toLowerCase();
    const matchesSearch =
      request.id.toString().includes(walletSearch) ||
      (request.customer_username || "").toLowerCase().includes(search) ||
      String(request.amount).includes(walletSearch) ||
      (request.sender_phone || "").toLowerCase().includes(search) ||
      (request.method || "").toLowerCase().includes(search) ||
      (request.notes || "").toLowerCase().includes(search);

    const matchesStatus = walletFilter === "all" ? true : request.status === walletFilter;
    return matchesSearch && matchesStatus;
  }) : [];

  const filteredWalletTransactions = Array.isArray(walletTransactions) ? walletTransactions.filter((tx) => {
    const search = walletSearch.toLowerCase();
    const typeLabel = tx.type === "credit" ? "إضافة" : "خصم";
    return (
      tx.id.toString().includes(walletSearch) ||
      (tx.customer_username || "").toLowerCase().includes(search) ||
      String(tx.amount || "").includes(walletSearch) ||
      String(tx.reference_id || "").includes(walletSearch) ||
      (tx.description || "").toLowerCase().includes(search) ||
      typeLabel.toLowerCase().includes(search)
    );
  }) : [];

  const filteredCustomers = Array.isArray(customers) ? customers.filter((customer) => {
    const search = customerSearch.toLowerCase();
    return (
      customer.id.toString().includes(customerSearch) ||
      (customer.username || "").toLowerCase().includes(search) ||
      (customer.phone || "").toLowerCase().includes(search) ||
      String(customer.balance || "").includes(customerSearch)
    );
  }) : [];

  if (!hydrated) return null;

  return (
    <div className="admin-dashboard-root" dir="rtl">
      {/* Premium Styling Overrides injected globally via style tag */}
      <style>{`
        .admin-dashboard-root {
          display: grid;
          grid-template-columns: 280px minmax(0, 1fr);
          min-height: 100vh;
          background-color: #060814;
          background-image: 
            radial-gradient(circle at 5% 15%, rgba(239, 68, 68, 0.12) 0%, transparent 45%),
            radial-gradient(circle at 85% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 45%),
            radial-gradient(circle at 50% 80%, rgba(6, 182, 212, 0.08) 0%, transparent 50%);
          background-attachment: fixed;
          color: #f8fafc;
          font-family: 'Cairo', sans-serif;
          overflow-x: hidden;
        }

        /* Ambient animated aurora bg spheres */
        .admin-dashboard-root::before, .admin-dashboard-root::after {
          content: '';
          position: fixed;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
          filter: blur(120px);
          opacity: 0.45;
          mix-blend-mode: screen;
        }

        .admin-dashboard-root::before {
          top: -100px;
          right: -50px;
          background: radial-gradient(circle, rgba(239, 68, 68, 0.25) 0%, transparent 70%);
          animation: adminFloat1 25s infinite alternate ease-in-out;
        }

        .admin-dashboard-root::after {
          bottom: -100px;
          left: -50px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.22) 0%, transparent 70%);
          animation: adminFloat2 30s infinite alternate ease-in-out;
        }

        @keyframes adminFloat1 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-50px, 50px) scale(1.1); }
        }

        @keyframes adminFloat2 {
          0% { transform: translate(0, 0) scale(1.05); }
          100% { transform: translate(50px, -50px) scale(0.95); }
        }

        /* Sidebar Glass Styling */
        .premium-sidebar {
          background: rgba(10, 12, 26, 0.4);
          backdrop-filter: blur(35px) saturate(180%);
          -webkit-backdrop-filter: blur(35px) saturate(180%);
          border-left: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          padding: 30px 24px;
          height: 100vh;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .premium-logo {
          display: flex;
          align-items: center;
          gap: 14px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          margin-bottom: 25px;
        }

        .premium-logo .logo-circle {
          width: 42px;
          height: 42px;
          font-size: 1.4rem;
          font-weight: 900;
          border-radius: 14px;
          background: linear-gradient(135deg, #b91c1c 0%, #dc2626 50%, #ef4444 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
          animation: spiderPulse 2s ease-in-out infinite;
        }

        .premium-logo span {
          font-weight: 900;
          font-size: 1.2rem;
          background: linear-gradient(135deg, #ff4444 0%, #ffffff 50%, #ff2222 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: spiderNameGlow 2.5s ease-in-out infinite;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex-grow: 1;
        }

        .nav-item-premium {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 16px;
          border-radius: 14px;
          color: #94a3b8;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid transparent;
        }

        .nav-item-premium:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.03);
          transform: translateX(-4px);
        }

        .nav-item-premium.active {
          color: #ffffff;
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(244, 63, 94, 0.03) 100%);
          border-color: rgba(239, 68, 68, 0.2);
          box-shadow: 0 8px 25px rgba(239, 68, 68, 0.1);
          border-right: 3px solid #ef4444;
        }

        .nav-icon {
          font-size: 1.2rem;
          transition: transform 0.3s ease;
        }

        .nav-item-premium.active .nav-icon {
          transform: scale(1.1);
          filter: drop-shadow(0 0 8px #ef4444);
        }

        /* Content Area */
        .premium-content {
          padding: 40px;
          z-index: 1;
          position: relative;
        }

        /* Top Header */
        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 35px;
          gap: 20px;
          flex-wrap: wrap;
        }

        .header-title-section h1 {
          font-size: 2.1rem;
          font-weight: 800;
          background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.5px;
        }

        .header-title-section p {
          color: #94a3b8;
          font-size: 0.92rem;
          margin-top: 6px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        /* Stats Cards */
        .premium-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 35px;
        }

        .premium-stat-card {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 22px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
        }

        .premium-stat-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.35);
          border-color: rgba(255, 255, 255, 0.12);
        }

        .premium-stat-card::after {
          content: '';
          position: absolute;
          width: 100px;
          height: 100px;
          background: var(--glow-color, rgba(239, 68, 68, 0.12));
          filter: blur(40px);
          top: -20px;
          left: -20px;
          border-radius: 50%;
        }

        .stat-card-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
          z-index: 1;
        }

        .stat-card-title {
          font-size: 0.88rem;
          color: #94a3b8;
          font-weight: 700;
        }

        .stat-card-value {
          font-size: 1.8rem;
          font-weight: 900;
          color: #ffffff;
        }

        .stat-card-icon-wrapper {
          width: 50px;
          height: 50px;
          border-radius: 14px;
          background: var(--icon-bg, rgba(255, 255, 255, 0.02));
          border: 1px solid var(--icon-border, rgba(255, 255, 255, 0.05));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
          z-index: 1;
          color: var(--icon-color, #ffffff);
          box-shadow: var(--icon-shadow, none);
          transition: transform 0.3s ease;
        }

        .premium-stat-card:hover .stat-card-icon-wrapper {
          transform: scale(1.1) rotate(5deg);
        }

        /* Filters and Actions Bar */
        .table-filter-bar {
          background: rgba(255, 255, 255, 0.01);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 18px;
          padding: 14px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          gap: 15px;
          flex-wrap: wrap;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .search-input-wrapper {
          position: relative;
          flex-grow: 1;
          max-width: 340px;
        }

        .search-input-premium {
          width: 100%;
          background: rgba(255, 255, 255, 0.02) !important;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
          border-radius: 12px !important;
          padding: 10px 16px 10px 42px !important;
          color: white !important;
          font-size: 0.92rem !important;
          outline: none;
          transition: all 0.3s ease;
        }

        .search-input-premium:focus {
          border-color: rgba(239, 68, 68, 0.4) !important;
          background: rgba(255, 255, 255, 0.05) !important;
          box-shadow: 0 0 15px rgba(239, 68, 68, 0.15) !important;
        }

        .search-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          font-size: 1rem;
        }

        .status-tabs-wrapper {
          display: flex;
          gap: 6px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 5px;
          border-radius: 12px;
        }

        .status-tab-btn {
          background: transparent;
          border: none;
          padding: 6px 16px;
          border-radius: 8px;
          color: #94a3b8;
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .status-tab-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.02);
        }

        .status-tab-btn.active {
          background: rgba(255, 255, 255, 0.07);
          color: #ffffff;
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
        }

        /* Glass Table Design */
        .premium-table-wrapper {
          background: rgba(255, 255, 255, 0.01);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 20px;
          overflow-x: auto;
          overflow-y: hidden;
          box-shadow: 0 15px 45px rgba(0, 0, 0, 0.3);
          margin-bottom: 25px;
        }

        .premium-table {
          width: 100%;
          min-width: 1100px;
          border-collapse: collapse;
          text-align: right;
        }

        .premium-table th {
          background: rgba(255, 255, 255, 0.02);
          padding: 16px 20px;
          color: #94a3b8;
          font-weight: 700;
          font-size: 0.88rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          white-space: nowrap;
        }

        .premium-table td {
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
          font-size: 0.9rem;
          color: #cbd5e1;
          white-space: nowrap;
        }

        .premium-table tr:hover td {
          background: rgba(255, 255, 255, 0.015);
          color: #ffffff;
        }

        .premium-badge {
          display: inline-flex;
          align-items: center;
          padding: 5px 12px;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 700;
          gap: 6px;
        }

        .badge-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
        }

        .premium-badge-pending {
          background: rgba(245, 158, 11, 0.1);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.18);
        }
        .premium-badge-pending .badge-dot { background: #fbbf24; }

        .premium-badge-approved {
          background: rgba(16, 185, 129, 0.1);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.18);
        }
        .premium-badge-approved .badge-dot { background: #34d399; }

        .premium-badge-completed {
          background: rgba(16, 185, 129, 0.1);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.18);
        }
        .premium-badge-completed .badge-dot { background: #34d399; }

        .premium-badge-rejected {
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.18);
        }
        .premium-badge-rejected .badge-dot { background: #f87171; }

        .premium-badge-cancelled {
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.18);
        }
        .premium-badge-cancelled .badge-dot { background: #f87171; }

        /* Custom Action Buttons */
        .action-btn {
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          border: none;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .btn-success-premium {
          background: rgba(16, 185, 129, 0.12);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.22);
        }
        .btn-success-premium:hover {
          background: #10b981;
          color: white;
          box-shadow: 0 0 12px rgba(16, 185, 129, 0.3);
        }

        .btn-danger-premium {
          background: rgba(239, 68, 68, 0.12);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.22);
        }
        .btn-danger-premium:hover {
          background: #ef4444;
          color: white;
          box-shadow: 0 0 12px rgba(239, 68, 68, 0.3);
        }

        .btn-edit-premium {
          background: rgba(255, 255, 255, 0.03);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .btn-edit-premium:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.18);
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
        }

        .btn-add-premium {
          background: linear-gradient(135deg, #ef4444 0%, #8b5cf6 100%);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.9rem;
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.25);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }

        .btn-add-premium:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4);
        }

        /* Categories Grid Layout */
        .category-grid-premium {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
          gap: 20px;
        }

        .category-card-premium {
          background: rgba(255, 255, 255, 0.01);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 18px;
          padding: 20px;
          text-align: center;
          transition: all 0.3s ease;
          position: relative;
        }

        .category-card-premium:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
          background: rgba(255, 255, 255, 0.02);
        }

        .category-icon-big {
          font-size: 2.8rem;
          margin-bottom: 12px;
          display: inline-block;
          filter: drop-shadow(0 4px 10px rgba(239, 68, 68, 0.2));
        }

        .category-title-premium {
          font-size: 1.05rem;
          font-weight: 800;
          color: white;
          margin-bottom: 6px;
        }

        .category-slug {
          font-size: 0.72rem;
          color: #64748b;
          display: block;
          margin-bottom: 14px;
        }

        .pkg-tag {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 1px 5px;
          border-radius: 4px;
          font-size: 0.65rem;
          color: #94a3b8;
        }

        /* Modal Redone */
        .premium-overlay {
          position: fixed;
          inset: 0;
          background: rgba(3, 5, 12, 0.75);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease;
        }

        .premium-modal {
          background: #0b0c16;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(239, 68, 68, 0.08);
          border-radius: 20px;
          width: 90%;
          max-width: 500px;
          padding: 26px;
          position: relative;
          animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          max-height: 85vh;
          overflow-y: auto;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleUp {
          from { transform: scale(0.92); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .premium-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .premium-modal-title {
          font-size: 1.2rem;
          font-weight: 800;
          color: white;
        }

        .close-btn-premium {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .close-btn-premium:hover {
          background: rgba(255, 255, 255, 0.08);
          color: white;
        }

        /* Form styling inside modals */
        .premium-modal label {
          font-weight: 700;
          font-size: 0.88rem;
          color: #cbd5e1;
          margin-bottom: 6px;
          display: block;
        }

        .premium-modal select, .premium-modal textarea, .premium-modal input[type="file"], .premium-modal input[type="color"] {
          width: 100%;
          background: rgba(255, 255, 255, 0.02) !important;
          border: 1px solid rgba(255, 255, 255, 0.06) !important;
          border-radius: 10px !important;
          padding: 10px 14px !important;
          color: white !important;
          font-size: 0.9rem !important;
          outline: none;
          transition: all 0.2s ease;
        }

        .premium-modal select:focus, .premium-modal textarea:focus {
          border-color: rgba(239, 68, 68, 0.4) !important;
          background: rgba(255, 255, 255, 0.04) !important;
        }

        /* Package line items */
        .pkg-row {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-bottom: 8px;
        }

        .pkg-row input {
          background: rgba(255, 255, 255, 0.02) !important;
          border: 1px solid rgba(255, 255, 255, 0.06) !important;
          border-radius: 10px !important;
          padding: 8px 12px !important;
          color: white !important;
          font-size: 0.85rem !important;
        }

        .pkg-row input:focus {
          border-color: rgba(239, 68, 68, 0.4) !important;
          background: rgba(255, 255, 255, 0.04) !important;
        }

        /* Drawer Overlay */
        .mobile-drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(3, 5, 12, 0.6);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          z-index: 40;
          animation: fadeIn 0.3s ease;
        }

        /* Burger Button */
        .admin-burger-btn {
          display: none;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          cursor: pointer;
          color: #fff;
          font-size: 1.2rem;
          align-items: center;
          justify-content: center;
          margin-inline-end: 12px;
          transition: all 0.2s ease;
        }
        .admin-burger-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.15);
        }

        /* Mobile Drawer Container */
        .mobile-drawer {
          position: fixed;
          top: 0;
          bottom: 0;
          right: 0;
          width: 280px;
          background: rgba(10, 12, 26, 0.85);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border-left: 1px solid rgba(255, 255, 255, 0.06);
          z-index: 45;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          overflow-y: auto;
        }

        .mobile-drawer.open {
          transform: translateX(0);
        }

        .mobile-drawer.closed {
          transform: translateX(100%);
        }

        .mobile-drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .mobile-drawer-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 800;
          color: #ffffff;
        }

        .mobile-drawer-close {
          background: transparent;
          border: none;
          color: #94a3b8;
          font-size: 1.2rem;
          cursor: pointer;
        }

        .mobile-drawer-user-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 14px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .mobile-drawer-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.05);
        }

        .mobile-drawer-link {
          display: flex;
          align-items: center;
          padding: 12px 14px;
          border-radius: 10px;
          color: #cbd5e1;
          font-weight: 700;
          background: transparent;
          border: none;
          width: 100%;
          text-align: right;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mobile-drawer-link:hover {
          background: rgba(255, 255, 255, 0.03);
          color: white;
        }

        .mobile-drawer-link.active {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(244, 63, 94, 0.03) 100%);
          color: white;
          border-right: 3px solid #ef4444;
        }

        .mobile-drawer-link.danger {
          color: #f87171;
          margin-top: auto;
        }

        .user-menu-widget {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 100px;
          padding: 6px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-username {
          font-weight: 700;
          font-size: 0.88rem;
          color: #e2e8f0;
        }

        .logout-btn-text {
          font-size: 0.8rem;
          color: #ef4444;
          font-weight: bold;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }
        .logout-btn-text:hover {
          opacity: 0.8;
          text-decoration: underline;
        }

        /* Desktop Top Header Logout adjustment */
        .header-actions .user-menu-widget {
          display: flex;
        }

        /* Responsiveness */
        @media (max-width: 992px) {
          .admin-dashboard-root {
            grid-template-columns: minmax(0, 1fr);
          }
          .premium-sidebar {
            display: none !important;
          }

          .admin-burger-btn {
            display: flex;
          }

          .header-actions .user-menu-widget {
            display: none !important;
          }

          .premium-content {
            padding: 24px 20px;
            max-height: none;
          }

          .content-header {
            margin-bottom: 25px;
          }

          .premium-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .content-header {
            gap: 12px;
            margin-bottom: 25px;
          }

          .header-actions {
            width: 100%;
            display: flex;
          }

          .header-actions .btn-add-premium {
            flex-grow: 1;
            text-align: center;
            justify-content: center;
          }

          .status-tabs-wrapper {
            width: 100%;
            overflow-x: auto;
            white-space: nowrap;
            display: flex;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }

          .status-tabs-wrapper::-webkit-scrollbar {
            display: none;
          }

          .status-tab-btn {
            flex-shrink: 0;
          }

          .premium-stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .premium-stat-card {
            padding: 16px;
          }

          .stat-card-value {
            font-size: 1.4rem;
          }

          .stat-card-icon-wrapper {
            width: 40px;
            height: 40px;
            font-size: 1.25rem;
          }

          .premium-content {
            padding: 16px 12px;
          }

          .header-title-section h1 {
            font-size: 1.6rem;
          }

          .header-title-section p {
            font-size: 0.85rem;
          }

          .btn-add-premium {
            padding: 8px 14px;
            font-size: 0.82rem;
          }

          .table-filter-bar {
            padding: 12px;
            gap: 10px;
          }

          .category-grid-premium {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .category-card-premium {
            padding: 14px;
          }
        }

        @media (max-width: 768px) {
          .premium-table-wrapper {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            overflow-x: visible !important;
          }
          .premium-table, 
          .premium-table thead, 
          .premium-table tbody, 
          .premium-table th, 
          .premium-table td, 
          .premium-table tr {
            display: block !important;
            width: 100% !important;
          }
          .premium-table thead {
            display: none !important;
          }
          .premium-table tr {
            background: rgba(255, 255, 255, 0.02) !important;
            backdrop-filter: blur(20px) !important;
            border: 1px solid rgba(255, 255, 255, 0.05) !important;
            border-radius: 16px !important;
            padding: 16px !important;
            margin-bottom: 16px !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25) !important;
            transition: all 0.3s ease !important;
          }
          .premium-table tr:hover {
            border-color: rgba(239, 68, 68, 0.2) !important;
            background: rgba(255, 255, 255, 0.04) !important;
            transform: translateY(-2px);
          }
          .premium-table td {
            border: none !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.03) !important;
            padding: 10px 0 !important;
            font-size: 0.88rem !important;
            color: #cbd5e1 !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            text-align: left !important;
            white-space: normal !important;
          }
          .premium-table td:last-child {
            border-bottom: none !important;
            padding-bottom: 0 !important;
          }
          .premium-table td::before {
            content: attr(data-label) !important;
            font-weight: 800 !important;
            color: #94a3b8 !important;
            margin-left: 16px !important;
            text-align: right !important;
            font-size: 0.82rem !important;
            flex-shrink: 0 !important;
          }
        }

        @media (max-width: 420px) {
          .premium-stats-grid {
            grid-template-columns: 1fr;
          }

          .premium-modal {
            padding: 18px;
          }

          .premium-modal-title {
            font-size: 1.05rem;
          }
        }
      `}</style>

      {adminDrawerOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setAdminDrawerOpen(false)} />
      )}
      <div className={`mobile-drawer ${adminDrawerOpen ? "open" : "closed"}`}>
        <div className="mobile-drawer-header">
          <span className="mobile-drawer-title">
            <div className="logo-circle" style={{ width: "32px", height: "32px", fontSize: "1rem" }}>Z</div>
            <span>لوحة التحكم</span>
          </span>
          <button className="mobile-drawer-close" onClick={() => setAdminDrawerOpen(false)}>✕</button>
        </div>
        <div className="mobile-drawer-user-card">
          <span>🔐</span>
          <div>
            <div style={{ fontWeight: 600 }}>{adminUser?.username || "admin"}</div>
            <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>مسؤول النظام</div>
          </div>
        </div>
        <div className="mobile-drawer-divider" />
        {[
          { tab: "orders", icon: "📥", label: "طلبات الخدمات" },
          { tab: "categories", icon: "📁", label: "إدارة الأقسام" },
          { tab: "services", icon: "⚡", label: "إدارة الخدمات" },
          { tab: "banners", icon: "🖼️", label: "إدارة البانر الإعلاني" },
          { tab: "wallets", icon: "💳", label: "طلبات شحن الرصيد" },
          { tab: "customers", icon: "👥", label: "إدارة المستخدمين" },
          { tab: "settings", icon: "⚙️", label: "إعدادات الموقع" },
          { tab: "whatsapp", icon: "💬", label: "إعدادات واتساب" },
          { tab: "amrr_unlocker", icon: "🔓", label: "بوابة Amrr Unlocker" },
        ].map(item => (
          <button key={item.tab}
            className={`mobile-drawer-link ${activeTab === item.tab ? "active" : ""}`}
            onClick={() => { setActiveTab(item.tab); setAdminDrawerOpen(false); }}
          >
            <span style={{ marginInlineEnd: "10px" }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
        <div className="mobile-drawer-divider" />
        <Link href="/" className="mobile-drawer-link" onClick={() => setAdminDrawerOpen(false)}>
          <span style={{ marginInlineEnd: "10px" }}>🏠</span>
          الموقع الرئيسي
        </Link>
        <button className="mobile-drawer-link danger" onClick={handleLogout}>
          <span style={{ marginInlineEnd: "10px" }}>🚪</span>
          تسجيل الخروج
        </button>
      </div>

      {/* Sidebar */}
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
              className={`nav-item-premium ${activeTab === "whatsapp" ? "active" : ""}`}
              onClick={() => setActiveTab("whatsapp")}
              style={{ background: activeTab === "whatsapp" ? "rgba(37,211,102,0.1)" : "", borderColor: activeTab === "whatsapp" ? "rgba(37,211,102,0.3)" : "" }}
            >
              <span className="nav-icon">💬</span>
              <span>إعدادات واتساب</span>
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

      {/* Main Content */}
      <main className="premium-content">
        <header className="content-header">
          <button className="admin-burger-btn" onClick={() => setAdminDrawerOpen(true)}>☰</button>
          <div className="header-title-section">
            <h1>
              {activeTab === "orders" && "طلبات الخدمات"}
              {activeTab === "categories" && "الأقسام والتبويبات"}
                {activeTab === "services" && "الخدمات والمنتجات"}
                {activeTab === "banners" && "البانر الإعلاني الرئيسي"}
                {activeTab === "wallets" && "طلبات شحن الرصيد"}
                {activeTab === "customers" && "إدارة المستخدمين والمحافظ (العملاء)"}
                {activeTab === "settings" && "إعدادات معلومات الموقع"}
                {activeTab === "whatsapp" && "إعدادات إشعارات واتساب"}
                {activeTab === "excel_prices" && "أسعار أقسام السيرفر (APPLE & FRP)"}
              {activeTab === "amrr_unlocker" && "بوابة تفعيل ومزامنة Amrr Unlocker"}
              </h1>
              <p>
                {activeTab === "orders" && "عرض وإدارة الطلبات المدخلة من العملاء وحالة شحنها"}
                {activeTab === "categories" && "إدارة وتصنيف أقسام المتجر وتحديث أيقوناتها"}
                {activeTab === "services" && "إدارة الخدمات وتفاصيل حزم التسعير والباقات"}
                {activeTab === "banners" && "التحكم الكامل بالشرائح الإعلانية والعروض في الصفحة الرئيسية للموقع"}
                {activeTab === "wallets" && "مراجعة طلبات شحن الرصيد واعتمادها أو رفضها وتحديث رصيد العميل مباشرة"}
                {activeTab === "customers" && "إدارة حسابات العملاء المسجلين، حذف الحسابات، تعديل الأرصدة والبيانات، واستعراض سجل الحركات"}
                {activeTab === "settings" && "تعديل اسم الموقع وشعاره وأيقونة التبويب (Favicon) لتبديل الهوية البصرية للفلاتر ومحركات البحث (SEO)"}
                {activeTab === "whatsapp" && "إضافة وإدارة أرقام واتساب التي تستقبل إشعارات طلبات شحن الرصيد من العملاء"}
                {activeTab === "excel_prices" && "التحكم بأسعار صرف الدولار وهامش الأرباح واستيراد وتحديث خدمات APPLE وسيرفر FRP عبر ملفات الإكسل"}
              {activeTab === "amrr_unlocker" && "إدارة مفتاح الـ API واستيراد خدمات تخطي وحسابات Amrr Unlocker بهامش ربح مخصص وتفعيلها آلياً"}
              </p>
            </div>

          <div className="header-actions">
            <button
              onClick={() => {
                fetchData();
                alert("تم تحديث البيانات بنجاح! 🔄");
              }}
              className="btn-add-premium"
              style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "#ffffff", padding: "10px 16px", cursor: "pointer" }}
            >
              🔄 تحديث البيانات
            </button>
            <div className="user-menu-widget" style={{ marginInlineStart: "auto" }}>
              <span className="user-username">{adminUser?.username || "admin"}</span>
              <span className="logout-btn-text" onClick={handleLogout}>خروج</span>
            </div>
            {activeTab === "categories" && (
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
            {activeTab === "services" && (
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
            {activeTab === "banners" && (
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
            {activeTab === "orders" && (
              <>
                {/* Stats Counters */}
                <div className="premium-stats-grid">
                  <div className="premium-stat-card" style={{ "--glow-color": "rgba(99, 102, 241, 0.15)" }}>
                    <div className="stat-card-info">
                      <span className="stat-card-title">إجمالي الطلبات</span>
                      <span className="stat-card-value">{stats.totalOrders}</span>
                    </div>
                    <div className="stat-card-icon-wrapper" style={{ "--icon-bg": "rgba(99, 102, 241, 0.1)", "--icon-border": "rgba(99, 102, 241, 0.2)", "--icon-color": "#818cf8" }}>
                      📦
                    </div>
                  </div>

                  <div className="premium-stat-card" style={{ "--glow-color": "rgba(245, 158, 11, 0.15)" }}>
                    <div className="stat-card-info">
                      <span className="stat-card-title">قيد الانتظار</span>
                      <span className="stat-card-value">{stats.pendingOrders}</span>
                    </div>
                    <div className="stat-card-icon-wrapper" style={{ "--icon-bg": "rgba(245, 158, 11, 0.1)", "--icon-border": "rgba(245, 158, 11, 0.2)", "--icon-color": "#fbbf24" }}>
                      ⏳
                    </div>
                  </div>

                  <div className="premium-stat-card" style={{ "--glow-color": "rgba(16, 185, 129, 0.15)" }}>
                    <div className="stat-card-info">
                      <span className="stat-card-title">الطلبات المكتملة</span>
                      <span className="stat-card-value">{stats.completedOrders}</span>
                    </div>
                    <div className="stat-card-icon-wrapper" style={{ "--icon-bg": "rgba(16, 185, 129, 0.1)", "--icon-border": "rgba(16, 185, 129, 0.2)", "--icon-color": "#34d399" }}>
                      ✅
                    </div>
                  </div>

                  <div className="premium-stat-card" style={{ "--glow-color": "rgba(6, 182, 212, 0.15)" }}>
                    <div className="stat-card-info">
                      <span className="stat-card-title">الأرباح الإجمالية</span>
                      <span className="stat-card-value" style={{ color: "#22d3ee" }}>{stats.revenue.toFixed(2)} {baseCurrency}</span>
                    </div>
                    <div className="stat-card-icon-wrapper" style={{ "--icon-bg": "rgba(6, 182, 212, 0.1)", "--icon-border": "rgba(6, 182, 212, 0.2)", "--icon-color": "#22d3ee", "--icon-shadow": "0 0 15px rgba(6, 182, 212, 0.3)" }}>
                      💰
                    </div>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="table-filter-bar">
                  <div className="search-input-wrapper">
                    <input
                      type="text"
                      className="search-input-premium"
                      placeholder="ابحث برقم الطلب، الخدمة، الـ ID..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                    />
                    <span className="search-input-icon">🔍</span>
                  </div>

                  <div className="status-tabs-wrapper">
                    <button
                      className={`status-tab-btn ${orderFilter === "all" ? "active" : ""}`}
                      onClick={() => setOrderFilter("all")}
                    >
                      الكل
                    </button>
                    <button
                      className={`status-tab-btn ${orderFilter === "pending" ? "active" : ""}`}
                      onClick={() => setOrderFilter("pending")}
                    >
                      قيد الانتظار ({orders.filter(o => o.status === "pending").length})
                    </button>
                    <button
                      className={`status-tab-btn ${orderFilter === "completed" ? "active" : ""}`}
                      onClick={() => setOrderFilter("completed")}
                    >
                      المكتملة
                    </button>
                    <button
                      className={`status-tab-btn ${orderFilter === "cancelled" ? "active" : ""}`}
                      onClick={() => setOrderFilter("cancelled")}
                    >
                      الملغاة
                    </button>
                  </div>
                </div>

                {/* Orders Cards (Mobile-Friendly, No Scroll) */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {filteredOrders.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "48px", color: "#64748b", fontSize: "1rem", fontWeight: 600, background: "rgba(255,255,255,0.02)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.04)" }}>
                      لا توجد أي طلبات شحن تطابق معايير البحث.
                    </div>
                  ) : (
                    filteredOrders.map((order) => (
                      <div key={order.id} style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: "16px",
                        padding: "14px 16px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        transition: "border-color 0.2s"
                      }}>
                        {/* Row 1: Order # + Status + Date */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                          <span style={{ fontWeight: 900, color: "#38bdf8", fontSize: "1rem" }}>#{order.id}</span>
                          <span className={`premium-badge premium-badge-${order.status}`}>
                            <span className="badge-dot" />
                            {order.status === "pending" && "انتظار"}
                            {order.status === "completed" && "مكتمل"}
                            {order.status === "cancelled" && "ملغي"}
                          </span>
                          <span style={{ fontSize: "0.78rem", color: "#64748b" }}>{new Date(order.created_at).toLocaleString("ar-EG")}</span>
                        </div>

                        {/* Row 2: Customer + Service */}
                        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                          <div style={{ flex: 1, minWidth: "120px" }}>
                            <div style={{ fontSize: "0.73rem", color: "#64748b", marginBottom: "2px" }}>العميل</div>
                            <div style={{ fontWeight: 700, color: order.customer_username && order.customer_username.includes("زائر") ? "#94a3b8" : "#fbbf24", fontSize: "0.9rem" }}>
                              {order.customer_username || "زائر"}
                            </div>
                          </div>
                          <div style={{ flex: 2, minWidth: "140px" }}>
                            <div style={{ fontSize: "0.73rem", color: "#64748b", marginBottom: "2px" }}>الخدمة</div>
                            <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{order.service_name}</div>
                            <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{order.package_name} • <span style={{ color: "#34d399" }}>{Number(order.package_price || 0).toFixed(2)} {baseCurrency}</span></div>
                            {order.api_order_id && (
                              <div style={{ fontSize: "0.75rem", background: "rgba(14,165,233,0.12)", color: "#38bdf8", padding: "4px 10px", borderRadius: "8px", display: "inline-flex", gap: "6px", alignItems: "center", marginTop: "6px", fontWeight: "bold" }}>
                                <span>🔓 طلب API خارجي: #{order.api_order_id}</span>
                                <span style={{ opacity: 0.85 }}>({order.api_status || 'Pending'})</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Row 3: Actions */}
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "10px" }}>
                          <button
                            onClick={() => { setOrderDetailsData(order); setShowOrderDetailsModal(true); }}
                            className="action-btn btn-edit-premium"
                            style={{ fontSize: "0.8rem", padding: "6px 14px" }}
                          >
                            📋 تفاصيل
                          </button>
                          {order.status === "pending" && (
                            <>
                              {order.api_source === "amrr-unlocker" ? (
                                <button onClick={() => triggerUnlockerOrderApproval(order.id)} className="action-btn" style={{ background: "rgba(14,165,233,0.18)", border: "1px solid rgba(14,165,233,0.3)", color: "#0ea5e9", fontSize: "0.8rem", padding: "6px 14px", fontWeight: "bold" }}>
                                  ⚡ تفعيل Amrr Unlocker
                                </button>
                              ) : (
                                <button onClick={() => handleOpenCodeModal(order, "completed")} className="action-btn btn-success-premium">
                                  ✅ تم الشحن
                                </button>
                              )}
                              <button onClick={() => updateOrderStatus(order.id, "cancelled")} className="action-btn btn-danger-premium">
                                ❌ إلغاء
                              </button>
                            </>
                          )}
                          {order.status === "processing" && order.api_source === "amrr-unlocker" && (
                            <button onClick={() => checkUnlockerOrderStatus(order.id)} className="action-btn" style={{ background: "rgba(34,197,94,0.18)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e", fontSize: "0.8rem", padding: "6px 14px", fontWeight: "bold" }}>
                              🔄 تحديث حالة API
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenCodeModal(order, null)}
                            className="action-btn btn-edit-premium"
                            style={{ background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.2)", color: "#c084fc" }}
                          >
                            🔑 كود
                          </button>
                          <button onClick={() => deleteOrder(order.id)} className="action-btn btn-danger-premium">
                            🗑️ حذف
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div style={{ marginTop: "28px", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "18px", padding: "18px", background: "rgba(255,255,255,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", gap: "12px", flexWrap: "wrap" }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 800 }}>سجل الحركات في المحفظة</h3>
                      <p style={{ margin: "6px 0 0", color: "#94a3b8", fontSize: "0.85rem" }}>
                        كل إضافة شحن أو خصم شراء يظهر هنا مع الرصيد قبل وبعد العملية.
                      </p>
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#cbd5e1" }}>
                      إجمالي العمليات: <strong style={{ color: "#ffffff" }}>{walletTransactions.length}</strong>
                    </div>
                  </div>

                  <div className="premium-table-wrapper" style={{ marginBottom: 0 }}>
                    <table className="premium-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>العميل</th>
                          <th>النوع</th>
                          <th>المبلغ</th>
                          <th>الرصيد قبل</th>
                          <th>الرصيد بعد</th>
                          <th>المرجع</th>
                          <th>التاريخ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredWalletTransactions.length === 0 ? (
                          <tr>
                            <td colSpan="8" style={{ textAlign: "center", padding: "36px", color: "#64748b" }}>
                              لا توجد حركات محفظة مطابقة للبحث.
                            </td>
                          </tr>
                        ) : (
                          filteredWalletTransactions.map((tx) => (
                            <tr key={tx.id}>
                              <td data-label="ID" style={{ fontWeight: 800, color: tx.type === "credit" ? "#34d399" : "#f87171" }}>#{tx.id}</td>
                              <td data-label="العميل">
                                <div style={{ fontWeight: 700 }}>{tx.customer_username}</div>
                                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>ID: {tx.customer_id}</div>
                              </td>
                              <td data-label="النوع">
                                <span className={`premium-badge ${tx.type === "credit" ? "premium-badge-approved" : "premium-badge-rejected"}`}>
                                  {tx.type === "credit" ? "إضافة" : "خصم"}
                                </span>
                              </td>
                              <td data-label="المبلغ" style={{ fontWeight: 800, color: tx.type === "credit" ? "#34d399" : "#f87171" }}>
                                {Number(tx.amount || 0).toFixed(2)} {baseCurrency}
                              </td>
                              <td data-label="الرصيد قبل">{Number(tx.balance_before || 0).toFixed(2)} {baseCurrency}</td>
                              <td data-label="الرصيد بعد">{Number(tx.balance_after || 0).toFixed(2)} {baseCurrency}</td>
                              <td data-label="المرجع" style={{ fontSize: "0.85rem", color: "#cbd5e1" }}>
                                {tx.reference_type === "order" && `طلب #${tx.reference_id}`}
                                {tx.reference_type === "wallet_request" && `شحن #${tx.reference_id}`}
                                {!tx.reference_type && "-"}
                              </td>
                              <td data-label="التاريخ" style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                                {tx.created_at ? new Date(tx.created_at).toLocaleString("ar-EG") : "-"}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* Wallet Requests Section */}
              {activeTab === "wallets" && (
                <>
                <div className="premium-stats-grid">
                  <div className="premium-stat-card" style={{ "--glow-color": "rgba(6, 182, 212, 0.15)" }}>
                    <div className="stat-card-info">
                      <span className="stat-card-title">إجمالي الطلبات</span>
                      <span className="stat-card-value">{walletRequests.length}</span>
                    </div>
                    <div className="stat-card-icon-wrapper" style={{ "--icon-bg": "rgba(6, 182, 212, 0.1)", "--icon-border": "rgba(6, 182, 212, 0.2)", "--icon-color": "#22d3ee" }}>
                      💳
                    </div>
                  </div>

                  <div className="premium-stat-card" style={{ "--glow-color": "rgba(245, 158, 11, 0.15)" }}>
                    <div className="stat-card-info">
                      <span className="stat-card-title">قيد الانتظار</span>
                      <span className="stat-card-value">{walletRequests.filter(r => r.status === "pending").length}</span>
                    </div>
                    <div className="stat-card-icon-wrapper" style={{ "--icon-bg": "rgba(245, 158, 11, 0.1)", "--icon-border": "rgba(245, 158, 11, 0.2)", "--icon-color": "#fbbf24" }}>
                      ⏳
                    </div>
                  </div>

                  <div className="premium-stat-card" style={{ "--glow-color": "rgba(16, 185, 129, 0.15)" }}>
                    <div className="stat-card-info">
                      <span className="stat-card-title">تمت الموافقة</span>
                      <span className="stat-card-value">{walletRequests.filter(r => r.status === "approved").length}</span>
                    </div>
                    <div className="stat-card-icon-wrapper" style={{ "--icon-bg": "rgba(16, 185, 129, 0.1)", "--icon-border": "rgba(16, 185, 129, 0.2)", "--icon-color": "#34d399" }}>
                      ✅
                    </div>
                  </div>

                  <div className="premium-stat-card" style={{ "--glow-color": "rgba(239, 68, 68, 0.15)" }}>
                    <div className="stat-card-info">
                      <span className="stat-card-title">مرفوضة</span>
                      <span className="stat-card-value">{walletRequests.filter(r => r.status === "rejected").length}</span>
                    </div>
                    <div className="stat-card-icon-wrapper" style={{ "--icon-bg": "rgba(239, 68, 68, 0.1)", "--icon-border": "rgba(239, 68, 68, 0.2)", "--icon-color": "#f87171" }}>
                      ❌
                    </div>
                  </div>
                </div>

                <div className="table-filter-bar">
                  <div className="search-input-wrapper">
                    <input
                      type="text"
                      className="search-input-premium"
                      placeholder="ابحث بالاسم، المبلغ، الملاحظة..."
                      value={walletSearch}
                      onChange={(e) => setWalletSearch(e.target.value)}
                    />
                    <span className="search-input-icon">🔍</span>
                  </div>

                  <div className="status-tabs-wrapper">
                    <button className={`status-tab-btn ${walletFilter === "all" ? "active" : ""}`} onClick={() => setWalletFilter("all")}>الكل</button>
                    <button className={`status-tab-btn ${walletFilter === "pending" ? "active" : ""}`} onClick={() => setWalletFilter("pending")}>قيد الانتظار</button>
                    <button className={`status-tab-btn ${walletFilter === "approved" ? "active" : ""}`} onClick={() => setWalletFilter("approved")}>مقبولة</button>
                    <button className={`status-tab-btn ${walletFilter === "rejected" ? "active" : ""}`} onClick={() => setWalletFilter("rejected")}>مرفوضة</button>
                  </div>
                </div>

                <div className="premium-table-wrapper">
                  <table className="premium-table">
                    <thead>
                      <tr>
                        <th>رقم الطلب</th>
                        <th>العميل</th>
                        <th>المبلغ</th>
                        <th>رقم التحويل</th>
                        <th>ملاحظات</th>
                        <th>تاريخ الطلب</th>
                        <th>الحالة</th>
                        <th style={{ textAlign: "center" }}>الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredWalletRequests.length === 0 ? (
                        <tr>
                          <td colSpan="8" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                            لا توجد طلبات شحن رصيد تطابق معايير البحث.
                          </td>
                        </tr>
                      ) : (
                        filteredWalletRequests.map((request) => (
                          <tr key={request.id}>
                            <td data-label="رقم الطلب" style={{ fontWeight: 800, color: "#38bdf8" }}>#{request.id}</td>
                            <td data-label="العميل">
                              <div style={{ fontWeight: 700 }}>{request.customer_username}</div>
                              <div style={{ fontSize: "0.75rem", color: "#64748b" }}>ID: {request.customer_id}</div>
                            </td>
                            <td data-label="المبلغ" style={{ fontWeight: 800, color: "#34d399" }}>
                              $ {Number(request.amount).toFixed(2)} USD
                              {request.currency && request.currency !== 'USD' && (
                                <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "2px" }}>
                                  الدفع: {request.currency}
                                </div>
                              )}
                            </td>
                            <td data-label="رقم التحويل" style={{ direction: "ltr" }}>{request.sender_phone || "-"}</td>
                            <td data-label="ملاحظات" style={{ maxWidth: "220px", color: "#cbd5e1" }}>{request.notes ? request.notes.replace(/^\[تم تحويل:[^\]]+\]\s*/, "") : "-"}</td>
                            <td data-label="تاريخ الطلب" style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                              {new Date(request.created_at).toLocaleString("ar-EG")}
                            </td>
                            <td data-label="الحالة">
                              <span className={`premium-badge premium-badge-${request.status}`}>
                                <span className="badge-dot" />
                                {request.status === "pending" && "انتظار"}
                                {request.status === "approved" && "مقبول"}
                                {request.status === "rejected" && "مرفوض"}
                              </span>
                            </td>
                            <td data-label="الإجراءات" style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                              {request.status === "pending" ? (
                                <>
                                  <button
                                    onClick={() => updateWalletRequestStatus(request.id, "approved")}
                                    className="action-btn btn-success-premium"
                                  >
                                    <span>اعتماد</span>
                                  </button>
                                  <button
                                    onClick={() => updateWalletRequestStatus(request.id, "rejected")}
                                    className="action-btn btn-danger-premium"
                                  >
                                    <span>رفض</span>
                                  </button>
                                </>
                              ) : (
                                <span style={{ color: "#475569", fontSize: "0.85rem", fontWeight: 600 }}>
                                  {request.processed_at ? new Date(request.processed_at).toLocaleString("ar-EG") : "منتهي"}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  </div>
                </>
              )}

              {/* Customers Section */}
              {activeTab === "customers" && (
                <>
                  <div className="premium-stats-grid">
                    <div className="premium-stat-card" style={{ "--glow-color": "rgba(59, 130, 246, 0.15)" }}>
                      <div className="stat-card-info">
                        <span className="stat-card-title">عدد العملاء</span>
                        <span className="stat-card-value">{customers.length}</span>
                      </div>
                      <div className="stat-card-icon-wrapper" style={{ "--icon-bg": "rgba(59, 130, 246, 0.1)", "--icon-border": "rgba(59, 130, 246, 0.2)", "--icon-color": "#60a5fa" }}>
                        👥
                      </div>
                    </div>

                    <div className="premium-stat-card" style={{ "--glow-color": "rgba(16, 185, 129, 0.15)" }}>
                      <div className="stat-card-info">
                        <span className="stat-card-title">إجمالي أرصدة العملاء</span>
                        <span className="stat-card-value" style={{ fontSize: "1.1rem", display: "block", direction: "rtl", whiteSpace: "normal", marginTop: "4px" }}>
                          {(() => {
                            const egpSum = customers.reduce((sum, c) => sum + Number(c.balance || 0), 0);
                            let result = [`${egpSum.toFixed(2)} ${baseCurrency}`];
                            const currencySums = {};
                            customers.forEach(c => {
                              let customerBalances = {};
                              if (c.balances) {
                                customerBalances = typeof c.balances === 'string' ? JSON.parse(c.balances) : c.balances;
                              }
                              if (customerBalances && typeof customerBalances === 'object') {
                                Object.entries(customerBalances).forEach(([curr, val]) => {
                                  currencySums[curr] = (currencySums[curr] || 0) + Number(val || 0);
                                });
                              }
                            });
                            Object.entries(currencySums).forEach(([curr, val]) => {
                              result.push(`${val.toFixed(2)} ${curr}`);
                            });
                            return result.join(" | ");
                          })()}
                        </span>
                      </div>
                      <div className="stat-card-icon-wrapper" style={{ "--icon-bg": "rgba(16, 185, 129, 0.1)", "--icon-border": "rgba(16, 185, 129, 0.2)", "--icon-color": "#34d399" }}>
                        💰
                      </div>
                    </div>

                    <div className="premium-stat-card" style={{ "--glow-color": "rgba(139, 92, 246, 0.15)" }}>
                      <div className="stat-card-info">
                        <span className="stat-card-title">المعاملات المسجلة</span>
                        <span className="stat-card-value">{walletTransactions.length}</span>
                      </div>
                      <div className="stat-card-icon-wrapper" style={{ "--icon-bg": "rgba(139, 92, 246, 0.1)", "--icon-border": "rgba(139, 92, 246, 0.2)", "--icon-color": "#c084fc" }}>
                        🧾
                      </div>
                    </div>
                  </div>

                  <div className="table-filter-bar">
                    <div className="search-input-wrapper">
                      <input
                        type="text"
                        className="search-input-premium"
                        placeholder="ابحث بالاسم أو الهاتف أو الرصيد..."
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                      />
                      <span className="search-input-icon">🔍</span>
                    </div>
                  </div>

                  <div className="premium-table-wrapper">
                    <table className="premium-table">
                      <thead>
                        <tr>
                          <th>رقم العميل</th>
                          <th>اسم المستخدم</th>
                          <th>البريد الإلكتروني</th>
                          <th>الهاتف</th>
                          <th>كلمة المرور</th>
                          <th>الرصيد</th>
                          <th>الحالة</th>
                          <th style={{ textAlign: "center" }}>الاختيار</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCustomers.length === 0 ? (
                          <tr>
                            <td colSpan="8" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                              لا يوجد عملاء يطابقون البحث.
                            </td>
                          </tr>
                        ) : (
                          filteredCustomers.map((customer) => (
                            <tr key={customer.id}>
                              <td data-label="رقم العميل" style={{ fontWeight: 800, color: "#38bdf8" }}>#{customer.id}</td>
                              <td data-label="اسم المستخدم" style={{ fontWeight: 700 }}>{customer.username}</td>
                              <td data-label="البريد الإلكتروني" style={{ fontWeight: 700 }}>{customer.email || "-"}</td>
                              <td data-label="الهاتف" style={{ direction: "ltr", fontWeight: 700 }}>{customer.phone || "-"}</td>
                              <td data-label="كلمة المرور" style={{ color: "#94a3b8", fontWeight: 700 }}>{customer.password_masked || "مخفية"}</td>
                              <td data-label="الرصيد" style={{ fontWeight: 800, color: "#34d399" }}>{Number(customer.balance || 0).toFixed(2)} {baseCurrency}</td>
                              <td data-label="الحالة">
                                <span className={`premium-badge ${Number(customer.balance || 0) > 0 ? "premium-badge-approved" : "premium-badge-pending"}`}>
                                  {Number(customer.balance || 0) > 0 ? "يوجد رصيد" : "صفر"}
                                </span>
                              </td>
                              <td data-label="الاختيار" style={{ textAlign: "center" }}>
                                <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
                                  <button
                                    type="button"
                                    className="action-btn btn-success-premium"
                                    onClick={() => setSelectedCustomerId(customer.id)}
                                  >
                                    عرض السجل
                                  </button>
                                  <button
                                    type="button"
                                    className="action-btn"
                                    style={{ background: "rgba(59, 130, 246, 0.12)", color: "#93c5fd", border: "1px solid rgba(59, 130, 246, 0.22)" }}
                                    onClick={() => handleOpenEditCustomer(customer)}
                                  >
                                    تعديل
                                  </button>
                                  <button
                                    type="button"
                                    className="action-btn btn-danger-premium"
                                    onClick={() => handleDeleteCustomer(customer.id)}
                                  >
                                    حذف
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ marginTop: "28px", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "18px", padding: "18px", background: "rgba(255,255,255,0.02)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", gap: "12px", flexWrap: "wrap" }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 800 }}>سجل معاملات العميل</h3>
                        <p style={{ margin: "6px 0 0", color: "#94a3b8", fontSize: "0.85rem" }}>
                          {selectedCustomerId ? "يعرض التحويلات والخصومات الخاصة بالعميل المختار." : "اختر عميلًا لعرض سجله."}
                        </p>
                      </div>
                    </div>

                    <div className="premium-table-wrapper" style={{ marginBottom: 0 }}>
                      <table className="premium-table">
                        <thead>
                          <tr>
                            <th>النوع</th>
                            <th>المبلغ</th>
                            <th>الرصيد قبل</th>
                            <th>الرصيد بعد</th>
                            <th>المرجع</th>
                            <th>الوصف</th>
                            <th>التاريخ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedCustomerTransactions.length === 0 ? (
                            <tr>
                              <td colSpan="7" style={{ textAlign: "center", padding: "36px", color: "#64748b" }}>
                                لا توجد معاملات لهذا العميل بعد.
                              </td>
                            </tr>
                          ) : (
                            selectedCustomerTransactions.map((tx) => (
                              <tr key={tx.id}>
                                <td data-label="النوع">
                                  <span className={`premium-badge ${tx.type === "credit" ? "premium-badge-approved" : "premium-badge-rejected"}`}>
                                    {tx.type === "credit" ? "إضافة" : "خصم"}
                                  </span>
                                </td>
                                <td data-label="المبلغ" style={{ fontWeight: 800, color: tx.type === "credit" ? "#34d399" : "#f87171" }}>
                                  {Number(tx.amount || 0).toFixed(2)} {baseCurrency}
                                </td>
                                <td data-label="الرصيد قبل">{Number(tx.balance_before || 0).toFixed(2)} {baseCurrency}</td>
                                <td data-label="الرصيد بعد">{Number(tx.balance_after || 0).toFixed(2)} {baseCurrency}</td>
                                <td data-label="المرجع" style={{ fontSize: "0.85rem", color: "#cbd5e1" }}>
                                  {tx.reference_type === "order" && `طلب #${tx.reference_id}`}
                                  {tx.reference_type === "order_refund" && `استرداد #${tx.reference_id}`}
                                  {tx.reference_type === "wallet_request" && `شحن #${tx.reference_id}`}
                                  {!tx.reference_type && "-"}
                                </td>
                                <td data-label="الوصف" style={{ color: "#e2e8f0" }}>{tx.description || "-"}</td>
                                <td data-label="التاريخ" style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                                  {tx.created_at ? new Date(tx.created_at).toLocaleString("ar-EG") : "-"}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {/* Categories Section */}
              {activeTab === "categories" && (
                <>
                <div className="table-filter-bar" style={{ justifyContent: "flex-start" }}>
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
                          🏷️ قسم فرعي من: {categories.find(c => c.id === Number(cat.parent_id))?.name || "قسم رئيسي"}
                        </span>
                      ) : (
                        <span style={{ display: "inline-block", marginTop: "6px", padding: "4px 10px", borderRadius: "100px", background: "rgba(16, 185, 129, 0.15)", color: "#34d399", fontSize: "0.8rem", fontWeight: "600", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                          📁 قسم رئيسي
                        </span>
                      )}
                      
                      <div style={{ marginTop: "15px", display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => handleOpenEditCat(cat)}
                          className="action-btn btn-edit-premium"
                          style={{ flex: 1, justifyContent: "center" }}
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="action-btn btn-danger-premium"
                          style={{ flex: 1, justifyContent: "center" }}
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Services Section */}
            {activeTab === "services" && (
              <>
                <div className="table-filter-bar" style={{ justifyContent: "flex-start" }}>
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
                          const parentCat = categories.find(c => c.id === service.category_id);
                          // Parse packages if stored as JSON string
                          let parsedPackages = [];
                          try {
                            parsedPackages = typeof service.packages === 'string' 
                              ? JSON.parse(service.packages) 
                              : service.packages;
                          } catch(e) {
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
                                          {pkg.name} ({parentCat && parentCat.currency === 'USD' ? `$${pkg.usd_price || pkg.price}` : `${pkg.price} ج.م`})
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
                                        {pkg.name} ({parentCat && parentCat.currency === 'USD' ? `$${pkg.usd_price || pkg.price}` : `${pkg.price} ج.م`})
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
                                {parentCat && parentCat.currency === 'USD' ? (
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
                                  <button
                                    onClick={() => handleOpenEditService(service)}
                                    className="action-btn btn-edit-premium"
                                  >
                                    تعديل
                                  </button>
                                  <button
                                    onClick={() => handleDeleteService(service.id)}
                                    className="action-btn btn-danger-premium"
                                  >
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
            )}

            {/* Banners Section */}
            {activeTab === "banners" && (
              <>
                <div className="table-filter-bar" style={{ justifyContent: "flex-start" }}>
                  <div className="search-input-wrapper">
                    <input
                      type="text"
                      className="search-input-premium"
                      placeholder="ابحث باسم الشريحة..."
                      value={bannerSearch}
                      onChange={(e) => setBannerSearch(e.target.value)}
                    />
                    <span className="search-input-icon">🔍</span>
                  </div>
                </div>

                <div className="premium-table-wrapper">
                  <table className="premium-table">
                    <thead>
                      <tr>
                        <th>رقم الشريحة</th>
                        <th>الشريحة / العنوان</th>
                        <th>الوصف</th>
                        <th>الشارة / الخصم</th>
                        <th>الرمز / اللون</th>
                        <th style={{ textAlign: "center" }}>الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {banners.filter(b => b.title.toLowerCase().includes(bannerSearch.toLowerCase())).length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                            لا توجد شرائح إعلانية مضافة حالياً.
                          </td>
                        </tr>
                      ) : (
                        banners.filter(b => b.title.toLowerCase().includes(bannerSearch.toLowerCase())).map((banner) => (
                          <tr key={banner.id}>
                            <td data-label="رقم الشريحة" style={{ fontWeight: 800, color: "#38bdf8" }}>#{banner.id}</td>
                            <td data-label="الشريحة / العنوان">
                              <div style={{ fontWeight: 700 }}>{banner.title}</div>
                              <div style={{ fontSize: "0.85rem", color: banner.color || "#8b5cf6", fontWeight: "bold" }}>
                                {banner.highlight}
                              </div>
                            </td>
                            <td data-label="الوصف" style={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {banner.desc}
                            </td>
                            <td data-label="الشارة / الخصم">
                              {banner.badge ? (
                                <span className="premium-badge" style={{ background: `${banner.color || '#8b5cf6'}22`, color: banner.color || '#8b5cf6', border: `1px solid ${banner.color || '#8b5cf6'}33` }}>
                                  {banner.badge}
                                </span>
                              ) : (
                                <span style={{ color: "#64748b" }}>لا يوجد</span>
                              )}
                            </td>
                            <td data-label="الرمز / اللون">
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                {banner.icon && (banner.icon.startsWith("data:image") || banner.icon.startsWith("http") || banner.icon.startsWith("/uploads")) ? (
                                  <img src={banner.icon.startsWith("/uploads") ? `${API_BASE_URL}${banner.icon}` : banner.icon} alt={banner.title} style={{ width: "35px", height: "35px", objectFit: "contain", borderRadius: "6px" }} />
                                ) : (
                                  <span style={{ fontSize: "1.4rem" }}>{banner.icon}</span>
                                )}
                                <span style={{ width: "16px", height: "16px", borderRadius: "50%", background: banner.color || "#8b5cf6", display: "inline-block", border: "1px solid rgba(255,255,255,0.1)" }} />
                              </div>
                            </td>
                            <td data-label="الإجراءات" style={{ textAlign: "center" }}>
                              <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                                <button
                                  onClick={() => handleOpenEditBanner(banner)}
                                  className="action-btn btn-edit-premium"
                                >
                                  تعديل
                                </button>
                                <button
                                  onClick={() => handleDeleteBanner(banner.id)}
                                  className="action-btn btn-danger-premium"
                                >
                                  حذف
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Settings Section */}
            {activeTab === "settings" && (
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
                            <option value="QAR">QAR (الريال القطري)</option>
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
            )}
          </>
        )}

        {/* ===================== WhatsApp TAB ===================== */}
        {activeTab === "whatsapp" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "680px" }}>

            {/* Connection Status Card */}
            <div style={{ background: "rgba(37,211,102,0.05)", border: "1px solid rgba(37,211,102,0.2)", borderRadius: "20px", padding: "28px", backdropFilter: "blur(25px)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "linear-gradient(135deg,#25d366,#128c7e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", boxShadow: "0 4px 15px rgba(37,211,102,0.3)" }}>💬</div>
                <div>
                  <h3 style={{ fontWeight: 900, fontSize: "1.1rem", color: "#fff", margin: 0 }}>ربط واتساب البوت</h3>
                  <p style={{ color: "#64748b", fontSize: "0.82rem", margin: "4px 0 0" }}>امسح QR Code بتطبيق واتساب لربط الحساب وإرسال الإشعارات تلقائياً</p>
                </div>
              </div>

              {/* Status badge */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "30px",
                  background: waStatus === "ready" ? "rgba(37,211,102,0.15)" : waStatus === "qr" ? "rgba(250,204,21,0.15)" : waStatus === "loading" ? "rgba(96,165,250,0.15)" : "rgba(239,68,68,0.1)",
                  border: `1px solid ${waStatus === "ready" ? "rgba(37,211,102,0.3)" : waStatus === "qr" ? "rgba(250,204,21,0.3)" : waStatus === "loading" ? "rgba(96,165,250,0.3)" : "rgba(239,68,68,0.2)"}`,
                  color: waStatus === "ready" ? "#34d399" : waStatus === "qr" ? "#facc15" : waStatus === "loading" ? "#60a5fa" : "#f87171",
                  fontWeight: "bold", fontSize: "0.9rem"
                }}>
                  <span>{waStatus === "ready" ? "🟢" : waStatus === "qr" ? "🟡" : waStatus === "loading" ? "🔵" : "🔴"}</span>
                  <span>
                    {waStatus === "ready" ? "متصل ويعمل" : waStatus === "qr" ? "في انتظار مسح QR Code" : waStatus === "loading" ? "جاري التهيئة..." : "غير متصل"}
                  </span>
                </div>
              </div>

              {/* QR Code */}
              {waStatus === "qr" && waQR && (
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <div style={{ display: "inline-block", padding: "16px", background: "#ffffff", borderRadius: "16px", boxShadow: "0 8px 30px rgba(0,0,0,0.3)" }}>
                    <img src={waQR} alt="WhatsApp QR Code" style={{ width: "220px", height: "220px", display: "block" }} />
                  </div>
                  <div style={{ marginTop: "14px", color: "#fbbf24", fontWeight: "bold", fontSize: "0.9rem" }}>
                    📱 افتح واتساب → الإعدادات → الأجهزة المرتبطة → ربط جهاز → امسح الكود
                  </div>
                </div>
              )}

              {waStatus === "loading" && (
                <div style={{ textAlign: "center", padding: "30px", color: "#60a5fa" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "8px", animation: "spin 1s linear infinite", display: "inline-block" }}>⏳</div>
                  <div style={{ fontWeight: "bold" }}>جاري تحميل الجلسة... انتظر لحظة</div>
                </div>
              )}

              {waStatus === "ready" && (
                <div style={{ textAlign: "center", padding: "20px", background: "rgba(37,211,102,0.08)", borderRadius: "14px", border: "1px solid rgba(37,211,102,0.2)", marginBottom: "20px" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "8px" }}>✅</div>
                  <div style={{ color: "#34d399", fontWeight: "bold" }}>واتساب البوت متصل ويعمل بشكل تلقائي</div>
                  <div style={{ color: "#64748b", fontSize: "0.8rem", marginTop: "6px" }}>سيُرسل وصل التحويل وتفاصيل كل طلب شحن تلقائياً</div>
                </div>
              )}

              {waStatus === "disconnected" && (
                <div style={{ textAlign: "center", padding: "20px", marginBottom: "16px" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>📵</div>
                  <div style={{ color: "#94a3b8", fontSize: "0.88rem" }}>اضغط &quot;تشغيل البوت&quot; ثم امسح QR Code</div>
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {waStatus === "disconnected" || waStatus === "loading" ? (
                  <button
                    type="button"
                    onClick={async () => {
                      setWaStatus("loading");
                      try {
                        await fetch(`${API_BASE_URL}/api/whatsapp/start`, {
                          method: "POST",
                          headers: { "Authorization": `Bearer ${token}` }
                        });
                        setTimeout(fetchWaStatus, 2000);
                      } catch { setWaStatus("disconnected"); }
                    }}
                    style={{ flex: 1, padding: "13px 20px", background: "linear-gradient(135deg,#25d366,#128c7e)", border: "none", borderRadius: "12px", color: "#fff", fontWeight: 800, fontSize: "0.95rem", cursor: "pointer" }}
                  >
                    ▶ تشغيل البوت وعرض QR
                  </button>
                ) : null}

                {waStatus === "qr" && (
                  <button
                    type="button"
                    onClick={fetchWaStatus}
                    style={{ flex: 1, padding: "13px 20px", background: "rgba(250,204,21,0.15)", border: "1px solid rgba(250,204,21,0.3)", borderRadius: "12px", color: "#facc15", fontWeight: 800, fontSize: "0.95rem", cursor: "pointer" }}
                  >
                    🔄 تحديث QR Code
                  </button>
                )}

                {(waStatus === "ready" || waStatus === "qr" || waStatus === "loading") && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (!confirm("هل تريد قطع الاتصال ومسح الجلسة؟")) return;
                      await fetch(`${API_BASE_URL}/api/whatsapp/logout`, {
                        method: "POST",
                        headers: { "Authorization": `Bearer ${token}` }
                      });
                      setWaStatus("disconnected");
                      setWaQR(null);
                    }}
                    style={{ padding: "13px 20px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", color: "#f87171", fontWeight: 800, fontSize: "0.9rem", cursor: "pointer" }}
                  >
                    🔌 قطع الاتصال
                  </button>
                )}
              </div>
            </div>

            {/* Numbers management card */}
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "28px", backdropFilter: "blur(25px)" }}>
              <h3 style={{ fontWeight: 900, fontSize: "1rem", color: "#fff", marginBottom: "16px" }}>📋 أرقام واتساب التي ترسل إليها الإشعارات</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                {whatsappNumbers.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "24px", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px dashed rgba(255,255,255,0.08)", color: "#64748b", fontSize: "0.88rem" }}>
                    📭 لا توجد أرقام مضافة بعد
                  </div>
                ) : whatsappNumbers.map((num, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(37,211,102,0.05)", border: "1px solid rgba(37,211,102,0.12)", padding: "12px 16px", borderRadius: "12px" }}>
                    <span style={{ fontSize: "1rem" }}>💬</span>
                    <span style={{ flex: 1, fontFamily: "monospace", color: "#34d399", fontWeight: "bold", direction: "ltr" }}>+{num}</span>
                    <button
                      type="button"
                      onClick={async () => {
                        const updated = whatsappNumbers.filter((_, idx) => idx !== i);
                        setWhatsappNumbers(updated);
                        await fetch(`${API_BASE_URL}/api/settings`, {
                          method: "PUT",
                          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                          body: JSON.stringify({ whatsapp_numbers: updated })
                        });
                      }}
                      className="action-btn btn-danger-premium"
                      style={{ padding: "5px 10px" }}
                    >
                      حذف
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="tel"
                  value={newWhatsappNumber}
                  onChange={(e) => setNewWhatsappNumber(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="201012345678"
                  className="search-input-premium"
                  style={{ flex: 1, padding: "11px 14px", direction: "ltr", letterSpacing: "0.5px" }}
                />
                <button
                  type="button"
                  onClick={async () => {
                    const clean = newWhatsappNumber.replace(/[^0-9]/g, "");
                    if (clean.length < 8) { alert("يرجى إدخال رقم صحيح بالصيغة الدولية (مثال: 201012345678)"); return; }
                    if (whatsappNumbers.includes(clean)) { alert("هذا الرقم مضاف بالفعل!"); return; }
                    const updated = [...whatsappNumbers, clean];
                    setWhatsappNumbers(updated);
                    setNewWhatsappNumber("");
                    await fetch(`${API_BASE_URL}/api/settings`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                      body: JSON.stringify({ whatsapp_numbers: updated })
                    });
                    alert("✅ تم حفظ الرقم!");
                  }}
                  style={{ padding: "11px 20px", background: "linear-gradient(135deg,#25d366,#128c7e)", border: "none", borderRadius: "12px", color: "#fff", fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  + إضافة
                </button>
              </div>
              <div style={{ marginTop: "8px", fontSize: "0.76rem", color: "#64748b" }}>
                الصيغة الدولية بدون + مثال: <span style={{ color: "#34d399", fontFamily: "monospace" }}>201012345678</span>
              </div>
            </div>

            {/* Info card */}
            <div style={{ background: "rgba(96,165,250,0.05)", border: "1px solid rgba(96,165,250,0.15)", borderRadius: "16px", padding: "20px", fontSize: "0.85rem", color: "#cbd5e1", lineHeight: "1.8" }}>
              <div style={{ fontWeight: "bold", color: "#60a5fa", marginBottom: "10px" }}>💡 كيف يعمل البوت تلقائياً؟</div>
              <ul style={{ paddingRight: "20px", margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                <li>امسح QR Code بواتساب لربط الحساب</li>
                <li>عندما يرسل العميل طلب شحن: <strong>يُرسَل إليك الطلب + صورة الوصل تلقائياً</strong></li>
                <li>الرسالة تحتوي على: اسم العميل، المبلغ، العملة، رقم التحويل، رقم الطلب #ID</li>
                <li>راجع الطلب في <strong>طلبات شحن الرصيد</strong> واعتمده أو ارفضه</li>
                <li>إذا كان البوت غير متصل → يظهر للعميل خيار الإرسال اليدوي عبر واتساب</li>
              </ul>
            </div>
          </div>
        )}

            {/* Excel & Server Prices Tab */}
            {activeTab === "excel_prices" && (
              <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "30px", width: "100%" }}>
                
                {/* Exchange Rates & Markup Config */}
                <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "20px", padding: "30px", backdropFilter: "blur(25px)" }}>
                  <h3 style={{ fontWeight: 800, fontSize: "1.25rem", marginBottom: "20px", color: "#a855f7", display: "flex", alignItems: "center", gap: "8px" }}>
                    ⚙️ إعدادات أسعار الصرف ونسب الأرباح للقسمين
                  </h3>
                  
                  {excelSettingsSuccessMsg && (
                    <div style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.2)", color: "#4ade80", padding: "12px 18px", borderRadius: "12px", marginBottom: "20px", fontSize: "0.9rem" }}>
                      {excelSettingsSuccessMsg}
                    </div>
                  )}
                  {excelSettingsErrorMsg && (
                    <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#f87171", padding: "12px 18px", borderRadius: "12px", marginBottom: "20px", fontSize: "0.9rem" }}>
                      {excelSettingsErrorMsg}
                    </div>
                  )}

                  <form onSubmit={handleUpdateExcelSettings} style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                      {/* Apple Card */}
                      <div style={{ background: "rgba(168, 85, 247, 0.03)", border: "1px solid rgba(168, 85, 247, 0.15)", borderRadius: "16px", padding: "20px" }}>
                        <h4 style={{ color: "#a855f7", fontWeight: 800, marginBottom: "15px", display: "flex", alignItems: "center", gap: "6px" }}>
                          🍎 قسم خدمات APPLE
                        </h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ display: "block", marginBottom: "6px", fontSize: "0.85rem", color: "#cbd5e1" }}>سعر صرف الدولار (ج.م):</label>
                            <input
                              type="number"
                              step="any"
                              value={excelAppleUsdRate}
                              onChange={(e) => setExcelAppleUsdRate(parseFloat(e.target.value) || 0)}
                              className="search-input-premium"
                              style={{ padding: "10px 14px !important" }}
                              required
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ display: "block", marginBottom: "6px", fontSize: "0.85rem", color: "#cbd5e1" }}>نسبة الربح المضافة (%):</label>
                            <input
                              type="number"
                              step="any"
                              value={excelAppleMarkup}
                              onChange={(e) => setExcelAppleMarkup(parseFloat(e.target.value) || 0)}
                              className="search-input-premium"
                              style={{ padding: "10px 14px !important" }}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* FRP Card */}
                      <div style={{ background: "rgba(16, 185, 129, 0.03)", border: "1px solid rgba(16, 185, 129, 0.15)", borderRadius: "16px", padding: "20px" }}>
                        <h4 style={{ color: "#10b981", fontWeight: 800, marginBottom: "15px", display: "flex", alignItems: "center", gap: "6px" }}>
                          🤖 قسم خدمات سيرفر FRP
                        </h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ display: "block", marginBottom: "6px", fontSize: "0.85rem", color: "#cbd5e1" }}>سعر صرف الدولار (ج.م):</label>
                            <input
                              type="number"
                              step="any"
                              value={excelFrpUsdRate}
                              onChange={(e) => setExcelFrpUsdRate(parseFloat(e.target.value) || 0)}
                              className="search-input-premium"
                              style={{ padding: "10px 14px !important" }}
                              required
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ display: "block", marginBottom: "6px", fontSize: "0.85rem", color: "#cbd5e1" }}>نسبة الربح المضافة (%):</label>
                            <input
                              type="number"
                              step="any"
                              value={excelFrpMarkup}
                              onChange={(e) => setExcelFrpMarkup(parseFloat(e.target.value) || 0)}
                              className="search-input-premium"
                              style={{ padding: "10px 14px !important" }}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn-add-premium"
                      style={{ padding: "14px 28px", background: "linear-gradient(135deg, #a855f7, #7c3aed)", border: "none", color: "#ffffff", fontWeight: 800, borderRadius: "12px", cursor: "pointer", width: "100%" }}
                    >
                      💾 حفظ الإعدادات وإعادة حساب الأسعار في الموقع
                    </button>
                  </form>
                </div>

                {/* Import Excel Sheets Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
                  
                  {/* Upload Apple Sheet */}
                  <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "20px", padding: "30px", backdropFilter: "blur(25px)", display: "flex", flexDirection: "column", gap: "20px" }}>
                    <h3 style={{ fontWeight: 800, fontSize: "1.1rem", color: "#a855f7", margin: 0 }}>
                      📥 استيراد وتحديث خدمات APPLE
                    </h3>
                    <p style={{ color: "#94a3b8", fontSize: "0.85rem", lineHeight: "1.6", margin: 0 }}>
                      قم برفع ملف الإكسل الخاص بمنتجات آبل لتحديث قائمة الخدمات والباقات فوراً. سيتم مسح الخدمات القديمة في القسم واستبدالها بالجديدة.
                    </p>
                    
                    <div style={{ border: "2px dashed rgba(168, 85, 247, 0.3)", borderRadius: "14px", padding: "30px 20px", textAlign: "center", position: "relative", background: "rgba(168, 85, 247, 0.01)" }}>
                      <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "10px" }}>🍏</span>
                      <label style={{ cursor: "pointer", background: "rgba(168, 85, 247, 0.15)", border: "1px solid rgba(168, 85, 247, 0.3)", padding: "10px 20px", borderRadius: "10px", color: "#c084fc", fontWeight: "bold", fontSize: "0.88rem", display: "inline-block" }}>
                        اختر ملف iphone.xlsx
                        <input
                          type="file"
                          accept=".xlsx, .xls"
                          onChange={(e) => handleUploadExcelFile(e, 'apple')}
                          style={{ display: "none" }}
                          disabled={excelUploadLoading}
                        />
                      </label>
                    </div>
                    {excelAppleUploadMsg && (
                      <div style={{ fontSize: "0.85rem", color: "#cbd5e1", background: "rgba(255,255,255,0.03)", padding: "10px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        {excelAppleUploadMsg}
                      </div>
                    )}
                  </div>

                  {/* Upload FRP Sheet */}
                  <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "20px", padding: "30px", backdropFilter: "blur(25px)", display: "flex", flexDirection: "column", gap: "20px" }}>
                    <h3 style={{ fontWeight: 800, fontSize: "1.1rem", color: "#10b981", margin: 0 }}>
                      📥 استيراد وتحديث خدمات سيرفر FRP
                    </h3>
                    <p style={{ color: "#94a3b8", fontSize: "0.85rem", lineHeight: "1.6", margin: 0 }}>
                      قم برفع ملف الإكسل الخاص بمنتجات الأندرويد/FRP لتحديث قائمة الخدمات والباقات فوراً. سيتم مسح الخدمات القديمة في القسم واستبدالها بالجديدة.
                    </p>
                    
                    <div style={{ border: "2px dashed rgba(16, 185, 129, 0.3)", borderRadius: "14px", padding: "30px 20px", textAlign: "center", position: "relative", background: "rgba(16, 185, 129, 0.01)" }}>
                      <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "10px" }}>🤖</span>
                      <label style={{ cursor: "pointer", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "10px 20px", borderRadius: "10px", color: "#34d399", fontWeight: "bold", fontSize: "0.88rem", display: "inline-block" }}>
                        اختر ملف android.xlsx
                        <input
                          type="file"
                          accept=".xlsx, .xls"
                          onChange={(e) => handleUploadExcelFile(e, 'frp')}
                          style={{ display: "none" }}
                          disabled={excelUploadLoading}
                        />
                      </label>
                    </div>
                    {excelFrpUploadMsg && (
                      <div style={{ fontSize: "0.85rem", color: "#cbd5e1", background: "rgba(255,255,255,0.03)", padding: "10px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        {excelFrpUploadMsg}
                      </div>
                    )}
                  </div>

                </div>

              </div>
            )}
      
            {activeTab === "amrr_unlocker" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                
                {/* 1. API Connection Status (Hardcoded & Secure) */}
                <div className="premium-card-solid" style={{ padding: "20px" }}>
                  <h3 style={{ margin: "0 0 12px", fontSize: "1.1rem", fontWeight: 800, color: "#38bdf8", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>🔓</span> بوابة Amrr Unlocker متصلة بنجاح
                  </h3>
                  <p style={{ color: "#94a3b8", fontSize: "0.88rem", margin: 0, lineHeight: "1.6" }}>
                    تم ربط وتهيئة اتصال لوحة التحكم ببوابة الخدمات الخارجية تلقائياً بشكل آمن وجاهز للتشغيل.
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", marginTop: "12px", fontSize: "0.85rem", color: "#cbd5e1", background: "rgba(255,255,255,0.02)", padding: "12px 16px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.04)", alignItems: "center" }}>
                    <div><strong>اسم المستخدم:</strong> <span style={{ color: "#38bdf8" }}>Hassen1990</span></div>
                    {unlockerBalanceEmail && (
                      <div><strong>بريد الحساب:</strong> <span style={{ color: "#e2e8f0" }}>{unlockerBalanceEmail}</span></div>
                    )}
                    <div><strong>حالة الاتصال:</strong> <span style={{ color: "#34d399", fontWeight: "bold" }}>● متصل بالخدمة</span></div>
                    
                    <div style={{ marginRight: "auto", display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>رصيدك لدى المزود:</span>
                      <span style={{ fontSize: "1.15rem", fontWeight: "900", color: "#fbbf24", background: "rgba(251, 191, 36, 0.1)", padding: "4px 12px", borderRadius: "6px", border: "1px solid rgba(251, 191, 36, 0.2)", display: "inline-flex", direction: "ltr" }}>
                        {unlockerBalanceLoading ? "جاري التحميل..." : (unlockerBalance || "غير متوفر")}
                      </span>
                      <button 
                        onClick={fetchUnlockerBalance} 
                        disabled={unlockerBalanceLoading}
                        style={{ background: "rgba(56, 189, 248, 0.12)", border: "1px solid rgba(56, 189, 248, 0.3)", color: "#38bdf8", padding: "4px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "0.78rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "4px", transition: "all 0.2s" }}
                        title="تحديث الرصيد"
                      >
                        {unlockerBalanceLoading ? "انتظر..." : "🔄 تحديث"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Services Sync Controls */}
                <div className="premium-card-solid" style={{ padding: "20px" }}>
                  <h3 style={{ margin: "0 0 16px", fontSize: "1.1rem", fontWeight: 800, color: "#a855f7", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>🔄</span> مزامنة واستيراد الخدمات
                  </h3>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "20px" }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "6px", display: "block" }}>سعر صرف الدولار (EGP / USD):</label>
                      <input 
                        type="number" 
                        value={unlockerExchangeRate} 
                        onChange={(e) => setUnlockerExchangeRate(e.target.value)} 
                        className="search-input-premium" 
                        style={{ padding: "10px 14px", width: "100%" }}
                        min="1"
                        step="0.1"
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "6px", display: "block" }}>هامش الربح (%):</label>
                      <input 
                        type="number" 
                        value={unlockerMarkupPercent} 
                        onChange={(e) => setUnlockerMarkupPercent(e.target.value)} 
                        className="search-input-premium" 
                        style={{ padding: "10px 14px", width: "100%" }}
                        min="0"
                        step="0.5"
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "6px", display: "block" }}>📥 استيراد إلى القسم المحلي:</label>
                      <select 
                        value={unlockerImportTargetCat} 
                        onChange={(e) => setUnlockerImportTargetCat(e.target.value)} 
                        className="search-input-premium" 
                        style={{ padding: "10px 14px", width: "100%", height: "42px", background: "rgba(15,23,42,0.8)" }}
                      >
                        <option value="auto">📂 نفس اسم القسم في المزود (تلقائي)</option>
                        <option value="new">🆕 إنشاء قسم جديد باسم مخصص...</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>📁 {c.name}</option>
                        ))}
                      </select>
                    </div>

                    {unlockerImportTargetCat === "new" && (
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ color: "#38bdf8", fontSize: "0.85rem", marginBottom: "6px", display: "block" }}>✨ اسم القسم الجديد:</label>
                        <input 
                          type="text" 
                          placeholder="أدخل اسم القسم الجديد" 
                          value={unlockerNewCatName} 
                          onChange={(e) => setUnlockerNewCatName(e.target.value)} 
                          className="search-input-premium" 
                          style={{ padding: "10px 14px", width: "100%" }}
                        />
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "14px 0 20px 0", padding: "10px 14px", background: "rgba(139, 92, 246, 0.05)", borderRadius: "10px", border: "1px solid rgba(139, 92, 246, 0.15)" }}>
                    <input 
                      type="checkbox" 
                      id="group_as_packages" 
                      checked={unlockerGroupAsPackages} 
                      onChange={(e) => setUnlockerGroupAsPackages(e.target.checked)}
                      style={{ width: "18px", height: "18px", cursor: "pointer" }}
                    />
                    <label htmlFor="group_as_packages" style={{ fontSize: "0.85rem", color: "#e9d5ff", cursor: "pointer", fontWeight: "bold", userSelect: "none" }}>
                      📦 دمج الخدمات المحددة في منتج واحد يحتوي على باقات (موصى به للألعاب كـ PUBG وشحن الرصيد)
                    </label>
                  </div>

                  <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginBottom: "20px" }}>
                    <button 
                      onClick={fetchUnlockerServices} 
                      className="action-btn btn-edit-premium"
                      style={{ padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontWeight: "bold" }}
                      disabled={unlockerLoading}
                    >
                      🔍 {unlockerLoading ? "جاري الاتصال..." : "جلب الخدمات"}
                    </button>
                    <button 
                      onClick={importSelectedUnlockerServices} 
                      className="action-btn btn-success-premium"
                      style={{ padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontWeight: "bold" }}
                      disabled={unlockerLoading || selectedUnlockerServices.length === 0}
                    >
                      📥 استيراد المحددة ({selectedUnlockerServices.length})
                    </button>
                  </div>

                  <div style={{ fontSize: "0.88rem", padding: "10px", borderRadius: "8px", background: "rgba(255,255,255,0.03)", marginBottom: "16px", color: "#cbd5e1" }}>
                    {unlockerSyncMsg || "اضغط على زر (جلب الخدمات) لعرض الخدمات المتاحة وتحديد المطلوب استيرادها للموقع."}
                  </div>

                  {unlockerServices.length > 0 && (
                    <>
                      {/* Search & Filter Bar for remote services */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "16px", background: "rgba(15, 23, 42, 0.4)", padding: "14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: "6px" }}>🔍 بحث بالاسم أو ID:</label>
                          <input 
                            type="text" 
                            placeholder="ابحث عن خدمة أو قسم أو رقم ID..." 
                            value={unlockerSearch} 
                            onChange={(e) => { setUnlockerSearch(e.target.value); setUnlockerPage(1); }} 
                            className="search-input-premium" 
                            style={{ padding: "10px 14px", fontSize: "0.88rem", width: "100%" }}
                          />
                        </div>

                        <div>
                          <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: "6px" }}>📂 تصفية حسب القسم:</label>
                          <select 
                            value={unlockerCategoryFilter} 
                            onChange={(e) => { setUnlockerCategoryFilter(e.target.value); setUnlockerPage(1); }} 
                            className="search-input-premium" 
                            style={{ padding: "10px 14px", fontSize: "0.88rem", width: "100%" }}
                          >
                            <option value="ALL">🌐 جميع الأقسام ({unlockerServices.length})</option>
                            {unlockerCategories.filter(c => c !== "ALL").map(cat => {
                              const count = unlockerServices.filter(s => s.category === cat).length;
                              return <option key={cat} value={cat}>{cat} ({count})</option>;
                            })}
                          </select>
                        </div>

                        <div>
                          <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: "6px" }}>📊 عدد النتائج بالصفحة:</label>
                          <select 
                            value={unlockerPageSize} 
                            onChange={(e) => { setUnlockerPageSize(Number(e.target.value)); setUnlockerPage(1); }} 
                            className="search-input-premium" 
                            style={{ padding: "10px 14px", fontSize: "0.88rem", width: "100%" }}
                          >
                            <option value={25}>25 خدمة في الصفحة</option>
                            <option value={50}>50 خدمة في الصفحة</option>
                            <option value={100}>100 خدمة في الصفحة</option>
                            <option value={250}>250 خدمة في الصفحة</option>
                            <option value={500}>500 خدمة في الصفحة</option>
                          </select>
                        </div>
                      </div>

                      {/* Selection Summary */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", background: "rgba(56, 189, 248, 0.08)", padding: "10px 16px", borderRadius: "8px", border: "1px solid rgba(56, 189, 248, 0.2)", fontSize: "0.88rem", flexWrap: "wrap", gap: "8px" }}>
                        <div>
                          <span style={{ color: "#38bdf8", fontWeight: "bold" }}>تم العثور على: </span>
                          <span style={{ color: "#fff", fontWeight: "bold" }}>{filteredUnlockerServices.length}</span> من أصل <span style={{ color: "#94a3b8" }}>{unlockerServices.length}</span> خدمة
                        </div>
                        <div>
                          <span style={{ color: "#38bdf8", fontWeight: "bold" }}>المحدد للاستيراد: </span>
                          <span style={{ color: "#4ade80", fontWeight: "bold", fontSize: "0.95rem" }}>{selectedUnlockerServices.length}</span> خدمة
                          {selectedUnlockerServices.length > 0 && (
                            <button 
                              onClick={() => setSelectedUnlockerServices([])} 
                              style={{ background: "transparent", border: "none", color: "#f87171", cursor: "pointer", fontSize: "0.82rem", marginRight: "10px", textDecoration: "underline" }}
                            >
                              إلغاء التحديد
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Remote Services list table */}
                      <div className="premium-table-wrapper" style={{ maxHeight: "500px", overflowY: "auto", marginBottom: "16px" }}>
                        <table className="premium-table">
                          <thead>
                            <tr>
                              <th style={{ width: "40px", textAlign: "center" }}>
                                <input 
                                  type="checkbox" 
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      const filteredIds = filteredUnlockerServices.map(s => s.id);
                                      setSelectedUnlockerServices(prev => Array.from(new Set([...prev, ...filteredIds])));
                                    } else {
                                      const filteredIdsSet = new Set(filteredUnlockerServices.map(s => s.id));
                                      setSelectedUnlockerServices(prev => prev.filter(id => !filteredIdsSet.has(id)));
                                    }
                                  }}
                                  checked={filteredUnlockerServices.length > 0 && filteredUnlockerServices.every(s => selectedUnlockerServices.includes(s.id))}
                                  title="تحديد الكل في القائمة المصفاة حالياً"
                                />
                              </th>
                              <th>ID الخدمة</th>
                              <th>اسم الخدمة</th>
                              <th>القسم (المجموعة)</th>
                              <th>سعر المزود ({unlockerCurrency})</th>
                              <th>سعر البيع المقترح</th>
                              <th>الخصم (%) (اختياري)</th>
                              <th>حالة الاستيراد</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedUnlockerServices.length > 0 ? (
                              paginatedUnlockerServices.map((s) => {
                                const isSelected = selectedUnlockerServices.includes(s.id);
                                const isAlreadyImported = importedUnlockerServiceIds.has(String(s.id));
                                
                                const apiPriceUsd = parseFloat(s.price) || 0;
                                const isTargetCatUsd = (categories.find(c => c.id === Number(unlockerImportTargetCat))?.currency === 'USD');
                                
                                let multiplier = 1;
                                 if (unlockerCurrency === 'USD' && !isTargetCatUsd) {
                                   multiplier = parseFloat(unlockerExchangeRate) || 50;
                                 } else if (unlockerCurrency === 'EGP' && isTargetCatUsd) {
                                   multiplier = 1 / (parseFloat(unlockerExchangeRate) || 50);
                                 }
                                 const estPrice = apiPriceUsd * multiplier * (1 + (parseFloat(unlockerMarkupPercent) || 0) / 100);
                                
                                const pricePlaceholder = isTargetCatUsd
                                  ? `$ ${estPrice.toFixed(2)}`
                                  : `${Math.ceil(estPrice)} ج.م`;

                                return (
                                  <tr key={s.id} style={{ background: isAlreadyImported ? "rgba(34,197,94,0.03)" : isSelected ? "rgba(56, 189, 248, 0.08)" : "" }}>
                                    <td style={{ textAlign: "center" }}>
                                      <input 
                                        type="checkbox" 
                                        checked={isSelected}
                                        onChange={() => {
                                          if (isSelected) {
                                            setSelectedUnlockerServices(prev => prev.filter(id => id !== s.id));
                                          } else {
                                            setSelectedUnlockerServices(prev => [...prev, s.id]);
                                          }
                                        }}
                                      />
                                    </td>
                                    <td data-label="ID الخدمة" style={{ fontWeight: "bold", color: "#64748b" }}>{s.id}</td>
                                    <td data-label="اسم الخدمة" style={{ fontWeight: 700 }}>{s.name}</td>
                                    <td data-label="القسم">{s.category}</td>
                                    <td data-label={`سعر المزود (${unlockerCurrency})`} style={{ color: "#38bdf8", fontWeight: "bold" }}>
                                       {unlockerCurrency === 'USD' ? '$' : ''}{apiPriceUsd.toFixed(2)}{unlockerCurrency !== 'USD' ? ' ' + unlockerCurrency : ''}
                                     </td>
                                    <td data-label="سعر البيع">
                                      <input 
                                        type="number" 
                                        step="0.01"
                                        placeholder={pricePlaceholder}
                                        value={unlockerCustomPrices[s.id] || ""} 
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          setUnlockerCustomPrices(prev => ({ ...prev, [s.id]: val }));
                                          if (!isSelected) {
                                            setSelectedUnlockerServices(prev => [...prev, s.id]);
                                          }
                                        }}
                                        style={{ width: "100px", padding: "6px 8px", fontSize: "0.8rem", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", textAlign: "center" }}
                                      />
                                    </td>
                                    <td data-label="الخصم (%)">
                                      <input 
                                        type="number" 
                                        placeholder="0"
                                        min="0"
                                        max="99"
                                        value={unlockerCustomDiscounts[s.id] || ""} 
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          setUnlockerCustomDiscounts(prev => ({ ...prev, [s.id]: val }));
                                          if (!isSelected) {
                                            setSelectedUnlockerServices(prev => [...prev, s.id]);
                                          }
                                        }}
                                        style={{ width: "70px", padding: "6px 8px", fontSize: "0.8rem", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", textAlign: "center" }}
                                      />
                                    </td>
                                    <td data-label="حالة الاستيراد">
                                      {isAlreadyImported ? (
                                        <span style={{ color: "#4ade80", fontSize: "0.8rem", background: "rgba(34,197,94,0.12)", padding: "4px 8px", borderRadius: "6px", fontWeight: "bold" }}>
                                          ✓ مستورد مسبقاً
                                        </span>
                                      ) : (
                                        <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                                          جاهز للاستيراد
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan={7} style={{ textAlign: "center", padding: "24px", color: "#94a3b8" }}>
                                  لا توجد خدمات مطابقة للبحث أو التصفية الحالية.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination Controls */}
                      {totalUnlockerPages > 1 && (
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(15, 23, 42, 0.6)", padding: "12px 18px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)", flexWrap: "wrap", gap: "10px" }}>
                          <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                            عرض من <span style={{ color: "#fff", fontWeight: "bold" }}>{(unlockerPage - 1) * unlockerPageSize + 1}</span> إلى <span style={{ color: "#fff", fontWeight: "bold" }}>{Math.min(unlockerPage * unlockerPageSize, filteredUnlockerServices.length)}</span> من إجمالي <span style={{ color: "#38bdf8", fontWeight: "bold" }}>{filteredUnlockerServices.length}</span> خدمة
                          </div>
                          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                            <button 
                              onClick={() => setUnlockerPage(1)} 
                              disabled={unlockerPage === 1}
                              className="btn-premium"
                              style={{ padding: "6px 12px", fontSize: "0.8rem", opacity: unlockerPage === 1 ? 0.4 : 1, cursor: unlockerPage === 1 ? "not-allowed" : "pointer" }}
                            >
                              « الأولى
                            </button>
                            <button 
                              onClick={() => setUnlockerPage(p => Math.max(1, p - 1))} 
                              disabled={unlockerPage === 1}
                              className="btn-premium"
                              style={{ padding: "6px 12px", fontSize: "0.8rem", opacity: unlockerPage === 1 ? 0.4 : 1, cursor: unlockerPage === 1 ? "not-allowed" : "pointer" }}
                            >
                              ‹ السابقة
                            </button>
                            <span style={{ padding: "4px 12px", background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", borderRadius: "6px", fontWeight: "bold", fontSize: "0.88rem" }}>
                              صفحة {unlockerPage} من {totalUnlockerPages}
                            </span>
                            <button 
                              onClick={() => setUnlockerPage(p => Math.min(totalUnlockerPages, p + 1))} 
                              disabled={unlockerPage === totalUnlockerPages}
                              className="btn-premium"
                              style={{ padding: "6px 12px", fontSize: "0.8rem", opacity: unlockerPage === totalUnlockerPages ? 0.4 : 1, cursor: unlockerPage === totalUnlockerPages ? "not-allowed" : "pointer" }}
                            >
                              التالية ›
                            </button>
                            <button 
                              onClick={() => setUnlockerPage(totalUnlockerPages)} 
                              disabled={unlockerPage === totalUnlockerPages}
                              className="btn-premium"
                              style={{ padding: "6px 12px", fontSize: "0.8rem", opacity: unlockerPage === totalUnlockerPages ? 0.4 : 1, cursor: unlockerPage === totalUnlockerPages ? "not-allowed" : "pointer" }}
                            >
                              الأخيرة »
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

              </div>
            )}
</main>

      {/* Add Category Modal */}
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
                <label>عنوان قسم بيانات الحساب (اختياري - الافتراضي: "بيانات الحساب المراد شحنه"):</label>
                <input
                  type="text"
                  placeholder="مثال: بيانات الحساب المراد شحنه، بيانات لاعب ببجي"
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
                    background: "#ffffff",
                    color: "#000000",
                    width: "100%",
                    boxSizing: "border-box",
                    outline: "none"
                  }}
                >
                  <option value="fixed" style={{ color: "#000000", background: "#ffffff" }}>📦 باقات (Packages)</option>
                  <option value="dynamic" style={{ color: "#000000", background: "#ffffff" }}>⚡ عادي (Normal / SMM)</option>
                  <option value="both" style={{ color: "#000000", background: "#ffffff" }}>🔄 الاثنين معاً (باقات وبالكمية)</option>
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
                <label>عنوان قسم بيانات الحساب (اختياري - في حال رغبتك بتخصيصه لهذه الخدمة فقط):</label>
                <input
                  type="text"
                  placeholder="مثال: بيانات الحساب المراد شحنه، بيانات لاعب ببجي"
                  value={newServiceFieldsTitle}
                  onChange={(e) => setNewServiceFieldsTitle(e.target.value)}
                  className="search-input-premium"
                  style={{ padding: "12px 16px !important" }}
                />
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
                <label>عنوان قسم بيانات الحساب (اختياري - الافتراضي: "بيانات الحساب المراد شحنه"):</label>
                <input
                  type="text"
                  placeholder="مثال: بيانات الحساب المراد شحنه، بيانات لاعب ببجي"
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
                    background: "#ffffff",
                    color: "#000000",
                    width: "100%",
                    boxSizing: "border-box",
                    outline: "none"
                  }}
                >
                  <option value="fixed" style={{ color: "#000000", background: "#ffffff" }}>📦 باقات (Packages)</option>
                  <option value="dynamic" style={{ color: "#000000", background: "#ffffff" }}>⚡ عادي (Normal / SMM)</option>
                  <option value="both" style={{ color: "#000000", background: "#ffffff" }}>🔄 الاثنين معاً (باقات وبالكمية)</option>
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
                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
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
                <label>عنوان قسم بيانات الحساب (اختياري - في حال رغبتك بتخصيصه لهذه الخدمة فقط):</label>
                <input
                  type="text"
                  placeholder="مثال: بيانات الحساب المراد شحنه، بيانات لاعب ببجي"
                  value={editServiceFieldsTitle}
                  onChange={(e) => setEditServiceFieldsTitle(e.target.value)}
                  className="search-input-premium"
                  style={{ padding: "12px 16px !important" }}
                />
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
                    {globalCurrencies.map((currency) => (
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
                      .filter(([key]) => key.startsWith('custom_'))
                      .map(([key, val]) => ({
                        label: key.replace('custom_', ''),
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
                      onClick={() => { setShowOrderDetailsModal(false); handleOpenCodeModal(orderDetailsData, "completed"); }}
                      className="btn-add-premium"
                      style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#34d399" }}
                    >
                      ✅ تم الشحن
                    </button>
                    <button
                      onClick={() => { updateOrderStatus(orderDetailsData.id, "cancelled"); setShowOrderDetailsModal(false); }}
                      className="action-btn btn-danger-premium"
                    >
                      ❌ إلغاء
                    </button>
                  </>
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
    </div>
  );
}