const jwt = require('jsonwebtoken');

const authMiddleWare = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer', '');

  if (!token) { return res.status(401).json({ 'message': 'No token. Authorisation denied' }); }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {return res.status(401).json({ 'message': 'Token is invalid' }); }
}

module.exports = authMiddleWare;