// server/db.js
const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // replace with your MySQL username
    password: '', // replace with your MySQL password
    database: 'hotelreservation'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database.');
});

module.exports = db;
