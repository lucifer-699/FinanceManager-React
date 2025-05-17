// src/api/api.ts
import axios from "axios";
import { storage } from "../storage";

const API_BASE_URL = "http://localhost:8442";

// Existing loginUser function
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user/login`, { email, password });
    const data = response.data as { token: string };
    storage.set("token", data.token, 60); 
    storage.set("email", email, 60);
    storage.set("password", password, 60);
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Existing function to fetch dashboard data
export const fetchDashboardData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/finance/dashboard`);
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};

// ✅ New function to fetch income table data
export const fetchIncomeTable = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/finance/incometable`);
    return response.data; // should return a List<IncomeDTO>
  } catch (error) {
    console.error("Error fetching income table data:", error);
    throw error;
  }
};
