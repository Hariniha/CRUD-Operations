const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  eventDate: { type: Date, required: true },
  location: { type: String, required: true },
  description: { type: String },
  
});

const Event = mongoose.model('Event', EventSchema);
module.exports = Event;
