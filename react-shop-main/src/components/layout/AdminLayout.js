// src/components/layout/AdminLayout.js
import React from "react";
import { Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/constants";
import authService from "../../services/authService";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout(); // Xóa token, session hoặc dữ liệu đăng nhập
    navigate("/login"); // Chuyển hướng về trang đăng nhập
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f9f9f9" }}>
      {/* ===== Sidebar ===== */}
      <div
        className="d-flex flex-column p-3 text-dark bg-light shadow-sm"
        style={{
          width: "250px",
          position: "fixed",
          top: 0,
          bottom: 0,
          zIndex: 1040,
        }}
      >
        <h5 className="text-center mb-4 fw-bold">Tác vụ quản lý</h5>
        <Nav className="flex-column">
          <Nav.Item className="mb-3">
            <Nav.Link as={Link} to={ROUTES.ADMIN_DASHBOARD} className="text-dark">
              <i className="fas fa-tachometer-alt me-2"></i> Dashboard
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className="mb-3">
            <Nav.Link as={Link} to={ROUTES.HOME} className="text-dark">
              <i className="fas fa-home me-2"></i> Trang khách hàng
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className="mb-3">
            <Nav.Link as={Link} to="/admin/user" className="text-dark">
              <i className="fas fa-users me-2"></i> Users
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className="mb-3">
            <Nav.Link as={Link} to="/admin/categories" className="text-dark">
              <i className="fas fa-layer-group me-2"></i> Categories
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className="mb-3">
            <Nav.Link as={Link} to="/admin/products" className="text-dark">
              <i className="fas fa-bicycle me-2"></i> Products
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className="mb-3">
            <Nav.Link as={Link} to="/admin/orders" className="text-dark">
              <i className="fas fa-file-invoice-dollar me-2"></i> Orders
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>

      {/* ===== Main content ===== */}
      <div
        className="flex-grow-1"
        style={{
          marginLeft: "250px",
          paddingTop: "56px",
        }}
      >
        {/* ===== Topbar ===== */}
        <div
          className="d-flex justify-content-between align-items-center px-4 py-2 shadow-sm"
          style={{
            backgroundColor: "#2196f3",
            color: "white",
            height: "56px",
            position: "fixed",
            top: 0,
            right: 0,
            left: "250px",
            zIndex: 1030,
          }}
        >
          <div className="fw-semibold">Quản lý trang web </div>
          <div>
            <i className="fas fa-cog me-3" style={{ cursor: "pointer" }}></i>
            <i className="fas fa-sync-alt me-3" style={{ cursor: "pointer" }}></i>
            <i className="fas fa-user-circle me-3" style={{ cursor: "pointer" }}></i>

            {/* 🔹 Nút đăng xuất */}
            <button
              onClick={handleLogout}
              className="btn btn-sm btn-outline-light fw-semibold"
            >
              <i className="fas fa-sign-out-alt me-2"></i> Đăng xuất
            </button>
          </div>
        </div>

        {/* ===== Content area ===== */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
