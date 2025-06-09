// src/api/api.ts
import axios from "axios";
import { storage } from "../storage";

const API_BASE_URL = "http://localhost:8442";

// Existing loginUser function
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user/login`, { email, password });
    const data = response.data as { token: string, userid: string };
    storage.set("token", data.token, 60);
    storage.set("userid", data.userid , 60); 
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
    const userid = storage.get("userid");
    const response = await axios.get(`${API_BASE_URL}/finance/dashboard`, {
      params: { userid },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};


// ✅ New function to fetch income table data
export const fetchIncomeTable = async (month: string) => {
  try {
    const userid = storage.get("userid");
    const response = await axios.get(`${API_BASE_URL}/finance/incometable`, {
      params: { userid, month },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching income table data:", error);
    throw error;
  }
};

export const fetchExpenseTable = async (month: string) => {
  try {
    const userid = storage.get("userid");
    const response = await axios.get(`${API_BASE_URL}/finance/expensetable`, {
      params: { userid, month },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching expense table data:", error);
    throw error;
  }
};

export const fetchTransactionTable = async (month: string) => {
  try {
    const userid = storage.get("userid");
    const response = await axios.get(`${API_BASE_URL}/finance/transactiontable`, {
      params: {
        userid,
        month, // Send the month as a query parameter (e.g., '2025-05')
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching transaction table data:", error);
    throw error;
  }
};

export const fetchPlanning = async () => {
  try {
    const userid = storage.get("userid");
    const response = await axios.get(`${API_BASE_URL}/finance/planning`, {
      params: { userid },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching planning data:", error);
    throw error;
  }
};
export const fetchMonthlyIncomeExpenseSummary = async () => {
  try {
    const userid = storage.get("userid");
    const response = await axios.get(`${API_BASE_URL}/analytics/monthly-income-expense`, {
      params: { userid },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching monthly income/expense summary:", error);
    throw error;
  }
};

// 📁 src/api/api.ts

export const fetchBudgetSummary = async () => {
  try {
    const userid = storage.get("userid");
    const response = await axios.get(`${API_BASE_URL}/finance/budgetsummary`, {
      params: { userid },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching budget summary:", error);
    throw error;
  }
};

export const fetchSpendingTrend = async () => {
  try {
    const userid = storage.get("userid");
    const response = await axios.get(`${API_BASE_URL}/analytics/spending-trend`, {
      params: { userid },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching spending trend data:", error);
    throw error;
  }
};
// Fetches monthly income vs expense
export const fetchMonthlyIncomeExpense = async () => {
  try {
    const userid = storage.get("userid");
    const response = await axios.get("http://localhost:8442/finance/incomeExpense", {
      params: { userid },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching income/expense data:", error);
    throw error;
  }
};

// Fetches analytics by category (over/under spending)
export const fetchAnalyticsCategory = async () => {
  try {
    const userid = storage.get("userid");
    const response = await axios.get("http://localhost:8442/finance/analyticsCategory", {
      params: { userid },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching analytics category data:", error);
    throw error;
  }
};

// Fetch all categories (only 'Income' type will be used in UI)
export const fetchCategories = async () => {
  try {
    const userid = storage.get("userid");
    const response = await axios.get("http://localhost:8442/finance/categoryid", {
      params: { userid },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Fetch transaction types based on selected category
export const fetchTransactionTypes = async (categoryid: string) => {
  try {
    const userid = storage.get("userid");
    const response =  await axios.get("http://localhost:8442/finance/mapid", {
      params: { categoryid, userid },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching transaction types:", error);
    throw error;
  }
};

// Submit new income transaction
export const insertIncomeTransaction = async (
  userid: string,
  categoryid: string,
  transaction_type: string,
  mapid: string,
  amount: string,
  remarks: string 
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/finance/insertinex`, null, {
      params: {
        userid,
        categoryid,
        transaction_type,
        mapid,
        amount,
        remarks, 
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error inserting income transaction:", error);
    throw error;
  }
};

//submit expense transaction
export const insertExpenseTransaction = async (
  userid: string,
  categoryid: string,
  transaction_type: string,
  mapid: string,
  amount: string,
  remarks: string
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/finance/insertinex`, null, {
      params: {
        userid,
        categoryid,
        transaction_type,
        mapid,
        amount,
        remarks, // Add remarks for expense transaction
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error inserting income transaction:", error);
    throw error;
  }
};
// Submit new budget plan
export const insertBudgetPlan = async (
  userid: string,
  categoryid: string,
  mapid: string,
  amount: string
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/finance/insertplan`, null, {
      params: {
        userid,
        categoryid,
        mapid,
        amount,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error inserting budget plan:", error);
    throw error;
  }
};

// Insert a new category
export const insertCategory = async (
  categoryName: string,
  categoryType: string
) => {
  try {
     const userid = storage.get("userid");
    const response = await axios.post(`${API_BASE_URL}/finance/insertcategory`, null, {
      params: {
        categoryName,
        categoryType,
        userid
      },
    });
    return response.data; // returns a boolean
  } catch (error) {
    console.error("Error inserting category:", error);
    throw error;
  }
};

// Insert a new category mapping
export const insertCategoryMapping = async (
  categoryid: string,
  categoryType: string,
  transactionType: string
) => {
  try {
     const userid = storage.get("userid");
    const response = await axios.post(`${API_BASE_URL}/finance/insertcategoryMapping`, null, {
      params: {
        categoryid,
        categoryType,
        transactionType,
        userid
      },
    });
    return response.data; // returns a boolean
  } catch (error) {
    console.error("Error inserting category mapping:", error);
    throw error;
  }
};
export const insertUser = async (
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  phone_number: string
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/finance/insertUser`, null, {
      params: {
        firstname,
        lastname,
        email,
        password,
        phone_number
      }
    });
    return response.data; // should be true/false
  } catch (error) {
    console.error("Error inserting user:", error);
    throw error;
  }
};
export const deleteTransaction = async (transactionid: string, userid: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/finance/deleteTransaction`, null, {
      params: {
        transactionid,
        userid,
      },
    });
    return response.data; // true if deleted, false otherwise
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
};
export const deleteCategory = async (categoryid: string) => {
  try {
    const response = await axios.delete(`http://localhost:8442/finance/categoryid/${categoryid}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
