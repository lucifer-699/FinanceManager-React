import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Income from './components/Income';
import Expense from './components/Expense';
import Planning from './components/Planning';
import Analytics from './components/Analytics';
import Admin from './components/Admin';
import Settings from './components/Settings';
import Login from './components/Login';

import { UserProvider } from './context/UserContext'; // <-- import UserProvider

const App: React.FC = () => {
  return (
    <UserProvider>  {/* Wrap the entire router */}
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/income" element={<Income />} />
          <Route path="/expense" element={<Expense />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/" element={<Login />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/planning" element={<Planning />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
