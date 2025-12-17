import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ProsedurPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        
        {/* Header Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-red-700 mb-6 tracking-tight">
            Prosedur Layanan <span className="text-gray-900">Lost & Found</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            Ikuti panduan di bawah ini untuk melaporkan kehilangan, penemuan, atau pengambilan barang di lingkungan Universitas Muhammadiyah Yogyakarta.
          </p>
        </div>

        {/* Steps Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">

          {/* Card 1: Kehilangan */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border-t-4 border-red-600">
            <div className="p-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                {/* Icon Search/Lost */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">Melaporkan Kehilangan</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5 mr-3">1</span>
                  <span>Buka halaman <span className="font-semibold text-red-600">Beranda</span>.</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5 mr-3">2</span>
                  <span>Klik tombol "Laporkan Kehilangan".</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5 mr-3">3</span>
                  <span>Isi formulir dengan detail barang (foto, ciri-ciri, lokasi).</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5 mr-3">4</span>
                  <span>Pantau status laporan Anda secara berkala.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 2: Penemuan */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border-t-4 border-green-600">
            <div className="p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                {/* Icon Found/Check */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">Melaporkan Penemuan</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5 mr-3">1</span>
                  <span>Amankan barang yang Anda temukan.</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5 mr-3">2</span>
                  <span>Klik tombol "Laporkan Penemuan" di Beranda.</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5 mr-3">3</span>
                  <span>Unggah foto dan deskripsi barang.</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5 mr-3">4</span>
                  <span>Serahkan barang ke <strong>Pos Satpam</strong> atau <strong>Admin</strong> terdekat untuk verifikasi.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 3: Pengambilan */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border-t-4 border-yellow-500">
            <div className="p-8">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                {/* Icon Hand/Retrieve */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">Pengambilan Barang</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5 mr-3">1</span>
                  <span>Lihat daftar barang temuan di website.</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5 mr-3">2</span>
                  <span>Jika ada barang milik Anda, klik "Klaim".</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5 mr-3">3</span>
                  <span>Datang ke lokasi penyimpanan (disebutkan di web).</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5 mr-3">4</span>
                  <span>Tunjukkan <strong>KTM/Identitas</strong> dan bukti kepemilikan untuk mengambil barang.</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProsedurPage;