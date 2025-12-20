import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
// Pastikan komponen AlertWaspada sudah di-import jika file ini terpisah
// import AlertWaspada from "../components/AlertWaspada"; 
import "./ProsedurePage.css";
import "./HomePage.css";

export default function ProsedurPage() {
  return (
    <div className="prosedur-page">
      <Navbar />
      <div className="navbar-spacer" />

      {/* HERO */}
      <section className="hero">
        <img
          src={process.env.PUBLIC_URL + "/images/potoUMY.png"}
          alt="UMY"
        />
      </section>

      {/* Pembuka Section Content */}
      <section className="content">
        {/* HEADER */}
        <div className="header-card">
          <h1 className="prosedur-title">
            PROSEDUR LAYANAN LOST & FOUND UMY
          </h1>

          <p className="header-desc">
            Berikut adalah Standar Operasional Prosedur (SOP) yang harus diikuti
            oleh seluruh civitas akademika Universitas Muhammadiyah Yogyakarta
            terkait layanan pelaporan kehilangan dan penemuan barang.
          </p>
        </div>

        {/* GRID */}
        <div className="grid">
          {/* ================= KEHILANGAN ================= */}
          <div className="card red">
            <h3 className="card-title">
              <span className="icon red">🔍</span>
              Jika Kehilangan Barang
            </h3>

            <div className="step">
              <span className="step-number red">1</span>
              <div>
                <b>Pencarian Mandiri (WAJIB)</b>
                <p>
                  Sebelum membuat laporan baru, pelapor diwajibkan melakukan
                  pengecekan daftar barang temuan terlebih dahulu.
                </p>
                <ul>
                  <li>Akses menu <b>List Barang Temuan</b></li>
                  <li>Gunakan kata kunci pencarian yang spesifik</li>
                </ul>
              </div>
            </div>

            <div className="step">
              <span className="step-number red">2</span>
              <div>
                <b>Pengajuan Laporan Kehilangan</b>
                <ul>
                  <li>
                    Jika barang <b>TIDAK DITEMUKAN</b>, buka menu
                    <b> Layanan Mandiri</b>
                  </li>
                  <li>
                    Pilih <b>Kehilangan Barang</b> dan isi formulir lengkap
                  </li>
                </ul>
              </div>
            </div>

            <div className="step">
              <span className="step-number red">3</span>
              <div>
                <b>Verifikasi & Pemantauan</b>
                <p>
                  Admin akan memverifikasi laporan dan menghubungi Anda jika
                  terdapat kecocokan data barang temuan.
                </p>
              </div>
            </div>
          </div>

          {/* ================= KANAN ================= */}
          <div className="right-col">
            {/* MENEMUKAN */}
            <div className="card green">
              <h3 className="card-title">
                <span className="icon green">✔</span>
                Jika Menemukan Barang
              </h3>

              <ul className="clean-list">
                <li>
                  <b>Segera Laporkan Penemuan</b><br />
                  Laporkan melalui menu <b>Layanan Mandiri</b> lalu pilih
                  <b> Menemukan Barang</b>
                </li>

                <li>
                  <b>Dokumentasi & Detail Barang</b><br />
                  Unggah foto dengan pencahayaan jelas dan deskripsi lengkap
                </li>

                <li>
                  <b>Verifikasi</b><br />
                  Admin akan memverifikasi data sebelum ditampilkan ke publik
                </li>
              </ul>
            </div>

            {/* PENGAMBILAN */}
            <div className="card blue">
              <h3 className="card-title">
                <span className="icon blue">👤</span>
                Prosedur Pengambilan Barang
              </h3>

              {/* CARD BIRU MUDA */}
              <div className="info-box">
                “Barang saya terdata di List Temuan, bagaimana cara mengambilnya?”
              </div>

              <ul className="clean-list">
                <li>
                  Datang ke Sekretariat Lost & Found UMY atau hubungi Admin
                </li>
                <li>
                  Wajib membawa identitas asli
                  <b> KTM / KTP / SIM</b>
                </li>
                <li>
                  Admin mencocokkan ciri barang sebelum serah terima
                </li>
              </ul>
            </div>
          </div>
        </div>

        <section className="alert-wrapper">
          <AlertWaspada />
        </section>
        
      </section> 

      <Footer />
    </div>
  );
}