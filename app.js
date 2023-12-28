const express = require("express");
const passport = require("passport");
const authRoutes = require("./app/routes/authRoutes");
const postRoutes = require("./app/routes/postRoutes");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config({ path: "./app/config/config.env" });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(passport.initialize());

// Connection to MongoDB
require("./app/config/db");

// Use routes
app.use("/auth", authRoutes);
app.use("/post", postRoutes);

// Starting server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
