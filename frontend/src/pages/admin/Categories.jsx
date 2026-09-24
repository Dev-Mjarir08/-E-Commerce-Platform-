import { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X
} from 'lucide-react';
import { categories as initialCategories } from '../../data/categories';
import { useConfirm } from '../../context/ModalContext';

const Categories = () => {
  const { confirm, alert: modalAlert } = useConfirm();
  const [categoryList, setCategoryList] = useState(
    initialCategories.map((c, i) => ({
      ...c,
      isActive: true,
      displayOrder: i + 1
    }))
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    tagline: '',
    badge: 'COLLECTION SS/26',
    itemCount: '12 Styles',
    displayOrder: 1,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85'
  });

  const filteredCategories = useMemo(() => {
    return categoryList.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.tagline && c.tagline.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [categoryList, searchQuery]);

  const totalCategories = categoryList.length;
  const activeCount = categoryList.filter((c) => c.isActive).length;

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      tagline: '',
      badge: 'CURATED',
      itemCount: '10 Styles',
      displayOrder: categoryList.length + 1,
      isActive: true,
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.id,
      tagline: cat.tagline || '',
      badge: cat.badge || 'COLLECTION',
      itemCount: cat.itemCount || '10 Styles',
      displayOrder: cat.displayOrder || 1,
      isActive: cat.isActive !== false,
      image: cat.image || ''
    });
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (id) => {
    const ok = await confirm({
      title: 'Delete Taxonomy Category',
      message: 'Are you sure you want to delete this taxonomy category? Products assigned to this category will need reassignment.',
      confirmText: 'Delete Category',
      cancelText: 'Cancel',
      type: 'danger'
    });
    if (ok) {
      setCategoryList((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleToggleActive = (id) => {
    setCategoryList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      modalAlert({
        title: 'Missing Required Fields',
        message: 'Please provide both category name and URL slug.',
        type: 'warning'
      });
      return;
    }

    if (editingCategory) {
      setCategoryList((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? {
              ...c,
              name: formData.name,
              id: formData.slug.toLowerCase().replace(/\s+/g, '-'),
              tagline: formData.tagline,
              badge: formData.badge,
              itemCount: formData.itemCount,
              displayOrder: Number(formData.displayOrder),
              isActive: formData.isActive,
              image: formData.image
            }
            : c
        )
      );
    } else {
      const newCat = {
        id: formData.slug.toLowerCase().replace(/\s+/g, '-'),
        name: formData.name,
        tagline: formData.tagline,
        badge: formData.badge,
        itemCount: formData.itemCount,
        displayOrder: Number(formData.displayOrder),
        isActive: formData.isActive,
        image: formData.image,
        link: '#catalog'
      };
      setCategoryList([...categoryList, newCat]);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Taxonomy & Categories</h2>
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

      {/* Direct Solid KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Taxonomies</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">{totalCategories}</span>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              Taxonomy Root
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Active Navigation</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-700">{activeCount}</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              Visible on Store
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Curated Styles</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">100+ Styles</span>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
              Editorial
            </span>
          </div>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search category name, slug or description..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
          />
        </div>
      </div>

      {/* Visual Category Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCategories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:border-indigo-600 transition-colors"
          >
            {/* Direct image preview */}
            <div className="relative h-40 bg-slate-100 overflow-hidden">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-slate-900 text-white shadow">
                  {cat.badge || 'EDITORIAL'}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <button
                  type="button"
                  onClick={() => handleToggleActive(cat.id)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shadow ${cat.isActive
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-slate-700 text-slate-200 border-slate-600'
                    }`}
                >
                  {cat.isActive ? 'Active' : 'Hidden'}
                </button>
              </div>
            </div>

            {/* Details */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-base">{cat.name}</h3>
                  <span className="text-[11px] font-mono font-semibold text-slate-500">
                    Order #{cat.displayOrder || 1}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {cat.tagline || 'Editorial luxury collection and tailoring'}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    {cat.itemCount || '15 Styles'}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    slug: {cat.id}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(cat)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
                >
                  <Edit2 size={13} />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(cat.id)}
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

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingCategory ? 'Edit Category' : 'Create Catalog Category'}
                </h3>
                <p className="text-xs text-slate-500">Define editorial taxonomies and display order</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
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
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="knitwear"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tagline / Editorial Description
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="7-Gauge Mongolian Cashmere & Fine Merino"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="COLLECTION SS/26"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Editorial Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
                >
                  {editingCategory ? 'Update Category' : 'Save Category'}
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
