// controllers/barChartController.js

const axios = require('axios');
const Product = require('../models/Product');

// Fetch data from the third-party API and seed the database
exports.seedDatabase = async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const data = response.data;

        // Seed the database with modified schema fields
        await Product.insertMany(data);
        res.status(200).send('Database seeded successfully.');
    } catch (error) {
        res.status(500).json({ message: 'Error seeding the database', error });
    }
};

// Get bar chart data for the selected month
exports.getBarChartData = async (req, res) => {
    const { month } = req.query;

    try {
        // Find all transactions for the given month regardless of the year
        const products = await Product.aggregate([
            {
                $project: {
                    price: 1,
                    month: { $month: "$dateOfSale" }
                }
            },
            {
                $match: { month: parseInt(month) }
            }
        ]);

        // Define price ranges
        const ranges = {
            '0-100': 0,
            '101-200': 0,
            '201-300': 0,
            '301-400': 0,
            '401-500': 0,
            '501-600': 0,
            '601-700': 0,
            '701-800': 0,
            '801-900': 0,
            '901-above': 0
        };

        // Count the number of items in each price range
        products.forEach(product => {
            const price = product.price;

            if (price <= 100) ranges['0-100']++;
            else if (price <= 200) ranges['101-200']++;
            else if (price <= 300) ranges['201-300']++;
            else if (price <= 400) ranges['301-400']++;
            else if (price <= 500) ranges['401-500']++;
            else if (price <= 600) ranges['501-600']++;
            else if (price <= 700) ranges['601-700']++;
            else if (price <= 800) ranges['701-800']++;
            else if (price <= 900) ranges['801-900']++;
            else ranges['901-above']++;
        });

        res.status(200).json(ranges);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bar chart data', error });
    }
};
