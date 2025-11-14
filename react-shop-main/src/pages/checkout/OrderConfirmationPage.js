import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Button,
  Table,
  Badge,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Loading from "../../components/common/Loading";
import orderService from "../../services/orderService";

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔹 Tính tổng tiền
  const calculateTotal = (items) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((sum, item) => {
      const price = Number(
        item.price || item.product?.priceProduct || item.product?.price || 0
      );
      const quantity = Number(item.quantity || 1);
      return sum + price * quantity;
    }, 0);
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const orderData = await orderService.getOrderById(orderId);
      console.log("📦 Order API response:", orderData);

      // 🔹 Lấy dữ liệu tạm từ localStorage nếu backend chưa có
      const additionalInfo = localStorage.getItem("lastOrderInfo");
      let mergedOrder = orderData;

      if (additionalInfo) {
        const parsedInfo = JSON.parse(additionalInfo);
        mergedOrder = {
          ...orderData,
          email: orderData.email || parsedInfo.email,
          phone: orderData.phone || parsedInfo.phone,
          notes: orderData.notes || parsedInfo.notes,
          orderItems:
            orderData.orderItems && orderData.orderItems.length > 0
              ? orderData.orderItems
              : parsedInfo.orderItems || [],
        };
        localStorage.removeItem("lastOrderInfo");
      }

      // đảm bảo orderItems luôn là mảng
      if (!mergedOrder.orderItems || !Array.isArray(mergedOrder.orderItems)) {
        mergedOrder.orderItems = [];
      }

      mergedOrder.totalAmount =
        orderData.totalAmount ||
        calculateTotal(mergedOrder.orderItems);

      setOrder(mergedOrder);
    } catch (err) {
      console.error("❌ Error fetching order:", err);
      setError("Không thể tải thông tin đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      PENDING: { variant: "warning", text: "Chờ xử lý" },
      CONFIRMED: { variant: "info", text: "Đã xác nhận" },
      SHIPPING: { variant: "primary", text: "Đang giao" },
      DELIVERED: { variant: "success", text: "Đã giao" },
      CANCELLED: { variant: "danger", text: "Đã hủy" },
    };
    const statusInfo = statusMap[status] || {
      variant: "secondary",
      text: status || "Không xác định",
    };
    return <Badge bg={statusInfo.variant}>{statusInfo.text}</Badge>;
  };

  if (loading) return <Layout><Loading /></Layout>;

  if (error)
    return (
      <Layout>
        <Container>
          <Alert variant="danger" className="text-center">
            <h4>Có lỗi xảy ra</h4>
            <p>{error}</p>
            <Button variant="primary" onClick={() => navigate("/products")}>
              Tiếp tục mua sắm
            </Button>
          </Alert>
        </Container>
      </Layout>
    );

  if (!order)
    return (
      <Layout>
        <Container>
          <Alert variant="warning" className="text-center">
            <h4>Không tìm thấy đơn hàng</h4>
            <Button variant="primary" onClick={() => navigate("/products")}>
              Tiếp tục mua sắm
            </Button>
          </Alert>
        </Container>
      </Layout>
    );

  return (
    <Layout>
      <Container className="order-confirmation py-4">
        <div className="text-center mb-4">
          <i className="fas fa-check-circle text-success" style={{ fontSize: "4rem" }}></i>
          <h1 className="text-success mt-3">Đặt hàng thành công!</h1>
          <p className="text-muted">
            Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn sớm nhất có thể.
          </p>
        </div>

        <Row>
          <Col lg={8} className="mx-auto">
            <Card className="mb-4 shadow-sm">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Thông tin đơn hàng</h5>
                {getStatusBadge(order.status)}
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <p><strong>Mã đơn hàng:</strong> #{order.id}</p>
                    <p><strong>Ngày đặt:</strong> {formatDate(order.orderDate)}</p>
                    <p><strong>Tổng tiền:</strong> <span className="text-primary fw-bold">{formatPrice(order.totalAmount)}</span></p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Tên khách hàng:</strong> {order.customerName || "N/A"}</p>
                    <p><strong>Email:</strong> {order.email || "N/A"}</p>
                    <p><strong>Số điện thoại:</strong> {order.phone || "N/A"}</p>
                  </Col>
                </Row>

                <hr />

                <div>
                  <strong>Địa chỉ giao hàng:</strong>
                  <p className="mb-2">{order.shippingAddress || "N/A"}</p>
                </div>

                {order.notes && (
                  <div>
                    <strong>Ghi chú:</strong>
                    <p className="mb-0">{order.notes}</p>
                  </div>
                )}
              </Card.Body>
            </Card>

            {order.orderItems.length > 0 && (
              <Card className="mb-4 shadow-sm">
                <Card.Header><h5 className="mb-0">Chi tiết sản phẩm</h5></Card.Header>
                <Card.Body className="p-0">
                  <Table responsive bordered hover className="mb-0 align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Sản phẩm</th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Tổng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.orderItems.map((item, index) => {
                        const price = Number(item.price || item.product?.priceProduct || item.product?.price || 0);
                        const quantity = Number(item.quantity || 1);
                        return (
                          <tr key={index}>
                            <td>
                              <div className="d-flex align-items-center">
                                {item.product && (
                                  <>
                                    <img
                                      src={item.product.image || item.product.imageUrl || "/placeholder-image.jpg"}
                                      alt={item.product.nameProduct || item.product.name}
                                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                      className="me-3 rounded"
                                    />
                                    <div>
                                      <h6 className="mb-1">{item.product.nameProduct || item.product.name}</h6>
                                      <small className="text-muted">{item.product.brand || ""}</small>
                                    </div>
                                  </>
                                )}
                              </div>
                            </td>
                            <td className="align-middle">{formatPrice(price)}</td>
                            <td className="align-middle">{quantity}</td>
                            <td className="align-middle"><strong>{formatPrice(price * quantity)}</strong></td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3" className="text-end fw-bold">Tổng cộng:</td>
                        <td><strong className="text-primary">{formatPrice(order.totalAmount)}</strong></td>
                      </tr>
                    </tfoot>
                  </Table>
                </Card.Body>
              </Card>
            )}

            <div className="text-center">
              <Button variant="primary" className="me-3" onClick={() => navigate("/products")}>Tiếp tục mua sắm</Button>
              <Button variant="outline-primary" onClick={() => window.print()}>In đơn hàng</Button>
            </div>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default OrderConfirmationPage;
