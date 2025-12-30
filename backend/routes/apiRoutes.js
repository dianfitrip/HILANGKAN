const express = require('express');
const router = express.Router();

// Import Middleware Upload
const upload = require('../middleware/upload'); 

// Import Controllers
const reportController = require('../controllers/reportController');
const adminController = require('../controllers/adminController');

// DEBUGGING  
console.log("Cek Fungsi Controller:");
console.log("- createReport:", reportController.createReport ? "ADA" : "TIDAK ADA");
console.log("- getAllReports:", reportController.getAllReports ? "ADA" : "TIDAK ADA");
console.log("- getDashboardStats:", adminController.getDashboardStats ? "ADA" : "TIDAK ADA");

// PUBLIC ROUTES

// 1. Buat Laporan Baru 
router.post('/reports', upload.single('item_image'), reportController.createReport);

// 2. Ambil Semua Laporan 
router.get('/reports', reportController.getAllReports);


// ADMIN ROUTES

// 3. Statistik Dashboard
router.get('/admin/stats', adminController.getDashboardStats);

// 4. Manajemen Laporan
router.get('/admin/reports', adminController.getReportsByStatus);

// 5. Update Status Laporan 
router.put('/admin/reports/:id/status', adminController.updateReportStatus);

// 6. Hapus Laporan
router.delete('/admin/reports/:id', adminController.deleteReport);

// 7. untuk update foto
router.put('/admin/reports/:id', upload.single('item_image'), adminController.updateReportDetails);

module.exports = router;