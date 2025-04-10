import React from 'react';
import StockSearch from '../components/StockSearch';
import NewsFeed from '../components/Newsfeed';

const Home = () => {
  return (
    <div className="home">
      <StockSearch />
      <NewsFeed />
    </div>
  );
};

export default Home;