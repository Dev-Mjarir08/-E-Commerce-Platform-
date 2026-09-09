import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { X, Star, Shield, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { addToCart } from '../../redux/slices/cartSlice';

export const QuickViewModal = ({ product, isOpen, onClose, onShowToast }) => {
  const dispatch = useDispatch();

  const [selectedImage, setSelectedImage] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.images ? product.images[0] : '');
      setSelectedColor(product.colors ? product.colors[0] : null);
      setSelectedSize(product.sizes ? product.sizes[0] : 'M');
      setQuantity(1);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        product,
        size: selectedSize,
        color: selectedColor?.name || 'Standard',
        quantity
      })
    );
    if (onShowToast) {
      onShowToast(`Added ${quantity}x ${product.name} (${selectedSize}) to bag.`);
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

      <div className="relative z-10 bg-[#FFFFFF] max-w-4xl w-full border border-[#E5E3DF] shadow-2xl overflow-hidden my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-[#FFFFFF]/80 backdrop-blur p-2 text-[#666666] hover:text-[#111111] transition-colors"
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
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 bg-[#111111] text-[#F8F7F4] text-[9px] font-mono uppercase tracking-[0.2em] px-2.5 py-1">
                  {product.badge}
                </span>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 justify-center">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-18 border overflow-hidden transition-all ${
                      selectedImage === img
                        ? 'border-[#111111] ring-1 ring-[#111111]'
                        : 'border-[#E5E3DF] opacity-70 hover:opacity-100'
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
                  to={`/store/${product.storeSlug}`}
                  onClick={onClose}
                  className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8E877F] hover:text-[#111111] underline"
                >
                  {product.storeName}
                </Link>
                <span className="text-[#D4CEC5]">•</span>
                <div className="flex items-center text-[#111111] text-xs font-mono">
                  <Star className="w-3.5 h-3.5 fill-[#111111] text-[#111111] mr-1" />
                  <span>{product.rating}</span>
                  <span className="text-[#888888] ml-1">({product.reviewsCount})</span>
                </div>
              </div>

              <h2 className="font-serif text-2xl lg:text-3xl text-[#111111] mb-2 leading-tight">
                {product.name}
              </h2>

              <p className="text-xs text-[#666666] font-sans mb-4">
                {product.fabric}
              </p>

              <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-[#E5E3DF]">
                <span className="text-2xl font-mono font-medium text-[#111111]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-sm font-mono text-[#8E877F] line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
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
                    <span className="font-mono uppercase text-[#666666] tracking-wider text-[11px]">
                      COLOR:
                    </span>
                    <span className="font-medium text-[#111111]">{selectedColor?.name}</span>
                  </div>
                  <div className="flex gap-2.5">
                    {product.colors.map((c, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedColor(c)}
                        className={`w-7 h-7 rounded-full border p-0.5 transition-all flex items-center justify-center ${
                          selectedColor?.name === c.name ? 'border-[#111111] scale-110' : 'border-[#E5E3DF]'
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
                    <span className="font-mono uppercase text-[#666666] tracking-wider text-[11px]">
                      SELECT SIZE:
                    </span>
                    <span className="text-[11px] font-mono text-[#8E877F] uppercase tracking-wider">
                      SIZE CHART
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-3 py-2 text-xs font-mono uppercase tracking-wider border transition-all ${
                          selectedSize === s
                            ? 'bg-[#111111] text-[#F8F7F4] border-[#111111]'
                            : 'bg-[#FFFFFF] text-[#111111] border-[#E5E3DF] hover:border-[#111111]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-[#FAF9F6] p-3 border border-[#E5E3DF] mb-6 space-y-1 text-[11px] text-[#666666]">
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
                <div className="flex items-center border border-[#E5E3DF] bg-[#F8F7F4]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-3 text-[#666666] hover:text-[#111111]"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-mono font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-3 text-[#666666] hover:text-[#111111]"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#111111] text-[#F8F7F4] text-xs font-mono uppercase tracking-[0.2em] py-3.5 hover:bg-[#2B2B2B] transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO BAG • ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-[#8E877F] uppercase">
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
