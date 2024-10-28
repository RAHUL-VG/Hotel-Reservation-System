// Simulating available rooms and reservations
const availableRooms = [
    { roomNumber: 101, roomType: 'Deluxe', price: 150, isAvailable: true },
    { roomNumber: 102, roomType: 'Suite', price: 250, isAvailable: true },
    { roomNumber: 103, roomType: 'Standard', price: 100, isAvailable: true }
];

const reservations = [];

// Function to display available rooms
function displayAvailableRooms() {
    const roomList = document.getElementById('room-list');
    roomList.innerHTML = ''; // Clear previous entries

    availableRooms.forEach(room => {
        if (room.isAvailable) {
            roomList.innerHTML += `
                <div>
                    <strong>Room ${room.roomNumber} (${room.roomType})</strong> - $${room.price}/night
                </div>
            `;
        }
    });
}

// Function to handle new reservation
document.getElementById('reservation-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const roomType = document.getElementById('room-type').value;
    const checkIn = document.getElementById('check-in').value;
    const checkOut = document.getElementById('check-out').value;

    // Find the first available room of the selected type
    const room = availableRooms.find(r => r.roomType === roomType && r.isAvailable);

    if (room) {
        reservations.push({
            firstName, lastName, email, phone, roomNumber: room.roomNumber, checkIn, checkOut
        });

        room.isAvailable = false; // Mark room as booked
        alert('Room successfully booked!');

        displayAvailableRooms();
        displayReservations();
    } else {
        alert('Sorry, no rooms of that type are available.');
    }

    this.reset(); // Clear the form
});

// Function to display current reservations
function displayReservations() {
    const reservationList = document.getElementById('reservation-list');
    reservationList.innerHTML = ''; // Clear previous entries

    reservations.forEach((reservation, index) => {
        reservationList.innerHTML += `
            <div>
                <strong>Reservation ${index + 1}</strong>:
                ${reservation.firstName} ${reservation.lastName} - Room ${reservation.roomNumber} (Check-in: ${reservation.checkIn}, Check-out: ${reservation.checkOut})
            </div>
        `;
    });
}

// Initialize the page with available rooms
displayAvailableRooms();
