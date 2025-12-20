import { useEffect, useState } from "react";
import "./ListBarangTemuanPage.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AlertWaspada from '../components/AlertWaspada'; 

export default function ListBarangTemuanPage() {
  const [items, setItems] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");

  const fetchData = async () => {
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    if (category) params.append("category", category);

    try {
      const res = await fetch(
        `http://localhost:3000/api/found-items?${params}`
      );
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  useEffect(() => {
    fetchData();
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
            placeholder="Cari..."
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
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  Data tidak ditemukan
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>
                    <strong>{item.item_name}</strong>
                    <div className="category">{item.category_name}</div>
                  </td>
                  <td>
                    {new Date(item.date_event).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td>{item.description}</td>
                  <td>
                    <strong>{item.location}</strong>
                  </td>
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
