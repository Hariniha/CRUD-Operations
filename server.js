require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// Routes
app.use('/users', userRoutes);
app.use('/events', eventRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
