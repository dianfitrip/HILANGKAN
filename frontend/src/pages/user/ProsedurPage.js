import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AlertWaspada from "../../components/AlertWaspada"; 
import "./ProsedurPage.css";


export default function ProsedurPage() {
  return (
    <div className="prosedur-page">
      <Navbar />
      <div className="navbar-spacer" />

     <section className="hero-section">
        <div
          className="hero-banner"
          style={{
            backgroundImage: "url('/images/potoUMY.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      </section>

      <section className="content">
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

        <div className="grid">
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
                    Pilih <b>Laporkan Kehilangan</b> dan isi formulir lengkap
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

          <div className="right-col">
            <div className="card green">
              <h3 className="card-title">
                <span className="icon green">✔</span>
                Jika Menemukan Barang
              </h3>

              <ul className="clean-list">
                <li>
                  <b>Segera Laporkan Penemuan</b><br />
                  Laporkan melalui menu <b>Layanan Mandiri</b> lalu pilih
                  <b> Laporkan Penemuan</b>
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

            <div className="card blue">
              <h3 className="card-title">
                <span className="icon blue">👤</span>
                Prosedur Pengambilan Barang
              </h3>

              <div className="info-box">
                “Barang saya terdata di List Barang Temuan, bagaimana cara mengambilnya?”
              </div>

              <ul className="clean-list">
                <li>
                  Datang ke Sekretariat Lost & Found UMY atau hubungi Admin
                </li>
                <li>
                  Wajib membawa identitas asli
                  <b> KTM / KTP / SIM</b>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section> 

      <section className="alert-wrapper">
        <AlertWaspada />
      </section>

      <Footer />
    </div>
  );
}