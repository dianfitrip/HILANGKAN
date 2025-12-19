import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProsedurPage from './pages/ProsedurPage';
import FormPenemuanPage from './pages/FormPenemuanPage';
import FormKehilanganPage from './pages/FormKehilanganPage';
import ListBarangTemuanPage from './pages/ListBarangTemuanPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/prosedur" element={<ProsedurPage />} />
        <Route path="/lapor-penemuan" element={<FormPenemuanPage />} />
        <Route path="/lapor-kehilangan" element={<FormKehilanganPage />} />
        <Route path="/list" element={<ListBarangTemuanPage />}/>
      </Routes>
    </Router>
  );
}

export default App;