import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Boxes,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  ArrowUpDown,
  Edit,
  Save,
  X,
} from "lucide-react";
import { updateProduct } from "../../../redux/slices/productSlice";
import adminApi from "../../../services/adminApi";
import { useModal } from "../../../context/ModalContext";

const Inventory = () => {
  const dispatch = useDispatch();
  const { alert: modalAlert } = useModal();
  const products = useSelector((state) => state.products.items);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editStockValue, setEditStockValue] = useState(0);

  // Stock stats
  const totalProducts = products.length;
  const inStockCount = products.filter(
    (p) => (p.stockCount ?? p.stock ?? 0) > 8,
  ).length;
  const lowStockCount = products.filter(
    (p) =>
      (p.stockCount ?? p.stock ?? 0) > 0 && (p.stockCount ?? p.stock ?? 0) <= 8,
  ).length;
  const outOfStockCount = products.filter(
    (p) => (p.stockCount ?? p.stock ?? 0) === 0,
  ).length;

  // Filtered products
  const filteredProducts = products.filter((product) => {
    const stock = product.stockCount ?? product.stock ?? 0;
    const matchesSearch =
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterStatus === "low") return stock > 0 && stock <= 8;
    if (filterStatus === "out") return stock === 0;
    if (filterStatus === "in") return stock > 8;
    return true;
  });

  const handleStartEdit = (product) => {
    setEditingId(product.id);
    setEditStockValue(product.stockCount ?? product.stock ?? 0);
  };

  const handleSaveStock = async (product) => {
    const newStock = parseInt(editStockValue, 10) || 0;
    const productId = product.id || product._id;

    try {
      const response = await adminApi.updateProduct(productId, {
        stockCount: newStock,
        stock: newStock,
      });

      const updatedProduct = response?.product || response?.data || response;

      dispatch(
        updateProduct({
          ...product,
          ...updatedProduct,
          id: product.id || productId,
          _id: product._id || productId,
          stockCount: newStock,
          stock: newStock,
        }),
      );

      setEditingId(null);
    } catch (error) {
      console.error("Failed to update stock:", error);
      modalAlert({
        title: "Stock Update Failed",
        message: error?.response?.data?.message || error.message || "Failed to update stock in database.",
        type: "danger"
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Inventory Management
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Monitor product stock levels, replenish shortages, and manage
          inventory valuation.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Boxes size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Products</p>
              <p className="text-2xl font-bold text-slate-900">
                {totalProducts}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-500">In Stock</p>
              <p className="text-2xl font-bold text-slate-900">
                {inStockCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Low Stock (≤ 8)</p>
              <p className="text-2xl font-bold text-slate-900">
                {lowStockCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-rose-50 text-rose-600">
              <XCircle size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Out of Stock</p>
              <p className="text-2xl font-bold text-slate-900">
                {outOfStockCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search
            className="absolute left-3 top-2.5 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search products or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {[
            { id: "all", label: "All Items" },
            { id: "low", label: "Low Stock" },
            { id: "out", label: "Out of Stock" },
            { id: "in", label: "Adequate" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filterStatus === tab.id
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-base font-semibold text-slate-900">
            Inventory Stock Levels
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredProducts.length} of {products.length} items
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <Boxes size={44} className="mx-auto text-slate-300" />
            <h3 className="mt-3 text-sm font-semibold text-slate-700">
              No inventory records found
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {products.length === 0
                ? "Add products to your catalog to track inventory here."
                : "No products matched your search/filter criteria."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">
                    Product
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">
                    Category
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">
                    Price
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">
                    Quantity In Stock
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">
                    Status
                  </th>
                  <th className="text-right px-5 py-3 font-semibold text-slate-600">
                    Quick Edit
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const stock = product.stockCount ?? product.stock ?? 0;
                  const isEditing = editingId === product.id;

                  let statusBadge = (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      In Stock
                    </span>
                  );
                  if (stock === 0) {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        Out of Stock
                      </span>
                    );
                  } else if (stock <= 8) {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        Low Stock
                      </span>
                    );
                  }

                  return (
                    <tr
                      key={product.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              product.image ||
                              product.images?.[0] ||
                              "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=120&q=80"
                            }
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                          />
                          <div>
                            <p className="font-semibold text-slate-800 line-clamp-1">
                              {product.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              SKU: {product.sku || product.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-slate-600 capitalize">
                        {product.categoryName || product.category || "General"}
                      </td>

                      <td className="px-5 py-4 text-slate-800 font-semibold">
                        ₹{Number(product.price || 0).toLocaleString()}
                      </td>

                      <td className="px-5 py-4">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              value={editStockValue}
                              onChange={(e) =>
                                setEditStockValue(e.target.value)
                              }
                              className="w-20 px-2 py-1 border border-indigo-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveStock(product)}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                              title="Save"
                            >
                              <Save size={16} />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                              title="Cancel"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <span className="font-bold text-slate-900">
                            {stock} units
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">{statusBadge}</td>

                      <td className="px-5 py-4 text-right">
                        {!isEditing && (
                          <button
                            onClick={() => handleStartEdit(product)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition-colors"
                          >
                            <Edit size={14} />
                            Adjust Stock
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
