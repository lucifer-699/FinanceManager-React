/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useUser } from "../context/UserContext"; 
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Modal from 'react-modal';
import { deleteTransaction } from '../api/api';
import {
  fetchExpenseTable,
  fetchCategories,
  fetchTransactionTypes,
  insertExpenseTransaction,
} from '../api/api';
import { storage } from "../storage";

import '../assets/css/expense.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars, faTachometerAlt, faExchangeAlt, faWallet,
  faCalendarAlt, faChartLine, faCog,
  faSignOutAlt, faPlus, faEdit, faTrashAlt, faBell,
  faUser
} from '@fortawesome/free-solid-svg-icons';

Modal.setAppElement('#root'); // for accessibility

const Expense: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const { user } = useUser();
  const [expenseData, setExpenseData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [transactionTypes, setTransactionTypes] = useState<any[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState('');
  const [mapId, setMapId] = useState('');
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  // Month dropdown options for current year
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const monthNum = String(i + 1).padStart(2, '0');
    return `${currentYear}-${monthNum}`;
  });

  // Month filter state, default to current month YYYY-MM
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 7);
  });

  const handleDelete = async (transactionid: string) => {
  const userid = storage.get("userid");
  const confirmDelete = window.confirm("Are you sure you want to delete this income record?");
  if (!confirmDelete) return;

  try {
    const success = await deleteTransaction(transactionid, userid);
    if (success) {
      showToast("Income deleted successfully!", "success");
      await getExpenseData(month); // Refresh table data
    } else {
      showToast("Failed to delete income.", "error");
    }
  } catch (error) {
    showToast("Error deleting income.", "error");
    console.error("Delete error:", error);
  }
};

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const getExpenseData = async (filterMonth: string) => {
    try {
      const data = await fetchExpenseTable(filterMonth);
      setExpenseData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching expense data:", error);
    }
  };

  useEffect(() => {
    getExpenseData(month);

    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        if (Array.isArray(data)) {
          const expenseCats = data.filter((c: any) => c.category_type === "Expense");
          setCategories(expenseCats);
        } else {
          setCategories([]);
          console.error("Fetched categories data is not an array:", data);
        }
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

    if (collapseBtn) collapseBtn.addEventListener("click", handleCollapse);
    return () => {
      if (collapseBtn) collapseBtn.removeEventListener("click", handleCollapse);
    };
  }, [month]);

  const handleCategoryChange = async (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedTransaction('');
    setTransactionTypes([]);
    try {
      const types = await fetchTransactionTypes(categoryId);
      setTransactionTypes(Array.isArray(types) ? types : []);
    } catch (error) {
      console.error("Error fetching transaction types:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userid = storage.get("userid");
    try {
      const success = await insertExpenseTransaction(
        userid,
        selectedCategory,
        'Expense',
        mapId,
        amount,
        remarks
      );
      if (success) {
        showToast("Expense added successfully!", "success");
        setIsModalOpen(false);
        setSelectedCategory('');
        setSelectedTransaction('');
        setAmount('');
        setTransactionTypes([]);
        const updatedData = await fetchExpenseTable(month);
        setExpenseData(Array.isArray(updatedData) ? updatedData : []);
      } else {
        showToast("Failed to add expense.", "error");
      }
    } catch (error) {
      showToast("Error submitting expense.", "error");
      console.error(error);
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
                     <Link to="/dashboard" className={`nav-btn ${isActive('/dashboard') ? 'active' : ''}`}>
                       <FontAwesomeIcon icon={faTachometerAlt} /> <span>Dashboard</span>
                     </Link>
                   </li>
                   <li>
                     <Link to="/transactions" className={`nav-btn ${isActive('/transactions') ? 'active' : ''}`}>
                       <FontAwesomeIcon icon={faExchangeAlt} /> <span>Transactions</span>
                     </Link>
                   </li>
                   <li>
                     <Link to="/income" className={`nav-btn ${isActive('/income') ? 'active' : ''}`}>
                       <FontAwesomeIcon icon={faWallet} /> <span>Income</span>
                     </Link>
                   </li>
                   <li>
                     <Link to="/expense" className={`nav-btn ${isActive('/expense') ? 'active' : ''}`}>
                       <FontAwesomeIcon icon={faWallet} /> <span>Expense</span>
                     </Link>
                   </li>
                   <li>
                     <Link to="/planning" className={`nav-btn ${isActive('/planning') ? 'active' : ''}`}>
                       <FontAwesomeIcon icon={faCalendarAlt} /> <span>Planning</span>
                     </Link>
                   </li>
                   <li>
                     <Link to="/analytics" className={`nav-btn ${isActive('/analytics') ? 'active' : ''}`}>
                       <FontAwesomeIcon icon={faChartLine} /> <span>Analytics</span>
                     </Link>
                   </li>
                   <li>
                     <Link to="/settings" className={`nav-btn ${isActive('/settings') ? 'active' : ''}`}>
                       <FontAwesomeIcon icon={faCog} /> <span>Settings</span>
                     </Link>
                   </li>
                   <li>
                     <Link to="/admin" className={`nav-btn ${isActive('/admin') ? 'active' : ''}`}>
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

      {/* Main */}
      <main className="dashboard">
        <header className="topbar">
          <div className="topbar-content">
            <div className="title">Expense</div>
            <div className="actions">
              <FontAwesomeIcon icon={faBell} />
             <div className="profile">{user ? `${user.firstname} ${user.lastname}` : ""}</div> 
            </div>
          </div>
        </header>

        <section className="section-header">
          <h2>Expense Overview</h2>
          {/* Month dropdown filter */}
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="month-select"
          >
            {monthOptions.map((m) => (
              <option key={m} value={m}>
                {new Date(`${m}-01`).toLocaleString('default', { month: 'long', year: 'numeric' })}
              </option>
            ))}
          </select>
          <button className="addbtn" onClick={() => setIsModalOpen(true)}>
            <FontAwesomeIcon icon={faPlus} /> Add Expense
          </button>
        </section>

        <section className="table-section">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Source</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Remarks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenseData.length > 0 ? (
                expenseData.map((expense, index) => (
                  <tr key={index}>
                    <td>{expense.createDate ? new Date(expense.createDate).toISOString().slice(0, 10) : 'N/A'}</td>
                    <td>{expense.categoryName || 'N/A'}</td>
                    <td>{expense.amount ? `Rs ${parseFloat(expense.amount).toFixed(0)}` : 'N/A'}</td>
                    <td>{expense.categoryType || 'N/A'}</td>
                     <td>{expense.remarks || 'N/A'}</td>
                    <td>
                      <button
                                         className="delete-btn"
                                         onClick={() => handleDelete(expense.transactionid)}
                                       >
                                         <FontAwesomeIcon icon={faTrashAlt} />
                                       </button>
                                       </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5}>No expense records found.</td></tr>
              )}
            </tbody>
          </table>
        </section>
      </main>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Add Expense"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Add New Expense</h2>
        <form onSubmit={handleSubmit}>
          <label>Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.categoryid} value={cat.categoryid}>
                {cat.category_name}
              </option>
            ))}
          </select>

          <label>Transaction Type</label>
          <select
            value={selectedTransaction}
            onChange={(e) => {
              const selectedMap = transactionTypes.find((t) => t.transactiontype === e.target.value);
              setSelectedTransaction(e.target.value);
              setMapId(selectedMap?.mapid || '');
            }}
            required
          >
            <option value="">Select Type</option>
            {transactionTypes.map((type) => (
              <option key={type.mapid} value={type.transactiontype}>
                {type.transactiontype}
              </option>
            ))}
          </select>

          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            required
          />
     <label>Remarks</label>
          <input
            type="text"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            required
          />
          <div className="modal-actions">
            <button type="submit">Submit</button>
            <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>

      {/* Toast Notification */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Expense;
