import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import ProductList from '../../components/products/ProductList';
import CategoryList from '../../components/products/CategoryList';
import { useProduct } from '../../contexts/ProductContext';

const HomePage = () => {
 const { categories, loading, error, getProductsByCategory } = useProduct();
  const [filteredProducts, setFilteredProducts] = useState([]);
const [selectedCategory, setSelectedCategory] = useState(null);
 
 // State riêng cho việc tải sản phẩm
 const [loadingProducts, setLoadingProducts] = useState(false);
const [productError, setProductError] = useState(null);

 // Định nghĩa hàm load để dùng ở 2 nơi
 const loadProducts = useCallback(async (categoryId) => {
 try {
 setLoadingProducts(true);
 setProductError(null); // Xóa lỗi cũ
 const products = await getProductsByCategory(categoryId);
 setFilteredProducts(products);
 } catch (err) {
 console.error('Error loading products:', err);
 setProductError('Không thể tải danh sách sản phẩm. Vui lòng thử lại.');
 } finally {
setLoadingProducts(false);
 }
 }, [getProductsByCategory]); // Phụ thuộc vào hàm từ context

// Load initial products (all)
 useEffect(() => {
 // Tải sản phẩm ban đầu (categoryId = null)
 loadProducts(null);
}, [loadProducts]); // Chỉ chạy khi loadProducts (useCallback) thay đổi

 // Xử lý khi chọn danh mục
 const handleCategorySelect = (categoryId) => {
 setSelectedCategory(categoryId);
 loadProducts(categoryId); // Gọi hàm load đã được định nghĩa
 };

// Lỗi chính (ví dụ: không tải được danh mục)
 if (loading) return <Layout><Loading /></Layout>;
 if (error) return <Layout><ErrorMessage message={error} /></Layout>;

  // Hàm render nội dung sản phẩm
 const renderProductContent = () => {
 if (loadingProducts) {
 return <Loading />;
 }
 if (productError) {
 return <ErrorMessage message={productError} />;
 }
    if (filteredProducts.length === 0) {
      return <p>Không tìm thấy sản phẩm nào.</p>;
    }
 return <ProductList products={filteredProducts} />;
 };

  // Lấy tên danh mục đang được chọn để hiển thị tiêu đề
 const getCategoryName = () => {
 if (selectedCategory === null) {
 return 'Tất cả sản phẩm';
 }
 const category = categories.find(c => c.id === selectedCategory);
 return category ? category.name : 'Sản phẩm';
};

 return (
 <Layout>
 <div className="hero-section mb-5 text-center p-5 bg-light rounded">
 <h1>Chào mừng đến React Shop</h1>
 <p className="lead">Khám phá sản phẩm chất lượng với giá cả cạnh tranh</p>
 <Link to="/products" className="btn btn-primary btn-lg">Xem tất cả</Link>
 </div>

<Row>
 <Col md={3}>
 <h3 className="mb-3">Danh mục</h3>
 <CategoryList 
 categories={categories} 
 activeCategory={selectedCategory} 
 onSelectCategory={handleCategorySelect} 
/>
 </Col>
<Col md={9}>
 <h2 className="mb-4">
 {getCategoryName()}
 </h2>
 {renderProductContent()}
</Col>
 </Row>
 </Layout>
 );
};

export default HomePage;