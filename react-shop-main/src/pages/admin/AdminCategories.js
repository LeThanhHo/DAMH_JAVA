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
import Layout from '../../components/layout/AdminLayout'; // Đổi tên thành AdminLayout cho nhất quán
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import categoryService from '../../services/categoryService';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaLayerGroup, // Icon cho Category
} from 'react-icons/fa';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  
  // (MỚI) Thêm state cho thông báo thành công (ví dụ: khi xóa)
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(''); // Xóa lỗi cũ khi tải lại
      setSuccess(''); // Xóa thông báo thành công cũ
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (err) {
      setError('Không thể tải danh sách Category. Vui lòng thử lại.');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name || '',
        description: category.description || '',
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '' });
    }
    setFormError('');
    setFormSuccess('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
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
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, formData);
        setFormSuccess('✅ Category đã được cập nhật thành công!');
      } else {
        await categoryService.createCategory(formData);
        setFormSuccess('✅ Category mới đã được thêm thành công!');
      }

      setTimeout(() => {
        handleCloseModal();
        fetchCategories();
      }, 1000);
    } catch (err) {
      setFormError('❌ Có lỗi xảy ra. Vui lòng thử lại.');
      console.error('Error saving category:', err);
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa Category này?')) {
      try {
        await categoryService.deleteCategory(categoryId);
        setError(''); // Xóa lỗi (nếu có)
        setSuccess('✅ Xóa Category thành công!'); // (MỚI) Đặt thông báo thành công
        fetchCategories();
      } catch (err) {
        setSuccess(''); // Xóa thành công (nếu có)
        setError('Không thể xóa Category. Vui lòng thử lại.');
        console.error('Error deleting category:', err);
      }
    }
  };

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
              <FaLayerGroup className="me-2" />
              Quản lý Categories
            </h3>
          </Col>
          <Col xs="auto">
            <Button
              as={Link}
              to="/admin" // Giả sử đây là link dashboard của bạn
              variant="outline-secondary"
              className="me-2"
            >
              <FaArrowLeft className="me-1" />
              Về Dashboard
            </Button>
            <Button variant="primary" onClick={() => handleShowModal()}>
              <FaPlus className="me-1" />
              Thêm Category
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
                <h5 className="mb-0 fw-semibold">Danh sách Category</h5>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <Table
                    hover
                    striped // (THAY ĐỔI) Dùng sọc cho dễ nhìn
                    className="align-middle text-start" // (THAY ĐỔI) Canh lề trái
                  >
                    <thead>
                      <tr>
                        <th width="10%">ID</th>
                        <th width="25%">Tên Category</th>
                        <th>Mô tả</th>
                        <th width="20%" className="text-center"> {/* Chỉ canh giữa cột này */}
                          Hành động
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.length > 0 ? (
                        categories.map((category) => (
                          <tr key={category.id}>
                            <td>
                              {/* (THAY ĐỔI) Dùng badge kiểu pill nhẹ nhàng hơn */}
                              <Badge
                                bg="secondary-subtle"
                                text="dark"
                                pill
                                className="px-3 py-2"
                              >
                                #{category.id}
                              </Badge>
                            </td>
                            <td className="fw-semibold">{category.name}</td>
                            <td>
                              {category.description || (
                                <em className="text-muted">Không có mô tả</em>
                              )}
                            </td>
                            <td className="text-center"> {/* Canh giữa các nút */}
                              <Button
                                variant="warning"
                                size="sm"
                                className="me-2"
                                onClick={() => handleShowModal(category)}
                              >
                                <FaEdit className="me-1" /> Sửa
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDelete(category.id)}
                              >
                                <FaTrash className="me-1" /> Xóa
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        // (THAY ĐỔI) Giao diện khi không có dữ liệu
                        <tr>
                          <td
                            colSpan={4}
                            className="text-center text-muted py-4"
                          >
                            <FaLayerGroup size={30} className="mb-2" />
                            <p className="mb-0">Chưa có Category nào.</p>
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

        {/* Modal Thêm / Sửa Category (Giữ nguyên logic, chỉ đổi icon) */}
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold text-primary">
              {editingCategory ? (
                <>
                  <FaEdit className="me-2" /> Sửa Category
                </>
              ) : (
                <>
                  <FaPlus className="me-2" /> Thêm Category
                </>
              )}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {formError && <Alert variant="danger">{formError}</Alert>}
            {formSuccess && <Alert variant="success">{formSuccess}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Tên Category</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Nhập tên category (VD: Xe đạp địa hình, Phụ kiện...)"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Mô tả</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Thêm mô tả cho category..."
                />
              </Form.Group>

              <div className="d-flex justify-content-end">
                <Button
                  variant="outline-secondary"
                  className="me-2"
                  onClick={handleCloseModal}
                >
                  Hủy
                </Button>
                <Button variant="primary" type="submit">
                  {editingCategory ? 'Cập nhật' : 'Tạo mới'}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </Layout>
  );
};

export default AdminCategories;