const db = require('../config/database');

// 1. AMBIL BARANG UNTUK HOMEPAGE (Hanya yang statusnya 'approved')
exports.getRecentFoundItems = (req, res) => {
    // Sesuai catatan di SQL: 'approved' = Sudah tampil di halaman publik
    const sql = `
        SELECT reports.*, categories.name as category_name 
        FROM reports 
        LEFT JOIN categories ON reports.category_id = categories.id
        WHERE reports.type = 'found' 
        AND reports.status = 'approved' 
        ORDER BY reports.date_event DESC 
        LIMIT 6
    `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// 2. AMBIL SEMUA BARANG (Halaman List Barang)
exports.getAllFoundItems = (req, res) => {
    const search = req.query.search || '';
    
    let sql = `
        SELECT reports.*, categories.name as category_name 
        FROM reports 
        LEFT JOIN categories ON reports.category_id = categories.id
        WHERE reports.type = 'found' 
        AND reports.status = 'approved'
        AND reports.item_name LIKE ?
        ORDER BY reports.date_event DESC
    `;
    
    db.query(sql, [`%${search}%`], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// 3. SUBMIT LAPORAN BARU (Found)
exports.createItemReport = (req, res) => {
    const data = req.body;
    const file = req.file;

    // Generate path gambar
    const imagePath = file ? '/uploads/' + file.filename : null;
    
    // Generate Random Token (Sesuai deskripsi database kamu)
    const accessToken = Math.random().toString(36).substring(2, 12).toUpperCase(); // Contoh: '9X2A1B3C'

    const query = `
        INSERT INTO reports (
            category_id, type, status, 
            reporter_name, reporter_status, identification_number, 
            reporter_contact, reporter_phone, 
            item_name, description, location, date_event, 
            image_path, access_token
        ) VALUES (?)
    `;

    // Susun array values harus URUT sesuai kolom di atas
    const values = [
        data.category_id, 
        'found',      // type (sesuai ENUM)
        'pending',    // status default (sesuai ENUM)
        data.reporter_name,
        data.reporter_status,
        data.identification_number,
        data.reporter_email, // Map ke reporter_contact
        data.reporter_phone,
        data.item_name,
        data.description,
        data.location,
        data.date_event,
        imagePath,
        accessToken
    ];

    db.query(query, [values], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ success: false, message: 'Gagal menyimpan laporan' });
        }
        
        res.json({ 
            success: true, 
            message: 'Laporan berhasil! Menunggu konfirmasi admin.',
            token: accessToken // Balikin token biar user bisa simpan
        });
    });
};