import { useState, useMemo, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  Package,
  Plus,
  X,
  Search,
  Edit2,
  Trash2,
  Eye,
  Star,
  Tag,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Store,
  DollarSign,
  Hash,
  Sparkles,
  Sliders,
  Check,
  Percent,
  ExternalLink,
  UploadCloud,
  RefreshCw,
  Database,
  FileJson,
  Download,
} from "lucide-react";
import {
  addProduct,
  updateProduct as updateProductRedux,
  deleteProduct as deleteProductRedux,
} from "../../redux/slices/productSlice";
import { categories } from "../../data/categories";
import adminApi from "../../services/adminApi";
import { useConfirm } from "../../context/ModalContext";

/**
 * Generate clean URL-friendly slug
 */
const slugify = (text) => {
  return (text || "")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

const Products = () => {
  const dispatch = useDispatch();
  const { confirm, alert: modalAlert } = useConfirm();
  const reduxProducts = useSelector((state) => state.products.items || []);
  const storeList = useSelector((state) => state.stores?.items || []);
  const fileInputRef = useRef(null);

  // State
  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiNotice, setApiNotice] = useState(null); // { type: 'success' | 'error', text: '' }

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeFormTab, setActiveFormTab] = useState("general");

  // Bulk Products Import States
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkJsonInput, setBulkJsonInput] = useState("");
  const [isBulkSubmitting, setIsBulkSubmitting] = useState(false);
  const [bulkStatus, setBulkStatus] = useState(null);
  const bulkFileRef = useRef(null);

  // Multi-Selection & Bulk/All Deletion States
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isClearingAll, setIsClearingAll] = useState(false);

  // Form State strictly mirroring Mongoose Product schema
  const initialFormState = {
    title: "",
    slug: "",
    description: "",
    brand: "",
    sku: "",
    category: categories[0]?.id || "clothing",
    categoryName: categories[0]?.name || "Clothing",
    store: storeList[0]?.name || "Atelier Flagship Store",
    basePrice: "",
    discountPrice: "",
    stock: 25,
    hasVariants: false,
    images: [],
    attributes: [
      { name: "Material", value: "100% Cashmere" },
      { name: "Fit", value: "Tailored" },
    ],
    tags: ["luxury", "editorial"],
    isFeatured: false,
    isActive: true,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [newTagInput, setNewTagInput] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [selectedImageFiles, setSelectedImageFiles] = useState([]); // Raw files for multer
  const [formErrors, setFormErrors] = useState({});

  // Fetch products from backend API (requests up to 100 items for catalog)
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getProducts({ limit: 100 });
      const items = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.data)
          ? res.data.data
          : [];

      if (items.length > 0) {
        setProductList(items);
        // Sync Redux cache
        items.forEach((p) => {
          dispatch(updateProductRedux(p));
        });
      } else if (reduxProducts.length > 0) {
        setProductList(reduxProducts);
      }
    } catch (err) {
      console.warn("Backend products fetch notice:", err.message);
      // Fallback to local Redux items if server is offline
      if (reduxProducts.length > 0 && productList.length === 0) {
        setProductList(reduxProducts);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    const list = productList.length > 0 ? productList : reduxProducts;
    return list.filter((p) => {
      const title = p.title || p.name || "";
      const sku = p.sku || p.id || "";
      const brand = p.brand || "";
      const matchesSearch =
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brand.toLowerCase().includes(searchQuery.toLowerCase());

      const prodCat = p.category?.slug || p.category?.name || p.category || "";
      const matchesCategory =
        categoryFilter === "all" ||
        prodCat.toLowerCase() === categoryFilter.toLowerCase() ||
        p.categoryName?.toLowerCase() === categoryFilter.toLowerCase();

      let matchesStatus = true;
      if (statusFilter === "active") matchesStatus = p.isActive !== false;
      if (statusFilter === "inactive") matchesStatus = p.isActive === false;
      if (statusFilter === "featured") matchesStatus = p.isFeatured === true;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [productList, reduxProducts, searchQuery, categoryFilter, statusFilter]);

  // KPI Counters
  const currentItems = productList.length > 0 ? productList : reduxProducts;
  const totalProducts = currentItems.length;
  const inStockCount = currentItems.filter(
    (p) => (p.stock ?? p.stockCount ?? 0) > 8,
  ).length;
  const lowStockCount = currentItems.filter((p) => {
    const s = p.stock ?? p.stockCount ?? 0;
    return s > 0 && s <= 8;
  }).length;
  const outOfStockCount = currentItems.filter(
    (p) => (p.stock ?? p.stockCount ?? 0) === 0,
  ).length;
  const featuredCount = currentItems.filter((p) => p.isFeatured).length;

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setSelectedImageFiles([]);
    const randomSku = `SKU-${Math.floor(100000 + Math.random() * 900000)}`;
    setFormData({
      ...initialFormState,
      sku: randomSku,
      category: categories[0]?.id || "outerwear",
      categoryName: categories[0]?.name || "Outerwear",
      store: storeList[0]?.name || "Atelier Flagship Store",
      images: [
        {
          url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
          public_id: null,
          isPrimary: true,
        },
      ],
    });
    setFormErrors({});
    setActiveFormTab("general");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (p) => {
    setEditingProduct(p);
    setSelectedImageFiles([]);

    let normalizedImages = [];
    if (Array.isArray(p.images) && p.images.length > 0) {
      normalizedImages = p.images.map((img, idx) => {
        if (typeof img === "string") {
          return { url: img, public_id: null, isPrimary: idx === 0 };
        }
        return {
          _id: img._id,
          url: img.url,
          public_id: img.public_id || null,
          isPrimary: Boolean(img.isPrimary) || idx === 0,
        };
      });
    } else if (p.image) {
      normalizedImages = [{ url: p.image, public_id: null, isPrimary: true }];
    }

    setFormData({
      title: p.title || p.name || "",
      slug: p.slug || slugify(p.title || p.name || ""),
      description: p.description || "",
      brand: p.brand || "",
      sku: p.sku || p.id || "",
      category:
        p.category?._id || p.category?.slug || p.category || categories[0]?.id,
      categoryName: p.category?.name || p.categoryName || "Category",
      store:
        p.store?.name ||
        p.store ||
        storeList[0]?.name ||
        "Atelier Flagship Store",
      basePrice: p.basePrice ?? p.price ?? "",
      discountPrice: p.discountPrice ?? p.compareAtPrice ?? "",
      stock: p.stock ?? p.stockCount ?? 0,
      hasVariants: Boolean(p.hasVariants),
      images: normalizedImages,
      attributes:
        Array.isArray(p.attributes) && p.attributes.length > 0
          ? p.attributes
          : [{ name: "Material", value: "Cashmere" }],
      tags: Array.isArray(p.tags) ? p.tags : ["luxury"],
      isFeatured: Boolean(p.isFeatured),
      isActive: p.isActive !== false,
    });

    setFormErrors({});
    setActiveFormTab("general");
    setIsModalOpen(true);
  };

  // Auto-generate slug on title change
  const handleTitleChange = (val) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      ...(!editingProduct && { slug: slugify(val) }),
    }));
    if (formErrors.title) {
      setFormErrors((prev) => ({ ...prev, title: "" }));
    }
  };

  // Handle Multer Local File Selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setSelectedImageFiles((prev) => [...prev, ...files]);

    // Generate local blob previews
    const newPreviewImages = files.map((file, idx) => ({
      url: URL.createObjectURL(file),
      file,
      public_id: null,
      isPrimary: formData.images.length === 0 && idx === 0,
    }));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newPreviewImages],
    }));
  };

  // Add Image via URL
  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    const isFirst = formData.images.length === 0;
    setFormData((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        { url: newImageUrl.trim(), public_id: null, isPrimary: isFirst },
      ],
    }));
    setNewImageUrl("");
  };

  const handleSetPrimaryImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      })),
    }));
  };

  // Remove Image (Local + DB Sync)
  const handleRemoveImage = async (index) => {
    const targetImg = formData.images[index];

    // If editing existing product and image has a DB reference or server URL
    if (
      editingProduct &&
      (editingProduct._id || editingProduct.id) &&
      targetImg?.url &&
      !targetImg?.file
    ) {
      try {
        const prodId = editingProduct._id || editingProduct.id;
        await adminApi.deleteProductImage(prodId, {
          imageUrl: targetImg.url,
          imageId: targetImg._id,
        });
        setApiNotice({
          type: "success",
          text: "Image successfully deleted from server and database.",
        });
        setTimeout(() => setApiNotice(null), 3000);
      } catch (err) {
        console.warn("Direct image deletion warning:", err.message);
      }
    }

    setFormData((prev) => {
      const nextImages = prev.images.filter((_, i) => i !== index);
      if (nextImages.length > 0 && !nextImages.some((img) => img.isPrimary)) {
        nextImages[0].isPrimary = true;
      }
      return { ...prev, images: nextImages };
    });
  };

  // Dynamic Attribute Handlers
  const handleAddAttribute = () => {
    setFormData((prev) => ({
      ...prev,
      attributes: [...prev.attributes, { name: "", value: "" }],
    }));
  };

  const handleUpdateAttribute = (idx, field, val) => {
    setFormData((prev) => {
      const next = [...prev.attributes];
      next[idx] = { ...next[idx], [field]: val };
      return { ...prev, attributes: next };
    });
  };

  const handleRemoveAttribute = (idx) => {
    setFormData((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== idx),
    }));
  };

  // Tag Handlers
  const handleAddTag = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tag = newTagInput.trim().toLowerCase().replace(/,/g, "");
      if (tag && !formData.tags.includes(tag)) {
        setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
      }
      setNewTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  // Toggle Active Status (Live in DB)
  const handleToggleActive = async (p) => {
    const updatedStatus = p.isActive === false ? true : false;
    const targetId = p._id || p.id;
    try {
      await adminApi.updateProduct(targetId, { isActive: updatedStatus });
      setProductList((prev) =>
        prev.map((item) =>
          (item._id || item.id) === targetId
            ? { ...item, isActive: updatedStatus }
            : item,
        ),
      );
      dispatch(updateProductRedux({ ...p, isActive: updatedStatus }));
    } catch (err) {
      console.warn("Status toggle fallback:", err.message);
      dispatch(updateProductRedux({ ...p, isActive: updatedStatus }));
    }
  };

  // Delete Product Permanently (Live in DB + Disk Cleanup)
  const handleDeleteProduct = async (id) => {
    const ok = await confirm({
      title: "Permanent Product Deletion",
      message:
        "Are you sure you want to permanently delete this product and all associated media from the database? This action cannot be undone.",
      confirmText: "Delete Product",
      cancelText: "Cancel",
      type: "danger",
    });
    if (!ok) return;

    try {
      await adminApi.deleteProduct(id);
      setApiNotice({
        type: "success",
        text: "Product and media files deleted from database.",
      });
      setProductList((prev) => prev.filter((p) => (p._id || p.id) !== id));
      dispatch(deleteProductRedux(id));
      if (
        viewingProduct &&
        (viewingProduct._id === id || viewingProduct.id === id)
      ) {
        setViewingProduct(null);
      }
      setTimeout(() => setApiNotice(null), 3500);
    } catch (err) {
      console.warn("API delete error, executing local removal:", err.message);
      dispatch(deleteProductRedux(id));
      setProductList((prev) => prev.filter((p) => (p._id || p.id) !== id));
    }
  };

  // Generate 50 realistic luxury products template for bulk upload testing
  const generateSampleFiftyProducts = () => {
    const cats = [
      "Clothing",
      "Shoes",
      "Accessories",
      "Bags",
      "Watches",
      "Jewelry",
    ];
    return Array.from({ length: 50 }, (_, idx) => {
      const i = idx + 1;
      const cat = cats[(i - 1) % cats.length];
      const basePrice = 280 + i * 25;
      return {
        title: `Atelier Signature ${cat} Piece ${i}`,
        slug: `atelier-signature-${cat.toLowerCase()}-piece-${i}`,
        description: `Ultra-luxurious ${cat.toLowerCase()} handcrafted with premium sustainable raw textiles.`,
        brand: i % 2 === 0 ? "Maison Margaux" : "Atelier Sartorial",
        sku: `SKU-${cat.slice(0, 3).toUpperCase()}-${2000 + i}`,
        category: cat,
        store: "Atelier Flagship Store",
        basePrice,
        discountPrice: i % 3 === 0 ? basePrice - 45 : null,
        stock: 12 + (i % 20),
        hasVariants: i % 2 === 0,
        isFeatured: i % 4 === 0,
        isActive: true,
        images: [
          {
            url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80",
            isPrimary: true,
          },
        ],
        attributes: [
          {
            name: "Material",
            value:
              i % 2 === 0 ? "Pure Italian Cashmere" : "Super 160s Virgin Wool",
          },
        ],
        tags: ["luxury", cat.toLowerCase(), "editorial"],
      };
    });
  };

  // 1-Click Seed 50+ Products into MongoDB
  const handleSeedFiftyProducts = async () => {
    const ok = await confirm({
      title: "Seed Curated Database Catalog",
      message:
        "This will seed/upsert 50+ curated luxury products with high-resolution imagery into your MongoDB database. Continue?",
      confirmText: "Seed Catalog",
      cancelText: "Cancel",
      type: "database",
    });
    if (!ok) return;
    setIsSeeding(true);
    setApiNotice(null);
    try {
      const res = await adminApi.seedFiftyProducts();
      const count =
        res?.count || (Array.isArray(res?.data) ? res.data.length : null) || 54;
      const msg =
        res?.message ||
        res?.data?.message ||
        `Successfully seeded ${count} products into MongoDB database!`;
      setApiNotice({
        type: "success",
        text: msg,
      });
      await fetchProducts();
    } catch (err) {
      console.error("Seed 50 error:", err);
      setApiNotice({
        type: "error",
        text:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to seed 50+ products.",
      });
    } finally {
      setIsSeeding(false);
      setTimeout(() => setApiNotice(null), 6000);
    }
  };

  // Submit Bulk JSON Import
  const handleBulkSubmit = async () => {
    if (!bulkJsonInput.trim()) {
      modalAlert({
        title: "Input Required",
        message: "Please enter or paste JSON product data.",
        type: "warning",
      });
      return;
    }
    let parsed;
    try {
      parsed = JSON.parse(bulkJsonInput);
    } catch (e) {
      modalAlert({
        title: "Invalid JSON Format",
        message: "Please verify valid JSON syntax before proceeding.",
        type: "error",
      });
      return;
    }

    const items = Array.isArray(parsed) ? parsed : parsed.products || [parsed];
    if (!Array.isArray(items) || items.length === 0) {
      modalAlert({
        title: "Invalid Product Array",
        message:
          'JSON must be an array of products or an object containing a "products" array.',
        type: "warning",
      });
      return;
    }

    setIsBulkSubmitting(true);
    setBulkStatus(null);
    try {
      const res = await adminApi.createBulkProducts(items);
      const createdCount =
        res?.count ||
        (Array.isArray(res?.data) ? res.data.length : null) ||
        items.length;
      const msg =
        res?.message ||
        res?.data?.message ||
        `Successfully created ${createdCount} products in bulk!`;
      setApiNotice({
        type: "success",
        text: msg,
      });
      setIsBulkModalOpen(false);
      setBulkJsonInput("");
      await fetchProducts();
    } catch (err) {
      console.error("Bulk upload error:", err);
      setBulkStatus({
        type: "error",
        text:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to bulk import products.",
      });
    } finally {
      setIsBulkSubmitting(false);
      setTimeout(() => setApiNotice(null), 6000);
    }
  };

  // Load JSON template into bulk modal
  const handleLoadSampleTemplate = () => {
    const samples = generateSampleFiftyProducts();
    setBulkJsonInput(JSON.stringify(samples, null, 2));
    setBulkStatus({
      type: "info",
      text: `Loaded ${samples.length} sample products template. Review or click 'Import Products Now' below.`,
    });
  };

  // Handle JSON file selection
  const handleBulkFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const parsed = JSON.parse(text);
        const count = Array.isArray(parsed)
          ? parsed.length
          : parsed.products?.length || 0;
        setBulkJsonInput(text);
        setBulkStatus({
          type: "info",
          text: `Loaded file "${file.name}" with ${count} product(s).`,
        });
      } catch (err) {
        modalAlert({
          title: "File Upload Error",
          message: "Uploaded file is not valid JSON syntax.",
          type: "error",
        });
      }
    };
    reader.readAsText(file);
  };

  // Toggle selection for a single product
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Check if all or some filtered items are selected
  const isAllSelected = useMemo(() => {
    return (
      filteredProducts.length > 0 &&
      filteredProducts.every((p) => selectedIds.has(p._id || p.id))
    );
  }, [filteredProducts, selectedIds]);

  const isSomeSelected = useMemo(() => {
    return (
      filteredProducts.some((p) => selectedIds.has(p._id || p.id)) &&
      !isAllSelected
    );
  }, [filteredProducts, selectedIds, isAllSelected]);

  // Toggle select all on current filtered view
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      const newSet = new Set(selectedIds);
      filteredProducts.forEach((p) => {
        const id = p._id || p.id;
        if (id) newSet.add(id);
      });
      setSelectedIds(newSet);
    }
  };

  // Delete all selected products at once
  const handleDeleteSelected = async () => {
    const count = selectedIds.size;
    if (count === 0) return;

    const ok = await confirm({
      title: "Bulk Deletion",
      message: `Are you sure you want to permanently delete ${count} selected products from the database? This action cannot be undone.`,
      confirmText: `Delete ${count} Products`,
      cancelText: "Cancel",
      type: "danger",
    });
    if (!ok) return;

    setIsBulkDeleting(true);
    setApiNotice(null);
    try {
      const idsArray = Array.from(selectedIds);
      const res = await adminApi.deleteMultipleProducts(idsArray);
      const deletedCount = res?.deletedCount || count;
      setApiNotice({
        type: "success",
        text:
          res?.message ||
          `Successfully removed ${deletedCount} products from database!`,
      });

      // Update local and Redux states
      setProductList((prev) =>
        prev.filter((p) => !selectedIds.has(p._id || p.id)),
      );
      idsArray.forEach((id) => dispatch(deleteProductRedux(id)));
      setSelectedIds(new Set());
      await fetchProducts();
    } catch (err) {
      console.error("Delete selected error:", err);
      setApiNotice({
        type: "error",
        text:
          err?.response?.data?.message ||
          err.message ||
          "Failed to delete selected products.",
      });
    } finally {
      setIsBulkDeleting(false);
      setTimeout(() => setApiNotice(null), 5000);
    }
  };

  // Purge / Clear all products from catalog
  const handleClearAllProducts = async () => {
    if (productList.length === 0) {
      modalAlert({
        title: "Catalog Empty",
        message: "The product catalog is already empty.",
        type: "info",
      });
      return;
    }

    const confirmPrompt = window.prompt(
      `DANGER: This will permanently delete ALL ${productList.length} products in the database and clean up images.\n\nTo confirm, type "DELETE" below:`,
    );

    if (confirmPrompt !== "DELETE") {
      return;
    }

    setIsClearingAll(true);
    setApiNotice(null);
    try {
      const res = await adminApi.clearAllProducts();
      setApiNotice({
        type: "success",
        text: res?.message || "All products have been cleared from database.",
      });
      setProductList([]);
      setSelectedIds(new Set());
      productList.forEach((p) => dispatch(deleteProductRedux(p._id || p.id)));
    } catch (err) {
      console.error("Clear all error:", err);
      setApiNotice({
        type: "error",
        text:
          err?.response?.data?.message ||
          err.message ||
          "Failed to clear catalog.",
      });
    } finally {
      setIsClearingAll(false);
      setTimeout(() => setApiNotice(null), 6000);
    }
  };

  // Submit Product (Create or Edit with Multer FormData)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.title.trim()) errors.title = "Product title is required.";
    if (!formData.slug.trim()) errors.slug = "Product slug is required.";
    if (!formData.description.trim())
      errors.description = "Description is required.";
    if (formData.basePrice === "" || Number(formData.basePrice) < 0) {
      errors.basePrice = "Valid base price is required.";
    }
    if (
      formData.discountPrice !== "" &&
      Number(formData.discountPrice) > Number(formData.basePrice)
    ) {
      errors.discountPrice = "Discount price cannot exceed base price.";
    }
    if (formData.images.length === 0) {
      errors.images = "At least one product image or file is required.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      if (errors.title || errors.slug || errors.description)
        setActiveFormTab("general");
      else if (errors.basePrice || errors.discountPrice)
        setActiveFormTab("pricing");
      else if (errors.images) setActiveFormTab("media");
      return;
    }

    setIsSubmitting(true);
    setApiNotice(null);

    try {
      // Build FormData for Multer file uploads & structured JSON
      const data = new FormData();
      data.append("title", formData.title.trim());
      data.append("slug", slugify(formData.slug));
      data.append("description", formData.description.trim());
      data.append("brand", formData.brand.trim() || "Atelier Signature");
      data.append(
        "sku",
        formData.sku.trim() || `SKU-${Date.now().toString().slice(-6)}`,
      );
      data.append("category", formData.category);
      data.append("store", formData.store);
      data.append("basePrice", Number(formData.basePrice));
      if (formData.discountPrice !== "") {
        data.append("discountPrice", Number(formData.discountPrice));
      }
      data.append("stock", Number(formData.stock));
      data.append("hasVariants", Boolean(formData.hasVariants));
      data.append("isFeatured", Boolean(formData.isFeatured));
      data.append("isActive", Boolean(formData.isActive));

      data.append(
        "attributes",
        JSON.stringify(formData.attributes.filter((a) => a.name && a.value)),
      );
      data.append("tags", JSON.stringify(formData.tags));

      // Append existing retained URLs
      const existingUrls = formData.images
        .filter((img) => !img.file)
        .map((img) => ({
          url: img.url,
          public_id: img.public_id || null,
          isPrimary: Boolean(img.isPrimary),
        }));
      data.append("images", JSON.stringify(existingUrls));

      // Append new multer files
      selectedImageFiles.forEach((file) => {
        data.append("images", file);
      });

      let res;
      // Only call update if editingProduct has a valid MongoDB _id
      const hasMongoId =
        editingProduct &&
        editingProduct._id &&
        String(editingProduct._id).length === 24;
      if (hasMongoId) {
        res = await adminApi.updateProduct(editingProduct._id, data);
        setApiNotice({
          type: "success",
          text: "Product updated successfully in MongoDB!",
        });
      } else {
        res = await adminApi.createProduct(data);
        setApiNotice({
          type: "success",
          text: "Product created and media uploaded successfully!",
        });
      }

      setIsModalOpen(false);
      fetchProducts();
      setTimeout(() => setApiNotice(null), 4000);
    } catch (err) {
      console.error("Product save error:", err);
      // If server error, fallback to Redux state save
      const primaryImg =
        formData.images.find((i) => i.isPrimary) || formData.images[0];
      const localProd = {
        id: editingProduct
          ? editingProduct.id || editingProduct._id
          : `PROD-${Date.now().toString().slice(-6)}`,
        title: formData.title.trim(),
        name: formData.title.trim(),
        slug: slugify(formData.slug),
        description: formData.description.trim(),
        brand: formData.brand.trim() || "Atelier Signature",
        sku: formData.sku.trim(),
        category: formData.category,
        categoryName: formData.categoryName,
        store: formData.store,
        basePrice: Number(formData.basePrice),
        price: Number(formData.basePrice),
        discountPrice:
          formData.discountPrice !== "" ? Number(formData.discountPrice) : null,
        stock: Number(formData.stock),
        stockCount: Number(formData.stock),
        inStock: Number(formData.stock) > 0,
        hasVariants: Boolean(formData.hasVariants),
        images: formData.images,
        image: primaryImg?.url,
        attributes: formData.attributes,
        tags: formData.tags,
        isFeatured: Boolean(formData.isFeatured),
        isActive: Boolean(formData.isActive),
      };

      if (editingProduct) {
        dispatch(updateProductRedux(localProd));
      } else {
        dispatch(addProduct(localProd));
      }

      setIsModalOpen(false);
      setApiNotice({
        type: "error",
        text: err.message || "Saved locally (Backend API unavailable).",
      });
      setTimeout(() => setApiNotice(null), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Product Catalog
            </h2>
            <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full font-bold">
              Multer & MongoDB Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete management for catalog items, multi-image upload,
            specifications, and SKU inventories.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchProducts}
            disabled={isLoading}
            title="Refresh Catalog from Database"
            className="p-2.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
          </button>

          {/* Purge / Clear All Products from Database */}
          {productList.length > 0 && (
            <button
              type="button"
              onClick={handleClearAllProducts}
              disabled={isClearingAll || isLoading}
              title="Delete all products from MongoDB"
              className="flex items-center gap-1.5 px-3 py-2.5 border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
            >
              <Trash2
                size={14}
                className={isClearingAll ? "animate-spin" : ""}
              />
              <span className="hidden md:inline">
                {isClearingAll ? "Purging..." : "Clear All"}
              </span>
            </button>
          )}

          <Link
            to="/admin/products/add"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            <ExternalLink size={14} />
            <span>Full Page Add</span>
          </Link>

          {/* 1-Click Seed 50+ Luxury Products into MongoDB */}
          <button
            type="button"
            onClick={handleSeedFiftyProducts}
            disabled={isSeeding || isLoading}
            title="Populate/Sync 50+ curated luxury products directly into MongoDB"
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg text-xs font-bold shadow-sm transition-all duration-150 disabled:opacity-60"
          >
            <Sparkles size={14} className={isSeeding ? "animate-spin" : ""} />
            <span>{isSeeding ? "Seeding 50+..." : "Seed 50+ Products"}</span>
          </button>

          {/* Bulk Import JSON (50+ products) */}
          <button
            type="button"
            onClick={() => {
              setIsBulkModalOpen(true);
              setBulkStatus(null);
            }}
            title="Import 50+ products at once via JSON payload or template"
            className="flex items-center gap-1.5 px-3.5 py-2.5 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-colors shadow-sm"
          >
            <UploadCloud size={14} />
            <span>Bulk Import (50+)</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus size={16} />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Global Alerts */}
      {apiNotice && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2.5 border ${
            apiNotice.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          {apiNotice.type === "success" ? (
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle size={16} className="text-rose-600 shrink-0" />
          )}
          <span>{apiNotice.text}</span>
        </div>
      )}

      {/* Real Metric KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Total Catalog
          </span>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">
              {totalProducts}
            </span>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
              Items
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            In Stock
          </span>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-700">
              {inStockCount}
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
              Healthy
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Low Stock (&le;8)
          </span>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-600">
              {lowStockCount}
            </span>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
              Restock
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Out of Stock
          </span>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-2xl font-black text-rose-600">
              {outOfStockCount}
            </span>
            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">
              0 Units
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Featured Spotlight
          </span>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-500 flex items-center gap-1">
              <Star size={18} fill="currentColor" />
              <span>{featuredCount}</span>
            </span>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
              Featured
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by Title, SKU, or Brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-indigo-600"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-indigo-600"
          >
            <option value="all">All Statuses</option>
            <option value="active">Published Only</option>
            <option value="inactive">Draft / Inactive</option>
            <option value="featured">Featured Only</option>
          </select>
        </div>
      </div>

      {/* Selected Items Bulk Action Toolbar */}
      {selectedIds.size > 0 && (
        <div className="bg-indigo-900 text-white p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-md animate-in slide-in-from-top-2 duration-200 border border-indigo-800">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-indigo-700 flex items-center justify-center text-xs font-bold text-white shadow-inner">
              {selectedIds.size}
            </span>
            <span className="text-xs font-semibold tracking-wide">
              {selectedIds.size} product{selectedIds.size > 1 ? "s" : ""}{" "}
              selected (out of {filteredProducts.length})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {selectedIds.size < filteredProducts.length && (
              <button
                type="button"
                onClick={handleSelectAll}
                className="px-3 py-1.5 text-xs text-indigo-200 hover:text-white hover:bg-indigo-800 rounded-lg transition-colors font-medium"
              >
                Select all {filteredProducts.length}
              </button>
            )}

            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              className="px-3 py-1.5 text-xs text-indigo-200 hover:text-white hover:bg-indigo-800 rounded-lg transition-colors font-medium"
            >
              Deselect all
            </button>

            <button
              type="button"
              onClick={handleDeleteSelected}
              disabled={isBulkDeleting}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow transition-colors disabled:opacity-50"
            >
              <Trash2
                size={13}
                className={isBulkDeleting ? "animate-spin" : ""}
              />
              <span>
                {isBulkDeleting
                  ? "Deleting..."
                  : `Delete Selected (${selectedIds.size})`}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Product Catalog Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4 w-10 text-center">
                  <input
                    type="checkbox"
                    aria-label="Select all visible products"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isSomeSelected;
                    }}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer accent-indigo-600"
                  />
                </th>
                <th className="p-4">Product Details</th>
                <th className="p-4">Store & Category</th>
                <th className="p-4">Price & Pricing</th>
                <th className="p-4">Inventory</th>
                <th className="p-4">Flags & Specs</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Package
                      size={36}
                      className="mx-auto text-slate-300 mb-2"
                    />
                    <p className="font-semibold text-slate-600 text-sm">
                      {isLoading
                        ? "Loading catalog from database..."
                        : "No products found"}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isLoading
                        ? "Please wait..."
                        : 'Click "Add New Product" to create your first item.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const id = p._id || p.id;
                  let primaryImgUrl = "https://placehold.co/100";

                  if (Array.isArray(p.images) && p.images.length > 0) {
                    const found =
                      p.images.find((img) => img.isPrimary) || p.images[0];
                    primaryImgUrl =
                      typeof found === "string"
                        ? found
                        : found?.url || "https://placehold.co/100";
                  } else if (p.image) {
                    primaryImgUrl = p.image;
                  }

                  // If relative uploaded path, prepend backend base URL if needed
                  if (primaryImgUrl.startsWith("/uploads/")) {
                    primaryImgUrl = `http://localhost:8081${primaryImgUrl}`;
                  }

                  const base = Number(p.basePrice ?? p.price ?? 0);
                  const discount =
                    p.discountPrice != null
                      ? Number(p.discountPrice)
                      : p.compareAtPrice != null
                        ? Number(p.compareAtPrice)
                        : null;
                  const stock = Number(p.stock ?? p.stockCount ?? 0);
                  const isActive = p.isActive !== false;
                  const isFeatured = Boolean(p.isFeatured);
                  const sku = p.sku || p.id;
                  const storeName =
                    p.store?.name || p.store || "Atelier Flagship";
                  const catName =
                    p.category?.name || p.categoryName || "Category";
                  const isSelected = selectedIds.has(id);

                  return (
                    <tr
                      key={id}
                      className={
                        isSelected
                          ? "bg-indigo-50/70 transition-colors"
                          : "hover:bg-slate-50/80 transition-colors"
                      }
                    >
                      {/* Row Selection Checkbox */}
                      <td className="p-4 w-10 text-center">
                        <input
                          type="checkbox"
                          aria-label={`Select product ${p.title || p.name}`}
                          checked={isSelected}
                          onChange={() => handleToggleSelect(id)}
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer accent-indigo-600"
                        />
                      </td>

                      {/* Product Details */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                            <img
                              src={primaryImgUrl}
                              alt={p.title || p.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "https://placehold.co/100";
                              }}
                            />
                            {Array.isArray(p.images) && p.images.length > 1 && (
                              <span className="absolute bottom-0 right-0 bg-slate-900/80 text-white text-[9px] font-mono px-1 rounded-tl">
                                +{p.images.length - 1}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span
                                className="font-bold text-slate-900 text-xs truncate max-w-[200px]"
                                title={p.title || p.name}
                              >
                                {p.title || p.name}
                              </span>
                              {isFeatured && (
                                <Star
                                  size={13}
                                  className="text-amber-500 fill-amber-500 shrink-0"
                                  title="Featured Product"
                                />
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate">
                              {p.brand ? (
                                <span className="font-semibold text-slate-700">
                                  {p.brand} •{" "}
                                </span>
                              ) : (
                                ""
                              )}
                              <span className="font-mono text-[10px] text-slate-400">
                                {sku}
                              </span>
                            </div>
                            <div className="text-[10px] font-mono text-indigo-600 truncate mt-0.5">
                              /{p.slug || slugify(p.title || p.name)}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Store & Category */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            {catName}
                          </span>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                            <Store
                              size={12}
                              className="text-slate-400 shrink-0"
                            />
                            <span className="truncate">{storeName}</span>
                          </div>
                        </div>
                      </td>

                      {/* Price & Discount */}
                      <td className="p-4">
                        <div>
                          {discount && discount < base ? (
                            <div className="space-y-0.5">
                              <div className="font-black text-emerald-700 text-xs flex items-center gap-1">
                                <span>₹{discount.toLocaleString()}</span>
                                <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1 rounded border border-emerald-200">
                                  {Math.round(((base - discount) / base) * 100)}
                                  % OFF
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 line-through">
                                ₹{base.toLocaleString()}
                              </span>
                            </div>
                          ) : (
                            <span className="font-black text-slate-900 text-xs">
                              ₹{base.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stock Level */}
                      <td className="p-4">
                        <div>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              stock > 8
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : stock > 0
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-rose-50 text-rose-700 border-rose-200"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                stock > 8
                                  ? "bg-emerald-500"
                                  : stock > 0
                                    ? "bg-amber-500"
                                    : "bg-rose-500"
                              }`}
                            />
                            {stock > 0 ? `${stock} units` : "Out of Stock"}
                          </span>
                        </div>
                      </td>

                      {/* Flags & Specs */}
                      <td className="p-4">
                        <div className="flex flex-wrap items-center gap-1 max-w-[160px]">
                          {p.hasVariants && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                              VARIANTS
                            </span>
                          )}
                          {Array.isArray(p.attributes) &&
                            p.attributes.length > 0 && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-100 text-slate-600 border border-slate-200">
                                {p.attributes.length} attrs
                              </span>
                            )}
                          {Array.isArray(p.tags) && p.tags.length > 0 && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-100 text-slate-600 border border-slate-200">
                              #{p.tags[0]}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Active Status Switch */}
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(p)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                            isActive
                              ? "bg-emerald-100/70 text-emerald-800 hover:bg-emerald-200/70"
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                          }`}
                        >
                          {isActive ? "Published" : "Draft"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setViewingProduct(p)}
                            title="Quick View Details"
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(p)}
                            title="Edit Product"
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(id)}
                            title="Delete Product from Database"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} />
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
      </div>

      {/* QUICK VIEW DETAILS MODAL */}
      {viewingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Package size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {viewingProduct.title || viewingProduct.name}
                  </h3>
                  <p className="text-[11px] font-mono text-slate-400">
                    {viewingProduct.sku || viewingProduct.id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingProduct(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs font-sans">
              {/* Image Preview Carousel */}
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2">
                  Product Imagery (
                  {Array.isArray(viewingProduct.images)
                    ? viewingProduct.images.length
                    : 1}
                  )
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {Array.isArray(viewingProduct.images) &&
                  viewingProduct.images.length > 0 ? (
                    viewingProduct.images.map((img, idx) => {
                      let url = typeof img === "string" ? img : img.url;
                      if (url && url.startsWith("/uploads/"))
                        url = `http://localhost:8081${url}`;
                      const isPrimary =
                        typeof img === "object" && img.isPrimary;
                      return (
                        <div
                          key={idx}
                          className="relative aspect-3/4 rounded-lg overflow-hidden border border-slate-200 bg-slate-50"
                        >
                          <img
                            src={url}
                            alt="img"
                            className="w-full h-full object-cover"
                          />
                          {isPrimary && (
                            <span className="absolute top-1 left-1 bg-indigo-600 text-white text-[8px] font-mono px-1 py-0.5 rounded font-bold">
                              PRIMARY
                            </span>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="aspect-3/4 rounded-lg overflow-hidden border border-slate-200">
                      <img
                        src={viewingProduct.image || "https://placehold.co/200"}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Grid of Key Properties */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Base Price
                  </span>
                  <span className="text-sm font-black text-slate-900">
                    ₹
                    {Number(
                      viewingProduct.basePrice ?? viewingProduct.price ?? 0,
                    ).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Discount Price
                  </span>
                  <span className="text-sm font-black text-emerald-700">
                    {viewingProduct.discountPrice
                      ? `₹${Number(viewingProduct.discountPrice).toLocaleString()}`
                      : "None"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Stock Available
                  </span>
                  <span className="text-sm font-black text-slate-900">
                    {viewingProduct.stock ?? viewingProduct.stockCount ?? 0}{" "}
                    Units
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Category
                  </span>
                  <span className="text-xs font-semibold text-slate-800">
                    {viewingProduct.category?.name ||
                      viewingProduct.categoryName ||
                      viewingProduct.category}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Store / Boutique
                  </span>
                  <span className="text-xs font-semibold text-slate-800">
                    {viewingProduct.store?.name ||
                      viewingProduct.store ||
                      "Atelier Flagship"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Slug
                  </span>
                  <span className="text-[11px] font-mono text-indigo-600 truncate block">
                    /{viewingProduct.slug}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  Description
                </span>
                <p className="text-slate-600 leading-relaxed bg-slate-50/70 p-3 rounded-lg border border-slate-200">
                  {viewingProduct.description ||
                    "No product description provided."}
                </p>
              </div>

              {/* Attributes */}
              {Array.isArray(viewingProduct.attributes) &&
                viewingProduct.attributes.length > 0 && (
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-2">
                      Specifications & Attributes
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {viewingProduct.attributes.map((attr, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between"
                        >
                          <span className="text-slate-500 font-semibold">
                            {attr.name}:
                          </span>
                          <span className="font-bold text-slate-800">
                            {attr.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Tags */}
              {Array.isArray(viewingProduct.tags) &&
                viewingProduct.tags.length > 0 && (
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1.5">
                      Discovery Tags
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {viewingProduct.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full text-[10px] font-mono font-semibold"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50">
              <button
                type="button"
                onClick={() => setViewingProduct(null)}
                className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const p = viewingProduct;
                  setViewingProduct(null);
                  handleOpenEditModal(p);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
              >
                Edit Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE & EDIT PRODUCT MODAL (COMPLETE SCHEMA MATCH WITH MULTER) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center">
                  <Package size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    {editingProduct
                      ? "Edit Product & Media"
                      : "Create New Product"}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    MongoDB Product Schema & Multer Upload
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Navigation Tabs */}
            <div className="grid grid-cols-5 border-b border-slate-200 bg-slate-50 text-xs font-semibold">
              {[
                { id: "general", label: "1. General" },
                { id: "pricing", label: "2. Pricing & Stock" },
                { id: "media", label: "3. Images (Multer)" },
                { id: "attributes", label: "4. Specs & Tags" },
                { id: "status", label: "5. Visibility" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFormTab(tab.id)}
                  className={`py-3 px-1 text-center border-b-2 text-[10px] sm:text-xs uppercase tracking-wider transition-colors ${
                    activeFormTab === tab.id
                      ? "border-indigo-600 text-indigo-600 bg-white font-bold"
                      : "border-transparent text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Form Body */}
            <form
              onSubmit={handleSubmitForm}
              className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs"
            >
              {/* TAB 1: GENERAL INFORMATION */}
              {activeFormTab === "general" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Product Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. Double-Breasted Cashmere Overcoat"
                      className={`w-full px-3.5 py-2.5 border rounded-lg text-xs focus:outline-none focus:border-indigo-600 ${
                        formErrors.title
                          ? "border-rose-500"
                          : "border-slate-300"
                      }`}
                    />
                    {formErrors.title && (
                      <p className="text-[11px] text-rose-600 mt-1">
                        {formErrors.title}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Product Slug * (URL identifier)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-slate-400 text-xs">
                          /
                        </span>
                        <input
                          type="text"
                          required
                          value={formData.slug}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              slug: slugify(e.target.value),
                            })
                          }
                          placeholder="cashmere-overcoat"
                          className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-indigo-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        SKU (Stock Keeping Unit)
                      </label>
                      <input
                        type="text"
                        value={formData.sku}
                        onChange={(e) =>
                          setFormData({ ...formData, sku: e.target.value })
                        }
                        placeholder="SKU-849204"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Category Reference *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => {
                          const catId = e.target.value;
                          const catObj = categories.find((c) => c.id === catId);
                          setFormData({
                            ...formData,
                            category: catId,
                            categoryName: catObj?.name || catId,
                          });
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Store / Boutique Reference *
                      </label>
                      <input
                        type="text"
                        value={formData.store}
                        onChange={(e) =>
                          setFormData({ ...formData, store: e.target.value })
                        }
                        placeholder="Atelier Flagship Store"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Brand / Maison
                    </label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) =>
                        setFormData({ ...formData, brand: e.target.value })
                      }
                      placeholder="e.g. Maison Margiela, Loro Piana"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Product Description *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Detailed sartorial narrative, fabrication origin, lining, and finishings..."
                      className="w-full p-3 border border-slate-300 rounded-lg text-xs leading-relaxed focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: PRICING & INVENTORY */}
              {activeFormTab === "pricing" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Base Price (₹ INR) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                          ₹
                        </span>
                        <input
                          type="number"
                          required
                          min="0"
                          value={formData.basePrice}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              basePrice: e.target.value,
                            })
                          }
                          placeholder="24500"
                          className={`w-full pl-8 pr-3 py-2.5 border rounded-lg text-xs font-semibold focus:outline-none focus:border-indigo-600 ${
                            formErrors.basePrice
                              ? "border-rose-500"
                              : "border-slate-300"
                          }`}
                        />
                      </div>
                      {formErrors.basePrice && (
                        <p className="text-[11px] text-rose-600 mt-1">
                          {formErrors.basePrice}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Discount Price (₹ INR) - Optional
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                          ₹
                        </span>
                        <input
                          type="number"
                          min="0"
                          value={formData.discountPrice}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              discountPrice: e.target.value,
                            })
                          }
                          placeholder="18500"
                          className={`w-full pl-8 pr-3 py-2.5 border rounded-lg text-xs font-semibold focus:outline-none focus:border-indigo-600 ${
                            formErrors.discountPrice
                              ? "border-rose-500"
                              : "border-slate-300"
                          }`}
                        />
                      </div>
                      {formErrors.discountPrice && (
                        <p className="text-[11px] text-rose-600 mt-1">
                          {formErrors.discountPrice}
                        </p>
                      )}
                      {formData.basePrice &&
                        formData.discountPrice &&
                        Number(formData.discountPrice) <=
                          Number(formData.basePrice) && (
                          <p className="text-[11px] text-emerald-600 mt-1 font-semibold flex items-center gap-1">
                            <Percent size={12} />
                            <span>
                              {Math.round(
                                ((formData.basePrice - formData.discountPrice) /
                                  formData.basePrice) *
                                  100,
                              )}
                              % markdown applied
                            </span>
                          </p>
                        )}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Stock Inventory Units *
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: e.target.value })
                      }
                      className="w-full sm:w-1/2 px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Items with stock &le; 8 trigger the restock attention
                      alert.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block text-xs">
                        Multi-Variant Configuration
                      </span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Enable if this SKU contains size, color, or fabric
                        sub-variants.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.hasVariants}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hasVariants: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 3: MEDIA & MULTER IMAGES */}
              {activeFormTab === "media" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {/* Multer Local File Upload Zone */}
                  <div
                    className="p-4 border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/40 rounded-xl text-center cursor-pointer transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <UploadCloud
                      size={28}
                      className="mx-auto text-indigo-600 mb-1.5"
                    />
                    <span className="font-bold text-slate-800 text-xs block">
                      Click to Browse Images (Multer Upload)
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Upload JPEG, PNG, WEBP files directly to backend /uploads
                      storage (Max 10MB)
                    </span>
                    <input
                      type="file"
                      ref={fileInputRef}
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  {/* Or Add Image via URL */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Or Add via Image URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600"
                      />
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shrink-0"
                      >
                        Add URL
                      </button>
                    </div>
                    {formErrors.images && (
                      <p className="text-[11px] text-rose-600 mt-1">
                        {formErrors.images}
                      </p>
                    )}
                  </div>

                  {/* Images Gallery Preview */}
                  <div>
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2">
                      Configured Images ({formData.images.length})
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {formData.images.map((img, idx) => {
                        let displayUrl = img.url;
                        if (displayUrl.startsWith("/uploads/"))
                          displayUrl = `http://localhost:8081${displayUrl}`;
                        return (
                          <div
                            key={idx}
                            className={`group relative aspect-3/4 rounded-xl overflow-hidden border-2 bg-slate-50 transition-all ${
                              img.isPrimary
                                ? "border-indigo-600 ring-2 ring-indigo-100"
                                : "border-slate-200"
                            }`}
                          >
                            <img
                              src={displayUrl}
                              alt="product"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "https://placehold.co/200";
                              }}
                            />

                            {/* Primary Badge */}
                            {img.isPrimary && (
                              <span className="absolute top-1.5 left-1.5 bg-indigo-600 text-white text-[9px] font-mono px-1.5 py-0.5 rounded font-bold shadow-xs">
                                PRIMARY
                              </span>
                            )}

                            {/* Actions overlay */}
                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                              <div className="flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(idx)}
                                  className="p-1 bg-rose-600 text-white rounded hover:bg-rose-700"
                                  title="Remove & Delete Image"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>

                              {!img.isPrimary && (
                                <button
                                  type="button"
                                  onClick={() => handleSetPrimaryImage(idx)}
                                  className="w-full py-1 bg-white/90 hover:bg-white text-slate-900 text-[10px] font-bold rounded"
                                >
                                  Make Primary
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: SPECIFICATIONS & DISCOVERY TAGS */}
              {activeFormTab === "attributes" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <label className="block font-semibold text-slate-700">
                          Product Attributes & Specifications
                        </label>
                        <p className="text-[11px] text-slate-400">
                          Custom properties (e.g. Fabric, Origin, Cut, Collar,
                          Care, etc.)
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddAttribute}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                      >
                        <Plus size={14} />
                        <span>Add Row</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {formData.attributes.map((attr, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={attr.name}
                            onChange={(e) =>
                              handleUpdateAttribute(idx, "name", e.target.value)
                            }
                            placeholder="e.g. Fabric / Material"
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600"
                          />
                          <input
                            type="text"
                            value={attr.value}
                            onChange={(e) =>
                              handleUpdateAttribute(
                                idx,
                                "value",
                                e.target.value,
                              )
                            }
                            placeholder="e.g. 100% Super 150s Wool"
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveAttribute(idx)}
                            className="p-2 text-slate-400 hover:text-rose-600 rounded-lg"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200">
                    <label className="block font-semibold text-slate-700 mb-1">
                      Search Tags & SEO Keywords
                    </label>
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder="Type tag and press Enter (e.g. bespoke, winter, tuxedo)..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600"
                    />

                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {formData.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200"
                          >
                            #{t}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(t)}
                              className="hover:text-indigo-900"
                            >
                              <X size={11} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: VISIBILITY & STATUS FLAGS */}
              {activeFormTab === "status" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block text-xs">
                        Catalog Status (isActive)
                      </span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        When active, customers can discover and purchase this
                        item in the boutique storefront.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isActive: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
                    </label>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block text-xs flex items-center gap-1.5">
                        <Star
                          size={14}
                          className="text-amber-500 fill-amber-500"
                        />
                        <span>Featured Hero Showcase (isFeatured)</span>
                      </span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Highlight in the home page editorial spotlight and top
                        luxury banner carousels.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isFeatured: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
                    </label>
                  </div>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <span>
                    Step{" "}
                    {activeFormTab === "general"
                      ? 1
                      : activeFormTab === "pricing"
                        ? 2
                        : activeFormTab === "media"
                          ? 3
                          : activeFormTab === "attributes"
                            ? 4
                            : 5}{" "}
                    of 5
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving to Database...</span>
                      </>
                    ) : (
                      <span>
                        {editingProduct ? "Update Product" : "Save Product"}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Import 50+ Products Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Top Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                  <Database size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <span>Bulk Add 50+ Products</span>
                    <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      Batch API
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Insert 50, 100, or more products at once into MongoDB via
                    JSON array or seed template.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              {/* Quick Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleLoadSampleTemplate}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                  >
                    <Sparkles size={13} />
                    <span>Load 50 Products Template</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => bulkFileRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-sm transition-colors"
                  >
                    <FileJson size={13} />
                    <span>Upload .json File</span>
                  </button>
                  <input
                    ref={bulkFileRef}
                    type="file"
                    accept=".json"
                    onChange={handleBulkFileChange}
                    className="hidden"
                  />
                </div>

                {bulkJsonInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setBulkJsonInput("");
                      setBulkStatus(null);
                    }}
                    className="text-xs text-slate-500 hover:text-rose-600 transition-colors"
                  >
                    Clear Editor
                  </button>
                )}
              </div>

              {/* Status Alert */}
              {bulkStatus && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
                    bulkStatus.type === "error"
                      ? "bg-rose-50 text-rose-800 border-rose-200"
                      : "bg-indigo-50 text-indigo-800 border-indigo-200"
                  }`}
                >
                  {bulkStatus.type === "error" ? (
                    <AlertCircle size={15} className="text-rose-600 shrink-0" />
                  ) : (
                    <CheckCircle2
                      size={15}
                      className="text-indigo-600 shrink-0"
                    />
                  )}
                  <span>{bulkStatus.text}</span>
                </div>
              )}

              {/* JSON Textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-slate-700">
                    JSON Payload [ products array ]
                  </label>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {bulkJsonInput
                      ? `${bulkJsonInput.length.toLocaleString()} chars`
                      : "Empty"}
                  </span>
                </div>
                <textarea
                  value={bulkJsonInput}
                  onChange={(e) => setBulkJsonInput(e.target.value)}
                  rows={14}
                  placeholder={`[\n  {\n    "title": "Luxury Cashmere Trench Coat",\n    "basePrice": 850,\n    "discountPrice": 720,\n    "stock": 25,\n    "category": "Clothing",\n    "store": "Atelier Flagship Store",\n    "images": [{ "url": "https://...", "isPrimary": true }]\n  },\n  ...\n]`}
                  className="w-full font-mono text-xs p-3.5 bg-slate-900 text-emerald-400 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 selection:bg-indigo-600 selection:text-white"
                />
              </div>

              {/* Helper guide */}
              <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <p className="font-semibold text-slate-700">
                  Schema Requirements:
                </p>
                <p>
                  Each product requires{" "}
                  <code className="text-indigo-600">title</code> and{" "}
                  <code className="text-indigo-600">basePrice</code>. Categories
                  and Stores are resolved automatically by name or ID. Unique
                  slugs and SKUs are automatically handled if not provided.
                </p>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2.5 bg-slate-50/50">
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(false)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleBulkSubmit}
                disabled={isBulkSubmitting || !bulkJsonInput.trim()}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-60"
              >
                {isBulkSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Inserting Products into Database...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud size={14} />
                    <span>Import Products Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
