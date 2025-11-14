import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Row, Col, Button, Table } from 'react-bootstrap';
import { format } from 'date-fns';
import Layout from "../../components/layout/AdminLayout";
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import orderService from '../../services/orderService';
import productService from '../../services/productService';
import { ROUTES } from '../../utils/constants';

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderWithProducts = async () => {
      try {
        setLoading(true);
        const data = await orderService.getOrderById(id);

        // Nếu order có items, fetch tên sản phẩm
        if (data.items && data.items.length > 0) {
          const itemsWithName = await Promise.all(
            data.items.map(async (item) => {
              try {
                const product = await productService.getProductById(item.productId);
                return { ...item, nameProduct: product.nameProduct, priceProduct: product.priceProduct };
              } catch {
                return { ...item, nameProduct: 'N/A', priceProduct: 0 };
              }
            })
          );
          data.items = itemsWithName;
        }

        setOrder(data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(err.message || 'Failed to load order.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderWithProducts();
  }, [id]);

  if (loading) return <Layout><Loading /></Layout>;
  if (error) return <Layout><ErrorMessage message={error} /></Layout>;
  if (!order) return <Layout><ErrorMessage message="Order not found" /></Layout>;

  // Tính tổng tiền
  const totalAmount = order.items?.reduce(
    (sum, item) => sum + (item.priceProduct || 0) * (item.quantity || 0),
    0
  ) || 0;

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Order Details #{order.id}</h1>
        <Button as={Link} to={ROUTES.ORDERS} variant="outline-primary">
          Back to Orders
        </Button>
      </div>

      <Card className="mb-4">
        <Card.Header><h5>Customer Information</h5></Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p><strong>Name:</strong> {order.customerName}</p>
              <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
            </Col>
            <Col md={6}>
              <p><strong>Order Date:</strong> {order.orderDate ? format(new Date(order.orderDate), 'dd/MM/yyyy') : 'N/A'}</p>
              <p><strong>Total Products:</strong> {order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0)}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header><h5>Products</h5></Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price (₫)</th>
                <th>Total (₫)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.nameProduct || 'N/A'}</td>
                  <td>{item.quantity || 0}</td>
                  <td>{(item.priceProduct || 0).toLocaleString('vi-VN')}₫</td>
                  <td>{((item.priceProduct || 0) * (item.quantity || 0)).toLocaleString('vi-VN')}₫</td>
                  <td>
                    <Button
                      as={Link}
                      to={`/products/${item.productId}`}
                      variant="outline-secondary"
                      size="sm"
                    >
                      View Product
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="text-end fw-bold">Total Amount:</td>
                <td colSpan="2" className="fw-bold text-end text-success">{totalAmount.toLocaleString('vi-VN')}₫</td>
              </tr>
            </tfoot>
          </Table>
        </Card.Body>
      </Card>
    </Layout>
  );
};

export default OrderDetailPage;
