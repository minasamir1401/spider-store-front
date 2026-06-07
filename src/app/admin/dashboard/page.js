"use client";

import { useState, useEffect, useMemo } from "react";
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

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceDesc, setNewServiceDesc] = useState("");
  const [newServiceCatId, setNewServiceCatId] = useState("");
  const [newServicePrice, setNewServicePrice] = useState(0);
  const [newServiceImage, setNewServiceImage] = useState("pubg");
  const [serviceUploadedFile, setServiceUploadedFile] = useState(null);
  
  // Package list builder
  const [newServicePackages, setNewServicePackages] = useState([
    { name: "", price: 0 }
  ]);

  const defaultFields = [
    { id: "player_id", label: "معرّف اللاعب / حساب الشحن (Player ID / Email)", placeholder: "أدخل معرّف الحساب بدقة هنا (مثال: 512495910)", type: "text", required: true },
    { id: "phone", label: "رقم الهاتف للتواصل وتأكيد الشحن (واتساب)", placeholder: "مثال: 01023456789 أو +96651234567", type: "tel", required: true }
  ];
  const [newServiceFields, setNewServiceFields] = useState(defaultFields);

  // Edit Category Modal / Form states
  const [showEditCatModal, setShowEditCatModal] = useState(false);
  const [editCatId, setEditCatId] = useState(null);
  const [editCatName, setEditCatName] = useState("");
  const [editCatImage, setEditCatImage] = useState("games");
  const [editCatUploadedFile, setEditCatUploadedFile] = useState(null);

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
  const [editCustomerPhone, setEditCustomerPhone] = useState("");
  const [editCustomerBalance, setEditCustomerBalance] = useState("");
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

  const [errorMsg, setErrorMsg] = useState("");

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setHydrated(true);

    const storedToken = localStorage.getItem("admin_token") || "";
    setToken(storedToken);

    try {
      const storedUser = localStorage.getItem("admin_user");
      setAdminUser(storedUser ? JSON.parse(storedUser) : null);
    } catch {
      setAdminUser(null);
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "pending").length;
    const completed = orders.filter((o) => o.status === "completed").length;
    const revenue = orders
      .filter((o) => o.status === "completed")
      .reduce((sum, o) => sum + o.package_price, 0);

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

  async function fetchData() {
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

      // Fetch orders
      const orderRes = await fetch(`${API_BASE_URL}/api/orders`, { headers });
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
    } catch (err) {
      console.error("Error fetching admin data:", err);
      setErrorMsg("حدث خطأ أثناء تحميل البيانات من الخادم.");
    } finally {
      setLoading(false);
    }
  }

  // Load dashboard data when token is available
  useEffect(() => {
    if (!token) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [token]);

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
    setEditCustomerPhone(customer.phone || "");
    setEditCustomerBalance(Number(customer.balance || 0).toFixed(2));
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
          phone: editCustomerPhone,
          balance: editCustomerBalance,
          new_password: editCustomerNewPassword
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "فشل تحديث بيانات العميل.");

      setCustomers(prev => prev.map((customer) =>
        customer.id === editCustomerId
          ? { ...customer, username: data.customer.username, phone: data.customer.phone, balance: data.customer.balance }
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
        body: JSON.stringify({ name: newCatName, image: catUploadedFile || newCatImage })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "فشل إضافة القسم.");
      }

      setCategories(prev => [...prev, data]);
      setNewCatName("");
      setNewCatImage("games");
      setCatUploadedFile(null);
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

      setCategories(prev => prev.filter(c => c.id !== id));
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

    // Filter out empty packages
    const validPackages = newServicePackages
      .filter(p => p.name.trim())
      .map((p, idx) => ({ id: idx + 1, name: p.name, price: p.price }));

    if (validPackages.length === 0) {
      setErrorMsg("يجب إضافة باقة واحدة على الأقل للخدمة.");
      return;
    }

    // Starting price is the price of the cheapest package
    const minPrice = Math.min(...validPackages.map(p => p.price));

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
          fields: newServiceFields
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
        body: JSON.stringify({ name: editCatName, image: editCatUploadedFile || editCatImage })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "فشل تعديل القسم.");
      }

      setCategories(prev => prev.map(c => c.id === editCatId ? { ...c, name: editCatName, image: data.image } : c));
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

  // Edit Service handler
  const handleEditService = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!editServiceName.trim()) {
      setErrorMsg("اسم الخدمة مطلوب.");
      return;
    }

    const validPackages = editServicePackages
      .filter(p => p.name.trim())
      .map((p, idx) => ({ id: idx + 1, name: p.name, price: p.price }));

    if (validPackages.length === 0) {
      setErrorMsg("يجب إضافة باقة واحدة على الأقل للخدمة.");
      return;
    }

    const minPrice = Math.min(...validPackages.map(p => p.price));

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
          fields: editServiceFields
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
        fields: data.fields
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

  // Filtering Logic
  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.id.toString().includes(orderSearch) ||
      o.service_name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.player_id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.phone.includes(orderSearch) ||
      (o.payment_method || "").toLowerCase().includes(orderSearch.toLowerCase()) ||
      (o.sender_phone || "").includes(orderSearch) ||
      (o.transfer_to || "").includes(orderSearch);
    
    const matchesStatus = orderFilter === "all" ? true : o.status === orderFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(catSearch.toLowerCase())
  );

  const filteredServices = services.filter(s => {
    const parentCat = categories.find(c => c.id === s.category_id);
    const catName = parentCat ? parentCat.name : "";
    return s.name.toLowerCase().includes(serviceSearch.toLowerCase()) || 
           catName.toLowerCase().includes(serviceSearch.toLowerCase());
  });

  const filteredWalletRequests = walletRequests.filter((request) => {
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
  });

  const filteredWalletTransactions = walletTransactions.filter((tx) => {
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
  });

  const filteredCustomers = customers.filter((customer) => {
    const search = customerSearch.toLowerCase();
    return (
      customer.id.toString().includes(customerSearch) ||
      (customer.username || "").toLowerCase().includes(search) ||
      (customer.phone || "").toLowerCase().includes(search) ||
      String(customer.balance || "").includes(customerSearch)
    );
  });

  if (!hydrated) return null;

  return (
    <div className="admin-dashboard-root" dir="rtl">
      {/* Premium Styling Overrides injected globally via style tag */}
      <style>{`
        .admin-dashboard-root {
          display: grid;
          grid-template-columns: 280px 1fr;
          min-height: 100vh;
          background: radial-gradient(circle at top right, #0d122c 0%, #060913 100%);
          color: #f8fafc;
          font-family: 'Cairo', sans-serif;
          overflow-x: hidden;
        }

        /* Sidebar Glass Styling */
        .premium-sidebar {
          background: rgba(13, 18, 36, 0.45);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-left: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          padding: 24px;
          height: 100vh;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .premium-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          margin-bottom: 30px;
        }

        .premium-logo .logo-circle {
          width: 42px;
          height: 42px;
          font-size: 1.4rem;
          border-radius: 12px;
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
        }

        .premium-logo span {
          font-weight: 800;
          font-size: 1.1rem;
          background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex-grow: 1;
        }

        .nav-item-premium {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 14px;
          color: #94a3b8;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
        }

        .nav-item-premium:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.03);
          transform: translateX(-4px);
        }

        .nav-item-premium.active {
          color: #ffffff;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.05) 100%);
          border-color: rgba(139, 92, 246, 0.2);
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.1);
        }

        .nav-icon {
          font-size: 1.25rem;
          transition: transform 0.3s ease;
        }

        .nav-item-premium.active .nav-icon {
          transform: scale(1.15);
          filter: drop-shadow(0 0 8px #8b5cf6);
        }

        /* Content Area */
        .premium-content {
          padding: 40px;
          overflow-y: auto;
          max-height: 100vh;
        }

        /* Top Header */
        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 35px;
        }

        .header-title-section h1 {
          font-size: 2rem;
          font-weight: 900;
          background: linear-gradient(135deg, #ffffff 0%, #94a3b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .header-title-section p {
          color: #64748b;
          font-size: 0.9rem;
          margin-top: 4px;
        }

        /* Stats Cards */
        .premium-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 35px;
        }

        .premium-stat-card {
          background: rgba(13, 18, 36, 0.5);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .premium-stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .premium-stat-card::after {
          content: '';
          position: absolute;
          width: 80px;
          height: 80px;
          background: var(--glow-color, rgba(139, 92, 246, 0.1));
          filter: blur(40px);
          top: -20px;
          left: -20px;
          border-radius: 50%;
        }

        .stat-card-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          z-index: 1;
        }

        .stat-card-title {
          font-size: 0.85rem;
          color: #94a3b8;
          font-weight: 600;
        }

        .stat-card-value {
          font-size: 1.8rem;
          font-weight: 800;
          color: #ffffff;
        }

        .stat-card-icon-wrapper {
          width: 50px;
          height: 50px;
          border-radius: 14px;
          background: var(--icon-bg, rgba(255, 255, 255, 0.03));
          border: 1px solid var(--icon-border, rgba(255, 255, 255, 0.05));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          z-index: 1;
          color: var(--icon-color, #ffffff);
          box-shadow: var(--icon-shadow, none);
        }

        /* Filters and Actions Bar */
        .table-filter-bar {
          background: rgba(13, 18, 36, 0.3);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          gap: 15px;
          flex-wrap: wrap;
        }

        .search-input-wrapper {
          position: relative;
          flex-grow: 1;
          max-width: 320px;
        }

        .search-input-premium {
          width: 100%;
          background: rgba(13, 18, 36, 0.6) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          border-radius: 12px !important;
          padding: 10px 16px 10px 38px !important;
          color: white !important;
          font-size: 0.9rem !important;
          outline: none;
          transition: all 0.3s ease;
        }

        .search-input-premium:focus {
          border-color: #8b5cf6 !important;
          box-shadow: 0 0 15px rgba(139, 92, 246, 0.2) !important;
        }

        .search-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          font-size: 0.95rem;
        }

        .status-tabs-wrapper {
          display: flex;
          gap: 8px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 4px;
          border-radius: 12px;
        }

        .status-tab-btn {
          background: transparent;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          color: #94a3b8;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .status-tab-btn:hover {
          color: #ffffff;
        }

        .status-tab-btn.active {
          background: rgba(139, 92, 246, 0.15);
          color: #c084fc;
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
        }

        /* Glass Table Design */
        .premium-table-wrapper {
          background: rgba(13, 18, 36, 0.4);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          overflow-x: auto;
          overflow-y: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .premium-table {
          width: 100%;
          min-width: 1280px;
          border-collapse: collapse;
          text-align: right;
        }

        .premium-table th {
          background: rgba(13, 18, 36, 0.7);
          padding: 16px 20px;
          color: #94a3b8;
          font-weight: 700;
          font-size: 0.85rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          white-space: nowrap;
        }

        .premium-table td {
          padding: 18px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          font-size: 0.9rem;
          color: #e2e8f0;
          white-space: nowrap;
        }

        .premium-table tbody tr {
          transition: background 0.2s ease;
        }

        .premium-table tbody tr:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        @media (max-width: 900px) {
          .premium-table {
            min-width: 1100px;
          }

          .premium-table th,
          .premium-table td {
            padding: 12px 14px;
            font-size: 0.82rem;
          }
        }

        .premium-badge {
          display: inline-flex;
          align-items: center;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 700;
          gap: 6px;
        }

        .badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .premium-badge-pending {
          background: rgba(245, 158, 11, 0.1);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.2);
        }
        .premium-badge-pending .badge-dot { background: #fbbf24; }

        .premium-badge-approved {
          background: rgba(16, 185, 129, 0.1);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }
        .premium-badge-approved .badge-dot { background: #34d399; }

        .premium-badge-completed {
          background: rgba(16, 185, 129, 0.1);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }
        .premium-badge-completed .badge-dot { background: #34d399; }

        .premium-badge-rejected {
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }
        .premium-badge-rejected .badge-dot { background: #f87171; }

        .premium-badge-cancelled {
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.2);
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
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .btn-success-premium {
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .btn-success-premium:hover {
          background: #10b981;
          color: white;
          box-shadow: 0 0 12px rgba(16, 185, 129, 0.4);
        }

        .btn-danger-premium {
          background: rgba(239, 68, 68, 0.2);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }
        .btn-danger-premium:hover {
          background: #ef4444;
          color: white;
          box-shadow: 0 0 12px rgba(239, 68, 68, 0.4);
        }

        .btn-edit-premium {
          background: rgba(139, 92, 246, 0.2);
          color: #c084fc;
          border: 1px solid rgba(139, 92, 246, 0.3);
        }
        .btn-edit-premium:hover {
          background: #8b5cf6;
          color: white;
          box-shadow: 0 0 12px rgba(139, 92, 246, 0.4);
        }

        .btn-add-premium {
          background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.9rem;
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
          transition: all 0.3s ease;
        }

        .btn-add-premium:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(139, 92, 246, 0.45);
        }

        /* Categories Grid Layout */
        .category-grid-premium {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
        }

        .category-card-premium {
          background: rgba(13, 18, 36, 0.5);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 18px;
          padding: 24px;
          text-align: center;
          transition: all 0.3s ease;
          position: relative;
        }

        .category-card-premium:hover {
          transform: translateY(-5px);
          border-color: rgba(139, 92, 246, 0.3);
          box-shadow: 0 10px 25px rgba(139, 92, 246, 0.15);
        }

        .category-icon-big {
          font-size: 3rem;
          margin-bottom: 12px;
          display: inline-block;
          filter: drop-shadow(0 4px 10px rgba(139, 92, 246, 0.2));
        }

        .category-title-premium {
          font-size: 1.1rem;
          font-weight: 800;
          color: white;
          margin-bottom: 6px;
        }

        .category-slug {
          font-size: 0.75rem;
          color: #64748b;
          display: block;
          margin-bottom: 16px;
        }

        .pkg-tag {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          padding: 2px 8px;
          border-radius: 6px;
          font-size: 0.75rem;
          color: #94a3b8;
        }

        /* Modal redone */
        .premium-overlay {
          position: fixed;
          inset: 0;
          background: rgba(4, 6, 14, 0.8);
          backdrop-filter: blur(12px);
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease;
        }

        .premium-modal {
          background: #0d0f1d;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(139, 92, 246, 0.1);
          border-radius: 24px;
          width: 90%;
          max-width: 520px;
          padding: 30px;
          position: relative;
          animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          max-height: 90vh;
          overflow-y: auto;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleUp {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .premium-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .premium-modal-title {
          font-size: 1.3rem;
          font-weight: 850;
          color: white;
        }

        .close-btn-premium {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .close-btn-premium:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        /* Package line items */
        .pkg-row {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-bottom: 10px;
        }

        .pkg-row input {
          background: rgba(13, 18, 36, 0.8) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          border-radius: 10px !important;
          padding: 8px 12px !important;
          color: white !important;
          font-size: 0.85rem !important;
        }

        .admin-burger-btn {
          display: none;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          cursor: pointer;
          color: #fff;
          font-size: 1.3rem;
          align-items: center;
          justify-content: center;
          margin-inline-end: 12px;
          transition: all 0.2s ease;
        }
        .admin-burger-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }

        @media (max-width: 992px) {
          .admin-dashboard-root {
            grid-template-columns: 1fr;
          }
          .premium-sidebar {
            display: none !important;
          }

          .content-header .user-menu-widget {
            display: none !important;
          }

          .sidebar-nav {
            flex-direction: row;
            flex-wrap: nowrap;
            overflow-x: auto;
            gap: 8px;
            padding-bottom: 8px;
            scrollbar-width: none;
          }
          .sidebar-nav::-webkit-scrollbar {
            display: none;
          }

          .nav-item-premium {
            flex: 0 0 auto;
            justify-content: center;
            padding: 8px 14px;
            font-size: 0.85rem;
          }

          .premium-content {
            padding: 20px;
            max-height: none;
          }

          .content-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .premium-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .table-filter-bar {
            align-items: stretch;
          }

          .status-tabs-wrapper {
            width: 100%;
            overflow-x: auto;
            flex-wrap: nowrap;
          }

          .status-tab-btn {
            white-space: nowrap;
          }
        }

        @media (max-width: 640px) {
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
            font-size: 1.2rem;
          }

          .premium-content {
            padding: 12px;
          }

          .premium-logo {
            margin-bottom: 12px;
            padding-bottom: 10px;
          }

          .header-title-section h1 {
            font-size: 1.4rem;
          }

          .btn-add-premium {
            padding: 8px 14px;
            font-size: 0.8rem;
          }

          .action-btn {
            padding: 5px 8px;
            font-size: 0.75rem;
          }

          .table-filter-bar {
            padding: 12px;
            gap: 10px;
          }

          .search-input-wrapper {
            max-width: 100%;
          }

          .category-grid-premium {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .category-card-premium {
            padding: 16px;
          }

          .nav-item-premium {
            padding: 7px 10px;
            font-size: 0.78rem;
          }

          .nav-icon {
            font-size: 1.1rem;
          }
        }

        @media (max-width: 420px) {
          .premium-stats-grid {
            grid-template-columns: 1fr;
          }

          .premium-modal {
            padding: 20px;
            border-radius: 18px;
          }

          .premium-modal-title {
            font-size: 1.1rem;
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
          { tab: "orders", icon: "📥", label: "طلبات الشحن" },
          { tab: "categories", icon: "📁", label: "إدارة الأقسام" },
          { tab: "services", icon: "⚡", label: "إدارة الخدمات" },
          { tab: "banners", icon: "🖼️", label: "إدارة البانر الإعلاني" },
          { tab: "wallets", icon: "💳", label: "طلبات شحن الرصيد" },
          { tab: "customers", icon: "👥", label: "العملاء والمحفظة" },
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
          <div className="logo-circle">S</div>
          <span>Spider Store المسؤول</span>
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
            <span>طلبات الشحن</span>
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
              <span>العملاء والمحفظة</span>
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
        <header className="content-header" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button className="admin-burger-btn" onClick={() => setAdminDrawerOpen(true)}>☰</button>
          <div className="header-title-section">
            <h1>
              {activeTab === "orders" && "طلبات الشحن"}
              {activeTab === "categories" && "الأقسام والتبويبات"}
                {activeTab === "services" && "الخدمات والمنتجات"}
                {activeTab === "banners" && "البانر الإعلاني الرئيسي"}
                {activeTab === "wallets" && "طلبات شحن الرصيد"}
                {activeTab === "customers" && "العملاء، الرصيد، وسجل المعاملات"}
              </h1>
              <p>
                {activeTab === "orders" && "عرض وإدارة الطلبات المدخلة من العملاء وحالة شحنها"}
                {activeTab === "categories" && "إدارة وتصنيف أقسام المتجر وتحديث أيقوناتها"}
                {activeTab === "services" && "إدارة خدمات الشحن وتفاصيل حزم التسعير والباقات"}
                {activeTab === "banners" && "التحكم الكامل بالشرائح الإعلانية والعروض في الصفحة الرئيسية للموقع"}
                {activeTab === "wallets" && "مراجعة طلبات شحن الرصيد واعتمادها أو رفضها وتحديث رصيد العميل مباشرة"}
                {activeTab === "customers" && "استعراض الحسابات المسجلة، رصيد كل محفظة، وسجل الحركات المرتبط بكل عميل"}
              </p>
            </div>

          <div className="header-actions">
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
                      <span className="stat-card-value" style={{ color: "#22d3ee" }}>${stats.revenue.toFixed(2)}</span>
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

                {/* Table */}
                  <div className="premium-table-wrapper">
                    <table className="premium-table">
                    <thead>
                      <tr>
                        <th>رقم الطلب</th>
                        <th>الخدمة / التصنيف</th>
                        <th>الباقة المطلوبة</th>
                        <th>معرّف الحساب (ID)</th>
                        <th>رقم الهاتف</th>
                        <th>طريقة الدفع</th>
                        <th>رقم التحويل</th>
                        <th>تاريخ الطلب</th>
                        <th>الحالة</th>
                        <th style={{ textAlign: "center" }}>الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan="10" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                            لا توجد أي طلبات شحن تطابق معايير البحث.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => (
                          <tr key={order.id}>
                            <td style={{ fontWeight: 800, color: "#38bdf8" }}>#{order.id}</td>
                            <td>
                              <div style={{ fontWeight: 700 }}>{order.service_name}</div>
                              <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{order.category_name}</div>
                            </td>
                            <td style={{ fontWeight: 700, color: "#f8fafc" }}>
                              {order.package_name} 
                              <span style={{ color: "#34d399", marginRight: "6px", fontSize: "0.8rem" }}>
                                (${order.package_price.toFixed(2)})
                              </span>
                            </td>
                            <td style={{ direction: "ltr", fontWeight: 700, color: "#c084fc", textAlign: "right" }}>
                              {order.player_id}
                            </td>
                            <td>{order.phone}</td>
                            <td style={{ fontWeight: 700, color: order.payment_method === "wallet" ? "#34d399" : "#38bdf8" }}>
                              {order.payment_method === "wallet" && "المحفظة"}
                              {order.payment_method === "transfer" && `تحويل إلى ${order.transfer_to || "01026785879"}`}
                              {!order.payment_method && "غير محدد"}
                            </td>
                            <td style={{ direction: "ltr", fontWeight: 700, color: "#f8fafc" }}>
                              {order.payment_method === "transfer" ? (order.sender_phone || "-") : "-"}
                            </td>
                            <td style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                              {new Date(order.created_at).toLocaleString("ar-EG")}
                            </td>
                            <td>
                              <span className={`premium-badge premium-badge-${order.status}`}>
                                <span className="badge-dot" />
                                {order.status === "pending" && "انتظار"}
                                {order.status === "completed" && "مكتمل"}
                                {order.status === "cancelled" && "ملغي"}
                              </span>
                            </td>
                            <td style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                              {order.status === "pending" ? (
                                <>
                                  <button
                                    onClick={() => updateOrderStatus(order.id, "completed")}
                                    className="action-btn btn-success-premium"
                                  >
                                    <span>تم الشحن</span>
                                  </button>
                                  <button
                                    onClick={() => updateOrderStatus(order.id, "cancelled")}
                                    className="action-btn btn-danger-premium"
                                  >
                                    <span>إلغاء</span>
                                  </button>
                                </>
                              ) : (
                                <span style={{ color: "#475569", fontSize: "0.85rem", fontWeight: 600 }}>منتهي</span>
                              )}
                              <button
                                onClick={() => deleteOrder(order.id)}
                                className="action-btn btn-danger-premium"
                                style={{ background: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.2)" }}
                              >
                                <span>حذف</span>
                              </button>
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
                                <td style={{ fontWeight: 800, color: tx.type === "credit" ? "#34d399" : "#f87171" }}>#{tx.id}</td>
                                <td>
                                  <div style={{ fontWeight: 700 }}>{tx.customer_username}</div>
                                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>ID: {tx.customer_id}</div>
                                </td>
                                <td>
                                  <span className={`premium-badge ${tx.type === "credit" ? "premium-badge-approved" : "premium-badge-rejected"}`}>
                                    {tx.type === "credit" ? "إضافة" : "خصم"}
                                  </span>
                                </td>
                                <td style={{ fontWeight: 800, color: tx.type === "credit" ? "#34d399" : "#f87171" }}>
                                  ${Number(tx.amount || 0).toFixed(2)}
                                </td>
                                <td>${Number(tx.balance_before || 0).toFixed(2)}</td>
                                <td>${Number(tx.balance_after || 0).toFixed(2)}</td>
                                <td style={{ fontSize: "0.85rem", color: "#cbd5e1" }}>
                                  {tx.reference_type === "order" && `طلب #${tx.reference_id}`}
                                  {tx.reference_type === "wallet_request" && `شحن #${tx.reference_id}`}
                                  {!tx.reference_type && "-"}
                                </td>
                                <td style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
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
                            <td style={{ fontWeight: 800, color: "#38bdf8" }}>#{request.id}</td>
                            <td>
                              <div style={{ fontWeight: 700 }}>{request.customer_username}</div>
                              <div style={{ fontSize: "0.75rem", color: "#64748b" }}>ID: {request.customer_id}</div>
                            </td>
                            <td style={{ fontWeight: 800, color: "#34d399" }}>${Number(request.amount).toFixed(2)}</td>
                            <td style={{ direction: "ltr" }}>{request.sender_phone || "-"}</td>
                            <td style={{ maxWidth: "220px", color: "#cbd5e1" }}>{request.notes || "-"}</td>
                            <td style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                              {new Date(request.created_at).toLocaleString("ar-EG")}
                            </td>
                            <td>
                              <span className={`premium-badge premium-badge-${request.status}`}>
                                <span className="badge-dot" />
                                {request.status === "pending" && "انتظار"}
                                {request.status === "approved" && "مقبول"}
                                {request.status === "rejected" && "مرفوض"}
                              </span>
                            </td>
                            <td style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
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
                        <span className="stat-card-value">${customers.reduce((sum, c) => sum + Number(c.balance || 0), 0).toFixed(2)}</span>
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
                            <td colSpan="7" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                              لا يوجد عملاء يطابقون البحث.
                            </td>
                          </tr>
                        ) : (
                          filteredCustomers.map((customer) => (
                            <tr key={customer.id}>
                              <td style={{ fontWeight: 800, color: "#38bdf8" }}>#{customer.id}</td>
                              <td style={{ fontWeight: 700 }}>{customer.username}</td>
                              <td style={{ direction: "ltr", fontWeight: 700 }}>{customer.phone || "-"}</td>
                              <td style={{ color: "#94a3b8", fontWeight: 700 }}>{customer.password_masked || "مخفية"}</td>
                              <td style={{ fontWeight: 800, color: "#34d399" }}>${Number(customer.balance || 0).toFixed(2)}</td>
                              <td>
                                <span className={`premium-badge ${Number(customer.balance || 0) > 0 ? "premium-badge-approved" : "premium-badge-pending"}`}>
                                  {Number(customer.balance || 0) > 0 ? "يوجد رصيد" : "صفر"}
                                </span>
                              </td>
                              <td style={{ textAlign: "center" }}>
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
                                <td>
                                  <span className={`premium-badge ${tx.type === "credit" ? "premium-badge-approved" : "premium-badge-rejected"}`}>
                                    {tx.type === "credit" ? "إضافة" : "خصم"}
                                  </span>
                                </td>
                                <td style={{ fontWeight: 800, color: tx.type === "credit" ? "#34d399" : "#f87171" }}>
                                  ${Number(tx.amount || 0).toFixed(2)}
                                </td>
                                <td>${Number(tx.balance_before || 0).toFixed(2)}</td>
                                <td>${Number(tx.balance_after || 0).toFixed(2)}</td>
                                <td style={{ fontSize: "0.85rem", color: "#cbd5e1" }}>
                                  {tx.reference_type === "order" && `طلب #${tx.reference_id}`}
                                  {tx.reference_type === "order_refund" && `استرداد #${tx.reference_id}`}
                                  {tx.reference_type === "wallet_request" && `شحن #${tx.reference_id}`}
                                  {!tx.reference_type && "-"}
                                </td>
                                <td style={{ color: "#e2e8f0" }}>{tx.description || "-"}</td>
                                <td style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
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
                              <td style={{ fontWeight: 800, color: "#38bdf8" }}>#{service.id}</td>
                              <td style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <div style={{ width: "45px", height: "45px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
                                  {service.image && (service.image.startsWith("data:image") || service.image.startsWith("http") || service.image.startsWith("/uploads")) ? (
                                    <img src={service.image.startsWith("/uploads") ? `${API_BASE_URL}${service.image}` : service.image} alt={service.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                                  ) : (
                                    <span style={{ fontSize: "1.5rem" }}>
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
                                  <div style={{ fontWeight: 700 }}>{service.name}</div>
                                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                                    أيقونة: {service.image && (service.image.startsWith("data:image") || service.image.startsWith("http") || service.image.startsWith("/uploads")) ? "صورة مخصصة" : service.image}
                                  </div>
                                </div>
                              </td>
                              <td style={{ fontWeight: 700 }}>{parentCat ? parentCat.name : `قسم #${service.category_id}`}</td>
                              <td>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                  {parsedPackages && parsedPackages.map((pkg) => (
                                    <span key={pkg.id || pkg.name} className="pkg-tag">
                                      {pkg.name} (${pkg.price})
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td style={{ fontWeight: 800, color: "#34d399" }}>${Number(service.price || 0).toFixed(2)}</td>
                              <td style={{ textAlign: "center" }}>
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
                            <td style={{ fontWeight: 800, color: "#38bdf8" }}>#{banner.id}</td>
                            <td>
                              <div style={{ fontWeight: 700 }}>{banner.title}</div>
                              <div style={{ fontSize: "0.85rem", color: banner.color || "#8b5cf6", fontWeight: "bold" }}>
                                {banner.highlight}
                              </div>
                            </td>
                            <td style={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {banner.desc}
                            </td>
                            <td>
                              {banner.badge ? (
                                <span className="premium-badge" style={{ background: `${banner.color || '#8b5cf6'}22`, color: banner.color || '#8b5cf6', border: `1px solid ${banner.color || '#8b5cf6'}33` }}>
                                  {banner.badge}
                                </span>
                              ) : (
                                <span style={{ color: "#64748b" }}>لا يوجد</span>
                              )}
                            </td>
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                {banner.icon && (banner.icon.startsWith("data:image") || banner.icon.startsWith("http") || banner.icon.startsWith("/uploads")) ? (
                                  <img src={banner.icon.startsWith("/uploads") ? `${API_BASE_URL}${banner.icon}` : banner.icon} alt={banner.title} style={{ width: "35px", height: "35px", objectFit: "contain", borderRadius: "6px" }} />
                                ) : (
                                  <span style={{ fontSize: "1.4rem" }}>{banner.icon}</span>
                                )}
                                <span style={{ width: "16px", height: "16px", borderRadius: "50%", background: banner.color || "#8b5cf6", display: "inline-block", border: "1px solid rgba(255,255,255,0.1)" }} />
                              </div>
                            </td>
                            <td style={{ textAlign: "center" }}>
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
          </>
        )}
      </main>

      {/* Add Category Modal */}
      {showCatModal && (
        <div className="premium-overlay" onClick={() => setShowCatModal(false)}>
          <div className="premium-modal" onClick={(e) => e.stopPropagation()}>
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
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
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

              {/* Package Builder List */}
              <div style={{ border: "1px solid rgba(255, 255, 255, 0.05)", padding: "18px", borderRadius: "16px", background: "rgba(255, 255, 255, 0.02)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <h4 style={{ fontWeight: 800, fontSize: "0.9rem" }}>باقات الشحن المتوفرة (الحزم):</h4>
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
                    <div key={idx} className="pkg-row">
                      <input
                        type="text"
                        placeholder="اسم الباقة (مثلاً: 325 شدة)"
                        value={pkg.name}
                        onChange={(e) => handlePkgChange(idx, "name", e.target.value)}
                        style={{ flex: 2 }}
                        required
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="السعر بالدولار"
                        value={pkg.price || ""}
                        onChange={(e) => handlePkgChange(idx, "price", e.target.value)}
                        style={{ flex: 1, direction: "ltr" }}
                        required
                      />
                      {newServicePackages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePkgInput(idx)}
                          style={{ background: "none", border: "none", color: "#f87171", fontSize: "1.4rem", cursor: "pointer", padding: "0 8px" }}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
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
                    <div key={idx} className="pkg-row" style={{ flexWrap: "wrap", gap: "8px" }}>
                      <input
                        type="text"
                        placeholder="معرّف الحقل (ID مثل: player_id)"
                        value={f.id}
                        onChange={(e) => handleFieldChange(idx, "id", e.target.value)}
                        style={{ flex: 1, minWidth: "120px" }}
                        required
                      />
                      <input
                        type="text"
                        placeholder="اسم الحقل بالعربية (مثال: معرّف اللاعب)"
                        value={f.label}
                        onChange={(e) => handleFieldChange(idx, "label", e.target.value)}
                        style={{ flex: 1, minWidth: "120px" }}
                        required
                      />
                      <input
                        type="text"
                        placeholder="نص تلميح تلميحي"
                        value={f.placeholder}
                        onChange={(e) => handleFieldChange(idx, "placeholder", e.target.value)}
                        style={{ flex: 1, minWidth: "120px" }}
                      />
                      <select
                        value={f.type}
                        onChange={(e) => handleFieldChange(idx, "type", e.target.value)}
                        style={{
                          flex: 1,
                          minWidth: "80px",
                          padding: "8px",
                          borderRadius: "8px",
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                          background: "rgba(13, 18, 36, 0.7)",
                          color: "#ffffff"
                        }}
                      >
                        <option value="text">نص (text)</option>
                        <option value="tel">هاتف (tel)</option>
                        <option value="number">رقم (number)</option>
                        <option value="email">إيميل (email)</option>
                      </select>
                      
                      <button
                        type="button"
                        onClick={() => handleRemoveField(idx)}
                        style={{ background: "none", border: "none", color: "#f87171", fontSize: "1.4rem", cursor: "pointer", padding: "0 8px" }}
                      >
                        ×
                      </button>
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
          <div className="premium-modal" onClick={(e) => e.stopPropagation()}>
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

              {errorMsg && (
                <div style={{ color: "#f87171", fontSize: "0.85rem", fontWeight: "600" }}>
                  ⚠️ {errorMsg}
                </div>
              )}

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
          style={{ alignItems: "stretch", justifyContent: "stretch" }}
        >
          <div
            className="premium-modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100vw",
              height: "100vh",
              maxWidth: "100vw",
              maxHeight: "100vh",
              borderRadius: "0",
              overflowY: "auto",
              padding: "24px",
              boxSizing: "border-box"
            }}
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
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
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

              {/* Package Builder List */}
              <div style={{ border: "1px solid rgba(255, 255, 255, 0.05)", padding: "18px", borderRadius: "16px", background: "rgba(255, 255, 255, 0.02)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <h4 style={{ fontWeight: 800, fontSize: "0.9rem" }}>باقات الشحن المتوفرة (الحزم):</h4>
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
                    <div key={idx} className="pkg-row">
                      <input
                        type="text"
                        placeholder="اسم الباقة (مثلاً: 325 شدة)"
                        value={pkg.name}
                        onChange={(e) => handleEditPkgChange(idx, "name", e.target.value)}
                        style={{ flex: 2 }}
                        required
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="السعر بالدولار"
                        value={pkg.price || ""}
                        onChange={(e) => handleEditPkgChange(idx, "price", e.target.value)}
                        style={{ flex: 1, direction: "ltr" }}
                        required
                      />
                      {editServicePackages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveEditPkgInput(idx)}
                          style={{ background: "none", border: "none", color: "#f87171", fontSize: "1.4rem", cursor: "pointer", padding: "0 8px" }}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
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
                    <div key={idx} className="pkg-row" style={{ flexWrap: "wrap", gap: "8px" }}>
                      <input
                        type="text"
                        placeholder="معرّف الحقل (ID مثل: player_id)"
                        value={f.id}
                        onChange={(e) => handleEditFieldChange(idx, "id", e.target.value)}
                        style={{ flex: 1, minWidth: "120px" }}
                        required
                      />
                      <input
                        type="text"
                        placeholder="اسم الحقل بالعربية (مثال: معرّف اللاعب)"
                        value={f.label}
                        onChange={(e) => handleEditFieldChange(idx, "label", e.target.value)}
                        style={{ flex: 1, minWidth: "120px" }}
                        required
                      />
                      <input
                        type="text"
                        placeholder="نص تلميح تلميحي"
                        value={f.placeholder}
                        onChange={(e) => handleEditFieldChange(idx, "placeholder", e.target.value)}
                        style={{ flex: 1, minWidth: "120px" }}
                      />
                      <select
                        value={f.type}
                        onChange={(e) => handleEditFieldChange(idx, "type", e.target.value)}
                        style={{
                          flex: 1,
                          minWidth: "80px",
                          padding: "8px",
                          borderRadius: "8px",
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                          background: "rgba(13, 18, 36, 0.7)",
                          color: "#ffffff"
                        }}
                      >
                        <option value="text">نص (text)</option>
                        <option value="tel">هاتف (tel)</option>
                        <option value="number">رقم (number)</option>
                        <option value="email">إيميل (email)</option>
                      </select>
                      
                      <button
                        type="button"
                        onClick={() => handleRemoveEditField(idx)}
                        style={{ background: "none", border: "none", color: "#f87171", fontSize: "1.4rem", cursor: "pointer", padding: "0 8px" }}
                      >
                        ×
                      </button>
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
                <label>الرصيد الحالي:</label>
                <input
                  type="number"
                  step="0.01"
                  value={editCustomerBalance}
                  onChange={(e) => setEditCustomerBalance(e.target.value)}
                  className="search-input-premium"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>كلمة مرور جديدة (اختياري):</label>
                <input
                  type="password"
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
    </div>
  );
}
