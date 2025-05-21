const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const authMiddleWare = require('../middleware/authMiddleware');

router.post('/create', async(req, res) => {
  try {
    const { trainer, timeslot } = req.body;
    const client = req.userId;

    const newBooking = new Booking({
      client,
      trainer,
      timeslot
    })

    await newBooking.save();
    res.status(200).json({ 'message' : 'Booking created successfully' });
  } catch (error) {
    console.error('Booking error: ', error);
    res.status(500).json({ 'message' : 'Booking creation failed' });
  }
});

router.get('/availability', async(req, res) => {
  try {
    const date = req.query;
    const trainer = req.userId;

    const bookings = await Booking.find({
      trainer,
      timeslot: {
        $gte: new Date(date).setHours(0,0,0,0),
        $lte: new Date(date).setHours(23, 59, 59, 999)
      }
    })

    const bookedSlots = bookings.map(booking => bookings.timeslot);
    res.status(200).json({ bookedSlots });
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({ message: 'Failed to fetch available slots' });
  }
})

module.exports = router;