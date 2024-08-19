// app.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const emailRoutes = require('./routes/emailRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Middleware
app.use(express.json());

const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', emailRoutes);
app.use('/api', paymentRoutes);
app.use("/api", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
