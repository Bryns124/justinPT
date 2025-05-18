const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['client', 'trainer'], default: 'client', required: true },
  name: { type: String, required: true }
})

module.exports = mongoose.model('User', userSchema);