import React from 'react';
import StockSearch from '../components/StockSearch';

const Home = () => {
  return (
    <div className="home">
      <StockSearch />
      {/* You can also add other components, like news feeds, here */}
    </div>
  );
};

export default Home;