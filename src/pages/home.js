import React from 'react';
import StockSearch from '../components/Stocksearch';
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