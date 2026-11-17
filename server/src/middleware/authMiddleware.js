import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token = req.cookies?.accessToken;

  // Fallback to Bearer token in header
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. Please sign in.' });
  }

  try {
    const accessSecret = process.env.JWT_ACCESS_SECRET || 'veloura_access_secret_key_luxury_lingerie_2024_secure';
    const decoded = jwt.verify(token, accessSecret);

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User account not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    // If access token is expired, try to refresh using refreshToken
    if (error.name === 'TokenExpiredError' && req.cookies?.refreshToken) {
      try {
        const refreshSecret = process.env.JWT_REFRESH_SECRET || 'veloura_refresh_secret_key_luxury_lingerie_2024_secure';
        const refreshDecoded = jwt.verify(req.cookies.refreshToken, refreshSecret);

        const user = await User.findById(refreshDecoded.userId).select('-password');
        if (!user) {
          return res.status(401).json({ success: false, message: 'User account not found.' });
        }

        // Issue new access token
        const accessSecret = process.env.JWT_ACCESS_SECRET || 'veloura_access_secret_key_luxury_lingerie_2024_secure';
        const newAccessToken = jwt.sign(
          { userId: user._id, role: user.role },
          accessSecret,
          { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
        );

        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie('accessToken', newAccessToken, {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? 'strict' : 'lax',
          maxAge: 15 * 60 * 1000,
        });

        req.user = user;
        return next();
      } catch (refreshErr) {
        return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
      }
    }

    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

export const optionalAuth = async (req, res, next) => {
  let token = req.cookies?.accessToken;
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const accessSecret = process.env.JWT_ACCESS_SECRET || 'veloura_access_secret_key_luxury_lingerie_2024_secure';
    const decoded = jwt.verify(token, accessSecret);
    const user = await User.findById(decoded.userId).select('-password');
    req.user = user || null;
  } catch (err) {
    req.user = null;
  }
  next();
};
