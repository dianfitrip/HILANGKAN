const express = require('express');
const cors = require('cors');
const path = require('path');
const itemRoutes = require('./routes/itemRoutes');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Serve Static Images (Uploads)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
app.use('/api/items', itemRoutes);

app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`);
});
