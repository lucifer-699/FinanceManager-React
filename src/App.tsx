import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard.tsx';
import Transactions from './components/Transactions.tsx';
import Income from './components/Income.tsx';
import Expense from './components/Expense.tsx';
import Planning from './components/Planning.tsx';
import Analytics from './components/Analytics.tsx';
import Admin from './components/Admin.tsx';
import Settings from './components/Settings.tsx';
import Login from './components/Login.tsx';

const App: React.FC = () => {
  return (
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
  );
};

export default App;
