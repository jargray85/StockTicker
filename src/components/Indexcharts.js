import React from 'react';
import Indexchart from './Indexchart';

const Indexcharts = () => {
  const API_KEY = process.env.REACT_APP_AV_API_KEY;
  return (
    <div 
      className="index-charts" 
      style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        gap: '1rem', 
        justifyContent: 'center', 
        marginTop: '2rem' 
      }}
    >
      <Indexchart symbol="SPY" displayName="S&P 500" apiKey={API_KEY} />
      <Indexchart symbol="DIA" displayName="Dow Jones" apiKey={API_KEY} />
      <Indexchart symbol="QQQ" displayName="Nasdaq" apiKey={API_KEY} />
    </div>
  );
};

export default Indexcharts;