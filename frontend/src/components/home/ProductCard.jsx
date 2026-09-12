import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import { toggleWishlist } from '../../redux/slices/wishlistSlice';
import { addToCart } from '../../redux/slices/cartSlice';

export const ProductCard = ({ product, onQuickView, onShowToast }) => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isWishlisted = wishlistItems.includes(product.id);

  const [activeColor, setActiveColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0] : null
  );

  const primaryImage = activeColor?.image || product.images[0];
  const secondaryImage = product.hoverImage || (product.images.length > 1 ? product.images[1] : primaryImage);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(product.id));
    if (onShowToast) {
      onShowToast(
        isWishlisted
          ? `Removed ${product.name} from wishlist.`
          : `Saved ${product.name} to wishlist.`
      );
    }
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      addToCart({
        product,
        size: product.sizes ? product.sizes[0] : 'Standard',
        color: activeColor,
        quantity: 1
      })
    );
    if (onShowToast) {
      onShowToast(`Added ${product.name} to bag.`);
    }
  };

  return (
    <div className="group flex flex-col bg-[#FFFFFF] border border-[#E5E3DF] transition-all duration-300 hover:shadow-lg">
      {/* Product Image Frame */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#EFECE6] cursor-pointer">
        {/* Primary Image */}
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          loading="lazy"
        />

        {/* Secondary Hover Image cross-fade */}
        {secondaryImage && secondaryImage !== primaryImage && (
          <img
            src={secondaryImage}
            alt={`${product.name} alternate view`}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out pointer-events-none"
            loading="lazy"
          />
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.badge && (
            <span className="bg-[#111111] text-[#F8F7F4] text-[9px] font-mono uppercase tracking-[0.2em] px-2 py-0.5">
              {product.badge}
            </span>
          )}
          {product.compareAtPrice && (
            <span className="bg-[#8E877F] text-[#FFFFFF] text-[9px] font-mono uppercase tracking-[0.2em] px-2 py-0.5">
              SALE
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-[#FFFFFF]/90 backdrop-blur-sm border border-[#E5E3DF] flex items-center justify-center text-[#111111] hover:bg-[#FFFFFF] hover:scale-110 transition-all duration-200 shadow-sm"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-[#111111] text-[#111111]' : 'text-[#111111]'
            }`}
          />
        </button>

        {/* Bottom Quick Action Overlay on Hover */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-[#111111]/70 via-[#111111]/30 to-transparent translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2">
          <button
            type="button"
            onClick={handleQuickAdd}
            className="flex-1 bg-[#FFFFFF] text-[#111111] text-[10px] font-mono uppercase tracking-[0.18em] py-2 px-3 hover:bg-[#111111] hover:text-[#F8F7F4] transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <ShoppingBag className="w-3 h-3" />
            <span>ADD TO BAG</span>
          </button>

          <button
            type="button"
            onClick={() => onQuickView && onQuickView(product)}
            className="bg-[#111111]/90 text-[#F8F7F4] p-2 hover:bg-[#111111] transition-colors border border-white/20"
            aria-label="Quick View"
            title="Quick View"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#8E877F] mb-1.5">
            <span>{product.categoryName}</span>
            {product.rating && (
              <span className="flex items-center text-[#111111]">
                <Star className="w-3 h-3 fill-[#111111] mr-1" />
                {product.rating}
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onQuickView && onQuickView(product)}
            className="font-serif text-base sm:text-lg font-normal text-[#111111] hover:underline cursor-pointer line-clamp-1 mb-1"
          >
            {product.name}
          </h3>

          {/* Fabric / Subtitle */}
          <p className="text-[11px] text-[#666666] font-sans line-clamp-1 mb-3">
            {product.subtitle || product.fabric}
          </p>
        </div>

        <div>
          {/* Color Swatches */}
          {product.colors && product.colors.length > 1 && (
            <div className="flex items-center gap-1.5 mb-3">
              {product.colors.map((color, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveColor(color)}
                  className={`w-3.5 h-3.5 rounded-full border transition-transform ${
                    activeColor?.name === color.name ? 'border-[#111111] scale-125' : 'border-[#E5E3DF]'
                  }`}
                  title={color.name}
                >
                  <span
                    className="block w-full h-full rounded-full"
                    style={{ backgroundColor: color.hex }}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-2 border-t border-[#E5E3DF]/60">
            <span className="text-sm sm:text-base font-mono font-medium text-[#111111]">
              ${product.price}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs font-mono text-[#8E877F] line-through">
                ${product.compareAtPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
