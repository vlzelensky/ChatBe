//@ts-nocheck
const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async function (req, res) {
  try {
    const { name, userName, birthDate, email, password } = req.body;
    const candidate = await User.findOne({ email });
    if (candidate) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = User({
      name,
      userName,
      birthDate,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({ message: 'success' });
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong, try again' });
  }
};

exports.login = async function (req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid username / password pair' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username / password pair' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({
      email: user.email,
      name: user.name,
      birthDate: user.birthDate,
      userName: user.userName,
      token,
      userId: user.id,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Something went wrong, please try again' });
  }
};

exports.getUser = async function (req, res) {
  const token = req.get('Authorization');
  if (!token) {
    return res.status(400).json({ message: 'token is not provided' });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    console.log(data);
    const user = await User.findOne({ _id: data.userId });
    res.json({
      name: user.name,
      userName: user.userName,
      userId: user._id,
      email: user.email,
      birthDate: user.birthDate,
    });
  } catch (e) {
    res.status(500).json({ message: 'Invalid token' });
  }
};
