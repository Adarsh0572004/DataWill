import jwt from 'jsonwebtoken';
import { fromNodeHeaders } from 'better-auth/node';
import { auth as betterAuth } from '../auth.js';
import User from '../models/User.js';

const auth = async (req, res, next) => {
  try {
    // Strategy 1: Try Better Auth session (cookie-based)
    try {
      const session = await betterAuth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });
      if (session?.user) {
        // Better Auth stores its own user, but our routes expect a Mongoose user
        // Try to find the matching Mongoose user by email
        let user = await User.findOne({ email: session.user.email });
        if (!user) {
          // Auto-create a Mongoose user record if one doesn't exist
          user = await User.create({
            name: session.user.name,
            email: session.user.email,
            passwordHash: 'better-auth-managed', // Password managed by Better Auth
          });
        }
        req.user = user;
        return next();
      }
    } catch (e) {
      // Better Auth session not found, fall through to JWT
    }

    // Strategy 2: Legacy JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found. Token may be invalid.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please log in again.' });
    }
    next(error);
  }
};

export default auth;
