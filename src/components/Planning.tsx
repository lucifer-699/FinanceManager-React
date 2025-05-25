import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../assets/css/planning.css';
import { fetchPlanning } from '../api/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars, faTachometerAlt, faExchangeAlt, faWallet,
  faCalendarAlt, faChartLine, faFileAlt, faCog,
  faSignOutAlt, faPlus, faBell
} from '@fortawesome/free-solid-svg-icons';

interface PlanningItem {
  category_name: string;
  category_type: string;
  alloted: string;
  used: string;
  remaining: string;
  percent_used: string;
}

const Planning: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const [planningData, setPlanningData] = useState<PlanningItem[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const getDashboardData = async () => {
      try {
        const data = await fetchPlanning();
        if (Array.isArray(data)) {
          setPlanningData(data);
        } else {
          setPlanningData([]);
        }

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

          return () => {
            if (collapseBtn) {
              collapseBtn.removeEventListener("click", handleCollapse);
            }
          };
        }, 0);
      } catch (error) {
        console.error("Error fetching planning data:", error);
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
            <div className="title">Financial Planning</div>
            <div className="actions">
              <button className="income-btn" onClick={() => navigate('/income')}>Income</button>
              <button className="expense-btn" onClick={() => navigate('/expense')}>Expense</button>
                <FontAwesomeIcon icon={faBell} />
                        <div className="profile">Sishir Shrestha</div>
            </div>
          </div>
        </header>

        <section className="planning-section">
          <div className="planning-header">
            <h2>Ongoing Financial Plans</h2>
            <button className="addbtn">
              <FontAwesomeIcon icon={faPlus} /> Add Plan
            </button>
          </div>

        <div className="planning-grid">
                    {planningData.length === 0 ? (
                        <p>No plans available.</p>
                    ) : (
                        planningData.map((plan, index) => {
                        const title = `${plan.category_name} : ${plan.category_type}`;
                        const goal = parseFloat(plan.alloted || '0');
                        const used = parseFloat(plan.used || '0');
                        const remaining = parseFloat(plan.remaining || '0');
                        const percent = parseFloat(plan.percent_used || '0');

                        return (
                            <div className="plan-card" key={index}>
                            <h3>{title}</h3>
                            <p>Goal: Rs {goal.toLocaleString()}</p>
                            <p>Used: Rs {used.toLocaleString()}</p>
                            <p>Remaining: Rs {remaining.toLocaleString()}</p>
                            <progress value={percent} max={100}></progress>
                            <p className="note">{percent}% completed</p>
                            </div>
                        );
                        })
                    )}
                    </div>

        </section>
      </main>
    </div>
  );
};

export default Planning;
