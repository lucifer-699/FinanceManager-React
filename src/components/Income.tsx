import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../assets/css/income.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars, faTachometerAlt, faExchangeAlt, faWallet,
  faCalendarAlt, faChartLine, faFileAlt, faCog,
  faSignOutAlt,faPlus,faEdit,faTrashAlt,faBell
} from '@fortawesome/free-solid-svg-icons'; // assuming global or modular styles
import { useEffect } from 'react';

const Income: React.FC = () => {
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
           <div className="title">Income</div>
           <div className="actions">
                <button className="income-btn">Income</button>
                <button className="expense-btn">Expense</button>
                    <FontAwesomeIcon icon={faBell} />
                <div className="profile">Sishir Shrestha</div>
          </div>
          </div>
        </header>

        <section className="section-header">
          <h2>Income Overview</h2>
          <button className="add-btn"><FontAwesomeIcon icon={faPlus}/> Add Income</button>
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
              <tr>
                <td>2025-05-10</td>
                <td>Salary</td>
                <td>$3,000.00</td>
                <td>Job</td>
                <td>
                  <button className="edit-btn"><FontAwesomeIcon icon={faEdit} /></button>
                  <button className="delete-btn"><FontAwesomeIcon icon={faTrashAlt} /></button>
                </td>
              </tr>
              <tr>
                <td>2025-05-03</td>
                <td>Freelance Project</td>
                <td>$1,200.00</td>
                <td>Freelance</td>
                <td>
              <button className="edit-btn"><FontAwesomeIcon icon={faEdit} /></button>
                  <button className="delete-btn"><FontAwesomeIcon icon={faTrashAlt} /></button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default Income;
