import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../assets/css/expense.css';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars, faTachometerAlt, faExchangeAlt, faWallet,
  faCalendarAlt, faChartLine, faFileAlt, faCog,
  faSignOutAlt,faBell
} from '@fortawesome/free-solid-svg-icons'; // assuming global or modular styles

const Analytics: React.FC = () => {
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
               <button className="income-btn">Income</button>
               <button className="expense-btn">Expense</button>
               <FontAwesomeIcon icon={faBell} />
               <div className="profile">Sishir Shrestha</div>
             </div>
           </div>
         </header>

      <section className="charts">
        <div className="chart-card">
          <h3>Spending Trends Over Time</h3>
          <canvas id="lineChart"></canvas>
        </div>

        <div className="chart-card">
          <h3>Income vs Expenses</h3>
          <canvas id="barChart"></canvas>
        </div>
      </section>
    </main>
  </div>
  );
};

export default Analytics;
