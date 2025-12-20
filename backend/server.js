const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/apiRoutes');
require('dotenv').config();

const app = express();
const PORT = 5000; // Gunakan 5000 agar tidak bentrok dengan React (3000)

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Folder untuk Gambar
// Ini membuat URL http://localhost:5000/images/uploads/namafile.jpg bisa diakses
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Routes
app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});