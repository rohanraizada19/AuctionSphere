import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function AuctionItem() {
  const { id } = useParams();
  const [item, setItem] = useState({});
  const [bid, setBid] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/auctions/${id}`);
        setItem(res.data);
      } catch (error) {
        setMessage('Error fetching auction item.');
      }
    };

    fetchItem();
  }, [id]);

  const handleBid = async () => {
    const username = prompt('Enter your username to place a bid:');
    if (bid <= item.currentBid) {
      setMessage('Bid must be higher than the current bid.');
      return;
    }

    try {
      const res = await axios.post(`http://localhost:3001/bid/${id}`, { bid, username });
      setMessage(res.data.message);
    } catch (error) {
      setMessage('Error placing bid.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-lg">
        <h2 className="text-center mb-4">{item.itemName}</h2>
        <p className="text-muted">{item.description}</p>
        <h5>Current Bid: <span className="text-success">${item.currentBid}</span></h5>
        <h6>Highest Bidder: {item.highestBidder || "No bids yet"}</h6>

        <div className="mt-3">
          <input
            type="number"
            className="form-control mb-2"
            value={bid}
            onChange={(e) => setBid(e.target.value)}
            placeholder="Enter your bid"
          />
          <button className="btn btn-primary w-100" onClick={handleBid}>Place Bid</button>
        </div>

        {message && <p className="alert alert-info mt-3">{message}</p>}
      </div>
    </div>
  );
}

export default AuctionItem;
