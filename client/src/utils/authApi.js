import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8800/api/user";

export const authApi = {
  // Login API
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      return response.data;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || "Login failed. Please try again." };
    }
  },

  // Register API
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return response.data;
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || "Registration failed. Please try again." };
    }
  },

  // Logout API
  logout: async () => {
    try {
      await axios.post(`${API_URL}/logout`);
      return { success: true, message: "Logged out successfully" };
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
      return { success: false, message: "Logout failed. Please try again." };
    }
  },

  // Fetch all users (Admin Only)
  getUsers: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Users API Response:", response.data); // Debugging

      return response.data;
    } catch (error) {
      console.error("Fetch users error:", error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || "Failed to fetch users." };
    }
  },

  // Delete user by ID (Admin Only)
  deleteUser: async (userId, token) => {
    try {
      const response = await axios.delete(`${API_URL}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("User deleted successfully:", response.data); // Debugging
      return response.data;
    } catch (error) {
      console.error("Delete user error:", error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || "Failed to delete user." };
    }
  },

  // Change Password API
  changePassword: async (passwords, token) => {
    const res = await fetch(`${API_URL}/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(passwords),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to change password");
    }

    return data;
  },
};
