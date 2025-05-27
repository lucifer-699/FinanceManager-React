/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  faSignOutAlt, faBell
} from '@fortawesome/free-solid-svg-icons';
import '../assets/css/analytics.css';

const Analytics: React.FC = () => {
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
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
            <li><a href="/dashboard" className="nav-btn"><FontAwesomeIcon icon={faTachometerAlt} /> <span>Dashboard</span></a></li>
            <li><a href="/transactions" className="nav-btn"><FontAwesomeIcon icon={faExchangeAlt} /> <span>Transactions</span></a></li>
            <li><a href="/income" className="nav-btn"><FontAwesomeIcon icon={faWallet} /> <span>Income</span></a></li>
            <li><a href="/expense" className="nav-btn"><FontAwesomeIcon icon={faWallet} /> <span>Expense</span></a></li>
            <li><a href="/planning" className="nav-btn"><FontAwesomeIcon icon={faCalendarAlt} /> <span>Planning</span></a></li>
            <li><a href="/analytics" className="nav-btn active"><FontAwesomeIcon icon={faChartLine} /> <span>Analytics</span></a></li>
            <li><a href="/settings" className="nav-btn"><FontAwesomeIcon icon={faCog} /> <span>Settings</span></a></li>
            <li><a href="/" className="logout-btn"><FontAwesomeIcon icon={faSignOutAlt} /> <span>Logout</span></a></li>
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
              <div className="profile">User</div>
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
