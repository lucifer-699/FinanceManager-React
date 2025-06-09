/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars, faTachometerAlt, faExchangeAlt, faWallet, faCalendarAlt,
  faChartLine, faCog, faSignOutAlt, faBell, faUser, faTrashAlt, faPlus
} from "@fortawesome/free-solid-svg-icons";

import { useUser } from "../context/UserContext";
import {
  fetchCategories,
  insertCategory,
  insertCategoryMapping,
  insertUser,
  deleteCategory,
  fetchTransactionTypes,
} from "../api/api";

import "../assets/css/admin.css";

Modal.setAppElement('#root');

const Admin: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();

  const isActive = (path: string) => location.pathname === path;

  const [categories, setCategories] = useState<any[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [mappingCategoryId, setMappingCategoryId] = useState("");
  const [mappingCategoryType, setMappingCategoryType] = useState("");
  const [transactionType, setTransactionType] = useState("Income");
  const [isMappingModalOpen, setIsMappingModalOpen] = useState(false);

  const [mappingViewCategoryId, setMappingViewCategoryId] = useState("");
  const [categoryMappings, setCategoryMappings] = useState<any[]>([]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data as any[]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    getCategories();

    const collapseBtn = document.getElementById("collapseBtn");
    const sidebar = document.getElementById("sidebar");
    const handleCollapse = () => {
      if (sidebar) sidebar.classList.toggle("collapsed");
    };
    collapseBtn?.addEventListener("click", handleCollapse);
    return () => collapseBtn?.removeEventListener("click", handleCollapse);
  }, []);

  const handleInsertCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await insertCategory(categoryName, categoryType);
      if (result) {
        showToast("Category inserted successfully", "success");
        setCategoryName("");
        setCategoryType("");
        const refreshed = await fetchCategories();
        setCategories(refreshed as any[]);
        setIsModalOpen(false);
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
        mappingCategoryId,
        mappingCategoryType,
        transactionType
      );
      if (result) {
        showToast("Mapping inserted successfully", "success");
        setMappingCategoryId("");
        setMappingCategoryType("");
        setTransactionType("Income");
        setIsMappingModalOpen(false);
        if (mappingViewCategoryId) {
          const mappings = await fetchTransactionTypes(mappingViewCategoryId);
          setCategoryMappings(mappings as any[]);
        }
      } else {
        showToast("Insert mapping failed", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Error inserting mapping", "error");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id);
        const updated = await fetchCategories();
        setCategories(updated as any[]);
        showToast("Category deleted", "success");
      } catch (err) {
        console.error(err);
        showToast("Error deleting category", "error");
      }
    }
  };

  const handleCategorySelectForMappingView = async (categoryid: string) => {
    setMappingViewCategoryId(categoryid);
    try {
      const mappings = await fetchTransactionTypes(categoryid);
      setCategoryMappings(mappings as any[]);
    } catch (error) {
      console.error("Error fetching mappings:", error);
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
            <li><Link to="/dashboard" className={`nav-btn ${isActive("/dashboard") ? "active" : ""}`}><FontAwesomeIcon icon={faTachometerAlt} /> <span>Dashboard</span></Link></li>
            <li><Link to="/transactions" className={`nav-btn ${isActive("/transactions") ? "active" : ""}`}><FontAwesomeIcon icon={faExchangeAlt} /> <span>Transactions</span></Link></li>
            <li><Link to="/income" className={`nav-btn ${isActive("/income") ? "active" : ""}`}><FontAwesomeIcon icon={faWallet} /> <span>Income</span></Link></li>
            <li><Link to="/expense" className={`nav-btn ${isActive("/expense") ? "active" : ""}`}><FontAwesomeIcon icon={faWallet} /> <span>Expense</span></Link></li>
            <li><Link to="/planning" className={`nav-btn ${isActive("/planning") ? "active" : ""}`}><FontAwesomeIcon icon={faCalendarAlt} /> <span>Planning</span></Link></li>
            <li><Link to="/analytics" className={`nav-btn ${isActive("/analytics") ? "active" : ""}`}><FontAwesomeIcon icon={faChartLine} /> <span>Analytics</span></Link></li>
            <li><Link to="/settings" className={`nav-btn ${isActive("/settings") ? "active" : ""}`}><FontAwesomeIcon icon={faCog} /> <span>Settings</span></Link></li>
            <li><Link to="/admin" className={`nav-btn active`}><FontAwesomeIcon icon={faUser} /> <span>Admin</span></Link></li>
            <li><Link to="/" className="logout-btn"><FontAwesomeIcon icon={faSignOutAlt} /> <span>Logout</span></Link></li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard">
        <header className="topbar">
          <div className="topbar-content">
            <div className="title">Admin Panel</div>
            <div className="actions">
              <FontAwesomeIcon icon={faBell} />
              <div className="profile">{user ? `${user.firstname} ${user.lastname}` : ""}</div>
            </div>
          </div>
        </header>

        <section className="admin-section">
          <h6>Categories</h6>
          <button className="addbtn" onClick={() => setIsModalOpen(true)}>
            <FontAwesomeIcon icon={faPlus} /> Add New Category
          </button>
          <table className="data-table">
            <thead>
              <tr>
                
                <th>Name</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.categoryid}>
                
                  <td>{cat.category_name}</td>
                  <td>{cat.category_type}</td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDeleteCategory(cat.categoryid)}>
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Category Mapping View */}
          <div className="mapping-view">
            <div className="mapping-header">
            <h5>View Mappings</h5>
                  <button className="addmapbtn" onClick={() => {
                  setMappingCategoryId(mappingViewCategoryId);
                  const cat = categories.find(c => c.categoryid === mappingViewCategoryId);
                  setMappingCategoryType(cat?.category_type || "");
                  setIsMappingModalOpen(true);
                }}>
                  <FontAwesomeIcon icon={faPlus} /> Add Category Mapping
                </button>
            <select className="category-select"
              value={mappingViewCategoryId}
              onChange={(e) => handleCategorySelectForMappingView(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.categoryid} value={cat.categoryid}>
                  {cat.category_name}
                </option>
              ))}
            </select>
            </div>
      
            {categoryMappings.length > 0 && (
              <>
                <table className="data-table">
                  <thead>
                    <tr>
                   
                      <th>Category Type</th>
                      <th>Transaction Type</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryMappings.map((map) => (
                      <tr key={map.mapid}>
        
                       
                        <td>{map.categorytype}</td>
                        <td>{map.transactiontype}</td>
                        <td>
                      <button className="delete-btn" onClick={() => handleDeleteCategory(map.mapid)}>
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

               
              </>
            )}
          </div>
        </section>
      </main>

      {/* Add Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Add Category"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Add New Category</h2>
        <form onSubmit={handleInsertCategory}>
          <label>Name</label>
          <input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required />

          <label>Type</label>
          <select value={categoryType} onChange={(e) => setCategoryType(e.target.value)} required>
            <option value="">Select Type</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>

          <div className="modal-actions">
            <button type="submit">Submit</button>
            <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>

      {/* Add Mapping Modal */}
      <Modal
  isOpen={isMappingModalOpen}
  onRequestClose={() => setIsMappingModalOpen(false)}
  contentLabel="Add Category Mapping"
  className="modal"
  overlayClassName="overlay"
>
  <h2>Add Category Mapping</h2>
  <form onSubmit={handleInsertCategoryMapping}>
    {/* Let user choose ANY category from dropdown */}
    <div className="form-group">
      <label htmlFor="mappingCategoryId">Select Category:</label>
      <select
        id="mappingCategoryId"
        value={mappingCategoryId}
        onChange={(e) => setMappingCategoryId(e.target.value)}
        required
      >
        <option value="">-- Choose Category --</option>
        {categories.map((cat) => (
          <option key={cat.categoryid} value={cat.categoryid}>
            {cat.category_name}
          </option>
        ))}
      </select>
    </div>

    {/* Category Type input */}
    <div className="form-group">
      <label htmlFor="mappingCategoryType">Category Type:</label>
      <input
        id="mappingCategoryType"
        type="text"
        value={mappingCategoryType}
        onChange={(e) => setMappingCategoryType(e.target.value)}
        required
      />
    </div>

    {/* Transaction Type dropdown */}
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

    <div className="modal-actions">
      <button type="submit">Submit</button>
      <button type="button" onClick={() => setIsMappingModalOpen(false)}>Cancel</button>
    </div>
  </form>
</Modal>


      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
    </div>
  );
};

export default Admin;
