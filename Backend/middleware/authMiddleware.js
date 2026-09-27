const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach decoded payload
      req.user = decoded;

      // Ensure both id and _id properties exist so route queries never break
      const userId = decoded.id || decoded._id || decoded.userId;
      req.user.id = userId;
      req.user._id = userId;

      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized, no token provided' });
  }
};

module.exports = { protect };