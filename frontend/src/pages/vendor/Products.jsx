import React, { useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaEdit,
  FaTrash,
  FaEye,
  FaBoxOpen,
  FaDollarSign,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimes,
  FaImage,
} from "react-icons/fa";

// Sample Initial Vendor Products
const initialProducts = [
  {
    id: "PRD-101",
    name: "Wireless Noise-Canceling Headphones",
    category: "Electronics",
    price: 149.99,
    stock: 42,
    status: "Active",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150",
  },
  {
    id: "PRD-102",
    name: "Ergonomic Leather Office Chair",
    category: "Furniture",
    price: 289.00,
    stock: 8,
    status: "Low Stock",
    image: "https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=150",
  },
  {
    id: "PRD-103",
    name: "Smart Fitness Watch V2",
    category: "Electronics",
    price: 99.50,
    stock: 0,
    status: "Out of Stock",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150",
  },
  {
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
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Electronics",
    price: "",
    stock: "",
    status: "Active",
  });

  // Filter Logic
  const filteredProducts = products.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle Delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this product listing?")) {
      setProducts(products.filter((item) => item.id !== id));
    }
  };

  // Handle Create Product
  const handleAddProduct = (e) => {
    e.preventDefault();
    const productToAdd = {
      id: `PRD-${Math.floor(100 + Math.random() * 900)}`,
      name: newProduct.name,
      category: newProduct.category,
      price: parseFloat(newProduct.price) || 0,
      stock: parseInt(newProduct.stock) || 0,
      status: parseInt(newProduct.stock) === 0 ? "Out of Stock" : parseInt(newProduct.stock) < 10 ? "Low Stock" : "Active",
      image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=150",
    };

    setProducts([productToAdd, ...products]);
    setIsModalOpen(false);
    setNewProduct({ name: "", category: "Electronics", price: "", stock: "", status: "Active" });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Product Inventory</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Manage inventory levels, pricing, and live catalog listings.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-800 hover:bg-teal-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-900/10 active:scale-95 transition-all"
          >
            <FaPlus className="text-xs" /> Add New Product
          </button>
        </div>

        {/* METRICS / STATS OVERVIEW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Products</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{products.length}</h3>
            </div>
            <div className="p-3 bg-teal-50 text-teal-800 rounded-xl">
              <FaBoxOpen className="text-xl" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Listings</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {products.filter((p) => p.status === "Active").length}
              </h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
              <FaCheckCircle className="text-xl" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Low Inventory</p>
              <h3 className="text-2xl font-bold text-amber-600 mt-1">
                {products.filter((p) => p.status === "Low Stock").length}
              </h3>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <FaExclamationTriangle className="text-xl" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock Value</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                ${products.reduce((acc, item) => acc + item.price * item.stock, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
              <FaDollarSign className="text-xl" />
            </div>
          </div>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search by product name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 transition-all"
            />
            <FaSearch className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <FaFilter /> Status:
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700 transition"
            >
              <option value="All">All Items</option>
              <option value="Active">Active</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* PRODUCTS TABLE */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Product Details</th>
                  <th className="py-3.5 px-5">Category</th>
                  <th className="py-3.5 px-5">Price</th>
                  <th className="py-3.5 px-5">Stock Level</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200/80"
                          />
                          <div>
                            <p className="font-semibold text-slate-900">{product.name}</p>
                            <span className="text-xs text-slate-400">ID: {product.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 font-medium text-slate-600">{product.category}</td>
                      <td className="py-4 px-5 font-bold text-slate-900">${product.price.toFixed(2)}</td>
                      <td className="py-4 px-5 font-medium">{product.stock} units</td>
                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            product.status === "Active"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : product.status === "Low Stock"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-rose-50 text-rose-800 border-rose-200"
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
                          {product.status}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            title="View Public Storefront Page"
                            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                          >
                            <FaEye className="text-sm" />
                          </button>
                          <button
                            title="Edit Listing Details"
                            className="p-2 rounded-lg text-slate-400 hover:text-teal-700 hover:bg-teal-50 transition"
                          >
                            <FaEdit className="text-sm" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            title="Delete Listing"
                            className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-10 text-center text-slate-400">
                      No matching products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL: ADD PRODUCT */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">Add New Product Listing</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Product Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="e.g. Ergonomic Bluetooth Mouse"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Category
                    </label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-teal-700"
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Apparel">Apparel</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Unit Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      placeholder="49.99"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-teal-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Initial Stock Count
                  </label>
                  <input
                    type="number"
                    required
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    placeholder="25"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-teal-700"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-sm font-semibold text-white shadow-md transition"
                  >
                    Publish Listing
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}