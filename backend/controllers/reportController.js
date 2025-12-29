const db = require('../config/database');

const generateToken = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// 1. GET ALL REPORTS (Untuk Halaman List Publik & Pencarian)
exports.getAllReports = (req, res) => {
    const { type, keyword, category, status } = req.query; 
    
    // Default: Ambil yang statusnya bukan rejected
    let sql = `SELECT * FROM reports WHERE status != 'rejected'`;
    let params = [];

    // Jika ada filter status spesifik (misal: approved untuk publik)
    if (status) {
        sql = `SELECT * FROM reports WHERE status = ?`;
        params = [status];
    }

    // Filter Tipe (Lost / Found)
    if (type) {
        sql += ` AND type = ?`;
        params.push(type);
    }

    // Filter Kategori
    if (category) {
        sql += ` AND category_id = ?`;
        params.push(category);
    }

    // Filter Keyword (Nama, Deskripsi, Lokasi)
    if (keyword) {
        sql += ` AND (item_name LIKE ? OR description LIKE ? OR location LIKE ?)`;
        params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }

    sql += ` ORDER BY created_at DESC`;

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};

// 2. CREATE REPORT (Untuk Form Lapor)
exports.createReport = (req, res) => {
    console.log("New Report Data:", req.body);
    console.log("New Report File:", req.file);

    const {
        type, 
        item_name,
        category_id,
        description,
        location,
        date_event,
        reporter_name,
        reporter_status,
        identification_number,
        reporter_phone
    } = req.body;

    // Validasi sederhana
    if (!type || !item_name || !reporter_name) {
        return res.status(400).json({ message: "Data wajib tidak lengkap!" });
    }

    // Simpan nama file gambar (jika ada)
    const image_path = req.file ? req.file.filename : null;
    const access_token = generateToken();
    
    // Default status: 'pending' agar dicek admin dulu
    const sql = `
        INSERT INTO reports 
        (type, item_name, category_id, description, location, date_event, 
         reporter_name, reporter_status, identification_number, reporter_phone, 
         image_path, access_token, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `;

    const values = [
        type, item_name, category_id, description, location, date_event,
        reporter_name, reporter_status, identification_number, reporter_phone,
        image_path, access_token
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Insert Error:", err);
            return res.status(500).json({ message: 'Gagal menyimpan data', error: err });
        }
        res.status(201).json({ 
            success: true,
            message: 'Laporan berhasil dibuat', 
            id: result.insertId,
            access_token: access_token 
        });
    });
};