import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/dashboard.tsx';
import Transactions from './components/Transactions.tsx';
import Income from './components/Income.tsx';
import Expense from './components/Expense.tsx';
//import Planning from './components/Planning.tsx';
import Analytics from './components/analytics.tsx';
//import Reports from './components/Reports.tsx';
//import Settings from './components/Settings.tsx';
//import Login from './components/Login.tsx';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
     
        <Route path="/income" element={<Income />} />
         <Route path="/expense" element={<Expense />} />
        <Route path="/transactions" element={<Transactions />} />
      
        <Route path="/analytics" element={<Analytics />} />
     
      </Routes>
    </Router>
  );
};

export default App;
