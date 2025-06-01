/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTachometerAlt,
  faExchangeAlt,
  faWallet,
  faCalendarAlt,
  faChartLine,
  faCog,
  faSignOutAlt,
  faBell,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../context/UserContext";
import {
  fetchCategories,
  insertCategory,
  insertCategoryMapping,
  insertUser,
} from "../api/api";

import "../assets/css/admin.css";

const Admin: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;
 const { user } = useUser();
  useEffect(() => {
    const collapseBtn = document.getElementById("collapseBtn");
    const sidebar = document.getElementById("sidebar");

    const handleCollapse = () => {
      if (sidebar) sidebar.classList.toggle("collapsed");
    };

    collapseBtn?.addEventListener("click", handleCollapse);
    return () => {
      collapseBtn?.removeEventListener("click", handleCollapse);
    };
  }, []);

  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState("");

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [mappingCategoryType, setMappingCategoryType] = useState("");
  const [transactionType, setTransactionType] = useState("Income");

  const [categories, setCategories] = useState<
    { categoryid: string; category_name: string }[]
  >([]);

  // User form states
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );

  // Show toast helper
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data as { categoryid: string; category_name: string }[]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    getCategories();
  }, []);

  const handleInsertCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await insertCategory(categoryName, categoryType);
      if (result) {
        showToast("Category inserted successfully", "success");
        setCategoryName("");
        setCategoryType("");
        // Refresh categories
        const refreshedCategories = await fetchCategories();
        setCategories(refreshedCategories as { categoryid: string; category_name: string }[]);
      } else {
        showToast("Insert category failed", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Error inserting category", "error");
    }
  };

  const handleInsertCategoryMapping = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await insertCategoryMapping(
        selectedCategoryId,
        mappingCategoryType,
        transactionType
      );
      if (result) {
        showToast("Category mapping inserted successfully", "success");
        setSelectedCategoryId("");
        setMappingCategoryType("");
        setTransactionType("Income");
      } else {
        showToast("Insert category mapping failed", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Error inserting category mapping", "error");
    }
  };

  const handleInsertUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await insertUser(firstname, lastname, email, password, phoneNumber);
      if (result) {
        showToast("User inserted successfully", "success");
        setFirstname("");
        setLastname("");
        setEmail("");
        setPassword("");
        setPhoneNumber("");
      } else {
        showToast("Insert user failed", "error");
      }
    } catch (error) {
      console.error("Error inserting user:", error);
      showToast("Error inserting user", "error");
    }
  };

  return (
    <div className="container">
      <aside className="sidebar" id="sidebar">
        <div className="sidebar-header">
          <button className="collapse-btn" id="collapseBtn">
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
        <nav id="navMenu">
          <ul>
            <li>
              <Link to="/dashboard" className={`nav-btn ${isActive("/") ? "active" : ""}`}>
                <FontAwesomeIcon icon={faTachometerAlt} /> <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/transactions"
                className={`nav-btn ${isActive("/transactions") ? "active" : ""}`}
              >
                <FontAwesomeIcon icon={faExchangeAlt} /> <span>Transactions</span>
              </Link>
            </li>
            <li>
              <Link to="/income" className={`nav-btn ${isActive("/income") ? "active" : ""}`}>
                <FontAwesomeIcon icon={faWallet} /> <span>Income</span>
              </Link>
            </li>
            <li>
              <Link to="/expense" className={`nav-btn ${isActive("/expense") ? "active" : ""}`}>
                <FontAwesomeIcon icon={faWallet} /> <span>Expense</span>
              </Link>
            </li>
            <li>
              <Link to="/planning" className={`nav-btn ${isActive("/planning") ? "active" : ""}`}>
                <FontAwesomeIcon icon={faCalendarAlt} /> <span>Planning</span>
              </Link>
            </li>
            <li>
              <Link to="/analytics" className={`nav-btn ${isActive("/analytics") ? "active" : ""}`}>
                <FontAwesomeIcon icon={faChartLine} /> <span>Analytics</span>
              </Link>
            </li>
            <li>
              <Link to="/settings" className={`nav-btn ${isActive("/settings") ? "active" : ""}`}>
                <FontAwesomeIcon icon={faCog} /> <span>Settings</span>
              </Link>
            </li>
            <li>
              <Link to="/admin" className={`nav-btn ${isActive("/admin") ? "active" : ""}`}>
                <FontAwesomeIcon icon={faUser} /> <span>Admin</span>
              </Link>
            </li>
            <li>
              <Link to="/" className="logout-btn">
                <FontAwesomeIcon icon={faSignOutAlt} /> <span>Logout</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="dashboard">
        <header className="topbar">
          <div className="topbar-content">
            <div className="title">Admin Panel</div>
            <div className="actions">
              <button className="income-btn" onClick={() => navigate("/income")}>
                Income
              </button>
              <button className="expense-btn" onClick={() => navigate("/expense")}>
                Expense
              </button>
              <FontAwesomeIcon icon={faBell} />
             <div className="profile">{user ? `${user.firstname} ${user.lastname}` : ""}</div> 
            </div>
          </div>
        </header>
        {/* Forms */}
        <section className="admin-forms">
          <h2>Insert New Category</h2>
          <form onSubmit={handleInsertCategory} className="form">
            <div className="form-group">
              <label htmlFor="categoryName">Category Name:</label>
              <input
                id="categoryName"
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="categoryType">Category Type:</label>
              <select
                id="categoryType"
                value={categoryType}
                onChange={(e) => setCategoryType(e.target.value)}
                required
              >
                <option value="">-- Select Type --</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
            </div>
            <button type="submit" className="btn">
              Add Category
            </button>
          </form>

          <h2>Insert New Category Mapping</h2>
          <form onSubmit={handleInsertCategoryMapping} className="form">
            <div className="form-group">
              <label htmlFor="selectedCategoryId">Category:</label>
              <select
                id="selectedCategoryId"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                required
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat.categoryid} value={cat.categoryid}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
            </div>
          <div className="form-group">
            <label htmlFor="categoryType">Category Type:</label>
            <input
              id="categoryType"
              type="text"
              value={mappingCategoryType}
              onChange={(e) => setMappingCategoryType(e.target.value)}
              required
            />
          </div>

            <div className="form-group">
              <label htmlFor="transactionType">Transaction Type:</label>
              <select
                id="transactionType"
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                required
              >
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
            </div>
            <button type="submit" className="btn">
              Add Category Mapping
            </button>
          </form>

          <h2>Insert New User</h2>
          <form onSubmit={handleInsertUser} className="form">
            <div className="form-group">
              <label htmlFor="firstname">First Name:</label>
              <input
                id="firstname"
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastname">Last Name:</label>
              <input
                id="lastname"
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number:</label>
              <input
                id="phoneNumber"
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn">
              Add User
            </button>
          </form>
        </section>
      </main>

   {/* Toast Notification */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}

    </div>
  );
};

export default Admin;
