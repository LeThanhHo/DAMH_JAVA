import api from "./api";

const orderService = {
  // 🔹 Tạo đơn hàng (cho cả khách hoặc user)
  createOrder: async (orderData) => {
    try {
      // Kiểm tra dữ liệu bắt buộc
      if (!orderData.customerName || !orderData.shippingAddress) {
        throw new Error("Vui lòng điền đầy đủ thông tin bắt buộc");
      }

      if (!orderData.orderItems || orderData.orderItems.length === 0) {
        throw new Error("Đơn hàng phải có ít nhất một sản phẩm");
      }

      // 🔹 Tính tổng tiền từ orderItems
      const totalAmount = orderData.orderItems.reduce((sum, item) => {
        const price = item.price || item.product?.priceProduct || item.product?.price || 0;
        const quantity = item.quantity || 1;
        return sum + price * quantity;
      }, 0);

      // 🔹 Chuẩn bị dữ liệu gửi backend
      const backendOrderData = {
        customerName: orderData.customerName,
        shippingAddress: orderData.shippingAddress,
        orderDate: new Date().toISOString(),
        items: orderData.orderItems.map((item) => ({
          productId: item.productId || item.id || item.product?.id,
          quantity: item.quantity || 1,
        })),
        notes: orderData.notes || "",
      };

      if (orderData.userId) {
        backendOrderData.userId = orderData.userId;
      }

      console.log("📤 Sending order data to backend:", backendOrderData);

      // 🔹 Gửi request tạo đơn hàng
      const response = await api.post("/api/orders", backendOrderData);
      const createdOrder = response.data;

      // 🔹 Lưu tạm order vào localStorage để hiển thị sau khi redirect
      const localOrder = {
        id: createdOrder.id,
        orderDate: createdOrder.orderDate,
        customerName: createdOrder.customerName,
        shippingAddress: createdOrder.shippingAddress,
        email: orderData.email || "",
        phone: orderData.phone || "",
        notes: orderData.notes || "",
        orderItems: orderData.orderItems,
        totalAmount,
      };

      localStorage.setItem("lastOrderInfo", JSON.stringify(localOrder));

      return createdOrder;
    } catch (error) {
      console.error("❌ Error creating order:", error);
      if (error.response) {
        const msg =
          error.response.data?.message ||
          error.response.data ||
          "Không thể tạo đơn hàng";
        throw new Error(msg);
      } else if (error.request) {
        throw new Error("Không thể kết nối đến server");
      } else {
        throw new Error(error.message || "Lỗi khi tạo đơn hàng");
      }
    }
  },

  // 🔹 Lấy đơn hàng theo ID
  getOrderById: async (id) => {
    try {
      const response = await api.get(`/api/orders/${id}`);
      console.log("📦 API getOrderById:", response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching order ${id}:`, error);
      if (error.response?.status === 404) {
        throw new Error("Không tìm thấy đơn hàng");
      }
      throw new Error("Không thể tải thông tin đơn hàng");
    }
  },

  // 🔹 Lấy toàn bộ đơn hàng
  getAllOrders: async () => {
    try {
      const response = await api.get("/api/orders");
      return response.data;
    } catch (error) {
      console.error("Error fetching all orders:", error);
      throw new Error("Không thể tải danh sách đơn hàng");
    }
  },
};

export default orderService;
