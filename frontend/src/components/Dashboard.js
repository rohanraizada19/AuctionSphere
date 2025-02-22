import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/signin');
      return;
    }

    const fetchItems = async () => {
      try {
        const res = await axios.get('http://localhost:3001/auctions');
        setItems(res.data);
      } catch (error) {
        console.error('Error fetching auctions:', error);
      }
    };
    fetchItems();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Auction Dashboard</h2>

      <div className="d-flex justify-content-between">
        <h5>Active Auctions</h5>
        <Link to="/post-auction" className="btn btn-success">+ Post Auction</Link>
      </div>

      <div className="row mt-3">
        {items.length === 0 ? (
          <p className="text-muted text-center">No active auctions available.</p>
        ) : (
          items.map((item) => (
            <div key={item._id} className="col-md-4 mb-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{item.itemName}</h5>
                  <p className="card-text">Current Bid: <strong>${item.currentBid}</strong></p>
                  <Link to={`/auction/${item._id}`} className="btn btn-primary">View Auction</Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
