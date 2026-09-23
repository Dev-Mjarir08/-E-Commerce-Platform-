import {
  AlertCircle,
  ChevronDown,
  Filter,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ProductCard } from "../../components/product/ProductCard";
import { products as catalogProducts } from "../../data/products";

const PRICE_RANGES = [
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

const RATING_OPTIONS = [
  { value: "all", label: "Any rating" },
  { value: "4", label: "4.0+ stars", minimum: 4 },
  { value: "4.5", label: "4.5+ stars", minimum: 4.5 },
];

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Rating" },
  { value: "newest", label: "Newest" },
];

const normalizeProduct = (product) => ({
  ...product,
  originalPrice: product.originalPrice || product.compareAtPrice || null,
  storeName: product.storeName || "Atelier House",
  storeSlug: product.storeSlug || "atelier-house",
});

const getProducts = (adminProducts) => {
  const available = catalogProducts.map(normalizeProduct);
  adminProducts.forEach((product) => {
    const normalized = normalizeProduct(product);
    if (
      !available.some(
        (item) => item.id === normalized.id || item._id === normalized._id,
      )
    ) {
      available.push(normalized);
    }
  });
  return available;
};

export const SearchResults = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const adminProducts = useSelector((state) => state.products?.items || []);
  const query = searchParams.get("q")?.trim() || "";
  const category = searchParams.get("category") || "all";
  const priceRange = searchParams.get("price") || "all";
  const minimumRating = searchParams.get("rating") || "all";
  const availability = searchParams.get("availability") || "all";
  const sort = searchParams.get("sort") || "relevance";
  const [draftQuery, setDraftQuery] = useState(
    () => searchParams.get("q") || "",
  );
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [visibleCount, setVisibleCount] = useState(8);

  const allProducts = useMemo(
    () => getProducts(adminProducts),
    [adminProducts],
  );
  const categories = useMemo(
    () => [
      { value: "all", label: "All categories" },
      ...Array.from(
        new Map(
          allProducts.map((product) => [
            product.category,
            product.categoryName || product.category,
          ]),
        ),
      ).map(([value, label]) => ({ value, label })),
    ],
    [allProducts],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 250);
    return () => window.clearTimeout(timer);
  }, [query, category, priceRange, minimumRating, availability, sort]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const filteredProducts = useMemo(() => {
    const priceOption = PRICE_RANGES.find(
      (option) => option.value === priceRange,
    );
    const ratingOption = RATING_OPTIONS.find(
      (option) => option.value === minimumRating,
    );
    const normalizedQuery = query.toLowerCase();

    const matches = allProducts.filter((product) => {
      const searchableText = [
        product.name,
        product.subtitle,
        product.fabric,
        product.category,
        product.categoryName,
        product.storeName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesQuery =
        !normalizedQuery || searchableText.includes(normalizedQuery);
      const matchesCategory =
        category === "all" || product.category === category;
      const matchesPrice =
        !priceOption?.test || priceOption.test(product.price);
      const matchesRating =
        !ratingOption?.minimum || (product.rating || 0) >= ratingOption.minimum;
      const matchesAvailability =
        availability === "all" ||
        (availability === "in-stock" && product.inStock);
      return (
        matchesQuery &&
        matchesCategory &&
        matchesPrice &&
        matchesRating &&
        matchesAvailability
      );
    });

    return [...matches].sort((first, second) => {
      if (sort === "price-low") return first.price - second.price;
      if (sort === "price-high") return second.price - first.price;
      if (sort === "rating") return (second.rating || 0) - (first.rating || 0);
      if (sort === "newest")
        return Number(Boolean(second.isNew)) - Number(Boolean(first.isNew));
      return 0;
    });
  }, [
    allProducts,
    availability,
    category,
    minimumRating,
    priceRange,
    query,
    sort,
  ]);

  const updateParam = (name, value) => {
    setIsLoading(true);
    setVisibleCount(8);
    const nextParams = new URLSearchParams(searchParams);
    if (!value || value === "all") nextParams.delete(name);
    else nextParams.set(name, value);
    setSearchParams(nextParams);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const nextParams = new URLSearchParams(searchParams);
    if (draftQuery.trim()) nextParams.set("q", draftQuery.trim());
    else nextParams.delete("q");
    setIsLoading(true);
    setVisibleCount(8);
    setSearchParams(nextParams);
  };

  const handleProductOpen = (product) => {
    navigate(`/product/${product.id}`);
  };

  const clearFilters = () => {
    const nextParams = new URLSearchParams();
    if (query) nextParams.set("q", query);
    setIsLoading(true);
    setVisibleCount(8);
    setSearchParams(nextParams);
  };

  const renderFilters = (mobile = false) => (
    <div className={`space-y-5 ${mobile ? "pt-4" : ""}`}>
      <FilterField
        label="Category"
        value={category}
        options={categories}
        onChange={(value) => updateParam("category", value)}
      />
      <FilterField
        label="Price"
        value={priceRange}
        options={PRICE_RANGES}
        onChange={(value) => updateParam("price", value)}
      />
      <FilterField
        label="Rating"
        value={minimumRating}
        options={RATING_OPTIONS}
        onChange={(value) => updateParam("rating", value)}
      />
      <div>
        <label
          htmlFor={`${mobile ? "mobile-" : ""}availability`}
          className="mb-2 block text-[10px] font-mono uppercase tracking-[0.2em] text-m4m-accent"
        >
          Availability
        </label>
        <select
          id={`${mobile ? "mobile-" : ""}availability`}
          value={availability}
          onChange={(event) => updateParam("availability", event.target.value)}
          className="w-full border border-m4m-border bg-white px-3 py-2.5 text-xs outline-none focus:border-[#111111]"
        >
          <option value="all">All products</option>
          <option value="in-stock">In stock only</option>
        </select>
      </div>
      {(category !== "all" ||
        priceRange !== "all" ||
        minimumRating !== "all" ||
        availability !== "all") && (
        <button
          type="button"
          onClick={clearFilters}
          className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-m4m-secondary hover:text-[#111111]"
        >
          <X className="h-3.5 w-3.5" /> Clear filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-m4m-bg px-4 py-10 font-sans text-[#111111] sm:px-6 md:py-16 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="border-b border-m4m-border pb-8">
          <span className="mb-2 block text-[10px] font-mono uppercase tracking-[0.3em] text-m4m-accent">
            Client portal / product discovery
          </span>
          <h1 className="font-serif text-3xl uppercase tracking-tight sm:text-4xl">
            {query ? `Search results for "${query}"` : "Search for products"}
          </h1>
          <form
            onSubmit={handleSearchSubmit}
            className="mt-6 flex max-w-3xl gap-2"
          >
            <label htmlFor="product-search" className="sr-only">
              Search products
            </label>
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-m4m-accent" />
              <input
                id="product-search"
                value={draftQuery}
                onChange={(event) => setDraftQuery(event.target.value)}
                placeholder="Search products, fabrics or categories"
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
          <p className="mt-4 text-xs font-mono text-m4m-secondary">
            {query
              ? `${filteredProducts.length} ${filteredProducts.length === 1 ? "product" : "products"} found for '${query}'`
              : "Enter a term to search the collection."}
          </p>
        </header>

        {toast && (
          <div
            className="border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900"
            role="status"
          >
            {toast}
          </div>
        )}

        <details className="border border-m4m-border bg-white p-4 lg:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-mono uppercase tracking-wider">
            <span className="inline-flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </span>
            <ChevronDown className="h-4 w-4" />
          </summary>
          {renderFilters(true)}
        </details>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <aside className="hidden lg:col-span-2 lg:block">
            <div className="sticky top-28 border border-m4m-border bg-white p-5">
              <div className="mb-5 flex items-center gap-2 border-b border-m4m-border pb-4">
                <Filter className="h-4 w-4" />
                <h2 className="text-xs font-mono uppercase tracking-wider">
                  Filter results
                </h2>
              </div>
              {renderFilters()}
            </div>
          </aside>
          <main className="lg:col-span-10">
            <div className="mb-5 flex flex-col gap-3 border-b border-m4m-border pb-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-m4m-secondary">
                Showing{" "}
                <span className="font-semibold text-[#111111]">
                  {Math.min(visibleCount, filteredProducts.length)}
                </span>{" "}
                of {filteredProducts.length}
              </p>
              <label
                className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-m4m-accent"
                htmlFor="sort-products"
              >
                Sort by
                <select
                  id="sort-products"
                  value={sort}
                  onChange={(event) => updateParam("sort", event.target.value)}
                  className="border border-m4m-border bg-white px-3 py-2 text-xs font-sans normal-case tracking-normal text-[#111111] outline-none focus:border-[#111111]"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {isLoading ? (
              <div className="border border-m4m-border bg-white p-16 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#111111] border-t-transparent" />
                <p className="mt-4 text-xs font-mono uppercase tracking-widest text-m4m-accent">
                  Searching products...
                </p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="border border-m4m-border bg-white p-10 text-center sm:p-16">
                <AlertCircle className="mx-auto h-8 w-8 text-m4m-accent" />
                <h2 className="mt-4 font-serif text-2xl uppercase">
                  No products found
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-m4m-secondary">
                  Check your spelling, try another search term, or browse the
                  collection by category.
                </p>
                <Link
                  to="/"
                  className="mt-6 inline-flex border border-[#111111] px-5 py-3 text-xs font-mono uppercase tracking-wider hover:bg-[#111111] hover:text-m4m-bg"
                >
                  Browse categories
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  {filteredProducts.slice(0, visibleCount).map((product) => (
                    <ProductCard
                      key={product.id || product._id}
                      product={product}
                      onQuickView={handleProductOpen}
                      onShowToast={setToast}
                    />
                  ))}
                </div>
                {visibleCount < filteredProducts.length && (
                  <div className="mt-8 text-center">
                    <button
                      type="button"
                      onClick={() => setVisibleCount((count) => count + 8)}
                      className="border border-[#111111] px-6 py-3 text-xs font-mono uppercase tracking-wider hover:bg-[#111111] hover:text-m4m-bg"
                    >
                      Load more products
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

const FilterField = ({ label, value, options, onChange }) => (
  <div>
    <label className="mb-2 block text-[10px] font-mono uppercase tracking-[0.2em] text-m4m-accent">
      {label}
    </label>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full border border-m4m-border bg-white px-3 py-2.5 text-xs outline-none focus:border-[#111111]"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default SearchResults;
