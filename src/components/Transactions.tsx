import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../assets/css/transactions.css';
import { fetchTransactionTable } from '../api/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars, faTachometerAlt, faExchangeAlt, faWallet,
  faCalendarAlt, faChartLine, faFileAlt, faCog,
  faSignOutAlt, faBell
} from '@fortawesome/free-solid-svg-icons';

const Transactions: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
const [transactionData, settransactionData] = useState<any[]>([]);
  const navigate = useNavigate();
  
 useEffect(() => {
    // Fetch the dashboard data when the component mounts
    const getDashboardData = async () => {
      try {
      const data = await fetchTransactionTable();
      if (Array.isArray(data)) {
        settransactionData(data); // If data is already an array, use it directly
      } else {
        settransactionData([]); // fallback: ensure it's always an array
      }

      // Move collapseBtn and sidebar logic into useEffect after DOM is updated
      setTimeout(() => {
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

        // Clean up event listener on unmount
        return () => {
          if (collapseBtn) {
        collapseBtn.removeEventListener("click", handleCollapse);
          }
        };
      }, 0);
      } catch (error) {
      console.error("Error fetching dashboard data:", error);
      }
    };

    getDashboardData();

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
  }, []); // Empty dependency array to run once when the component mounts

  if (!transactionData) {
    return <div>Loading...</div>; // Show a loading state until the data is fetched
  }



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
              <Link to="/transaction" className={`nav-btn ${isActive('/transaction') ? 'active' : ''}`}>
                <FontAwesomeIcon icon={faWallet} /> <span>transaction</span>
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
              <Link to="/reports" className={`nav-btn ${isActive('/reports') ? 'active' : ''}`}>
                <FontAwesomeIcon icon={faFileAlt} /> <span>Reports</span>
              </Link>
            </li>
            <li>
              <Link to="/settings" className={`nav-btn ${isActive('/settings') ? 'active' : ''}`}>
                <FontAwesomeIcon icon={faCog} /> <span>Settings</span>
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
              <div className="profile">Sishir Shrestha</div>
            </div>
          </div>
        </header>

        <section className="transaction-section">
          <div className="transaction-header">
            <h2>Recent Transactions</h2>
            <select>
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>This Month</option>
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
                                    <td>{transaction.amount ? `Rs  ${parseFloat(transaction.amount).toFixed(0)}` : 'N/A'}</td>
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