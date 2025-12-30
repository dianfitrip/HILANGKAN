import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import '../styleAdmin/DashboardHome.css';

// Ikon (Pastikan Anda sudah install @heroicons/react atau ganti dengan emoji jika belum)
import { 
    ClipboardDocumentCheckIcon, 
    ClockIcon, 
    MegaphoneIcon, 
    ArchiveBoxArrowDownIcon 
} from '@heroicons/react/24/solid';

const DashboardHome = () => {
    const [stats, setStats] = useState({
        total_reports: 0,
        total_pending: 0,
        total_active: 0,
        total_resolved: 0,
        total_rejected: 0,
        reports_today: 0,
        type_found: 0,
        type_lost: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:5000/api/admin/stats')
            .then(res => {
                setStats(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    // Data untuk Grafik Pie (Lost vs Found)
    const pieData = [
        { name: 'Kehilangan', value: Number(stats.type_lost) },
        { name: 'Ditemukan', value: Number(stats.type_found) },
    ];
    const COLORS = ['#EF4444', '#10B981']; // Merah untuk Hilang, Hijau untuk Temuan

    // Data untuk Grafik Batang (Status Laporan)
    const barData = [
        { name: 'Pending', jumlah: Number(stats.total_pending) },
        { name: 'Aktif (Tayang)', jumlah: Number(stats.total_active) },
        { name: 'Selesai', jumlah: Number(stats.total_resolved) },
        { name: 'Ditolak', jumlah: Number(stats.total_rejected) },
    ];

    // Variabel Animasi Framer Motion
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    if (loading) return <div style={{padding:'40px', textAlign:'center'}}>Sedang memuat data statistik...</div>;

    return (
        <motion.div 
            className="dashboard-wrapper"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* 1. WELCOME BANNER */}
            <motion.div className="welcome-banner" variants={itemVariants}>
                <h1>Halo, Admin! </h1>
                <p>Berikut adalah ringkasan aktivitas laporan barang hilang & temuan hari ini.</p>
                <div style={{marginTop:'15px', background:'rgba(255,255,255,0.2)', display:'inline-block', padding:'5px 15px', borderRadius:'20px', fontSize:'0.9rem'}}>
                    📅 {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </motion.div>

            {/* 2. STATS CARDS GRID */}
            <div className="stats-grid">
                {/* Card 1: Masuk Hari Ini */}
                <motion.div className="stat-card-modern card-today" variants={itemVariants}>
                    <div className="stat-info">
                        <h3>{stats.reports_today}</h3>
                        <p>Laporan Masuk Hari Ini</p>
                    </div>
                    <div className="stat-icon-wrapper">
                        <MegaphoneIcon style={{width:'30px'}}/>
                    </div>
                </motion.div>

                {/* Card 2: Pending (Butuh Tindakan) */}
                <motion.div className="stat-card-modern card-pending" variants={itemVariants}>
                    <div className="stat-info">
                        <h3>{stats.total_pending}</h3>
                        <p>Menunggu Validasi</p>
                    </div>
                    <div className="stat-icon-wrapper">
                        <ClockIcon style={{width:'30px'}}/>
                    </div>
                </motion.div>

                {/* Card 3: Aktif (Barang Belum Kembali) */}
                <motion.div className="stat-card-modern card-active" variants={itemVariants}>
                    <div className="stat-info">
                        <h3>{stats.total_active}</h3>
                        <p>Barang Belum Kembali</p>
                    </div>
                    <div className="stat-icon-wrapper">
                        <ArchiveBoxArrowDownIcon style={{width:'30px'}}/>
                    </div>
                </motion.div>

                {/* Card 4: Selesai */}
                <motion.div className="stat-card-modern card-resolved" variants={itemVariants}>
                    <div className="stat-info">
                        <h3>{stats.total_resolved}</h3>
                        <p>Kasus Selesai</p>
                    </div>
                    <div className="stat-icon-wrapper">
                        <ClipboardDocumentCheckIcon style={{width:'30px'}}/>
                    </div>
                </motion.div>
            </div>

            {/* 3. CHARTS SECTION */}
            <div className="charts-section">
                
                {/* Bar Chart: Statistik Status */}
                <motion.div className="chart-card" variants={itemVariants}>
                    <div className="chart-header">
                        <h3>Statistik Status Laporan</h3>
                    </div>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip cursor={{fill: 'transparent'}} />
                                <Bar dataKey="jumlah" fill="#065F46" radius={[6, 6, 0, 0]} barSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Pie Chart: Hilang vs Ditemukan */}
                <motion.div className="chart-card" variants={itemVariants}>
                    <div className="chart-header">
                        <h3>Rasio Hilang vs Ditemukan</h3>
                    </div>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{textAlign:'center', marginTop:'-10px', color:'#666', fontSize:'0.9rem'}}>
                            Total Laporan: <strong>{stats.total_reports}</strong>
                        </div>
                    </div>
                </motion.div>

            </div>
        </motion.div>
    );
};

export default DashboardHome;