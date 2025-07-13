const axios = require('axios');

async function fetchWeatherByCity(city) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

  try {
    const response = await axios.get(baseUrl, {
      params: {
        q: city,
        appid: apiKey,
        units: 'metric' // or 'imperial'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Weather API error:', error.response?.data || error.message);
    throw new Error('Failed to fetch weather data');
  }
}

module.exports = { fetchWeatherByCity };
