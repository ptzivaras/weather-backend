const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

//handle POST/PUT requests with JSON.
app.use(express.json());

// defines a route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
