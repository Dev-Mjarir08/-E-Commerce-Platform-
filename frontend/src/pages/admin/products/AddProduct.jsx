import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowLeft,
  Package,
  Plus,
  X,
  Star,
  CheckCircle2,
  Percent,
  Layers,
  Store,
  Sparkles,
  Info
} from 'lucide-react';
import { addProduct } from '../../../redux/slices/productSlice';
import categoryService from '../../../services/categoryService';

const DEFAULT_CATEGORIES = [
  { id: 'outerwear', name: 'Outerwear' },
  { id: 'tailoring', name: 'Tailoring' },
  { id: 'knitwear', name: 'Knitwear' },
  { id: 'footwear', name: 'Footwear' },
  { id: 'leather-goods', name: 'Leather Goods' },
  { id: 'accessories', name: 'Accessories' }
];

const slugify = (text) => {
  return (text || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const AddProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const storeList = useSelector((state) => state.stores?.items || []);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  useEffect(() => {
    categoryService.getCategories()
      .then((res) => {
        const raw = res?.data?.data || res?.data || [];
        if (Array.isArray(raw) && raw.length > 0) {
          setCategories(raw.map((c) => ({
            id: c._id || c.slug || c.id,
            name: c.name
          })));
        }
      })
      .catch(() => {});
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    brand: '',
    sku: `SKU-${Math.floor(100000 + Math.random() * 900000)}`,
    category: 'outerwear',
    categoryName: 'Outerwear',
    store: storeList[0]?.name || 'Atelier Flagship Store',
    basePrice: '',
    discountPrice: '',
    stock: 20,
    hasVariants: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
        public_id: null,
        isPrimary: true
      }
    ],
    attributes: [
      { name: 'Material', value: '100% Wool' },
      { name: 'Origin', value: 'Italy' }
    ],
    tags: ['luxury', 'new-arrival'],
    isFeatured: false,
    isActive: true
  });

  const [newImageUrl, setNewImageUrl] = useState('');
  const [newTagInput, setNewTagInput] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const handleTitleChange = (val) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: slugify(val)
    }));
    if (formErrors.title) {
      setFormErrors((prev) => ({ ...prev, title: '' }));
    }
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    const isFirst = formData.images.length === 0;
    setFormData((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        { url: newImageUrl.trim(), public_id: null, isPrimary: isFirst }
      ]
    }));
    setNewImageUrl('');
  };

  const handleSetPrimary = (idx) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isPrimary: i === idx
      }))
    }));
  };

  const handleRemoveImage = (idx) => {
    setFormData((prev) => {
      const next = prev.images.filter((_, i) => i !== idx);
      if (next.length > 0 && !next.some((img) => img.isPrimary)) {
        next[0].isPrimary = true;
      }
      return { ...prev, images: next };
    });
  };

  const handleAddAttribute = () => {
    setFormData((prev) => ({
      ...prev,
      attributes: [...prev.attributes, { name: '', value: '' }]
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
      attributes: prev.attributes.filter((_, i) => i !== idx)
    }));
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = newTagInput.trim().toLowerCase().replace(/,/g, '');
      if (tag && !formData.tags.includes(tag)) {
        setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
      }
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.slug.trim()) errors.slug = 'Slug is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (formData.basePrice === '' || Number(formData.basePrice) < 0) {
      errors.basePrice = 'Valid base price is required';
    }
    if (
      formData.discountPrice !== '' &&
      Number(formData.discountPrice) > Number(formData.basePrice)
    ) {
      errors.discountPrice = 'Discount price cannot exceed base price';
    }
    if (formData.images.length === 0) {
      errors.images = 'At least one image is required';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const primaryImg = formData.images.find((i) => i.isPrimary) || formData.images[0];

    const payload = {
      id: `PROD-${Date.now().toString().slice(-6)}`,
      title: formData.title.trim(),
      name: formData.title.trim(),
      slug: slugify(formData.slug),
      description: formData.description.trim(),
      brand: formData.brand.trim() || 'Atelier Studio',
      sku: formData.sku.trim(),
      category: formData.category,
      categoryName: formData.categoryName,
      store: formData.store,
      basePrice: Number(formData.basePrice),
      price: Number(formData.basePrice),
      discountPrice: formData.discountPrice !== '' ? Number(formData.discountPrice) : null,
      compareAtPrice: formData.discountPrice !== '' ? Number(formData.discountPrice) : null,
      stock: Number(formData.stock),
      stockCount: Number(formData.stock),
      inStock: Number(formData.stock) > 0,
      hasVariants: Boolean(formData.hasVariants),
      images: formData.images,
      image: primaryImg?.url,
      attributes: formData.attributes.filter((a) => a.name.trim() && a.value.trim()),
      tags: formData.tags,
      ratingsAverage: 0,
      numReviews: 0,
      isFeatured: Boolean(formData.isFeatured),
      isActive: Boolean(formData.isActive),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    dispatch(addProduct(payload));
    navigate('/admin/products');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Create Product Spec</h2>
            <p className="text-xs text-slate-500 mt-0.5">Mongoose Product Schema Compliant Editor</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/products"
            className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            Publish Product
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs font-sans">
        {/* Card 1: Core Details */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 font-bold text-slate-900 text-sm">
            <Package size={16} className="text-indigo-600" />
            <span>1. Core Identification & Taxonomy</span>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Product Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Handmade Tuscan Suede Chelsea Boots"
              className={`w-full px-3.5 py-2.5 border rounded-lg text-xs focus:outline-none focus:border-indigo-600 ${
                formErrors.title ? 'border-rose-500' : 'border-slate-300'
              }`}
            />
            {formErrors.title && <p className="text-[11px] text-rose-600 mt-1">{formErrors.title}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Slug (URL Path) *</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">SKU (Barcode / ID)</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => {
                  const cat = categories.find((c) => c.id === e.target.value);
                  setFormData({ ...formData, category: e.target.value, categoryName: cat?.name || e.target.value });
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
              <label className="block font-semibold text-slate-700 mb-1">Brand / Maison</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="Atelier Signature"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Store / Boutique</label>
              <input
                type="text"
                value={formData.store}
                onChange={(e) => setFormData({ ...formData, store: e.target.value })}
                placeholder="Flagship Store"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Description *</label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide a comprehensive narrative about tailoring craftsmanship, yarn count, and finishing..."
              className="w-full p-3 border border-slate-300 rounded-lg text-xs leading-relaxed focus:outline-none focus:border-indigo-600"
            />
          </div>
        </div>

        {/* Card 2: Pricing & Stock */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 font-bold text-slate-900 text-sm">
            <Percent size={16} className="text-emerald-600" />
            <span>2. Pricing Structure & Inventory</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Base Price (₹ INR) *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                placeholder="28000"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Discount Price (₹ INR)</label>
              <input
                type="number"
                min="0"
                value={formData.discountPrice}
                onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                placeholder="Optional"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:border-indigo-600"
              />
              {formData.basePrice && formData.discountPrice && Number(formData.discountPrice) <= Number(formData.basePrice) && (
                <span className="text-[10px] text-emerald-600 font-bold mt-1 block">
                  {Math.round(((formData.basePrice - formData.discountPrice) / formData.basePrice) * 100)}% markdown
                </span>
              )}
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Stock Quantity *</label>
              <input
                type="number"
                min="0"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <span className="font-semibold text-slate-700">Has Variant Attributes (Colors, Sizes)</span>
            <input
              type="checkbox"
              checked={formData.hasVariants}
              onChange={(e) => setFormData({ ...formData, hasVariants: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded"
            />
          </div>
        </div>

        {/* Card 3: Images */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 font-bold text-slate-900 text-sm">
            <Package size={16} className="text-blue-600" />
            <span>3. Imagery Gallery (images array)</span>
          </div>

          <div className="flex gap-2">
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Paste Image URL..."
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
            >
              Add Image
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {formData.images.map((img, idx) => (
              <div
                key={idx}
                className={`relative aspect-3/4 rounded-lg overflow-hidden border-2 bg-slate-50 ${
                  img.isPrimary ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-slate-200'
                }`}
              >
                <img src={img.url} alt="product" className="w-full h-full object-cover" />
                {img.isPrimary && (
                  <span className="absolute top-1 left-1 bg-indigo-600 text-white text-[8px] font-mono px-1 py-0.5 rounded font-bold">
                    PRIMARY
                  </span>
                )}
                <div className="absolute bottom-1 right-1 flex gap-1">
                  {!img.isPrimary && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(idx)}
                      className="px-1.5 py-0.5 bg-white text-slate-900 text-[9px] rounded font-bold shadow-xs"
                    >
                      Make Primary
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="p-1 bg-rose-600 text-white text-[9px] rounded"
                  >
                    <X size={10} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 4: Attributes & Tags */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="font-bold text-slate-900 text-sm">4. Custom Attributes & Tags</span>
            <button
              type="button"
              onClick={handleAddAttribute}
              className="inline-flex items-center gap-1 text-indigo-600 text-xs font-semibold"
            >
              <Plus size={13} />
              <span>Add Attribute Row</span>
            </button>
          </div>

          <div className="space-y-2">
            {formData.attributes.map((attr, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={attr.name}
                  onChange={(e) => handleUpdateAttribute(idx, 'name', e.target.value)}
                  placeholder="e.g. Composition"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
                <input
                  type="text"
                  value={attr.value}
                  onChange={(e) => handleUpdateAttribute(idx, 'value', e.target.value)}
                  placeholder="e.g. 100% Cashmere"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveAttribute(idx)}
                  className="p-2 text-slate-400 hover:text-rose-600"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100">
            <label className="block font-semibold text-slate-700 mb-1">Discovery Tags</label>
            <input
              type="text"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Press Enter to add tag..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {formData.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono bg-indigo-50 text-indigo-700 border border-indigo-200"
                >
                  #{t}
                  <button type="button" onClick={() => handleRemoveTag(t)}>
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Card 5: Status Toggles */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div>
              <span className="font-bold text-slate-900 block">Catalog Status (isActive)</span>
              <span className="text-[11px] text-slate-500">Publish product live in the storefront</span>
            </div>
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div>
              <span className="font-bold text-slate-900 block flex items-center gap-1">
                <Star size={13} className="text-amber-500 fill-amber-500" />
                <span>Featured Product (isFeatured)</span>
              </span>
              <span className="text-[11px] text-slate-500">Highlight in editorial home spotlight carousel</span>
            </div>
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="w-4 h-4 text-amber-500 rounded"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <Link
            to="/admin/products"
            className="px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-semibold"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-sm"
          >
            Save & Publish Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;