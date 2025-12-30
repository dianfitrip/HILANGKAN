const db = require('../config/database');

// 1. GET: Statistik Ringkas
exports.getDashboardStats = (req, res) => {
    const sql = `
        SELECT 
            COUNT(*) as total_reports,
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as total_pending,
            SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as total_active,
            SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as total_resolved,
            SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as total_rejected,
            SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as reports_today,
            SUM(CASE WHEN type = 'found' THEN 1 ELSE 0 END) as type_found,
            SUM(CASE WHEN type = 'lost' THEN 1 ELSE 0 END) as type_lost
        FROM reports
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results[0]);
    });
};

// 2. GET: Ambil Laporan Berdasarkan Status (Pending, Approved, Archived)
exports.getReportsByStatus = (req, res) => {
    const { status } = req.query; 
    
    let query = "";
    let params = [];

    if (status === 'archived') {
        // Arsip mengambil status 'resolved' dan 'rejected'
        query = "SELECT * FROM reports WHERE status IN ('resolved', 'rejected') ORDER BY created_at DESC";
    } else {
        // Untuk 'pending' atau 'approved'
        query = "SELECT * FROM reports WHERE status = ? ORDER BY created_at DESC";
        params = [status];
    }
    
    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// 3. PUT: Update Status
exports.updateReportStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body; 
    const query = "UPDATE reports SET status = ? WHERE id = ?";
    db.query(query, [status, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Status berhasil diubah' });
    });
};

// 4. DELETE: Hapus Laporan
exports.deleteReport = (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM reports WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Laporan dihapus' });
    });
};

// 5. UPDATE DETAIL LAPORAN (Edit Data Barang + Pelapor)
exports.updateReportDetails = (req, res) => {
    const { id } = req.params;
    
    const { 
        item_name, category_id, date_event, location, description, type,
        reporter_name, reporter_status, reporter_phone, identification_number 
    } = req.body;

    let sql = `
        UPDATE reports 
        SET item_name=?, category_id=?, date_event=?, location=?, description=?, type=?,
            reporter_name=?, reporter_status=?, reporter_phone=?, identification_number=?
    `;
    
    let params = [
        item_name, category_id, date_event, location, description, type,
        reporter_name, reporter_status, reporter_phone, identification_number
    ];

    if (req.file) {
        sql += `, image_path=?`;
        params.push(req.file.filename);
    }

    sql += ` WHERE id=?`;
    params.push(id);

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error("Update Error:", err);
            return res.status(500).json({ message: 'Gagal mengupdate database', error: err });
        }
        res.json({ success: true, message: 'Data berhasil diperbarui' });
    });
};