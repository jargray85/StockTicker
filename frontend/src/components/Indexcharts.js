import React from 'react';
import Indexchart from './Indexchart';

const Indexcharts = () => {
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
      <Indexchart symbol="SPY" displayName="S&P 500" />
      <Indexchart symbol="DIA" displayName="Dow Jones" />
      <Indexchart symbol="QQQ" displayName="Nasdaq" />
    </div>
  );
};

export default Indexcharts;