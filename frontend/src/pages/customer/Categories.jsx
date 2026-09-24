import { ArrowRight, ChevronDown, Search, Sparkles, Tag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ProductCard } from "../../components/product/ProductCard";
import { categories as catalogCategories } from "../../data/categories";
import { useShopData } from "../../context/ShopDataContext";

const PRICE_OPTIONS = [
  { value: "all", label: "All prices" },
  { value: "under-500", label: "Under ₹500", test: (price) => price < 500 },
  {
    value: "500-999",
    label: "₹500 - ₹999",
    test: (price) => price >= 500 && price < 1000,
  },
  {
    value: "1000-plus",
    label: "₹1,000 and above",
    test: (price) => price >= 1000,
  },
];

const normalizeProduct = (product) => ({
  ...product,
  id: product._id || product.id,
  name: product.title || product.name,
  price: product.basePrice ?? product.price,
  originalPrice: product.originalPrice || product.compareAtPrice || null,
  storeName: product.store?.name || product.storeName || "Atelier House",
  storeSlug: product.store?.slug || product.storeSlug || "atelier-house",
});

const getProducts = (adminProducts, shopProducts = []) => {
  const available = shopProducts.map(normalizeProduct);
  adminProducts.forEach((product) => {
    const normalized = normalizeProduct(product);
    if (
      !available.some(
        (item) => (item.id || item._id) === (normalized.id || normalized._id),
      )
    ) {
      available.push(normalized);
    }
  });
  return available;
};

export const Categories = () => {
  const navigate = useNavigate();
  const { products: shopProducts } = useShopData();
  const adminProducts = useSelector((state) => state.products?.items || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [toast, setToast] = useState("");

  const products = useMemo(() => getProducts(adminProducts, shopProducts), [adminProducts, shopProducts]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        if (!Array.isArray(catalogCategories)) {
          throw new Error("Category data is unavailable.");
        }
        setIsLoading(false);
      } catch {
        setLoadError("Something went wrong while loading categories.");
        setIsLoading(false);
      }
    }, 250);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const categoryCards = useMemo(
    () =>
      catalogCategories.map((category) => {
        const categoryProducts = products.filter(
          (product) => product.category === category.id,
        );
        return {
          ...category,
          count: categoryProducts.length,
          products: categoryProducts,
        };
      }),
    [products],
  );

  const visibleCategories = useMemo(() => {
    const priceOption = PRICE_OPTIONS.find(
      (option) => option.value === priceRange,
    );
    return categoryCards.filter((category) => {
      const hasMatchingPrice =
        !priceOption?.test ||
        category.products.some((product) => priceOption.test(product.price));
      const matchesSearch =
        !searchTerm.trim() ||
        [category.name, category.tagline, category.badge]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.trim().toLowerCase());
      return hasMatchingPrice && matchesSearch;
    });
  }, [categoryCards, priceRange, searchTerm]);

  const featuredCategories = categoryCards.filter((category) =>
    category.products.some((product) => product.isFeatured),
  );
  const featuredProducts = products
    .filter((product) => product.isFeatured)
    .slice(0, 4);

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchTerm.trim();
    navigate(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
  };

  const handleCategoryBrowse = (categoryId) => {
    navigate(`/search?category=${encodeURIComponent(categoryId)}`);
  };

  const renderCategoryCard = (category, featured = false) => (
    <article
      key={category.id}
      className={`group relative overflow-hidden border border-m4m-border bg-white ${featured ? "min-h-96" : "min-h-80"}`}
    >
      <img
        src={category.image}
        alt={category.name}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-linear-to-t from-[#111111]/85 via-[#111111]/15 to-transparent" />
      <div className="relative flex h-full min-h-80 flex-col justify-between p-5 text-m4m-bg sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <span className="border border-white/40 bg-[#111111]/35 px-2 py-1 text-[9px] font-mono uppercase tracking-[0.2em]">
            {category.badge || "Collection"}
          </span>
          <span className="text-[10px] font-mono uppercase tracking-wider text-white/75">
            {category.count} {category.count === 1 ? "product" : "products"}
          </span>
        </div>
        <div>
          <h3 className="font-serif text-2xl uppercase tracking-wide">
            {category.name}
          </h3>
          <p className="mt-2 max-w-xs text-xs leading-relaxed text-white/75">
            {category.tagline}
          </p>
          <button
            type="button"
            onClick={() => handleCategoryBrowse(category.id)}
            className="mt-5 inline-flex items-center gap-2 border border-white/60 px-4 py-2 text-[10px] font-mono uppercase tracking-[0.18em] transition-colors hover:bg-white hover:text-[#111111]"
          >
            Browse {category.name} <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-m4m-bg px-4 py-16 font-sans text-[#111111] sm:px-6 lg:px-12">
        <div className="mx-auto max-w-6xl border border-m4m-border bg-white p-16 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#111111] border-t-transparent" />
          <p className="mt-4 text-xs font-mono uppercase tracking-widest text-m4m-accent">
            Loading categories...
          </p>
        </div>
      </div>
    );
  }

  if (loadError || categoryCards.length === 0) {
    return (
      <div className="min-h-screen bg-m4m-bg px-4 py-16 font-sans text-[#111111] sm:px-6 lg:px-12">
        <div className="mx-auto max-w-2xl border border-m4m-border bg-white p-10 text-center sm:p-16">
          <Tag className="mx-auto h-8 w-8 text-m4m-accent" />
          <h1 className="mt-4 font-serif text-2xl uppercase">
            No categories available
          </h1>
          <p className="mt-2 text-sm text-m4m-secondary">
            {loadError ||
              "There are no product categories to browse right now."}
          </p>
          <Link
            to="/search"
            className="mt-6 inline-flex bg-[#111111] px-6 py-3 text-xs font-mono uppercase tracking-wider text-m4m-bg hover:bg-[#333333]"
          >
            Search products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-m4m-bg px-4 py-10 font-sans text-[#111111] sm:px-6 md:py-16 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-12">
        <header className="border-b border-m4m-border pb-8">
          <span className="mb-2 block text-[10px] font-mono uppercase tracking-[0.3em] text-m4m-accent">
            Client portal / collection index
          </span>
          <h1 className="font-serif text-3xl uppercase tracking-tight sm:text-5xl">
            Shop by Category
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-m4m-secondary">
            Explore products by category and find exactly what you&apos;re
            looking for.
          </p>
          <form onSubmit={handleSearch} className="mt-6 flex max-w-2xl gap-2">
            <label htmlFor="category-search" className="sr-only">
              Search products
            </label>
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-m4m-accent" />
              <input
                id="category-search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search products or categories"
                className="w-full border border-m4m-border bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-[#111111]"
              />
            </div>
            <button
              type="submit"
              className="bg-[#111111] px-5 py-3 text-xs font-mono uppercase tracking-wider text-m4m-bg hover:bg-[#333333]"
            >
              Search
            </button>
          </form>
        </header>

        {toast && (
          <div
            className="border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900"
            role="status"
          >
            {toast}
          </div>
        )}

        <section aria-labelledby="featured-categories-heading">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-m4m-accent">
                Curated starting points
              </span>
              <h2
                id="featured-categories-heading"
                className="mt-1 font-serif text-2xl uppercase tracking-wider"
              >
                Featured Categories
              </h2>
            </div>
            <span className="text-xs text-m4m-secondary">
              {featuredCategories.length} collections to explore
            </span>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featuredCategories
              .slice(0, 3)
              .map((category) => renderCategoryCard(category, true))}
          </div>
        </section>

        <section aria-labelledby="all-categories-heading">
          <div className="mb-5 flex flex-col gap-4 border-b border-m4m-border pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-m4m-accent">
                Complete catalog index
              </span>
              <h2
                id="all-categories-heading"
                className="mt-1 font-serif text-2xl uppercase tracking-wider"
              >
                All Categories
              </h2>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <label
                htmlFor="price-filter"
                className="text-[10px] font-mono uppercase tracking-wider text-m4m-accent"
              >
                Filter by price
              </label>
              <div className="relative">
                <select
                  id="price-filter"
                  value={priceRange}
                  onChange={(event) => setPriceRange(event.target.value)}
                  className="appearance-none border border-m4m-border bg-white py-2 pl-3 pr-9 text-xs outline-none focus:border-[#111111]"
                >
                  {PRICE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2" />
              </div>
            </div>
          </div>
          {visibleCategories.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visibleCategories.map((category) =>
                renderCategoryCard(category),
              )}
            </div>
          ) : (
            <div className="border border-m4m-border bg-white p-12 text-center">
              <h3 className="font-serif text-xl uppercase">
                No matching categories
              </h3>
              <p className="mt-2 text-sm text-m4m-secondary">
                Try another category search or price range.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setPriceRange("all");
                }}
                className="mt-5 border border-[#111111] px-5 py-3 text-xs font-mono uppercase tracking-wider hover:bg-[#111111] hover:text-m4m-bg"
              >
                Reset filters
              </button>
            </div>
          )}
        </section>

        {featuredProducts.length > 0 && (
          <section aria-labelledby="featured-products-heading">
            <div className="mb-5 flex items-end justify-between border-b border-m4m-border pb-4">
              <div>
                <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-m4m-accent">
                  <Sparkles className="h-3.5 w-3.5" /> From the catalog
                </span>
                <h2
                  id="featured-products-heading"
                  className="mt-1 font-serif text-2xl uppercase tracking-wider"
                >
                  Featured Pieces
                </h2>
              </div>
              <Link
                to="/search"
                className="hidden items-center gap-2 text-[10px] font-mono uppercase tracking-wider hover:underline sm:inline-flex"
              >
                View all products <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id || product._id}
                  product={product}
                  onQuickView={() =>
                    navigate(`/product/${product.id || product._id}`)
                  }
                  onShowToast={setToast}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Categories;
