import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Modal,
  Form,
  Alert,
  Table,
  Badge,
  Card,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../components/layout/AdminLayout";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import userService from "../../services/userService";
import { FaPlus, FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "USER",
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 Lấy danh sách người dùng
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError("Không thể tải danh sách người dùng");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Mở modal thêm / sửa user
  const handleShowModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username || "",
        email: user.email || "",
        password: "",
        role: user.role || "USER",
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: "",
        email: "",
        password: "",
        role: "USER",
      });
    }
    setFormError("");
    setFormSuccess("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormError("");
    setFormSuccess("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 Lưu user (thêm mới hoặc cập nhật)
  // Trong handleSubmit @ AdminUser.js
  const handleSubmit = async (e) => {
    // ...
    try {
      if (editingUser) {
        // Tạo đối tượng dữ liệu chỉ chứa các trường cần cập nhật
        const dataToUpdate = {
          username: formData.username,
          email: formData.email,
          role: formData.role,
        };

        // CHỈ THÊM PASSWORD NẾU NGƯỜI DÙNG THỰC SỰ NHẬP MẬT KHẨU MỚI
        if (formData.password) {
          dataToUpdate.password = formData.password;
        }

        // Gọi service với dữ liệu đã lọc
        await userService.updateUser(editingUser.id, dataToUpdate);
        setFormSuccess("✅ Cập nhật người dùng thành công!");
      } else {
        // Logic tạo mới giữ nguyên
        await userService.register(formData);
        setFormSuccess("✅ Thêm người dùng mới thành công!");
      }
      // ...
    } catch (err) {
      // ...
    }
  };
  // 🔹 Xóa người dùng
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        await userService.deleteUser(id);
        fetchUsers();
      } catch (err) {
        alert("Không thể xóa người dùng này.");
        console.error(err);
      }
    }
  };

  if (loading)
    return (
      <Layout>
        <Loading />
      </Layout>
    );

  return (
    <Layout>
      <Container>
        <Card className="shadow-sm p-4 mt-3">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold text-primary mb-0">👥 Quản lý Người dùng</h3>
            <div>
              <Button
                as={Link}
                to="/admin"
                variant="outline-secondary"
                className="me-2"
              >
                <FaArrowLeft className="me-2" /> Dashboard
              </Button>
              <Button variant="primary" onClick={() => handleShowModal()}>
                <FaPlus className="me-2" /> Thêm người dùng
              </Button>
            </div>
          </div>

          {error && <ErrorMessage message={error} />}

          <div className="table-responsive">
            <Table bordered hover className="align-middle text-center">
              <thead className="table-primary">
                <tr>
                  <th>ID</th>
                  <th>Tên đăng nhập</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <Badge bg="secondary">{u.id}</Badge>
                      </td>
                      <td className="fw-semibold">{u.username}</td>
                      <td>{u.email}</td>
                      <td>
                        <Badge bg={u.role === "ADMIN" ? "danger" : "info"}>
                          {u.role}
                        </Badge>
                        {/* <Badge bg={u.role === "USER" ? "danger" : "info"}>
                            {u.role}
                          </Badge> */}
                      </td>
                      <td>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleShowModal(u)}
                        >
                          <FaEdit /> Sửa
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(u.id)}
                        >
                          <FaTrash /> Xóa
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-3 text-muted">
                      Chưa có người dùng nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card>

        {/* Modal thêm/sửa user */}
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold text-primary">
              {editingUser ? "✏️ Sửa Người dùng" : "➕ Thêm Người dùng"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {formError && <Alert variant="danger">{formError}</Alert>}
            {formSuccess && <Alert variant="success">{formSuccess}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Tên đăng nhập</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              {!editingUser && (
                <Form.Group className="mb-3">
                  <Form.Label>Mật khẩu</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Vai trò</Form.Label>
                <Form.Select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </Form.Select>
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
                  {editingUser ? "Cập nhật" : "Tạo mới"}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </Layout>
  );
};

export default AdminUser;
