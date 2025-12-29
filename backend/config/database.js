const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'db_lostfound'
});

db.connect((err) => {
    if (err) console.error('Database Error:', err);
    else console.log('MySQL Connected...');
});

module.exports = db;