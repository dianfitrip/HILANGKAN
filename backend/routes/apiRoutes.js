const express = require('express');
const router = express.Router();

// 1. Pastikan path ini mengarah ke file reportController.js yang benar
const reportController = require('../controllers/reportController'); 

// 2. Pastikan middleware upload sudah ada
const upload = require('../middleware/upload');

// CEK DEBUGGING (Agar ketahuan jika controller tidak terbaca)
if (!reportController.getAllReports || !reportController.createReport) {
    console.error("❌ ERROR: Fungsi Controller tidak ditemukan! Cek file reportController.js");
}

// === ROUTES ===

// GET /api/reports (List Barang)
// Memanggil fungsi: exports.getAllReports
router.get('/reports', reportController.getAllReports);

// POST /api/reports (Submit Laporan)
// Memanggil fungsi: exports.createReport
// upload.single('item_image') <-- 'item_image' harus sama dengan FormData di Frontend
router.post('/reports', upload.single('item_image'), reportController.createReport);

module.exports = router;