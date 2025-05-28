/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../assets/css/settings.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useUser } from "../context/UserContext"; 
import {
  faBars, faTachometerAlt, faExchangeAlt, faWallet,
  faCalendarAlt, faChartLine, faCog,
  faSignOutAlt, faBell
} from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';

const Income: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const [theme, setTheme] = useState('light');         // Current applied theme
  const [selectedTheme, setSelectedTheme] = useState('light'); // Dropdown value

  const isActive = (path: string) => location.pathname === path;

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    setSelectedTheme(savedTheme);
  }, []);

  // Apply theme class to root element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark-mode');
    } else {
      root.classList.remove('dark-mode');
    }
  }, [theme]);

  // Sidebar collapse logic
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

  const handleSavePreferences = () => {
    setTheme(selectedTheme);
    localStorage.setItem('theme', selectedTheme);
    alert(`Preferences saved with ${selectedTheme} mode!`);
  };

  return (
    <div className={`container ${theme === 'dark' ? 'dark-mode' : ''}`}>
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
            <div className="title">Income</div>
            <div className="actions">
              <button className="income-btn" onClick={() => navigate('/income')}>Income</button>
              <button className="expense-btn" onClick={() => navigate('/expense')}>Expense</button>
              <FontAwesomeIcon icon={faBell} />
              <div className="profile">{user ? `${user.firstname} ${user.lastname}` : ""}</div> 
            </div>
          </div>
        </header>

        <section className="settings">
          <h2>Settings</h2>

          <div className="settings-section">
            <h3>Profile Information</h3>
            <form>
              <label>
                Full Name:
                <input type="text" placeholder="Sishir Shrestha" />
              </label>
              <label>
                Email:
                <input type="email" placeholder="john@example.com" />
              </label>
              <label>
                Phone:
                <input type="tel" placeholder="+1234567890" />
              </label>
              <button type="submit">Save Profile</button>
            </form>
          </div>

          <div className="settings-section">
            <h3>Change Password</h3>
            <form>
              <label>
                Current Password:
                <input type="password" />
              </label>
              <label>
                New Password:
                <input type="password" />
              </label>
              <label>
                Confirm New Password:
                <input type="password" />
              </label>
              <button type="submit">Update Password</button>
            </form>
          </div>

          <div className="settings-section">
            <h3>Preferences</h3>
            <label className="checkbox-container">
              <input type="checkbox" />
              <span className="checkbox-label">Enable Notifications</span>
              <span className="checkmark"></span>
            </label>

            <label>
              Theme:
              <select value={selectedTheme} onChange={(e) => setSelectedTheme(e.target.value)}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>

            <button type="button" onClick={handleSavePreferences}>Save Preferences</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Income;
