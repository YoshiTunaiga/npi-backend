import express from "express";
import axios from "axios";
import dotenv from "dotenv";

const app = express();
const PORT = process.env.PORT || 3000;

/**
 *  cross-origin configuration
 *  prevents cross origin error and preflight error
 */
import cookieParser from "cookie-parser";
import cors from "cors";
const prodOrigins = [];
const devOrigin = ["http://localhost:5173"];
const allowedOrigins =
  process.env.NODE_ENV === "production" ? prodOrigins : devOrigin;

app.use(
  cors({
    origin: (origin, callback) => {
      if (process.env.NODE_ENV === "production") {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`${origin} not allowed by cors`));
        }
      } else {
        callback(null, true);
      }
    },
    optionsSuccessStatus: 200,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

/**
 * body-parser configuration for post and put requests
 * Allows server to receive data from the client
 * Middleware to parse JSON and use CORS
 */
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());

/* Routes
 * This route will be used by the frontend to fetch data from the NPI API
 */
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

export default app;
