// controllers/authController.js
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JWT_SECRECT = "ewf98we789ew7v897vdcsc()EF*E(^FE"

const totalCount = async (req, res) => {
  try {
    const count = await User.countDocuments({});
    res.status(200).json({ data: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user count' });
  }
}

const register = async (req, res) => {
  try {
    const { email, username, password, userType } = req.body;

    const isFirstUser = (await User.countDocuments({})) === 0;

    const role = isFirstUser ? 'admin' : 'user';
    const activeMsg = isFirstUser ? 'Admin Registration successful' : 'User Registered successful, pending approval';

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'This email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      username,
      password: hashedPassword,
      role,
      isActive: isFirstUser ? 'approved' : 'pending', 
      userType,
    });

    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email, role: user.role },
      JWT_SECRECT,
      { expiresIn: '12h' }
    );
    await user.save();

    res.status(201).json({
      token,
      role: user.role,
      username: user.username,
      email: user.email,
      message: 'ok',
      activeMsg, 
      isActive: user.isActive,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const register = async (req, res) => {
//   try {
//     const { email, username, password } = req.body;
//     const isFirstUser = (await User.countDocuments({})) === 0;
//     const role = isFirstUser ? 'admin' : 'user';
//     const isActive = isFirstUser ? 'approved' : 'pending';
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'This email is already registered' });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({
//       email,
//       username,
//       password: hashedPassword,
//       role,
//       isActive
//     });
//     const token = jwt.sign(
//       { userId: user._id, username: user.username, email: user.email, role: user.role },
//       JWT_SECRECT,
//       { expiresIn: '12h' }
//     );
//     await user.save();
//     res.status(201).json({
//       token, role: user.role, username: user.username, email: user.email,
//       message: 'ok', activeMsg: 'User Registered successful, pending approval 🥲', isActive: user.isActive
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'User with this email is not registered' });
    }

    if (user.isActive === 'pending') {
      return res.status(401).json({ activeMsg: 'Approval pending' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid Password' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email, role: user.role },
      JWT_SECRECT,
      { expiresIn: '12h' }
    );

    res.status(200).json({
      token, role: user.role, username: user.username, email: user.email,
      message: 'ok',
    });
  } catch (error) {
    res.status(500).json({ message: 'fail' });
  }
};

const getOneUser = async (req, res) => {
  try {
    const { username } = req.body;

    const user = await User.findOne({ username });
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email, role: user.role },
      JWT_SECRECT,
      { expiresIn: '24h' }
    );
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserWithActive = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const userApprove = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOneAndUpdate(
      { email: email },
      { $set: { isActive: 'approved' } },
      { new: true }
    );

    if (user) {
      res.status(200).json({ message: 'User approved', user: user });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const userReject = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOneAndUpdate(
      { email: email },
      { $set: { isActive: 'pending' } },
      { new: true }
    );

    if (user) {
      res.status(200).json({ message: 'User pending', user: user });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { totalCount, register, login, getOneUser, userApprove, userReject, getUserWithActive };
