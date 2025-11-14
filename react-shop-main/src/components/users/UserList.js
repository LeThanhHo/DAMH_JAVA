// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Button,
//   Modal,
//   Form,
//   Alert,
//   Table,
//   Badge,
// } from "react-bootstrap";
// import Loading from "../../components/common/Loading";
// import ErrorMessage from "../../components/common/ErrorMessage";
// import userService from "../../services/userService";
// import { ROUTES } from "../../utils/constants";
// import { Link } from "react-router-dom";

// const AdminUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [editingUser, setEditingUser] = useState(null);
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     role: "ROLE_USER",
//     password: "",
//   });
//   const [formError, setFormError] = useState("");
//   const [formSuccess, setFormSuccess] = useState("");

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const data = await userService.getAllUsers();
//       setUsers(data);
//     } catch (err) {
//       setError("Không thể tải danh sách người dùng.");
//       console.error("Error fetching users:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleShowModal = (user = null) => {
//     if (user) {
//       setEditingUser(user);
//       setFormData({
//         username: user.username || "",
//         email: user.email || "",
//         role: user.role || "ROLE_USER",
//         password: "",
//       });
//     } else {
//       setEditingUser(null);
//       setFormData({
//         username: "",
//         email: "",
//         role: "ROLE_USER",
//         password: "",
//       });
//     }
//     setFormError("");
//     setFormSuccess("");
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setEditingUser(null);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setFormError("");
//     setFormSuccess("");

//     try {
//       if (editingUser) {
//         // update user
//         const updated = await userService.updateUser(editingUser.id, formData);
//         setUsers((prev) =>
//           prev.map((u) => (u.id === editingUser.id ? updated : u))
//         );
//         setFormSuccess("Cập nhật user thành công!");
//       } else {
//         // create user
//         const newUser = await userService.registerUser(formData);
//         setUsers((prev) => [...prev, newUser]);
//         setFormSuccess("Thêm user mới thành công!");
//       }

//       setTimeout(() => {
//         handleCloseModal();
//       }, 1200);
//     } catch (err) {
//       setFormError(err.message || "Lỗi khi lưu user.");
//       console.error("Error saving user:", err);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Bạn có chắc chắn muốn xóa user này?")) {
//       try {
//         await userService.deleteUser(id);
//         setUsers((prev) => prev.filter((u) => u.id !== id));
//       } catch (err) {
//         console.error("Error deleting user:", err);
//         alert("Không thể xóa user.");
//       }
//     }
//   };

//   if (loading) return <Loading />;

//   return (
//     <Container>
//       {error && <ErrorMessage message={error} />}
//       <div className="table-responsive">
//         <Table striped bordered hover>
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Tên người dùng</th>
//               <th>Email</th>
//               <th>Role</th>
//               <th>Hành động</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user) => (
//               <tr key={user.id}>
//                 <td>{user.id}</td>
//                 <td>{user.username}</td>
//                 <td>{user.email}</td>
//                 <td>
//                   <Badge bg={user.role === "ROLE_ADMIN" ? "danger" : "primary"}>
//                     {user.role === "ROLE_ADMIN" ? "Admin" : "User"}
//                   </Badge>
//                 </td>
//                 <td>
//                   <Button
//                     variant="warning"
//                     size="sm"
//                     className="me-2"
//                     as={Link}
//                     to={`${ROUTES.USERS}/${user.id}`}
//                   >
//                     Xem chi tiết
//                   </Button>
//                   <Button
//                     variant="info"
//                     size="sm"
//                     className="me-2"
//                     onClick={() => handleShowModal(user)}
//                   >
//                     Sửa
//                   </Button>
//                   <Button
//                     variant="danger"
//                     size="sm"
//                     onClick={() => handleDelete(user.id)}
//                   >
//                     Xóa
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </div>

//       {/* Modal thêm / sửa user */}
//       <Modal show={showModal} onHide={handleCloseModal}>
//         <Modal.Header closeButton>
//           <Modal.Title>{editingUser ? "Sửa User" : "Thêm User"}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {formError && <Alert variant="danger">{formError}</Alert>}
//           {formSuccess && <Alert variant="success">{formSuccess}</Alert>}

//           <Form onSubmit={handleSubmit}>
//             <Form.Group className="mb-3">
//               <Form.Label>Tên người dùng</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="username"
//                 value={formData.username}
//                 onChange={handleInputChange}
//                 required
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Email</Form.Label>
//               <Form.Control
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 required
//               />
//             </Form.Group>

//             {!editingUser && (
//               <Form.Group className="mb-3">
//                 <Form.Label>Mật khẩu</Form.Label>
//                 <Form.Control
//                   type="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </Form.Group>
//             )}

//             <Form.Group className="mb-3">
//               <Form.Label>Role</Form.Label>
//               <Form.Select
//                 name="role"
//                 value={formData.role}
//                 onChange={handleInputChange}
//               >
//                 <option value="ROLE_USER">User</option>
//                 <option value="ROLE_ADMIN">Admin</option>
//               </Form.Select>
//             </Form.Group>

//             <div className="d-flex justify-content-end">
//               <Button
//                 variant="secondary"
//                 className="me-2"
//                 onClick={handleCloseModal}
//               >
//                 Hủy
//               </Button>
//               <Button type="submit" variant="primary">
//                 {editingUser ? "Cập nhật" : "Thêm"}
//               </Button>
//             </div>
//           </Form>
//         </Modal.Body>
//       </Modal>
//       {/* <Button
//         as={Link}
//         to={ROUTES.ADMIN_DASHBOARD}
//         variant="secondary"
//         className="m-4"
//       >
//         ← Quay lại Dashboard
//       </Button> */}
//     </Container>
//   );
// };

// export default AdminUsers;
