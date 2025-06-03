import { config } from "dotenv";
config();
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
const app = express();

// const corsOptions = {
//   origin: "*",
//   methods: ["GET", "POST", "OPTIONS"],
//   credentials: true, // If you are sending cookies or authorization headers
// };

// app.use(cors(corsOptions)); // Apply CORS options to the entire app

app.use(cors());
app.use(express.json()); // Ensure JSON body parsing
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api", articleRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
