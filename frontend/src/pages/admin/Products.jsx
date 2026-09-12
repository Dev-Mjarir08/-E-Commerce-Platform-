import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Package,
  Plus,
  X
} from 'lucide-react';
import {
  addProduct,
  updateProduct,
  deleteProduct
} from '../../redux/slices/productSlice';
import { categories } from '../../data/categories';

const Products = () => {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.products.items);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: categories[0]?.id || 'clothing',
    categoryName: categories[0]?.name || 'Clothing',
    price: '',
    compareAtPrice: '',
    stockCount: 15,
    description: '',
    image: ''
  });

  // Inventory stats calculated strictly from real productList
  const totalProducts = productList.length;
  const inStockCount = productList.filter((p) => (p.stockCount ?? 0) > 8).length;
  const lowStockCount = productList.filter((p) => (p.stockCount ?? 0) > 0 && (p.stockCount ?? 0) <= 8).length;
  const outOfStockCount = productList.filter((p) => (p.stockCount ?? 0) === 0).length;

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: `PROD-${Math.floor(1000 + Math.random() * 9000)}`,
      category: categories[0]?.id || 'clothing',
      categoryName: categories[0]?.name || 'Clothing',
      price: '',
      compareAtPrice: '',
      stockCount: 20,
      description: '',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.id,
      category: product.category,
      categoryName: product.categoryName || product.category,
      price: product.price,
      compareAtPrice: product.compareAtPrice || '',
      stockCount: product.stockCount ?? 0,
      description: product.description || '',
      image: product.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
    });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id));
    }
  };

  const handleToggleStatus = (prod) => {
    dispatch(
      updateProduct({
        ...prod,
        inStock: prod.inStock === false ? true : false
      })
    );
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert('Please enter product name and price.');
      return;
    }

    if (editingProduct) {
      dispatch(
        updateProduct({
          ...editingProduct,
          name: formData.name,
          category: formData.category,
          categoryName: formData.categoryName,
          price: Number(formData.price),
          compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : null,
          stockCount: Number(formData.stockCount),
          description: formData.description,
          images: [formData.image, ...(editingProduct.images?.slice(1) || [])]
        })
      );
    } else {
      const newProd = {
        id: formData.sku || `PROD-${Date.now().toString().slice(-4)}`,
        name: formData.name,
        category: formData.category,
        categoryName: formData.categoryName,
        price: Number(formData.price),
        compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : null,
        stockCount: Number(formData.stockCount),
        inStock: Number(formData.stockCount) > 0,
        description: formData.description,
        images: [formData.image]
      };
      dispatch(addProduct(newProd));
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Product Catalog</h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage your store's inventory, prices, stock levels, and SKUs.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Products</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">{totalProducts}</span>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              Active
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">In Stock</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-700">{inStockCount}</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              Healthy
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Low Stock Alert</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-700">{lowStockCount}</span>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
              &le; 8 units
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Out of Stock</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-black text-rose-700">{outOfStockCount}</span>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
              0 units
            </span>
          </div>
        </div>
      </div>

      {/* Product Management Overview Card */}
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center mx-auto mb-3">
          <Package size={24} />
        </div>
        <h3 className="text-base font-bold text-slate-900">Product Catalog Management</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
          Catalog table and search view are currently hidden. You can register and configure products using the "Add New Product" action.
        </p>
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus size={15} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <p className="text-xs text-slate-500">Enter product specifications and pricing</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitForm} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Classic Oxford Cotton Shirt"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    SKU / Unique Identifier
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="e.g. PROD-1024"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const selected = categories.find((c) => c.id === e.target.value);
                      setFormData({
                        ...formData,
                        category: e.target.value,
                        categoryName: selected?.name || e.target.value
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Initial Stock Count *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stockCount}
                    onChange={(e) => setFormData({ ...formData, stockCount: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 1999"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Original / Compare-at Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                    placeholder="e.g. 2499 (Optional)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Product description and details..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                ></textarea>
              </div>

              {/* Form Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
