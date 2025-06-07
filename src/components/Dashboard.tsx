/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { fetchDashboardData } from '../api/api';
import '../assets/css/dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars, faTachometerAlt, faExchangeAlt, faWallet,
  faCalendarAlt, faChartLine, faCog,
  faSignOutAlt, faBell, faPiggyBank,
  faUser, faEye, faEyeSlash
} from '@fortawesome/free-solid-svg-icons';

const Dashboard: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    const stored = localStorage.getItem('showSensitiveData');
    return stored === null ? true : stored === 'true';
  });

  const toggleVisibility = () => {
    const newValue = !isVisible;
    setIsVisible(newValue);
    localStorage.setItem('showSensitiveData', newValue.toString());
  };

  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const formatAmount = (amount: number | string) => {
    return isVisible ? `Rs ${amount}` : 'Rs ****';
  };

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        const data = await fetchDashboardData();
        console.log(data);

        if (Array.isArray(data) && data.length > 0) {
          const d = data[0];
          if (d.firstname && d.lastname) {
            setUser({ firstname: d.firstname, lastname: d.lastname });
          }
          setDashboardData({
            ...d,
            balance: d.balance ?? 0,
            balancechange: d.balancechange ?? 0,
            totalIncome: d.totalIncome ?? 0,
            incomeChange: d.incomeChange ?? 0,
            totalExpense: d.totalExpense ?? 0,
            expenseChange: d.expenseChange ?? 0,
            savings: d.savings ?? 0,
            savingPercent: d.savingPercent ?? 0,
          });
        } else {
          setDashboardData({
            balance: 0,
            balancechange: 0,
            totalIncome: 0,
            incomeChange: 0,
            totalExpense: 0,
            expenseChange: 0,
            savings: 0,
            savingPercent: 0,
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setDashboardData({
          balance: 0,
          balancechange: 0,
          totalIncome: 0,
          incomeChange: 0,
          totalExpense: 0,
          expenseChange: 0,
          savings: 0,
          savingPercent: 0,
        });
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
  }, [setUser]);

  if (!dashboardData) {
    return <div>Loading...</div>;
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
        {/* Eye Toggle Button */}
        <div className="eye-toggle">
          <button onClick={toggleVisibility}>
            <FontAwesomeIcon icon={isVisible ? faEye : faEyeSlash} size="lg" />
          </button>
        </div>

        <header className="topbar">
          <div className="topbar-content">
            <div className="title">Financial Dashboard</div>
            <div className="profile">Welcome back, {user ? `${user.firstname} ${user.lastname}` : ''}</div>
            <div className="actions">
              <button className="income-btn" onClick={() => navigate('/income')}>Income</button>
              <button className="expense-btn" onClick={() => navigate('/expense')}>Expense</button>
              <FontAwesomeIcon icon={faBell} />
              <div className="profile">{user ? `${user.firstname} ${user.lastname}` : ''}</div>
            </div>
          </div>
        </header>

        <section className="cards">
          <div className="card">
            <h3>Total Balance</h3>
            <p className="amount">{formatAmount(dashboardData.balance)}</p>
            <p className="note">{`+Rs ${parseFloat(dashboardData.balancechange) - 0} from last month`}</p>
          </div>
          <div className="card">
            <h3>Income <span className="down">&#x25BC;</span></h3>
            <p className="amount">{formatAmount(dashboardData.totalIncome)}</p>
            <p className="note">{`+Rs ${parseFloat(dashboardData.incomeChange) - 0} from last month`}</p>
          </div>
          <div className="card-expense">
            <h3>Expenses <span className="up">&#x25B2;</span></h3>
            <p className="amount">{formatAmount(dashboardData.totalExpense)}</p>
            <p className="note">{`+Rs ${parseFloat(dashboardData.expenseChange) - 0} from last month`}</p>
          </div>
          <div className="card">
            <h3>Savings <FontAwesomeIcon icon={faPiggyBank} /></h3>
            <p className="amount">{formatAmount(dashboardData.savings)}</p>
            <p className="note">{`${dashboardData.savingPercent}% of income`}</p>
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
