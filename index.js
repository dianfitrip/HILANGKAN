const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;

// --- 1. KONFIGURASI DATABASE MYSQL ---
// --- 1. KONFIGURASI DATABASE MYSQL ---
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, // Ini akan ambil dari file .env
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Gagal koneksi ke database:', err);
    } else {
        console.log('Berhasil terhubung ke Database MySQL...');
    }
});

// --- 2. MIDDLEWARE ---
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // Supaya bisa baca JSON dari fetch()

// Konfigurasi Upload Foto (Multer)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/uploads/'); // Pastikan folder ini ada!
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });


// --- 3. DATA DUMMY (Untuk Dropdown) ---
const categories = [
    { id: 1, name: 'Elektronik (HP, Laptop, Kamera)' },
    { id: 2, name: 'Dokumen (KTP, KTM, SIM, STNK)' },
    { id: 3, name: 'Dompet/Tas' },
    { id: 4, name: 'Kunci/Aksesoris' },
    { id: 5, name: 'Pakaian/Sepatu' },
    { id: 6, name: 'Lainnya' }
];

// --- 4. ROUTES HALAMAN ---
app.get('/', (req, res) => { res.render('home', { activePage: 'home' }); });
app.get('/prosedur', (req, res) => { res.render('prosedur', { activePage: 'prosedur' }); });

app.get('/form-penemuan', (req, res) => {
    res.render('form-penemuan', { categories: categories });
});


// --- 5. API: KIRIM OTP (Generate & Simpan ke DB) ---
app.post('/api/send-otp', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: 'Email tidak boleh kosong.' });
    }

    // 1. Generate Kode Random 6 Angka
    const otpCode = Math.floor(100000 + Math.random() * 900000);

    // 2. Simpan ke Database (Expires 5 menit dari sekarang)
    // Fungsi SQL NOW() + INTERVAL 5 MINUTE akan otomatis set waktu kadaluarsa
    const query = `INSERT INTO verification_codes (email, otp_code, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 5 MINUTE))`;

    db.query(query, [email, otpCode], (err, result) => {
        if (err) {
            console.error(err);
            return res.json({ success: false, message: 'Database Error' });
        }
        
        // PENTING: Karena belum ada sistem email asli, kita kirim kodenya lewat response JSON
        // Nanti di Frontend bisa kita tampilkan di alert() atau console.log untuk testing
        console.log(`OTP untuk ${email}: ${otpCode}`); // Cek terminal VS Code Anda untuk lihat kodenya
        res.json({ success: true, message: 'Kode OTP terkirim!', debug_otp: otpCode });
    });
});


// --- 6. API: SUBMIT FORM PENEMUAN (Validasi OTP & Simpan Laporan) ---
app.post('/submit-penemuan', upload.single('item_image'), (req, res) => {
    const data = req.body;
    const file = req.file;

    // 1. Cek Validasi OTP di Database
    const checkOtpQuery = `SELECT * FROM verification_codes WHERE email = ? AND otp_code = ? AND expires_at > NOW()`;

    db.query(checkOtpQuery, [data.reporter_email, data.otp_code], (err, results) => {
        if (err) {
            return res.send("Terjadi kesalahan database saat verifikasi OTP.");
        }

        // Jika OTP tidak ditemukan atau sudah kadaluarsa
        if (results.length === 0) {
            return res.send("<script>alert('Kode OTP salah atau sudah kadaluarsa!'); window.history.back();</script>");
        }

        // 2. Jika OTP Benar, Simpan Laporan ke Tabel 'reports'
        const imagePath = file ? '/images/uploads/' + file.filename : null;
        
        // Buat access_token acak untuk user edit/hapus nanti
        const accessToken = Math.random().toString(36).substring(7);

        const insertReportQuery = `
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

        db.query(insertReportQuery, values, (err, result) => {
            if (err) {
                console.error(err);
                return res.send("Gagal menyimpan laporan.");
            }
            res.send("<script>alert('Laporan Berhasil Disimpan! Terima kasih.'); window.location.href='/';</script>");
        });
    });
});



//------------------------------------------------------
// --- [TAMBAHAN] API: CEK OTP LANGSUNG (Untuk tombol Verifikasi) ---
app.post('/api/verify-otp', (req, res) => {
    const { email, otp_code } = req.body;

    // Cek apakah data lengkap
    if (!email || !otp_code) {
        return res.json({ success: false, message: 'Email dan Kode OTP wajib diisi.' });
    }

    // Query Cek Database
    const query = `SELECT * FROM verification_codes WHERE email = ? AND otp_code = ? AND expires_at > NOW()`;

    db.query(query, [email, otp_code], (err, results) => {
        if (err) {
            console.error(err);
            return res.json({ success: false, message: 'Database Error' });
        }

        if (results.length > 0) {
            // Kode Ditemukan dan Valid
            res.json({ success: true, message: 'Kode Valid!' });
        } else {
            // Kode Tidak Ada atau Kadaluarsa
            res.json({ success: false, message: 'Kode Salah atau sudah Kadaluarsa.' });
        }
    });
});


//------------------------------------------------------------------------------------------------------------------
// --- Route: Halaman List Barang Temuan ---
app.get('/list-barang-temuan', (req, res) => {
    const searchQuery = req.query.search || '';
    const categoryFilter = req.query.category || '';

    // Query: Join tabel reports dengan categories untuk dapat nama kategori
    let sql = `
        SELECT reports.*, categories.name AS category_name 
        FROM reports 
        LEFT JOIN categories ON reports.category_id = categories.id 
        WHERE reports.type = 'found' AND reports.status != 'rejected'
    `;

    const queryParams = [];

    // Filter Pencarian (Nama Barang)
    if (searchQuery) {
        sql += ` AND reports.item_name LIKE ?`;
        queryParams.push(`%${searchQuery}%`);
    }

    // Filter Kategori
    if (categoryFilter) {
        sql += ` AND reports.category_id = ?`;
        queryParams.push(categoryFilter);
    }

    // Urutkan terbaru
    sql += ` ORDER BY reports.date_event DESC, reports.created_at DESC`;

    db.query(sql, queryParams, (err, results) => {
        if (err) {
            console.error(err);
            return res.send('Database Error');
        }

        res.render('list-barang-temuan', { 
            activePage: 'list-barang-temuan', // Untuk highlight menu header
            reports: results, 
            categories: categories, // Mengambil data kategori global dari index.js
            searchQuery: searchQuery,
            categoryFilter: categoryFilter
        });
    });
});




// Jalankan Server
app.listen(port, () => {
    console.log(`Web berjalan di http://localhost:${port}`);
});