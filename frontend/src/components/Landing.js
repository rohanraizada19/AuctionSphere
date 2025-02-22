import React from "react";
import "./../App.css";  // Make sure to import CSS

const Landing = () => {
  return (
    <div className="landing-container">
      <h1>Welcome to AuctionSphere</h1>
      <p>The best place to buy and sell items through online auctions!</p>
      <a href="/dashboard" className="btn btn-primary mt-3">Explore Bids</a>
    </div>
  );
};

export default Landing;
