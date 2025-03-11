const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  email: { type: String, required: true },
  mobileNumber: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
