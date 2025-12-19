const db = require('../config/database');

/* =========================================
   GET RECENT LOST ITEMS
   (Opsional: kalau mau ditampilkan di homepage)
========================================= */
exports.getRecentLostItems = (req, res) => {
    const sql = `
        SELECT reports.*, categories.name AS category_name
        FROM reports
        LEFT JOIN categories ON reports.category_id = categories.id
        WHERE reports.type = 'lost'
        AND reports.status = 'approved'
        ORDER BY reports.date_event DESC
        LIMIT 6
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("DB ERROR:", err);
            return res.status(500).json({ message: "Database error" });
        }

        res.json(results);
    });
};

/* =========================================
   GET ALL LOST ITEMS
========================================= */
exports.getAllLostItems = (req, res) => {
    const search = req.query.search || '';

    const sql = `
        SELECT reports.*, categories.name AS category_name
        FROM reports
        LEFT JOIN categories ON reports.category_id = categories.id
        WHERE reports.type = 'lost'
        AND reports.status = 'approved'
        AND reports.item_name LIKE ?
        ORDER BY reports.date_event DESC
    `;

    db.query(sql, [`%${search}%`], (err, results) => {
        if (err) {
            console.error("DB ERROR:", err);
            return res.status(500).json({ message: "Database error" });
        }

        res.json(results);
    });
};

/* =========================================
   CREATE LOST ITEM REPORT
========================================= */
exports.createLostItemReport = (req, res) => {
    const data = req.body;
    const file = req.file;

    /* ===== VALIDASI ===== */
    if (!data.item_name || !data.category_id) {
        return res.status(400).json({
            success: false,
            message: "Nama barang dan kategori wajib diisi"
        });
    }

    /* ===== PATH GAMBAR ===== */
    const imagePath = file ? `/uploads/${file.filename}` : null;

    /* ===== ACCESS TOKEN ===== */
    const accessToken = Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase();

    /* ===== QUERY INSERT ===== */
    const query = `
        INSERT INTO reports (
            category_id, type, status,
            reporter_name, reporter_status, identification_number,
            reporter_phone,
            item_name, description, location, date_event,
            image_path, access_token
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        data.category_id,
        'lost',               // ⬅️ INI KHUSUS LOST
        'pending',
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

    db.query(query, values, (err) => {
        if (err) {
            console.error("DB ERROR:", err);
            return res.status(500).json({
                success: false,
                message: "Gagal menyimpan laporan kehilangan"
            });
        }

        res.status(201).json({
            success: true,
            message: "Laporan kehilangan berhasil dikirim. Menunggu verifikasi admin.",
            token: accessToken
        });
    });
};
