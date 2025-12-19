import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import "./FormKehilanganPage.css";
import axios from "axios";


const SITE_KEY = "6LfvKS0sAAAAAMcbAmjk5QulmbPPNvcQkcS1bcGR";

export default function FormKehilanganPage() {
  const [form, setForm] = useState({
    nama: "",
    whatsapp: "",
    status: "mahasiswa",
    identitas: "",
    kategori: "",
    namaBarang: "",
    deskripsi: "",
    tanggal: "",
    lokasi: "",
    foto: null,
  });

  const [captcha, setCaptcha] = useState(null);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  

  // =====================
  // HANDLE INPUT
  // =====================
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "whatsapp" && !/^\d*$/.test(value)) return;

    if (
      name === "identitas" &&
      form.status !== "foreign_student" &&
      !/^\d*$/.test(value)
    )
      return;

    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  // =====================
  // VALIDASI
  // =====================
  const validateForm = () => {
    if (!/^08\d{9,11}$/.test(form.whatsapp)) {
      return "Nomor WhatsApp harus 12/13 digit dan diawali 08";
    }

    if (form.status === "mahasiswa" && !/^\d{11}$/.test(form.identitas)) {
      return "NIM harus 11 digit angka (contoh: 20210140001)";
    }

    if (form.status === "lainnya" && !/^\d{16}$/.test(form.identitas)) {
      return "NIK harus 16 digit angka";
    }

    if (form.status === "foreign_student" && form.identitas.length > 10) {
      return "ID Foreign Student maksimal 10 karakter";
    }

    if (
      (form.status === "dosen" || form.status === "tendik") &&
      !/^\d{1,18}$/.test(form.identitas)
    ) {
      return "NIP / NIK Pegawai maksimal 18 digit angka";
    }

    if (!captcha) return "Harap verifikasi reCAPTCHA";

    return null;
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const err = validateForm();
  if (err) {
    setError(err);
    return;
  }

  try {
    const formData = new FormData();

    // ======================
    // MAPPING KE BACKEND
    // ======================
    formData.append("reporter_name", form.nama);
    formData.append("reporter_status", form.status);
    formData.append("identification_number", form.identitas);
    formData.append("reporter_phone", form.whatsapp);

    // WAJIB: category_id HARUS ANGKA (ID)
    formData.append("category_id", form.kategori);

    formData.append("item_name", form.namaBarang);
    formData.append("description", form.deskripsi);
    formData.append("location", form.lokasi);
    formData.append("date_event", form.tanggal);

    // FILE (nama HARUS sama dengan multer)
    if (form.item_image) {
      formData.append("item_image", form.item_image);
    }

    // ======================
    // KIRIM KE BACKEND
    // ======================
    await axios.post(
      "http://localhost:3001/api/items/submit",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // ======================
    // SUCCESS
    // ======================
    setError("");
    setShowSuccess(true);
  } catch (error) {
    console.error("Submit Error:", error);
    setError("Gagal mengirim laporan. Silakan coba lagi.");
  }
};



  return (
    <>
      <div className="kehilangan-page">
        {/* HEADER */}
        <div className="kehilangan-header">
          <h2>Lapor Kehilangan Barang</h2>
          <p>Laporkan barang yang hilang di area kampus UMY.</p>
        </div>

        {/* CARD */}
        <div className="kehilangan-card">
          <form onSubmit={handleSubmit}>
            <h4>Identitas Pelapor</h4>

            <label className="required">Nama</label>
            <input
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap Anda"
              required
            />

            <label className="required">Nomor WhatsApp</label>
            <input
              type="text"
              name="whatsapp"
              value={form.whatsapp}
              onChange={handleChange}
              placeholder="08xxxxxxxxxxx (Contoh: 081234567890)"
              maxLength={13}
              required
            />

            <label className="required">Status Pelapor</label>
            <div className="status-box">
              {["mahasiswa", "dosen", "tendik", "foreign_student", "lainnya"].map(
                (s) => (
                  <label key={s}>
                    <input
                      type="radio"
                      name="status"
                      value={s}
                      checked={form.status === s}
                      onChange={handleChange}
                    />
                    {s === "mahasiswa" && "Mahasiswa"}
                    {s === "dosen" && "Dosen"}
                    {s === "tendik" && "Tenaga Kependidikan"}
                    {s === "foreign_student" && "Foreign Student"}
                    {s === "lainnya" && "Lainnya"}
                  </label>
                )
                
              )}
            </div>

            <label className="required">
              {form.status === "mahasiswa" && "NIM (11 Digit)"}
              {form.status === "lainnya" && "NIK (16 Digit)"}
              {form.status === "foreign_student" &&
                "ID (Max 10 Karakter)"}
              {(form.status === "dosen" || form.status === "tendik") &&
                "NIP / NIK Pegawai (Max 18 Digit)"}
            </label>

            <input
              type="text"
              name="identitas"
              value={form.identitas}
              onChange={handleChange}
              maxLength={
                form.status === "mahasiswa"
                  ? 11
                  : form.status === "lainnya"
                  ? 16
                  : form.status === "foreign_student"
                  ? 10
                  : 18
              }

              placeholder={
                form.status === "mahasiswa"
                ? "ex: 20210140001"
                : form.status === "lainnya"
                ? "Masukkan NIK KTP"
                : form.status === "foreign_student"
                ? "Masukkan ID (max 10 karakter)"
                : "Masukkan NIP / NIK Pegawai"
                }
              required
            />

            <h4>Data Barang Kehilangan</h4>

            <label className="required">Kategori Barang</label>
            <select
              name="kategori"
              value={form.kategori}
              onChange={handleChange}
              required
            >
              <option value="">Pilih Kategori Barang</option>
              <option value="Dompet">Dompet</option>
              <option value="Kartu">Kartu Identitas</option>
              <option value="Elektronik">Elektronik</option>
              <option value="Lainnya">Lainnya</option>
            </select>

            <label className="required">Nama Barang</label>
            <input
              type="text"
              name="namaBarang"
              value={form.namaBarang}
              onChange={handleChange}
              placeholder="Contoh: Dompet kulit coklat"
              required
            />

            <label className="required">Deskripsi Detail</label>
            <textarea
              name="deskripsi"
              value={form.deskripsi}
              onChange={handleChange}
              placeholder="Jelaskan ciri-ciri khusus..."
              required
            />

            <div className="two-col">
              <div>
                <label className="required">Tanggal Kehilangan</label>
                <input
                  type="date"
                  name="tanggal"
                  value={form.tanggal}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="required">Lokasi Kehilangan</label>
                <input
                  type="text"
                  name="lokasi"
                  value={form.lokasi}
                  onChange={handleChange}
                  placeholder="Contoh: Parkir utara"
                  required
                />
              </div>
            </div>

            <label>Foto Barang (Opsional)</label>
            <div className="upload-box">
              <input type="file" name="foto" onChange={handleChange} />
              <p>Klik di sini untuk unggah foto</p>
            </div>

            <label className="required">Konfirmasi Keamanan</label>
            <ReCAPTCHA sitekey={SITE_KEY} onChange={setCaptcha} />

            {error && <div className="error">{error}</div>}

            <div className="button-row">
              <button type="button" className="btn-cancel" onClick={() => window.location.href = "/"}>
                Batal
              </button>
              <button type="submit" className="btn-submit">
                Laporkan Kehilangan
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ================= SUCCESS POPUP ================= */}
      {showSuccess && (
        <div className="popup-overlay">
          <div className="popup-card">
            <div className="popup-icon">✓</div>
            <h3>Laporan Terkirim!</h3>
            <p>Data Anda berhasil disimpan.</p>

            <div className="popup-buttons">
              <button
                className="popup-primary"
                onClick={() => (window.location.href = "/list-barang")}
              >
                Lihat List Barang
              </button>
              <button
                className="popup-secondary"
                onClick={() => (window.location.href = "/")}
              >
                Kembali ke Home
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}