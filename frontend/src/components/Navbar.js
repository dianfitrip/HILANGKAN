import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* LOGO AREA */}
        <Link to="/" className="flex items-center gap-3">
            {/* Pastikan file ini ada di frontend/public/images/ */}
            <img src="/images/LogoUMY.png" alt="Logo UMY" className="h-10" />
            <div className="w-px h-8 bg-gray-300 mx-2"></div>
            <img src="/images/LogoLostFound.png" alt="Logo LostFound" className="h-10" />
        </Link>

        {/* MENU LINKS */}
        <div className="hidden md:flex items-center gap-8 font-medium text-gray-700">
          <Link to="/" className="hover:text-green-700 transition">Beranda</Link>
          <Link to="/prosedur" className="hover:text-green-700 transition">Prosedur</Link>
          <Link to="/list" className="hover:text-green-700 transition">Barang Temuan</Link>
          <Link to="/login" className="px-5 py-2 bg-green-700 text-white rounded-full hover:bg-green-800 transition">
            Masuk
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;