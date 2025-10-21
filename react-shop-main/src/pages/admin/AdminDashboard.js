// File: src/pages/admin/AdminDashboard.js

import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table, // Bỏ Button vì không dùng nữa
  Badge,
} from "react-bootstrap";
// Import AdminLayout
import AdminLayout from "../../components/layout/AdminLayout"; // Đảm bảo đường dẫn này đúng

const AdminDashboard = () => {
  // Dữ liệu giả (mock data)
  const statsData = [
    {
      title: "Tổng doanh thu (Tháng)",
      value: "1.2 Tỷ VNĐ",
      icon: <i className="fas fa-chart-line fa-2x text-success"></i>,
    },
    {
      title: "Đơn hàng mới",
      value: "15",
      icon: <i className="fas fa-shopping-cart fa-2x text-primary"></i>,
    },
    {
      title: "Sản phẩm (Xe đạp)",
      value: "120",
      icon: <i className="fas fa-bicycle fa-2x text-info"></i>,
    },
    {
      title: "Khách hàng mới",
      value: "8",
      icon: <i className="fas fa-user-plus fa-2x text-warning"></i>,
    },
  ];

  const recentOrders = [
    {
      id: "#8921",
      customer: "Nguyễn Văn An",
      product: "Xe đạp địa hình MTB",
      total: "15.000.000 VNĐ",
      status: "Pending",
    },
    {
      id: "#8920",
      customer: "Trần Thị Bích",
      product: "Xe đạp đua (Road)",
      total: "22.500.000 VNĐ",
      status: "Completed",
    },
    {
      id: "#8919",
      customer: "Lê Minh",
      product: "Xe đạp thành phố",
      total: "8.200.000 VNĐ",
      status: "Completed",
    },
    {
      id: "#8918",
      customer: "Phạm Hùng",
      product: "Xe đạp gấp",
      total: "11.000.000 VNĐ",
      status: "Cancelled",
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "Completed":
        return "success";
      case "Cancelled":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <AdminLayout>
      <Container fluid>
        {/* Tiêu đề chào mừng */}
        <Row className="mb-4 align-items-center">
          <Col>
            <h3 className="mb-0">Chào mừng trở lại, Admin!</h3>
            <p className="text-muted">
              LÀM VIỆC HIỆU QUẢ 
              TINH THẦN TRÁCH NHIỆM CAO
            </p>
          </Col>
        </Row>

        {/* Các thẻ thống kê */}
        <Row className="mb-4">
          {statsData.map((stat, index) => (
            <Col md={6} lg={3} key={index} className="mb-3">
              <Card border="light" className="shadow-sm h-100">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col xs="auto">{stat.icon}</Col>
                    <Col>
                      <h6 className="text-muted mb-1">{stat.title}</h6>
                      <h4 className="fw-bold mb-0">{stat.value}</h4>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Đơn hàng gần đây (Chiếm toàn bộ hàng) */}
        <Row>
          {/* SỬA: Thay lg={8} thành lg={12} và xóa cột Tác vụ nhanh */}
          <Col lg={12} className="mb-4">
            <Card className="shadow-sm h-100">
              <Card.Header as="h5">Đơn hàng gần đây</Card.Header>
              <Card.Body>
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>Mã ĐH</th>
                      <th>Khách hàng</th>
                      <th>Sản phẩm</th>
                      <th>Tổng tiền</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <strong>{order.id}</strong>
                        </td>
                        <td>{order.customer}</td>
                        <td>{order.product}</td>
                        <td>{order.total}</td>
                        <td>
                          <Badge bg={getStatusBadge(order.status)}>
                            {order.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </AdminLayout>
  );
};

export default AdminDashboard;