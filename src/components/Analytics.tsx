/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useUser } from "../context/UserContext"; 
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  fetchMonthlyIncomeExpense,
  fetchAnalyticsCategory
} from '../api/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars, faTachometerAlt, faExchangeAlt, faWallet,
  faCalendarAlt, faChartLine, faCog,
  faSignOutAlt, faBell,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import '../assets/css/analytics.css';

const Analytics: React.FC = () => {
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
 const { user } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    const loadData = async () => {
      try {
        const incomeExpenseData = await fetchMonthlyIncomeExpense();
        const analyticsCategories = await fetchAnalyticsCategory();
        setMonthlyData(incomeExpenseData as any[]);
        setCategoryData(analyticsCategories as any[]);
      } catch (error) {
        console.error('Failed to load analytics data:', error);
      }
    };

    loadData();
  }, []);

  const lineChartData = monthlyData.map(item => ({
    year_month: item.year_month,
    income: parseFloat(item.totalincome),
    expense: parseFloat(item.totalexpense),
    savings: parseFloat(item.totalincome) - parseFloat(item.totalexpense),
  }));


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

    
  function isActive(path: string) {
    return window.location.pathname === path;
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
            <div className="title">Analytics</div>
            <div className="actions">
             <button className="income-btn" onClick={() => navigate('/income')}>Income</button>
              <button className="expense-btn" onClick={() => navigate('/expense')}>Expense</button>
              <FontAwesomeIcon icon={faBell} />
            <div className="profile">{user ? `${user.firstname} ${user.lastname}` : ""}</div> 
            </div>
          </div>
        </header>

        <section className="charts">
          <div className="chart-card">
            <h3>Monthly Income vs Expenses</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year_month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalincome" fill="#4CAF50" name="Income" />
                <Bar dataKey="totalexpense" fill="#F44336" name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Income, Expense & Savings Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year_month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#4CAF50" name="Income" />
                <Line type="monotone" dataKey="expense" stroke="#F44336" name="Expense" />
                <Line type="monotone" dataKey="savings" stroke="#2196F3" name="Savings" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="transaction-section">
          <div className="transaction-header">
            <h2>Overspending Categories</h2>
          </div>
          <table className="transaction-table-over">
            <thead>
              <tr>
                <th>Category</th>
                <th>Allotted</th>
                <th>Used</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {categoryData.filter(item => parseFloat(item.remaining) < 0).map((item, idx) => (
                <tr key={idx}>
                  <td>{item.category_name}</td>
                  <td>Rs {item.alloted}</td>
                  <td>Rs {item.used}</td>
                  <td style={{ color: "red", fontWeight: "bold" }}>
                    Overspent Rs {Math.abs(parseFloat(item.remaining))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="transaction-header">
            <h3>Underspending Categories</h3>
          </div>
          <table className="transaction-table-under">
            <thead>
              <tr>
                <th>Category</th>
                <th>Allotted</th>
                <th>Used</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {categoryData.filter(item => parseFloat(item.remaining) >= 0).map((item, idx) => (
                <tr key={idx}>
                  <td>{item.category_name}</td>
                  <td>Rs {item.alloted}</td>
                  <td>Rs {item.used}</td>
                  <td style={{ color: "green", fontWeight: "bold" }}>
                    Saved Rs {parseFloat(item.remaining)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default Analytics;
