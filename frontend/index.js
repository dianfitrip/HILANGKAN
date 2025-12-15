const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const cors = require('cors'); // Tambahan: Agar bisa diakses frontend beda port/file
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Izinkan semua request dari frontend
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
// Serve folder uploads agar gambar bisa diakses publik
app.use('/uploads', express.static(path.join(__dirname, 'public/images/uploads')));

// Konfigurasi Database
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hilangkan'
});

db.connect((err) => {
    if (err) console.error('Gagal koneksi database:', err);
    else console.log('Terhubung ke Database MySQL...');
});

// Konfigurasi Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Pastikan folder ini ada: server/public/images/uploads/
        cb(null, 'public/images/uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// API 1: Ambil Daftar Kategori
app.get('/api/categories', (req, res) => {
    const categories = [
        { id: 1, name: 'Elektronik (HP, Laptop, Kamera)' },
        { id: 2, name: 'Dokumen (KTP, KTM, SIM, STNK)' },
        { id: 3, name: 'Dompet/Tas' },
        { id: 4, name: 'Kunci/Aksesoris' },
        { id: 5, name: 'Pakaian/Sepatu' },
        { id: 6, name: 'Lainnya' }
    ];
    res.json(categories);
});

// API 2: Ambil List Barang Temuan
app.get('/api/reports/found', (req, res) => {
    const searchQuery = req.query.search || '';
    const categoryFilter = req.query.category || '';

    let sql = `
        SELECT reports.*, categories.name AS category_name 
        FROM reports 
        LEFT JOIN categories ON reports.category_id = categories.id 
        WHERE reports.type = 'found' AND reports.status != 'rejected'
    `;
    
    const queryParams = [];

    if (searchQuery) {
        sql += ` AND reports.item_name LIKE ?`;
        queryParams.push(`%${searchQuery}%`);
    }
    if (categoryFilter) {
        sql += ` AND reports.category_id = ?`;
        queryParams.push(categoryFilter);
    }

    sql += ` ORDER BY reports.date_event DESC, reports.created_at DESC`;

    db.query(sql, queryParams, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database Error' });
        
        // Ubah path gambar agar lengkap dengan URL server
        const mappedResults = results.map(item => ({
            ...item,
            image_url: item.image_path ? `http://localhost:${port}${item.image_path}` : null
        }));
        
        res.json(mappedResults);
    });
});

// API 3: Kirim OTP
app.post('/api/send-otp', (req, res) => {
    const { email } = req.body;
    if (!email) return res.json({ success: false, message: 'Email kosong' });

    const otpCode = Math.floor(100000 + Math.random() * 900000);
    const query = `INSERT INTO verification_codes (email, otp_code, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 5 MINUTE))`;

    db.query(query, [email, otpCode], (err) => {
        if (err) return res.json({ success: false, message: 'DB Error' });
        console.log(`OTP untuk ${email}: ${otpCode}`);
        res.json({ success: true, message: 'OTP Terkirim', debug_otp: otpCode });
    });
});

// API 4: Verifikasi OTP
app.post('/api/verify-otp', (req, res) => {
    const { email, otp_code } = req.body;
    const query = `SELECT * FROM verification_codes WHERE email = ? AND otp_code = ? AND expires_at > NOW()`;

    db.query(query, [email, otp_code], (err, results) => {
        if (err) return res.json({ success: false, message: 'DB Error' });
        if (results.length > 0) res.json({ success: true });
        else res.json({ success: false, message: 'Kode Salah/Expired' });
    });
});

// API 5: Submit Laporan
app.post('/api/reports', upload.single('item_image'), (req, res) => {
    const data = req.body;
    const file = req.file;

    // (Logic verifikasi OTP di sini sebaiknya dilakukan lagi, atau diasumsikan frontend sudah validasi)
    // Untuk penyederhanaan, kita langsung simpan
    
    const imagePath = file ? '/uploads/' + file.filename : null;
    const accessToken = Math.random().toString(36).substring(7);

    const query = `
        INSERT INTO reports 
        (category_id, type, status, reporter_name, reporter_status, identification_number, reporter_contact, item_name, description, location, date_event, image_path, access_token)
        VALUES (?, 'found', 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        data.category_id,
        data.reporter_name,
        data.reporter_status,
        data.identification_number,
        data.reporter_email,
        data.item_name,
        data.description,
        data.location,
        data.date_event,
        imagePath,
        accessToken
    ];

    db.query(query, values, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Gagal simpan' });
        }
        res.json({ success: true, message: 'Laporan berhasil disimpan' });
    });
});

app.listen(port, () => {
    console.log(`Backend Server running on http://localhost:${port}`);
});