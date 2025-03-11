const express = require('express');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');

const router = express.Router();
const app =express();

app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error

  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});


// Create User
router.post(
  '/create-user',
[
    body('username').notEmpty().withMessage('Username is required'),
    body('  dateOfBirth')
      .notEmpty().withMessage('Date of birth is required')
      .isISO8601().toDate().withMessage('Invalid date format'),
    body('email')
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid email format'),
    body('mobileNumber')
      .notEmpty().withMessage('Mobile number is required')
      .isMobilePhone().withMessage('Invalid mobile number'),
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check if the email or mobile number already exists
      const existingUser = await User.findOne({
        $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }]
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Email or Mobile Number already exists' });
      }

      const newUser = new User(req.body);
      await newUser.save();
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);
   

// Get All Users
router.get('/', async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(error);  
  }
});


// Get User by ID
const mongoose = require('mongoose');

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Update User
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete User
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
});


module.exports = router;
