// File: src/pages/admin/AdminDashboard.js
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Table, Badge } from "react-bootstrap";
import AdminLayout from "../../components/layout/AdminLayout";
import orderService from "../../services/orderService";
import productService from "../../services/productService";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [productsCount, setProductsCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  // 🔹 Lấy dữ liệu từ backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy toàn bộ đơn hàng
        const allOrders = await orderService.getAllOrders();

        // Sắp xếp theo ngày đặt (mới nhất)
        const sortedOrders = allOrders.sort(
          (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
        );

        // Lấy 5 đơn hàng gần nhất
        setOrders(sortedOrders.slice(0, 5));

        // Tính tổng doanh thu
        const revenue = allOrders.reduce(
          (sum, order) => sum + (order.totalAmount || 0),
          0
        );
        setTotalRevenue(revenue);

        // Lấy tổng số sản phẩm
        const products = await productService.getAllProducts();
        setProductsCount(products.length);

      } catch (err) {
        console.error("❌ Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Định dạng tiền VND
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  // ✅ Định dạng ngày theo kiểu Shopee (dd/MM/yyyy - HH:mm)
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có";
    const date = new Date(dateString);
    const formatted = date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    return formatted.replace(",", " -");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "CONFIRMED":
        return "info";
      case "DELIVERED":
        return "success";
      case "CANCELLED":
        return "danger";
      default:
        return "secondary";
    }
  };

  const statsData = [
    {
      title: "Tổng doanh thu",
      value: formatPrice(totalRevenue),
      icon: <i className="fas fa-chart-line fa-2x text-success"></i>,
    },
    {
      title: "Đơn hàng mới",
      value: orders.length,
      icon: <i className="fas fa-shopping-cart fa-2x text-primary"></i>,
    },
    {
      title: "Sản phẩm",
      value: productsCount,
      icon: <i className="fas fa-bicycle fa-2x text-info"></i>,
    },
  ];

  if (loading)
    return (
      <AdminLayout>
        <p>Đang tải dữ liệu...</p>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <Container fluid>
        <Row className="mb-4">
          <Col>
            <h3 className="mb-0">Chào mừng trở lại, Admin!</h3>
            <p className="text-muted">Quản lý hiệu quả cửa hàng của bạn</p>
          </Col>
        </Row>

        {/* ✅ Thống kê tổng quan */}
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

        {/* ✅ Bảng đơn hàng gần nhất */}
        <Row>
          <Col lg={12} className="mb-4">
            <Card className="shadow-sm h-100">
              <Card.Header as="h5">5 Đơn hàng gần nhất</Card.Header>
              <Card.Body>
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>Mã ĐH</th>
                      <th>Khách hàng</th>
                      <th>Ngày đặt</th> {/* ✅ Thêm cột ngày đặt */}
                      <th>Tổng tiền</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td><strong>#{order.id}</strong></td>
                        <td>{order.customerName}</td>
                        <td>{formatDate(order.orderDate)}</td> {/* ✅ Hiển thị ngày */}
                        <td>{formatPrice(order.totalAmount)}</td>
                        <td>
                          <Badge bg={getStatusBadge(order.status)}>
                            {order.status || "PENDING"}
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
