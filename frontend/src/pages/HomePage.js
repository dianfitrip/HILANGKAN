import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; // <-- PERBAIKAN 1: Huruf 'F' Besar
import { Search } from 'lucide-react'; 

const HomePage = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/items/recent')
      .then(res => res.json())
      .then(data => {
        // PERBAIKAN 2: Cek apakah data berupa Array sebelum di-set
        if (Array.isArray(data)) {
          setItems(data);
        } else {
          console.error("Format data salah atau backend error:", data);
          setItems([]); // Set kosong biar tidak crash
        }
      })
      .catch(err => {
        console.error("Gagal ambil data:", err);
        setItems([]);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* HERO SECTION */}
      <div className="relative bg-green-800 text-white py-20">
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Kehilangan Barang di Kampus?
          </h1>
          <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
            Platform resmi Lost & Found UMY membantu Anda melaporkan kehilangan 
            atau menemukan barang yang tertinggal di area kampus.
          </p>
          
          <div className="flex max-w-xl mx-auto bg-white rounded-full overflow-hidden shadow-lg p-1">
            <input 
              type="text" 
              placeholder="Cari nama barang (misal: Kunci Motor, Dompet)..." 
              className="flex-1 px-6 py-3 text-gray-700 focus:outline-none"
            />
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-full transition">
              <Search size={24} />
            </button>
          </div>
        </div>
        
        {/* Hapus background image dulu jika bikin error, atau pastikan filenya ada */}
      </div>

      {/* BARANG TERBARU SECTION */}
      <main className="container mx-auto px-6 py-12 flex-grow">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-green-600 pl-4">
          Barang Temuan Terbaru
        </h2>

        {items.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            Belum ada data barang terbaru. 
            <br/><span className="text-sm">(Pastikan Backend jalan dan Database terhubung)</span>
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden group">
                <div className="h-48 overflow-hidden bg-gray-200 relative">
                    <img 
                        src={`http://localhost:3000${item.image_path}`} 
                        alt={item.item_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => {e.target.src = 'https://via.placeholder.com/300?text=No+Image'}}
                    />
                    <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                        {new Date(item.date_event).toLocaleDateString()}
                    </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 truncate">{item.item_name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{item.location}</p>
                  <button className="w-full mt-2 border border-green-600 text-green-600 py-2 rounded hover:bg-green-600 hover:text-white transition">
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