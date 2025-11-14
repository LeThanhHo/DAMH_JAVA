import api from "./api";
import localCartService from "./localCartService";
import authService from "./authService";

const cartService = {
  // 🛒 Lấy giỏ hàng
  getCart: async () => {
    const isAuthenticated = authService.isAuthenticated();

    if (isAuthenticated) {
      try {
        const response = await api.get("/api/cart");
        const data = response.data;

        // Chuẩn hóa dữ liệu về dạng { items: [...] }
        if (data && Array.isArray(data.cartItems)) {
          return {
            items: data.cartItems.map((item) => ({
              id: item.id,
              productId: item.product?.id,
              name: item.product?.nameProduct || item.product?.name,
              price: item.product?.priceProduct || item.product?.price,
              imageUrl: item.product?.imageUrl,
              quantity: item.quantity,
            })),
          };
        }

        return data?.items ? data : { items: [] };
      } catch (error) {
        console.error("Error fetching cart:", error);
        return { items: [] };
      }
    } else {
      return Promise.resolve(localCartService.getCart());
    }
  },

  // ➕ Thêm sản phẩm vào giỏ hàng
  addToCart: async (product, quantity = 1) => {
    const isAuthenticated = authService.isAuthenticated();

    if (isAuthenticated) {
      try {
        // Gọi API /api/cart/add
        const response = await api.post("/api/cart/add", null, {
          params: {
            productId: product.id,
            quantity: quantity,
          },
        });
        console.log("Server response:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error adding to cart:", error);
        if (error.response) {
          console.error("Server Error Details:", error.response);
          switch (error.response.status) {
            case 400:
              throw new Error("Sản phẩm không hợp lệ hoặc không đủ hàng.");
            case 401:
              throw new Error(
                "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại."
              );
            case 403:
              throw new Error("Bạn không có quyền thực hiện thao tác này.");
            case 404:
              throw new Error("Sản phẩm không tồn tại.");
            case 500:
              throw new Error("Lỗi hệ thống. Vui lòng thử lại sau.");
            default:
              throw new Error(`Lỗi ${error.response.status}`);
          }
        }
        throw new Error("Không thể thêm sản phẩm vào giỏ hàng.");
      }
    } else {
      // Nếu chưa đăng nhập, lưu giỏ hàng ở local
      return Promise.resolve(localCartService.addToCart(product, quantity));
    }
  },

  // ❌ Xóa sản phẩm khỏi giỏ hàng
  removeFromCart: async (cartItemId) => {
    const isAuthenticated = authService.isAuthenticated();

    if (isAuthenticated) {
      try {
        const response = await api.delete(`/api/cart/remove/${cartItemId}`);
        return response.data;
      } catch (error) {
        console.error("Error removing from cart:", error);
        throw new Error("Không thể xóa sản phẩm khỏi giỏ hàng.");
      }
    } else {
      return Promise.resolve(localCartService.removeItem(cartItemId));
    }
  },

  // 🧹 Xóa toàn bộ giỏ hàng
  clearCart: async () => {
    const isAuthenticated = authService.isAuthenticated();

    if (isAuthenticated) {
      try {
        await api.delete("/api/cart/clear");
        return { items: [] };
      } catch (error) {
        console.error("Error clearing cart:", error);
        throw new Error("Không thể xóa giỏ hàng.");
      }
    } else {
      return Promise.resolve(localCartService.clearCart());
    }
  },

  // 🔄 Cập nhật số lượng sản phẩm trong giỏ hàng
  updateCartItem: async (cartItemId, quantity) => {
    const isAuthenticated = authService.isAuthenticated();

    if (isAuthenticated) {
      try {
        const response = await api.put("/api/cart/update", null, {
          params: { cartItemId, quantity },
        });
        return response.data;
      } catch (error) {
        console.error("Error updating cart item:", error);
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
        throw new Error("Không thể cập nhật giỏ hàng.");
      }
    } else {
      return Promise.resolve(
        localCartService.updateQuantity(cartItemId, quantity)
      );
    }
  },
  // ☁️ Đồng bộ giỏ hàng local lên server sau khi đăng nhập
  syncCartOnLogin: async () => {
    const localCart = localCartService.getCart();

    if (localCart.items.length > 0) {
      try {
        for (const item of localCart.items) {
          await cartService.addToCart(
            {
              id: item.productId,
              nameProduct: item.name,
              priceProduct: item.price,
              imageUrl: item.imageUrl,
            },
            item.quantity
          );
        }
        localCartService.clearCart();
      } catch (error) {
        console.error("Error syncing cart:", error);
        throw new Error("Không thể đồng bộ giỏ hàng.");
      }
    }
  },
};

export default cartService;
