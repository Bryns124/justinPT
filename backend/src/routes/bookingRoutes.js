const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const authMiddleWare = require('../middleware/authMiddleware');

router.post('/create', authMiddleWare, async(req, res) => {
  console.log('=== BOOKING DEBUG ===');
  console.log('req.userId:', req.userId);
  console.log('req.body:', req.body);
  console.log('Authorization header:', req.headers.authorization);
  try {
    const { timeslot, notes } = req.body;
    const client = req.userId;

    console.log('Client ID from token:', client);

    const trainer = await User.findOne({ role: 'trainer' });
    if (!trainer) {
      return res.status(400).json({ message: 'No trainer available' });
    }

    console.log('Trainer found:', trainer._id);

    const newBooking = new Booking({
      client,
      trainer: trainer._id,
      timeslot,
      notes
    });

    await newBooking.save();
    res.status(200).json({ 'message' : 'Booking created successfully' });
  } catch (error) {
    console.error('Booking error: ', error);
    res.status(500).json({ 'message' : 'Booking creation failed' });
  }
});

router.get('/availability', async(req, res) => {
  try {
    const { date } = req.query;
    const trainer = req.userId;

    const bookings = await Booking.find({
      trainer,
      timeslot: {
        $gte: new Date(date).setHours(0,0,0,0),
        $lte: new Date(date).setHours(23, 59, 59, 999)
      }
    })

    const bookedSlots = bookings.map(booking => booking.timeslot);
    res.status(200).json({ bookedSlots });
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({ message: 'Failed to fetch available slots' });
  }
})

module.exports = router;