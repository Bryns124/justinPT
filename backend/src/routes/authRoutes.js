const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async(req, res) => {
  // Register logic
});

router.post('/login', async(req, res) => {
  // Login logic
})

module.exports = router;