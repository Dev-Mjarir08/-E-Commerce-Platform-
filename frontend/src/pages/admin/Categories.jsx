import { useState, useMemo, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus
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

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus size={16} />
          <span>Add New Category</span>
        </button>
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

    </div>
  );
};

export default Categories;