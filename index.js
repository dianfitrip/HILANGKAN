const express = require('express');
const app = express();
const port = 3000;

// Set view engine ke EJS (supaya bisa render HTML dinamis)
app.set('view engine', 'ejs');

// Folder public untuk file statis (gambar/css)
app.use(express.static('public'));

// --- ROUTES (Jalur URL) ---

// 1. Halaman Home
app.get('/', (req, res) => {
  res.render('home'); // Akan membuka file views/home.ejs
});

// 2. Halaman Form Kehilangan (Button Merah)
app.get('/form-kehilangan', (req, res) => {
  res.send('Nanti ini halaman Form Kehilangan Barang');
});

// 3. Halaman Form Penemuan (Button Hijau)
app.get('/form-penemuan', (req, res) => {
  res.send('Nanti ini halaman Form Penemuan Barang');
});

// 4. Halaman Riwayat
app.get('/riwayat', (req, res) => {
  res.send('Nanti ini halaman Riwayat Laporan');
});

// 5. Halaman Prosedur
app.get('/prosedur', (req, res) => {
    res.render('prosedur'); // Akan membuka file views/prosedur.ejs
});

// Jalankan Server
app.listen(port, () => {
  console.log(`Web berjalan di http://localhost:${port}`);
});