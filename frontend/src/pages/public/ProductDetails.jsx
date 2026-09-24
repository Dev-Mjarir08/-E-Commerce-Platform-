import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Heart,
  Star,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ChevronRight,
  Minus,
  Plus,
  Share2,
  Sparkles
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { AnnouncementBar } from '../../components/layout/AnnouncementBar';
import { CartDrawer } from '../../components/common/CartDrawer';
import { ProductCard } from '../../components/product/ProductCard';
import { addToCart, openCart } from '../../redux/slices/cartSlice';
import { toggleWishlist } from '../../redux/slices/wishlistSlice';
import { useToast } from '../../context/ToastContext';
import productApi from '../../services/productApi';

export const ProductDetails = () => {
  const { showToast } = useToast();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const wishlistItems = useSelector((state) => state.wishlist.items);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    let isCancelled = false;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await productApi.getProductById(id);
        const fetched = res?.data || res?.product;
        if (fetched && !isCancelled) {
          // Normalize fetched product
          const normalized = {
            id: fetched._id || fetched.id,
            name: fetched.title || fetched.name,
            price: fetched.basePrice || fetched.price,
            originalPrice: fetched.compareAtPrice || fetched.originalPrice || Math.round((fetched.basePrice || fetched.price || 1000) * 1.25),
            description: fetched.description || 'Artisan handcrafted luxury garment designed for discerning ateliers.',
            fabric: fetched.fabric || (fetched.attributes && fetched.attributes[0]?.value) || '100% Organic Silk & Wool Blend',
            colors: fetched.colors || [
              { name: 'Onyx Noir', code: '#1a1a1a', image: fetched.images?.[0]?.url || fetched.images?.[0] || 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85' },
              { name: 'Warm Sand', code: '#d7c4b7', image: fetched.images?.[1]?.url || fetched.images?.[1] || fetched.images?.[0]?.url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85' }
            ],
            sizes: fetched.sizes || ['XS', 'S', 'M', 'L', 'XL'],
            images: Array.isArray(fetched.images) && fetched.images.length > 0
              ? fetched.images.map((img) => (typeof img === 'string' ? img : img.url))
              : ['https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85'],
            storeName: fetched.store?.name || fetched.storeName || 'Maison Atelier',
            storeSlug: fetched.store?.slug || fetched.storeSlug || 'maison-atelier',
            rating: fetched.ratingsAverage || fetched.rating || 4.9,
            reviewsCount: fetched.ratingsQuantity || fetched.reviewsCount || 28,
            category: fetched.category?.name || fetched.category || 'Atelier Collection',
            stock: fetched.stock !== undefined ? fetched.stock : 14
          };

          setProduct(normalized);
          setSelectedImage(0);
          setSelectedColor(normalized.colors[0]);
          setSelectedSize(normalized.sizes[2] || normalized.sizes[0] || 'M');

          // Fetch related products dynamically
          try {
            const relRes = await productApi.getProducts({
              limit: 5,
              category: fetched.category?.slug || fetched.category?._id || undefined
            });
            const list = relRes?.data || relRes?.products || [];
            const related = list
              .filter((p) => (p._id || p.id) !== normalized.id)
              .slice(0, 4);
            if (!isCancelled) {
              setRelatedProducts(related);
            }
          } catch {
            if (!isCancelled) setRelatedProducts([]);
          }
        } else if (!isCancelled) {
          setProduct(null);
        }
      } catch (err) {
        console.error('Error fetching product from API:', err);
        if (!isCancelled) {
          setProduct(null);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchProduct();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return () => {
      isCancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex flex-col font-sans">
        <AnnouncementBar />
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-32">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#111111] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#666666]">
              Retrieving Atelier Creation...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex flex-col font-sans">
        <AnnouncementBar />
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-32 px-4 text-center">
          <div className="max-w-md space-y-4">
            <h2 className="font-serif text-3xl uppercase tracking-wider text-[#111111]">
              Garment Not Found
            </h2>
            <p className="text-xs text-[#666666]">
              The bespoke piece you are seeking may have been archived or is no longer in circulation.
            </p>
            <Link
              to="/"
              className="inline-block bg-[#111111] text-[#F8F7F4] px-6 py-3 text-xs font-mono uppercase tracking-[0.2em] hover:bg-[#333333] transition-colors"
            >
              Return to Boutique
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isWishlisted = wishlistItems.includes(product.id);

  const handleAddToCart = () => {
    const prodId = product.id || product._id || product.slug;
    const prodName = product.name || product.title || 'Curated Atelier Piece';
    const prodPrice = Number(product.price ?? product.basePrice ?? 0);
    const prodImage = product.images?.[selectedImage] || product.images?.[0] || product.image || '';

    dispatch(
      addToCart({
        product: {
          id: prodId,
          _id: prodId,
          name: prodName,
          title: prodName,
          price: prodPrice,
          basePrice: prodPrice,
          images: product.images,
          image: prodImage
        },
        size: selectedSize,
        color: selectedColor?.name || 'Standard',
        quantity
      })
    );
    showToast(`Added ${quantity}x ${prodName} (${selectedSize} / ${selectedColor?.name || 'Standard'}) to your bag.`);
    dispatch(openCart());
  };

  const handleBuyNow = () => {
    const prodId = product.id || product._id || product.slug;
    const prodName = product.name || product.title || 'Curated Atelier Piece';
    const prodPrice = Number(product.price ?? product.basePrice ?? 0);
    const prodImage = product.images?.[selectedImage] || product.images?.[0] || product.image || '';

    dispatch(
      addToCart({
        product: {
          id: prodId,
          _id: prodId,
          name: prodName,
          title: prodName,
          price: prodPrice,
          basePrice: prodPrice,
          images: product.images,
          image: prodImage
        },
        size: selectedSize,
        color: selectedColor?.name || 'Standard',
        quantity
      })
    );
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#111111] flex flex-col font-sans selection:bg-[#111111] selection:text-[#F8F7F4]">
      <AnnouncementBar />
      <Navbar />

      {/* Breadcrumb Trail */}
      <nav className="max-w-[1920px] mx-auto w-full px-4 sm:px-8 lg:px-12 py-4 border-b border-[#E5E3DF] text-[10px] font-mono uppercase tracking-[0.2em] text-[#8E877F] flex items-center gap-2">
        <Link to="/" className="hover:text-[#111111] transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link to="/shop" className="hover:text-[#111111] transition-colors">Shop</Link>
        <ChevronRight size={12} />
        <span className="text-[#666666]">{product.category}</span>
        <ChevronRight size={12} />
        <span className="text-[#111111] font-semibold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
      </nav>

      {/* Main Editorial Presentation */}
      <main className="flex-1 max-w-[1920px] mx-auto w-full px-4 sm:px-8 lg:px-12 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-14">
          {/* Left Column: Image Presentation (Thumbnail Bar + Hero Showcase) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:w-20 shrink-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-20 sm:w-20 sm:h-24 border overflow-hidden transition-all shrink-0 ${
                    selectedImage === idx
                      ? 'border-[#111111] shadow-sm'
                      : 'border-[#E5E3DF] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumb ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Stage Image */}
            <div className="flex-1 aspect-[3/4] bg-[#F2EFE9] border border-[#E5E3DF] overflow-hidden relative group">
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />

              {/* Wishlist floating toggle */}
              <button
                type="button"
                onClick={() => {
                  dispatch(toggleWishlist(product.id));
                  showToast(
                    isWishlisted
                      ? `Removed ${product.name} from wishlist.`
                      : `Saved ${product.name} to wishlist.`
                  );
                }}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-[#E5E3DF] flex items-center justify-center hover:scale-110 transition-all shadow-sm"
                aria-label="Wishlist toggle"
              >
                <Heart
                  size={18}
                  className={`transition-colors ${
                    isWishlisted ? 'fill-[#111111] text-[#111111]' : 'text-[#111111]'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Right Column: Garment Specifications & Buying Console */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Brand Header & Star Rating */}
              <div className="flex items-center justify-between">
                <Link
                  to={`/store/${product.storeSlug}`}
                  className="text-xs font-mono uppercase tracking-[0.25em] text-[#8E877F] hover:text-[#111111] transition-colors border-b border-transparent hover:border-[#111111]"
                >
                  {product.storeName}
                </Link>

                <div className="flex items-center gap-1.5 text-xs font-mono">
                  <Star className="w-3.5 h-3.5 fill-[#111111] text-[#111111]" />
                  <span className="font-semibold text-[#111111]">{product.rating}</span>
                  <span className="text-[#8E877F]">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] font-normal tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Price & Currency */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="font-serif text-2xl sm:text-3xl font-medium text-[#111111]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm font-mono text-[#8E877F] line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 tracking-wider uppercase">
                  Complimentary Insured Delivery
                </span>
              </div>

              <p className="text-xs text-[#666666] leading-relaxed pt-2">
                {product.description}
              </p>

              <hr className="border-[#E5E3DF]" />

              {/* Color Swatches */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono uppercase tracking-wider">
                  <span className="text-[#666666]">Color Hue:</span>
                  <span className="text-[#111111] font-semibold">{selectedColor?.name || 'Onyx'}</span>
                </div>
                <div className="flex items-center gap-2">
                  {product.colors.map((col, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedColor(col)}
                      className={`px-3 py-1.5 border text-xs font-mono flex items-center gap-2 transition-all ${
                        selectedColor?.name === col.name
                          ? 'border-[#111111] bg-[#111111] text-[#F8F7F4]'
                          : 'border-[#E5E3DF] bg-[#FFFFFF] text-[#111111] hover:border-[#111111]'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-white/40"
                        style={{ backgroundColor: col.code || '#111' }}
                      />
                      <span>{col.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selectors */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-mono uppercase tracking-wider">
                  <span className="text-[#666666]">Atelier Size:</span>
                  <span className="text-[#8E877F] underline cursor-pointer hover:text-[#111111]">
                    Size Guide
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`py-3 text-xs font-mono uppercase transition-all ${
                        selectedSize === sz
                          ? 'bg-[#111111] text-[#F8F7F4] font-semibold'
                          : 'bg-[#FFFFFF] border border-[#E5E3DF] text-[#111111] hover:border-[#111111]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Counter */}
              <div className="pt-2">
                <span className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-2">
                  Quantity
                </span>
                <div className="inline-flex items-center border border-[#E5E3DF] bg-[#FFFFFF]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-3 text-[#111111] hover:bg-[#F2EFE9] transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-12 text-center text-xs font-mono font-bold">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-3 text-[#111111] hover:bg-[#F2EFE9] transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Primary Call to Action Buttons */}
              <div className="pt-4 space-y-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full bg-[#111111] text-[#F8F7F4] py-4 px-6 text-xs font-mono uppercase tracking-[0.22em] hover:bg-[#2B2B2B] transition-all flex items-center justify-center gap-2 group shadow-md"
                >
                  <ShoppingBag size={16} />
                  <span>Add To Bag</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full bg-[#FFFFFF] border border-[#111111] text-[#111111] py-3.5 px-6 text-xs font-mono uppercase tracking-[0.22em] hover:bg-[#111111] hover:text-[#F8F7F4] transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles size={14} />
                  <span>Instant Purchase / Checkout</span>
                </button>
              </div>

              {/* Assurances Banner */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#E5E3DF] text-[10px] font-mono uppercase tracking-wider text-[#666666] text-center">
                <div className="p-2 border border-[#E5E3DF] bg-[#FAF9F6]">
                  <ShieldCheck size={16} className="mx-auto mb-1 text-[#111111]" />
                  <span>Authentic Fabric</span>
                </div>
                <div className="p-2 border border-[#E5E3DF] bg-[#FAF9F6]">
                  <Truck size={16} className="mx-auto mb-1 text-[#111111]" />
                  <span>Free Express Delivery</span>
                </div>
                <div className="p-2 border border-[#E5E3DF] bg-[#FAF9F6]">
                  <RotateCcw size={16} className="mx-auto mb-1 text-[#111111]" />
                  <span>7-Day Return Service</span>
                </div>
              </div>
            </div>

            {/* Specifications Accordion */}
            <div className="pt-6 border-t border-[#E5E3DF] space-y-3 text-xs">
              <div className="flex border-b border-[#E5E3DF]">
                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className={`pb-2 mr-6 font-mono uppercase tracking-wider text-[11px] ${
                    activeTab === 'details'
                      ? 'border-b-2 border-[#111111] text-[#111111] font-bold'
                      : 'text-[#8E877F] hover:text-[#111111]'
                  }`}
                >
                  Garment Details
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('care')}
                  className={`pb-2 font-mono uppercase tracking-wider text-[11px] ${
                    activeTab === 'care'
                      ? 'border-b-2 border-[#111111] text-[#111111] font-bold'
                      : 'text-[#8E877F] hover:text-[#111111]'
                  }`}
                >
                  Fabric & Care
                </button>
              </div>

              {activeTab === 'details' ? (
                <div className="space-y-1.5 text-[#666666]">
                  <p>• Composition: {product.fabric}</p>
                  <p>• Artisan Brand: {product.storeName}</p>
                  <p>• Handcrafted for luxury drape and enduring silhouette</p>
                  <p>• Concealed French seams and bespoke horn buttons</p>
                </div>
              ) : (
                <div className="space-y-1.5 text-[#666666]">
                  <p>• Specialist dry clean only</p>
                  <p>• Cool iron with protective cloth</p>
                  <p>• Store in ventilated garment sleeve</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Product Recommendations */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 pt-12 border-t border-[#E5E3DF]">
            <div className="text-center mb-10">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#8E877F] block mb-2">
                CURATED COMPANION PIECES
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#111111] tracking-tight uppercase">
                You May Also Admire
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard
                  key={rel.id}
                  product={rel}
                  onShowToast={showToast}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
};

export default ProductDetails;
