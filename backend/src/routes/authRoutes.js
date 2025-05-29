const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async(req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if email and password entered
    if (!email || !password) { return res.status(400).json({ 'message': 'Email and password required' }); };
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) { return res.status(400).json({ 'message': 'User already exists'}); };

    const hashedPassword = await bcrypt.hash(password, 10);
  
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    })
  
    await newUser.save();
    res.status(200).json({ 'message' : 'User successfully registered' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 'message': 'Registration failed' });
  }
});

router.post('/login', async(req, res) => {
  try {
    const { email, password } = req.body;
  
    // Check if user's email exists
    const user = await User.findOne({ email });
    if (!user) { return res.status(400).json({ 'message': 'User cannot be found' }); }
  
    // Check if user's password matches
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) { return res.status(400).json({ 'message': 'Password does not match' }); }

    // JWT Security
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, userId: user._id, role: user.role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 'message': 'Login failed' });
  }
})

// Temporary route to create a trainer
// router.post('/create-trainer', async(req, res) => {
//   try {
//     const hashedPassword = await bcrypt.hash('trainer123', 10);
    
//     const trainer = new User({
//       name: 'Justin Le',
//       email: 'justinlept@gmail.com',
//       password: hashedPassword,
//       role: 'trainer'
//     });
    
//     await trainer.save();
//     res.status(200).json({ message: 'Trainer created successfully' });
//   } catch (error) {
//     console.error('Error creating trainer:', error);
//     res.status(500).json({ message: 'Failed to create trainer' });
//   }
// });

module.exports = router;