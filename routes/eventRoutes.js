const express = require('express');
const Event = require('../models/event');
const { body, validationResult } = require('express-validator');


const router = express.Router();

// Create Event

router.post(
  '/create-event',
  [
    body('eventName').notEmpty().withMessage('Event name is required'),
    body('eventDate').notEmpty().withMessage('Event date is required').isISO8601().toDate().withMessage('Invalid date format'),
    body('location').notEmpty().withMessage('Location is required'),
    body('description').optional().isString().withMessage('Description must be a string'),
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newEvent = new Event(req.body);
      await newEvent.save();
      res.status(201).json(newEvent);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get All Events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Event
router.put('/:id', async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEvent) return res.status(404).json({ message: "Event not found" });
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Event
router.delete('/:id', async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ message: "Event not found" });
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;