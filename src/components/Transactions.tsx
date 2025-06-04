/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../assets/css/transactions.css';
import { fetchTransactionTable } from '../api/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useUser } from "../context/UserContext"; 
import {
  faBars, faTachometerAlt, faExchangeAlt, faWallet,
  faCalendarAlt, faChartLine, faCog, faSignOutAlt, faBell,
  faUser
} from '@fortawesome/free-solid-svg-icons';

const Transactions: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const { user } = useUser();
  const navigate = useNavigate();

  // Current month and year
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
  const defaultMonth = `${currentYear}-${currentMonth}`;

  const [selectedMonth, setSelectedMonth] = useState<string>(defaultMonth);
  const [transactionData, setTransactionData] = useState<any[]>([]);

  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const monthNum = String(i + 1).padStart(2, '0');
    return `${currentYear}-${monthNum}`;
  });

  useEffect(() => {
    const getTransactionData = async () => {
      try {
        const data = await fetchTransactionTable(selectedMonth);
        setTransactionData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching transaction table data:", error);
      }
    };

    getTransactionData();

    // Sidebar collapse logic
    const collapseBtn = document.getElementById("collapseBtn");
    const sidebar = document.getElementById("sidebar");

    const handleCollapse = () => {
      if (sidebar) {
        sidebar.classList.toggle("collapsed");
      }
    };

    if (collapseBtn) {
      collapseBtn.addEventListener("click", handleCollapse);
    }

    return () => {
      if (collapseBtn) {
        collapseBtn.removeEventListener("click", handleCollapse);
      }
    };
  }, [selectedMonth]);

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
            <div className="title">Transactions</div>
            <div className="actions">
              <button className="income-btn" onClick={() => navigate('/income')}>Income</button>
              <button className="expense-btn" onClick={() => navigate('/expense')}>Expense</button>
              <FontAwesomeIcon icon={faBell} />
              <div className="profile">{user ? `${user.firstname} ${user.lastname}` : ""}</div> 
            </div>
          </div>
        </header>

        <section className="transaction-section">
          <div className="transaction-header">
            <h2>Recent Transactions</h2>
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
              {monthOptions.map((month) => (
                <option key={month} value={month}>
                  {new Date(`${month}-01`).toLocaleString("default", { month: "long", year: "numeric" })}
                </option>
              ))}
            </select>
          </div>

          <table className="transaction-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Source</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {transactionData.length > 0 ? (
                transactionData.map((transaction, index) => (
                  <tr key={index}>
                    <td>{transaction.createdate ? new Date(transaction.createdate).toISOString().slice(0, 10) : 'N/A'}</td>
                    <td>{transaction.category_name || 'N/A'}</td>
                    <td>{transaction.transactiontype || 'N/A'}</td>
                    <td>{transaction.amount ? `Rs ${parseFloat(transaction.amount).toFixed(0)}` : 'N/A'}</td>
                    <td>{transaction.typed || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>No transaction records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default Transactions;
