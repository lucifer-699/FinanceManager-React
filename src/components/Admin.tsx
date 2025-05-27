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

import {
  fetchCategories,
  insertCategory,
  insertCategoryMapping,
} from "../api/api";

import "../assets/css/admin.css";

const Admin: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;

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

  const [profile] = useState({ firstname: "Admin", lastname: "User" });

  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState("");

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [mappingCategoryType, setMappingCategoryType] = useState("");
  const [transactionType, setTransactionType] = useState("Income");

  const [categories, setCategories] = useState<
    { categoryid: string; category_name: string }[]
  >([]);

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
      alert(result ? "Category inserted successfully" : "Insert failed");
      setCategoryName("");
      setCategoryType("");
      // Optionally refresh categories list
      const refreshedCategories = await fetchCategories();
      setCategories(refreshedCategories as { categoryid: string; category_name: string }[]);
    } catch (error) {
      console.error(error);
      alert("Error inserting category");
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
      alert(result ? "Category mapping inserted successfully" : "Insert failed");
      setSelectedCategoryId("");
      setMappingCategoryType("");
      setTransactionType("Income");
    } catch (error) {
      console.error(error);
      alert("Error inserting category mapping");
    }
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <aside className="sidebar" id="sidebar">
        <div className="sidebar-header">
          <button className="collapse-btn" id="collapseBtn">
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
        <nav id="navMenu">
          <ul>
            <li>
              <Link
                to="/dashboard"
                className={`nav-btn ${isActive("/dashboard") ? "active" : ""}`}
              >
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
              <Link
                to="/income"
                className={`nav-btn ${isActive("/income") ? "active" : ""}`}
              >
                <FontAwesomeIcon icon={faWallet} /> <span>Income</span>
              </Link>
            </li>
            <li>
              <Link
                to="/expense"
                className={`nav-btn ${isActive("/expense") ? "active" : ""}`}
              >
                <FontAwesomeIcon icon={faWallet} /> <span>Expense</span>
              </Link>
            </li>
            <li>
              <Link
                to="/planning"
                className={`nav-btn ${isActive("/planning") ? "active" : ""}`}
              >
                <FontAwesomeIcon icon={faCalendarAlt} /> <span>Planning</span>
              </Link>
            </li>
            <li>
              <Link
                to="/analytics"
                className={`nav-btn ${isActive("/analytics") ? "active" : ""}`}
              >
                <FontAwesomeIcon icon={faChartLine} /> <span>Analytics</span>
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className={`nav-btn ${isActive("/settings") ? "active" : ""}`}
              >
                <FontAwesomeIcon icon={faCog} /> <span>Settings</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin"
                className={`nav-btn ${isActive("/admin") ? "active" : ""}`}
              >
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

      {/* Main content */}
     <main className="dashboard">
            <header className="topbar">
              <div className="topbar-content">
                <div className="title">Financial Planning</div>
                  <button className="income-btn" onClick={() => navigate('/income')}>Income</button>
                  <button className="expense-btn" onClick={() => navigate('/expense')}>Expense</button>
                  <FontAwesomeIcon icon={faBell} />
                  <div className="profile">Sishir Shrestha</div>
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

          <h2>Insert Category Mapping</h2>
          <form onSubmit={handleInsertCategoryMapping} className="form">
            <div className="form-group">
              <label htmlFor="selectCategory">Select Category:</label>
              <select
                id="selectCategory"
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
              <label htmlFor="mappingCategoryType">Category Type:</label>
              <select
                id="mappingCategoryType"
                value={mappingCategoryType}
                onChange={(e) => setMappingCategoryType(e.target.value)}
                required
              >
                <option value="">-- Select Type --</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
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
        </section>
      </main>
    </div>
  );
};

export default Admin;
