import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchDashboardData } from '../api/api'; // Import the API function
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
  const [dashboardData, setDashboardData] = useState<any>(null); // State to hold dashboard data 


  useEffect(() => {
    // Fetch the dashboard data when the component mounts
    const getDashboardData = async () => {
      try {
      const data = await fetchDashboardData();
       console.log(data); 
    if (Array.isArray(data)) {
      setDashboardData(data[0]); // Assuming data is an array and we're using the first item
    } else {
      setDashboardData(data); // fallback if data is not an array
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

  if (!dashboardData) {
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
              <Link to="/dashboard" className={`nav-btn ${isActive('/') ? 'active' : ''}`}>
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
                <div className="title">Dashboard</div>
                <div className="actions">
                  <button className="income-btn">Income</button>
                  <button className="expense-btn">Expense</button>
                  <FontAwesomeIcon icon={faBell} />
                  <div className="profile">{dashboardData.firstname} {dashboardData.lastname}</div>
                </div>
              </div>
            </header> 

        <section className="cards">
          <div className="card">
            <h3>Total Balance</h3>
            <p className="amount">Rs {dashboardData.balance}</p>
            <p className="note">{`+Rs ${parseFloat(dashboardData.balancechange) - 0} from last month`}</p>
          </div>
          <div className="card">
            <h3>Income <span className="down">&#x25BC;</span></h3>
            <p className="amount">Rs {dashboardData.totalIncome}</p>
            <p className="note">{`+Rs ${parseFloat(dashboardData.incomeChange) - 0} from last month`}</p>
          </div>
          <div className="card-expense">
            <h3>Expenses <span className="up">&#x25B2;</span></h3>
            <p className="amount">Rs {dashboardData.totalExpense}</p>
            <p className="note">{`+Rs ${parseFloat(dashboardData.expenseChange) - 0} from last month`}</p>
          </div>
          <div className="card">
            <h3>Savings <FontAwesomeIcon icon={faPiggyBank} /></h3>
            <p className="amount">Rs {dashboardData.savings}</p>
            <p className="note">{`${dashboardData.savingPercent}% of income`}</p>
          </div>
        </section>

        {/* Charts section remains unchanged */}
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
