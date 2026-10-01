import React, { useMemo, useState, useEffect } from "react";
import brandApi from "../../services/brandApi";
import { useModal } from "../../context/ModalContext";
import {
  Search,
  Plus,
  Filter,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  Star,
  Package,
  Tag,
  Eye,
  X,
  Save,
  RefreshCw,
} from "lucide-react";

const initialBrands = [
  {
    id: 1,
    name: "Samsung",
    slug: "samsung",
    category: "Electronics",
    products: 128,
    status: "active",
    featured: true,
    description: "Consumer electronics and smart devices.",
    logo: "S",
  },
  {
    id: 2,
    name: "Nike",
    slug: "nike",
    category: "Fashion",
    products: 96,
    status: "active",
    featured: true,
    description: "Sportswear, footwear and lifestyle products.",
    logo: "N",
  },
  {
    id: 3,
    name: "Adidas",
    slug: "adidas",
    category: "Fashion",
    products: 84,
    status: "active",
    featured: false,
    description: "Sports and lifestyle apparel.",
    logo: "A",
  },
  {
    id: 4,
    name: "Apple",
    slug: "apple",
    category: "Electronics",
    products: 54,
    status: "active",
    featured: true,
    description: "Consumer technology and electronics.",
    logo: "A",
  },
  {
    id: 5,
    name: "Whirlpool",
    slug: "whirlpool",
    category: "Home Appliances",
    products: 42,
    status: "inactive",
    featured: false,
    description: "Home appliances and kitchen products.",
    logo: "W",
  },
  {
    id: 6,
    name: "Puma",
    slug: "puma",
    category: "Fashion",
    products: 63,
    status: "active",
    featured: false,
    description: "Sportswear and footwear brand.",
    logo: "P",
  },
  {
    id: 7,
    name: "Sony",
    slug: "sony",
    category: "Electronics",
    products: 71,
    status: "active",
    featured: true,
    description: "Entertainment and consumer electronics.",
    logo: "S",
  },
  {
    id: 8,
    name: "LG",
    slug: "lg",
    category: "Home Appliances",
    products: 58,
    status: "active",
    featured: false,
    description: "Electronics and home appliances.",
    logo: "L",
  },
];

const Brands = () => {
  const { confirm: modalConfirm, alert: modalAlert } = useModal();
  const [brands, setBrands] = useState(initialBrands);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await brandApi.getBrands();
        const list = res?.data || res;
        if (!ignore && Array.isArray(list) && list.length > 0) {
          setBrands(list.map((b) => ({
            ...b,
            id: b._id || b.id,
            name: b.name,
            slug: b.slug,
            category: b.category || "General",
            products: b.productCount || b.products || 0,
            status: b.isActive === false || b.status === "inactive" ? "inactive" : "active",
            featured: Boolean(b.isFeatured ?? b.featured),
            description: b.description || "",
            logo: b.logo || b.name?.charAt(0)?.toUpperCase() || "B"
          })));
        }
      } catch {
        // Keep initial brands fallback
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const [form, setForm] = useState({
    name: "",
    category: "Electronics",
    description: "",
    featured: false,
  });

  const categories = useMemo(
    () => [...new Set(brands.map((brand) => brand.category))],
    [brands]
  );

  const summary = useMemo(
    () => ({
      total: brands.length,
      active: brands.filter((brand) => brand.status === "active").length,
      featured: brands.filter((brand) => brand.featured).length,
      products: brands.reduce((sum, brand) => sum + (Number(brand.products) || 0), 0),
    }),
    [brands]
  );

  const filteredBrands = useMemo(() => {
    const query = search.toLowerCase().trim();

    return brands.filter((brand) => {
      const matchesSearch =
        !query ||
        brand.name.toLowerCase().includes(query) ||
        brand.slug.toLowerCase().includes(query);

      const matchesStatus =
        status === "all" || brand.status === status;

      const matchesCategory =
        category === "all" || brand.category === category;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [brands, search, status, category]);

  const openCreate = () => {
    setEditingBrand(null);

    setForm({
      name: "",
      category: "Electronics",
      description: "",
      featured: false,
    });

    setShowForm(true);
  };

  const openEdit = (brand) => {
    setEditingBrand(brand);

    setForm({
      name: brand.name,
      category: brand.category,
      description: brand.description,
      featured: brand.featured,
    });

    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      slug: form.name.toLowerCase().trim().replace(/\s+/g, "-"),
      category: form.category,
      description: form.description,
      featured: form.featured,
      isFeatured: form.featured,
      logo: form.name.charAt(0).toUpperCase(),
    };

    if (editingBrand) {
      try {
        await brandApi.updateBrand(editingBrand._id || editingBrand.id, payload);
      } catch (err) {
        console.warn("Brand update fallback:", err.message);
      }
      setBrands((current) =>
        current.map((brand) =>
          brand.id === editingBrand.id
            ? { ...brand, ...payload }
            : brand
        )
      );
      modalAlert({
        title: "Brand Updated",
        message: `Brand "${form.name}" has been updated.`,
        type: "success"
      });
    } else {
      let createdId = Date.now();
      try {
        const res = await brandApi.createBrand(payload);
        if (res?.data?._id) createdId = res.data._id;
      } catch (err) {
        console.warn("Brand create fallback:", err.message);
      }
      const newBrand = {
        id: createdId,
        _id: createdId,
        ...payload,
        products: 0,
        status: "active",
      };

      setBrands((current) => [...current, newBrand]);
      modalAlert({
        title: "Brand Created",
        message: `New brand "${form.name}" has been added to catalog.`,
        type: "success"
      });
    }

    setShowForm(false);
    setEditingBrand(null);
  };

  const toggleStatus = async (id) => {
    const brand = brands.find((b) => b.id === id);
    const nextStatus = brand?.status === "active" ? "inactive" : "active";
    try {
      await brandApi.updateBrand(id, { status: nextStatus, isActive: nextStatus === "active" });
    } catch {
      // Ignore update error and proceed with local update
    }
    setBrands((current) =>
      current.map((b) =>
        b.id === id ? { ...b, status: nextStatus } : b
      )
    );
  };

  const toggleFeatured = async (id) => {
    const brand = brands.find((b) => b.id === id);
    const nextFeatured = !brand?.featured;
    try {
      await brandApi.updateBrand(id, { featured: nextFeatured, isFeatured: nextFeatured });
    } catch {
      // Ignore update error and proceed with local update
    }
    setBrands((current) =>
      current.map((b) =>
        b.id === id ? { ...b, featured: nextFeatured } : b
      )
    );
  };

  const deleteBrand = async (id) => {
    const brand = brands.find((item) => item.id === id);
    if (!brand) return;

    const ok = await modalConfirm({
      title: "Delete Brand",
      message: `Are you sure you want to permanently delete brand "${brand.name}"? Products under this brand will lose their brand association.`,
      type: "danger",
      confirmText: "Delete Brand",
      cancelText: "Cancel"
    });

    if (!ok) return;

    try {
      await brandApi.deleteBrand(id);
    } catch {
      // Ignore delete error and proceed with local delete
    }
    setBrands((current) => current.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
              <Tag className="h-4 w-4" />
              Catalog Management
            </div>

            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Brand Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage product brands, visibility and featured brands.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setBrands([...initialBrands])}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>

            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Add Brand
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Total Brands
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {summary.total}
                </p>
              </div>

              <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600">
                <Tag className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Active Brands
                </p>
                <p className="mt-2 text-2xl font-bold text-emerald-600">
                  {summary.active}
                </p>
              </div>

              <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Featured
                </p>
                <p className="mt-2 text-2xl font-bold text-amber-600">
                  {summary.featured}
                </p>
              </div>

              <div className="rounded-lg bg-amber-50 p-3 text-amber-600">
                <Star className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Products
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {summary.products.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="rounded-lg bg-slate-100 p-3 text-slate-600">
                <Package className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search brands..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-8 text-sm outline-none focus:border-indigo-500 sm:w-48"
                >
                  <option value="all">All Categories</option>

                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500 sm:w-40"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Desktop table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-[1000px] w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Brand
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Category
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Products
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Featured
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredBrands.map((brand) => (
                  <tr
                    key={brand.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-lg font-bold text-indigo-600">
                          {brand.logo}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-900">
                            {brand.name}
                          </p>

                          <p className="text-xs text-slate-400">
                            /{brand.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700">
                        {brand.category}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Package className="h-4 w-4 text-slate-400" />
                        {brand.products}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => toggleFeatured(brand.id)}
                        className={`rounded-lg p-2 transition ${
                          brand.featured
                            ? "bg-amber-50 text-amber-500"
                            : "bg-slate-100 text-slate-400"
                        }`}
                        title="Toggle featured"
                      >
                        <Star
                          className="h-4 w-4"
                          fill={brand.featured ? "currentColor" : "none"}
                        />
                      </button>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                          brand.status === "active"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-slate-100 text-slate-600"
                        }`}
                      >
                        {brand.status === "active"
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedBrand(brand)}
                          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => openEdit(brand)}
                          className="rounded-lg border border-slate-200 p-2 text-indigo-600 hover:bg-indigo-50"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleStatus(brand.id)}
                          className={`rounded-lg border p-2 ${
                            brand.status === "active"
                              ? "border-amber-200 text-amber-600 hover:bg-amber-50"
                              : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                          }`}
                          title={
                            brand.status === "active"
                              ? "Deactivate"
                              : "Activate"
                          }
                        >
                          {brand.status === "active" ? (
                            <XCircle className="h-4 w-4" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteBrand(brand.id)}
                          className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredBrands.length === 0 && (
              <div className="px-6 py-16 text-center">
                <Tag className="mx-auto h-10 w-10 text-slate-300" />
                <h3 className="mt-3 font-semibold text-slate-900">
                  No brands found
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Try another search or filter.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingBrand ? "Edit Brand" : "Add Brand"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Configure your product brand information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Brand Name
                </label>

                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="e.g. Samsung"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Category
                </label>

                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
                >
                  <option>Electronics</option>
                  <option>Fashion</option>
                  <option>Home Appliances</option>
                  <option>Home & Living</option>
                  <option>Beauty</option>
                  <option>Grocery</option>
                  <option>Sports</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  placeholder="Short description about this brand..."
                  className="w-full resize-none rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      featured: e.target.checked,
                    })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Featured Brand
                  </p>
                  <p className="text-xs text-slate-500">
                    Show this brand in featured brand sections.
                  </p>
                </div>
              </label>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  <Save className="h-4 w-4" />
                  {editingBrand ? "Update Brand" : "Create Brand"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Brand Details */}
      {selectedBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className="font-bold text-slate-900">
                Brand Details
              </h2>

              <button
                type="button"
                onClick={() => setSelectedBrand(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-2xl font-bold text-indigo-600">
                  {selectedBrand.logo}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedBrand.name}
                  </h3>
                  <p className="text-sm text-slate-500">
                    /{selectedBrand.slug}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs uppercase text-slate-400">
                    Category
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {selectedBrand.category}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs uppercase text-slate-400">
                    Products
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {selectedBrand.products}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs uppercase text-slate-400">
                  Description
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {selectedBrand.description}
                </p>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                <span className="text-sm font-semibold text-slate-700">
                  Featured Brand
                </span>

                {selectedBrand.featured ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    <Star className="h-3.5 w-3.5" fill="currentColor" />
                    Featured
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                    Standard
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedBrand(null);
                  openEdit(selectedBrand);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                <Pencil className="h-4 w-4" />
                Edit Brand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Brands;