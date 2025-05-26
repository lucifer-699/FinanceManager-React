import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  faBars, faTachometerAlt, faExchangeAlt, faWallet,
  faCalendarAlt, faChartLine, faFileAlt, faCog,
  faSignOutAlt, faPlus, faEdit, faTrashAlt, faBell
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'react-modal';
import { fetchExpenseTable } from '../api/api';
import axios from 'axios';
import '../assets/css/expense.css';
import { storage } from '../storage';

Modal.setAppElement('#root');

const Expense: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const [expenseData, setExpenseData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [transactionTypes, setTransactionTypes] = useState<any[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const data = await fetchExpenseTable();
        setExpenseData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching expense data:', error);
      }
    };
    loadExpenses();

    const collapseBtn = document.getElementById('collapseBtn');
    const sidebar = document.getElementById('sidebar');

    const handleCollapse = () => {
      if (sidebar) sidebar.classList.toggle('collapsed');
    };

    if (collapseBtn) collapseBtn.addEventListener('click', handleCollapse);
    return () => {
      if (collapseBtn) collapseBtn.removeEventListener('click', handleCollapse);
    };
  }, []);

  const handleCategoryChange = async (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    try {
      const response = await axios.get('http://localhost:8442/finance/mapid', {
        params: { categoryid: categoryId },
      });
      const filtered = Array.isArray(response.data) ? response.data : [];
      setTransactionTypes(filtered);
    } catch (error) {
      console.error('Error fetching transaction types:', error);
    }
  };

  const openModal = async () => {
    setIsModalOpen(true);
    try {
      const response = await axios.get('http://localhost:8442/finance/categoryid');
      const dataArray = Array.isArray(response.data) ? response.data : [];
      const filteredCategories = dataArray.filter((cat: any) => cat.category_type === 'Expense');
      setCategories(filteredCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userid = storage.get('userid');
    try {
      const selectedMap = transactionTypes.find(t => t.transactiontype === selectedTransaction);
      const response = await axios.post('http://localhost:8442/finance/insert', null, {
        params: {
          userid,
          categoryid: selectedCategoryId,
          transaction_type: selectedTransaction,
          mapid: selectedMap?.mapid,
          amount
        }
      });
      if (response.data === true) {
        setIsModalOpen(false);
        setSelectedCategoryId('');
        setSelectedTransaction('');
        setAmount('');
        const updatedData = await fetchExpenseTable();
        setExpenseData(Array.isArray(updatedData) ? updatedData : []);
      } else {
        alert('Failed to insert expense.');
      }
    } catch (error) {
      console.error('Error submitting expense:', error);
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
        <nav>
          <ul>
            {([
              { path: '/dashboard', icon: faTachometerAlt, label: 'Dashboard' },
              { path: '/transactions', icon: faExchangeAlt, label: 'Transactions' },
              { path: '/income', icon: faWallet, label: 'Income' },
              { path: '/expense', icon: faWallet, label: 'Expense' },
              { path: '/planning', icon: faCalendarAlt, label: 'Planning' },
              { path: '/analytics', icon: faChartLine, label: 'Analytics' },
              { path: '/reports', icon: faFileAlt, label: 'Reports' },
              { path: '/settings', icon: faCog, label: 'Settings' }
            ]).map(({ path, icon, label }) => (
              <li key={path}>
                <Link to={path} className={`nav-btn ${isActive(path) ? 'active' : ''}`}>
                  <FontAwesomeIcon icon={icon} /> <span>{label}</span>
                </Link>
              </li>
            ))}
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
            <div className="title">Expense</div>
            <div className="actions">
              <FontAwesomeIcon icon={faBell} />
              <div className="profile">Sishir Shrestha</div>
            </div>
          </div>
        </header>

        <section className="section-header">
          <h2>Expense Overview</h2>
          <button className="addbtn" onClick={openModal}>
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
                    <td>
                      <button className="edit-btn"><FontAwesomeIcon icon={faEdit} /></button>
                      <button className="delete-btn"><FontAwesomeIcon icon={faTrashAlt} /></button>
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

      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} className="modal" overlayClassName="overlay">
        <h2>Add Expense</h2>
        <form onSubmit={handleSubmit}>
          <label>Category</label>
          <select value={selectedCategoryId} onChange={e => handleCategoryChange(e.target.value)} required>
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.categoryid} value={cat.categoryid}>
                {cat.category_name}
              </option>
            ))}
          </select>

          <label>Transaction Type</label>
          <select value={selectedTransaction} onChange={e => {
            setSelectedTransaction(e.target.value);
            const selected = transactionTypes.find(t => t.transactiontype === e.target.value);
            setMapId(selected?.mapid || '');
          }} required>
            <option value="">Select Type</option>
            {transactionTypes.map(t => (
              <option key={t.mapid} value={t.transactiontype}>{t.transactiontype}</option>
            ))}
          </select>

          <label>Amount</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required />

          <div className="modal-actions">
            <button type="submit">Submit</button>
            <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Expense;
