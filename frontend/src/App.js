import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProsedurPage from './pages/ProsedurPage';
import FormPenemuanPage from './pages/FormPenemuanPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/prosedur" element={<ProsedurPage />} />
        {/* Route lain akan ditambahkan nanti */}
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/prosedur" element={<ProsedurPage />} />
        <Route path="/lapor-penemuan" element={<FormPenemuanPage />} /> {/* <-- Tambah ini */}
      </Routes>
    </Router>
  );
}

export default App;