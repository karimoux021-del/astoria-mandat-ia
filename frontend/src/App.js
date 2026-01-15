import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardOverview from './pages/DashboardOverview';
import DashboardLeads from './pages/DashboardLeads';
import Integration from './pages/Integration';
import Analytics from './pages/Analytics';
import Customize from './pages/Customize';
import Support from './pages/Support';
import Admin from './pages/Admin';
import { Toaster } from './components/ui/sonner';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<DashboardOverview />} />
          <Route path="/dashboard/leads" element={<DashboardLeads />} />
          <Route path="/dashboard/integration" element={<Integration />} />
          <Route path="/dashboard/analytics" element={<Analytics />} />
          <Route path="/dashboard/customize" element={<Customize />} />
          <Route path="/dashboard/support" element={<Support />} />
          <Route path="/dashboard/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
