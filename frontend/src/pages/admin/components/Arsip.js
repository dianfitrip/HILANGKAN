import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Arsip = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);
    const [filterText, setFilterText] = useState("");
    const [filterCategory, setFilterCategory] = useState(""); // Filter Kategori

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    const getCategoryName = (id) => {
        const cats = { '1': 'Elektronik', '2': 'Dokumen', '3': 'Dompet/Tas', '4': 'Kunci', '5': 'Pakaian', '6': 'Lainnya' };
        return cats[id] || 'Umum';
    };

    const getIdentityLabel = (status) => {
        switch (status) {
            case 'mahasiswa': return 'NIM';
            case 'lainnya': return 'NIK KTP';
            case 'foreign_student': return 'Passport Number';
            case 'dosen': case 'tendik': return 'NIP / NIK Pegawai';
            default: return 'Nomor Identitas';
        }
    };

    const fetchReports = () => {
        setLoading(true);
        axios.get('http://localhost:5000/api/admin/reports?status=archived')
            .then(res => { setReports(res.data); setLoading(false); })
            .catch(err => { console.error(err); setLoading(false); });
    };

    useEffect(() => { fetchReports(); }, []);

    // --- FILTER LOGIC ---
    const filteredReports = reports.filter(item => {
        const matchText = 
            item.item_name.toLowerCase().includes(filterText.toLowerCase()) ||
            item.reporter_name.toLowerCase().includes(filterText.toLowerCase());
        
        const matchCategory = filterCategory === "" ? true : String(item.category_id) === filterCategory;

        return matchText && matchCategory;
    });

    const handleDelete = async (id) => {
        if (!window.confirm("Hapus permanen data arsip ini?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/reports/${id}`);
            fetchReports();
            setSelectedReport(null);
            alert("Data dihapus permanen.");
        } catch (error) { alert("Gagal menghapus."); }
    };

    return (
        <div className="table-card">
            <div className="table-header-action" style={{flexDirection: 'column', alignItems: 'stretch', gap: '15px'}}>
                <h3 className="page-title" style={{margin:0, borderLeft:'none', paddingLeft:0, color:'#64748b', fontSize:'1.2rem'}}>
                    Arsip Laporan (Selesai / Ditolak)
                </h3>
                <div style={{display: 'flex', gap: '10px'}}>
                    {/* FILTER KATEGORI */}
                    <select 
                        value={filterCategory} 
                        onChange={(e) => setFilterCategory(e.target.value)} 
                        className="search-input" 
                        style={{width: '180px', fontWeight: 'bold'}}
                    >
                        <option value="">Semua Kategori</option>
                        <option value="1">Elektronik</option>
                        <option value="2">Dokumen</option>
                        <option value="3">Dompet/Tas</option>
                        <option value="4">Kunci</option>
                        <option value="5">Pakaian</option>
                        <option value="6">Lainnya</option>
                    </select>

                    <input 
                        type="text" className="search-input" placeholder="Cari arsip..." 
                        value={filterText} onChange={(e) => setFilterText(e.target.value)}
                        style={{flex: 1}}
                    />
                </div>
            </div>

            {loading ? <p>Loading...</p> : (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th className="col-name">Nama Barang</th>
                            <th className="col-reporter">Pelapor</th>
                            <th style={{width:'15%'}}>Status Akhir</th>
                            <th className="col-location">Tanggal Masuk</th>
                            <th className="col-action">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReports.length === 0 ? <tr><td colSpan="5" align="center">Arsip kosong.</td></tr> : filteredReports.map(item => (
                            <tr key={item.id} style={{opacity: 0.9, backgroundColor: item.status === 'rejected' ? '#fff1f2' : '#f0f9ff'}}>
                                <td>
                                    <strong style={{color:'#1e293b', fontSize:'0.95rem'}}>{item.item_name}</strong>
                                    <div style={{fontSize:'0.8rem', color:'#64748b', marginTop:'2px'}}>{item.location}</div>
                                    <div style={{fontSize:'0.75rem', color:'#999'}}>{getCategoryName(item.category_id)}</div>
                                </td>
                                <td>{item.reporter_name}</td>
                                <td>
                                    <span className="badge" style={{
                                        backgroundColor: item.status === 'resolved' ? '#DBEAFE' : '#FEE2E2',
                                        color: item.status === 'resolved' ? '#1E40AF' : '#991B1B',
                                        border: item.status === 'resolved' ? '1px solid #BFDBFE' : '1px solid #FECACA'
                                    }}>
                                        {item.status === 'resolved' ? 'SELESAI' : 'DITOLAK'}
                                    </span>
                                </td>
                                <td>{new Date(item.created_at).toLocaleDateString()}</td>
                                <td className="col-action">
                                    <div className="action-buttons">
                                        <button className="btn btn-detail" onClick={() => setSelectedReport(item)} title="Lihat Detail">
                                            👁️ Detail
                                        </button>
                                        <button className="btn btn-delete" onClick={() => handleDelete(item.id)} title="Hapus Permanen">
                                            🗑 Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* MODAL DETAIL (Sama seperti sebelumnya) */}
            {selectedReport && (
                <div className="modal-overlay" onClick={() => setSelectedReport(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header" style={{background: selectedReport.status === 'rejected' ? '#991B1B' : '#1E40AF'}}>
                            <h2>Detail Arsip ({selectedReport.status === 'resolved' ? 'SELESAI' : 'DITOLAK'})</h2>
                            <button className="close-btn" onClick={() => setSelectedReport(null)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-container">
                                <div className="detail-left">
                                    <div className="detail-img-wrapper">
                                        {selectedReport.image_path ? <img src={`http://localhost:5000/uploads/${selectedReport.image_path}`} alt="Bukti" className="detail-img"/> : <span style={{color:'#999'}}>Tidak ada foto</span>}
                                    </div>
                                </div>
                                <div className="detail-right">
                                    <div className="detail-section-title">📦 Informasi Barang</div>
                                    <div className="info-row"><span className="info-label">Nama</span><span className="info-sep">:</span><span className="info-value">{selectedReport.item_name}</span></div>
                                    <div className="info-row"><span className="info-label">Kategori</span><span className="info-sep">:</span><span className="info-value">{getCategoryName(selectedReport.category_id)}</span></div>
                                    <div className="info-row"><span className="info-label">Jenis</span><span className="info-sep">:</span><span className="info-value"><span className={`badge badge-${selectedReport.type}`}>{selectedReport.type.toUpperCase()}</span></span></div>
                                    <div className="info-row"><span className="info-label">Lokasi</span><span className="info-sep">:</span><span className="info-value">{selectedReport.location}</span></div>
                                    <div className="info-row"><span className="info-label">Tgl Kejadian</span><span className="info-sep">:</span><span className="info-value">{formatDate(selectedReport.date_event)}</span></div>
                                    <div className="info-row"><span className="info-label">Deskripsi</span><span className="info-sep">:</span><span className="info-value">{selectedReport.description || '-'}</span></div>
                                    <div className="detail-section-title" style={{marginTop:'20px'}}>👤 Informasi Pelapor</div>
                                    <div className="info-row"><span className="info-label">Nama</span><span className="info-sep">:</span><span className="info-value">{selectedReport.reporter_name}</span></div>
                                    <div className="info-row"><span className="info-label">Status</span><span className="info-sep">:</span><span className="info-value">{selectedReport.reporter_status}</span></div>
                                    <div className="info-row"><span className="info-label">Kontak</span><span className="info-sep">:</span><span className="info-value" style={{color:'#2563EB'}}>{selectedReport.reporter_phone}</span></div>
                                    <div className="highlight-box">
                                        <div className="info-row" style={{marginBottom:0}}>
                                            <span className="info-label">{getIdentityLabel(selectedReport.reporter_status)}</span>
                                            <span className="info-sep">:</span>
                                            <span className="info-value">{selectedReport.identification_number}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-delete" onClick={() => handleDelete(selectedReport.id)}>Hapus Permanen</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Arsip;