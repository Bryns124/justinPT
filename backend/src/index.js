require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 5000;
const uri = "mongodb+srv://Cluster92906:SnF4b3ZWanVS@trainerapp.s0tb2mi.mongodb.net/?retryWrites=true&w=majority&appName=trainerApp";
const authRoutes = require('./routes/authRoutes');
// const authMiddleware = require('./middleware/authMiddleware');
const bookingRoutes = require('./routes/bookingRoutes');
const trainingProgramRoutes = require('./routes/TrainingProgramRoutes');

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/program', trainingProgramRoutes);

mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// app.get('/api/protected', authMiddleware, (req, res) => {
//   res.json({ message: 'Protected route accessed successfully', userId: req.userId });
// })

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});