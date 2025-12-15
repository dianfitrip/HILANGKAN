import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/footer';

const FormPenemuanPage = () => {
  const [loading, setLoading] = useState(false);
  
  // State untuk menangani input form
  const [formData, setFormData] = useState({
    reporter_name: '',
    reporter_status: 'mahasiswa',
    identification_number: '',
    reporter_email: '',
    reporter_phone: '',
    item_name: '',
    category_id: '1', // Default ID kategori (pastikan ID 1 ada di DB)
    date_event: '',
    location: '',
    description: ''
  });

  const [imageFile, setImageFile] = useState(null);

  // Handle perubahan text input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle perubahan file input
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Gunakan FormData untuk kirim file + text
    const payload = new FormData();
    
    // Masukkan semua text data ke payload
    Object.keys(formData).forEach(key => {
        payload.append(key, formData[key]);
    });

    // Masukkan file jika ada
    if (imageFile) {
        payload.append('item_image', imageFile);
    }

    try {
        const response = await fetch('http://localhost:3000/api/items/submit', {
            method: 'POST',
            body: payload // Jangan set Content-Type header manual!
        });

        const result = await response.json();

        if (result.success) {
            alert(`Berhasil! Simpan Token ini untuk edit: ${result.token}`);
            window.location.href = '/'; // Redirect ke home
        } else {
            alert('Gagal: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan koneksi.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-6 py-10 flex-grow">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
            Form Laporan Penemuan Barang
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* BAGIAN 1: DATA PELAPOR */}
            <h3 className="text-lg font-semibold text-green-700 mt-4">Data Pelapor</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                    <input type="text" name="reporter_name" required onChange={handleChange} className="w-full border p-2 rounded mt-1" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select name="reporter_status" onChange={handleChange} className="w-full border p-2 rounded mt-1">
                        <option value="mahasiswa">Mahasiswa</option>
                        <option value="dosen">Dosen</option>
                        <option value="tendik">Tendik</option>
                        <option value="lainnya">Lainnya</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Nomor Identitas (NIM/NIP/KTP)</label>
                <input type="text" name="identification_number" required onChange={handleChange} className="w-full border p-2 rounded mt-1" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" name="reporter_email" required onChange={handleChange} className="w-full border p-2 rounded mt-1" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">No. HP / WhatsApp</label>
                    <input type="text" name="reporter_phone" onChange={handleChange} className="w-full border p-2 rounded mt-1" />
                </div>
            </div>

            {/* BAGIAN 2: DATA BARANG */}
            <h3 className="text-lg font-semibold text-green-700 mt-6">Data Barang Temuan</h3>

            <div>
                <label className="block text-sm font-medium text-gray-700">Nama Barang</label>
                <input type="text" name="item_name" required placeholder="Contoh: Kunci Motor Honda" onChange={handleChange} className="w-full border p-2 rounded mt-1" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Kategori</label>
                    <select name="category_id" onChange={handleChange} className="w-full border p-2 rounded mt-1">
                        <option value="1">Elektronik</option>
                        <option value="2">Dokumen (KTP/KTM)</option>
                        <option value="3">Dompet/Tas</option>
                        <option value="4">Kunci</option>
                        <option value="5">Pakaian</option>
                        <option value="6">Lainnya</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tanggal Ditemukan</label>
                    <input type="date" name="date_event" required onChange={handleChange} className="w-full border p-2 rounded mt-1" />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Lokasi Ditemukan</label>
                <input type="text" name="location" required placeholder="Contoh: Gedung E7 Lantai 2" onChange={handleChange} className="w-full border p-2 rounded mt-1" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Deskripsi / Ciri-ciri</label>
                <textarea name="description" rows="3" onChange={handleChange} className="w-full border p-2 rounded mt-1"></textarea>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Foto Barang (Opsional)</label>
                <input type="file" name="item_image" onChange={handleFileChange} className="w-full border p-2 rounded mt-1 bg-white" />
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-3 rounded font-bold text-white transition mt-6 ${loading ? 'bg-gray-400' : 'bg-yellow-500 hover:bg-yellow-600'}`}
            >
                {loading ? 'Mengirim...' : 'Kirim Laporan'}
            </button>

          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FormPenemuanPage;