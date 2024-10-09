// routes/api.js

const express = require('express');
const { seedDatabase, getBarChartData } = require('../controllers/barChartController');
const router = express.Router();

// Route to seed the database
router.get('/seed', seedDatabase);

// Route to get bar chart data
router.get('/bar-chart', getBarChartData);

module.exports = router;
