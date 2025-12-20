import { useEffect, useState } from "react";
import "./ListBarangTemuanPage.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AlertWaspada from '../components/AlertWaspada'; 

// Helper untuk mengubah ID Kategori menjadi Nama
const getCategoryName = (id) => {
  const catId = String(id);
  switch (catId) {
    case '1': return 'Elektronik';
    case '2': return 'Dokumen';
    case '3': return 'Dompet/Tas';
    case '4': return 'Kunci';
    case '5': return 'Pakaian';
    case '6': return 'Lainnya';
    default: return 'Umum';
  }
};

export default function ListBarangTemuanPage() {
  const [items, setItems] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");

  const fetchData = async () => {
    const params = new URLSearchParams();
    
    // PENTING: Tambahkan parameter type="found"
    params.append("type", "found");

    if (keyword) params.append("keyword", keyword);
    if (category) params.append("category", category);

    try {
      // PENTING: Gunakan endpoint /api/reports (Port 5000)
      const res = await fetch(
        `http://localhost:5000/api/reports?${params.toString()}`
      );
      
      const data = await res.json();
      
      // Cek apakah data array atau object error
      if (Array.isArray(data)) {
        setItems(data);
      } else {
        console.error("Format data salah:", data);
        setItems([]);
      }
      
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [keyword, category]);

  return (
    <>
      <Navbar />

      <div className="found-container">
        <h1>Daftar Barang Temuan</h1>

        {/* FILTER */}
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Cari nama barang..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Semua Kategori</option>
            <option value="1">Elektronik (HP, Laptop, Kamera)</option>
            <option value="2">Dokumen (KTP, KTM, SIM, STNK)</option>
            <option value="3">Dompet/Tas</option>
            <option value="4">Kunci/Aksesoris</option>
            <option value="5">Pakaian/Sepatu</option>
            <option value="6">Lainnya</option>
          </select>
        </div>

        {/* TABLE */}
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Barang</th>
              <th>Waktu Ditemukan</th>
              <th>Deskripsi</th>
              <th>Lokasi</th>
              {/* Kolom Foto DIHAPUS */}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                {/* Colspan diubah jadi 5 karena kolom foto hilang */}
                <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                  Data tidak ditemukan
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>
                    <strong>{item.item_name}</strong>
                    {/* Menggunakan Helper untuk nama kategori */}
                    <div className="category">{getCategoryName(item.category_id)}</div>
                  </td>
                  <td>
                    {item.date_event ? new Date(item.date_event).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }) : "-"}
                  </td>
                  <td>{item.description}</td>
                  <td>
                    <strong>{item.location}</strong>
                  </td>
                  {/* Sel Foto DIHAPUS */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <section className="alert-wrapper">
        <AlertWaspada />
      </section>

      <Footer />
    </>
  );
}