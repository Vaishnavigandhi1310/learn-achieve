const regex = require('../enums/regexPatterns');

module.exports = (req, res, next) => {
  const { name, email, password, mobile } = req.body;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const mobileRegex = /^[6-9]\d{9}$/;
  const nameRegex = /^[a-zA-Z\s]+$/;

  if (!name || !email || !password || !mobile)
    return res.status(400).json({ message: 'All fields are required' });

  if (!nameRegex.test(name))
    return res.status(400).json({ message: 'Invalid name' });

  if (!emailRegex.test(email))
    return res.status(400).json({ message: 'Invalid email format' });

  if (password.length < 6)
    return res.status(400).json({ message: 'Password must be at least 6 characters' });

  if (!mobileRegex.test(mobile))
    return res.status(400).json({ message: 'Invalid mobile number' });

  next();
};
