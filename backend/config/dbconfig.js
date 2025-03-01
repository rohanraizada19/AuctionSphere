require("dotenv").config(); // Load environment variables

module.exports = {
  MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/auctionDB",
  SECRET_KEY: process.env.SECRET_KEY || "default_secret_key",
};
