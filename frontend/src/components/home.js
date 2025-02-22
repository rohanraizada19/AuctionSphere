import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="container text-center mt-5">
      <h1>Discover. Learn. Enjoy.</h1>
      <p>Your platform for amazing auctions and deals!</p>
      <Link to="/dashboard" className="btn btn-primary mt-3">Explore Auctions</Link>
    </div>
  );
};

export default Home;
