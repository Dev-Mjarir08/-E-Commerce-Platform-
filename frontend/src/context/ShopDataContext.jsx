import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import productApi from '../services/productApi';
import { categoryService } from '../services/categoryService';
import storeService from '../services/storeService';

const ShopDataContext = createContext(null);

const getStoredProducts = () => {
  try {
    const raw = localStorage.getItem('ecommerce_admin_products');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return [];
};

export const ShopDataProvider = ({ children }) => {
  const [products, setProducts] = useState(getStoredProducts);
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initial load of live catalog data from MongoDB
  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [productRes, categoryRes, storeRes] = await Promise.allSettled([
        productApi.getProducts({ limit: 100 }),
        categoryService.getCategories(),
        storeService.getStores({ limit: 20 })
      ]);

      if (productRes.status === 'fulfilled') {
        const prodList = productRes.value?.data || productRes.value?.products || [];
        const validProdList = Array.isArray(prodList) ? prodList : [];
        const localList = getStoredProducts();

        const mergedMap = new Map();
        localList.forEach((p) => {
          const key = p._id || p.id || p.sku;
          if (key) mergedMap.set(String(key), p);
        });
        validProdList.forEach((p) => {
          const key = p._id || p.id || p.sku;
          if (key) mergedMap.set(String(key), p);
        });

        const combined = Array.from(mergedMap.values());
        setProducts(combined.length > 0 ? combined : validProdList);
      } else {
        const localList = getStoredProducts();
        if (localList.length > 0) {
          setProducts(localList);
        }
      }

      if (categoryRes.status === 'fulfilled') {
        const catList = Array.isArray(categoryRes.value)
          ? categoryRes.value
          : (categoryRes.value?.data || categoryRes.value?.categories || []);
        setCategories(Array.isArray(catList) ? catList : []);
      } else {
        setCategories([]);
      }

      if (storeRes.status === 'fulfilled') {
        const storeList = storeRes.value || [];
        setStores(Array.isArray(storeList) ? storeList : []);
      } else {
        setStores([]);
      }
    } catch (err) {
      console.warn('Initial shop data loading error:', err);
      setError(err);
      const localList = getStoredProducts();
      if (localList.length > 0) {
        setProducts(localList);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();

    const handleUpdate = () => {
      loadInitialData();
    };

    window.addEventListener('shop:products-updated', handleUpdate);
    window.addEventListener('focus', handleUpdate);

    return () => {
      window.removeEventListener('shop:products-updated', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
    };
  }, [loadInitialData]);

  // Fast lookup helpers
  const getProductById = useCallback((id) => {
    if (!id) return null;
    return products.find((p) => p.id === id || p._id === id || p.slug === id) || null;
  }, [products]);

  const featuredProducts = useMemo(() => {
    const list = products.filter((p) => p.isFeatured || p.isBestSeller || p.badge === 'Bestseller' || p.badge === 'New');
    return list.length > 0 ? list : products.slice(0, 8);
  }, [products]);

  const value = useMemo(() => ({
    products,
    categories,
    stores,
    featuredProducts,
    loading,
    error,
    refreshData: loadInitialData,
    getProductById
  }), [products, categories, stores, featuredProducts, loading, error, loadInitialData, getProductById]);

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
