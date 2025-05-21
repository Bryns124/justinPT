const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingSchema = new Schema({
  client: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  trainer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  timeslot: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' }
})

module.exports = mongoose.model('Booking', bookingSchema);