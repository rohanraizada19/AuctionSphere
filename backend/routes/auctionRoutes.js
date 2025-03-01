const express = require("express");
const AuctionItem = require("../models/auctions");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

// Create Auction Item (Protected)
router.post("/auction", authenticate, async (req, res) => {
  try {
    const { itemName, description, startingBid, closingTime } = req.body;

    if (!itemName || !description || !startingBid || !closingTime) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newItem = new AuctionItem({
      itemName,
      description,
      currentBid: startingBid,
      highestBidder: "",
      closingTime,
    });

    await newItem.save();
    res.status(201).json({ message: "Auction item created", item: newItem });
  } catch (error) {
    console.error("Auction Post Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get all auction items
router.get("/auctions", async (req, res) => {
  try {
    const auctions = await AuctionItem.find();
    res.json(auctions);
  } catch (error) {
    console.error("Fetching Auctions Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Bidding on an item (Protected)
router.post("/bid/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { bid } = req.body;
    const item = await AuctionItem.findById(id);

    if (!item) return res.status(404).json({ message: "Auction item not found" });
    if (item.isClosed) return res.status(400).json({ message: "Auction is closed" });

    if (bid > item.currentBid) {
      item.currentBid = bid;
      item.highestBidder = req.user.username;
      await item.save();
      res.json({ message: "Bid successful", item });
    } else {
      res.status(400).json({ message: "Bid too low" });
    }
  } catch (error) {
    console.error("Bidding Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
