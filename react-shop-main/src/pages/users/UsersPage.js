import React, { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import UserList from "../../components/users/UserList";
import userService from "../../services/userService";
import { ROUTES } from "../../utils/constants";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError("Failed to load users. Please try again.");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔁 Callback khi user bị xóa
  const handleUserDeleted = () => {
    fetchUsers();
  };

  // 🔁 Callback khi user được cập nhật
  const handleUserUpdated = () => {
    fetchUsers();
  };

  if (loading)
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  if (error)
    return (
      <Layout>
        <ErrorMessage message={error} />
      </Layout>
    );

  return (
    <Layout>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>User Management</h1>
          <div>
            <Button
              as={Link}
              to="/admin"
              variant="outline-secondary"
              className="me-2"
            >
              Quay lại Dashboard
            </Button>

            <Button
              as={Link}
              to={ROUTES.REGISTER}
              variant="outline-primary"
              className="me-2"
            >
              Add User
            </Button>
            <Button
              as={Link}
              to={ROUTES.REGISTER_ADMIN}
              variant="outline-danger"
            >
              Add Admin
            </Button>
          </div>
        </div>

        {/* 🔗 Truyền callback xuống UserList */}
        <UserList
          users={users}
          onUserDeleted={handleUserDeleted}
          onUserUpdated={handleUserUpdated}
        />
      </Container>
    </Layout>
  );
};

export default UsersPage;
