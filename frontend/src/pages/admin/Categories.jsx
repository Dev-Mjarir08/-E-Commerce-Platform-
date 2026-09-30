import { useState, useMemo, useEffect, useRef } from 'react';
import { useToast } from '../../context/ToastContext';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  UploadCloud,
  Database,
  Sparkles,
  FileJson,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  bulkCreateCategories
} from '../../redux/slices/categorySlice';
import { useConfirm } from '../../context/ModalContext';

const Categories = () => {
  const { confirm, alert: modalAlert } = useConfirm();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const categoryList = useSelector(
    (state) => state.categories.items || []
  );

  const categoriesLoading = useSelector(
    (state) => state.categories.loading
  );

  const categoriesError = useSelector(
    (state) => state.categories.error
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Bulk Categories Import States
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkJsonInput, setBulkJsonInput] = useState('');
  const [isBulkSubmitting, setIsBulkSubmitting] = useState(false);
  const [bulkStatus, setBulkStatus] = useState(null);
  const bulkFileRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    tagline: '',
    badge: 'COLLECTION SS/26',
    displayOrder: 1,
    isActive: true,
    image: ''
  });

  const filteredCategories = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) {
      return categoryList;
    }

    return categoryList.filter(
      (category) =>
        (category.name || '').toLowerCase().includes(query) ||
        (category.slug || '').toLowerCase().includes(query) ||
        (category.tagline || '').toLowerCase().includes(query)
    );
  }, [categoryList, searchQuery]);

  const totalCategories = categoryList.length;

  const activeCount = categoryList.filter(
    (category) => category.isActive
  ).length;

  const totalStyles = categoryList.reduce(
    (total, category) =>
      total + Number(category.itemCount || 0),
    0
  );

  // ================================
  // ADD MODAL
  // ================================
  const handleOpenAddModal = () => {
    setEditingCategory(null);

    setFormData({
      name: '',
      slug: '',
      tagline: '',
      badge: 'CURATED',
      displayOrder: categoryList.length + 1,
      isActive: true,
      image: ''
    });

    setIsModalOpen(true);
  };

  // ================================
  // EDIT MODAL
  // ================================
  const handleOpenEditModal = (category) => {
    setEditingCategory(category);

    setFormData({
      name: category.name || '',
      slug: category.slug || '',
      tagline: category.tagline || '',
      badge: category.badge || 'COLLECTION',
      displayOrder: category.displayOrder ?? 0,
      isActive: category.isActive !== false,
      image: category.image || ''
    });

    setIsModalOpen(true);
  };

  // ================================
  // DELETE
  // ================================
  const handleDeleteCategory = async (id) => {
    const ok = await confirm({
      title: 'Delete Taxonomy Category',
      message:
        'Are you sure you want to delete this taxonomy category? Products assigned to this category will need reassignment.',
      confirmText: 'Delete Category',
      cancelText: 'Cancel',
      type: 'danger'
    });

    if (!ok) return;

    try {
      await dispatch(deleteCategory(id)).unwrap();

      showToast(
        'Category deleted successfully.',
        'info'
      );
    } catch (error) {
      showToast(
        error || 'Failed to delete category.',
        'error'
      );
    }
  };

  // ================================
  // ACTIVE / HIDDEN
  // ================================
  const handleToggleActive = async (id) => {
    try {
      await dispatch(
        toggleCategoryStatus(id)
      ).unwrap();

      showToast(
        'Category status updated.',
        'success'
      );
    } catch (error) {
      showToast(
        error || 'Failed to update category status.',
        'error'
      );
    }
  };

  // ================================
  // ADD / EDIT SUBMIT
  // ================================
  const handleSubmitForm = async (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.slug.trim()
    ) {
      modalAlert({
        title: 'Missing Required Fields',
        message:
          'Please provide both category name and URL slug.',
        type: 'warning'
      });

      return;
    }

    const categoryData = {
      name: formData.name.trim(),
      slug: formData.slug.trim().toLowerCase(),
      description: formData.tagline.trim(),
      displayOrder:
        Number(formData.displayOrder) || 0,
      isActive: Boolean(formData.isActive),
      image: formData.image.trim()
    };

    try {
      if (editingCategory) {
        await dispatch(
          updateCategory({
            id: editingCategory.id,
            ...categoryData
          })
        ).unwrap();

        showToast(
          `Category "${categoryData.name}" updated successfully.`,
          'success'
        );
      } else {
        await dispatch(
          addCategory(categoryData)
        ).unwrap();

        showToast(
          `Category "${categoryData.name}" created successfully.`,
          'success'
        );
      }

      setIsModalOpen(false);
      setEditingCategory(null);
    } catch (error) {
      showToast(
        error || 'Failed to save category.',
        'error'
      );
    }
  };

  // Sample Categories Template for Bulk Upload
  const sampleCategoriesTemplate = [
    {
      name: "Haute Couture & Tailoring",
      slug: "haute-couture-tailoring",
      description: "Bespoke handcrafted formalwear and sartorial suiting.",
      image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
      displayOrder: 1,
      isActive: true
    },
    {
      name: "Artisanal Leather Goods",
      slug: "artisanal-leather-goods",
      description: "Vegetable-tanned full-grain luxury leather accessories and luggage.",
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
      displayOrder: 2,
      isActive: true
    },
    {
      name: "Fine Jewelry & Gems",
      slug: "fine-jewelry-gems",
      description: "Ethically sourced diamonds, 18k solid gold, and gemstone creations.",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
      displayOrder: 3,
      isActive: true
    },
    {
      name: "Swiss Horology",
      slug: "swiss-horology",
      description: "Masterpiece automatic and tourbillon luxury timepieces.",
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
      displayOrder: 4,
      isActive: true
    },
    {
      name: "Designer Footwear",
      slug: "designer-footwear",
      description: "Hand-welted Italian leather shoes, loafers, and editorial sneakers.",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
      displayOrder: 5,
      isActive: true
    }
  ];

  // Submit Bulk JSON Import
  const handleBulkSubmit = async () => {
    if (!bulkJsonInput.trim()) {
      setBulkStatus({
        type: 'error',
        text: 'Please paste JSON data or upload a .json file.'
      });
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(bulkJsonInput);
    } catch (err) {
      setBulkStatus({
        type: 'error',
        text: `Invalid JSON syntax: ${err.message}`
      });
      return;
    }

    let items = parsed;
    if (parsed && !Array.isArray(parsed) && Array.isArray(parsed.categories)) {
      items = parsed.categories;
    }

    if (!Array.isArray(items) || items.length === 0) {
      setBulkStatus({
        type: 'error',
        text: 'JSON must be an array of categories or an object with a "categories" array.'
      });
      return;
    }

    setIsBulkSubmitting(true);
    setBulkStatus(null);

    try {
      const res = await dispatch(bulkCreateCategories(items)).unwrap();
      const createdCount = res?.createdCount || (Array.isArray(res?.data) ? res.data.length : items.length);

      showToast(`Successfully created ${createdCount} categories in bulk!`, 'success');
      setIsBulkModalOpen(false);
      setBulkJsonInput('');
      setBulkStatus(null);
    } catch (err) {
      console.error('Bulk category upload error:', err);
      setBulkStatus({
        type: 'error',
        text: typeof err === 'string' ? err : (err?.message || 'Failed to bulk import categories.')
      });
    } finally {
      setIsBulkSubmitting(false);
    }
  };

  // Load JSON template into bulk modal
  const handleLoadSampleTemplate = () => {
    setBulkJsonInput(JSON.stringify(sampleCategoriesTemplate, null, 2));
    setBulkStatus({
      type: 'success',
      text: 'Loaded 5 sample luxury category taxonomies template. Ready to import.'
    });
  };

  // Upload .json file
  const handleBulkFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      setBulkStatus({
        type: 'error',
        text: 'Please select a valid .json file.'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        JSON.parse(text); // validate
        setBulkJsonInput(text);
        setBulkStatus({
          type: 'success',
          text: `Loaded "${file.name}" successfully.`
        });
      } catch (err) {
        setBulkStatus({
          type: 'error',
          text: `Invalid JSON syntax in file: ${err.message}`
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">

      {/* ================================
          HEADER
      ================================= */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Taxonomy & Categories
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Configure catalog collections, editorial imagery, style counts, and taxonomy hierarchies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Bulk Import Categories */}
          <button
            type="button"
            onClick={() => {
              setIsBulkModalOpen(true);
              setBulkStatus(null);
            }}
            title="Import multiple categories at once via JSON payload or template"
            className="flex items-center gap-1.5 px-3.5 py-2.5 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-colors shadow-sm"
          >
            <UploadCloud size={14} />
            <span>Bulk Categories</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus size={16} />
            <span>Add New Category</span>
          </button>
        </div>
      </div>

      {/* ================================
          KPI
      ================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Total Taxonomies
          </span>

          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">
              {totalCategories}
            </span>

            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              Taxonomy Root
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Active Navigation
          </span>

          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-700">
              {activeCount}
            </span>

            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              Visible on Store
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Curated Styles
          </span>

          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">
              {totalStyles} Styles
            </span>

            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
              Editorial
            </span>
          </div>
        </div>

      </div>

      {/* ================================
          SEARCH
      ================================= */}

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-sm">

          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
            placeholder="Search category name, slug or description..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
          />

        </div>
      </div>

      {/* ================================
          CATEGORY LIST
      ================================= */}

      {categoriesLoading ? (

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-10 text-center">
          <p className="text-sm font-semibold text-slate-600">
            Loading categories...
          </p>
        </div>

      ) : categoriesError ? (

        <div className="bg-white rounded-xl border border-rose-200 shadow-sm p-10 text-center">
          <p className="text-sm font-semibold text-rose-600">
            {categoriesError}
          </p>
        </div>

      ) : filteredCategories.length === 0 ? (

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-10 text-center">
          <p className="text-sm font-semibold text-slate-600">
            No categories found.
          </p>
        </div>

      ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {filteredCategories.map((category) => (

            <div
              key={category.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:border-indigo-600 transition-colors"
            >

              {/* IMAGE */}

              <div className="relative h-40 bg-slate-100 overflow-hidden">

                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-xs text-slate-400">
                      No image
                    </span>
                  </div>
                )}

                {/* BADGE */}

                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-slate-900 text-white shadow">
                    {category.badge || 'EDITORIAL'}
                  </span>
                </div>

                {/* ACTIVE / HIDDEN */}

                <div className="absolute top-3 right-3">
                  <button
                    type="button"
                    onClick={() =>
                      handleToggleActive(category.id)
                    }
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shadow ${category.isActive
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-slate-700 text-slate-200 border-slate-600'
                      }`}
                  >
                    {category.isActive
                      ? 'Active'
                      : 'Hidden'}
                  </button>
                </div>

              </div>

              {/* DETAILS */}

              <div className="p-4 flex-1 flex flex-col justify-between">

                <div>

                  <div className="flex items-center justify-between">

                    <h3 className="font-bold text-slate-900 text-base">
                      {category.name}
                    </h3>

                    <span className="text-[11px] font-mono font-semibold text-slate-500">
                      Order #{category.displayOrder || 1}
                    </span>

                  </div>

                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {category.tagline ||
                      'No description available'}
                  </p>

                  <div className="mt-3 flex items-center gap-2">

                    <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      {Number(category.itemCount || 0)} Styles
                    </span>

                    <span className="text-[11px] font-mono text-slate-400 truncate">
                      slug: {category.slug}
                    </span>

                  </div>

                </div>

                {/* ACTIONS */}

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-end gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      handleOpenEditModal(category)
                    }
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
                  >
                    <Edit2 size={13} />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteCategory(category.id)
                    }
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* ================================
          ADD / EDIT MODAL
      ================================= */}

      {isModalOpen && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">

          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">

            {/* MODAL HEADER */}

            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">

              <div>

                <h3 className="text-base font-bold text-slate-900">
                  {editingCategory
                    ? 'Edit Category'
                    : 'Create Catalog Category'}
                </h3>

                <p className="text-xs text-slate-500">
                  Define editorial taxonomies and display order
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setIsModalOpen(false)
                }
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X size={18} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmitForm}
              className="p-6 overflow-y-auto space-y-4"
            >

              {/* NAME + SLUG */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>

                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category Name *
                  </label>

                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        name: event.target.value,
                        slug: event.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/^-+|-+$/g, '')
                      })
                    }
                    placeholder="e.g. Knitwear"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />

                </div>

                <div>

                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Slug ID *
                  </label>

                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        slug: event.target.value
                      })
                    }
                    placeholder="knitwear"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />

                </div>

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tagline / Editorial Description
                </label>

                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      tagline: event.target.value
                    })
                  }
                  placeholder="7-Gauge Mongolian Cashmere & Fine Merino"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                />

              </div>

              {/* BADGE + DISPLAY ORDER */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>

                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Badge Label
                  </label>

                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        badge: event.target.value
                      })
                    }
                    placeholder="COLLECTION SS/26"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />

                  <p className="text-[10px] text-slate-400 mt-1">
                    Display only. Not stored in Category.
                  </p>

                </div>

                <div>

                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Display Order
                  </label>

                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        displayOrder: event.target.value
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />

                </div>

              </div>

              {/* IMAGE */}

              <div>

                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Editorial Image URL
                </label>

                <input
                  type="url"
                  value={formData.image}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      image: event.target.value
                    })
                  }
                  placeholder="https://example.com/category-image.jpg"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                />

                {formData.image && (
                  <div className="mt-2 h-24 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src={formData.image}
                      alt="Category preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

              </div>

              {/* BUTTONS */}

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setIsModalOpen(false)
                  }
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
                >
                  {editingCategory
                    ? 'Update Category'
                    : 'Save Category'}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* Bulk Categories Import Modal */}
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
                    <span>Bulk Add Categories</span>
                    <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      Batch API
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Insert multiple taxonomy categories at once into MongoDB via JSON array or seed template.
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
                    <span>Load Categories Template</span>
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
                      setBulkJsonInput('');
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
                    bulkStatus.type === 'error'
                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                      : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                  }`}
                >
                  {bulkStatus.type === 'error' ? (
                    <AlertCircle size={15} className="text-rose-600 shrink-0" />
                  ) : (
                    <CheckCircle2 size={15} className="text-indigo-600 shrink-0" />
                  )}
                  <span>{bulkStatus.text}</span>
                </div>
              )}

              {/* JSON Textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-slate-700">
                    JSON Payload [ categories array ]
                  </label>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {bulkJsonInput
                      ? `${bulkJsonInput.length.toLocaleString()} chars`
                      : 'Empty'}
                  </span>
                </div>
                <textarea
                  value={bulkJsonInput}
                  onChange={(e) => setBulkJsonInput(e.target.value)}
                  rows={12}
                  placeholder={`[\n  {\n    "name": "Haute Couture & Tailoring",\n    "slug": "haute-couture-tailoring",\n    "description": "Bespoke formalwear and sartorial suiting.",\n    "image": "https://...",\n    "displayOrder": 1,\n    "isActive": true\n  },\n  ...\n]`}
                  className="w-full font-mono text-xs p-3.5 bg-slate-900 text-emerald-400 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 selection:bg-indigo-600 selection:text-white"
                />
              </div>

              {/* Helper guide */}
              <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <p className="font-semibold text-slate-700">Schema Requirements:</p>
                <p>
                  Each category requires a <code className="text-indigo-600">name</code>.
                  Optional fields include <code className="text-indigo-600">slug</code>, <code className="text-indigo-600">description</code>, <code className="text-indigo-600">image</code> (URL string or object), <code className="text-indigo-600">displayOrder</code>, and <code className="text-indigo-600">isActive</code>.
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
                    <span>Inserting Categories into Database...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud size={14} />
                    <span>Import Categories Now</span>
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

export default Categories;