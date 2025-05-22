const express = require('express');
const router = express.Router();
const TrainingProgram = require('../models/TrainingProgram');
const authMiddleWare = require('../middleware/authMiddleware');

router.post('/create', async(req, res) => {
  try {
    const { title, description, price, content } = req.body;

    const newProgram = new TrainingProgram({
      title,
      description,
      price,
      content
    })

    await newProgram.save();
    res.status(200).json({ 'message' : 'Program created successfully' });
  } catch (error) {
    console.error('Program creation error: ', error);
    res.status(500).json({ 'message' : 'Program creation failed' });
  }
});

router.get('/programs', async(req, res) => {
  try {
    const programs = await TrainingProgram.find().populate('trainer', 'name');
    res.status(200).json({ programs })
  } catch (error) {
    console.error('Error listing programs:', error);
    res.status(500).json({ message: 'Failed to list programs' });
  }
})

module.exports = router;