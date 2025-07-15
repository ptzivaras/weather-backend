const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authenticateToken = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Create new location
router.post(
  '/',
  authenticateToken,
  body('city').notEmpty().withMessage('City is required'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { city } = req.body;

    try {
      const result = await pool.query(
        'INSERT INTO locations (user_id, city) VALUES ($1, $2) RETURNING *',
        [req.user.userId, city]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      next(err);
    }
  }
);


// Get all user's locations
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM locations WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

// Get one location by ID
router.get('/:id', authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const result = await pool.query(
      'SELECT * FROM locations WHERE id = $1 AND user_id = $2',
      [id, req.user.userId]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Location not found' });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch location' });
  }
});

// Update location
router.put(
  '/:id',
  authenticateToken,
  body('city').notEmpty().withMessage('City is required'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { city } = req.body;
    const id = parseInt(req.params.id);

    try {
      const result = await pool.query(
        'UPDATE locations SET city = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
        [city, id, req.user.userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Location not found or unauthorized' });
      }

      res.json(result.rows[0]);
    } catch (err) {
      next(err);
    }
  }
);


// Delete location
router.delete('/:id', authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const result = await pool.query(
      'DELETE FROM locations WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.userId]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Location not found or unauthorized' });

    res.json({ message: 'Location deleted', location: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete location' });
  }
});

const { fetchWeatherByCity } = require('../services/weather');

// GET /api/locations/:id/weather
router.get('/:id/weather', authenticateToken, async (req, res) => {
  const locationId = parseInt(req.params.id);

  try {
    // Make sure this location belongs to the current user
    const result = await pool.query(
      'SELECT * FROM locations WHERE id = $1 AND user_id = $2',
      [locationId, req.user.userId]
    );

    const location = result.rows[0];
    if (!location) {
      return res.status(404).json({ error: 'Location not found or unauthorized' });
    }

    // Fetch weather for that location’s city
    const weather = await fetchWeatherByCity(location.city);
    res.json({
      city: location.city,
      weather
    });
  } catch (err) {
    console.error('Weather for saved location error:', err.message);
    res.status(500).json({ error: 'Failed to fetch weather for this location' });
  }
});


module.exports = router;
