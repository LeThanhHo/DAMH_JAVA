import React, { useState, useEffect, useCallback } from "react";
import { Row, Col } from "react-bootstrap";
import Layout from "../../components/layout/Layout";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import ProductList from "../../components/products/ProductList";
import CategoryList from "../../components/products/CategoryList";
import { useProduct } from "../../contexts/ProductContext";

const HomePage = () => {
  const { categories, loading, error, getProductsByCategory, getProductsNewest, getProductsBestSeller } = useProduct();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productError, setProductError] = useState(null);

  const [newestProducts, setNewestProducts] = useState([]);

  // --- Kiểm tra login từ localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    setIsLoggedIn(!!userStr);
  }, []);

  // --- Lấy sản phẩm mới nhất và bán chạy nhất
  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const newest = await getProductsNewest();
        setNewestProducts(newest);

      } catch (err) {
        console.error("Error fetching featured products:", err);
      }
    };
    loadFeatured();
  }, [getProductsNewest, getProductsBestSeller]);

  // --- Load sản phẩm theo danh mục
  const loadProducts = useCallback(
    async (categoryId) => {
      try {
        setLoadingProducts(true);
        setProductError(null);
        const products = await getProductsByCategory(categoryId);
        setFilteredProducts(products);
      } catch (err) {
        console.error(err);
        setProductError("Không thể tải danh sách sản phẩm.");
      } finally {
        setLoadingProducts(false);
      }
    },
    [getProductsByCategory]
  );

  useEffect(() => {
    loadProducts(null);
  }, [loadProducts]);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    loadProducts(categoryId);
  };

  const renderProductContent = () => {
    if (loadingProducts) return <Loading />;
    if (productError) return <ErrorMessage message={productError} />;
    if (filteredProducts.length === 0) return <p>Không tìm thấy sản phẩm nào.</p>;
    return <ProductList products={filteredProducts} isLoggedIn={isLoggedIn} />;
  };

  const getCategoryName = () => {
    if (!selectedCategory) return "Tất cả sản phẩm";
    const category = categories.find((c) => c.id === selectedCategory);
    return category ? category.name : "Sản phẩm";
  };

  if (loading) return <Layout><Loading /></Layout>;
  if (error) return <Layout><ErrorMessage message={error} /></Layout>;

  return (
    <Layout>
      {/* Danh mục & sản phẩm theo danh mục */}
      <Row className="mb-5">
        <Col md={3}>
          <h3 className="mb-3">Danh mục</h3>
          <CategoryList
            categories={categories}
            activeCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        </Col>
        <Col md={9}>
          <h2 className="mb-4">{getCategoryName()}</h2>
          {renderProductContent()}
        </Col>
      </Row>

      {/* Sản phẩm mới nhất */}
      <h2 className="mb-3">🌟 Sản phẩm mới nhất</h2>
      {newestProducts.length === 0 ? <Loading /> : <ProductList products={newestProducts} isLoggedIn={isLoggedIn} />}

     
    </Layout>
  );
};

export default HomePage;
