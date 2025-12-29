import React, { useState } from 'react';
import './AdminDashboard.css';

// Import Komponen Fitur
import DashboardHome from './components/DashboardHome';
import LaporanMasuk from './components/LaporanMasuk';
import ActiveItems from './components/ListBarang';
import Arsip from './components/Arsip';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('home'); 

    // Fungsi untuk merender konten berdasarkan tab yang dipilih
    const renderContent = () => {
        switch (activeTab) {
            case 'home': return <DashboardHome />;
            case 'pending': return <LaporanMasuk />;
            case 'active': return <ActiveItems />;   // List Barang Approved
            case 'archived': return <Arsip />; // Arsip
            default: return <DashboardHome />;
        }
    };

    return (
        <div className="admin-layout">
            {/* SIDEBAR */}
            <div className="sidebar">
                <div className="sidebar-header">
                    <img src="/images/LogoLostFound.png" alt="Logo" className="sidebar-logo"/>
                    <h2>LOST & FOUND<br/><span>ADMIN DASHBOARD</span></h2>
                </div>
                
                <div className={`menu-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
                    <span>🏠</span> Ringkasan
                </div>
                
                <div className={`menu-item ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>
                    <span>📩</span> Laporan Masuk
                </div>

                <div className={`menu-item ${activeTab === 'active' ? 'active' : ''}`} onClick={() => setActiveTab('active')}>
                    <span>✅</span> List Barang
                </div>

                <div className={`menu-item ${activeTab === 'archived' ? 'active' : ''}`} onClick={() => setActiveTab('archived')}>
                    <span>🗄️</span> Arsip
                </div>
            </div>

            {/* CONTENT AREA */}
            <div className="content-area">
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminDashboard;