const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const itemRoutes = require('./routes/itemRoutes');
const foundItemRoutes = require('./routes/foundItemRoutes');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Serve Static Images (Uploads)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
app.use('/api/items', itemRoutes);
app.use('/api/found-items', foundItemRoutes);

// Test endpoint
app.get('/', (req, res) => {
  res.send('Backend Lost & Found UMY berjalan');
});

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
