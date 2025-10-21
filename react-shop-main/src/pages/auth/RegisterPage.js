import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Form,
  Button,
  Card,
  Alert,
  Container, // (MỚI) Thêm Container
  Row,       // (MỚI) Thêm Row
  Col,       // (MỚI) Thêm Col
  InputGroup, // (MỚI) Thêm InputGroup
  Spinner,   // (MỚI) Thêm Spinner
} from 'react-bootstrap';
import Layout from '../../components/layout/Layout';
import userService from '../../services/userService';
import { ROUTES } from '../../utils/constants';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa'; // (MỚI) Thêm icons

const RegisterPage = ({ isAdmin = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      throw new Error('Vui lòng điền đầy đủ các trường'); // (SỬA) Tiếng Việt
    }

    if (formData.password !== formData.confirmPassword) {
      throw new Error('Mật khẩu xác nhận không khớp'); // (SỬA) Tiếng Việt
    }

    if (formData.password.length < 6) {
      throw new Error('Mật khẩu phải có ít nhất 6 ký tự'); // (SỬA) Tiếng Việt
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      throw new Error('Vui lòng nhập một địa chỉ email hợp lệ'); // (SỬA) Tiếng Việt
    }
  };

  // === (SỬA LỖI LOGIC: Gộp 2 hàm handleSubmit thành 1) ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Validate form
      validateForm();

      // 2. Chuẩn bị dữ liệu
      const registrationData = {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };

      // 3. Gọi API dựa trên vai trò
      if (isAdmin) {
        await userService.registerAdmin(registrationData);
        // Nếu admin tạo, quay về trang user list
        navigate('/admin/users', {
          state: { message: 'Tạo tài khoản thành công!' },
        });
      } else {
        await userService.register(registrationData);
        // Nếu người dùng tự đăng ký, chuyển đến trang đăng nhập
        navigate(ROUTES.LOGIN, {
          state: { message: 'Đăng ký thành công! Vui lòng đăng nhập.' },
        });
      }
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  // === (THIẾT KẾ LẠI GIAO DIỆN) ===
  return (
    <Layout>
      <Container>
        <Row className="justify-content-center my-5">
          <Col md={10} lg={8} xl={6}>
            <Card className="shadow border-0">
              {/* Bỏ Card.Header, dùng tiêu đề trong Card.Body */}
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <h3 className="fw-bold text-primary">
                    {isAdmin ? 'Tạo tài khoản Admin' : 'Đăng ký tài khoản'}
                  </h3>
                  <p className="text-muted">
                    {isAdmin
                      ? 'Tạo một tài khoản quản trị mới'
                      : 'Chào mừng bạn! Vui lòng điền thông tin bên dưới.'}
                  </p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Tên đăng nhập</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FaUser />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Chọn tên đăng nhập"
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Email</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FaEnvelope />
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Nhập email của bạn"
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-3">
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
                        placeholder="Tạo mật khẩu"
                        required
                      />
                    </InputGroup>
                    <Form.Text className="text-muted">
                      Mật khẩu phải có ít nhất 6 ký tự.
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">
                      Xác nhận Mật khẩu
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FaLock />
                      </InputGroup.Text>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Nhập lại mật khẩu"
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  <div className="d-grid gap-2">
                    <Button
                      variant={isAdmin ? 'danger' : 'primary'}
                      type="submit"
                      disabled={loading}
                      size="lg" // Nút to hơn
                    >
                      {loading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Đang xử lý...
                        </>
                      ) : isAdmin ? (
                        'Tạo tài khoản'
                      ) : (
                        'Đăng ký'
                      )}
                    </Button>
                  </div>
                </Form>

                {!isAdmin && (
                  <div className="mt-4 text-center">
                    <p className="mb-0 text-muted">
                      Đã có tài khoản?{' '}
                      <Link to={ROUTES.LOGIN}>Đăng nhập ngay</Link>
                    </p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default RegisterPage;