// controllers/userController.js
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const JWT_SECRECT = "ewf98we789ew7v897vdcsc()EF*E(^FE"


const getAllUsers = async (req, res) => {
  try {
    const { page, limit, search } = req.query;

    const query = {};
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
    };

    if (search !== undefined && search !== null && search !== "") {

      query.$or = [
        { username: { $regex: new RegExp(search, 'i') } },
        { role: { $regex: new RegExp(search, 'i') } },
        { email: { $regex: new RegExp(search, 'i') } },
      ];

    }

    const users = await User.paginate(query, options);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find({ 'role': 'admin' }, { password: 0 }); // Exclude the password field
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserUsers = async (req, res) => {
  try {
    const users = await User.find({ 'role': 'user' }, { password: 0 }); // Exclude the password field
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserFromToken = async (req, res) => {
  const { token } = req.body;

  try {
    const decodedToken = jwt.verify(token, JWT_SECRECT);
    const userEmail = decodedToken.email;

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ role: user.role });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};


module.exports = { getAllUsers, getAdminUsers, getUserUsers, getUserFromToken };
