import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* 1. BAGIAN LOGO (Tetap) */}
        <div className="footer-section footer-logo-section">
          <img
            src="/images/footerlogo.png"
            alt="UMY Logo"
            className="footer-logo"
          />
        </div>

        {/* 2. BAGIAN ALAMAT (Data Baru dari Gambar) */}
        <div className="footer-section footer-info">
          <h3 className="section-title">ALAMAT</h3>
          <div className="contact-table">
            <div className="contact-row">
              <span className="contact-value" style={{ display: 'block', lineHeight: '1.6' }}>
                <strong>Dasron Hamid Research and Innovation Center</strong><br />
                Kampus Terpadu UMY ◆ Jl. Brawijaya ◆ Tamantirto<br />
                Kasihan ◆ Bantul ◆ Yogyakarta 55183<br />
                Telp. 0274 - 387656 Ext. 528; Fax. 0274 - 387646
              </span>
            </div>
          </div>
        </div>

        {/* 3. BAGIAN KONTAK ADMIN (Data Baru dari Gambar) */}
        <div className="footer-section footer-info">
          <h3 className="section-title">KONTAK ADMIN</h3>
          <div className="contact-table">
            <div className="contact-row">
              <span className="contact-label">WhatsApp</span>
              <span className="contact-colon">:</span>
              <span className="contact-value">087833999202</span>
            </div>
            <div className="contact-row">
              <span className="contact-label">Email</span>
              <span className="contact-colon">:</span>
              <span className="contact-value">drp@umy.ac.id | drp_riset@umy.ac.id</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-divider-full"></div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} Universitas Muhammadiyah Yogyakarta
      </div>
    </footer>
  );
};

export default Footer;