import React from 'react';
import StockSearch from '../components/Stocksearch';
import NewsFeed from '../components/Newsfeed';
import Indexcharts from '../components/Indexcharts';

const Home = () => {
  return (
    <div className="home">
      <StockSearch />
      <Indexcharts />
      <NewsFeed />
      {/* You can also add other components, like news feeds, here */}
    </div>
  );
};

export default Home;