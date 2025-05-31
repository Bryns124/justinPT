const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const authMiddleWare = require('../middleware/authMiddleware');

// Create new booking for users
router.post('/create', authMiddleWare, async(req, res) => {
  // console.log('=== BOOKING DEBUG ===');
  // console.log('req.userId:', req.userId);
  // console.log('Authorization header:', req.headers.authorization);
  try {
    const { timeslot, duration, notes } = req.body;
    const client = req.userId;

    // Validate timeslot
    if (!timeslot) {
      return res.status(400).json({ message: 'Timeslot is required' });
    }

    const timeslotDate = new Date(timeslot);
    // console.log('Parsed timeslot date:', timeslotDate);
    // console.log('Is valid date:', !isNaN(timeslotDate.getTime()));

    if (isNaN(timeslotDate.getTime())) {
      return res.status(400).json({ message: 'Invalid timeslot date format' });
    }
    
    // console.log('req.body:', req.body);
    // console.log('Client ID from token:', client);

    const trainer = await User.findOne({ role: 'trainer' });
    if (!trainer) {
      return res.status(400).json({ message: 'No trainer available' });
    }

    // console.log('Trainer found:', trainer._id);

    // check if slot is already booked
    const existingBooking = await Booking.findOne({
      trainer: trainer._id,
      timeslot: new Date(timeslot),
      status: { $ne: 'cancelled' }
    });

    // console.log('Existing booking: ', existingBooking);
    
    if (existingBooking) return res.status(400).json({ message: 'Time slot already booked.' });

    const newBooking = new Booking({
      client,
      trainer: trainer._id,
      timeslot,
      duration,
      notes
    });

    // console.log('New booking: ', newBooking);
    await newBooking.save();
    await newBooking.populate(['client', 'trainer']);
    res.status(200).json({ message : 'Booking created successfully', booking: newBooking });
  } catch (error) {
    console.error('Booking error: ', error);
    res.status(500).json({ message : 'Booking creation failed' });
  }
});

// Get available timeslots
router.get('/availability/:date', async(req, res) => {
  try {
    const { date } = req.params;
    // console.log('=== AVAILABILITY DEBUG ===');
    // console.log('Requested date:', date);
    const selectedDate = new Date(date);

    const trainer = await User.findOne({ role: 'trainer' });
    if (!trainer) {
      return res.status(400).json({ message: 'No trainer available' });
    }

    // console.log('Trainer found:', trainer._id);

    const startOfDay = new Date(selectedDate.setHours(0,0,0,0));
    const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));
    
    // console.log('Date range:', startOfDay, 'to', endOfDay);

    const bookings = await Booking.find({
      trainer: trainer._id,
      timeslot: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      status: { $ne: 'cancelled' }
    })

    // console.log('Found bookings:', bookings.length);

    // generate slot times (moved to backend)
    const availableSlots = [];
    const workingHours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

    workingHours.forEach(hour => {
      const slotTime = new Date(selectedDate);
      slotTime.setHours(hour, 0, 0, 0);

      const isBooked = bookings.some(booking => booking.timeslot.getTime() === slotTime.getTime());

      if (!isBooked && slotTime > new Date()) {
        availableSlots.push(slotTime);
      }
    });

    // console.log('Available slots:', availableSlots.length);

    res.status(200).json({ availableSlots });
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({ message: 'Failed to fetch available slots' });
  }
})

// Get user's bookings with trainer/client info
router.get('/my-bookings', authMiddleWare, async(req, res) => {
  try {
    const bookings = await Booking.find({ client: req.userId }).populate('trainer', 'name email').sort({ timeslot: 1 });
    res.json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings: ', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

// Cancel booking
router.put('/:id/cancel', async(req, res) => {
  try {
    // console.log('Req params: ', req.params);
    // console.log('Req params id: ', req.params.id)
    const booking = await Booking.findOne({
      _id: req.params.id,
      // client: req.userId
    })

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // check if booking can be cancelled (can't be cancelled 24 hours before)
    const now = new Date();
    const bookingTime = new Date(booking.timeslot);
    const hoursDifference = (bookingTime - now) / (1000 * 60 * 60);

    if (hoursDifference < 24) return res.status(400).json({ message: 'Bookings can only be cancelled 24 hours in advance' });

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking: ', error);
    res.status(500).json({ message: 'Failed to cancel booking' });
  }
})

// Delete cancelled bookings from database
router.delete('/clear-cancelled', authMiddleWare, async(req, res) => {
  try {
    await Booking.deleteMany({
      client: req.userId,
      status: 'cancelled'
    });
    res.status(200).json({ message: 'Cancelled bookings cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete cancelled booking' });
  }
})

// Get trainer's full schedule (MAYBE)
// router.get('/trainer-schedule', async(req, res) => {})

module.exports = router;