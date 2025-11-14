import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import orderService from "../../services/orderService";
import productService from "../../services/productService";
import Layout from "../../components/layout/AdminLayout";
const AdminOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrdersWithProducts = async () => {
      try {
        setLoading(true);
        const ordersData = await orderService.getAllOrders();

        // Fetch thông tin sản phẩm cho mỗi order
        const ordersWithProducts = await Promise.all(
          ordersData.map(async (order) => {
            if (order.items && order.items.length > 0) {
              const itemsWithName = await Promise.all(
                order.items.map(async (item) => {
                  try {
                    const product = await productService.getProductById(
                      item.productId
                    );
                    return {
                      ...item,
                      nameProduct: product.nameProduct,
                    };
                  } catch (err) {
                    console.error(
                      "Không lấy được sản phẩm",
                      item.productId,
                      err
                    );
                    return { ...item, nameProduct: "N/A" };
                  }
                })
              );
              return { ...order, items: itemsWithName };
            }
            return order;
          })
        );

        setOrders(ordersWithProducts);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.message || "Không tải được đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersWithProducts();
  }, []);

  if (loading)
    return <p className="text-center my-4">Đang tải danh sách đơn hàng...</p>;
  if (error)
    return (
      <p className="text-center my-4 text-danger">
        Lỗi: {error}. Vui lòng thử lại.
      </p>
    );
  if (!orders || orders.length === 0)
    return <p className="text-center my-4">Không có đơn hàng nào.</p>;

  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.totalPrice || order.totalAmount || 0),
    0
  );

  return (
    <Layout>
    <div className="table-responsive mt-3">
      <h4 className="text-center mb-3">📦 Danh sách đơn hàng</h4>

      <Table striped bordered hover>
        <thead>
          <tr className="text-center">
            <th>Mã đơn hàng</th>
            <th>Khách hàng</th>
            <th>Sản phẩm</th>
            <th>Số lượng</th>
            <th>Ngày đặt</th>
            <th>Tổng tiền (₫)</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="text-center">{order.id}</td>
              <td>{order.customerName || "Không có tên"}</td>
              <td>
                {order.items && order.items.length > 0
                  ? order.items.map((p, idx) => (
                      <div key={idx}>
                        {p.nameProduct || "N/A"} 
                      </div>
                    ))
                  : "N/A"}
              </td>
              <td className="text-center">
                {order.items
                  ? order.items.reduce(
                      (sum, p) => sum + (p.quantity || 0),
                      0
                    )
                  : 0}
              </td>
              <td className="text-center">
                {order.orderDate
                  ? format(new Date(order.orderDate), "dd/MM/yyyy")
                  : "N/A"}
              </td>
              <td className="text-end">
                {(order.totalPrice || order.totalAmount)?.toLocaleString(
                  "vi-VN"
                ) + "₫"}
              </td>
              <td className="text-center">
                <Button
                  as={Link}
                  to={`/orders/${order.id}`}
                  variant="info"
                  size="sm"
                >
                  Chi tiết
                </Button>
              </td>
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr>
            <td colSpan="5" className="text-end fw-bold">
              Tổng doanh thu:
            </td>
            <td colSpan="2" className="fw-bold text-end text-success">
              {totalRevenue.toLocaleString("vi-VN")}₫
            </td>
          </tr>
        </tfoot>
      </Table>
    </div>
    </Layout>
  );
};

export default AdminOrder;
