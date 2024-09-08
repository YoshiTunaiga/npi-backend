const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and use CORS
app.use(express.json());
app.use(cors());

// Route to fetch data from the NPI external API
app.get("/api/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch data from the external API
    const response = await axios.get(
      `https://npiregistry.cms.hhs.gov/api/?version=2.1&number=${id}`
    );
    const data = response.data;

    // Send data back to the frontend
    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching data from NPI API", error });
  }
});

// Start the server locally (not required for Vercel deployment)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
