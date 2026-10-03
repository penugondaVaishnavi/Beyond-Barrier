const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'beyond_barriers_super_secret_jwt_key_2026';
      const decoded = jwt.verify(token, secret);

      // Find user in MongoDB by decoded user ID or studentId/teacherId
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        // Fallback search by studentId or teacherId
        const altUser = await User.findOne({
          $or: [
            { studentId: decoded.id },
            { teacherId: decoded.id },
            { rollNumber: decoded.id }
          ]
        }).select('-password');

        if (!altUser) {
          return res.status(401).json({ message: 'Not authorized, user not found' });
        }
        req.user = altUser;
      } else {
        req.user = user;
      }

      return next();
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
