import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./HomePage.css";

function HomePage() {
  return (
    <div className="home-container">
      <Navbar />

      {/* ===== HERO / BANNER ===== */}
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

      {/* ===== ABOUT SECTION ===== */}
      <section className="main-content">
        <div className="about-grid">

          {/* KIRI */}
          <div className="about-left">
            <h2 className="about-title">
              Apa itu Lost &amp; Found UMY?
            </h2>

            <img
              src="/images/LogoLostFound.png"
              alt="Logo Lost & Found"
              className="about-logo"
            />
          </div>

          {/* KANAN */}
          <div className="about-right">
            <div className="about-text-wrapper">
              <p className="about-text">
                Lost &amp; Found UMY adalah platform web terpadu yang membantu
                seluruh civitas akademika Universitas Muhammadiyah Yogyakarta
                dalam pelaporan, pencarian, dan pengembalian barang hilang atau
                ditemukan di area kampus.
              </p>

              <p className="about-text">
                Sistem ini mengelola alur barang temuan secara resmi, mulai dari
                pelaporan hingga verifikasi pengambilan untuk memastikan proses
                yang aman dan terstruktur.
              </p>
            </div>

            <div className="about-buttons">
              <Link to="/lapor-kehilangan" className="btn-lost">
                Anda Kehilangan Barang?
              </Link>

              <Link to="/lapor-penemuan" className="btn-found">
                Anda Menemukan Barang?
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ===== WARNING CARD ===== */}
      <section className="warning-section">
        <div className="warning-card">
          <h3 className="warning-title">⚠️ WASPADA PENIPUAN!</h3>

          <p className="warning-text">
            Seluruh layanan Lost &amp; Found Universitas Muhammadiyah Yogyakarta
            adalah <strong>100% GRATIS</strong>. Kami tidak pernah meminta biaya
            administrasi, biaya transfer, atau imbalan uang tebusan dalam bentuk
            apapun untuk pengembalian barang.
          </p>

          <div className="warning-highlight">
            Abaikan pihak yang meminta transfer uang mengatasnamakan UMY!
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default HomePage;
