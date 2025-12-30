import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../../components/Footer';
import ReCAPTCHA from "react-google-recaptcha";
import AlertWaspada from '../../components/AlertWaspada'; 
import './FormPenemuanPage.css';

import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { PhotoIcon } from '@heroicons/react/24/outline';

const CATEGORIES = [
  { id: '1', name: 'Elektronik' },
  { id: '2', name: 'Dokumen (KTP/KTM)' },
  { id: '3', name: 'Dompet/Tas' },
  { id: '4', name: 'Kunci' },
  { id: '5', name: 'Pakaian' },
  { id: '6', name: 'Lainnya' },
];

const FormPenemuanPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const [formData, setFormData] = useState({
    reporter_name: '',
    reporter_phone: '',
    reporter_status: 'mahasiswa',
    identification_number: '',
    item_name: '',
    category_id: '',
    description: '',
    date_event: '',
    location: '',
  });

  const [errors, setErrors] = useState({});
  
  const [identityRules, setIdentityRules] = useState({
    label: 'NIM',
    subLabel: '(Wajib 11 Digit Angka)',
    placeholder: 'Contoh: 20210140001',
    maxLength: 11,
    minLength: 11,
    inputType: 'numeric'
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const status = formData.reporter_status;
    let rules = {};

    switch (status) {
      case 'mahasiswa':
        rules = { label: 'NIM', subLabel: '(Wajib 11 Digit Angka)', placeholder: 'Contoh: 20210140001', maxLength: 11, minLength: 11, inputType: 'numeric' }; break;
      case 'lainnya':
        rules = { label: 'NIK KTP', subLabel: '(Wajib 16 Digit Angka)', placeholder: 'Masukkan 16 Digit NIK', maxLength: 16, minLength: 16, inputType: 'numeric' }; break;
      case 'foreign_student':
        rules = { label: 'Passport Number', subLabel: '(5 - 10 Karakter)', placeholder: 'Enter Passport Number', maxLength: 10, minLength: 5, inputType: 'text' }; break;
      case 'dosen': case 'tendik':
        rules = { label: 'NIP / NIK Pegawai', subLabel: '(Maksimal 18 Digit Angka)', placeholder: 'Masukkan NIP / NIK Pegawai', maxLength: 18, minLength: 16, inputType: 'numeric' }; break;
      default:
        rules = { label: 'Nomor Identitas', subLabel: '', placeholder: 'Nomor Identitas', maxLength: 20, minLength: 1, inputType: 'text' };
    }

    setIdentityRules(rules);
    setFormData(prev => ({ ...prev, identification_number: '' }));
    setErrors(prev => ({ ...prev, identification_number: null }));
  }, [formData.reporter_status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'identification_number') {
        if (identityRules.inputType === 'numeric') {
            const numericValue = value.replace(/[^0-9]/g, ''); 
            setFormData({ ...formData, [name]: numericValue });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    } else if (name === 'reporter_phone') {
        setFormData({ ...formData, [name]: value.replace(/[^0-9]/g, '') });
    } else if (name === 'reporter_name') {
        setFormData({ ...formData, [name]: value.replace(/[^a-zA-Z\s]/g, '') });
    } else {
        setFormData({ ...formData, [name]: value });
    }
    if (errors[name]) setErrors({ ...errors, [name]: null });
    if (submitError) setSubmitError(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { 
        setErrors(prev => ({ ...prev, item_image: '❌ Ukuran file terlalu besar! Maksimal 2MB.' }));
        clearFile(); return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      if (errors.item_image) setErrors(prev => ({ ...prev, item_image: null }));
    }
  };

  const clearFile = () => {
    setImageFile(null); setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onCaptchaChange = (value) => {
    setCaptchaValue(value);
    if (value && errors.recaptcha) setErrors(prev => ({ ...prev, recaptcha: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.reporter_phone) {
        newErrors.reporter_phone = "❌ Nomor WhatsApp wajib diisi.";
    } else {
        if (!formData.reporter_phone.startsWith('08')) newErrors.reporter_phone = "❌ Wajib diawali '08'.";
        else if (formData.reporter_phone.length < 10) newErrors.reporter_phone = "❌ Nomor terlalu pendek (Min 10).";
        else if (formData.reporter_phone.length > 13) newErrors.reporter_phone = "❌ Nomor terlalu panjang (Max 13).";
    }

    if (!formData.identification_number) {
        newErrors.identification_number = `❌ ${identityRules.label} wajib diisi.`;
    } else {
        const len = formData.identification_number.length;
        if (formData.reporter_status === 'mahasiswa' && len !== 11) newErrors.identification_number = `❌ NIM wajib pas 11 digit. (Saat ini: ${len})`;
        else if (formData.reporter_status === 'lainnya' && len !== 16) newErrors.identification_number = `❌ NIK KTP wajib pas 16 digit. (Saat ini: ${len})`;
        else if (formData.reporter_status === 'foreign_student' && len < 5) newErrors.identification_number = `❌ Passport Number minimal 5 karakter.`;
    }

    if (!formData.reporter_name) newErrors.reporter_name = "❌ Nama wajib diisi.";
    if (!formData.category_id) newErrors.category_id = "❌ Pilih kategori barang.";
    if (!formData.item_name) newErrors.item_name = "❌ Nama barang wajib diisi.";
    if (!formData.description) newErrors.description = "❌ Deskripsi wajib diisi.";
    if (!formData.date_event) newErrors.date_event = "❌ Tanggal wajib diisi.";
    if (!formData.location) newErrors.location = "❌ Lokasi wajib diisi.";
    if (!imageFile) newErrors.item_image = "❌ Foto barang wajib diunggah sebagai bukti.";
    if (!captchaValue) newErrors.recaptcha = "❌ Mohon centang kotak konfirmasi di atas.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      const firstErrorKey = Object.keys(errors)[0];
      let selector = `[name="${firstErrorKey}"]`;
      if (firstErrorKey === 'item_image') selector = '#photo-section';
      if (firstErrorKey === 'recaptcha') selector = '#recaptcha-section';
      const element = document.querySelector(selector);
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);
    const payload = new FormData();
    
    Object.keys(formData).forEach(key => payload.append(key, formData[key]));
    
    payload.append('type', 'found');

    if (imageFile) payload.append('item_image', imageFile);

    try {
      const response = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        body: payload
      });
      const result = await response.json();

      if (result.success || response.ok) {
        setShowSuccessModal(true);
      } else {
        setSubmitError(result.message || '❌ Gagal menyimpan data.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitError('❌ Terjadi kesalahan koneksi. Pastikan Backend (Port 5000) menyala.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="found-page-wrapper">
      <Navbar />

      <div className="found-header">
        <div className="header-content">
          <h1>Lapor Penemuan Barang</h1>
          <p>Terima kasih telah berbaik hati melaporkan barang yang Anda temukan.</p>
        </div>
      </div>

      <main>
        <div className="form-card">
          <form onSubmit={handleSubmit} noValidate>

            <div className="form-card-body">
              
              {submitError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded flex items-center gap-3">
                  <span className="text-2xl">❌</span>
                  <p className="text-red-700 font-bold">{submitError}</p>
                </div>
              )}

              <h2 className="form-section-title">Identitas Penemu</h2>

              <div className="input-group">
                <label className="form-label">Nama<span className="required-star">*</span></label>
                <input type="text" name="reporter_name" value={formData.reporter_name} onChange={handleChange} maxLength="50" className={`custom-input ${errors.reporter_name ? 'error' : ''}`} placeholder="Masukkan nama lengkap Anda" />
                {errors.reporter_name && <p className="error-text">{errors.reporter_name}</p>}
              </div>

              <div className="input-group">
                <label className="form-label">Nomor WhatsApp<span className="required-star">*</span></label>
                <input type="tel" name="reporter_phone" value={formData.reporter_phone} onChange={handleChange} maxLength="13" className={`custom-input ${errors.reporter_phone ? 'error' : ''}`} placeholder="08xxxxxxxxxx (Mulai 08)" />
                {errors.reporter_phone && <p className="error-text">{errors.reporter_phone}</p>}
              </div>

              <div className="input-group">
                <label className="form-label">Status Pelapor<span className="required-star">*</span></label>
                <div className="radio-container">
                  {['mahasiswa', 'dosen', 'tendik', 'foreign_student', 'lainnya'].map((status) => (
                    <label key={status} className="radio-label">
                      <input type="radio" name="reporter_status" value={status} checked={formData.reporter_status === status} onChange={handleChange} className="radio-input"/>
                      <span>{status.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="input-group">
                <label className="form-label">{identityRules.label}<span className="required-star">*</span> <span className="sub-label">{identityRules.subLabel}</span></label>
                <input type={identityRules.inputType === 'numeric' ? 'tel' : 'text'} name="identification_number" value={formData.identification_number} onChange={handleChange} maxLength={identityRules.maxLength} className={`custom-input ${errors.identification_number ? 'error' : ''}`} placeholder={identityRules.placeholder} />
                {errors.identification_number && <p className="error-text">{errors.identification_number}</p>}
              </div>

              <h2 className="form-section-title mt-section">Data Barang Temuan</h2>

              <div className="input-group">
                <label className="form-label">Kategori Barang<span className="required-star">*</span></label>
                <select name="category_id" value={formData.category_id} onChange={handleChange} className={`custom-select ${errors.category_id ? 'error' : ''}`}>
                  <option value="" disabled>Pilih Kategori Barang</option>
                  {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
                {errors.category_id && <p className="error-text">{errors.category_id}</p>}
              </div>

              <div className="input-group">
                <label className="form-label">Nama Barang<span className="required-star">*</span></label>
                <input type="text" name="item_name" value={formData.item_name} onChange={handleChange} maxLength="100" className={`custom-input ${errors.item_name ? 'error' : ''}`} placeholder="Contoh: Dompet kulit coklat"/>
                {errors.item_name && <p className="error-text">{errors.item_name}</p>}
              </div>

              <div className="input-group">
                <label className="form-label">Deskripsi Detail<span className="required-star">*</span></label>
                <textarea name="description" rows="4" value={formData.description} onChange={handleChange} className={`custom-textarea ${errors.description ? 'error' : ''}`} placeholder="Jelaskan ciri-ciri khusus..."></textarea>
                {errors.description && <p className="error-text">{errors.description}</p>}
              </div>

              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px'}}>
                <div className="input-group">
                  <label className="form-label">Tanggal Ditemukan<span className="required-star">*</span></label>
                  <input type="date" name="date_event" max={today} value={formData.date_event} onChange={handleChange} className={`custom-input ${errors.date_event ? 'error' : ''}`}/>
                  {errors.date_event && <p className="error-text">{errors.date_event}</p>}
                </div>
                <div className="input-group">
                  <label className="form-label">Lokasi Penemuan<span className="required-star">*</span></label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} className={`custom-input ${errors.location ? 'error' : ''}`} placeholder="Contoh: Gedung AR Fachruddin"/>
                  {errors.location && <p className="error-text">{errors.location}</p>}
                </div>
              </div>

              <div className="input-group" id="photo-section">
                <label className="form-label">Foto Barang<span className="required-star">*</span></label>
                <div className={`upload-box-modern ${errors.item_image ? 'error-box' : ''}`}>
                  <input ref={fileInputRef} type="file" id="file-upload" className="hidden-input" accept="image/png, image/jpeg, image/jpg" onChange={handleFileChange} />
                  {!imagePreview ? (
                    <label htmlFor="file-upload" className="upload-label-empty">
                      <div className="icon-bg"><PhotoIcon className="upload-icon-modern" /></div>
                      <p className="upload-text-main">Klik untuk unggah foto</p>
                      <p className="upload-text-sub">Format PNG, JPG. Maksimal 2MB.</p>
                    </label>
                  ) : (
                    <div className="preview-wrapper">
                      <img src={imagePreview} alt="Preview" className="preview-img-full" />
                      <button type="button" onClick={(e) => { e.preventDefault(); clearFile(); }} className="btn-remove-overlay" title="Hapus Foto">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-500">
                          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                {errors.item_image && <p className="error-text">{errors.item_image}</p>}
              </div>

            </div>

            <div className="form-footer">
              <h2 className="form-section-title" id="recaptcha-section" style={{ marginTop: 0 }}>Konfirmasi Keamanan</h2>
              <div className="input-group">
                <div style={{ display: 'inline-block' }}>
                  <ReCAPTCHA sitekey="6LfvKS0sAAAAAMcbAmjk5QulmbPPNvcQkcS1bcGR" onChange={onCaptchaChange} />
                </div>
                {errors.recaptcha && <p className="error-text">{errors.recaptcha}</p>}
              </div>

              <AlertWaspada />

              <div className="button-group">
                <button type="button" onClick={() => navigate('/')} className="btn btn-cancel">Batal</button>
                <button type="submit" disabled={loading} className="btn btn-submit">
                  {loading ? 'Mengirim...' : 'Laporkan Penemuan'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="success-icon-bg"><CheckCircleIcon className="success-icon" /></div>
            <h3 className="modal-title">Laporan Terkirim!</h3>
            <p className="modal-text">Data Anda berhasil disimpan.</p>
            <div className="modal-actions">
              <button onClick={() => navigate('/list')} className="btn-modal-primary">Lihat List Barang</button>
              <button onClick={() => navigate('/')} className="btn-modal-secondary">Kembali ke Home</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default FormPenemuanPage;