import React, { useEffect ,useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api/api'; // <-- Correctly imported
import '../assets/css/login.css';
import { useAuth } from '../context/auth-context';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setCredentials } = useAuth(); 

 useEffect(() => {
    document.title = "FinDash Login";

    const favicon = document.querySelector("link[rel='icon']");
    if (favicon) {
      favicon.setAttribute("href", "/icon.png");
    }
  
    // Clear any existing credentials on mount
    localStorage.removeItem("token");
    sessionStorage.removeItem("userid");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("password");
  }, []);
  


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await loginUser(email, password);
      
      if (response?.token) {
        setCredentials(email, password);
        navigate("/dashboard", { replace: true });
      } else {
        throw new Error("Invalid login response");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo">💼 FinDash</div>
        <h2>Welcome Back</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          <p className="signup-link">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;


