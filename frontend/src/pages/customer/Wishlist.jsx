import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Package,
  MapPin,
  User,
  RefreshCw,
  Search,
  Grid,
  List,
  SlidersHorizontal,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';
import { toggleWishlist, clearWishlist } from '../../redux/slices/wishlistSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import { products as catalogProducts } from '../../data/products';

import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ModalContext';

export const Wishlist = () => {
  const dispatch = useDispatch();
  const { showToast: triggerToast } = useToast();
  const { confirm } = useConfirm();

  // Redux store state
  const wishlistIds = useSelector((state) => state.wishlist.items || []);
  const adminProducts = useSelector((state) => state.products?.items || []);

  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [selectedSizeMap, setSelectedSizeMap] = useState({});
  const [isClearing, setIsClearing] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Toast feedback helper via global ToastContext
  const showToast = (type, text) => {
    triggerToast(text, type);
  };

  // Resolve full product objects for the IDs saved in wishlist
  const resolvedWishlistProducts = useMemo(() => {
    // Combine catalog products with custom admin products
    const allAvailableProducts = [...catalogProducts];
    
    // Add admin products that are not duplicates
    adminProducts.forEach((ap) => {
      if (!allAvailableProducts.some((p) => p.id === ap.id || p._id === ap._id)) {
        allAvailableProducts.push(ap);
      }
    });

    // Filter products whose IDs are in wishlistIds
    return wishlistIds
      .map((id) => allAvailableProducts.find((p) => p.id === id || p._id === id))
      .filter(Boolean);
  }, [wishlistIds, adminProducts]);

  // Extract unique categories for filtering
  const availableCategories = useMemo(() => {
    const categoriesSet = new Set(
      resolvedWishlistProducts
        .map((p) => p.categoryName || p.category)
        .filter(Boolean)
    );
    return ['all', ...Array.from(categoriesSet)];
  }, [resolvedWishlistProducts]);

  // Filter products by search and category
  const filteredProducts = useMemo(() => {
    return resolvedWishlistProducts.filter((product) => {
      const matchesSearch =
        searchQuery === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.subtitle && product.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.fabric && product.fabric.toLowerCase().includes(searchQuery.toLowerCase()));

      const categoryName = (product.categoryName || product.category || '').toLowerCase();
      const matchesCategory =
        selectedCategory === 'all' || categoryName === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [resolvedWishlistProducts, searchQuery, selectedCategory]);

  // Handlers
  const handleRemoveFromWishlist = (product) => {
    const productId = product.id || product._id;
    dispatch(toggleWishlist(productId));
    showToast('info', `Removed "${product.name}" from your wishlist archive.`);
  };

  const handleAddToCart = (product, e) => {
    if (e) e.stopPropagation();
    
    const productId = product.id || product._id;
    const chosenSize = selectedSizeMap[productId] || product.sizes?.[0] || 'Standard';
    const chosenColor = product.colors?.[0]?.name || 'Classic';

    dispatch(
      addToCart({
        product,
        size: chosenSize,
        color: chosenColor,
        quantity: 1
      })
    );

    showToast('success', `Added "${product.name}" (${chosenSize}) to your shopping bag.`);
  };

  const handleMoveAllToCart = () => {
    if (filteredProducts.length === 0) return;

    filteredProducts.forEach((product) => {
      const productId = product.id || product._id;
      const chosenSize = selectedSizeMap[productId] || product.sizes?.[0] || 'Standard';
      const chosenColor = product.colors?.[0]?.name || 'Classic';

      dispatch(
        addToCart({
          product,
          size: chosenSize,
          color: chosenColor,
          quantity: 1
        })
      );
    });

    showToast('success', `Transferred ${filteredProducts.length} items to your shopping bag.`);
  };

  const handleClearWishlist = async () => {
    const ok = await confirm({
      title: 'Clear Wishlist Archive',
      message: 'Are you sure you want to clear your saved wishlist archive? All saved pieces will be removed.',
      confirmText: 'Clear Archive',
      cancelText: 'Keep Saved Items',
      type: 'danger'
    });
    if (!ok) return;

    setIsClearing(true);
    setTimeout(() => {
      dispatch(clearWishlist());
      setIsClearing(false);
      showToast('info', 'Your wishlist archive has been cleared.');
    }, 300);
  };

  const handleSizeChange = (productId, size) => {
    setSelectedSizeMap((prev) => ({ ...prev, [productId]: size }));
  };

  // Sample curated recommendations for empty state
  const recommendedItems = useMemo(() => {
    return catalogProducts.slice(0, 3);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#111111] py-10 md:py-16 px-4 sm:px-6 lg:px-12 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Page Header / Breadcrumb */}
        <div className="mb-10 pb-6 border-b border-[#E5E3DF] flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#8E877F] block mb-2">
              CLIENT PORTAL • SAVED GARMENT ARCHIVE
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] tracking-tight uppercase flex items-center gap-3">
              <span>Your Wishlist Archive</span>
              <span className="text-sm font-mono bg-[#111111] text-[#F8F7F4] px-3 py-1 rounded-none">
                {resolvedWishlistProducts.length}{' '}
                {resolvedWishlistProducts.length === 1 ? 'GARMENT' : 'GARMENTS'}
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 px-4 py-2 border border-[#E5E3DF] hover:border-[#111111] hover:bg-[#111111] hover:text-[#F8F7F4] text-[#111111] text-xs font-mono uppercase tracking-wider transition-all rounded-none"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Active Bag</span>
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#111111] text-[#F8F7F4] text-xs font-mono uppercase tracking-wider hover:bg-[#333333] transition-all rounded-none"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Explore Catalog</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Wishlist Content Column (8 or 12 cols depending on layout) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Filter & View Controls Bar */}
            {resolvedWishlistProducts.length > 0 && (
              <div className="bg-[#FFFFFF] border border-[#E5E3DF] p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                {/* Search input inside wishlist */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search saved garments by name or fabric..."
                    className="w-full bg-[#F8F7F4] border border-[#E5E3DF] pl-9 pr-4 py-2 text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111] transition-colors placeholder:text-[#8E877F]"
                  />
                  <Search className="w-3.5 h-3.5 text-[#8E877F] absolute left-3 top-3 pointer-events-none" />
                </div>

                {/* Category filter & view toggle */}
                <div className="flex items-center gap-3">
                  {availableCategories.length > 1 && (
                    <div className="relative">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="bg-[#F8F7F4] border border-[#E5E3DF] px-3 py-2 text-xs font-mono uppercase tracking-wider text-[#111111] focus:outline-none focus:border-[#111111] cursor-pointer"
                      >
                        {availableCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat === 'all' ? 'ALL CATEGORIES' : cat.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Grid vs List view toggle */}
                  <div className="flex items-center border border-[#E5E3DF] bg-[#F8F7F4]">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-[#111111] text-[#F8F7F4]'
                          : 'text-[#8E877F] hover:text-[#111111]'
                      }`}
                      title="Grid View"
                      aria-label="Grid View"
                    >
                      <Grid className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 transition-colors ${
                        viewMode === 'list'
                          ? 'bg-[#111111] text-[#F8F7F4]'
                          : 'text-[#8E877F] hover:text-[#111111]'
                      }`}
                      title="List View"
                      aria-label="List View"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Bulk Actions Header */}
            {filteredProducts.length > 0 && (
              <div className="flex items-center justify-between px-2 text-xs font-mono uppercase tracking-wider text-[#8E877F]">
                <span>
                  SHOWING {filteredProducts.length} OF {resolvedWishlistProducts.length} SAVED PIECES
                </span>

                <div className="flex items-center gap-4">
                  <button
                    onClick={handleMoveAllToCart}
                    className="hover:text-[#111111] transition-colors flex items-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#111111]" />
                    <span className="text-[#111111] font-semibold">MOVE ALL TO BAG</span>
                  </button>
                  <span>•</span>
                  <button
                    onClick={handleClearWishlist}
                    disabled={isClearing}
                    className="hover:text-rose-600 transition-colors flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${isClearing ? 'animate-spin' : ''}`} />
                    <span>CLEAR ARCHIVE</span>
                  </button>
                </div>
              </div>
            )}

            {/* Wishlist Items Display */}
            {resolvedWishlistProducts.length === 0 ? (
              /* EMPTY WISHLIST STATE */
              <div className="bg-[#FFFFFF] border border-[#E5E3DF] p-8 sm:p-12 text-center space-y-6 shadow-xs">
                <div className="w-20 h-20 mx-auto rounded-full bg-[#F8F7F4] border border-[#E5E3DF] flex items-center justify-center text-[#8E877F]">
                  <Heart className="w-10 h-10 stroke-[1.25] text-[#8E877F]" />
                </div>

                <div className="max-w-md mx-auto space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#8E877F]">
                    EMPTY CLIENT ARCHIVE
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl uppercase tracking-wider text-[#111111]">
                    Your Wishlist is Empty
                  </h2>
                  <p className="text-xs text-[#666666] font-sans leading-relaxed">
                    Bookmark your favorite bespoke coats, tailored suits, cashmere knits, and handcrafted footwear to keep track of seasonal availability and price updates.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap justify-center gap-4">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-[#111111] text-[#F8F7F4] px-7 py-3 text-xs font-mono uppercase tracking-[0.2em] hover:bg-[#333333] transition-colors"
                  >
                    <span>Browse New Arrivals</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Suggested Items Gallery inside Empty State */}
                <div className="pt-10 border-t border-[#E5E3DF] text-left space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#111111]" />
                    <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#111111] font-semibold">
                      CURATED SELECTIONS FOR YOU
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {recommendedItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-[#F8F7F4] border border-[#E5E3DF] p-4 flex flex-col justify-between group hover:border-[#111111] transition-all"
                      >
                        <div className="space-y-3">
                          <img
                            src={item.images?.[0] || item.image}
                            alt={item.name}
                            className="w-full h-40 object-cover bg-white border border-[#E5E3DF]"
                          />
                          <div>
                            <span className="text-[9px] font-mono uppercase text-[#8E877F]">
                              {item.categoryName || item.category}
                            </span>
                            <h4 className="font-serif text-sm uppercase text-[#111111] line-clamp-1">
                              {item.name}
                            </h4>
                            <p className="font-mono text-xs text-[#111111] mt-1 font-semibold">
                              ₹{item.price.toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            dispatch(toggleWishlist(item.id));
                            showToast('success', `Saved "${item.name}" to your wishlist.`);
                          }}
                          className="mt-4 w-full py-2 border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#F8F7F4] text-[10px] font-mono uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Heart className="w-3 h-3 fill-current" />
                          <span>SAVE TO WISHLIST</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              /* NO MATCHES FOR SEARCH FILTER */
              <div className="bg-[#FFFFFF] border border-[#E5E3DF] p-10 text-center space-y-4 shadow-xs">
                <AlertCircle className="w-8 h-8 text-[#8E877F] mx-auto" />
                <h3 className="font-serif text-lg uppercase text-[#111111]">
                  No saved garments match your criteria
                </h3>
                <p className="text-xs text-[#666666] font-sans">
                  Try adjusting your search terms or category filter.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="px-4 py-2 border border-[#111111] text-xs font-mono uppercase text-[#111111] hover:bg-[#111111] hover:text-[#F8F7F4] transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              /* GRID VIEW DISPLAY */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredProducts.map((product) => {
                  const productId = product.id || product._id;
                  const chosenSize = selectedSizeMap[productId] || product.sizes?.[0] || 'Standard';

                  return (
                    <div
                      key={productId}
                      className="bg-[#FFFFFF] border border-[#E5E3DF] shadow-xs flex flex-col justify-between group hover:border-[#111111] transition-all relative"
                    >
                      {/* Badge / Status Indicator */}
                      <div className="p-4 space-y-4">
                        <div className="relative overflow-hidden bg-[#F8F7F4] border border-[#E5E3DF] group">
                          <img
                            src={product.images?.[0] || product.image || product.hoverImage}
                            alt={product.name}
                            className="w-full h-64 object-cover object-top transition-transform duration-700 group-hover:scale-105"
                          />

                          {/* Quick remove icon button on top right of card */}
                          <button
                            type="button"
                            onClick={() => handleRemoveFromWishlist(product)}
                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#FFFFFF]/90 hover:bg-rose-600 hover:text-white text-[#111111] border border-[#E5E3DF] flex items-center justify-center shadow-xs transition-colors z-10"
                            title="Remove from Wishlist"
                            aria-label="Remove from Wishlist"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          {/* Collection Tag or Badge */}
                          {product.badge && (
                            <span className="absolute top-3 left-3 bg-[#111111] text-[#F8F7F4] text-[9px] font-mono uppercase tracking-widest px-2.5 py-1">
                              {product.badge}
                            </span>
                          )}

                          {/* Stock Overlay Tag */}
                          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 bg-[#FFFFFF]/90 backdrop-blur-sm border border-[#E5E3DF]">
                            <span
                              className={
                                product.inStock !== false
                                  ? 'text-emerald-800 font-semibold'
                                  : 'text-rose-700 font-semibold'
                              }
                            >
                              {product.inStock !== false
                                ? product.stockCount
                                  ? `IN STOCK (${product.stockCount} AVAILABLE)`
                                  : 'IN STOCK • READY TO SHIP'
                                : 'OUT OF STOCK'}
                            </span>
                          </div>
                        </div>

                        {/* Product Title & Specifications */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E877F]">
                              {product.categoryName || product.category || 'MENSWEAR'}
                            </span>
                            <span className="text-[10px] font-mono text-[#8E877F]">
                              SKU: {productId}
                            </span>
                          </div>

                          <h3 className="font-serif text-lg uppercase text-[#111111] tracking-tight leading-snug line-clamp-1">
                            {product.name}
                          </h3>

                          {product.subtitle && (
                            <p className="text-xs text-[#666666] font-sans line-clamp-1">
                              {product.subtitle}
                            </p>
                          )}

                          {/* Pricing */}
                          <div className="pt-2 flex items-baseline gap-3">
                            <span className="font-mono text-base font-semibold text-[#111111]">
                              ₹{product.price.toLocaleString('en-IN')}
                            </span>
                            {product.compareAtPrice && (
                              <span className="font-mono text-xs text-[#8E877F] line-through">
                                ₹{product.compareAtPrice.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>

                          {/* Size Selection Dropdown if multiple sizes exist */}
                          {product.sizes && product.sizes.length > 0 && (
                            <div className="pt-2 flex items-center gap-2">
                              <span className="text-[10px] font-mono uppercase text-[#8E877F]">
                                SIZE:
                              </span>
                              <select
                                value={chosenSize}
                                onChange={(e) => handleSizeChange(productId, e.target.value)}
                                className="bg-[#F8F7F4] border border-[#E5E3DF] px-2 py-1 text-[11px] font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
                              >
                                {product.sizes.map((sz) => (
                                  <option key={sz} value={sz}>
                                    {sz}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="p-4 pt-0 border-t border-[#E5E3DF] mt-3 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setQuickViewProduct(product)}
                          className="py-2.5 border border-[#E5E3DF] hover:border-[#111111] text-xs font-mono uppercase tracking-wider text-[#111111] transition-colors flex items-center justify-center gap-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-[#8E877F]" />
                          <span>DETAILS</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleAddToCart(product, e)}
                          disabled={product.inStock === false}
                          className="py-2.5 bg-[#111111] text-[#F8F7F4] text-xs font-mono uppercase tracking-wider hover:bg-[#333333] transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>ADD TO BAG</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* LIST VIEW DISPLAY */
              <div className="bg-[#FFFFFF] border border-[#E5E3DF] shadow-xs divide-y divide-[#E5E3DF]">
                {filteredProducts.map((product) => {
                  const productId = product.id || product._id;
                  const chosenSize = selectedSizeMap[productId] || product.sizes?.[0] || 'Standard';

                  return (
                    <div
                      key={productId}
                      className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between hover:bg-[#F8F7F4]/40 transition-colors"
                    >
                      {/* Image & Main Info */}
                      <div className="flex gap-5 items-start sm:items-center">
                        <img
                          src={product.images?.[0] || product.image}
                          alt={product.name}
                          className="w-24 h-28 object-cover bg-[#F8F7F4] border border-[#E5E3DF] shrink-0"
                        />
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E877F]">
                              {product.categoryName || product.category || 'COLLECTION'}
                            </span>
                            {product.origin && (
                              <span className="text-[9px] font-mono uppercase text-[#8E877F]">
                                • {product.origin}
                              </span>
                            )}
                          </div>
                          <h3 className="font-serif text-lg uppercase text-[#111111] leading-snug">
                            {product.name}
                          </h3>
                          <p className="text-xs text-[#666666] font-sans line-clamp-1">
                            {product.fabric || product.subtitle}
                          </p>

                          {/* Size Selection */}
                          {product.sizes && product.sizes.length > 0 && (
                            <div className="pt-1 flex items-center gap-2 text-[11px] font-mono">
                              <span className="text-[#8E877F]">SIZE:</span>
                              <select
                                value={chosenSize}
                                onChange={(e) => handleSizeChange(productId, e.target.value)}
                                className="bg-[#F8F7F4] border border-[#E5E3DF] px-2 py-0.5 text-xs font-mono text-[#111111] focus:outline-none"
                              >
                                {product.sizes.map((sz) => (
                                  <option key={sz} value={sz}>
                                    {sz}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Pricing, Availability & Actions */}
                      <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between gap-4 pt-4 sm:pt-0 border-t sm:border-t-0 border-[#E5E3DF]">
                        <div className="text-left sm:text-right">
                          <span className="font-mono text-base font-semibold text-[#111111] block">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-800 uppercase tracking-wider block">
                            {product.inStock !== false ? 'IN STOCK' : 'OUT OF STOCK'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleRemoveFromWishlist(product)}
                            className="p-2.5 border border-[#E5E3DF] hover:border-rose-300 hover:bg-rose-50/50 text-[#8E877F] hover:text-rose-600 transition-colors"
                            title="Remove from Wishlist"
                            aria-label="Remove from Wishlist"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleAddToCart(product, e)}
                            disabled={product.inStock === false}
                            className="px-4 py-2.5 bg-[#111111] text-[#F8F7F4] text-xs font-mono uppercase tracking-wider hover:bg-[#333333] transition-colors flex items-center gap-1.5 disabled:opacity-50"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>ADD TO BAG</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick Navigation Menu (Matches Profile & Cart pages) */}
            <div className="bg-[#FFFFFF] border border-[#E5E3DF] p-6 space-y-3 shadow-xs">
              <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8E877F] mb-4">
                CLIENT ACCOUNT NAVIGATION
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 p-3 hover:bg-[#F8F7F4] border border-[#E5E3DF] text-xs font-mono uppercase tracking-wider text-[#666666] hover:text-[#111111] transition-colors"
                >
                  <User className="w-4 h-4 text-[#8E877F]" />
                  <span>Profile</span>
                </Link>

                <Link
                  to="/orders"
                  className="flex items-center gap-2.5 p-3 hover:bg-[#F8F7F4] border border-[#E5E3DF] text-xs font-mono uppercase tracking-wider text-[#666666] hover:text-[#111111] transition-colors"
                >
                  <Package className="w-4 h-4 text-[#8E877F]" />
                  <span>Orders</span>
                </Link>

                <Link
                  to="/addresses"
                  className="flex items-center gap-2.5 p-3 hover:bg-[#F8F7F4] border border-[#E5E3DF] text-xs font-mono uppercase tracking-wider text-[#666666] hover:text-[#111111] transition-colors"
                >
                  <MapPin className="w-4 h-4 text-[#8E877F]" />
                  <span>Addresses</span>
                </Link>

                <Link
                  to="/cart"
                  className="flex items-center gap-2.5 p-3 hover:bg-[#F8F7F4] border border-[#E5E3DF] text-xs font-mono uppercase tracking-wider text-[#666666] hover:text-[#111111] transition-colors"
                >
                  <ShoppingBag className="w-4 h-4 text-[#8E877F]" />
                  <span>Active Bag</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Wishlist Summary & Client Services (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Wishlist Overview Summary Box */}
            <div className="bg-[#FFFFFF] border border-[#E5E3DF] p-6 space-y-6 shadow-xs sticky top-8">
              <div className="pb-4 border-b border-[#E5E3DF] flex items-center justify-between">
                <h3 className="font-serif text-xl uppercase tracking-wider text-[#111111]">
                  Wishlist Overview
                </h3>
                <span className="text-[10px] font-mono text-[#8E877F] uppercase tracking-widest">
                  CURATED ARCHIVE
                </span>
              </div>

              {/* Wishlist Statistics */}
              <div className="space-y-4 text-xs font-mono">
                <div className="flex justify-between items-center pb-3 border-b border-[#E5E3DF]/50">
                  <span className="text-[#666666]">Total Saved Items</span>
                  <span className="font-semibold text-[#111111]">
                    {resolvedWishlistProducts.length}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-[#E5E3DF]/50">
                  <span className="text-[#666666]">Estimated Collection Value</span>
                  <span className="font-semibold text-[#111111]">
                    ₹
                    {resolvedWishlistProducts
                      .reduce((acc, item) => acc + (item.price || 0), 0)
                      .toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-[#E5E3DF]/50">
                  <span className="text-[#666666]">In Stock Status</span>
                  <span className="text-emerald-800 font-semibold">
                    {resolvedWishlistProducts.filter((p) => p.inStock !== false).length} /{' '}
                    {resolvedWishlistProducts.length} AVAILABLE
                  </span>
                </div>
              </div>

              {/* Primary Transfer Action */}
              {filteredProducts.length > 0 && (
                <button
                  type="button"
                  onClick={handleMoveAllToCart}
                  className="w-full bg-[#111111] text-[#F8F7F4] py-4 text-xs font-mono uppercase tracking-[0.2em] hover:bg-[#333333] transition-all flex items-center justify-center gap-2 group"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>TRANSFER ALL TO BAG</span>
                </button>
              )}

              {/* Security & Authenticity Badges */}
              <div className="pt-4 border-t border-[#E5E3DF] space-y-3 text-[11px] font-mono text-[#666666]">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#111111] shrink-0" />
                  <span>Guaranteed Bespoke Craftsmanship</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#111111] shrink-0" />
                  <span>Price Drop & Restock Alerts Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick View Product Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111111]/60 backdrop-blur-xs">
          <div className="bg-[#FFFFFF] border border-[#E5E3DF] max-w-xl w-full p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 text-[#8E877F] hover:text-[#111111] p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row gap-6">
              <img
                src={quickViewProduct.images?.[0] || quickViewProduct.image}
                alt={quickViewProduct.name}
                className="w-full sm:w-48 h-64 object-cover bg-[#F8F7F4] border border-[#E5E3DF]"
              />

              <div className="space-y-3 flex-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E877F]">
                  {quickViewProduct.categoryName || quickViewProduct.category}
                </span>
                <h3 className="font-serif text-xl uppercase text-[#111111]">
                  {quickViewProduct.name}
                </h3>
                <p className="font-mono text-base font-semibold text-[#111111]">
                  ₹{quickViewProduct.price.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-[#666666] font-sans leading-relaxed">
                  {quickViewProduct.description || quickViewProduct.subtitle}
                </p>

                {quickViewProduct.fabric && (
                  <div className="pt-2 text-xs font-mono text-[#111111]">
                    <span className="text-[#8E877F]">FABRIC:</span> {quickViewProduct.fabric}
                  </div>
                )}

                {quickViewProduct.origin && (
                  <div className="text-xs font-mono text-[#111111]">
                    <span className="text-[#8E877F]">ORIGIN:</span> {quickViewProduct.origin}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5E3DF] flex justify-end gap-3">
              <button
                onClick={() => setQuickViewProduct(null)}
                className="px-4 py-2 border border-[#E5E3DF] text-xs font-mono uppercase text-[#666666] hover:text-[#111111]"
              >
                Close
              </button>
              <button
                onClick={(e) => {
                  handleAddToCart(quickViewProduct, e);
                  setQuickViewProduct(null);
                }}
                className="px-6 py-2 bg-[#111111] text-[#F8F7F4] text-xs font-mono uppercase tracking-wider hover:bg-[#333333] transition-colors flex items-center gap-2"
              >
                <ShoppingBag className="w-3 h-3" />
                <span>Add to Bag</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
