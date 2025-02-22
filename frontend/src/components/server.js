// filepath: /c:/Users/skull/OneDrive/Documents/mern/nj/AICTE-Internship-P2-Week1-main/src/components/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const { WebSocketServer } = require('ws');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = 'your_secret_key'; // Change this in production

// Middleware
app.use(express.json());
app.use(cors());

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// User Schema
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const User = mongoose.model('User', UserSchema);

// Auction Schema
const AuctionSchema = new mongoose.Schema({
  itemName: String,
  description: String,
  currentBid: { type: Number, default: 0 },
  highestBidder: { type: String, default: '' },
  isClosed: { type: Boolean, default: false },
  imageUrl: { type: String, default: '' },
});
const Auction = mongoose.model('Auction', AuctionSchema);

// 🔹 Signup Route
app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.json({ message: 'Signup successful!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// 🔹 Signin Route
app.post('/signin', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error during signin' });
  }
});

// 🔹 Post a New Auction
app.post('/auction', upload.single('image'), async (req, res) => {
  try {
    const { itemName, description, startingBid, closingTime, category } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    if (!itemName || !description || startingBid < 0) {
      return res.status(400).json({ message: 'Invalid auction details' });
    }

    const newAuction = new Auction({ itemName, description, currentBid: startingBid, closingTime, category, imageUrl });
    await newAuction.save();

    res.json({ message: 'Auction created successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error posting auction' });
  }
});

// 🔹 Get All Auctions
app.get('/auctions', async (req, res) => {
  try {
    const auctions = await Auction.find();
    res.json(auctions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching auctions' });
  }
});

// 🔹 Get a Single Auction
app.get('/auctions/:id', async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: 'Auction not found' });
    res.json(auction);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching auction item' });
  }
});

// 🔹 Place a Bid
app.post('/bid/:id', async (req, res) => {
  try {
    const { bid, username } = req.body;
    const auction = await Auction.findById(req.params.id);

    if (!auction) return res.status(404).json({ message: 'Auction not found' });

    if (bid <= auction.currentBid) {
      return res.status(400).json({ message: 'Bid must be higher than the current bid' });
    }

    auction.currentBid = bid;
    auction.highestBidder = username;
    await auction.save();

    res.json({ message: 'Bid placed successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error placing bid' });
  }
});

// 🔹 Catch-All Route for React (Only if using `BrowserRouter`)
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Start Server
const server = app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${3001}`));

// Set up WebSocket server
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws) => {
  console.log('New WebSocket connection');

  ws.on('message', (message) => {
    console.log('Received:', message);
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});