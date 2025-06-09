/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { useUser } from "../context/UserContext"; 
import {
  fetchPlanning,
  fetchCategories,
  fetchTransactionTypes,
  insertBudgetPlan
} from '../api/api';
import { storage } from '../storage';
import '../assets/css/planning.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars, faTachometerAlt, faExchangeAlt, faWallet,
  faCalendarAlt, faChartLine, faCog,
  faSignOutAlt, faPlus, faBell
} from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';

interface PlanningItem {
  category_name: string;
  category_type: string;
  alloted: string;
  used: string;
  remaining: string;
  percent_used: string;
}

Modal.setAppElement('#root');

const Planning: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;
  const { user } = useUser();
  const [planningData, setPlanningData] = useState<PlanningItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [transactionTypes, setTransactionTypes] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState('');
  const [mapId, setMapId] = useState('');
  const [amount, setAmount] = useState('');

  // Toast state & helper
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch planning data
  const loadPlanningData = async () => {
    try {
      const data = await fetchPlanning();
      if (Array.isArray(data)) setPlanningData(data);
      else setPlanningData([]);
    } catch (error) {
      console.error("Error fetching planning data:", error);
    }
  };

  // Fetch categories
  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      // Only include categories where category_type === 'Expense'
      const filtered = Array.isArray(data) ? data.filter((c: any) => c.category_type === 'Expense') : [];
      setCategories(Array.isArray(filtered) ? filtered : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // On mount
  useEffect(() => {
    loadPlanningData();
    loadCategories();

    const collapseBtn = document.getElementById("collapseBtn");
    const sidebar = document.getElementById("sidebar");

    const handleCollapse = () => sidebar?.classList.toggle("collapsed");
    collapseBtn?.addEventListener("click", handleCollapse);
    return () => collapseBtn?.removeEventListener("click", handleCollapse);
  }, []);

  // When category changes
  const handleCategoryChange = async (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedTransaction('');
    setTransactionTypes([]);
    setMapId('');
    if (categoryId) {
      try {
        const types = await fetchTransactionTypes(categoryId);
        setTransactionTypes(Array.isArray(types) ? types : []);
      } catch (error) {
        console.error("Error fetching transaction types:", error);
      }
    }
  };

  // When transaction type changes
  const handleTransactionChange = (transactionType: string) => {
    setSelectedTransaction(transactionType);
    const selectedMap = transactionTypes.find(t => t.transactiontype === transactionType);
    setMapId(selectedMap?.mapid || '');
  };

  // On form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userid = storage.get("userid");

    if (!userid) {
      showToast("User not logged in.", "error");
      return;
    }

    if (!selectedCategory || !selectedTransaction || !amount) {
      showToast("Please fill all fields.", "error");
      return;
    }

    try {
      await insertBudgetPlan(userid, selectedCategory, mapId, amount);
      showToast("Budget plan added successfully!", "success");
      setIsModalOpen(false);
      setSelectedCategory('');
      setSelectedTransaction('');
      setMapId('');
      setAmount('');
      loadPlanningData();
    } catch (error) {
      showToast("Failed to add budget plan.", "error");
      console.error(error);
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

      <main className="dashboard">
        <header className="topbar">
          <div className="topbar-content">
            <div className="title">Financial Planning</div>
            <div className="actions">
              <button className="income-btn" onClick={() => navigate('/income')}>Income</button>
              <button className="expense-btn" onClick={() => navigate('/expense')}>Expense</button>
              <FontAwesomeIcon icon={faBell} />
             <div className="profile">{user ? `${user.firstname} ${user.lastname}` : ""}</div> 
            </div>
          </div>
        </header>

        <section className="planning-section">
          <div className="planning-header">
            <h2>Ongoing Financial Plans</h2>
            <button className="add-plan-btn" onClick={() => setIsModalOpen(true)}>
              <FontAwesomeIcon icon={faPlus} /> Add Plan
            </button>
          </div>

          <div className="planning-grid">
            {planningData.length === 0 ? (
              <p>No plans available.</p>
            ) : (
              planningData.map((plan, index) => {
                const goal = parseFloat(plan.alloted || '0');
                const used = parseFloat(plan.used || '0');
                const remaining = parseFloat(plan.remaining || '0');
                const percent = parseFloat(plan.percent_used || '0');
                return (
                  <div className="plan-card" key={index}>
                    <h3>{`${plan.category_name} : ${plan.category_type}`}</h3>
                    <p>Goal: Rs {goal.toLocaleString()}</p>
                    <p>Used: Rs {used.toLocaleString()}</p>
                    <p>Remaining: Rs {remaining.toLocaleString()}</p>
                    <progress value={percent} max={100}></progress>
                    <p className="note">{percent}% completed</p>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>

      {/* Add Plan Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Add Budget Plan"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Add New Budget Plan</h2>
        <form onSubmit={handleSubmit}>
          <label>Category</label>
          <select
            value={selectedCategory}
            onChange={e => handleCategoryChange(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.categoryid} value={cat.categoryid}>
                {cat.category_name}
              </option>
            ))}
          </select>

          <label>Transaction Type</label>
          <select
            value={selectedTransaction}
            onChange={e => handleTransactionChange(e.target.value)}
            required
          >
            <option value="">Select Type</option>
            {transactionTypes.map(type => (
              <option key={type.mapid} value={type.transactiontype}>
                {type.transactiontype}
              </option>
            ))}
          </select>

          <label>Amount</label>
          <input
            type="number"
            min="0"
            value={amount}
            onChange={e => setAmount(e.target.value)}
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

export default Planning;