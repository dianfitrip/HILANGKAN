import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LaporanMasuk = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterText, setFilterText] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [selectedReport, setSelectedReport] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('detail'); 
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [formData, setFormData] = useState({
        item_name: '', category_id: '1', date_event: '', location: '', description: '', type: 'found',
        reporter_name: 'Admin', reporter_status: 'tendik', reporter_phone: '', identification_number: ''
    });

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    const getCategoryName = (id) => {
        const cats = { '1': 'Elektronik', '2': 'Dokumen', '3': 'Dompet/Tas', '4': 'Kunci', '5': 'Pakaian', '6': 'Lainnya' };
        return cats[id] || 'Lainnya';
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

    const getIdentityRules = (status) => {
        switch (status) {
            case 'mahasiswa': return { label: 'NIM', subLabel: '(Wajib 11 Digit Angka)', placeholder: 'Contoh: 20210140001', maxLength: 11, isNumeric: true };
            case 'lainnya': return { label: 'NIK KTP', subLabel: '(Wajib 16 Digit Angka)', placeholder: 'Masukkan 16 Digit NIK', maxLength: 16, isNumeric: true };
            case 'foreign_student': return { label: 'Passport Number', subLabel: '(5 - 10 Karakter)', placeholder: 'Enter Passport Number', maxLength: 10, isNumeric: false };
            case 'dosen': case 'tendik': return { label: 'NIP / NIK Pegawai', subLabel: '(Maksimal 18 Digit Angka)', placeholder: 'Masukkan NIP / NIK', maxLength: 18, isNumeric: true };
            default: return { label: 'Nomor Identitas', subLabel: '', placeholder: 'Nomor Identitas', maxLength: 20, isNumeric: false };
        }
    };

    const fetchReports = () => {
        setLoading(true);
        axios.get('http://localhost:5000/api/admin/reports?status=pending')
            .then(res => { setReports(res.data); setLoading(false); })
            .catch(err => { console.error(err); setLoading(false); });
    };

    useEffect(() => { fetchReports(); }, []);

    const filteredReports = reports.filter(item => {
        const matchText = 
            item.item_name.toLowerCase().includes(filterText.toLowerCase()) ||
            item.reporter_name.toLowerCase().includes(filterText.toLowerCase()) ||
            item.location.toLowerCase().includes(filterText.toLowerCase());
        const matchCategory = filterCategory === "" ? true : String(item.category_id) === filterCategory;
        return matchText && matchCategory;
    });

    const handleDetail = (item) => {
        setModalMode('detail');
        setSelectedReport(item);
        setShowModal(true);
    };

    const handleAddNew = () => {
        setModalMode('add');
        setSelectedReport(null);
        setFormData({
            item_name: '', category_id: '1', date_event: '', location: '', description: '', type: 'found',
            reporter_name: 'Admin', reporter_status: 'tendik', reporter_phone: '', identification_number: ''
        });
        setImagePreview(null);
        setImageFile(null);
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const payload = new FormData();
            Object.keys(formData).forEach(key => payload.append(key, formData[key]));
            if (imageFile) payload.append('item_image', imageFile);

            await axios.post('http://localhost:5000/api/reports', payload);
            alert("Laporan berhasil ditambahkan!");
            
            setShowModal(false);
            fetchReports();
        } catch (error) {
            console.error(error);
            alert("Gagal menyimpan data.");
        }
    };

    const handleAction = async (id, action) => {
        if (!window.confirm("Konfirmasi aksi?")) return;
        try {
            if (action === 'delete') await axios.delete(`http://localhost:5000/api/admin/reports/${id}`);
            else await axios.put(`http://localhost:5000/api/admin/reports/${id}/status`, { status: action });
            fetchReports();
            if(modalMode === 'detail') setShowModal(false);
        } catch (error) { alert("Gagal memproses."); }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        const rules = getIdentityRules(formData.reporter_status);
        if (name === 'reporter_phone') setFormData(prev => ({ ...prev, [name]: value.replace(/[^0-9]/g, '') }));
        else if (name === 'identification_number') setFormData(prev => ({ ...prev, [name]: rules.isNumeric ? value.replace(/[^0-9]/g, '') : value }));
        else if (name === 'reporter_status') setFormData(prev => ({ ...prev, [name]: value, identification_number: '' }));
        else setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
    };

    const currentIdentityRules = getIdentityRules(formData.reporter_status);

    return (
        <div className="table-card">
            <div className="table-header-action" style={{flexDirection: 'column', alignItems: 'stretch', gap: '15px'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <h3 className="page-title" style={{margin:0, borderLeft:'none', paddingLeft:0, color:'#065F46', fontSize:'1.2rem'}}>
                        Laporan Masuk (Pending)
                    </h3>
                    <button className="btn btn-approve" onClick={handleAddNew} style={{padding:'8px 16px', fontSize:'0.9rem'}}>
                        + Buat Laporan
                    </button>
                </div>
                
                <div style={{display: 'flex', gap: '10px'}}>
                    <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="search-input" style={{width: '180px', fontWeight: 'bold'}}>
                        <option value="">Semua Kategori</option>
                        <option value="1">Elektronik</option>
                        <option value="2">Dokumen</option>
                        <option value="3">Dompet/Tas</option>
                        <option value="4">Kunci</option>
                        <option value="5">Pakaian</option>
                        <option value="6">Lainnya</option>
                    </select>
                    <input type="text" className="search-input" placeholder="Cari Barang / Pelapor..." value={filterText} onChange={(e) => setFilterText(e.target.value)} style={{flex: 1}}/>
                </div>
            </div>
            
            {loading ? <p>Loading...</p> : (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th className="col-name">Nama Barang</th>
                            <th className="col-reporter">Pelapor</th>
                            <th className="col-location">Lokasi & Waktu</th>
                            <th className="col-action">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReports.length === 0 ? <tr><td colSpan="4" align="center">Data tidak ditemukan.</td></tr> : filteredReports.map(item => (
                            <tr key={item.id}>
                                <td>
                                    <span className="item-name-text">{item.item_name}</span>
                                    <span className={`badge badge-${item.type}`}>{item.type === 'lost' ? 'KEHILANGAN' : 'DITEMUKAN'}</span>
                                    <div style={{fontSize:'0.8rem', color:'#666', marginTop:'4px'}}>{getCategoryName(item.category_id)}</div>
                                </td>
                                <td>{item.reporter_name}</td>
                                <td>
                                    <div>{item.location}</div>
                                    <small style={{color:'#666'}}>{formatDate(item.created_at)}</small>
                                </td>
                                <td className="col-action">
                                    <div className="action-buttons">
                                        <button className="btn btn-detail" onClick={() => handleDetail(item)}>Lihat Detail</button>
                                        <button className="btn btn-approve" onClick={() => handleAction(item.id, 'approved')}>✓ approved</button>
                                        <button className="btn btn-reject" onClick={() => handleAction(item.id, 'rejected')}>✕ rejected</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: modalMode === 'detail' ? '800px' : '700px'}}>
                        <div className="modal-header">
                            <h2>{modalMode === 'detail' ? 'Detail Laporan' : 'Buat Laporan Baru'}</h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            
                            {modalMode === 'detail' && selectedReport && (
                                <div className="detail-container">
                                    <div className="detail-left">
                                        <div className="detail-img-wrapper">
                                            {selectedReport.image_path ? (
                                                <img src={`http://localhost:5000/uploads/${selectedReport.image_path}`} alt="Bukti" className="detail-img"/>
                                            ) : <span style={{color:'#999'}}>Tidak ada foto</span>}
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
                                                <span className="info-value" style={{fontSize:'1.1rem'}}>{selectedReport.identification_number}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalMode === 'add' && (
                                <form onSubmit={handleSave}>
                                    <div className="detail-section-title">📦 Data Barang</div>
                                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px', marginBottom:'15px'}}>
                                        <div><label style={{fontWeight:'bold', display:'block', marginBottom:'5px'}}>Nama Barang</label><input type="text" name="item_name" value={formData.item_name} onChange={handleFormChange} required className="search-input" style={{width:'100%'}} /></div>
                                        <div><label style={{fontWeight:'bold', display:'block', marginBottom:'5px'}}>Kategori</label><select name="category_id" value={formData.category_id} onChange={handleFormChange} className="search-input" style={{width:'100%'}}><option value="1">Elektronik</option><option value="2">Dokumen</option><option value="3">Dompet/Tas</option><option value="4">Kunci</option><option value="5">Pakaian</option><option value="6">Lainnya</option></select></div>
                                    </div>
                                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px', marginBottom:'15px'}}>
                                        <div><label style={{fontWeight:'bold', display:'block', marginBottom:'5px'}}>Tanggal</label><input type="date" name="date_event" value={formData.date_event} onChange={handleFormChange} required className="search-input" style={{width:'100%'}} /></div>
                                        <div><label style={{fontWeight:'bold', display:'block', marginBottom:'5px'}}>Lokasi</label><input type="text" name="location" value={formData.location} onChange={handleFormChange} required className="search-input" style={{width:'100%'}} /></div>
                                    </div>
                                    <div style={{marginBottom:'15px'}}><label style={{fontWeight:'bold', display:'block', marginBottom:'5px'}}>Deskripsi</label><textarea name="description" value={formData.description} onChange={handleFormChange} rows="2" className="search-input" style={{width:'100%', fontFamily:'inherit'}}></textarea></div>
                                    <div style={{marginBottom:'15px'}}><label style={{fontWeight:'bold', display:'block', marginBottom:'5px'}}>Foto Barang</label><input type="file" onChange={handleFileChange} className="search-input" style={{width:'100%'}} />{imagePreview && <div style={{marginTop:'10px', textAlign:'center', border:'1px dashed #ccc', padding:'10px'}}><img src={imagePreview} alt="Preview" style={{maxHeight:'150px', maxWidth:'100%'}} /></div>}</div>
                                    
                                    <div className="detail-section-title" style={{marginTop:'25px'}}>👤 Data Pelapor</div>
                                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px', marginBottom:'15px'}}>
                                        <div><label style={{fontWeight:'bold', display:'block', marginBottom:'5px'}}>Nama Pelapor</label><input type="text" name="reporter_name" value={formData.reporter_name} onChange={handleFormChange} required className="search-input" style={{width:'100%'}} /></div>
                                        <div><label style={{fontWeight:'bold', display:'block', marginBottom:'5px'}}>Status Pelapor</label><select name="reporter_status" value={formData.reporter_status} onChange={handleFormChange} className="search-input" style={{width:'100%'}}><option value="mahasiswa">Mahasiswa</option><option value="dosen">Dosen</option><option value="tendik">Tendik</option><option value="lainnya">Lainnya</option><option value="foreign_student">Mahasiswa Asing</option></select></div>
                                    </div>
                                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px', marginBottom:'15px'}}>
                                        <div><label style={{fontWeight:'bold', display:'block', marginBottom:'5px'}}>Kontak (WA) <small style={{fontWeight:'normal', color:'#666'}}>(Angka Saja)</small></label><input type="text" name="reporter_phone" value={formData.reporter_phone} onChange={handleFormChange} maxLength={13} placeholder="08xxxxxxxxxx" required className="search-input" style={{width:'100%'}} /></div>
                                        <div><label style={{fontWeight:'bold', display:'block', marginBottom:'5px'}}>{currentIdentityRules.label} <small style={{fontWeight:'normal', color:'#666'}}>{currentIdentityRules.subLabel}</small></label><input type="text" name="identification_number" value={formData.identification_number} onChange={handleFormChange} maxLength={currentIdentityRules.maxLength} placeholder={currentIdentityRules.placeholder} required className="search-input" style={{width:'100%'}} /></div>
                                    </div>
                                    <div style={{marginBottom:'15px'}}><label style={{fontWeight:'bold', display:'block', marginBottom:'5px'}}>Jenis Laporan</label><select name="type" value={formData.type} onChange={handleFormChange} className="search-input" style={{width:'100%'}}><option value="found">Barang Temuan (Found)</option><option value="lost">Barang Hilang (Lost)</option></select></div>
                                    
                                    <div className="modal-footer" style={{padding:'0', marginTop:'20px', background:'none', border:'none'}}>
                                        <button type="button" onClick={() => setShowModal(false)} className="btn btn-delete" style={{backgroundColor:'#94a3b8'}}>Batal</button>
                                        <button type="submit" className="btn btn-approve">Simpan Laporan</button>
                                    </div>
                                </form>
                            )}
                        </div>

                        {modalMode === 'detail' && selectedReport && (
                            <div className="modal-footer">
                                <button className="btn btn-approve" onClick={() => handleAction(selectedReport.id, 'approved')}>Terima</button>
                                <button className="btn btn-reject" onClick={() => handleAction(selectedReport.id, 'rejected')}>Tolak</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LaporanMasuk;