import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto pt-10 pb-6">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <img src="/images/footerlogo.png" alt="Logo Footer" className="h-12 brightness-0 invert" />
            <div>
              <h3 className="font-bold text-lg">Lost & Found</h3>
              <p className="text-gray-400 text-sm">Universitas Muhammadiyah Yogyakarta</p>
            </div>
          </div>
          <div className="text-gray-400 text-sm text-center md:text-right">
            <p>Jl. Brawijaya, Kasihan, Bantul, Yogyakarta</p>
            <p>Email: support@umy.ac.id</p>
          </div>
        </div>
        <hr className="border-gray-800 mb-4" />
        <p className="text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Lost & Found UMY. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;