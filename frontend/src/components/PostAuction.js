import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PostAuction() {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [startingBid, setStartingBid] = useState('');
  const [closingTime, setClosingTime] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/signin'); // Redirect if not authenticated
    }
  }, [navigate]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handlePostAuction = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('You must be signed in to post an auction.');
      navigate('/signin');
      return;
    }

    const formData = new FormData();
    formData.append('itemName', itemName);
    formData.append('description', description);
    formData.append('startingBid', startingBid);
    formData.append('closingTime', closingTime);
    formData.append('category', category);
    if (image) formData.append('image', image);

    try {
      await axios.post('http://localhost:3001/auction', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Auction item posted!');
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to post auction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-lg">
        <h2 className="text-center mb-4">Post New Auction</h2>
        {error && <p className="alert alert-danger">{error}</p>}
        
        <form onSubmit={handlePostAuction}>
          <div className="mb-3">
            <label className="form-label">Item Name</label>
            <input type="text" className="form-control" value={itemName} onChange={(e) => setItemName(e.target.value)} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Category</label>
            <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} required>
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Vehicles">Vehicles</option>
              <option value="Art">Art</option>
              <option value="Real Estate">Real Estate</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Starting Bid ($)</label>
            <input type="number" className="form-control" value={startingBid} onChange={(e) => setStartingBid(e.target.value)} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Auction Closing Date & Time</label>
            <input type="datetime-local" className="form-control" value={closingTime} onChange={(e) => setClosingTime(e.target.value)} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label">Upload Image</label>
            <input type="file" className="form-control" onChange={handleImageChange} accept="image/*" />
          </div>

          <button className="btn btn-primary w-100" type="submit" disabled={loading}>
            {loading ? 'Posting...' : 'Post Auction'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostAuction;
