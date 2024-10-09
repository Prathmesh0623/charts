// Required modules
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/schema.js");

const app = express();
const MONGO_URL = "mongodb://127.0.0.1:27017/transaction";

// Setting up view engine and static files
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Connect to MongoDB
async function main() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connection established with database successfully");
    } catch (err) {
        console.error("Database connection error:", err);
    }
}

// Serve the index.html file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// API endpoint for bar chart data
app.get("/api/bar-chart", async (req, res) => {
    const { month } = req.query;
    
    try {
        // Fetch all listings
        const allLists = await Listing.find();

        // Initialize counts for each price range
        const priceRanges = {
            '0-100': 0,
            '101-200': 0,
            '201-300': 0,
            '301-400': 0,
            '401-500': 0,
            '501-600': 0,
            '601-700': 0,
            '701-800': 0,
            '801-900': 0,
            '901-above': 0,
        };

        // Loop through each listing
        allLists.forEach(list => {
            const saleMonth = new Date(list.dateOfSale).getMonth() + 1; // getMonth() is zero-based

            if (parseInt(month) === saleMonth) {
                if (list.price <= 100) {
                    priceRanges['0-100'] += 1;
                } else if (list.price <= 200) {
                    priceRanges['101-200'] += 1;
                } else if (list.price <= 300) {
                    priceRanges['201-300'] += 1;
                } else if (list.price <= 400) {
                    priceRanges['301-400'] += 1;
                } else if (list.price <= 500) {
                    priceRanges['401-500'] += 1;
                } else if (list.price <= 600) {
                    priceRanges['501-600'] += 1;
                } else if (list.price <= 700) {
                    priceRanges['601-700'] += 1;
                } else if (list.price <= 800) {
                    priceRanges['701-800'] += 1;
                } else if (list.price <= 900) {
                    priceRanges['801-900'] += 1;
                } else {
                    priceRanges['901-above'] += 1;
                }
            }
        });

        // Send the price ranges data as a JSON response
        res.json(priceRanges);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
app.get('/api/categories/:month', async (req, res) => {
    const month = req.params.month; // e.g., '2024-10'
    const startOfMonth = new Date(`${month}-01`);
    const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0);
  
    try {
      const categories = await .aggregate([
        {
          $match: {
            createdAt: {
              $gte: startOfMonth,
              $lt: endOfMonth,
            },
          },
        },
        {
          $group: {
            _id: '$category', // Group by category
            itemCount: { $sum: 1 }, // Count items in each category
          },
        },
        {
          $project: {
            _id: 0, // Exclude the default `_id` field
            category: '$_id', // Rename `_id` to `category`
            itemCount: 1, // Include the item count
          },
        },
      ]);
  
      res.json(categories);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

// Start the server
app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});

// Connect to MongoDB
main();
