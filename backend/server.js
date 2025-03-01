const express = require("express");
const cors = require("cors");
const connectDB = require("./db/dbconnect");
const authRoutes = require("./routes/authRoutes");
const auctionRoutes = require("./routes/auctionRoutes");

const app = express();

app.use(express.json());
app.use(cors());

connectDB();

app.use("/auth", authRoutes);
app.use("/auction", auctionRoutes);

app.listen(5001, () => {
  console.log("Server is running on port 5001");
});
