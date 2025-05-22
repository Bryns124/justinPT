const mongoose = require('mongoose');
const { Schema } = mongoose;

const programSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  content: { type: String, required: true },
})

module.exports = mongoose.model('TrainingProgram', programSchema);