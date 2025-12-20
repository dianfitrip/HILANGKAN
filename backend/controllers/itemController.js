const db = require('../config/database');

// 1. AMBIL BARANG UNTUK HOMEPAGE (Hanya yang statusnya 'approved')
exports.getRecentFoundItems = (req, res) => {
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
    // A. Tangkap data dari Body & File
    const data = req.body;
    const file = req.file;

    // B. Validasi sederhana
    if (!data.item_name || !data.category_id) {
        return res.status(400).json({ success: false, message: "Nama barang dan kategori wajib diisi!" });
    }

    // C. Siapkan Path Gambar
    const imagePath = file ? '/uploads/' + file.filename : null;

    // D. Generate Token Akses (Untuk edit/hapus tanpa login)
    const accessToken = Math.random().toString(36).substring(2, 10).toUpperCase();

    // E. Query Insert ke Database
    const query = `
        INSERT INTO reports (
            category_id, type, status, 
            reporter_name, reporter_status, identification_number, reporter_phone, 
            item_name, description, location, date_event, 
            image_path, access_token
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        data.category_id, 
        'found',          // Tipe laporan
        'pending',        // Status awal (menunggu admin)
        data.reporter_name,
        data.reporter_status,
        data.identification_number, 
        data.reporter_phone,
        data.item_name,
        data.description,
        data.location,
        data.date_event,
        imagePath,
        accessToken
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ success: false, message: 'Gagal menyimpan ke database' });
        }
        
        res.json({ 
            success: true, 
            message: 'Laporan berhasil dikirim! Menunggu verifikasi admin.',
            token: accessToken 
        });
    });
};