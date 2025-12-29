import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import halaman user
import HomePage from './pages/user/HomePage';
import ProsedurPage from './pages/user/ProsedurPage';
import ListBarangTemuanPage from './pages/user/ListBarangTemuanPage';
import FormPenemuanPage from './pages/user/FormPenemuanPage';
import FormKehilanganPage from './pages/user/FormKehilanganPage';

// --- PENTING: Import halaman Admin di sini ---
import AdminDashboard from './pages/admin/AdminDashboard.js'; 

function App() {
  return (
    <Router>
      {/* Jika Anda punya Navbar yang menempel di semua halaman, letakkan di sini */}
      
      <Routes>
        {/* Rute User */}
        <Route path="/" element={<HomePage />} />
        <Route path="/prosedur" element={<ProsedurPage />} />
        <Route path="/list" element={<ListBarangTemuanPage />}/>
        <Route path="/lapor-penemuan" element={<FormPenemuanPage />} />
        <Route path="/lapor-kehilangan" element={<FormKehilanganPage />} />

        {/* --- PENTING: Daftarkan Rute Admin di sini --- */}
        <Route path="/admin" element={<AdminDashboard />} />
        
      </Routes>
    </Router>
  );
}

export default App;