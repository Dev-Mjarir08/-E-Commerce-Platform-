import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { X, Star, Shield, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { addToCart } from '../../redux/slices/cartSlice';

export const QuickViewModal = ({ product, isOpen, onClose, onShowToast }) => {
  const dispatch = useDispatch();

  const [selectedImageOverride, setSelectedImageOverride] = useState('');
  const [selectedColorOverride, setSelectedColorOverride] = useState(null);
  const [selectedSizeOverride, setSelectedSizeOverride] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [prevProduct, setPrevProduct] = useState(product);

  if (product !== prevProduct) {
    setPrevProduct(product);
    setSelectedImageOverride('');
    setSelectedColorOverride(null);
    setSelectedSizeOverride('');
    setQuantity(1);
  }

  const getImgUrl = (img) => {
    if (!img) return '';
    if (typeof img === 'string') return img;
    return img.url || '';
  };

  const imagesList = Array.isArray(product?.images) && product.images.length > 0
    ? product.images.map(getImgUrl).filter(Boolean)
    : [product?.image || 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80'];

  const prodId = product?.id || product?._id || product?.slug;
  const prodName = product?.name || product?.title || 'Curated Atelier Piece';
  const prodPrice = Number(product?.price ?? product?.basePrice ?? 0);
  const prodOriginalPrice = product?.originalPrice ?? product?.compareAtPrice ?? null;
  const prodStoreName = product?.storeName || product?.store?.name || product?.brand || 'Atelier Studio';
  const prodStoreSlug = product?.storeSlug || product?.store?.slug || 'flagship';

  const selectedImage = selectedImageOverride || imagesList[0];
  const selectedColor = selectedColorOverride !== null ? selectedColorOverride : (product?.colors ? product.colors[0] : null);
  const selectedSize = selectedSizeOverride || (product?.sizes ? product.sizes[0] : 'M');

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        product: {
          ...product,
          id: prodId,
          _id: prodId,
          name: prodName,
          title: prodName,
          price: prodPrice,
          basePrice: prodPrice,
          images: imagesList,
          image: imagesList[0]
        },
        size: selectedSize,
        color: selectedColor?.name || 'Standard',
        quantity
      })
    );
    if (onShowToast) {
      onShowToast(`Added ${quantity}x ${prodName} (${selectedSize}) to bag.`);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-[#111111]/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="relative z-10 bg-m4m-card max-w-4xl w-full border border-m4m-border shadow-2xl overflow-hidden my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-m4m-card/80 backdrop-blur p-2 text-m4m-secondary hover:text-[#111111] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Images */}
          <div className="bg-[#FAF9F6] p-6 flex flex-col justify-between">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F2EFE9] mb-4">
              <img
                src={selectedImage}
                alt={prodName}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 bg-[#111111] text-m4m-bg text-[9px] font-mono uppercase tracking-[0.2em] px-2.5 py-1">
                  {product.badge}
                </span>
              )}
            </div>

            {imagesList.length > 1 && (
              <div className="flex gap-2 justify-center">
                {imagesList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageOverride(img)}
                    className={`w-14 h-18 border overflow-hidden transition-all ${
                      selectedImage === img
                        ? 'border-[#111111] ring-1 ring-[#111111]'
                        : 'border-m4m-border opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Specs & Add to Bag */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Link
                  to={`/store/${prodStoreSlug}`}
                  onClick={onClose}
                  className="text-[10px] font-mono uppercase tracking-[0.25em] text-m4m-accent hover:text-[#111111] underline"
                >
                  {prodStoreName}
                </Link>
                <span className="text-[#D4CEC5]">•</span>
                <div className="flex items-center text-[#111111] text-xs font-mono">
                  <Star className="w-3.5 h-3.5 fill-[#111111] text-[#111111] mr-1" />
                  <span>{product.rating || product.ratingsAverage || 4.9}</span>
                  <span className="text-[#888888] ml-1">({product.reviewsCount || product.ratingsQuantity || 12})</span>
                </div>
              </div>

              <h2 className="font-serif text-2xl lg:text-3xl text-[#111111] mb-2 leading-tight">
                {prodName}
              </h2>

              <p className="text-xs text-m4m-secondary font-sans mb-4">
                {product.fabric || product.description || 'Curated Atelier piece'}
              </p>

              <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-m4m-border">
                <span className="text-2xl font-mono font-medium text-[#111111]">
                  ₹{prodPrice.toLocaleString('en-IN')}
                </span>
                {prodOriginalPrice && (
                  <span className="text-sm font-mono text-m4m-accent line-through">
                    ₹{prodOriginalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {product.discount && (
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#2e7d32] ml-auto">
                    {product.discount}
                  </span>
                )}
              </div>

              {/* Color Swatches */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-5">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="font-mono uppercase text-m4m-secondary tracking-wider text-[11px]">
                      COLOR:
                    </span>
                    <span className="font-medium text-[#111111]">{selectedColor?.name}</span>
                  </div>
                  <div className="flex gap-2.5">
                    {product.colors.map((c, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedColorOverride(c)}
                        className={`w-7 h-7 rounded-full border p-0.5 transition-all flex items-center justify-center ${
                          selectedColor?.name === c.name ? 'border-[#111111] scale-110' : 'border-m4m-border'
                        }`}
                        title={c.name}
                      >
                        <span
                          className="w-full h-full rounded-full border border-black/10 block"
                          style={{ backgroundColor: c.hex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="font-mono uppercase text-m4m-secondary tracking-wider text-[11px]">
                      SELECT SIZE:
                    </span>
                    <span className="text-[11px] font-mono text-m4m-accent uppercase tracking-wider">
                      SIZE CHART
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSizeOverride(s)}
                        className={`px-3 py-2 text-xs font-mono uppercase tracking-wider border transition-all ${
                          selectedSize === s
                            ? 'bg-[#111111] text-m4m-bg border-[#111111]'
                            : 'bg-m4m-card text-[#111111] border-m4m-border hover:border-[#111111]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-[#FAF9F6] p-3 border border-m4m-border mb-6 space-y-1 text-[11px] text-m4m-secondary">
                <p>
                  <strong className="text-[#111111] font-medium font-mono uppercase">FIT:</strong>{' '}
                  {product.fit || 'Relaxed contemporary silhouette'}
                </p>
                <p>
                  <strong className="text-[#111111] font-medium font-mono uppercase">SHIPPING:</strong>{' '}
                  Free Express Shipping on orders over ₹999
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex items-center border border-m4m-border bg-m4m-bg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-3 text-m4m-secondary hover:text-[#111111]"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-mono font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-3 text-m4m-secondary hover:text-[#111111]"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#111111] text-m4m-bg text-xs font-mono uppercase tracking-[0.2em] py-3.5 hover:bg-[#2B2B2B] transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO BAG • ₹{(prodPrice * quantity).toLocaleString('en-IN')}</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-m4m-accent uppercase">
                <Shield className="w-3.5 h-3.5" />
                <span>Verified Independent Brand • 7-Day Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
