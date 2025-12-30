import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ActiveItems = () => {
    // --- STATE ---
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterText, setFilterText] = useState("");
    
    // UBAH DISINI: Default filter jadi 'all' agar laporan kehilangan yang diapprove langsung muncul
    const [filterType, setFilterType] = useState("all"); 
    const [filterCategory, setFilterCategory] = useState("");
    
    // State Modal
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('detail'); 
    const [selectedItem, setSelectedItem] = useState(null); 
    
    // State Form
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [formData, setFormData] = useState({
        item_name: '', category_id: '1', date_event: '', location: '', description: '',
        type: 'found', reporter_name: '', reporter_status: 'mahasiswa', reporter_phone: '', identification_number: ''
    });

    // --- HELPER RULES ---
    const getIdentityRules = (status) => {
        switch (status) {
            case 'mahasiswa': return { label: 'NIM', subLabel: '(Wajib 11 Digit Angka)', placeholder: 'Contoh: 20210140001', maxLength: 11, isNumeric: true };
            case 'lainnya': return { label: 'NIK KTP', subLabel: '(Wajib 16 Digit Angka)', placeholder: 'Masukkan 16 Digit NIK', maxLength: 16, isNumeric: true };
            case 'foreign_student': return { label: 'Passport Number', subLabel: '(5 - 10 Karakter)', placeholder: 'Enter Passport Number', maxLength: 10, isNumeric: false };
            case 'dosen': case 'tendik': return { label: 'NIP / NIK Pegawai', subLabel: '(Maksimal 18 Digit Angka)', placeholder: 'Masukkan NIP / NIK', maxLength: 18, isNumeric: true };
            default: return { label: 'Nomor Identitas', subLabel: '', placeholder: 'Nomor Identitas', maxLength: 20, isNumeric: false };
        }
    };

    // --- HELPER DISPLAY ---
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
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

    // --- FETCH DATA (Status Approved) ---
    const fetchReports = () => {
        setLoading(true);
        axios.get('http://localhost:5000/api/admin/reports?status=approved')
            .then(res => { setReports(res.data); setLoading(false); })
            .catch(err => { console.error(err); setLoading(false); });
    };

    useEffect(() => { fetchReports(); }, []);

    // --- FILTER LOGIC ---
    const filteredReports = reports.filter(item => {
        const matchText = 
            item.item_name.toLowerCase().includes(filterText.toLowerCase()) ||
            item.location.toLowerCase().includes(filterText.toLowerCase()) ||
            item.description.toLowerCase().includes(filterText.toLowerCase());
        
        const matchType = filterType === 'all' ? true : item.type === filterType;
        const matchCategory = filterCategory === "" ? true : String(item.category_id) === filterCategory;

        return matchText && matchType && matchCategory;
    });

    // --- HANDLERS ---
    const handleDetail = (item) => {
        setModalMode('detail'); setSelectedItem(item); setShowModal(true);
    };

    const handleEdit = (item) => {
        setModalMode('edit'); setSelectedItem(item);
        setFormData({
            item_name: item.item_name, category_id: item.category_id, date_event: item.date_event ? item.date_event.split('T')[0] : '',
            location: item.location, description: item.description, type: item.type,
            reporter_name: item.reporter_name, reporter_status: item.reporter_status, reporter_phone: item.reporter_phone, identification_number: item.identification_number
        });
        setImagePreview(item.image_path ? `http://localhost:5000/uploads/${item.image_path}` : null);
        setImageFile(null); setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const payload = new FormData();
            Object.keys(formData).forEach(key => payload.append(key, formData[key]));
            if (imageFile) payload.append('item_image', imageFile);

            // Hanya UPDATE karena tombol tambah sudah dipindah
            await axios.put(`http://localhost:5000/api/admin/reports/${selectedItem.id}`, payload);
            alert("Data berhasil diperbarui!");
            setShowModal(false);
            fetchReports();
        } catch (error) {
            console.error(error);
            alert("Gagal menyimpan data.");
        }
    };

    const handleAction = async (id, action) => {
        if (!window.confirm(action === 'delete' ? "Hapus permanen?" : "Tandai selesai?")) return;
        try {
            if (action === 'delete') await axios.delete(`http://localhost:5000/api/admin/reports/${id}`);
            else if (action === 'resolved') await axios.put(`http://localhost:5000/api/admin/reports/${id}/status`, { status: 'resolved' });
            fetchReports();
            if (modalMode === 'detail') setShowModal(false);
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
            {/* Header */}
            <div className="table-header-action" style={{flexDirection: 'column', alignItems: 'stretch', gap: '15px'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    {/* UBAH JUDUL */}
                    <h3 className="page-title" style={{margin:0, borderLeft:'none', paddingLeft:0, color:'#065F46', fontSize:'1.2rem'}}>
                        Manajemen Laporan (Aktif)
                    </h3>
                </div>
                <div style={{display: 'flex', gap: '10px', flexWrap:'wrap'}}>
                    <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="search-input" style={{width: '180px', fontWeight: 'bold', color: '#065F46'}}>
                        <option value="all">Semua Tipe</option>
                        <option value="found">Barang Temuan</option>
                        <option value="lost">Barang Hilang</option>
                    </select>

                    <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="search-input" style={{width: '180px', fontWeight: 'bold'}}>
                        <option value="">Semua Kategori</option>
                        <option value="1">Elektronik</option>
                        <option value="2">Dokumen</option>
                        <option value="3">Dompet/Tas</option>
                        <option value="4">Kunci</option>
                        <option value="5">Pakaian</option>
                        <option value="6">Lainnya</option>
                    </select>

                    <input type="text" className="search-input" placeholder="Cari nama, deskripsi..." value={filterText} onChange={(e) => setFilterText(e.target.value)} style={{flex: 1}}/>
                </div>
            </div>

            {/* TABEL */}
            {loading ? <p>Loading...</p> : (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th style={{width: '50px', textAlign: 'center'}}>No</th>
                            <th className="col-name">Nama Barang</th>
                            <th style={{width: '18%'}}>Waktu Kejadian</th>
                            <th style={{width: '25%'}}>Deskripsi</th>
                            <th style={{width: '15%'}}>Lokasi</th>
                            <th className="col-action">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReports.length === 0 ? <tr><td colSpan="6" align="center">Data tidak ditemukan.</td></tr> : filteredReports.map((item, index) => (
                            <tr key={item.id}>
                                <td style={{textAlign: 'center'}}>{index + 1}</td>
                                <td>
                                    <strong style={{color:'#1e293b', fontSize:'0.95rem', display:'block'}}>{item.item_name}</strong>
                                    <span style={{fontSize:'0.8rem', color:'#64748b'}}>{getCategoryName(item.category_id)}</span>
                                    {/* Badge Status Selalu Muncul Karena Default 'All' */}
                                    <div style={{marginTop:'2px'}}>
                                        <span className={`badge badge-${item.type}`} style={{
                                            backgroundColor: item.type === 'found' ? '#D1FAE5' : '#FEE2E2',
                                            color: item.type === 'found' ? '#065F46' : '#991B1B'
                                        }}>
                                            {item.type === 'found' ? 'DITEMUKAN' : 'KEHILANGAN'}
                                        </span>
                                    </div>
                                </td>
                                <td>{formatDate(item.date_event)}</td>
                                <td><div style={{maxHeight:'60px', overflow:'hidden', textOverflow:'ellipsis', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical'}}>{item.description}</div></td>
                                <td><strong>{item.location}</strong></td>
                                <td className="col-action">
                                    <div className="action-buttons">
                                        <button className="btn btn-detail" onClick={() => handleDetail(item)} title="Lihat Detail">👁️ Detail</button>
                                        <button className="btn btn-detail" onClick={() => handleEdit(item)} title="Edit" style={{backgroundColor:'#F59E0B'}}>✏️ Edit</button>
                                        <button className="btn btn-approve" onClick={() => handleAction(item.id, 'resolved')} title="Selesai">✓ Selesai</button>
                                        <button className="btn btn-delete" onClick={() => handleAction(item.id, 'delete')} title="Hapus">🗑 Hapus</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            
            {/* MODAL (DETAIL & EDIT) */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: modalMode === 'detail' ? '800px' : '700px'}}>
                        <div className="modal-header">
                            <h2>{modalMode === 'detail' ? 'Detail Lengkap Barang' : 'Edit Data Barang'}</h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            
                            {/* VIEW DETAIL */}
                            {modalMode === 'detail' && selectedItem && (
                                <div className="detail-container">
                                    <div className="detail-left">
                                        <div className="detail-img-wrapper">
                                            {selectedItem.image_path ? <img src={`http://localhost:5000/uploads/${selectedItem.image_path}`} alt="Bukti" className="detail-img"/> : <span style={{color:'#999'}}>Tidak ada foto</span>}
                                        </div>
                                    </div>
                                    <div className="detail-right">
                                        <div className="detail-section-title">📦 Informasi Barang</div>
                                        <div className="info-row"><span className="info-label">Nama</span><span className="info-sep">:</span><span className="info-value">{selectedItem.item_name}</span></div>
                                        <div className="info-row"><span className="info-label">Kategori</span><span className="info-sep">:</span><span className="info-value">{getCategoryName(selectedItem.category_id)}</span></div>
                                        <div className="info-row"><span className="info-label">Jenis</span><span className="info-sep">:</span><span className="info-value"><span className={`badge badge-${selectedItem.type}`} style={{
                                            backgroundColor: selectedItem.type === 'found' ? '#D1FAE5' : '#FEE2E2',
                                            color: selectedItem.type === 'found' ? '#065F46' : '#991B1B',
                                            padding: '2px 6px', borderRadius:'4px', fontSize:'0.75rem', fontWeight:'bold'
                                        }}>{selectedItem.type.toUpperCase()}</span></span></div>
                                        <div className="info-row"><span className="info-label">Lokasi</span><span className="info-sep">:</span><span className="info-value">{selectedItem.location}</span></div>
                                        <div className="info-row"><span className="info-label">Tgl Kejadian</span><span className="info-sep">:</span><span className="info-value">{formatDate(selectedItem.date_event)}</span></div>
                                        <div className="info-row"><span className="info-label">Deskripsi</span><span className="info-sep">:</span><span className="info-value">{selectedItem.description || '-'}</span></div>
                                        <div className="detail-section-title" style={{marginTop:'20px'}}>👤 Informasi Pelapor</div>
                                        <div className="info-row"><span className="info-label">Nama</span><span className="info-sep">:</span><span className="info-value">{selectedItem.reporter_name}</span></div>
                                        <div className="info-row"><span className="info-label">Status</span><span className="info-sep">:</span><span className="info-value">{selectedItem.reporter_status}</span></div>
                                        <div className="info-row"><span className="info-label">Kontak</span><span className="info-sep">:</span><span className="info-value" style={{color:'#2563EB'}}>{selectedItem.reporter_phone}</span></div>
                                        <div className="highlight-box">
                                            <div className="info-row" style={{marginBottom:0}}>
                                                <span className="info-label">{getIdentityLabel(selectedItem.reporter_status)}</span>
                                                <span className="info-sep">:</span>
                                                <span className="info-value">{selectedItem.identification_number}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* VIEW FORM (EDIT ONLY) */}
                            {modalMode === 'edit' && (
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
                                    <div style={{marginBottom:'15px'}}><label style={{fontWeight:'bold', display:'block', marginBottom:'5px'}}>Foto Barang (Kosongkan jika tidak ganti)</label><input type="file" onChange={handleFileChange} className="search-input" style={{width:'100%'}} />{imagePreview && <div style={{marginTop:'10px', textAlign:'center', border:'1px dashed #ccc', padding:'10px'}}><img src={imagePreview} alt="Preview" style={{maxHeight:'150px', maxWidth:'100%'}} /></div>}</div>
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
                                        <button type="submit" className="btn btn-approve">Update</button>
                                    </div>
                                </form>
                            )}
                        </div>
                        {modalMode === 'detail' && selectedItem && (
                            <div className="modal-footer">
                                <button className="btn btn-delete" onClick={() => handleAction(selectedItem.id, 'delete')}>Hapus Barang</button>
                                <button className="btn btn-approve" onClick={() => handleAction(selectedItem.id, 'resolved')}>Tandai Selesai</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActiveItems;