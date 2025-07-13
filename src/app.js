const express = require('express');
const app = express();
const pool = require('./config/db');
const authRoutes = require('./routes/auth'); 

const PORT = process.env.PORT || 3000;

//handle POST/PUT requests with JSON.
app.use(express.json());

// defines a route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Test DB connection route
app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ connected: true, time: result.rows[0].now });
  } catch (err) {
    console.error('DB connection error:', err.message);
    res.status(500).json({ connected: false, error: err.message });
  }
});

// 👇 Register auth routes
app.use('/api/auth', authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
