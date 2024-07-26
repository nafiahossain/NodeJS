const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3001; // Keep this on a different port from your React app

// PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'hotel_db',
    password: 'p@stgress',
    port: 5433,
});

app.use(cors());
app.use(express.json());

// Route to fetch specific hotel room details using hotelSlug and roomSlug
app.get('/api/hotel/:hotelSlug/room/:roomSlug', async (req, res) => {
  try {
    const { hotelSlug, roomSlug } = req.params;

    const query = `
      SELECT h.name AS hotel_name, h.description AS hotel_description, 
             h.hotel_slug, h.address, h.latitude, h.longitude,
             hr.room_slug, hr.room_title, hr.description AS room_description, 
             hr.bedroom_count, hr.bathroom_count, hr.guest_count, hr.images
      FROM hotel h
      JOIN hotel_rooms hr ON h.hotel_slug = hr.hotel_slug
      WHERE h.hotel_slug = $1 AND hr.room_slug = $2
    `;
    const { rows } = await pool.query(query, [hotelSlug, roomSlug]);

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Hotel room not found' });
    }
  } catch (error) {
    console.error('Error fetching room details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
