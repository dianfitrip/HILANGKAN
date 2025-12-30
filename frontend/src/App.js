import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import halaman user
import HomePage from './pages/user/HomePage';
import ProsedurPage from './pages/user/ProsedurPage';
import ListBarangTemuanPage from './pages/user/ListBarangTemuanPage';
import FormPenemuanPage from './pages/user/FormPenemuanPage';
import FormKehilanganPage from './pages/user/FormKehilanganPage';
import AdminDashboard from './pages/admin/AdminDashboard.js'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/prosedur" element={<ProsedurPage />} />
        <Route path="/list" element={<ListBarangTemuanPage />}/>
        <Route path="/lapor-penemuan" element={<FormPenemuanPage />} />
        <Route path="/lapor-kehilangan" element={<FormKehilanganPage />} />
        <Route path="/LandFmins" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;