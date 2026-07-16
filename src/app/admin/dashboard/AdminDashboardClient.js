"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/config";
import Link from "next/link";
import dashboardStyles from "./AdminDashboardClient.styles";
import { AdminDashboardContext } from "@/components/admin/AdminDashboardContext";
import AdminDashboardModals from "@/components/admin/modals/AdminDashboardModals";
import SettingsTab from "@/components/admin/tabs/SettingsTab";
import WhatsAppTab from "@/components/admin/tabs/WhatsAppTab";
import GmailTab from "@/components/admin/tabs/GmailTab";
import ExcelPricesTab from "@/components/admin/tabs/ExcelPricesTab";
import AmrrUnlockerTab from "@/components/admin/tabs/AmrrUnlockerTab";
import OrdersTab from "@/components/admin/tabs/OrdersTab";
import WalletsTab from "@/components/admin/tabs/WalletsTab";
import CustomersTab from "@/components/admin/tabs/CustomersTab";
import CategoriesTab from "@/components/admin/tabs/CategoriesTab";
import ServicesTab from "@/components/admin/tabs/ServicesTab";
import BannersTab from "@/components/admin/tabs/BannersTab";
import BackupsTab from "@/components/admin/tabs/BackupsTab";

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
  const [newCatFieldsTitle, setNewCatFieldsTitle] = useState("بيانات الخدمة");
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
  const [editCatFieldsTitle, setEditCatFieldsTitle] = useState("بيانات الخدمة");
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
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [supportedCurrenciesText, setSupportedCurrenciesText] = useState("USD, USDT");
  const [hideWalletPayment, setHideWalletPayment] = useState(false);
  const [apiAutoSubmit, setApiAutoSubmit] = useState(true);
  const [whatsappNumbers, setWhatsappNumbers] = useState([]);
  const [newWhatsappNumber, setNewWhatsappNumber] = useState("");
  const [emailUser, setEmailUser] = useState("");
  const [emailPass, setEmailPass] = useState("");
  const [waStatus, setWaStatus] = useState("disconnected"); // 'disconnected'|'loading'|'qr'|'ready'
  const [waQR, setWaQR] = useState(null);
  const waPollingRef = useRef(null);

  const [newAdminUsername, setNewAdminUsername] = useState("");
  const [globalMarkupPercent, setGlobalMarkupPercent] = useState(0);
  const [savingMarkup, setSavingMarkup] = useState(false);
  const [unlockerSortOrder, setUnlockerSortOrder] = useState("original"); // original or alphabetical
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

  // Deletion Gate (OTP verification modal for sensitive deletes)
  const [deleteOtpModal, setDeleteOtpModal] = useState({
    isOpen: false,
    url: "",
    message: "",
    onSuccess: null,
  });
  const [deleteOtpCode, setDeleteOtpCode] = useState("");
  const [deleteOtpLoading, setDeleteOtpLoading] = useState(false);
  const [deleteOtpError, setDeleteOtpError] = useState("");

  const secureDeleteFetch = async (url, onSuccessCallback) => {
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.status === 403 && data && data.requireOtp) {
        setDeleteOtpModal({
          isOpen: true,
          url,
          message: data.message || "يرجى إدخال كود التحقق (OTP) المرسل على الواتساب لإتمام عملية الحذف.",
          onSuccess: onSuccessCallback
        });
        return;
      }
      if (!response.ok) {
        throw new Error(data.message || "فشل عملية الحذف.");
      }
      onSuccessCallback(data);
    } catch (err) {
      alert(err.message || "فشل عملية الحذف.");
    }
  };

  const handleConfirmDeleteOtp = async (e) => {
    e.preventDefault();
    if (!deleteOtpModal.url || !deleteOtpCode) return;
    setDeleteOtpLoading(true);
    setDeleteOtpError("");
    try {
      const response = await fetch(deleteOtpModal.url, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "X-OTP-Code": deleteOtpCode
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "كود التحقق غير صحيح أو انتهت صلاحيته.");
      }
      if (deleteOtpModal.onSuccess) {
        deleteOtpModal.onSuccess(data);
      }
      setDeleteOtpModal({ isOpen: false, url: "", message: "", onSuccess: null });
      setDeleteOtpCode("");
    } catch (err) {
      setDeleteOtpError(err.message || "فشل الحذف باستخدام كود الواتساب.");
    } finally {
      setDeleteOtpLoading(false);
    }
  };

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
      const timer = setTimeout(() => {
        void fetchUnlockerBalance();
      }, 0);
      return () => clearTimeout(timer);
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
    const filtered = unlockerServices.filter(s => {
      const name = s.name || "";
      const category = s.category || "";
      const matchSearch = !query || 
                          name.toLowerCase().includes(query) || 
                          category.toLowerCase().includes(query) ||
                          String(s.id).includes(query);
      const matchCat = unlockerCategoryFilter === "ALL" || s.category === unlockerCategoryFilter;
      return matchSearch && matchCat;
    });

    if (unlockerSortOrder === "alphabetical") {
      return [...filtered].sort((a, b) => (a.name || "").localeCompare(b.name || "", 'en'));
    }
    return filtered;
  }, [unlockerServices, unlockerSearch, unlockerCategoryFilter, unlockerSortOrder]);

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
      const sortedCats = [...(catData || [])].sort((a, b) => a.name.localeCompare(b.name, 'en'));
      setCategories(sortedCats);
      if (sortedCats.length > 0) {
        setNewServiceCatId(sortedCats[0].id.toString());
      }

      // Fetch services
      const serviceRes = await fetch(`${API_BASE_URL}/api/services`);
      const serviceData = await serviceRes.json();
      const sortedServices = [...(serviceData || [])].sort((a, b) => a.name.localeCompare(b.name, 'en'));
      setServices(sortedServices);

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
          setBaseCurrency("USD");
        setHideWalletPayment(settingsData.hide_wallet_payment || false);
        if (settingsData.api_auto_submit !== undefined) {
          setApiAutoSubmit(settingsData.api_auto_submit);
        }
        if (settingsData.whatsapp_numbers && Array.isArray(settingsData.whatsapp_numbers)) {
          setWhatsappNumbers(settingsData.whatsapp_numbers);
        }
        if (settingsData.email_user !== undefined) setEmailUser(settingsData.email_user);
        if (settingsData.email_pass !== undefined) setEmailPass(settingsData.email_pass);
        if (settingsData.global_markup_percent !== undefined) {
          setGlobalMarkupPercent(settingsData.global_markup_percent);
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
      let allServicesToImport = unlockerServices
        .filter(s => selectedUnlockerServices.includes(s.id))
        .map(s => ({
          ...s,
          custom_price: unlockerCustomPrices[s.id] !== undefined && unlockerCustomPrices[s.id] !== "" ? parseFloat(unlockerCustomPrices[s.id]) : null,
          custom_discount: unlockerCustomDiscounts[s.id] !== undefined && unlockerCustomDiscounts[s.id] !== "" ? parseFloat(unlockerCustomDiscounts[s.id]) : null
        }));

      if (unlockerSortOrder === "alphabetical") {
        allServicesToImport.sort((a, b) => (a.name || "").localeCompare(b.name || "", 'en'));
      }

      const CHUNK_SIZE = 25;
      const totalServices = allServicesToImport.length;
      let importedCount = 0;

      for (let i = 0; i < totalServices; i += CHUNK_SIZE) {
        const chunk = allServicesToImport.slice(i, i + CHUNK_SIZE);
        const chunkNum = Math.floor(i / CHUNK_SIZE) + 1;
        const totalChunks = Math.ceil(totalServices / CHUNK_SIZE);

        setUnlockerSyncMsg(`⏳ جاري استيراد الدفعة ${chunkNum} من ${totalChunks} (${importedCount}/${totalServices} خدمة)...`);

        const response = await fetch(`${API_BASE_URL}/api/unlocker/import-services`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            services: chunk,
            exchange_rate: parseFloat(unlockerExchangeRate) || 50,
            markup_percent: parseFloat(unlockerMarkupPercent) || 0,
            local_category_id: unlockerImportTargetCat,
            custom_category_name: unlockerNewCatName,
            group_as_packages: unlockerGroupAsPackages
          })
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || `فشل استيراد الدفعة ${chunkNum}.`);

        importedCount += chunk.length;
      }
      
      setUnlockerSyncMsg(`✅ تم استيراد عدد ${totalServices} خدمة بنجاح على دفعات متتالية دون أي مشاكل!`);
      setSelectedUnlockerServices([]);
      void fetchData();
    } catch (err) {
      setUnlockerSyncMsg(`❌ فشل الاستيراد: ${err.message}`);
    } finally {
      setUnlockerLoading(false);
    }
  };

  const handleWipeAndSyncAll = async () => {
    if (!confirm("⚠️ تحذير هام جداً:\n\nسيتم مسح كافة الأقسام والخدمات الحالية في موقعك بالكامل من قاعدة البيانات!\nثم سيتم استيراد كافة الأقسام والخدمات من سيرفر Amrr Unlocker بشكل نظيف وجديد.\n\nهل أنت متأكد تماماً من الاستمرار؟")) return;

    setUnlockerLoading(true);
    setUnlockerSyncMsg("⏳ جاري مسح قاعدة البيانات القديمة والاتصال بسيرفر المزود لجلب البيانات الجديدة...");

    try {
      const response = await fetch(`${API_BASE_URL}/api/unlocker/wipe-and-sync-all`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          exchange_rate: parseFloat(unlockerExchangeRate) || 50,
          markup_percent: parseFloat(unlockerMarkupPercent) || 0,
          group_as_packages: unlockerGroupAsPackages
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "فشل مسح واستيراد البيانات من السيرفر.");

      setUnlockerSyncMsg(`✅ ${data.message}`);
      void fetchData();
    } catch (err) {
      setUnlockerSyncMsg(`❌ فشل العملية الشاملة: ${err.message}`);
    } finally {
      setUnlockerLoading(false);
    }
  };


  const triggerUnlockerOrderApproval = useCallback(async (orderId) => {
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
  }, [fetchData, token]);

  const isUnlockerOrder = useCallback((order) => {
    if (!order) return false;
    if (order.api_source === "amrr-unlocker") return true;
    const relatedService = services.find((service) => Number(service.id) === Number(order.service_id));
    return relatedService?.api_source === "amrr-unlocker";
  }, [services]);

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

  const cancelUnlockerOrder = useCallback(async (orderId) => {
    if (!confirm("هل أنت متأكد من إلغاء هذا الطلب؟ سيتم إلغاؤه من المزود واسترداد الرصيد للعميل.")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/unlocker/cancel-order/${orderId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "فشل إلغاء الطلب.");
      
      alert(data.message);
      void fetchData();
    } catch (err) {
      alert(`خطأ: ${err.message}`);
    }
  }, [fetchData, token]);

  const handleManualRefund = useCallback(async (orderId) => {
    if (!confirm("هل أنت متأكد من إرجاع رصيد هذا الطلب يدوياً إلى محفظة العميل؟ سيؤدي ذلك أيضاً إلى إلغاء الطلب.")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/refund`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "فشل إرجاع الرصيد.");
      
      alert(data.message);
      void fetchData();
    } catch (err) {
      alert(`خطأ: ${err.message}`);
    }
  }, [fetchData, token]);

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

  const handleOpenCodeModal = useCallback((order, statusToUpdate = null) => {
    setCodeModalOrder(order);
    setCodeValue(order.code || "");
    const service = services.find(s => s.id === order.service_id);
    const defaultLink = service ? (service.download_link || "") : "";
    const defaultLinkTitle = service ? (service.download_link_title || "تحميل الأداة") : "تحميل الأداة";

    setOrderDownloadLinkValue(order.download_link || defaultLink);
    setOrderDownloadLinkTitleValue(order.download_link_title || defaultLinkTitle);
    setCodeModalStatusToUpdate(statusToUpdate);
    setShowCodeModal(true);
  }, [services]);

  const handleApproveOrder = useCallback(async (order) => {
    if (!order) return;

    if (isUnlockerOrder(order)) {
      await triggerUnlockerOrderApproval(order.id);
      return;
    }

    handleOpenCodeModal(order, "completed");
  }, [handleOpenCodeModal, isUnlockerOrder, triggerUnlockerOrderApproval]);

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

    await secureDeleteFetch(`${API_BASE_URL}/api/orders/${orderId}`, () => {
      setOrders(prev => prev.filter(o => o.id !== orderId));
      setWalletTransactions(prev => prev.filter(tx => !((tx.reference_type === "order" || tx.reference_type === "order_refund") && tx.reference_id === orderId)));
    });
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

    await secureDeleteFetch(`${API_BASE_URL}/api/customer/admin/${customerId}`, () => {
      setCustomers(prev => prev.filter(c => c.id !== customerId));
      if (selectedCustomerId === customerId) {
        setSelectedCustomerId(null);
        setSelectedCustomerTransactions([]);
      }
      alert("تم حذف العميل والبيانات المرتبطة به بنجاح.");
    });
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
      setNewCatFieldsTitle("بيانات الخدمة");
      setNewCatParentId("");
      setShowCatModal(false);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا القسم؟ سيتم حذف جميع الخدمات التابعة له تلقائياً!")) return;

    await secureDeleteFetch(`${API_BASE_URL}/api/categories/${id}`, () => {
      setCategories(prev => prev.filter(c => c.id !== id).map(c => {
        if (Number(c.parent_id) === Number(id)) {
          return { ...c, parent_id: null };
        }
        return c;
      }));
      setServices(prev => prev.filter(s => s.category_id !== id));
    });
  };

  // Clear All Categories (Delete all permanently from server)
  const handleClearAllCategories = async () => {
    const confirmation = prompt("يرجى كتابة 'حذف كل الأقسام' لتأكيد حذف جميع الأقسام والخدمات نهائياً من السيرفر:");
    if (confirmation !== "حذف كل الأقسام") {
      if (confirmation !== null) alert("لم يتم تأكيد الحذف. يرجى كتابة العبارة المطلوبة بدقة.");
      return;
    }

    await secureDeleteFetch(`${API_BASE_URL}/api/categories/all/clear`, () => {
      alert("تم حذف جميع الأقسام والخدمات التابعة لها بنجاح من السيرفر! 📁🗑️");
      setCategories([]);
      setServices([]);
    });
  };

  // Clear All Services (Delete all permanently from server)
  const handleClearAllServices = async () => {
    const confirmation = prompt("يرجى كتابة 'حذف كل الخدمات' لتأكيد حذف جميع الخدمات نهائياً من السيرفر:");
    if (confirmation !== "حذف كل الخدمات") {
      if (confirmation !== null) alert("لم يتم تأكيد الحذف. يرجى كتابة العبارة المطلوبة بدقة.");
      return;
    }

    await secureDeleteFetch(`${API_BASE_URL}/api/services/all/clear`, () => {
      alert("تم حذف جميع الخدمات بنجاح من السيرفر! ⚡🗑️");
      setServices([]);
    });
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
        .map((p, idx) => ({ ...p, id: idx + 1 }));

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
        .map((p, idx) => ({ ...p, id: idx + 1 }));

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

    await secureDeleteFetch(`${API_BASE_URL}/api/services/${id}`, () => {
      setServices(prev => prev.filter(s => s.id !== id));
    });
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
    setEditCatFieldsTitle(cat.fields_title || "بيانات الخدمة");
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
        .map((p, idx) => ({ ...p, id: idx + 1 }));

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
        .map((p, idx) => ({ ...p, id: idx + 1 }));

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

    await secureDeleteFetch(`${API_BASE_URL}/api/banners/${id}`, () => {
      setBanners(prev => prev.filter(b => b.id !== id));
    });
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
          whatsapp_numbers: whatsappNumbers,
          email_user: emailUser,
          email_pass: emailPass,
          global_markup_percent: globalMarkupPercent
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

  const handleToggleAutoSubmit = async (newValue) => {
    setApiAutoSubmit(newValue);
    try {
      const response = await fetch(`${API_BASE_URL}/api/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ api_auto_submit: newValue })
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "فشل تحديث وضع التقديم التلقائي.");
      }
    } catch (err) {
      alert(err.message);
      setApiAutoSubmit(!newValue);
    }
  };

  const handleSaveGlobalMarkup = async (e) => {
    if (e) e.preventDefault();
    setSavingMarkup(true);
    setErrorMsg("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          global_markup_percent: parseFloat(globalMarkupPercent) || 0
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "فشل تحديث هامش الربح.");
      }

      alert("تم تحديث هامش الربح العام بنجاح!");
      void fetchData();
    } catch (err) {
      alert("خطأ: " + err.message);
    } finally {
      setSavingMarkup(false);
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

  const dashboardContextValue = {
    errorMsg,
    catModal: {
      showCatModal,
      setShowCatModal,
      handleAddCategory,
      newCatName,
      setNewCatName,
      newCatImage,
      setNewCatImage,
      catUploadedFile,
      setCatUploadedFile,
      newCatFieldsTitle,
      setNewCatFieldsTitle,
      newCatFields,
      handleAddField,
      handleRemoveField,
      handleFieldChange,
      newCatParentId,
      setNewCatParentId,
      categories,
      API_BASE_URL
    },
    serviceModal: {
      showServiceModal,
      setShowServiceModal,
      handleAddService,
      newServiceName,
      setNewServiceName,
      newServiceDesc,
      setNewServiceDesc,
      newServiceCatId,
      setNewServiceCatId,
      newServicePrice,
      setNewServicePrice,
      newServiceImage,
      setNewServiceImage,
      serviceUploadedFile,
      setServiceUploadedFile,
      newServicePriceType,
      setNewServicePriceType,
      newServicePricePerThousand,
      setNewServicePricePerThousand,
      newServicePackages,
      handleAddPkgInput,
      handleRemovePkgInput,
      handlePkgChange,
      newServiceFieldsTitle,
      setNewServiceFieldsTitle,
      newServiceFields,
      handleAddCatField,
      handleRemoveCatField,
      handleCatFieldChange,
      newServiceDownloadLink,
      setNewServiceDownloadLink,
      newServiceDownloadLinkTitle,
      setNewServiceDownloadLinkTitle
    },
    editCatModal: {
      showEditCatModal,
      setShowEditCatModal,
      handleEditCategory,
      editCatName,
      setEditCatName,
      editCatImage,
      setEditCatImage,
      editCatUploadedFile,
      setEditCatUploadedFile,
      editCatFieldsTitle,
      setEditCatFieldsTitle,
      editCatFields,
      handleAddEditCatField,
      handleRemoveEditCatField,
      handleEditCatFieldChange,
      editCatParentId,
      setEditCatParentId,
      applyToServices,
      setApplyToServices
    },
    editServiceModal: {
      showEditServiceModal,
      setShowEditServiceModal,
      handleEditService,
      editServiceName,
      setEditServiceName,
      editServiceDesc,
      setEditServiceDesc,
      editServiceCatId,
      setEditServiceCatId,
      editServiceImage,
      setEditServiceImage,
      editServiceUploadedFile,
      setEditServiceUploadedFile,
      editServicePackages,
      handleAddEditPkgInput,
      handleRemoveEditPkgInput,
      handleEditPkgChange,
      editServiceFields,
      handleAddEditField,
      handleRemoveEditField,
      handleEditFieldChange,
      editServicePriceType,
      setEditServicePriceType,
      editServicePricePerThousand,
      setEditServicePricePerThousand,
      editServiceFieldsTitle,
      setEditServiceFieldsTitle,
      editServiceDownloadLink,
      setEditServiceDownloadLink,
      editServiceDownloadLinkTitle,
      setEditServiceDownloadLinkTitle
    },
    bannerModal: {
      showBannerModal,
      setShowBannerModal,
      handleAddBanner,
      newBannerTitle,
      setNewBannerTitle,
      newBannerHighlight,
      setNewBannerHighlight,
      newBannerDesc,
      setNewBannerDesc,
      newBannerBadge,
      setNewBannerBadge,
      newBannerColor,
      setNewBannerColor,
      newBannerIcon,
      setNewBannerIcon,
      bannerUploadedFile,
      setBannerUploadedFile
    },
    editBannerModal: {
      showEditBannerModal,
      setShowEditBannerModal,
      handleEditBanner,
      editBannerTitle,
      setEditBannerTitle,
      editBannerHighlight,
      setEditBannerHighlight,
      editBannerDesc,
      setEditBannerDesc,
      editBannerBadge,
      setEditBannerBadge,
      editBannerColor,
      setEditBannerColor,
      editBannerIcon,
      setEditBannerIcon,
      editBannerUploadedFile,
      setEditBannerUploadedFile
    },
    customerModal: {
      showEditCustomerModal,
      setShowEditCustomerModal,
      handleUpdateCustomer,
      editCustomerUsername,
      setEditCustomerUsername,
      editCustomerEmail,
      setEditCustomerEmail,
      editCustomerPhone,
      setEditCustomerPhone,
      editCustomerBalance,
      setEditCustomerBalance,
      globalCurrencies,
      editCustomerBalances,
      setEditCustomerBalances,
      editCustomerNewPassword,
      setEditCustomerNewPassword
    },
      orderModal: {
      showOrderDetailsModal,
      setShowOrderDetailsModal,
      orderDetailsData,
      baseCurrency,
      API_BASE_URL,
      isUnlockerOrder,
      handleApproveOrder,
      handleOpenCodeModal,
      updateOrderStatus,
      cancelUnlockerOrder
    },
    codeModal: {
      codeModalOrder,
      showCodeModal,
      setShowCodeModal,
      codeModalStatusToUpdate,
      codeValue,
      setCodeValue,
      orderDownloadLinkValue,
      setOrderDownloadLinkValue,
      orderDownloadLinkTitleValue,
      setOrderDownloadLinkTitleValue,
      handleSubmitCodeModal,
      updateOrderCodeAndStatus
    },
    shared: {
      categories,
      baseCurrency,
      API_BASE_URL
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
      <style jsx global>{dashboardStyles}</style>
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
          { tab: "gmail", icon: "📧", label: "بوابة ربط الجميل" },
          { tab: "amrr_unlocker", icon: "🔓", label: "بوابة Amrr Unlocker" },
          { tab: "backups", icon: "💾", label: "النسخ الاحتياطي" },
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
                {activeTab === "gmail" && "بوابة ربط البريد الإلكتروني (Gmail Portal)"}
                {activeTab === "excel_prices" && "أسعار أقسام السيرفر (APPLE & FRP)"}
              {activeTab === "amrr_unlocker" && "بوابة تفعيل ومزامنة Amrr Unlocker"}
              {activeTab === "backups" && "نظام النسخ الاحتياطي واستعادة البيانات"}
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
                {activeTab === "gmail" && "التحكم ببيانات خادم Gmail، إرسال رسائل تجريبية، وإدارة أكواد تحقق الـ OTP للعملاء"}
                {activeTab === "excel_prices" && "التحكم بأسعار صرف الدولار وهامش الأرباح واستيراد وتحديث خدمات APPLE وسيرفر FRP عبر ملفات الإكسل"}
              {activeTab === "amrr_unlocker" && "إدارة مفتاح الـ API واستيراد خدمات تخطي وحسابات Amrr Unlocker بهامش ربح مخصص وتفعيلها آلياً"}
              {activeTab === "backups" && "إنشاء نسخ احتياطية للموقع وتنزيلها محلياً أو استرجاعها مباشرة لضمان سلامة البيانات"}
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
            {activeTab === "wallets" && (
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
            {activeTab === "customers" && (
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
            {activeTab === "categories" && (
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
            {activeTab === "services" && (
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
            {activeTab === "banners" && (
              <BannersTab
                banners={banners}
                bannerSearch={bannerSearch}
                setBannerSearch={setBannerSearch}
                handleOpenEditBanner={handleOpenEditBanner}
                handleDeleteBanner={handleDeleteBanner}
              />
            )}

            {/* Settings Section */}
            {activeTab === "settings" && (
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
                emailUser={emailUser}
                setEmailUser={setEmailUser}
                emailPass={emailPass}
                setEmailPass={setEmailPass}
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
            {activeTab === "backups" && (
              <BackupsTab token={token} API_BASE_URL={API_BASE_URL} />
            )}
          </>
        )}

        {/* ===================== WhatsApp TAB ===================== */}
        {activeTab === "whatsapp" && (
          <WhatsAppTab
            waStatus={waStatus}
            setWaStatus={setWaStatus}
            waQR={waQR}
            setWaQR={setWaQR}
            whatsappNumbers={whatsappNumbers}
            setWhatsappNumbers={setWhatsappNumbers}
            newWhatsappNumber={newWhatsappNumber}
            setNewWhatsappNumber={setNewWhatsappNumber}
            token={token}
            API_BASE_URL={API_BASE_URL}
            fetchWaStatus={fetchWaStatus}
          />
        )}

        {/* ===================== Gmail TAB ===================== */}
        {activeTab === "gmail" && <GmailTab />}

            {/* Excel & Server Prices Tab */}
            {activeTab === "excel_prices" && (
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
      
            {activeTab === "amrr_unlocker" && (
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

      <AdminDashboardContext.Provider value={dashboardContextValue}>
        <AdminDashboardModals />
      </AdminDashboardContext.Provider>
    </div>
  );
}
