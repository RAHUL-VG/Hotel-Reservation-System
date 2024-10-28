// server/app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Route to get available rooms
app.get('/rooms', (req, res) => {
    const query = 'SELECT * FROM Rooms WHERE is_available = TRUE';
    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Route to make a reservation
app.post('/reserve', (req, res) => {
    const { firstName, lastName, email, phone, roomType, checkIn, checkOut } = req.body;

    // Find available room of the selected type
    const queryRoom = 'SELECT * FROM Rooms WHERE room_type = ? AND is_available = TRUE LIMIT 1';
    db.query(queryRoom, [roomType], (err, rooms) => {
        if (err) throw err;

        if (rooms.length > 0) {
            const room = rooms[0];

            // Insert customer details
            const queryCustomer = 'INSERT INTO Customers (first_name, last_name, email, phone) VALUES (?, ?, ?, ?)';
            db.query(queryCustomer, [firstName, lastName, email, phone], (err, result) => {
                if (err) throw err;

                const customerId = result.insertId;

                // Insert reservation
                const queryReservation = `INSERT INTO Reservations (customer_id, room_id, check_in_date, check_out_date, total_amount)
                                          VALUES (?, ?, ?, ?, ?)`;
                const totalAmount = room.price_per_night * (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
                db.query(queryReservation, [customerId, room.room_id, checkIn, checkOut, totalAmount], (err, result) => {
                    if (err) throw err;

                    // Mark the room as unavailable
                    const queryUpdateRoom = 'UPDATE Rooms SET is_available = FALSE WHERE room_id = ?';
                    db.query(queryUpdateRoom, [room.room_id], (err, result) => {
                        if (err) throw err;
                        res.json({ message: 'Room successfully booked!' });
                    });
                });
            });
        } else {
            res.json({ message: 'No available rooms of the selected type.' });
        }
    });
});

// Route to get all reservations (you can modify this to get specific user reservations)
app.get('/reservations', (req, res) => {
    const query = `SELECT R.reservation_id, C.first_name, C.last_name, R.check_in_date, R.check_out_date, R.total_amount, Rooms.room_number
                   FROM Reservations R
                   JOIN Customers C ON R.customer_id = C.customer_id
                   JOIN Rooms ON R.room_id = Rooms.room_id`;
    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
