import React, { useState, useEffect } from 'react';
import {
  Container,
  Button,
  Modal,
  Form,
  Alert,
  Table,
  Badge,
  Card,
  Row, // Thêm Row
  Col, // Thêm Col
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/AdminLayout';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import { useProduct } from '../../contexts/ProductContext';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaBicycle, // (THAY ĐỔI) Dùng icon xe đạp
} from 'react-icons/fa';

const AdminProducts = () => {
  const { refreshData: refreshGlobalData } = useProduct();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // (MỚI) Thêm state cho thông báo thành công
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nameProduct: '',
    descriptionProduct: '',
    priceProduct: '',
    brand: '',
    quantity: '',
    imageUrl: '',
    categoryId: '',
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess(''); // (MỚI) Xóa thông báo cũ
      const [productsData, categoriesData] = await Promise.all([
        productService.getAllProducts(),
        categoryService.getAllCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || 'Không thể tải dữ liệu. Vui lòng thử lại.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        nameProduct: product.nameProduct || '',
        descriptionProduct: product.descriptionProduct || '',
        priceProduct: product.priceProduct || '',
        quantity: product.quantity || '',
        brand: product.brand || '',
        categoryId: product.category?.id || '',
        imageUrl: product.imageUrl || '',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        nameProduct: '',
        descriptionProduct: '',
        priceProduct: '',
        quantity: '',
        brand: '',
        categoryId: '',
        imageUrl: '',
      });
    }
    setFormError('');
    setFormSuccess('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormError('');
    setFormSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    try {
      const productData = {
        nameProduct: formData.nameProduct,
        descriptionProduct: formData.descriptionProduct,
        priceProduct: parseFloat(formData.priceProduct),
        quantity: parseInt(formData.quantity),
        brand: formData.brand,
        imageUrl: formData.imageUrl,
        category: formData.categoryId
          ? { id: parseInt(formData.categoryId) }
          : null,
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, productData);
        setFormSuccess('✅ Sản phẩm đã được cập nhật thành công!');
      } else {
        await productService.createProduct(productData);
        setFormSuccess('✅ Sản phẩm mới đã được thêm thành công!');
      }

      setTimeout(async () => {
        handleCloseModal();
        await Promise.all([fetchData(), refreshGlobalData()]);
      }, 1000);
    } catch (err) {
      setFormError(err.message || '❌ Có lỗi xảy ra. Vui lòng thử lại.');
      console.error('Error saving product:', err);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await productService.deleteProduct(productId);
        setError('');
        setSuccess('✅ Xóa sản phẩm thành công!'); // (MỚI) Đặt thông báo
        await Promise.all([fetchData(), refreshGlobalData()]);
      } catch (err) {
        setSuccess('');
        setError(err.message || 'Không thể xóa sản phẩm. Vui lòng thử lại.');
        console.error('Error deleting product:', err);
      }
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);

  if (loading)
    return (
      <Layout>
        <Loading />
      </Layout>
    );

  // === (THIẾT KẾ LẠI GIAO DIỆN TỪ ĐÂY) ===
  return (
    <Layout>
      <Container fluid className="p-4">
        {/* 1. Tiêu đề trang và các nút hành động */}
        <Row className="mb-4 align-items-center">
          <Col>
            <h3 className="fw-bold mb-0 text-primary">
              <FaBicycle className="me-2" />
              Quản lý Sản phẩm
            </h3>
          </Col>
          <Col xs="auto">
            <Button
              as={Link}
              to="/admin"
              variant="outline-secondary"
              className="me-2"
            >
              <FaArrowLeft className="me-1" />
              Về Dashboard
            </Button>
            <Button variant="primary" onClick={() => handleShowModal()}>
              <FaPlus className="me-1" /> Thêm sản phẩm
            </Button>
          </Col>
        </Row>

        {/* 2. Khu vực hiển thị thông báo (Lỗi hoặc Thành công) */}
        {error && <ErrorMessage message={error} />}
        {success && <Alert variant="success">{success}</Alert>}

        {/* 3. Bảng dữ liệu được bọc trong Card */}
        <Row>
          <Col>
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-white border-bottom-0 py-3">
                <h5 className="mb-0 fw-semibold">Danh sách Sản phẩm</h5>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <Table
                    hover
                    striped // (THAY ĐỔI)
                    className="align-middle text-start" // (THAY ĐỔI)
                  >
                    <thead /*className="table-primary"*/>
                      <tr>
                        <th>ID</th>
                        <th>Ảnh</th>
                        <th width="25%">Tên sản phẩm</th>
                        <th>Thương hiệu</th>
                        <th className="text-end">Giá</th>
                        <th className="text-center">Số lượng</th>
                        <th>Danh mục</th>
                        <th className="text-center">Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.length > 0 ? (
                        products.map((p) => (
                          <tr key={p.id}>
                            <td>
                              <Badge
                                bg="secondary-subtle"
                                text="dark"
                                pill
                                className="px-3 py-2"
                              >
                                #{p.id}
                              </Badge>
                            </td>
                            <td>
                              {p.imageUrl ? (
                                <img
                                  src={p.imageUrl}
                                  alt={p.nameProduct}
                                  style={{
                                    width: '55px',
                                    height: '55px',
                                    borderRadius: '8px',
                                    objectFit: 'cover',
                                  }}
                                />
                              ) : (
                                <div
                                  className="d-flex align-items-center justify-content-center bg-light text-muted"
                                  style={{
                                    width: '55px',
                                    height: '55px',
                                    borderRadius: '8px',
                                  }}
                                >
                                  N/A
                                </div>
                              )}
                            </td>
                            <td className="fw-semibold">{p.nameProduct}</td>
                            <td>{p.brand || 'N/A'}</td>
                            <td className="text-end">
                              {formatPrice(p.priceProduct)}
                            </td>
                            <td className="text-center">
                              <Badge
                                bg={
                                  p.quantity > 10
                                    ? 'success'
                                    : p.quantity > 0
                                    ? 'warning'
                                    : 'danger'
                                }
                                pill
                              >
                                {p.quantity}
                              </Badge>
                            </td>
                            <td>{p.category?.name || 'Không có'}</td>
                            <td className="text-center">
                              <Button
                                variant="warning"
                                size="sm"
                                className="me-2"
                                onClick={() => handleShowModal(p)}
                              >
                                <FaEdit className="me-1" /> Sửa
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDelete(p.id)}
                              >
                                <FaTrash className="me-1" /> Xóa
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={8}
                            className="text-center text-muted py-4"
                          >
                            <FaBicycle size={30} className="mb-2" />
                            <p className="mb-0">Chưa có sản phẩm nào.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Modal thêm/sửa sản phẩm (THIẾT KẾ LẠI FORM) */}
        <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold text-primary">
              {editingProduct ? '✏️ Sửa Sản phẩm' : '➕ Thêm Sản phẩm'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {formError && <Alert variant="danger">{formError}</Alert>}
            {formSuccess && <Alert variant="success">{formSuccess}</Alert>}

            <Form onSubmit={handleSubmit}>
              {/* Hàng 1: Tên và Thương hiệu */}
              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      Tên sản phẩm
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="nameProduct"
                      value={formData.nameProduct}
                      onChange={handleInputChange}
                      required
                      placeholder="VD: Xe đạp địa hình Giant X"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      Thương hiệu
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      placeholder="VD: Giant"
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Hàng 2: Giá, Số lượng, Danh mục */}
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Giá</Form.Label>
                    <Form.Control
                      type="number"
                      name="priceProduct"
                      value={formData.priceProduct}
                      onChange={handleInputChange}
                      required
                      min="0"
                      placeholder="VD: 15000000"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Số lượng kho</Form.Label>
                    <Form.Control
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      required
                      min="0"
                      placeholder="VD: 50"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Danh mục</Form.Label>
                    <Form.Select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Chọn category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {/* Hàng 3: URL Hình ảnh */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">URL hình ảnh</Form.Label>
                <Form.Control
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </Form.Group>

              {/* Hàng 4: Mô tả */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Mô tả</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="descriptionProduct"
                  value={formData.descriptionProduct}
                  onChange={handleInputChange}
                  placeholder="Mô tả chi tiết sản phẩm..."
                />
              </Form.Group>

              {/* Nút bấm */}
              <div className="d-flex justify-content-end border-top pt-3">
                <Button
                  variant="outline-secondary"
                  className="me-2"
                  onClick={handleCloseModal}
                >
                  Hủy
                </Button>
                <Button variant="primary" type="submit">
                  {editingProduct ? 'Cập nhật' : 'Tạo mới'}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </Layout>
  );
};

export default AdminProducts;