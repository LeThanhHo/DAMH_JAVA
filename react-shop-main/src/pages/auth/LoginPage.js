import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Form,
  Button,
  Card,
  Alert,
  Container, // (MỚI) Thêm
  Row,       // (MỚI) Thêm
  Col,       // (MỚI) Thêm
  InputGroup, // (MỚI) Thêm
  Spinner,   // (MỚI) Thêm
} from 'react-bootstrap';
import Layout from '../../components/layout/Layout';
import authService from '../../services/authService';
import { useCart } from '../../contexts/CartContext';
import { ROUTES } from '../../utils/constants';
import { FaUser, FaLock } from 'react-icons/fa'; // (MỚI) Thêm icons

const LoginPage = () => {
  // ==========================================
  // PHẦN LOGIC CỦA BẠN - GIỮ NGUYÊN HOÀN TOÀN
  // ==========================================
  const navigate = useNavigate();
  const location = useLocation();
  const { syncCartOnLogin } = useCart();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from || ROUTES.ADMIN_DASHBOARD;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate form
      if (!formData.username || !formData.password) {
        throw new Error('Please enter both username and password');
      }

      // Attempt login
      await authService.login(formData);

      // Sync local cart with server cart after successful login
      await syncCartOnLogin();

      // Redirect to the page they were trying to access or home
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };
  // ==========================================
  // KẾT THÚC PHẦN LOGIC
  // ==========================================

  // === (THIẾT KẾ LẠI GIAO DIỆN TỪ ĐÂY) ===
  return (
    <Layout>
      <Container>
        <Row className="justify-content-center my-5">
          <Col md={10} lg={8} xl={6}>
            <Card className="shadow border-0">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <h3 className="fw-bold text-primary">Đăng nhập</h3>
                  <p className="text-muted">Chào mừng bạn trở lại!</p>
                </div>

                {/* Phần Alert giữ nguyên */}
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      Tên đăng nhập
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FaUser />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Nhập tên đăng nhập" // (SỬA) Tiếng Việt
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Mật khẩu</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FaLock />
                      </InputGroup.Text>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Nhập mật khẩu" // (SỬA) Tiếng Việt
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  <div className="d-grid gap-2">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={loading}
                      size="lg" // (SỬA) Nút to hơn
                    >
                      {loading ? (
                        // (SỬA) Dùng Spinner
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Đang đăng nhập...
                        </>
                      ) : (
                        'Đăng nhập' // (SỬA) Tiếng Việt
                      )}
                    </Button>
                  </div>
                </Form>

                <div className="mt-4 text-center">
                  <p className="mb-0 text-muted">
                    Chưa có tài khoản?{' '}
                    <Link to={ROUTES.REGISTER}>Đăng ký ngay</Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default LoginPage;