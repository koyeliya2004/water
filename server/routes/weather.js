const express = require('express');
const router = express.Router();
const axios = require('axios');

// Historical and predictive weather data
const weatherData = {
  // Mock data for demonstration - in production, integrate with OpenWeather/IBM APIs
  getForecast: (lat, lon) => {
    const days = 7;
    const forecast = [];
    const baseRainfall = 10; // mm
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const probability = Math.random();
      forecast.push({
        date: date.toISOString().split('T')[0],
        rainfallProbability: Math.round(probability * 100),
        expectedRainfall: probability > 0.3 ? Math.round(baseRainfall * Math.random() * 10) : 0,
        temperature: { min: 22, max: 35 },
        humidity: Math.round(60 + Math.random() * 30)
      });
    }
    return forecast;
  }
};

// POST /api/weather/forecast
router.post('/forecast', async (req, res) => {
  try {
    const { latitude, longitude, roofArea, runoffCoefficient } = req.body;
    
    const forecast = weatherData.getForecast(latitude, longitude);
    
    // Calculate harvest potential for each day
    const harvestForecast = forecast.map(day => ({
      ...day,
      harvestPotential: day.expectedRainfall > 0 
        ? Math.round(roofArea * day.expectedRainfall * runoffCoefficient / 1000)
        : 0
    }));

    const totalExpectedHarvest = harvestForecast.reduce((sum, day) => sum + day.harvestPotential, 0);

    res.json({
      success: true,
      data: {
        location: { latitude, longitude },
        forecast: harvestForecast,
        summary: {
          totalExpectedHarvest,
          rainyDays: harvestForecast.filter(d => d.expectedRainfall > 0).length,
          unit: 'liters'
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/weather/historical
router.post('/historical', async (req, res) => {
  try {
    const { state } = req.body;
    
    // Generate 12 months of historical data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const historicalData = months.map((month, index) => {
      // Monsoon pattern simulation (Jun-Sep higher rainfall)
      let baseRainfall = 50;
      if (index >= 5 && index <= 8) baseRainfall = 300;
      else if (index === 4 || index === 9) baseRainfall = 150;
      
      return {
        month,
        averageRainfall: Math.round(baseRainfall + (Math.random() * 50 - 25)),
        rainyDays: Math.round(baseRainfall / 20),
        temperature: { min: 15, max: 40 }
      };
    });

    res.json({
      success: true,
      data: {
        state,
        yearlyTotal: historicalData.reduce((sum, m) => sum + m.averageRainfall, 0),
        monthlyData: historicalData
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/weather/current/:lat/:lon
router.get('/current/:lat/:lon', async (req, res) => {
  try {
    const { lat, lon } = req.params;
    
    // Mock current weather - in production, call OpenWeather API
    res.json({
      success: true,
      data: {
        temperature: 28,
        humidity: 65,
        rainfall: 0,
        rainfallProbability: 40,
        conditions: 'Partly Cloudy',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
