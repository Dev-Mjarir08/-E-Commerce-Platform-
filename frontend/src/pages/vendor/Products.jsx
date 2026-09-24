import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Boxes,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Tag
} from "lucide-react";
import productApi from "../../services/productApi";

// Initial fallback products
const initialProducts = [
  {
    _id: "PRD-101",
    id: "PRD-101",
    name: "Wireless Noise-Canceling Headphones",
    category: "Electronics",
    price: 149.99,
    stock: 42,
    status: "Active",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150",
  },
  {
    _id: "PRD-102",
    id: "PRD-102",
    name: "Ergonomic Leather Office Chair",
    category: "Furniture",
    price: 289.00,
    stock: 8,
    status: "Low Stock",
    image: "https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=150",
  },
  {
    _id: "PRD-103",
    id: "PRD-103",
    name: "Smart Fitness Watch V2",
    category: "Electronics",
    price: 99.50,
    stock: 0,
    status: "Out of Stock",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150",
  },
  {
    _id: "PRD-104",
    id: "PRD-104",
    name: "Stainless Steel Water Bottle (1L)",
    category: "Accessories",
    price: 24.99,
    stock: 115,
    status: "Active",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=150",
  },
];

export default function VendorProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [toastMessage, setToastMessage] = useState(null);

  const fetchMyProducts = async () => {
    setLoading(true);
    try {
      const response = await productApi.getMyProducts();
      const list = response?.data?.products || response?.products || response?.data;
      if (Array.isArray(list) && list.length > 0) {
        setProducts(
          list.map((p) => ({
            ...p,
            id: p._id || p.id,
            image:
              p.images?.[0]?.url ||
              p.image ||
              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150",
            category: p.category?.name || p.category || "General",
            status:
              p.stock === 0
                ? "Out of Stock"
                : p.stock < 10
                ? "Low Stock"
                : p.status === "active" || p.status === "Active"
                ? "Active"
                : "Inactive",
          }))
        );
      }
    } catch (err) {
      console.warn("Using local product catalog fallback:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this product listing?")) return;
    try {
      await productApi.deleteProduct(id);
      setProducts((prev) => prev.filter((item) => (item._id || item.id) !== id));
      setToastMessage("Product listing removed.");
    } catch (err) {
      setProducts((prev) => prev.filter((item) => (item._id || item.id) !== id));
      setToastMessage("Product listing removed (local).");
    } finally {
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleToggleStatus = async (product) => {
    const nextStatus = product.status === "Active" ? "Inactive" : "Active";
    try {
      await productApi.updateProductStatus(product._id || product.id, {
        status: nextStatus.toLowerCase(),
      });
      setProducts((prev) =>
        prev.map((item) =>
          (item._id || item.id) === (product._id || product.id)
            ? { ...item, status: nextStatus }
            : item
        )
      );
      setToastMessage(`Product marked as ${nextStatus}.`);
    } catch (err) {
      setProducts((prev) =>
        prev.map((item) =>
          (item._id || item.id) === (product._id || product.id)
            ? { ...item, status: nextStatus }
            : item
        )
      );
      setToastMessage(`Product marked as ${nextStatus} (local).`);
    } finally {
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const filteredProducts = products.filter((item) => {
    const name = (item.name || "").toLowerCase();
    const id = (item._id || item.id || "").toLowerCase();
    const cat = (item.category || "").toLowerCase();
    const q = searchTerm.toLowerCase();
    const matchesSearch = name.includes(q) || id.includes(q) || cat.includes(q);
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCatalog = products.length;
  const activeCount = products.filter((p) => p.status === "Active").length;
  const lowStockCount = products.filter((p) => p.status === "Low Stock" || p.stock < 10).length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl text-xs font-mono flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Product Catalog
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage your boutique offerings, update pricing, stocks, and variant attributes.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={fetchMyProducts}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg shadow-xs transition-colors"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-emerald-600" : ""} />
            <span>Sync</span>
          </button>
          <Link
            to="/vendor/products/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg shadow-xs transition-colors"
          >
            <Plus size={15} />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Total Items</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalCatalog}</p>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
            <Boxes size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Live in Store</span>
            <p className="text-2xl font-bold text-emerald-700 mt-1">{activeCount}</p>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Low / Out of Stock</span>
            <p className="text-2xl font-bold text-amber-600 mt-1">{lowStockCount}</p>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
            <AlertTriangle size={20} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by product name, SKU, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase text-slate-500 font-medium hidden sm:inline">Status:</span>
          {["All", "Active", "Low Stock", "Out of Stock"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === status
                  ? "bg-slate-900 text-white font-semibold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-mono uppercase text-[11px]">
                <th className="py-3.5 px-4 font-semibold">Product</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Price</th>
                <th className="py-3.5 px-4 font-semibold">Stock</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Boxes size={32} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-xs font-semibold text-slate-600">No products found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Try updating your search query or add a new listing.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const id = product._id || product.id;
                  return (
                    <tr key={id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 truncate max-w-xs">{product.name}</p>
                            <span className="text-[10px] font-mono text-slate-400">ID: #{id?.slice(-8) || id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-600">{product.category}</td>
                      <td className="py-3.5 px-4 font-bold font-mono text-slate-900">${product.price?.toFixed(2)}</td>
                      <td className="py-3.5 px-4 font-mono font-medium">
                        <span className={product.stock < 10 ? "text-amber-600 font-bold" : "text-slate-700"}>
                          {product.stock} units
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleStatus(product)}
                          title="Click to toggle active status"
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold border transition-colors ${
                            product.status === "Active"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                              : product.status === "Low Stock"
                              ? "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                              : "bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              product.status === "Active"
                                ? "bg-emerald-500"
                                : product.status === "Low Stock"
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            }`}
                          />
                          <span>{product.status}</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/product/${id}`}
                            title="View Public Boutique Listing"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            <Eye size={14} />
                          </Link>
                          <Link
                            to={`/vendor/products/edit/${id}`}
                            title="Edit Listing Details"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                          >
                            <Edit size={14} />
                          </Link>
                          <button
                            onClick={() => handleDelete(id)}
                            title="Delete Listing"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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
    </div>
  );
}