import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, Star, ShoppingBag, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toggleWishlist } from '../../redux/slices/wishlistSlice';
import { addToCart } from '../../redux/slices/cartSlice';

export const ProductCard = ({ product, onQuickView, onShowToast }) => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isWishlisted = wishlistItems.includes(product.id);

  const [activeColor, setActiveColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0] : null
  );

  const primaryImage = product.images[0];
  const secondaryImage = product.hoverImage || (product.images.length > 1 ? product.images[1] : primaryImage);

  const handleWishlist = (e) => {
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
        size: product.sizes ? product.sizes[0] : 'M',
        color: activeColor?.name || 'Standard',
        quantity: 1
      })
    );
    if (onShowToast) {
      onShowToast(`Added ${product.name} (Size: ${product.sizes ? product.sizes[0] : 'M'}) to bag.`);
    }
  };

  return (
    <div className="group flex flex-col bg-m4m-card border border-m4m-border transition-all duration-300 hover:shadow-lg">
      {/* Product Image Frame */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F2EFE9]">
        {/* Primary Image with Link */}
        <Link
          to={`/product/${product.id || product._id || product.slug}`}
          className="block w-full h-full cursor-pointer"
        >
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            loading="lazy"
          />

          {/* Secondary Image cross-fade */}
          {secondaryImage && secondaryImage !== primaryImage && (
            <img
              src={secondaryImage}
              alt={`${product.name} alternate`}
              className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out pointer-events-none"
              loading="lazy"
            />
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.badge && (
            <span className="bg-[#111111] text-m4m-bg text-[9px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 shadow-sm">
              {product.badge}
            </span>
          )}
          {product.discount && (
            <span className="bg-m4m-accent text-m4m-card text-[9px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 shadow-sm">
              {product.discount}
            </span>
          )}
        </div>

        {/* Wishlist Icon */}
        <button
          type="button"
          onClick={handleWishlist}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-m4m-card/90 backdrop-blur-sm border border-m4m-border flex items-center justify-center text-[#111111] hover:bg-m4m-card hover:scale-110 transition-all duration-200 shadow-sm"
          aria-label="Wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-[#111111] text-[#111111]' : 'text-[#111111]'
            }`}
          />
        </button>

        {/* Hover Quick Actions */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-linear-to-t from-[#111111]/75 via-[#111111]/30 to-transparent translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2">
          <button
            type="button"
            onClick={handleQuickAdd}
            className="flex-1 bg-m4m-card text-[#111111] text-[10px] font-mono uppercase tracking-[0.18em] py-2.5 px-3 hover:bg-[#111111] hover:text-m4m-bg transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>QUICK ADD</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onQuickView) onQuickView(product);
            }}
            className="bg-[#111111]/90 text-m4m-bg p-2.5 hover:bg-[#111111] transition-colors border border-white/20"
            title="Inspect piece"
            aria-label="Inspect piece"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Store / Brand Name */}
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-m4m-accent mb-1">
            <Link
              to={`/store/${product.storeSlug}`}
              className="hover:text-[#111111] hover:underline transition-colors"
            >
              {product.storeName}
            </Link>
            {product.rating && (
              <span className="flex items-center text-[#111111] font-mono">
                <Star className="w-3 h-3 fill-[#111111] text-[#111111] mr-1" />
                {product.rating}
              </span>
            )}
          </div>

          {/* Product Name */}
          <Link
            to={`/product/${product.id || product._id || product.slug}`}
            className="block font-serif text-base sm:text-lg font-normal text-[#111111] hover:underline line-clamp-1 mb-1"
          >
            {product.name}
          </Link>

          {/* Fabric Specification */}
          <p className="text-[11px] text-m4m-secondary font-sans line-clamp-1 mb-3">
            {product.fabric}
          </p>
        </div>

        <div>
          {/* Color swatches */}
          {product.colors && product.colors.length > 1 && (
            <div className="flex items-center gap-1.5 mb-2.5">
              {product.colors.map((c, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveColor(c)}
                  className={`w-3.5 h-3.5 rounded-full border transition-transform ${
                    activeColor?.name === c.name ? 'border-[#111111] scale-125' : 'border-m4m-border'
                  }`}
                  title={c.name}
                >
                  <span
                    className="block w-full h-full rounded-full"
                    style={{ backgroundColor: c.hex }}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Price with Rupee symbol (₹) */}
          <div className="flex items-baseline gap-2 pt-2 border-t border-m4m-border/60">
            <span className="text-sm sm:text-base font-mono font-medium text-[#111111]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="text-xs font-mono text-m4m-accent line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
