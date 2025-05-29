const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingSchema = new Schema({
  client: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  trainer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  timeslot: { type: Date, required: true },
  duration: { type: Number, default: 60, enum: [ 30, 45, 60, 90] },
  notes: { type: String, maxlength: 500 },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Booking', bookingSchema);