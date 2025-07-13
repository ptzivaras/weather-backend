const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const { fetchWeatherByCity } = require('../services/weather');

// Protected route: GET /api/weather?city=Athens
router.get('/', authenticateToken, async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: 'City is required as query parameter' });
  }

  try {
    const weatherData = await fetchWeatherByCity(city);
    res.json({ city, weather: weatherData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
