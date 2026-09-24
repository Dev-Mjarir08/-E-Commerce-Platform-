import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import productApi from '../services/productApi';
import { categoryService } from '../services/categoryService';
import { products as fallbackProducts } from '../data/products';
import { categories as fallbackCategories } from '../data/categories';

const ShopDataContext = createContext(null);

export const ShopDataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initial load of catalog data
  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [productRes, categoryRes] = await Promise.allSettled([
        productApi.getProducts({ limit: 100 }),
        categoryService.getCategories()
      ]);

      if (productRes.status === 'fulfilled' && (productRes.value?.data || productRes.value?.products)) {
        setProducts(productRes.value.data || productRes.value.products);
      } else {
        setProducts(fallbackProducts);
      }

      if (categoryRes.status === 'fulfilled' && Array.isArray(categoryRes.value)) {
        setCategories(categoryRes.value);
      } else {
        setCategories(fallbackCategories);
      }
    } catch (err) {
      console.warn('Initial shop data loading fallback:', err);
      setProducts(fallbackProducts);
      setCategories(fallbackCategories);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Fast lookup helpers
  const getProductById = useCallback((id) => {
    if (!id) return null;
    return products.find((p) => p.id === id || p._id === id || p.slug === id) || null;
  }, [products]);

  const featuredProducts = useMemo(() => {
    return products.filter((p) => p.isFeatured || p.isBestSeller || p.badge === 'Bestseller' || p.badge === 'New');
  }, [products]);

  const value = useMemo(() => ({
    products,
    categories,
    featuredProducts,
    loading,
    error,
    refreshData: loadInitialData,
    getProductById
  }), [products, categories, featuredProducts, loading, error, loadInitialData, getProductById]);

  return (
    <ShopDataContext.Provider value={value}>
      {children}
    </ShopDataContext.Provider>
  );
};

export const useShopData = () => {
  const context = useContext(ShopDataContext);
  if (!context) {
    throw new Error('useShopData must be used within a ShopDataProvider');
  }
  return context;
};

export default ShopDataContext;
