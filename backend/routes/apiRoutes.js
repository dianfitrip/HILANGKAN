const express = require('express');
const router = express.Router();

const reportController = require('../controllers/reportController'); 

const upload = require('../middleware/upload');

if (!reportController.getAllReports || !reportController.createReport) {
    console.error("❌ ERROR: Fungsi Controller tidak ditemukan! Cek file reportController.js");
}

router.get('/reports', reportController.getAllReports);
router.post('/reports', upload.single('item_image'), reportController.createReport);

module.exports = router;