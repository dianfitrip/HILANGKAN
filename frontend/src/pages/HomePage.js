import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Search } from 'lucide-react'; 

const HomePage = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Pastikan URL backend benar
    fetch('http://localhost:5000/api/items/recent') // Biasanya backend jalan di port 5000, sesuaikan jika 3000
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setItems(data);
        } else {
          setItems([]);
        }
      })
      .catch(err => {
        console.error("Gagal ambil data:", err);
        setItems([]);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Navbar />

      {/* HERO SECTION YANG DIPERBAIKI */}
      <div className="bg-gradient-to-br from-green-900 to-green-700 text-white py-24 relative overflow-hidden">
        {/* Dekorasi Background (Lingkaran transparan) */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-1/3 translate-y-1/3"></div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
            Kehilangan Barang<br/>di Kampus?
          </h1>
          <p className="text-lg md:text-xl text-green-100 mb-10 max-w-2xl mx-auto font-light">
            Platform resmi <span className="font-semibold text-yellow-400">Lost & Found UMY</span>. 
            Laporkan kehilangan atau temukan barang Anda dengan mudah dan cepat.
          </p>
          
          {/* Search Bar */}
          <div className="flex w-full max-w-2xl mx-auto bg-white rounded-full shadow-2xl p-2 transform hover:scale-[1.01] transition-transform duration-300">
            <div className="flex-1 flex items-center pl-4">
              <Search className="text-gray-400 w-5 h-5 mr-3" />
              <input 
                type="text" 
                placeholder="Cari barang (misal: Kunci Motor, Dompet)..." 
                className="w-full py-3 text-gray-700 focus:outline-none text-base bg-transparent placeholder-gray-400"
              />
            </div>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-full font-semibold shadow-md transition-colors duration-300 flex items-center gap-2">
              Cari
            </button>
          </div>
        </div>
      </div>

      {/* BARANG TERBARU SECTION */}
      <main className="container mx-auto px-6 py-16 flex-grow">
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800 border-l-8 border-yellow-500 pl-4">
            Barang Temuan Terbaru
            </h2>
            <a href="/temuan" className="text-green-700 font-semibold hover:underline">Lihat Semua &rarr;</a>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="text-gray-300 mb-4">
                <Search size={64} className="mx-auto" />
            </div>
            <p className="text-xl text-gray-500 font-medium">Belum ada barang yang dilaporkan.</p>
            <p className="text-sm text-gray-400 mt-2">Data akan muncul di sini setelah backend terhubung.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
                <div className="h-56 overflow-hidden bg-gray-100 relative">
                    <img 
                        src={`http://localhost:5000${item.image_path}`} 
                        alt={item.item_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        onError={(e) => {e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'}}
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-green-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        {new Date(item.date_event).toLocaleDateString('id-ID')}
                    </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-xl text-gray-800 truncate mb-1">{item.item_name}</h3>
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <span className="truncate">{item.location}</span>
                  </div>
                  <button className="w-full bg-green-50 text-green-700 py-2.5 rounded-lg font-medium hover:bg-green-600 hover:text-white transition-colors duration-300">
                    Lihat Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;