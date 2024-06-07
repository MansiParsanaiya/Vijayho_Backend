const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'] },
  isActive: { type: String, enum: ['pending', 'approved'], default: 'pending' },
  userType: { type: String, enum: ['student', 'employee'], default: null }
});

userSchema.plugin(mongoosePaginate);

const User = mongoose.model('user_users', userSchema);
module.exports = User;
