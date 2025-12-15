import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/footer';

const ProsedurPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-6 py-12 flex-grow">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Prosedur Layanan Lost & Found
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Kolom Kiri: Penemu */}
            <div>
              <h2 className="text-xl font-semibold text-green-700 mb-4 border-b pb-2">
                Jika Menemukan Barang
              </h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Amankan barang yang Anda temukan.</li>
                <li>Foto barang tersebut dengan jelas.</li>
                <li>Buka website Lost & Found UMY dan klik menu "Lapor Penemuan".</li>
                <li>Isi formulir dengan detail lokasi dan waktu penemuan.</li>
                <li>Serahkan fisik barang ke pos satpam terdekat atau kantor Student Service.</li>
              </ol>
            </div>

            {/* Kolom Kanan: Kehilangan */}
            <div>
              <h2 className="text-xl font-semibold text-yellow-600 mb-4 border-b pb-2">
                Jika Kehilangan Barang
              </h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Cari barang Anda melalui fitur pencarian di beranda.</li>
                <li>Jika ditemukan, klik detail dan ajukan klaim kepemilikan.</li>
                <li>Jika belum ada, buat "Laporan Kehilangan" baru.</li>
                <li>Pantau status laporan Anda secara berkala melalui dashboard.</li>
                <li>Bawa identitas diri (KTM/KTP) saat pengambilan barang.</li>
              </ol>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProsedurPage;