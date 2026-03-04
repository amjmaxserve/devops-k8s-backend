const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(bodyParser.json());

app.use("/api", userRoutes);

app.get("/", (req, res) => {
  res.send("Backend API Running");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
