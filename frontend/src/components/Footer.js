import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* LOGO */}
        <div className="footer-section footer-logo-section">
          <img
            src="/images/footerlogo.png"
            alt="UMY Logo"
            className="footer-logo"
          />
        </div>

        {/* SEKRETARIAT */}
        <div className="footer-section footer-info">
          <h3 className="section-title">Sekretariat</h3>

          <div className="contact-table">
            <div className="contact-row">
              <span className="contact-label">Alamat</span>
              <span className="contact-colon">:</span>
              <span className="contact-value">
                Jl. Brawijaya, Bantul 55183
              </span>
            </div>

            <div className="contact-row">
              <span className="contact-label">Email</span>
              <span className="contact-colon">:</span>
              <span className="contact-value">lost&found@umy.ac.id</span>
            </div>

            <div className="contact-row">
              <span className="contact-label">Telp.</span>
              <span className="contact-colon">:</span>
              <span className="contact-value">
                0274.387656 psw 140/141/149/492
              </span>
            </div>

            <div className="contact-row">
              <span className="contact-label">Faks</span>
              <span className="contact-colon">:</span>
              <span className="contact-value">0274.387646</span>
            </div>

            <div className="contact-row">
              <span className="contact-label">NPP</span>
              <span className="contact-colon">:</span>
              <span className="contact-value">340216202000002</span>
            </div>
          </div>
        </div>

        {/* JAM LAYANAN */}
        <div className="footer-section footer-info">
          <h3 className="section-title">Jam Layanan</h3>

          <div className="hours-table">
            <div className="hours-row">
              <span className="hours-label">Senin - Jum'at</span>
              <span className="hours-colon">:</span>
              <span className="hours-value">08.00 - 21.00 WIB</span>
            </div>

            <div className="hours-row">
              <span className="hours-label">Sabtu</span>
              <span className="hours-colon">:</span>
              <span className="hours-value">09.00 - 13.00 WIB</span>
            </div>
          </div>
        </div>

      </div>

      {/* GARIS PEMBATAS */}
      <div className="footer-divider-full"></div>

      {/* COPYRIGHT */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} Lost & Found Universitas Muhammadiyah Yogyakarta
      </div>
    </footer>
  );
};

export default Footer;
