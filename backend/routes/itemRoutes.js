const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemcontroller'); // Pastikan path ini benar
const multer = require('multer');
const path = require('path'); // Biarkan jika nanti butuh path.extname

// Konfigurasi Multer (Simpan file di folder public/uploads)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Pastikan folder backend/public/uploads SUDAH DIBUAT secara manual atau otomatis
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        // Nama file unik: timestamp-namaasli.jpg
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Routes
router.get('/recent', itemController.getRecentFoundItems);
router.get('/all', itemController.getAllFoundItems);

// ROUTE POST (Upload Gambar)
// 'item_image' harus sama dengan name="item_image" di Frontend React/HTML
router.post('/submit', upload.single('item_image'), itemController.createItemReport);

module.exports = router;