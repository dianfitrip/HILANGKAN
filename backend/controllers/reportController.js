const db = require('../config/database');

// --- HELPER: Generate Token Unik ---
const generateToken = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// 1. GET ALL REPORTS (Mendukung Filter Type, Keyword, & Category)
exports.getAllReports = (req, res) => {
    // Ambil parameter dari URL (contoh: ?type=found&keyword=dompet&category=3)
    const { type, keyword, category } = req.query; 
    
    // Query dasar: Ambil semua data yang statusnya bukan 'rejected'
    let sql = `SELECT * FROM reports WHERE status != 'rejected'`;
    let params = [];

    // --- FILTER 1: Type (Lost / Found) ---
    // Ini wajib agar data tidak tercampur
    if (type) {
        sql += ` AND type = ?`;
        params.push(type);
    }

    // --- FILTER 2: Category (Dropdown) ---
    if (category) {
        sql += ` AND category_id = ?`;
        params.push(category);
    }

    // --- FILTER 3: Keyword (Search Bar) ---
    // Mencari kecocokan di nama barang ATAU deskripsi
    if (keyword) {
        sql += ` AND (item_name LIKE ? OR description LIKE ?)`;
        params.push(`%${keyword}%`, `%${keyword}%`);
    }

    // Urutkan dari yang terbaru
    sql += ` ORDER BY created_at DESC`;

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: err.message });
        }

        // PENTING: Kita kirim results mentah (raw) dari database.
        // Frontend (ListBarangTemuanPage) akan menerima field:
        // item_name, description, location, date_event, category_id, image_path
        res.json(results);
    });
};

// 2. CREATE NEW REPORT (Submit Laporan Baru)
exports.createReport = (req, res) => {
    console.log("New Report Data:", req.body);
    console.log("New Report File:", req.file);

    const {
        type, // Wajib: 'lost' atau 'found'
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
        return res.status(400).json({ message: "Data wajib tidak lengkap! (Type, Nama Barang, Nama Pelapor)" });
    }

    // Path gambar (jika ada upload, simpan path-nya)
    const image_path = req.file ? `/images/uploads/${req.file.filename}` : null;
    
    // Generate token akses untuk edit/hapus nanti
    const access_token = generateToken();
    
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