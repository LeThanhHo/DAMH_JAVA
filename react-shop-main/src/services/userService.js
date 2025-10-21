import api from "./api";

const userService = {
  // 🧍 Đăng ký người dùng thông thường
  register: async (userData) => {
    try {
      const requestData = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
      };

      console.log("Sending registration request:", {
        url: "/api/users/register",
        data: { ...requestData, password: "******" },
      });

      const response = await api.post("/api/users/register", requestData);
      return response.data;
    } catch (error) {
      console.error("Error registering user:", error);
      if (error.response) {
        switch (error.response.status) {
          case 403:
            throw new Error("Không có quyền đăng ký người dùng");
          case 409:
            throw new Error("Tên đăng nhập hoặc email đã tồn tại");
          case 400:
            const validationErrors = error.response.data?.errors;
            if (validationErrors) {
              throw new Error(
                `Lỗi xác thực: ${Object.values(validationErrors).join(", ")}`
              );
            }
            break;
          default:
            break;
        }

        const serverMessage =
          error.response.data?.message ||
          (typeof error.response.data === "string"
            ? error.response.data
            : null) ||
          "Đăng ký thất bại";
        throw new Error(serverMessage);
      } else if (error.request) {
        throw new Error("Không thể kết nối đến server");
      } else {
        throw new Error("Lỗi đăng ký: " + error.message);
      }
    }
  },

  // 👑 Đăng ký admin
  registerAdmin: async (userData) => {
    try {
      const response = await api.post("/api/users/register-admin", userData);
      return response.data;
    } catch (error) {
      console.error("Error registering admin:", error);
      if (error.response) {
        if (error.response.status === 409) {
          throw new Error("Tên đăng nhập hoặc email đã tồn tại");
        } else if (error.response.status === 403) {
          throw new Error("Không có quyền tạo tài khoản admin");
        }
        throw new Error(error.response.data || "Đăng ký admin thất bại");
      } else if (error.request) {
        throw new Error("Không thể kết nối đến server");
      } else {
        throw new Error("Lỗi đăng ký admin: " + error.message);
      }
    }
  },

  // 📋 Lấy tất cả người dùng
  getAllUsers: async () => {
    try {
      const response = await api.get("/api/users");
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  // 🔍 Lấy theo ID
  getUserById: async (id) => {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  },

  // ✏️ Cập nhật người dùng
  updateUser: async (id, userData) => {
    const response = await api.put(`/api/users/${id}`, userData);
    return response.data;
  },

  // 🗑️ Xóa người dùng
  deleteUser: async (id) => {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  },

  // ➕ Tạo người dùng mới (cho admin)
  createUser: async (userData) => {
    try {
      const response = await api.post("/api/users", userData);
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      if (error.response) {
        throw new Error(error.response.data?.message || "Không thể tạo người dùng");
      }
      throw new Error("Lỗi kết nối đến server");
    }
  },
};

export default userService;
