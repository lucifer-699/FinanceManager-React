import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import '../assets/css/dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars, faTachometerAlt, faExchangeAlt, faWallet,
  faCalendarAlt, faChartLine, faFileAlt, faCog,
  faSignOutAlt, faBell, faPiggyBank
} from '@fortawesome/free-solid-svg-icons';

const Dashboard: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

useEffect(() => {
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
}, []);



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
              <Link to="/" className={`nav-btn ${isActive('/') ? 'active' : ''}`}>
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
              <Link to="/login" className="logout-btn">
                <FontAwesomeIcon icon={faSignOutAlt} /> <span>Logout</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard">
        <header className="topbar">
          <div className="topbar-content">
            <div className="logo">💼 <span>FinDash</span></div>
            <div className="actions">
              <button className="income-btn">Income</button>
              <button className="expense-btn">Expense</button>
              <FontAwesomeIcon icon={faBell} />
              <div className="profile">Sishir Shrestha</div>
            </div>
          </div>
        </header>

        <section className="cards">
          <div className="card">
            <h3>Total Balance</h3>
            <p className="amount">$12,456.78</p>
            <p className="note">+5.2% from last month</p>
          </div>
          <div className="card">
            <h3>Income <span className="down">&#x25BC;</span></h3>
            <p className="amount">$4,500.00</p>
            <p className="note">+$650 from last month</p>
          </div>
          <div className="card-expense">
            <h3>Expenses <span className="up">&#x25B2;</span></h3>
            <p className="amount">$2,043.22</p>
            <p className="note">+$320 from last month</p>
          </div>
          <div className="card">
            <h3>Savings <FontAwesomeIcon icon={faPiggyBank} /></h3>
            <p className="amount">$1,200.00</p>
            <p className="note">15% of income</p>
          </div>
        </section>

        <section className="charts">
          <div className="chart-card">
            <h3>Income vs Expenses</h3>
            <select>
              <option>Last 30 days</option>
              <option>Last 7 days</option>
              <option>Last 24 hours</option>
            </select>
            <div className="bar-placeholder">[Bar Chart Placeholder]</div>
          </div>
          <div className="chart-card">
            <h3>Spending by Category</h3>
            <div className="pie-placeholder">[Pie Chart Placeholder]</div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
