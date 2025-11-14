import React, { createContext, useState, useContext, useEffect } from 'react';
import categoryService from '../services/categoryService';
import productService from '../services/productService';

const ProductContext = createContext();

export const useProduct = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch categories and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const [categoriesData, productsData] = await Promise.all([
          categoryService.getAllCategories(),
          productService.getAllProducts()
        ]);
        setCategories(categoriesData);
        setProducts(productsData);
      } catch (err) {
        setError(err.message || 'Không thể tải dữ liệu. Vui lòng thử lại.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Lấy sản phẩm theo danh mục
  const getProductsByCategory = async (categoryId) => {
    try {
      if (!categoryId) return products;

      const selectedCat = categories.find(c => c.id === categoryId);
      if (selectedCat?.productIds?.length > 0) {
        return await Promise.all(
          selectedCat.productIds.map(id => productService.getProductById(id))
        );
      }
      return [];
    } catch (err) {
      console.error('Error getting products by category:', err);
      throw new Error('Không thể tải sản phẩm theo danh mục.');
    }
  };

  // Lấy sản phẩm mới nhất (top 3)
const getProductsNewest = async () => {
  try {
    if (!products || products.length === 0) return [];

    // Sort tăng dần theo createdAt (cũ → mới)
    const sorted = [...products].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Lấy 10 sản phẩm mới nhất (tức là 10 cuối cùng trong danh sách cũ → mới)
    return sorted.slice(-5);
  } catch (err) {
    console.error('Error getting newest products:', err);
    throw new Error('Không thể tải sản phẩm mới nhất.');
  }
};
  // Làm mới dữ liệu
  const refreshData = async () => {
    try {
      setLoading(true);
      const [categoriesData, productsData] = await Promise.all([
        categoryService.getAllCategories(),
        productService.getAllProducts()
      ]);
      setCategories(categoriesData);
      setProducts(productsData);
    } catch (err) {
      console.error('Error refreshing data:', err);
      throw new Error('Không thể làm mới dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    categories,
    products,
    loading,
    error,
    getProductsByCategory,
    getProductsNewest,
    refreshData
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
