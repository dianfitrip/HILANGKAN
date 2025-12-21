const db = require('../config/database');

const generateToken = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

exports.getAllReports = (req, res) => {
    const { type, keyword, category } = req.query; 
    
    let sql = `SELECT * FROM reports WHERE status != 'rejected'`;
    let params = [];

    if (type) {
        sql += ` AND type = ?`;
        params.push(type);
    }

    if (category) {
        sql += ` AND category_id = ?`;
        params.push(category);
    }

    if (keyword) {
        sql += ` AND (item_name LIKE ? OR description LIKE ?)`;
        params.push(`%${keyword}%`, `%${keyword}%`);
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

    if (!type || !item_name || !reporter_name) {
        return res.status(400).json({ message: "Data wajib tidak lengkap! (Type, Nama Barang, Nama Pelapor)" });
    }
    const image_path = req.file ? `/images/uploads/${req.file.filename}` : null;
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